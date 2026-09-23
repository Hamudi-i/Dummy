"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { api, ApiWorkspaceInvite, ApiDocumentSnapshot } from "@/lib/api";

export type NotificationType = "INVITE" | "COMMENT" | "SYSTEM";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  user?: {
    name: string;
    avatar?: string;
    initials: string;
  };
  inviteDetails?: {
    workspaceId: string;
    workspaceName: string;
    role: "ADMIN" | "MEMBER";
    token: string;
  };
  actionUrl?: string;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  } catch {
    return "Recently";
  }
}

function getStoredIds(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function saveStoredIds(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

function mapInviteToNotification(inv: ApiWorkspaceInvite): NotificationItem {
  const inviterName = inv.invitedBy?.name || inv.invitedBy?.email?.split("@")[0] || "A collaborator";
  const initials = (inv.invitedBy?.name || inv.invitedBy?.email || "C")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase() || "CL";

  return {
    id: inv.id,
    type: "INVITE",
    title: "Workspace Invitation",
    message: `invited you to join as ${inv.role === "ADMIN" ? "an Admin" : "a Member"}`,
    timestamp: formatRelativeTime(inv.createdAt),
    read: false,
    user: {
      name: inviterName,
      avatar: inv.invitedBy?.avatarUrl || undefined,
      initials,
    },
    inviteDetails: {
      workspaceId: inv.workspaceId,
      workspaceName: inv.workspace?.name || "Workspace",
      role: (inv.role === "ADMIN" ? "ADMIN" : "MEMBER"),
      token: inv.token,
    },
    actionUrl: `/workspace/${inv.workspaceId}`,
  };
}

function mapSnapshotToNotification(snap: ApiDocumentSnapshot, readIds: Set<string>): NotificationItem {
  const creatorName = snap.createdBy?.name || snap.createdBy?.email?.split("@")[0] || "Collaborator";
  const initials = (snap.createdBy?.name || snap.createdBy?.email || "S")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase() || "SN";

  const docTitle = snap.document?.title || "Notebook";
  const notifId = `snapshot-${snap.id}`;

  return {
    id: notifId,
    type: "SYSTEM",
    title: "Snapshot Auto-Saved",
    message: snap.summary || `Version snapshot created for '${docTitle}'`,
    timestamp: formatRelativeTime(snap.createdAt),
    read: readIds.has(notifId),
    user: {
      name: creatorName,
      avatar: snap.createdBy?.avatarUrl || undefined,
      initials,
    },
    actionUrl: snap.document ? `/workspace/${snap.document.workspaceId}/notebook/${snap.document.id}` : undefined,
  };
}

let notificationsState: NotificationItem[] = [];
let isLoadingNotifications = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const notificationsStore = {
  getNotifications: () => notificationsState,
  getUnreadCount: () => notificationsState.filter((n) => !n.read).length,

  loadMyInvites: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token || isLoadingNotifications) return;

    isLoadingNotifications = true;
    try {
      const [invitesRes, snapshotsRes] = await Promise.allSettled([
        api.getMyInvites(),
        api.getRecentSnapshots(),
      ]);

      const readIds = getStoredIds("colab_read_notifications");
      const deletedIds = getStoredIds("colab_deleted_notifications");

      const items: NotificationItem[] = [];

      // Process invites
      if (invitesRes.status === "fulfilled" && Array.isArray(invitesRes.value)) {
        invitesRes.value.forEach((inv) => {
          if (!deletedIds.has(inv.id)) {
            items.push(mapInviteToNotification(inv));
          }
        });
      }

      // Process snapshots
      if (snapshotsRes.status === "fulfilled" && Array.isArray(snapshotsRes.value)) {
        snapshotsRes.value.forEach((snap) => {
          const notifId = `snapshot-${snap.id}`;
          if (!deletedIds.has(notifId)) {
            items.push(mapSnapshotToNotification(snap, readIds));
          }
        });
      }

      // Preserve any dynamic runtime-added notifications not covered above
      const dynamicItems = notificationsState.filter(
        (n) => !items.some((item) => item.id === n.id) && !deletedIds.has(n.id)
      );

      notificationsState = [...items, ...dynamicItems];
      notifyListeners();
    } catch {
      // Ignored if user not logged in or backend temporarily unreachable
    } finally {
      isLoadingNotifications = false;
    }
  },

  addNotification: (item: Omit<NotificationItem, "id" | "timestamp"> & { id?: string; timestamp?: string }) => {
    const newItem: NotificationItem = {
      id: item.id || `notif-${Date.now()}`,
      timestamp: item.timestamp || "Just now",
      ...item,
    };
    notificationsState = [newItem, ...notificationsState];
    notifyListeners();
  },

  markAsRead: (id: string) => {
    notificationsState = notificationsState.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    const readIds = getStoredIds("colab_read_notifications");
    readIds.add(id);
    saveStoredIds("colab_read_notifications", readIds);
    notifyListeners();
  },

  markAllAsRead: () => {
    notificationsState = notificationsState.map((n) => ({ ...n, read: true }));
    const readIds = getStoredIds("colab_read_notifications");
    notificationsState.forEach((n) => readIds.add(n.id));
    saveStoredIds("colab_read_notifications", readIds);
    notifyListeners();
    toast.success("All notifications marked as read");
  },

  acceptInvite: async (id: string) => {
    const item = notificationsState.find((n) => n.id === id);
    if (!item) return;

    if (item.inviteDetails) {
      try {
        await api.acceptWorkspaceInvite(item.inviteDetails.token);
        toast.success("Invite Accepted!", {
          description: `You are now a member of "${item.inviteDetails.workspaceName}".`,
        });

        // Trigger global workspace refresh
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("workspace-joined", {
              detail: { workspaceId: item.inviteDetails.workspaceId },
            })
          );
        }
      } catch (error: any) {
        toast.error("Could not accept invite", {
          description: error?.message || "Please try again later.",
        });
        return;
      }
    }

    notificationsState = notificationsState.filter((n) => n.id !== id);
    notifyListeners();
  },

  declineInvite: async (id: string) => {
    const item = notificationsState.find((n) => n.id === id);
    if (!item) return;

    if (item.inviteDetails) {
      try {
        await api.declineWorkspaceInvite(item.inviteDetails.token);
        toast.info("Invite Declined", {
          description: `Declined invitation to "${item.inviteDetails.workspaceName}".`,
        });
      } catch (error: any) {
        toast.error("Could not decline invite", {
          description: error?.message || "Please try again later.",
        });
        return;
      }
    }

    notificationsState = notificationsState.filter((n) => n.id !== id);
    notifyListeners();
  },

  deleteNotification: (id: string) => {
    notificationsState = notificationsState.filter((n) => n.id !== id);
    const deletedIds = getStoredIds("colab_deleted_notifications");
    deletedIds.add(id);
    saveStoredIds("colab_deleted_notifications", deletedIds);
    notifyListeners();
    toast.success("Notification deleted");
  },

  deleteAllNotifications: () => {
    const deletedIds = getStoredIds("colab_deleted_notifications");
    notificationsState.forEach((n) => deletedIds.add(n.id));
    saveStoredIds("colab_deleted_notifications", deletedIds);
    notificationsState = [];
    notifyListeners();
    toast.success("All notifications deleted");
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationsStore.getNotifications()
  );

  const refreshInvites = useCallback(() => {
    notificationsStore.loadMyInvites();
  }, []);

  useEffect(() => {
    refreshInvites();

    const unsubscribe = notificationsStore.subscribe(() => {
      setNotifications([...notificationsStore.getNotifications()]);
    });

    const handleFocus = () => refreshInvites();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus);
    }

    return () => {
      unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleFocus);
      }
    };
  }, [refreshInvites]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    refreshInvites,
    markAsRead: notificationsStore.markAsRead,
    markAllAsRead: notificationsStore.markAllAsRead,
    acceptInvite: notificationsStore.acceptInvite,
    declineInvite: notificationsStore.declineInvite,
    deleteNotification: notificationsStore.deleteNotification,
    deleteAllNotifications: notificationsStore.deleteAllNotifications,
  };
}

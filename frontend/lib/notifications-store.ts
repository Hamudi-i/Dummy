"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "INVITE",
    title: "Workspace Invitation",
    message: "invited you to join as a Member",
    timestamp: "10 mins ago",
    read: false,
    user: {
      name: "Sarah Chen",
      initials: "SC",
    },
    inviteDetails: {
      workspaceId: "ws-design-system",
      workspaceName: "Design System & Components",
      role: "MEMBER",
      token: "inv-token-9912",
    },
  },
  {
    id: "notif-2",
    type: "COMMENT",
    title: "Document Activity",
    message: "added new notes & feedback to 'Q3 Product Roadmap & Architecture'",
    timestamp: "1 hour ago",
    read: false,
    user: {
      name: "Alex Rivera",
      initials: "AR",
    },
    actionUrl: "/workspace",
  },
  {
    id: "notif-3",
    type: "INVITE",
    title: "Workspace Invitation",
    message: "invited you as an Admin",
    timestamp: "3 hours ago",
    read: false,
    user: {
      name: "Marcus Vance",
      initials: "MV",
    },
    inviteDetails: {
      workspaceId: "ws-mobile-redesign",
      workspaceName: "Mobile App Redesign",
      role: "ADMIN",
      token: "inv-token-8841",
    },
  },
  {
    id: "notif-4",
    type: "COMMENT",
    title: "New Comment",
    message: "commented on 'Database Schema & CRDT Sync': 'Looks clean! Added indexing strategy.'",
    timestamp: "Yesterday",
    read: true,
    user: {
      name: "Elena Rostova",
      initials: "ER",
    },
    actionUrl: "/drafts",
  },
  {
    id: "notif-5",
    type: "SYSTEM",
    title: "Snapshot Auto-Saved",
    message: "Version snapshot v1.4 created for 'Q3 Product Roadmap'",
    timestamp: "2 days ago",
    read: true,
  },
];

let notificationsState: NotificationItem[] = INITIAL_NOTIFICATIONS;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const notificationsStore = {
  getNotifications: () => notificationsState,
  getUnreadCount: () => notificationsState.filter((n) => !n.read).length,
  
  markAsRead: (id: string) => {
    notificationsState = notificationsState.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    notifyListeners();
  },

  markAllAsRead: () => {
    notificationsState = notificationsState.map((n) => ({ ...n, read: true }));
    notifyListeners();
    toast.success("All notifications marked as read");
  },

  acceptInvite: (id: string) => {
    const item = notificationsState.find((n) => n.id === id);
    if (item && item.inviteDetails) {
      toast.success("Invite Accepted!", {
        description: `You are now a member of "${item.inviteDetails.workspaceName}".`,
      });
    }
    notificationsState = notificationsState.filter((n) => n.id !== id);
    notifyListeners();
  },

  declineInvite: (id: string) => {
    const item = notificationsState.find((n) => n.id === id);
    if (item && item.inviteDetails) {
      toast.info("Invite Declined", {
        description: `Declined invitation to "${item.inviteDetails.workspaceName}".`,
      });
    }
    notificationsState = notificationsState.filter((n) => n.id !== id);
    notifyListeners();
  },

  deleteNotification: (id: string) => {
    notificationsState = notificationsState.filter((n) => n.id !== id);
    notifyListeners();
    toast.success("Notification deleted");
  },

  deleteAllNotifications: () => {
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

  useEffect(() => {
    const unsubscribe = notificationsStore.subscribe(() => {
      setNotifications([...notificationsStore.getNotifications()]);
    });
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead: notificationsStore.markAsRead,
    markAllAsRead: notificationsStore.markAllAsRead,
    acceptInvite: notificationsStore.acceptInvite,
    declineInvite: notificationsStore.declineInvite,
    deleteNotification: notificationsStore.deleteNotification,
    deleteAllNotifications: notificationsStore.deleteAllNotifications,
  };
}

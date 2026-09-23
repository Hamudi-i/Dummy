"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Bell,
  X,
  CheckCheck,
  UserPlus,
  MessageSquare,
  Sparkles,
  Check,
  Trash2,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  useNotifications,
  NotificationItem,
  NotificationType,
} from "@/lib/notifications-store";

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "INVITES" | "ACTIVITY">("ALL");

  // Verification states
  const [confirmAction, setConfirmAction] = useState<"MARK_ALL_READ" | "DELETE_ALL" | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    refreshInvites,
    markAsRead,
    markAllAsRead,
    acceptInvite,
    declineInvite,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshInvites();
    }
  }, [isOpen, refreshInvites]);

  if (!isOpen || !mounted) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "INVITES") return n.type === "INVITE";
    if (activeTab === "ACTIVITY") return n.type !== "INVITE";
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "INVITE":
        return <UserPlus className="w-4 h-4 text-[#2c5e91]" />;
      case "COMMENT":
        return <MessageSquare className="w-4 h-4 text-[#e67e22]" />;
      case "SYSTEM":
        return <Sparkles className="w-4 h-4 text-[#27ae60]" />;
      default:
        return <Bell className="w-4 h-4 text-[#30312C]" />;
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === "MARK_ALL_READ") {
      markAllAsRead();
    } else if (confirmAction === "DELETE_ALL") {
      deleteAllNotifications();
    }
    setConfirmAction(null);
  };

  const handleConfirmDeleteSingle = (id: string) => {
    deleteNotification(id);
    setDeleteTargetId(null);
  };

  return createPortal(
    <div
      onClick={() => {
        setConfirmAction(null);
        setDeleteTargetId(null);
        onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-6 sm:p-7 shadow-[8px_8px_0px_#30312C] space-y-4 text-[#30312C] animate-scaleIn flex flex-col max-h-[85vh]"
      >
        {/* Tilted Top Tape Accent */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[110px] h-[24px] bg-white/70 border border-black/15 shadow-xs pointer-events-none rounded-xs backdrop-blur-[0.5px] z-20"
          style={{ transform: "translateX(-50%) rotate(-2deg)" }}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-1 pt-1 border-b border-[#30312C]/15">
          <div className="flex items-center space-x-3">
            <div className="relative p-2.5 bg-[#2c5e91] text-white rounded-2xl border border-[#30312C] shadow-[2px_2px_0px_#30312C]">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#e74c3c] text-white text-[10px] font-header font-black px-1.5 py-0.5 rounded-full border border-[#30312C] shadow-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-header text-xl font-extrabold text-[#30312C] leading-tight">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#2c5e91]/15 text-[#2c5e91] font-header font-bold text-xs rounded-full border border-[#2c5e91]/30">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-[#737067]">
                Workspace invites and activity updates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 text-[#30312C] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Banner (If action triggered) */}
        {confirmAction && (
          <div className="p-3 bg-[#FEF3C7] border-1.5 border-[#D97706] rounded-2xl flex items-center justify-between space-x-3 animate-fadeIn shadow-xs">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
              <span className="font-header font-bold text-xs text-[#92400E]">
                {confirmAction === "MARK_ALL_READ"
                  ? "Mark all notifications as read?"
                  : "Delete ALL notifications?"}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-3 py-1 bg-[#D97706] hover:bg-[#B45309] text-white font-header font-bold text-xs rounded-xl border border-[#78350F] shadow-xs cursor-pointer transition-all"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-[#78350F] font-header font-bold text-xs rounded-xl border border-[#D97706]/40 cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs & Action Buttons Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-[#30312C]/20 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-xl font-header font-bold text-xs transition-all cursor-pointer ${activeTab === "ALL"
                ? "bg-[#2c5e91] text-white shadow-[1px_1px_0px_#30312C]"
                : "text-[#737067] hover:text-[#30312C] hover:bg-neutral-100"
                }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("INVITES")}
              className={`px-3 py-1.5 rounded-xl font-header font-bold text-xs transition-all cursor-pointer flex items-center space-x-1 ${activeTab === "INVITES"
                ? "bg-[#2c5e91] text-white shadow-[1px_1px_0px_#30312C]"
                : "text-[#737067] hover:text-[#30312C] hover:bg-neutral-100"
                }`}
            >
              <span>Invites</span>
              {notifications.filter((n) => n.type === "INVITE" && !n.read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#e74c3c]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ACTIVITY")}
              className={`px-3 py-1.5 rounded-xl font-header font-bold text-xs transition-all cursor-pointer ${activeTab === "ACTIVITY"
                ? "bg-[#2c5e91] text-white shadow-[1px_1px_0px_#30312C]"
                : "text-[#737067] hover:text-[#30312C] hover:bg-neutral-100"
                }`}
            >
              Activity
            </button>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setConfirmAction("MARK_ALL_READ")}
                className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 text-[#30312C] font-header font-bold text-[11px] rounded-xl border border-[#30312C]/30 shadow-xs flex items-center space-x-1 cursor-pointer transition-all"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#2c5e91]" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmAction("DELETE_ALL")}
                className="p-1.5 bg-white hover:bg-red-50 text-[#737067] hover:text-red-600 rounded-xl border border-[#30312C]/30 shadow-xs cursor-pointer transition-all"
                title="Delete all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[260px] max-h-[420px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-white/60 rounded-3xl border border-dashed border-[#30312C]/20 p-6">
              <div className="p-3 bg-[#F0F5FA] text-[#2c5e91] rounded-2xl border border-[#30312C]/20 shadow-xs">
                <Bell className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="font-header font-bold text-sm text-[#30312C]">
                  All caught up!
                </p>
                <p className="font-body text-xs text-[#737067]">
                  No notifications right now.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`relative p-4 rounded-2xl border-1.5 transition-all cursor-pointer group ${notif.read
                  ? "bg-white/80 border-[#30312C]/20 hover:border-[#30312C]/40"
                  : "bg-[#F0F5FA] border-[#2c5e91]/60 shadow-[2px_2px_0px_#2c5e91]"
                  }`}
              >
                {/* Unread Blue Pill Indicator */}
                {!notif.read && (
                  <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#2c5e91] ring-4 ring-[#2c5e91]/20 animate-pulse" />
                )}

                <div className="flex items-start space-x-3">
                  {/* User Avatar or Type Icon */}
                  <div className="relative shrink-0">
                    {notif.user ? (
                      <div className="w-9 h-9 rounded-full bg-[#2c5e91] text-white font-header font-extrabold text-xs flex items-center justify-center border border-[#30312C] shadow-xs">
                        {notif.user.initials}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-2xl bg-white border border-[#30312C] flex items-center justify-center shadow-xs">
                        {getNotificationIcon(notif.type)}
                      </div>
                    )}
                    {notif.user && (
                      <span className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full border border-[#30312C] shadow-xs">
                        {getNotificationIcon(notif.type)}
                      </span>
                    )}
                  </div>

                  {/* Content & Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-header font-extrabold text-xs text-[#30312C]">
                          {notif.title}
                        </span>
                        <span className="font-body text-[11px] text-[#8E8B82]">
                          • {notif.timestamp}
                        </span>
                      </div>

                      {/* Single Item Delete Verification Trigger */}
                      {deleteTargetId === notif.id ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-1 bg-red-50 p-1 rounded-lg border border-red-200"
                        >
                          <button
                            type="button"
                            onClick={() => handleConfirmDeleteSingle(notif.id)}
                            className="px-1.5 py-0.5 bg-red-600 text-white font-header font-bold text-[10px] rounded cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(null)}
                            className="px-1.5 py-0.5 bg-white text-neutral-600 font-header font-bold text-[10px] rounded border border-neutral-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#8E8B82] hover:text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="font-body text-xs text-[#30312C]/90 mt-0.5 leading-relaxed">
                      {notif.user && (
                        <strong className="font-semibold text-[#2c5e91]">
                          {notif.user.name}{" "}
                        </strong>
                      )}
                      {notif.message}
                    </p>

                    {/* Workspace Invite Card Action */}
                    {notif.type === "INVITE" && notif.inviteDetails && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-[#30312C]/25 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="px-2 py-0.5 bg-[#FAF7EE] text-[#30312C] font-header font-bold text-[10px] rounded-lg border border-[#30312C]/20">
                              {notif.inviteDetails.role}
                            </span>
                            <span className="font-header font-bold text-xs text-[#30312C] truncate">
                              {notif.inviteDetails.workspaceName}
                            </span>
                          </div>
                        </div>

                        {/* Accept / Decline Action Buttons */}
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptInvite(notif.id);
                            }}
                            className="flex-1 py-1.5 bg-[#2c5e91] hover:bg-[#20466e] text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              declineInvite(notif.id);
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-[#737067] hover:text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C]/40 shadow-xs transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Navigation Link */}
                    {notif.actionUrl && (
                      <div className="mt-2">
                        <Link
                          href={notif.actionUrl}
                          onClick={onClose}
                          className="inline-flex items-center space-x-1 font-header font-bold text-[11px] text-[#2c5e91] hover:underline"
                        >
                          <span>View item</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

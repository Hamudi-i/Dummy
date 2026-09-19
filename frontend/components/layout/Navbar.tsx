"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Book, Bell } from "lucide-react";
import { useUserProfile, UserProfile } from "@/lib/user-store";
import { useNotifications } from "@/lib/notifications-store";
import { NotificationsModal } from "@/components/modals/NotificationsModal";

interface NavbarProps {
  onSearch?: (query: string) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  profileOverride?: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  isSidebarOpen = true,
  onToggleSidebar,
  profileOverride,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const { profile: storeProfile } = useUserProfile();
  const profile = profileOverride || storeProfile;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="w-full h-[74px] bg-accent-light rounded-b-[80px] px-8 sm:px-12 md:px-16 flex items-center justify-between z-30 shadow-[0_6px_20px_rgba(48,49,44,0.12)] select-none">
      {/* Left: Retractable Lucide Book Icon + CO-LAB Logo */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Retractable Sidebar Toggle Button (Smooth Black & White Lucide Icon) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex items-center justify-center p-2 rounded-xl text-[#30312C] hover:bg-[#30312C]/10 hover:text-black active:scale-95 transition-all cursor-pointer group"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? (
            <BookOpen className="w-6 h-6 stroke-[2] transition-transform group-hover:scale-105" />
          ) : (
            <Book className="w-6 h-6 stroke-[2] transition-transform group-hover:scale-105" />
          )}
        </button>

        {/* CO-LAB Logo Image (Larger & Moved Up) */}
        <Link href="/workspace" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CO-LAB Logo"
            width={230}
            height={68}
            className="h-14 sm:h-[58px] md:h-[64px] -mt-1 sm:-mt-2 w-auto object-contain transition-transform hover:scale-105"
            priority
          />
        </Link>
      </div>

      {/* Right: Docs, Team, Search Bar, Profile Icon */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Docs Link */}
        <Link
          href="/help"
          className="flex items-center space-x-1.5 font-header text-[#30312C] text-[14px] sm:text-[15px] font-bold hover:text-[#2c5e91] transition-colors group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            className="group-hover:scale-110 transition-transform"
          >
            <path
              d="M 3 3.5 C 3 2.5 4 2 5.5 2 L 14 2 C 15 2 15.5 2.5 15.5 3.5 L 15.5 14.5 C 15.5 15.5 14.5 16 13.5 16 L 5.5 16 C 4 16 3 15 3 14 Z"
              fill="#2c5e91"
              stroke="#30312C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 5.5 2 L 5.5 16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
            <path d="M 8 6 L 13 6 M 8 9 L 13 9 M 8 12 L 11 12" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span className="inline font-bold">Docs</span>
        </Link>

        {/* Team Link */}
        <Link
          href="/workspace"
          className="flex items-center space-x-1.5 font-header text-[#30312C] text-[14px] sm:text-[15px] font-bold hover:text-[#2c5e91] transition-colors group"
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            className="group-hover:scale-110 transition-transform"
          >
            <circle cx="7" cy="6" r="2.8" fill="#FAF7EE" stroke="#30312C" strokeWidth="1.3" />
            <path
              d="M 2.5 15 C 2.5 11.8 4.5 10.5 7 10.5 C 9.5 10.5 11.5 11.8 11.5 15"
              fill="#FAF7EE"
              stroke="#30312C"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <circle cx="13" cy="5.5" r="2.3" fill="#FAF7EE" stroke="#30312C" strokeWidth="1.2" />
            <path
              d="M 11 10.2 C 12 9.8 13.2 9.8 14.2 10.2 C 15.5 10.8 16.5 12 16.5 14.5"
              stroke="#30312C"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="inline font-bold">Team</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-[120px] sm:w-[160px] md:w-[190px] h-[36px] pl-8 pr-3 py-1 font-body text-[13.5px] bg-[#FFFFFF] text-[#30312C] placeholder-[#8E8B82] rounded-full border border-[#30312C]/25 focus:outline-none focus:ring-1.5 focus:ring-[#2c5e91] focus:border-[#2c5e91] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="absolute left-2.5 text-[#30312C] pointer-events-none"
          >
            <circle cx="6.5" cy="6.5" r="4.5" stroke="#30312C" strokeWidth="1.5" />
            <path d="M 10 10 L 14.5 14.5" stroke="#30312C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </form>

        {/* Notification Bell Icon Button with Vibrant Blue Badge */}
        <button
          type="button"
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-10 h-10 rounded-full border-1.5 border-[#30312C] bg-white text-[#30312C] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_2px_0px_#30312C] cursor-pointer group"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#30312C] transition-transform group-hover:rotate-12" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#2c5e91] text-white text-[11px] font-header font-black rounded-full border-1.5 border-[#30312C] flex items-center justify-center shadow-[1px_1px_0px_#30312C] animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Circular Profile Icon */}
        <Link
          href="/settings"
          className="relative w-10 h-10 rounded-full border-1.5 border-[#30312C] bg-[#2c5e91] text-white overflow-hidden flex items-center justify-center hover:scale-105 transition-transform shadow-[0_2px_0px_#30312C]"
          title="Profile & Settings"
        >
          {profile.profilePic ? (
            <img
              src={profile.profilePic}
              alt={profile.fullName || "User Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-header font-extrabold text-base">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </Link>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </header>
  );
};

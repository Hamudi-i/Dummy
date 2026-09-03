"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const mainNavItems = [
    {
      name: "Workspace",
      href: "/workspace",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="2"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
          />
          <rect
            x="13"
            y="3"
            width="8"
            height="8"
            rx="2"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
          />
          <rect
            x="3"
            y="13"
            width="8"
            height="8"
            rx="2"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
          />
          <rect
            x="13"
            y="13"
            width="8"
            height="8"
            rx="2"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
          />
        </svg>
      ),
    },
    {
      name: "Notebooks",
      href: "/notebooks",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 4 4 C 4 3 5 2.5 6.5 2.5 L 18 2.5 C 19.5 2.5 20 3 20 4 L 20 20 C 20 21 19.5 21.5 18 21.5 L 6.5 21.5 C 5 21.5 4 21 4 20 Z"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M 7.5 2.5 L 7.5 21.5" stroke="#30312C" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M 10 7 L 17 7 M 10 11 L 17 11 M 10 15 L 14 15" stroke={active ? "#ffffff" : "#30312C"} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Drafts",
      href: "/drafts",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 16.5 3.5 L 20.5 7.5 L 9.5 18.5 L 5.5 18.5 L 5.5 14.5 Z"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M 14 6 L 18 10" stroke="#30312C" strokeWidth="1.4" />
          <path d="M 4 21 L 20 21" stroke="#30312C" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Archive",
      href: "/archive",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 4 4 L 20 4 L 20 9 L 4 9 Z"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M 5 9 L 5 20 C 5 21 6 21.5 7 21.5 L 17 21.5 C 18 21.5 19 21 19 20 L 19 9"
            fill={active ? "#2c5e91" : "#FAF7EE"}
            stroke="#30312C"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M 10 13 L 14 13" stroke={active ? "#ffffff" : "#30312C"} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const bottomNavItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" fill={active ? "#2c5e91" : "#FAF7EE"} stroke="#30312C" strokeWidth="1.6" />
          <path
            d="M 12 2 L 12 4 M 12 20 L 12 22 M 2 12 L 4 12 M 20 12 L 22 12 M 4.9 4.9 L 6.3 6.3 M 17.7 17.7 L 19.1 19.1 M 4.9 19.1 L 6.3 17.7 M 17.7 6.3 L 19.1 4.9"
            stroke="#30312C"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      name: "Help",
      href: "/help",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" fill={active ? "#2c5e91" : "#FAF7EE"} stroke="#30312C" strokeWidth="1.6" />
          <path d="M 9.5 9 C 9.5 7.5 10.5 6.5 12 6.5 C 13.5 6.5 14.5 7.5 14.5 9 C 14.5 11 12 11.5 12 13.5" stroke={active ? "#ffffff" : "#30312C"} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill={active ? "#ffffff" : "#30312C"} />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed top-0 left-0 w-[256px] h-screen bg-sidebar-bg border-r border-[#30312C]/20 flex flex-col justify-between pt-[96px] pb-6 px-4 shrink-0 select-none shadow-[6px_0_24px_rgba(48,49,44,0.09),2px_0_6px_rgba(0,0,0,0.04)] z-20 overflow-y-auto">
      {/* Top Section */}
      <div className="flex flex-col items-center w-full">
        {/* Profile Circle & Info (Tight Psychological Grouping) */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#30312C] bg-accent overflow-hidden p-0.5 shadow-[2px_2px_0px_#30312C]">
            <Image
              src="/fox.png"
              alt="My Studio Profile"
              width={64}
              height={64}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="font-header text-[20.5px] font-extrabold text-[#30312C] mt-3 leading-tight tracking-tight">
            My studio
          </h2>
          <span className="font-body text-[13.5px] italic font-medium text-[#66645e] mt-0.5">
            creative space
          </span>
        </div>

        {/* + New Sketch Button (Distinct Section Gap) */}
        <div className="w-full flex justify-center mb-7">
          <button
            type="button"
            className="group h-[55px] w-[210px] bg-accent hover:bg-accent-hover text-[#45473e]/90 font-header font-bold text-[21px] tracking-wide rounded-full px-5 gap-2.5 flex items-center justify-center transition-all active:translate-y-[1px] cursor-pointer shadow-none"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="group-hover:rotate-[360deg] transition-transform duration-800 ease-in-out shrink-0"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Sketch</span>
          </button>
        </div>

        {/* Pages Links (Structured Spacing) */}
        <nav className="w-full space-y-2 px-0.5">
          {mainNavItems.map((item) => {
            const isActive =
              item.href === "/workspace"
                ? pathname === "/workspace" || pathname === "/" || (pathname.startsWith("/workspace") && !pathname.includes("/notebook/"))
                : item.href === "/notebooks"
                ? pathname.startsWith("/notebooks") || pathname.includes("/notebook/")
                : pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[15.5px] font-body font-semibold transition-all border-1.5 ${
                  isActive
                    ? "bg-primary text-white shadow-[2px_2px_0px_#30312C] border-[#30312C]"
                    : "text-[#30312C] border-transparent hover:bg-[#e4e0d5] hover:border-[#30312C] hover:shadow-[2px_2px_0px_#30312C] hover:translate-x-0.5"
                }`}
              >
                <div className="shrink-0">{item.icon(isActive)}</div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Far Bottom Section (Separated Anchor Group) */}
      <div className="w-full px-0.5 pt-4">
        <hr className="border-t-1.5 border-[#30312C]/20 mb-3.5" />
        <nav className="space-y-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[15.5px] font-body font-semibold transition-all border-1.5 ${
                  isActive
                    ? "bg-primary text-white shadow-[2px_2px_0px_#30312C] border-[#30312C]"
                    : "text-[#30312C] border-transparent hover:bg-[#e4e0d5] hover:border-[#30312C] hover:shadow-[2px_2px_0px_#30312C] hover:translate-x-0.5"
                }`}
              >
                <div className="shrink-0">{item.icon(isActive)}</div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

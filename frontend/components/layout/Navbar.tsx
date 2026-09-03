"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="w-full h-[74px] bg-[#fcf8ef] border-b-2 border-[#30312C] rounded-b-2xl px-4 sm:px-6 flex items-center justify-between z-30 shadow-[0_2px_4px_rgba(0,0,0,0.03)] select-none">
      {/* Left: Book SVG (#2c5e91) + CO-LAB Logo */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notebook / Book SVG */}
        <Link href="/workspace" className="flex items-center group">
          <svg
            width="36"
            height="28"
            viewBox="0 0 38 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform"
          >
            {/* Book Spine Shadow */}
            <path
              d="M 19 24 C 14 21 8 21 2 23 L 3 7 C 9 5 14 6 19 9 Z"
              fill="#2c5e91"
              stroke="#30312C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 19 24 C 24 21 30 21 36 23 L 35 7 C 29 5 24 6 19 9 Z"
              fill="#2c5e91"
              stroke="#30312C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center Spine */}
            <path
              d="M 19 9 L 19 25"
              stroke="#1a3b5c"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Left/Right Page Markings */}
            <path
              d="M 6 11 C 10 10 14 10.5 17 12.5 M 6 15 C 10 14 14 14.5 17 16.5 M 6 19 C 10 18 14 18.5 17 20.5"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
            <path
              d="M 21 12.5 C 24 10.5 28 10 32 11 M 21 16.5 C 24 14.5 28 14 32 15 M 21 20.5 C 24 18.5 28 18 32 19"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
            {/* Bookmark ribbon */}
            <path
              d="M 19 10 Q 17 17 16 27 L 18 25 L 20 27 Z"
              fill="#fdd355"
              stroke="#30312C"
              strokeWidth="0.8"
            />
          </svg>
        </Link>

        {/* CO-LAB Logo Image */}
        <Link href="/workspace" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CO-LAB Logo"
            width={120}
            height={36}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Right: Docs, Team, Search Bar, Profile Icon */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Docs Link */}
        <Link
          href="/help"
          className="flex items-center space-x-1.5 font-comic text-[#30312C] text-[14px] sm:text-[15px] font-bold hover:text-[#2c5e91] transition-colors group"
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
          <span className="hidden xs:inline">Docs</span>
        </Link>

        {/* Team Link */}
        <Link
          href="/workspace"
          className="flex items-center space-x-1.5 font-comic text-[#30312C] text-[14px] sm:text-[15px] font-bold hover:text-[#2c5e91] transition-colors group"
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
          <span className="hidden xs:inline">Team</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-[110px] sm:w-[150px] md:w-[180px] h-[36px] pl-8 pr-3 py-1 font-comic text-[14px] bg-[#FFFFFF] text-[#30312C] placeholder-[#8E8B82] rounded-full border-1.5 border-[#30312C] focus:outline-none focus:ring-2 focus:ring-[#2c5e91] focus:border-[#2c5e91] transition-all shadow-inner"
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

        {/* Circular Profile Icon */}
        <Link
          href="/settings"
          className="relative w-10 h-10 rounded-full border-1.5 border-[#30312C] bg-[#fdd355] overflow-hidden flex items-center justify-center hover:scale-105 transition-transform shadow-[0_2px_0px_#30312C]"
          title="Profile & Settings"
        >
          <Image
            src="/fox.png"
            alt="User Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
};

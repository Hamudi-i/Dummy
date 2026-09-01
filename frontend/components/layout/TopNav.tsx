"use client";

import React, { useState } from 'react';

interface TopNavProps {
  onOpenDocs: () => void;
  onOpenTeam: () => void;
  onSearch: (query: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenDocs, onOpenTeam, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-5 pt-3 pb-1 select-none z-20">
      {/* Left: Hand-drawn Open Book Icon */}
      <div 
        id="colab-brand-book-icon"
        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onOpenDocs}
        title="Co-Lab Workspace"
      >
        <svg
          width="34"
          height="24"
          viewBox="0 0 38 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        >
          {/* Left Page */}
          <path
            d="M 19 23 C 14 20 8 20 2 22 L 3 6 C 9 4 14 5 19 8 Z"
            fill="#F7F1E1"
            stroke="#30312C"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Page */}
          <path
            d="M 19 23 C 24 20 30 20 36 22 L 35 6 C 29 4 24 5 19 8 Z"
            fill="#FAF6EB"
            stroke="#30312C"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Book Spine Center */}
          <path
            d="M 19 8 L 19 24"
            stroke="#30312C"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Subtle line marks on left page */}
          <path
            d="M 6 10 C 10 9 14 9.5 17 11.5 M 6 14 C 10 13 14 13.5 17 15.5 M 6 18 C 10 17 14 17.5 17 19.5"
            stroke="#7C7365"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Subtle line marks on right page */}
          <path
            d="M 21 11.5 C 24 9.5 28 9 32 10 M 21 15.5 C 24 13.5 28 13 32 14 M 21 19.5 C 24 17.5 28 17 32 18"
            stroke="#7C7365"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Bookmark ribbon */}
          <path
            d="M 19 9 Q 17 16 16 26 L 18 24 L 20 26 Z"
            fill="#D38865"
            stroke="#30312C"
            strokeWidth="0.7"
          />
        </svg>
      </div>

      {/* Right: Docs, Team, Search */}
      <div className="flex items-center space-x-4 md:space-x-5 text-[15px] font-hand text-[#30312C]">
        {/* Docs Button */}
        <button
          id="colab-nav-docs-btn"
          type="button"
          onClick={onOpenDocs}
          className="flex items-center space-x-1.5 hover:text-[#254f85] transition-colors cursor-pointer group"
        >
          {/* Blue sketch book icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            className="group-hover:scale-105 transition-transform"
          >
            <path
              d="M 3 3.5 C 3 2.5 4 2 5.5 2 L 14 2 C 15 2 15.5 2.5 15.5 3.5 L 15.5 14.5 C 15.5 15.5 14.5 16 13.5 16 L 5.5 16 C 4 16 3 15 3 14 Z"
              fill="#5587C2"
              stroke="#30312C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 5.5 2 L 5.5 16"
              stroke="#E8EDF5"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M 8 6 L 12.5 6 M 8 9 L 12.5 9 M 8 12 L 11 12"
              stroke="#EBF2FA"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-comic text-[14px] font-bold tracking-tight">Docs</span>
        </button>

        {/* Team Button */}
        <button
          id="colab-nav-team-btn"
          type="button"
          onClick={onOpenTeam}
          className="flex items-center space-x-1.5 hover:text-[#254f85] transition-colors cursor-pointer group"
        >
          {/* Sketch team/people icon */}
          <svg
            width="17"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            className="group-hover:scale-105 transition-transform"
          >
            {/* Person 1 (left/front) */}
            <circle
              cx="7"
              cy="6"
              r="2.8"
              fill="#FBF8EF"
              stroke="#30312C"
              strokeWidth="1.2"
            />
            <path
              d="M 2.5 15 C 2.5 11.8 4.5 10.5 7 10.5 C 9.5 10.5 11.5 11.8 11.5 15"
              fill="#FBF8EF"
              stroke="#30312C"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Person 2 (right/back) */}
            <circle
              cx="13"
              cy="5.5"
              r="2.3"
              fill="#FBF8EF"
              stroke="#30312C"
              strokeWidth="1.1"
            />
            <path
              d="M 11 10.2 C 12 9.8 13.2 9.8 14.2 10.2 C 15.5 10.8 16.5 12 16.5 14.5"
              stroke="#30312C"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-comic text-[14px] font-bold tracking-tight">Team</span>
        </button>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              id="colab-top-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-[110px] sm:w-[124px] h-[26px] pl-6 pr-2 py-0 text-[13px] font-comic bg-[#FDFBF7] text-[#30312C] placeholder-[#8E8B82] rounded-[6px] border border-[#30312C] focus:outline-none focus:ring-1 focus:ring-[#5587C2] focus:border-[#5587C2] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            />
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              className="absolute left-2 text-[#7C7A72] pointer-events-none"
            >
              <circle
                cx="5.5"
                cy="5.5"
                r="4"
                stroke="#5A5852"
                strokeWidth="1.4"
              />
              <path
                d="M 8.5 8.5 L 12.5 12.5"
                stroke="#5A5852"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </form>
      </div>
    </nav>
  );
};

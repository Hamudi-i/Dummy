"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_WORKSPACES, WorkspaceItem } from "@/lib/mock-data";

export default function WorkspacesOverviewPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(INITIAL_WORKSPACES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("✨");

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newWorkspace: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || "Creative workspace for notes, sketches, and documents.",
      icon: newIcon || "✨",
      color: "#fdd355",
      notebookCount: 0,
      lastUpdated: "Just now",
    };

    setWorkspaces([newWorkspace, ...workspaces]);
    setNewTitle("");
    setNewDesc("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Header & Title Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-4">
          {/* Header Title with Straight Marker Underline (tilted up towards top-right) */}
          <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
            <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight">
              Recent Sketches
            </h1>
            <svg
              viewBox="0 0 240 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-2.5 left-0 w-full h-3.5 pointer-events-none z-0"
            >
              <line
                x1="2"
                y1="6"
                x2="238"
                y2="6"
                stroke="#fdd355"
                strokeWidth="9"
                strokeLinecap="round"
                strokeOpacity="0.65"
              />
            </svg>
          </div>

          {/* Subheader */}
          <p className="font-body text-base text-[#66645e] max-w-xl leading-relaxed">
            Welcome back! Pick up your pen where you left off or start a new collaborative canvas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-end h-[46px] px-5 bg-accent hover:bg-accent-hover text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-full border-1.5 border-[#30312C] shadow-[2px_2px_0px_#30312C] flex items-center space-x-2 transition-all active:translate-y-[1px] cursor-pointer shrink-0"
        >
          <span className="text-xl font-bold">+</span>
          <span>Create Workspace</span>
        </button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 sm:gap-8 max-w-6xl mx-auto pl-2 sm:pl-4">
        {workspaces.map((ws, idx) => {
          const defaultRotations = ["-rotate-1.5", "rotate-1", "-rotate-1", "rotate-1.5"];
          const tapeTilts = ["-rotate-3", "rotate-4", "-rotate-2", "rotate-[3.5deg]"];
          const currentRotation = ws.rotation || defaultRotations[idx % defaultRotations.length];
          const currentTapeTilt = tapeTilts[idx % tapeTilts.length];

          return (
            <Link
              key={ws.id}
              href={`/workspace/${ws.id}`}
              /* Connected Top Curve (160px Top Radii), Bottom-Right 114px, Bottom-Left 14px */
              className={`group bg-[#FFFFFF] border-2 border-[#1B1C1C] rounded-tl-[160px] rounded-tr-[160px] rounded-br-[114px] rounded-bl-[14px] p-6 min-h-[410px] shadow-[4px_4px_0px_rgba(27,28,28,0.20)] hover:shadow-[6px_6px_0px_rgba(27,28,28,0.35)] ${currentRotation} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4 relative`}
            >
              {/* Authentic Masking Tape Badge (Top-Center, Overlapping Top Border with Random Tilt) */}
              <div className={`absolute left-1/2 -translate-x-1/2 -top-4.5 z-20 ${currentTapeTilt} pointer-events-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)]`}>
                <div className="relative px-4 py-0.5 bg-[#FFF8DC]/95 text-[#30312C] font-header font-bold text-[11px] tracking-wider uppercase border-y border-[#D6C79B]/70 flex items-center justify-center select-none">
                  {/* Left Torn Tape Edge (Jagged SVG) */}
                  <div className="absolute -left-2 top-0 bottom-0 w-2.5 overflow-hidden">
                    <svg className="w-full h-full text-[#FFF8DC]/95 fill-current" viewBox="0 0 10 30" preserveAspectRatio="none">
                      <path d="M10,0 L0,3 L5,8 L0,14 L6,20 L0,26 L10,30 Z" />
                    </svg>
                  </div>

                  <span>{ws.badgeLabel || "Workspace"}</span>

                  {/* Right Torn Tape Edge (Jagged SVG) */}
                  <div className="absolute -right-2 top-0 bottom-0 w-2.5 overflow-hidden">
                    <svg className="w-full h-full text-[#FFF8DC]/95 fill-current" viewBox="0 0 10 30" preserveAspectRatio="none">
                      <path d="M0,0 L10,3 L5,8 L10,14 L4,20 L10,26 L0,30 Z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 1. Top Row: 3-Dots Button (Top-Right) */}
              <div className="flex items-center justify-end relative z-10 min-h-[28px]">
                {/* 3 Dots Vertical Settings Button (Top Right) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert(`Settings for ${ws.title}`);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#30312C] hover:bg-[#30312C]/10 transition-colors cursor-pointer"
                  title="Workspace Options"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>

              {/* 2. Rectangular Picture showing what's inside (Compact Height h-32) */}
              <div
                className={`w-full h-32 rounded-xl border-1.5 border-[#30312C]/30 overflow-hidden relative shadow-inner bg-gradient-to-br ${ws.previewGradient || "from-[#2c5e91]/20 to-[#fdd355]/20"
                  } flex items-center justify-center p-2.5 group-hover:scale-[1.01] transition-transform`}
              >
                {/* Mock Canvas Preview Illustration */}
                <div className="w-full h-full bg-[#FFFFFF]/80 backdrop-blur-xs rounded-lg border border-[#30312C]/15 p-2.5 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#30312C]/10 pb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base">{ws.icon}</span>
                      <span className="font-header font-bold text-xs text-[#30312C] truncate max-w-[120px]">
                        {ws.title}
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#fdd355] border border-[#30312C]" />
                  </div>
                  <div className="space-y-1.5 py-1">
                    <div className="w-3/4 h-2 bg-[#30312C]/15 rounded-full" />
                    <div className="w-1/2 h-2 bg-[#2c5e91]/20 rounded-full" />
                  </div>
                  <div className="flex items-center justify-end text-[10px] font-body text-[#737067]">
                    <span>Canvas Preview</span>
                  </div>
                </div>
              </div>

              {/* 3. Workspace Name */}
              <h3 className="font-header text-xl font-extrabold text-[#30312C] group-hover:text-primary transition-colors">
                {ws.title}
              </h3>

              {/* 4. Bottom Row: Edited Time (Bottom Left) & Notebook Count (Bottom Right) */}
              <div className="flex items-center justify-between pt-2 border-t border-[#30312C]/10">
                {/* Edited Sometime Ago (Bottom Left) */}
                <p className="font-body text-xs font-semibold text-[#737067]">
                  Edited {ws.lastUpdated}
                </p>

                {/* Notebook Count Badge (Bottom Right) */}
                <span className="font-body text-xs mr-5 font-semibold text-[#737067] bg-[#efe9d9] px-2.5 py-0.5 rounded-full border border-[#30312C]/20">
                  {ws.notebookCount} {ws.notebookCount === 1 ? "Notebook" : "Notebooks"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Divider & Footer */}
      <div className="pt-10 pb-4 space-y-6">
        <hr className="border-t-1.5 border-[#30312C]/20" />
        <footer className="w-full flex items-center justify-center text-xs font-body text-[#30312C]/70 space-x-4 select-none">
          <span>© Co-Lab 2024</span>
          <button
            type="button"
            onClick={() => alert("Privacy Policy")}
            className="underline hover:text-primary transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => alert("Terms of Service")}
            className="underline hover:text-primary transition-colors cursor-pointer"
          >
            Terms
          </button>
        </footer>
      </div>

      {/* Modal: Create Workspace */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0px_#30312C] space-y-5">
            <div className="flex items-center justify-between border-b border-[#30312C]/15 pb-3">
              <h3 className="font-header text-2xl font-bold text-[#30312C]">Create New Workspace</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#30312C] flex items-center justify-center text-[#30312C] hover:bg-[#e8e2d3] transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block font-header font-bold text-sm text-[#30312C] mb-1">
                  Workspace Icon
                </label>
                <div className="flex space-x-2">
                  {["🎨", "🚀", "✏️", "📂", "💡", "🔮"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      className={`w-10 h-10 rounded-xl border border-[#30312C] text-xl flex items-center justify-center ${newIcon === emoji ? "bg-accent shadow-[1.5px_1.5px_0px_#30312C]" : "bg-[#FFFFFF]"
                        }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-header font-bold text-sm text-[#30312C] mb-1">
                  Workspace Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full h-11 px-3.5 font-body text-sm bg-[#FFFFFF] border border-[#30312C] rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-header font-bold text-sm text-[#30312C] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of what this workspace contains..."
                  className="w-full p-3 font-body text-sm bg-[#FFFFFF] border border-[#30312C] rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-body font-semibold text-sm text-[#30312C] hover:bg-[#e8e2d3] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-header font-bold text-sm rounded-xl border border-[#30312C] shadow-[2px_2px_0px_#30312C] hover:brightness-105 active:translate-y-[1px]"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

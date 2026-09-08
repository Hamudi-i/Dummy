"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_WORKSPACES, INITIAL_NOTEBOOKS, NotebookItem } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { toast } from "@/components/ui/sonner";

export default function SingleWorkspacePage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "ws-design-system";

  const currentWorkspace =
    INITIAL_WORKSPACES.find((w) => w.id === workspaceId) || INITIAL_WORKSPACES[0];

  const [notebooks, setNotebooks] = useState<NotebookItem[]>(
    INITIAL_NOTEBOOKS.filter((n) => n.workspaceId === currentWorkspace.id || n.workspaceId === "ws-design-system")
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("book-open");

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNotebook: NotebookItem = {
      id: `nb-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      title: newTitle.trim(),
      description: newDesc.trim() || "Interactive notebook canvas for notes and drawings.",
      icon: newIcon || "book-open",
      pageCount: 1,
      lastEdited: "Just now",
      status: "active",
    };

    setNotebooks([newNotebook, ...notebooks]);
    setNewTitle("");
    setNewDesc("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Breadcrumbs & Header Section */}
      <div className="space-y-3 pb-2">
        {/* Breadcrumb Trail */}
        <div className="flex items-center space-x-2 text-xs font-body text-[#737067]">
          <Link href="/workspace" className="hover:text-primary transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#30312C]">{currentWorkspace.title}</span>
        </div>

        {/* Row 1: Header Title on Left & Action Button on Right (Same Line) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
            <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
              <span className="text-[#30312C]">
                <IconRenderer name={currentWorkspace.icon} className="w-8 h-8 text-[#30312C]" />
              </span>
              <span>{currentWorkspace.title}</span>
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

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-[46px] px-5 bg-accent hover:bg-accent-hover text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-full border-1.5 border-[#30312C] shadow-[2px_2px_0px_#30312C] flex items-center space-x-2 transition-all active:translate-y-[1px] cursor-pointer shrink-0"
          >
            <span className="text-xl font-bold">+</span>
            <span>New Notebook</span>
          </button>
        </div>

        {/* Row 2: Subheader below */}
        <p className="font-body text-base text-[#66645e] max-w-xl leading-relaxed">
          Flip open a digital notebook to continue sketching ideas or start a fresh journal page.
        </p>
      </div>

      {/* Hyper-Realistic Closed Notebooks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 sm:gap-8 max-w-6xl mx-auto pl-2 sm:pl-4">
        {notebooks.map((nb, idx) => {
          const tilts = ["-rotate-1.5", "rotate-1", "-rotate-1", "rotate-1.5"];
          const currentTilt = tilts[idx % tilts.length];
          const spineColors = ["bg-[#2c5e91]", "bg-[#e48358]", "bg-[#386b52]"];
          const currentSpineColor = spineColors[idx % spineColors.length];

          return (
            <Link
              key={nb.id}
              href={`/workspace/${currentWorkspace.id}/notebook/${nb.id}`}
              /* Hyper-Realistic Moleskine Notebook: Spiral Rings, Leather Cover, Paper Stack Depth, Ribbon Bookmark */
              className={`group bg-[#EFE8DC] border-2 border-[#1B1C1C] rounded-r-2xl rounded-l-md min-h-[365px] shadow-[5px_5px_0px_rgba(27,28,28,0.22)] hover:shadow-[7px_7px_0px_rgba(27,28,28,0.38)] ${currentTilt} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex overflow-visible cursor-pointer relative`}
            >
              {/* Closed Book Left Spine with Metallic Spiral Wire Rings */}
              <div className={`w-11 ${currentSpineColor} text-white/90 border-r-2 border-[#1B1C1C] flex flex-col items-center justify-between py-5 shrink-0 shadow-inner relative z-10`}>
                {/* 5 Metallic Spiral Binder Loops */}
                {[12, 28, 48, 68, 84].map((topPercent) => (
                  <div
                    key={topPercent}
                    className="absolute -left-2 w-3.5 h-2 rounded-full bg-gradient-to-r from-gray-300 via-white to-gray-400 border border-[#1B1C1C] shadow-xs"
                    style={{ top: `${topPercent}%` }}
                  />
                ))}

                {/* Vertical Gold Foil Spine Embossing */}
                <div className="w-1.5 h-8 bg-white/20 rounded-full" />
                <span className="font-header font-extrabold text-[9.5px] tracking-widest uppercase rotate-90 whitespace-nowrap text-white/95 drop-shadow-xs my-auto truncate max-w-[140px]">
                  {currentWorkspace.title}
                </span>
                <div className="w-1.5 h-8 bg-white/20 rounded-full" />
              </div>

              {/* Moleskine Book Front Cover Area */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4 relative bg-[#EFE8DC]">
                {/* Subtle Inner Debossed Cover Border */}
                <div className="absolute inset-2.5 border border-[#1B1C1C]/15 rounded-r-xl pointer-events-none" />

                {/* Top Cover Section: Vintage Book Cover Sticker Plate with Corner Rivets */}
                <div className="pt-2 space-y-3 relative z-10">
                  <div className="bg-[#FAF7EE] border-2 border-[#1B1C1C] rounded-xl p-4 shadow-[2.5px_2.5px_0px_#1B1C1C] space-y-2.5 relative group-hover:bg-white transition-colors">
                    {/* Brass Corner Rivets */}
                    <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />
                    <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />
                    <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />

                    {/* Header inside Label Plate with Creative 3-Dots Settings Button */}
                    <div className="flex items-center justify-between border-b border-[#30312C]/15 pb-2 pt-0.5">
                      <div className="flex items-center space-x-2.5">
                        <span className="shrink-0 text-[#30312C] p-1.5 bg-[#EFE8DC] rounded-lg border border-[#30312C]/20 shadow-2xs">
                          <IconRenderer name={nb.icon} className="w-4 h-4 text-[#30312C]" />
                        </span>
                        <h3 className="font-header text-base font-extrabold text-[#30312C] group-hover:text-primary transition-colors leading-snug">
                          {nb.title}
                        </h3>
                      </div>

                      {/* Creative 3-Dots Settings Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toast.info("Notebook Settings", {
                            description: `Configuring settings for "${nb.title}"`,
                          });
                        }}
                        className="w-7 h-7 rounded-lg border border-[#1B1C1C]/25 bg-[#EFE8DC] hover:bg-accent text-[#30312C] flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 z-20"
                        title="Notebook Settings"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="2.2" />
                          <circle cx="12" cy="12" r="2.2" />
                          <circle cx="12" cy="19" r="2.2" />
                        </svg>
                      </button>
                    </div>

                    <p className="font-body text-xs text-[#55534c] leading-relaxed line-clamp-3">
                      {nb.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Cover Section: Pages Count & Last Edited */}
                <div className="pt-2 border-t border-[#1B1C1C]/15 flex items-center justify-between text-xs font-body relative z-10">
                  <span className="font-semibold text-[#66645e]">
                    Edited {nb.lastEdited}
                  </span>
                  <span className="font-bold text-[#30312C] bg-[#FAF7EE] px-2.5 py-0.5 rounded-full border border-[#1B1C1C] shadow-2xs">
                    {nb.pageCount} Pages
                  </span>
                </div>
              </div>

              {/* Stacked Paper Page Edges (Right Side Depth Layering) */}
              <div className="w-2.5 bg-[#FAF7EE] border-l-2 border-[#1B1C1C] shrink-0 shadow-[inset_2px_0_4px_rgba(0,0,0,0.12)] flex flex-col justify-around py-3 select-none">
                <div className="w-full h-[1px] bg-[#30312C]/20" />
                <div className="w-full h-[1px] bg-[#30312C]/20" />
                <div className="w-full h-[1px] bg-[#30312C]/20" />
                <div className="w-full h-[1px] bg-[#30312C]/20" />
              </div>

              {/* Vertical Moleskine Elastic Band Strap (Right Edge) */}
              <div className="w-3.5 bg-[#242524] border-l-2 border-[#1B1C1C] shrink-0 shadow-[inset_1px_0_4px_rgba(0,0,0,0.5)] z-10" />
            </Link>
          );
        })}
      </div>

      {/* Modal: Create Notebook */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0px_#30312C] space-y-5">
            <div className="flex items-center justify-between border-b border-[#30312C]/15 pb-3">
              <h3 className="font-header text-2xl font-bold text-[#30312C]">Create New Notebook</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#30312C] flex items-center justify-center text-[#30312C] hover:bg-[#e8e2d3] transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotebook} className="space-y-4">
              <div>
                <label className="block font-header font-bold text-sm text-[#30312C] mb-1">
                  Notebook Icon
                </label>
                <div className="flex space-x-2">
                  {["book-open", "palette", "layers", "kanban", "zap", "pen-tool"].map((iconKey) => (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setNewIcon(iconKey)}
                      className={`w-10 h-10 rounded-xl border border-[#30312C] flex items-center justify-center ${
                        newIcon === iconKey ? "bg-accent shadow-[1.5px_1.5px_0px_#30312C]" : "bg-[#FFFFFF]"
                      }`}
                    >
                      <IconRenderer name={iconKey} className="w-5 h-5 text-[#30312C]" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-header font-bold text-sm text-[#30312C] mb-1">
                  Notebook Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Component Wireframes"
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
                  placeholder="What is this notebook used for?"
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
                  Create Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

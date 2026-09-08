"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getArchivedItems,
  restoreItem,
  deleteArchivedItem,
  ArchivedItem,
} from "@/lib/archive-store";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import {
  Archive,
  RotateCcw,
  Trash2,
  Folder,
  BookOpen,
  Search,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function ArchivePage() {
  const [archivedList, setArchivedList] = useState<ArchivedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "workspace" | "notebook">("all");
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; title: string; type: string } | null>(null);

  useEffect(() => {
    setArchivedList(getArchivedItems());
  }, []);

  const handleRestore = (id: string, title: string) => {
    restoreItem(id);
    setArchivedList(getArchivedItems());
    toast.success("Restored Successfully", {
      description: `"${title}" has been restored to your active workspace.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    deleteArchivedItem(deleteCandidate.id);
    setArchivedList(getArchivedItems());
    toast.error("Permanently Deleted", {
      description: `"${deleteCandidate.title}" removed from the archive vault.`,
    });
    setDeleteCandidate(null);
  };

  const filteredItems = archivedList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const archivedWorkspaces = filteredItems.filter((i) => i.type === "workspace");
  const archivedNotebooks = filteredItems.filter((i) => i.type === "notebook");

  return (
    <div className="space-y-10 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
          <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
            <Archive className="w-10 h-10 text-[#30312C]" />
            <span>Archive Vault</span>
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
        <p className="font-body text-sm text-[#737067] max-w-xl">
          Historical project boards, inactive workspaces, and archived notebooks stored safely for future reference.
        </p>
      </div>

      {/* Filter & Search Bar Header Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-b-2 border-[#30312C]/15 pb-4">
        <div className="flex items-center space-x-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737067]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive vault..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-[2px_2px_0px_#30312C]"
            />
          </div>
          <span className="px-3 py-1.5 text-xs font-header font-bold text-[#30312C] bg-[#FAF7EE] border border-[#30312C] rounded-xl shadow-[1.5px_1.5px_0px_#30312C] shrink-0">
            {archivedList.length} Stored
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {(["all", "workspace", "notebook"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all cursor-pointer capitalize ${
                filterType === type
                  ? "bg-primary text-white shadow-[1.5px_1.5px_0px_#30312C]"
                  : "bg-white text-[#30312C] hover:bg-[#FAF7EE]"
              }`}
            >
              {type === "all" ? "All Items" : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-12 shadow-[6px_6px_0px_#30312C] text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-[#30312C] flex items-center justify-center text-3xl shadow-[2px_2px_0px_#30312C]">
            📦
          </div>
          <h2 className="font-header text-2xl font-extrabold text-[#30312C]">
            Archive Vault Empty
          </h2>
          <p className="font-body text-sm text-[#737067]">
            {searchQuery
              ? `No items matching "${searchQuery}".`
              : "Completed project boards and stored sketches will appear here when archived."}
          </p>
        </div>
      )}

      {/* SECTION 1: ARCHIVED WORKSPACES */}
      {(filterType === "all" || filterType === "workspace") && archivedWorkspaces.length > 0 && (
        <div className="space-y-5 pt-2">
          <div className="flex items-center space-x-3 pb-1 border-b border-[#30312C]/10">
            <div className="p-1.5 bg-[#2c5e91] text-white rounded-lg border border-[#30312C]">
              <Folder className="w-4 h-4" />
            </div>
            <h2 className="font-header text-xl font-extrabold text-[#30312C]">
              Archived Workspaces
            </h2>
            <span className="font-body text-xs text-[#737067] bg-[#FAF7EE] px-2.5 py-0.5 rounded-full border border-[#30312C]/20">
              {archivedWorkspaces.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {archivedWorkspaces.map((ws, idx) => {
              const defaultRotations = ["-rotate-1.5", "rotate-1", "-rotate-1", "rotate-1.5"];
              const tapeTilts = ["-rotate-3", "rotate-4", "-rotate-2", "rotate-[3.5deg]"];
              const currentRotation = defaultRotations[idx % defaultRotations.length];
              const currentTapeTilt = tapeTilts[idx % tapeTilts.length];

              return (
                <div
                  key={ws.id}
                  className={`group bg-[#FFFFFF] border-2 border-[#1B1C1C] rounded-tl-[160px] rounded-tr-[160px] rounded-br-[114px] rounded-bl-[14px] p-6 min-h-[365px] shadow-[5px_5px_0px_rgba(27,28,28,0.22)] ${currentRotation} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-visible`}
                >
                  {/* Masking Tape Badge */}
                  <div className={`absolute left-1/2 -translate-x-1/2 -top-4.5 z-20 ${currentTapeTilt} pointer-events-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)]`}>
                    <div className="relative px-4 py-0.5 bg-[#FFF8DC]/95 text-[#30312C] font-header font-bold text-[11px] tracking-wider uppercase border-y border-[#D6C79B]/70 flex items-center justify-center select-none">
                      <div className="absolute -left-2 top-0 bottom-0 w-2.5 overflow-hidden">
                        <svg className="w-full h-full text-[#FFF8DC]/95 fill-current" viewBox="0 0 10 30" preserveAspectRatio="none">
                          <path d="M10,0 L0,3 L5,8 L0,14 L6,20 L0,26 L10,30 Z" />
                        </svg>
                      </div>
                      <span>ARCHIVED WORKSPACE</span>
                      <div className="absolute -right-2 top-0 bottom-0 w-2.5 overflow-hidden">
                        <svg className="w-full h-full text-[#FFF8DC]/95 fill-current" viewBox="0 0 10 30" preserveAspectRatio="none">
                          <path d="M0,0 L10,3 L5,8 L10,14 L4,20 L10,26 L0,30 Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Top Action Row (Restore / Delete) - PUSHED TO LEFT SIDE */}
                  <div className="flex items-center justify-start space-x-3 relative z-10 pt-2 left-8">
                    <button
                      type="button"
                      onClick={() => handleRestore(ws.id, ws.title)}
                      className="px-3 py-1 bg-[#FAF7EE] hover:bg-white text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1"
                      title="Restore Workspace"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#2c5e91]" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteCandidate({ id: ws.id, title: ws.title, type: "workspace" })}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-300 shadow-[1px_1px_0px_#9f1239] transition-all cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Canvas Preview Picture */}
                  <div className="w-[88%] mx-auto h-28 rounded-xl border-1.5 border-[#30312C]/30 overflow-hidden relative shadow-xs bg-[#FAF7EE] group-hover:scale-[1.01] transition-transform z-10 flex items-center justify-center">
                    <img
                      src="/sketch-preview.jpg"
                      alt={`${ws.title} Canvas Preview`}
                      className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-1.5 right-2 px-2 py-0.5 bg-[#1B1C1C]/80 text-white rounded-md text-[9.5px] font-header font-bold tracking-wider backdrop-blur-xs">
                      Archived Preview
                    </div>
                  </div>

                  {/* Workspace Title */}
                  <div>
                    <h3 className="font-header text-xl font-extrabold text-[#30312C] group-hover:text-primary transition-colors relative z-10">
                      {ws.title}
                    </h3>
                    <p className="font-body text-xs text-[#737067] line-clamp-2 mt-1">
                      {ws.description || "No description provided."}
                    </p>
                  </div>

                  {/* Bottom Row: Edited Time & Notebook Count Badge (Shifted Left) */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#30312C]/10 relative z-10">
                    <p className="font-body text-xs font-semibold text-[#737067]">
                      {ws.archivedAt}
                    </p>
                    <span className="font-body text-xs mr-4 font-semibold text-[#737067] bg-[#efe9d9] px-2.5 py-0.5 rounded-full border border-[#30312C]/20">
                      1 Notebook
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ARCHIVED NOTEBOOKS */}
      {(filterType === "all" || filterType === "notebook") && archivedNotebooks.length > 0 && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center space-x-3 pb-1 border-b border-[#30312C]/10">
            <div className="p-1.5 bg-[#fdd355] text-[#30312C] rounded-lg border border-[#30312C]">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="font-header text-xl font-extrabold text-[#30312C]">
              Archived Notebooks
            </h2>
            <span className="font-body text-xs text-[#737067] bg-[#FAF7EE] px-2.5 py-0.5 rounded-full border border-[#30312C]/20">
              {archivedNotebooks.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {archivedNotebooks.map((nb, idx) => {
              const spineColors = ["bg-[#2c5e91]", "bg-[#912c40]", "bg-[#2c9162]", "bg-[#7e2c91]"];
              const tilts = ["-rotate-1", "rotate-1.5", "-rotate-1.5", "rotate-1"];
              const currentSpineColor = spineColors[idx % spineColors.length];
              const currentTilt = tilts[idx % tilts.length];

              return (
                <div
                  key={nb.id}
                  className={`group bg-[#EFE8DC] border-2 border-[#1B1C1C] rounded-r-2xl rounded-l-md min-h-[365px] shadow-[5px_5px_0px_rgba(27,28,28,0.22)] ${currentTilt} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex overflow-hidden relative`}
                >
                  {/* Left Spine with Metallic Spiral Wire Rings */}
                  <div className={`w-11 ${currentSpineColor} text-white/90 border-r-2 border-[#1B1C1C] flex flex-col items-center justify-between py-5 shrink-0 shadow-inner relative z-10`}>
                    {[12, 28, 48, 68, 84].map((topPercent) => (
                      <div
                        key={topPercent}
                        className="absolute -left-2 w-3.5 h-2 rounded-full bg-gradient-to-r from-gray-300 via-white to-gray-400 border border-[#1B1C1C] shadow-xs"
                        style={{ top: `${topPercent}%` }}
                      />
                    ))}

                    <div className="w-1.5 h-8 bg-white/20 rounded-full" />
                    <span className="font-header font-extrabold text-[9.5px] tracking-widest uppercase rotate-90 whitespace-nowrap text-white/95 drop-shadow-xs my-auto truncate max-w-[140px]">
                      ARCHIVED NOTEBOOK
                    </span>
                    <div className="w-1.5 h-8 bg-white/20 rounded-full" />
                  </div>

                  {/* Moleskine Cover Area */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4 relative bg-[#EFE8DC]">
                    <div className="absolute inset-2.5 border border-[#1B1C1C]/15 rounded-r-xl pointer-events-none" />

                    {/* Top Sticker Plate */}
                    <div className="pt-1 space-y-3 relative z-10">
                      <div className="bg-[#FAF7EE] border-2 border-[#1B1C1C] rounded-xl p-4 shadow-[2.5px_2.5px_0px_#1B1C1C] space-y-2.5 relative group-hover:bg-white transition-colors">
                        <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />
                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />
                        <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />
                        <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#1B1C1C]/60" />

                        <div className="flex items-center justify-between border-b border-[#30312C]/15 pb-2 pt-0.5">
                          <div className="flex items-center space-x-2.5">
                            <span className="shrink-0 text-[#30312C] p-1 bg-[#EFE8DC] rounded-lg border border-[#30312C]/20 shadow-2xs">
                              <IconRenderer name={nb.icon || "BookOpen"} className="w-4 h-4 text-[#30312C]" />
                            </span>
                            <h3 className="font-header text-base font-extrabold text-[#30312C] leading-snug">
                              {nb.title}
                            </h3>
                          </div>
                        </div>

                        <p className="font-body text-xs text-[#55534c] leading-relaxed line-clamp-3">
                          {nb.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions: NO DIVIDER LINE ABOVE, NUDGED UP, DELETE IS ICON ONLY */}
                    <div className="flex items-center justify-between text-xs font-body relative z-10 pt-0 -top-3 -mt-1">
                      <button
                        type="button"
                        onClick={() => handleRestore(nb.id, nb.title)}
                        className="px-3 py-1 bg-[#FAF7EE] hover:bg-white text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#2c5e91]" />
                        <span>Restore</span>
                      </button>

                      {/* Delete Icon-Only Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate({ id: nb.id, title: nb.title, type: "notebook" })}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-300 shadow-[1px_1px_0px_#9f1239] transition-all cursor-pointer"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Confirmation Modal for Deleting Archived Items */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        itemTitle={deleteCandidate?.title}
        itemType={deleteCandidate?.type}
      />
    </div>
  );
}

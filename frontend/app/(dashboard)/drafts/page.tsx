"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { INITIAL_WORKSPACES } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { getDrafts, removeDraft, DraftItem } from "@/lib/drafts-store";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { toast } from "@/components/ui/sonner";
import {
  Trash2,
  ArrowRight,
  Clock,
  Search,
  FileText,
  Layers,
} from "lucide-react";

function cleanSnippetText(rawContent?: string): string {
  if (!rawContent) return "Empty draft content...";
  const stripped = rawContent.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
  return stripped.length > 0 ? stripped : "Empty draft content...";
}

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkspaceFilter, setSelectedWorkspaceFilter] = useState("all");
  const [deleteCandidate, setDeleteCandidate] = useState<{
    notebookId: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setDrafts(getDrafts());
  }, []);

  const handleConfirmDiscard = () => {
    if (!deleteCandidate) return;
    removeDraft(deleteCandidate.notebookId);
    setDrafts(getDrafts());
    toast.error("Draft Discarded", {
      description: `Discarded unsaved draft for "${deleteCandidate.title}".`,
    });
    setDeleteCandidate(null);
  };

  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => {
      const matchesSearch =
        draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cleanSnippetText(draft.content).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWorkspace =
        selectedWorkspaceFilter === "all" || draft.workspaceId === selectedWorkspaceFilter;
      return matchesSearch && matchesWorkspace;
    });
  }, [drafts, searchQuery, selectedWorkspaceFilter]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn select-none pt-6 sm:pt-8 pb-12">
      {/* Header & Title Section */}
      <div className="space-y-2">
        {/* Title Header with SVG Underline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
            <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight">
              Drafts & WIP Canvases
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
        </div>

        {/* Subheader */}
        <p className="font-body text-base text-[#66645e] max-w-xl leading-relaxed">
          Unpublished sketches, WIP notebook pages, and auto-saved ideas across your workspaces.
        </p>
      </div>

      {/* Filter & Search Toolbar (Decreased gap to subheader) */}
      {mounted && drafts.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF7EE] p-3.5 rounded-2xl border-1.5 border-[#30312C] shadow-[2.5px_2.5px_0px_#30312C]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737067]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drafts by title or text snippet..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#30312C] rounded-xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary placeholder-[#737067]"
            />
          </div>

          {/* Workspace Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedWorkspaceFilter("all")}
              className={`px-3 py-1.5 font-header font-bold text-xs rounded-xl border transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                selectedWorkspaceFilter === "all"
                  ? "bg-[#30312C] text-white border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C]"
                  : "bg-white text-[#30312C] border-[#30312C]/30 hover:bg-[#FAF7EE]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Workspaces</span>
            </button>

            {INITIAL_WORKSPACES.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setSelectedWorkspaceFilter(ws.id)}
                className={`px-3 py-1.5 font-header font-bold text-xs rounded-xl border transition-all cursor-pointer shrink-0 ${
                  selectedWorkspaceFilter === ws.id
                    ? "bg-[#30312C] text-white border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C]"
                    : "bg-white text-[#30312C] border-[#30312C]/30 hover:bg-[#FAF7EE]"
                }`}
              >
                <span>{ws.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Hyper-Realistic Loose-Leaf Paper Sheet Draft Cards */}
      {mounted && filteredDrafts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto pt-2">
          {filteredDrafts.map((draft, idx) => {
            const tilts = ["-rotate-1", "rotate-1", "-rotate-1.5", "rotate-1.5"];
            const currentTilt = tilts[idx % tilts.length];
            const parentWorkspace = INITIAL_WORKSPACES.find((w) => w.id === draft.workspaceId);
            const cleanSnippet = cleanSnippetText(draft.content);
            const wordCount = countWords(cleanSnippet);

            return (
              <div
                key={draft.id}
                className={`bg-[#FAF7EE] bg-[linear-gradient(to_bottom,transparent_23px,rgba(48,49,44,0.06)_24px)] bg-[size:100%_24px] border-2 border-[#30312C] rounded-2xl p-5 shadow-[5px_5px_0px_#30312C,8px_8px_0px_rgba(48,49,44,0.12)] hover:shadow-[8px_8px_0px_#30312C,11px_11px_0px_rgba(48,49,44,0.18)] ${currentTilt} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group overflow-visible min-h-[320px]`}
              >
                {/* Center Top Translucent Washi Tape Accent */}
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5.5 bg-white/85 border border-black/15 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] pointer-events-none z-20 rounded-xs backdrop-blur-[0.5px]"
                  style={{ transform: "translateX(-50%) rotate(-2deg)" }}
                />

                {/* Left Margin Binder Hole Punch Accents */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[65%] pointer-events-none z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EFE8DC] border border-[#30312C]/40 shadow-inner" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EFE8DC] border border-[#30312C]/40 shadow-inner" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EFE8DC] border border-[#30312C]/40 shadow-inner" />
                </div>

                {/* Paper Content Area with Red Notebook Margin Line */}
                <div className="pl-3.5 sm:pl-4 border-l-2 border-red-300/60 space-y-3.5 relative z-10 flex-1 flex flex-col justify-between">
                  {/* Paper Header: Notebook Title & Icon */}
                  <div className="flex items-start justify-between border-b border-dashed border-[#30312C]/25 pb-3 gap-2.5">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] flex items-center justify-center text-[#30312C] shrink-0">
                        <IconRenderer name={draft.icon} className="w-4 h-4 text-[#30312C]" />
                      </div>

                      <div className="space-y-0.5 truncate">
                        <h3 className="font-header text-base sm:text-lg font-extrabold text-[#30312C] leading-snug group-hover:text-primary transition-colors truncate">
                          {draft.title}
                        </h3>
                        <span className="font-body text-[11px] text-[#737067] block truncate">
                          {parentWorkspace?.title || "Workspace"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Paper Note Body: Auto-saved Excerpt */}
                  <div className="bg-white/90 border border-[#30312C]/20 rounded-xl p-3.5 shadow-2xs space-y-2 relative my-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-header font-extrabold uppercase text-[#807d74] tracking-wider flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-[#30312C]" />
                        <span>Excerpt</span>
                      </span>

                      <span className="text-[10px] font-body text-[#737067] bg-[#FAF7EE] px-2 py-0.5 rounded-md border border-[#30312C]/15 font-semibold">
                        {wordCount} words
                      </span>
                    </div>

                    <p className="font-body text-xs text-[#30312C] leading-relaxed line-clamp-3 italic">
                      "{cleanSnippet}"
                    </p>
                  </div>

                  {/* Paper Footer Actions */}
                  <div className="pt-2.5 border-t border-[#30312C]/15 flex items-center justify-between gap-1.5">
                    <div className="flex items-center space-x-1 text-[11px] font-body text-[#737067] truncate">
                      <Clock className="w-3 h-3 text-[#30312C] shrink-0" />
                      <span className="truncate">{draft.lastEdited}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Discard Draft Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteCandidate({ notebookId: draft.notebookId, title: draft.title })
                        }
                        className="p-1.5 bg-white hover:bg-red-50 text-red-600 rounded-lg border border-red-300 hover:border-red-400 transition-all flex items-center cursor-pointer"
                        title="Discard draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Resume Editing Button */}
                      <Link
                        href={`/workspace/${draft.workspaceId}/notebook/${draft.notebookId}`}
                        className="px-3 py-1.5 bg-[#fdd355] hover:bg-[#ffe082] text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:shadow-[2px_2px_0px_#30312C] transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Resume</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : mounted && drafts.length > 0 && filteredDrafts.length === 0 ? (
        /* No Search Matches */
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-3xl p-10 max-w-md mx-auto shadow-[6px_6px_0px_#30312C] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-[#30312C] flex items-center justify-center text-2xl mx-auto shadow-[2px_2px_0px_#30312C]">
            🔍
          </div>
          <h3 className="font-header text-xl font-bold text-[#30312C]">No Drafts Match Search</h3>
          <p className="font-body text-xs text-[#66645e]">
            No unsaved drafts found matching "{searchQuery}". Try clearing filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedWorkspaceFilter("all");
            }}
            className="px-4 py-2 bg-[#30312C] text-white font-header font-bold text-xs rounded-xl cursor-pointer shadow-[2px_2px_0px_#30312C]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-3xl p-12 max-w-md mx-auto shadow-[6px_6px_0px_#30312C] text-center space-y-4 transform -rotate-1 relative">
          {/* Top Center Tape */}
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 border border-black/15 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] pointer-events-none z-20 rounded-xs"
            style={{ transform: "translateX(-50%) rotate(-3deg)" }}
          />

          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-[#30312C] flex items-center justify-center text-3xl mx-auto shadow-[2.5px_2.5px_0px_#30312C]">
            ✏️
          </div>
          <h2 className="font-header text-2xl font-extrabold text-[#30312C]">
            No Unsaved Drafts
          </h2>
          <p className="font-body text-xs text-[#66645e] leading-relaxed">
            All your notebook canvases and sketches are saved and up to date! Editing any notebook automatically tracks your unsaved WIP draft here.
          </p>
          <div className="pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[2.5px_2.5px_0px_#30312C] hover:brightness-105 transition-all"
            >
              <span>Explore Workspaces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Global Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDiscard}
        itemTitle={deleteCandidate?.title}
        itemType="Draft"
      />
    </div>
  );
}

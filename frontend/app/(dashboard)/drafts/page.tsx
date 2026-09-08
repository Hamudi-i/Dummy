"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_WORKSPACES } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { getDrafts, removeDraft, DraftItem } from "@/lib/drafts-store";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { toast } from "@/components/ui/sonner";
import { Pencil, Trash2, ArrowRight, Clock, AlertTriangle } from "lucide-react";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<{ notebookId: string; title: string } | null>(null);

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

  return (
    <div className="space-y-8 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Header & Title Section (Exact Consistency with Workspace & Notebooks pages) */}
      <div className="space-y-3 pb-2">
        {/* Title Header with Random Tilt & SVG Underline */}
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

          <div className="flex items-center space-x-2">
            <span className="font-header font-bold text-xs text-[#66645e] bg-[#FAF7EE] px-3 py-1.5 rounded-full border border-[#30312C]/20 shadow-2xs">
              {drafts.length} Unsaved Drafts
            </span>
          </div>
        </div>

        {/* Subheader */}
        <p className="font-body text-base text-[#66645e] max-w-xl leading-relaxed">
          Unpublished sketches, WIP notebook pages, and auto-saved ideas across your workspaces.
        </p>
      </div>

      {/* Grid of Draft Cards */}
      {mounted && drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 max-w-6xl mx-auto">
          {drafts.map((draft, idx) => {
            const tilts = ["-rotate-1", "rotate-1", "-rotate-1.5", "rotate-1.5"];
            const currentTilt = tilts[idx % tilts.length];
            const parentWorkspace = INITIAL_WORKSPACES.find((w) => w.id === draft.workspaceId);

            return (
              <div
                key={draft.id}
                className={`bg-[#EFE8DC] border-2 border-[#30312C] rounded-2xl p-6 shadow-[5px_5px_0px_#30312C] hover:shadow-[7px_7px_0px_#30312C] ${currentTilt} hover:rotate-0 transition-all duration-300 space-y-4 relative flex flex-col justify-between`}
              >
                {/* Draft Badge & Workspace Header */}
                <div className="flex items-center justify-between border-b border-[#30312C]/15 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-2 bg-[#FAF7EE] rounded-xl border border-[#30312C]/30 text-[#30312C] shadow-2xs">
                      <IconRenderer name={draft.icon} className="w-5 h-5 text-[#30312C]" />
                    </span>
                    <div>
                      <h3 className="font-header text-lg font-extrabold text-[#30312C] leading-snug">
                        {draft.title}
                      </h3>
                      <span className="font-body text-[11px] text-[#737067]">
                        {parentWorkspace?.title || "Workspace"}
                      </span>
                    </div>
                  </div>

                  {/* Unsaved Draft Badge */}
                  <span className="px-2.5 py-0.5 text-[10.5px] font-header font-bold text-amber-900 bg-amber-100 border border-amber-400 rounded-full flex items-center space-x-1 shrink-0">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Draft</span>
                  </span>
                </div>

                {/* Content Text Snippet Box */}
                <div className="bg-[#FAF7EE] border border-[#30312C]/30 rounded-xl p-3.5 shadow-inner space-y-1">
                  <span className="text-[10px] font-header font-bold uppercase text-[#807d74] tracking-wider">
                    Auto-saved Content Snippet:
                  </span>
                  <p className="font-body text-xs text-[#30312C] leading-relaxed line-clamp-3 italic">
                    "{draft.content || "Empty draft content..."}"
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-2 border-t border-[#30312C]/15 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs font-body text-[#737067]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Edited {draft.lastEdited}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Discard Draft Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate({ notebookId: draft.notebookId, title: draft.title })}
                      className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 font-header font-bold text-xs rounded-xl border border-red-300 transition-colors flex items-center space-x-1 cursor-pointer"
                      title="Discard draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Discard</span>
                    </button>

                    {/* Resume Editing Button */}
                    <Link
                      href={`/workspace/${draft.workspaceId}/notebook/${draft.notebookId}`}
                      className="px-4 py-1.5 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Resume Editing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-3xl p-12 max-w-md mx-auto shadow-[6px_6px_0px_#30312C] text-center space-y-4 transform -rotate-1">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-[#30312C] flex items-center justify-center text-3xl mx-auto shadow-[2px_2px_0px_#30312C]">
            ✏️
          </div>
          <h2 className="font-header text-2xl font-bold text-[#30312C]">
            No Unsaved Drafts
          </h2>
          <p className="font-body text-xs text-[#66645e] leading-relaxed">
            All your notebook canvases and sketches are saved and up to date! Editing any notebook automatically tracks your unsaved WIP draft here.
          </p>
          <div className="pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-accent text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[2px_2px_0px_#30312C] hover:brightness-105 transition-all"
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

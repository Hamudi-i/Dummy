"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_WORKSPACES, INITIAL_NOTEBOOKS } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { saveDraft, removeDraft, getDrafts, getSavedNotebookContent, saveNotebookContent } from "@/lib/drafts-store";
import { toast } from "@/components/ui/sonner";
import { TiptapCanvas } from "@/components/editor/TiptapCanvas";
import {
  Eye,
  Pencil,
  CheckCircle2,
  Link as LinkIcon,
  AlertTriangle,
} from "lucide-react";

export default function NotebookEditorPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "ws-design-system";
  const notebookId = (params?.notebookId as string) || "nb-components";

  const currentWorkspace =
    INITIAL_WORKSPACES.find((w) => w.id === workspaceId) || INITIAL_WORKSPACES[0];

  const currentNotebook =
    INITIAL_NOTEBOOKS.find((n) => n.id === notebookId) || INITIAL_NOTEBOOKS[0];

  const DEFAULT_NOTEBOOK_CONTENT =
    notebookId === "nb-components"
      ? "<h1>📐 Component Specifications & Guidelines</h1><ul><li><strong>Primary Accent:</strong> #fdd355</li><li><strong>Brand Blue:</strong> #2c5e91</li><li><strong>Border Rules:</strong> Solid 1.8px #30312C sketch borders</li><li><strong>Typography:</strong> Bricolage Grotesque for headers and Be Vietnam Pro for body.</li></ul><p>Type here to start editing your notebook canvas...</p>"
      : `<h1>${currentNotebook.title}</h1><p><em>${currentNotebook.description}</em></p><hr /><p>Type here to start editing your notebook canvas...</p>`;

  const [content, setContent] = useState(DEFAULT_NOTEBOOK_CONTENT);

  const [isSaved, setIsSaved] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there is an unsaved WIP draft for this notebook
    const existingDrafts = getDrafts();
    const activeDraft = existingDrafts.find((d) => d.notebookId === notebookId);
    if (activeDraft && activeDraft.content) {
      setContent(activeDraft.content);
      setIsSaved(false);
    } else {
      // Otherwise load persistent saved content
      const saved = getSavedNotebookContent(notebookId, DEFAULT_NOTEBOOK_CONTENT);
      setContent(saved);
      setIsSaved(true);
    }
  }, [notebookId]);

  const handleContentChange = (newHtml: string) => {
    setContent(newHtml);
    setIsSaved(false);
    saveDraft({
      id: `draft-${notebookId}`,
      notebookId,
      workspaceId,
      title: currentNotebook.title,
      description: currentNotebook.description,
      icon: currentNotebook.icon,
      content: newHtml,
      lastEdited: "Just now",
      isUnsaved: true,
    });
  };

  const handleSave = () => {
    setIsSaved(true);
    saveNotebookContent(notebookId, content);
    removeDraft(notebookId);
    toast.success("Notebook Saved!", {
      description: `Changes saved to "${currentNotebook.title}".`,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Breadcrumbs & Header Section */}
      <div className="space-y-3">
        {/* Breadcrumb Trail */}
        <div className="flex items-center space-x-2 text-xs font-body text-[#737067]">
          <Link href="/workspace" className="hover:text-primary transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <Link
            href={`/workspace/${currentWorkspace.id}`}
            className="hover:text-primary transition-colors"
          >
            {currentWorkspace.title}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#30312C]">{currentNotebook.title}</span>
        </div>

        {/* Title Header with SVG Underline & Collaborator Profile Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
            <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
              <span className="text-[#30312C]">
                <IconRenderer name={currentNotebook.icon} className="w-9 h-9 text-[#30312C]" />
              </span>
              <span>{currentNotebook.title}</span>
              {!isSaved && (
                <span className="px-2.5 py-0.5 text-[11px] font-header font-bold text-amber-900 bg-amber-100 border border-amber-400 rounded-full flex items-center space-x-1 translate-y-0.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Unsaved Draft</span>
                </span>
              )}
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

          {/* Collaborator Profile Badges (Aligned on header line, increased size) */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Avatar Circle 1 */}
            <div className="relative group cursor-pointer" title="Natty (Active Collaborator)">
              <div className="w-12 h-12 rounded-full bg-[#FAF7EE] border-2 border-[#30312C] shadow-[2.5px_2px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#2c5e91] text-white font-header font-extrabold text-base sm:text-lg flex items-center justify-center">
                  N
                </div>
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                title="Online & Editing"
              />
            </div>

            {/* Avatar Circle 2 */}
            <div className="relative group cursor-pointer" title="Maya (Design Lead)">
              <div className="w-12 h-12 rounded-full bg-[#FAF7EE] border-2 border-[#30312C] shadow-[2.5px_2px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#fdd355] text-[#30312C] font-header font-extrabold text-base sm:text-lg flex items-center justify-center">
                  M
                </div>
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                title="Online & Editing"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Outer Wrapper with Top Margin & Corner Tapes */}
      <div className="relative mt-14 w-full max-w-[1024px] mx-auto">
        {/* Left Tape Accent */}
        <div
          className="absolute -top-3 -left-7 w-[46px] h-[20px] bg-white/60 border border-black/10 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.12)] pointer-events-none z-30 rounded-xs backdrop-blur-[0.5px]"
          style={{ transform: "rotate(-40deg)" }}
        />

        {/* Right Tape Accent */}
        <div
          className="absolute -top-3 -right-7 w-[46px] h-[20px] bg-white/60 border border-black/10 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.12)] pointer-events-none z-30 rounded-xs backdrop-blur-[0.5px]"
          style={{ transform: "rotate(40deg)" }}
        />

        {/* Editable White Document Container with Tiptap Canvas */}
        <div className="w-full bg-white min-h-[720px] lg:min-h-[820px] border-r-[4px] border-b-[5px] border-[#E5E7EB] rounded-tl-[60px] sm:rounded-tl-[80px] rounded-tr-[50px] sm:rounded-tr-[70px] rounded-br-[50px] sm:rounded-br-[70px] rounded-bl-[60px] sm:rounded-bl-[80px] shadow-[8px_8px_6px_3px_rgba(27,28,28,0.25)] flex flex-col transition-all overflow-visible">
          <TiptapCanvas
            docId={`notebook-${notebookId}`}
            initialContent={content}
            isSaved={isSaved}
            onSave={handleSave}
            onExport={() =>
              toast.success("Export Complete", {
                description: `"${currentNotebook.title}" exported successfully!`,
              })
            }
            onShare={() => setIsShareModalOpen(true)}
            onContentChange={handleContentChange}
          />
        </div>
      </div>

      {/* Share Modal Backdrop - Portal to document.body for 100% full-site blur including Navbar & Sidebar */}
      {isShareModalOpen &&
        mounted &&
        createPortal(
          <div
            onClick={() => setIsShareModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
          >
            {/* Heavily Rounded White Modal Card with Black Border, Center Top Tape, & Strong Black Shadow */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-[48px] p-8 max-w-lg w-full shadow-[8px_8px_0px_#30312C] space-y-5 relative animate-scaleUp cursor-default"
            >
              {/* Tilted Center Top Tape Accent */}
              <div
                className="absolute -top-3.5 left-1/2 w-16 h-6 bg-white/80 border border-black/15 shadow-[0px_3px_6px_rgba(0,0,0,0.15)] pointer-events-none z-30 rounded-xs"
                style={{ transform: "translateX(-50%) rotate(-4deg)" }}
              />

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-header font-extrabold text-2xl text-[#30312C] tracking-tight">
                    Share with the Collective
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs font-body text-[#66645e]">
                    <Eye className="w-3.5 h-3.5 text-[#30312C]" />
                    <span>Anyone with the link can view</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-[#30312C] flex items-center justify-center text-[#30312C] hover:bg-white transition-colors cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Email Invite Input */}
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#66645e]">
                  <Pencil className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite others by email..."
                  className="w-full pl-10 pr-24 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!inviteEmail) return;
                    toast.success("Invite Dispatched", {
                      description: `Invitation sent to ${inviteEmail}`,
                    });
                    setInviteEmail("");
                  }}
                  className="absolute right-1.5 px-4 py-1.5 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1px_1px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer"
                >
                  Invite
                </button>
              </div>

              {/* Current Members List */}
              <div className="space-y-3 pt-1">
                <span className="font-body text-xs text-[#807d74] font-medium tracking-wide">
                  Current Members
                </span>

                <div className="space-y-3">
                  {/* Member 1 (Owner) */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/60 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#2c5e91] text-white font-header font-bold text-xs flex items-center justify-center border border-[#30312C]">
                        N
                      </div>
                      <div>
                        <h4 className="font-header font-bold text-xs text-[#30312C]">
                          Natty (You)
                        </h4>
                        <p className="font-body text-[11px] text-[#737067]">
                          Owner • natty@colab.design
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Clean Unbordered Owner Text with Circled Check */}
                    <div className="flex items-center space-x-1.5 text-xs font-header font-bold text-[#30312C]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      <span>Owner</span>
                    </div>
                  </div>

                  {/* Member 2 */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/60 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#fdd355] text-[#30312C] font-header font-bold text-xs flex items-center justify-center border border-[#30312C]">
                        M
                      </div>
                      <div>
                        <h4 className="font-header font-bold text-xs text-[#30312C]">
                          Maya Lin
                        </h4>
                        <p className="font-body text-[11px] text-[#737067]">
                          maya@colab.design
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Permission Dropdown */}
                    <select className="bg-white border border-[#30312C] font-header font-bold text-xs text-[#30312C] rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer">
                      <option value="sketch">Can sketch & edit</option>
                      <option value="view">Can view only</option>
                      <option value="remove">Remove</option>
                    </select>
                  </div>

                  {/* Member 3 */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/60 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-header font-bold text-xs flex items-center justify-center border border-[#30312C]">
                        L
                      </div>
                      <div>
                        <h4 className="font-header font-bold text-xs text-[#30312C]">
                          Leo Vance
                        </h4>
                        <p className="font-body text-[11px] text-[#737067]">
                          leo@colab.design
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Permission Dropdown */}
                    <select className="bg-white border border-[#30312C] font-header font-bold text-xs text-[#30312C] rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer">
                      <option value="view">Can view only</option>
                      <option value="sketch">Can sketch & edit</option>
                      <option value="remove">Remove</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dashed Line Divider */}
              <div className="border-t-2 border-dashed border-[#30312C]/20 pt-1" />

              {/* Bottom Copy Link Section (Unbuttoned, pure icon + text) */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setLinkCopied(true);
                    toast.info("Link Copied", {
                      description: "Notebook link copied to clipboard!",
                    });
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="text-[#30312C] hover:text-primary font-header font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4 text-[#30312C]" />
                  <span>{linkCopied ? "Link copied to clipboard!" : "Copy link"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

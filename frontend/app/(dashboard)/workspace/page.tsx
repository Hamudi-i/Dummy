"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WorkspaceItem } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { ItemSettingsModal } from "@/components/modals/ItemSettingsModal";
import { CreateWorkspaceModal } from "@/components/modals/CreateWorkspaceModal";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

export default function WorkspacesOverviewPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSettingsItem, setSelectedSettingsItem] = useState<WorkspaceItem | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("palette");

  useEffect(() => {
    api.getWorkspaces().then((items) => setWorkspaces(items.map((ws) => ({
      id: ws.id, title: ws.name, description: ws.description || "Collaborative workspace for notes and sketches.", icon: ws.icon || "palette", color: ws.color || "#2c5e91",
      notebookCount: ws.documents?.filter((doc) => !doc.isArchived).length || 0, lastUpdated: "recently", badgeLabel: "Workspace",
      badgeStyle: "bg-[#2c5e91]/15 text-[#2c5e91] border-[#2c5e91]/30", previewGradient: "from-[#2c5e91]/20 via-[#fdd355]/20 to-[#FAF7EE]",
    })))).catch((error) => toast.error("Could not load workspaces", { description: error.message }));
  }, []);

  const moveWorkspace = async (id: string, direction: "up" | "down") => {
    const index = workspaces.findIndex((workspace) => workspace.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= workspaces.length) return;
    const reordered = [...workspaces];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setWorkspaces(reordered);
    try {
      await Promise.all(reordered.map((workspace, sortOrder) => api.updateWorkspace(workspace.id, { sortOrder })));
    } catch (error) {
      setWorkspaces(workspaces);
      toast.error("Could not save workspace order", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newWorkspace: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || "Creative workspace for notes, sketches, and documents.",
      icon: newIcon || "palette",
      color: "#fdd355",
      notebookCount: 0,
      lastUpdated: "Just now",
      badgeLabel: "Workspace",
      badgeStyle: "bg-[#2c5e91]/15 text-[#2c5e91] border-[#2c5e91]/30",
      previewGradient: "from-[#2c5e91]/20 via-[#fdd355]/20 to-[#FAF7EE]",
    };

    setWorkspaces([newWorkspace, ...workspaces]);
    setNewTitle("");
    setNewDesc("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Header & Title Action */}
      <div className="space-y-3 pb-2">
        {/* Row 1: Header Title on Left & Action Button on Right (Same Line) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-[46px] px-5 bg-accent hover:bg-accent-hover text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-full border-1.5 border-[#30312C] shadow-[2px_2px_0px_#30312C] flex items-center space-x-2 transition-all active:translate-y-[1px] cursor-pointer shrink-0"
          >
            <span className="text-xl font-bold">+</span>
            <span>Create Workspace</span>
          </button>
        </div>

        {/* Row 2: Subheader below */}
        <p className="font-body text-base text-[#66645e] max-w-xl leading-relaxed">
          Welcome back! Pick up your pen where you left off or start a new collaborative canvas.
        </p>
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
              className={`group bg-[#FFFFFF] border-2 border-[#1B1C1C] rounded-tl-[160px] rounded-tr-[160px] rounded-br-[114px] rounded-bl-[14px] p-6 min-h-[355px] shadow-[5px_5px_0px_rgba(27,28,28,0.22)] hover:shadow-[7px_7px_0px_rgba(27,28,28,0.38)] ${currentRotation} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4 relative overflow-visible`}
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
                    setSelectedSettingsItem(ws);
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

              {/* 2. Rectangular Picture showing canvas preview placeholder */}
              <div className="w-[88%] mx-auto h-28 rounded-xl border-1.5 border-[#30312C]/30 overflow-hidden relative shadow-xs bg-[#FAF7EE] group-hover:scale-[1.01] transition-transform z-10 flex items-center justify-center">
                <img
                  src="/sketch-preview.jpg"
                  alt={`${ws.title} Canvas Preview`}
                  className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-1.5 right-2 px-2 py-0.5 bg-[#1B1C1C]/80 text-white rounded-md text-[9.5px] font-header font-bold tracking-wider backdrop-blur-xs">
                  Canvas Preview
                </div>
              </div>

              {/* 3. Workspace Name */}
              <h3 className="font-header text-xl font-extrabold text-[#30312C] group-hover:text-primary transition-colors relative z-10">
                {ws.title}
              </h3>

              {/* 4. Bottom Row: Edited Time (Bottom Left) & Notebook Count (Bottom Right) */}
              <div className="flex items-center justify-between pt-2 border-t border-[#30312C]/10 relative z-10">
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
            onClick={() => toast.info("Privacy Policy", { description: "Co-Lab respects your creative data privacy." })}
            className="underline hover:text-primary transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => toast.info("Terms of Service", { description: "Co-Lab terms of service and workspace guidelines." })}
            className="underline hover:text-primary transition-colors cursor-pointer"
          >
            Terms
          </button>
        </footer>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWorkspaceCreated={async (newWs) => {
          const saved = await api.createWorkspace({ name: newWs.title, description: newWs.description, icon: newWs.icon });
          const workspaceItem: WorkspaceItem = {
            id: saved.id,
            title: saved.name,
            description: newWs.description,
            icon: newWs.icon,
            color: "#fdd355",
            notebookCount: 0,
            lastUpdated: "Just now",
            badgeLabel: "Workspace",
            badgeStyle: "bg-[#2c5e91]/15 text-[#2c5e91] border-[#2c5e91]/30",
            previewGradient: "from-[#2c5e91]/20 via-[#fdd355]/20 to-[#FAF7EE]",
          };
          setWorkspaces([workspaceItem, ...workspaces]);
          return saved;
        }}
      />
      {/* Item Settings Modal */}
      <ItemSettingsModal
        isOpen={Boolean(selectedSettingsItem)}
        onClose={() => setSelectedSettingsItem(null)}
        item={
          selectedSettingsItem
            ? {
                id: selectedSettingsItem.id,
                title: selectedSettingsItem.title,
                description: selectedSettingsItem.description,
                icon: selectedSettingsItem.icon,
                type: "workspace",
              }
            : null
        }
        onSave={async (updated) => {
          await api.updateWorkspace(updated.id, { name: updated.title, description: updated.description });
          setWorkspaces((prev) =>
            prev.map((w) =>
              w.id === updated.id
                ? { ...w, title: updated.title, description: updated.description || w.description }
                : w
            )
          );
        }}
        onArchive={(id) => {
          toast.info("Workspace archiving is not available in the backend yet.");
        }}
        onDelete={async (id) => {
          await api.deleteWorkspace(id);
          setWorkspaces((prev) => prev.filter((w) => w.id !== id));
        }}
        onMove={moveWorkspace}
      />
    </div>
  );
}

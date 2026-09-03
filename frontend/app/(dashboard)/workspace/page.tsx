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
    <div className="space-y-8 animate-fadeIn select-none">
      {/* Header & Title Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#30312C]/10 pb-5">
        <div>
          <h1 className="font-header text-3xl sm:text-4xl font-extrabold text-[#30312C] tracking-tight">
            Workspaces
          </h1>
          <p className="font-body text-base text-[#66645e] mt-1">
            Select a workspace to explore its notebooks or create a new space for your team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-center h-[46px] px-5 bg-accent hover:bg-accent-hover text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-full border-1.5 border-[#30312C] shadow-[2px_2px_0px_#30312C] flex items-center space-x-2 transition-all active:translate-y-[1px] cursor-pointer shrink-0"
        >
          <span className="text-xl font-bold">+</span>
          <span>Create Workspace</span>
        </button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <Link
            key={ws.id}
            href={`/workspace/${ws.id}`}
            className="group bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 shadow-[3px_3px_0px_#30312C] hover:shadow-[5px_5px_0px_#30312C] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-1.5 border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C]"
                  style={{ backgroundColor: ws.color }}
                >
                  {ws.icon}
                </div>
                <span className="font-body text-xs font-semibold text-[#807d74] bg-[#efe9d9] px-2.5 py-1 rounded-full border border-[#30312C]/20">
                  {ws.notebookCount} {ws.notebookCount === 1 ? "Notebook" : "Notebooks"}
                </span>
              </div>

              <div>
                <h3 className="font-header text-xl font-bold text-[#30312C] group-hover:text-primary transition-colors">
                  {ws.title}
                </h3>
                <p className="font-body text-[14.5px] text-[#55534c] mt-1.5 leading-relaxed line-clamp-2">
                  {ws.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#30312C]/10 flex items-center justify-between text-xs font-body text-[#737067]">
              <span>Updated {ws.lastUpdated}</span>
              <span className="font-header font-bold text-primary flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Open Workspace</span>
                <span>→</span>
              </span>
            </div>
          </Link>
        ))}
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
                      className={`w-10 h-10 rounded-xl border border-[#30312C] text-xl flex items-center justify-center ${
                        newIcon === emoji ? "bg-accent shadow-[1.5px_1.5px_0px_#30312C]" : "bg-[#FFFFFF]"
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

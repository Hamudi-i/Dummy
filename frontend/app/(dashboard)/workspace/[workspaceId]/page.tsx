"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_WORKSPACES, INITIAL_NOTEBOOKS, NotebookItem } from "@/lib/mock-data";

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
  const [newIcon, setNewIcon] = useState("📘");

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNotebook: NotebookItem = {
      id: `nb-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      title: newTitle.trim(),
      description: newDesc.trim() || "Interactive notebook canvas for notes and drawings.",
      icon: newIcon || "📘",
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
    <div className="space-y-8 animate-fadeIn select-none">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3 border-b-2 border-[#30312C]/10 pb-5">
        <div className="flex items-center space-x-2 text-xs font-body text-[#737067]">
          <Link href="/workspace" className="hover:text-primary transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#30312C]">{currentWorkspace.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-1.5 border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] shrink-0 mt-1"
              style={{ backgroundColor: currentWorkspace.color }}
            >
              {currentWorkspace.icon}
            </div>
            <div>
              <h1 className="font-header text-3xl sm:text-4xl font-extrabold text-[#30312C] tracking-tight">
                {currentWorkspace.title}
              </h1>
              <p className="font-body text-base text-[#66645e] mt-1 max-w-2xl">
                {currentWorkspace.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-center h-[46px] px-5 bg-accent hover:bg-accent-hover text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-full border-1.5 border-[#30312C] shadow-[2px_2px_0px_#30312C] flex items-center space-x-2 transition-all active:translate-y-[1px] cursor-pointer shrink-0"
          >
            <span className="text-xl font-bold">+</span>
            <span>New Notebook</span>
          </button>
        </div>
      </div>

      {/* Notebooks Grid */}
      <div className="space-y-4">
        <h2 className="font-header text-2xl font-bold text-[#30312C]">
          Notebooks ({notebooks.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notebooks.map((nb) => (
            <Link
              key={nb.id}
              href={`/workspace/${currentWorkspace.id}/notebook/${nb.id}`}
              className="group bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 shadow-[3px_3px_0px_#30312C] hover:shadow-[5px_5px_0px_#30312C] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#30312C] flex items-center justify-center text-xl shadow-xs">
                    {nb.icon}
                  </div>
                  <span className="font-body text-xs font-semibold text-[#807d74] bg-[#efe9d9] px-2.5 py-0.5 rounded-full border border-[#30312C]/15">
                    {nb.pageCount} Pages
                  </span>
                </div>

                <div>
                  <h3 className="font-header text-lg font-bold text-[#30312C] group-hover:text-primary transition-colors">
                    {nb.title}
                  </h3>
                  <p className="font-body text-[14px] text-[#55534c] mt-1 leading-relaxed line-clamp-2">
                    {nb.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#30312C]/10 flex items-center justify-between text-xs font-body text-[#737067]">
                <span>Edited {nb.lastEdited}</span>
                <span className="font-header font-bold text-primary flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Notebook</span>
                  <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
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
                  {["📘", "🎨", "🦊", "📊", "⚡", "🖋️"].map((emoji) => (
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

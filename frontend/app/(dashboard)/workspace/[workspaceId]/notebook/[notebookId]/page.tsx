"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_WORKSPACES, INITIAL_NOTEBOOKS } from "@/lib/mock-data";

export default function NotebookEditorPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "ws-design-system";
  const notebookId = (params?.notebookId as string) || "nb-components";

  const currentWorkspace =
    INITIAL_WORKSPACES.find((w) => w.id === workspaceId) || INITIAL_WORKSPACES[0];

  const currentNotebook =
    INITIAL_NOTEBOOKS.find((n) => n.id === notebookId) || INITIAL_NOTEBOOKS[0];

  const [activeTab, setActiveTab] = useState("page-1");
  const [selectedTool, setSelectedTool] = useState<"pen" | "sticky" | "text" | "select">("pen");
  const [notesText, setNotesText] = useState(
    "## 📐 Component Specs & Guidelines\n\n- **Primary Accent**: `#fdd355`\n- **Brand Blue**: `#2c5e91`\n- **Border Rules**: Solid `1.8px #30312C` sketch borders\n- **Typography**: `Bricolage Grotesque` for headers and `Be Vietnam Pro` for body."
  );

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-3 border-b-2 border-[#30312C]/10 pb-4">
        <div className="flex items-center space-x-2 text-xs font-body text-[#737067]">
          <Link href="/workspace" className="hover:text-primary transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <Link href={`/workspace/${currentWorkspace.id}`} className="hover:text-primary transition-colors">
            {currentWorkspace.title}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#30312C]">{currentNotebook.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#30312C] flex items-center justify-center text-2xl shadow-xs">
              {currentNotebook.icon}
            </div>
            <div>
              <h1 className="font-header text-2xl sm:text-3xl font-extrabold text-[#30312C] tracking-tight">
                {currentNotebook.title}
              </h1>
              <p className="font-body text-xs sm:text-sm text-[#66645e]">
                {currentNotebook.description}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Notebook exported as PDF!")}
              className="h-9 px-3.5 bg-[#FAF7EE] hover:bg-[#e8e2d3] text-[#30312C] font-header font-bold text-xs rounded-lg border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => alert("Share link copied to clipboard!")}
              className="h-9 px-4 bg-primary text-white font-header font-bold text-xs rounded-lg border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer"
            >
              Share Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar & Canvas Container */}
      <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl shadow-[4px_4px_0px_#30312C] overflow-hidden flex flex-col min-h-[550px]">
        {/* Toolbar Header */}
        <div className="bg-[#efe8d8] border-b-2 border-[#30312C] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Page Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {["page-1", "page-2", "page-3"].map((tab, idx) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-header font-bold transition-all border ${
                  activeTab === tab
                    ? "bg-accent text-[#30312C] border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-[#FAF7EE] text-[#5A5852] border-transparent hover:bg-white"
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => alert("New page added to notebook!")}
              className="px-2 py-1 text-xs font-bold text-[#30312C] hover:bg-white rounded-lg transition-colors"
            >
              + Add Page
            </button>
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center space-x-1 bg-[#FAF7EE] p-1 rounded-xl border border-[#30312C]">
            {[
              { id: "pen", label: "✏️ Pen" },
              { id: "sticky", label: "🟨 Sticky Note" },
              { id: "text", label: "📝 Text" },
              { id: "select", label: "🖐️ Move" },
            ].map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedTool(tool.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-body font-semibold transition-all ${
                  selectedTool === tool.id
                    ? "bg-primary text-white border border-[#30312C]"
                    : "text-[#30312C] hover:bg-white"
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </div>

        {/* Working Workspace Canvas */}
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[radial-gradient(#30312C_1px,transparent_1px)] [background-size:20px_20px] bg-opacity-[0.03]">
          {/* Left / Center: Interactive Note Area */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border-1.5 border-[#30312C] rounded-xl p-5 shadow-[2px_2px_0px_#30312C] space-y-3">
              <div className="flex items-center justify-between border-b border-[#30312C]/10 pb-2">
                <span className="font-header font-bold text-xs text-primary">Interactive Working Area</span>
                <span className="font-body text-xs text-[#807d74]">Tool Active: {selectedTool.toUpperCase()}</span>
              </div>
              <textarea
                rows={12}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full font-body text-sm text-[#30312C] leading-relaxed focus:outline-none bg-transparent resize-none"
              />
            </div>
          </div>

          {/* Right: Sticky Notes & Brainstorming Board */}
          <div className="space-y-4">
            {/* Sticky Note 1 */}
            <div className="bg-[#fdd355] border-1.5 border-[#30312C] rounded-xl p-4 shadow-[3px_3px_0px_#30312C] transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between text-xs font-header font-bold text-[#30312C] mb-2">
                <span>📌 Action Items</span>
                <span>Today</span>
              </div>
              <p className="font-body text-xs text-[#30312C] leading-relaxed">
                Review Figma + New Sketch button dimensions & typography tokens with team.
              </p>
            </div>

            {/* Sticky Note 2 */}
            <div className="bg-[#FAF7EE] border-1.5 border-[#30312C] rounded-xl p-4 shadow-[3px_3px_0px_#30312C] transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between text-xs font-header font-bold text-[#2c5e91] mb-2">
                <span>💡 Design Note</span>
                <span>Idea</span>
              </div>
              <p className="font-body text-xs text-[#30312C] leading-relaxed">
                Ensure Bricolage Grotesque & Be Vietnam Pro render crisply on high-DPI displays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

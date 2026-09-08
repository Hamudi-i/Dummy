"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_WORKSPACES, INITIAL_NOTEBOOKS } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  Highlighter,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Share2,
  Download,
} from "lucide-react";

export default function NotebookEditorPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "ws-design-system";
  const notebookId = (params?.notebookId as string) || "nb-components";

  const currentWorkspace =
    INITIAL_WORKSPACES.find((w) => w.id === workspaceId) || INITIAL_WORKSPACES[0];

  const currentNotebook =
    INITIAL_NOTEBOOKS.find((n) => n.id === notebookId) || INITIAL_NOTEBOOKS[0];

  const [content, setContent] = useState(
    "📐 Component Specifications & Guidelines\n\n- Primary Accent: #fdd355\n- Brand Blue: #2c5e91\n- Border Rules: Solid 1.8px #30312C sketch borders\n- Typography: Bricolage Grotesque for headers and Be Vietnam Pro for body.\n\nType here to start editing your notebook canvas..."
  );

  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    highlight: false,
  });

  const toggleFormat = (format: string) => {
    setActiveFormats((prev) => ({ ...prev, [format]: !prev[format] }));
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

        {/* Title Header with Random Tilt & SVG Underline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
            <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
              <span className="text-[#30312C]">
                <IconRenderer name={currentNotebook.icon} className="w-9 h-9 text-[#30312C]" />
              </span>
              <span>{currentNotebook.title}</span>
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

          {/* Action Tools */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Notebook exported!")}
              className="h-10 px-4 bg-white hover:bg-[#FAF7EE] text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Share link copied!")}
              className="h-10 px-4 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
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

        {/* 2 Collaborator Profile Badges (Pushed Far Right) */}
        <div className="absolute top-4 -right-22 sm:-right-32 md:-right-22 z-40 flex flex-col items-center space-y-3">
          {/* Avatar Circle 1 */}
          <div className="relative group cursor-pointer" title="Natty (Active Collaborator)">
            <div className="w-9.5 h-9.5 rounded-full bg-[#FAF7EE] border-1.5 border-[#30312C] shadow-[2px_1.5px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#2c5e91] text-white font-header font-bold text-xs flex items-center justify-center">
                N
              </div>
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#2c5e91] shadow-xs"
              title="Online & Editing"
            />
          </div>

          {/* Avatar Circle 2 */}
          <div className="relative group cursor-pointer" title="Maya (Design Lead)">
            <div className="w-9.5 h-9.5 rounded-full bg-[#FAF7EE] border-1.5 border-[#30312C] shadow-[2px_1.5px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#fdd355] text-[#30312C] font-header font-bold text-xs flex items-center justify-center">
                M
              </div>
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#2c5e91] shadow-xs"
              title="Online & Editing"
            />
          </div>
        </div>

        {/* Editable White Document Container */}
        <div className="w-full bg-white min-h-[720px] lg:min-h-[820px] border-r-[4px] border-b-[5px] border-[#E5E7EB] rounded-tl-[60px] sm:rounded-tl-[80px] rounded-tr-[50px] sm:rounded-tr-[70px] rounded-br-[50px] sm:rounded-br-[70px] rounded-bl-[60px] sm:rounded-bl-[80px] shadow-[8px_8px_6px_3px_rgba(27,28,28,0.25)] overflow-hidden flex flex-col transition-all">
          {/* Formatting Toolbar - Clear Background */}
          <div className="bg-white px-8 sm:px-12 pt-7 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-1 flex-wrap gap-y-1">
              {/* Bold */}
              <button
                type="button"
                onClick={() => toggleFormat("bold")}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  activeFormats.bold
                    ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => toggleFormat("italic")}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  activeFormats.italic
                    ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>

              {/* Underline */}
              <button
                type="button"
                onClick={() => toggleFormat("underline")}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  activeFormats.underline
                    ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
                }`}
                title="Underline"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>

              {/* Strikethrough */}
              <button
                type="button"
                onClick={() => toggleFormat("strikethrough")}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  activeFormats.strikethrough
                    ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <span className="w-[1.5px] h-5 bg-[#30312C]/20 mx-1" />

              {/* Code */}
              <button
                type="button"
                onClick={() => toggleFormat("code")}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  activeFormats.code
                    ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
                }`}
                title="Code Inline"
              >
                <CodeIcon className="w-4 h-4" />
              </button>

              {/* Highlight */}
              <button
                type="button"
                onClick={() => toggleFormat("highlight")}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  activeFormats.highlight
                    ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
                    : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
                }`}
                title="Highlight"
              >
                <Highlighter className="w-4 h-4 text-amber-600" />
              </button>

              <span className="w-[1.5px] h-5 bg-[#30312C]/20 mx-1" />

              {/* Headings */}
              <button
                type="button"
                className="p-2 rounded-lg bg-white border border-transparent hover:bg-[#FAF7EE] text-[#30312C] transition-all cursor-pointer"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-2 rounded-lg bg-white border border-transparent hover:bg-[#FAF7EE] text-[#30312C] transition-all cursor-pointer"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <span className="w-[1.5px] h-5 bg-[#30312C]/20 mx-1" />

              {/* Bullet List */}
              <button
                type="button"
                className="p-2 rounded-lg bg-white border border-transparent hover:bg-[#FAF7EE] text-[#30312C] transition-all cursor-pointer"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>

              {/* Numbered List */}
              <button
                type="button"
                className="p-2 rounded-lg bg-white border border-transparent hover:bg-[#FAF7EE] text-[#30312C] transition-all cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              {/* Task Checklist */}
              <button
                type="button"
                className="p-2 rounded-lg bg-white border border-transparent hover:bg-[#FAF7EE] text-[#30312C] transition-all cursor-pointer"
                title="Task List"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inset Dashed Divider Line (Does not touch outer edges) */}
          <div className="px-8 sm:px-12">
            <div className="border-b-2 border-dashed border-[#30312C]/20 w-full" />
          </div>

          {/* Editable Area */}
          <div className="px-8 sm:px-12 pb-10 pt-5 flex-1 bg-white flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your document..."
              className="w-full h-full min-h-[420px] bg-transparent font-body text-base text-[#30312C] leading-relaxed focus:outline-none resize-none"
              style={{
                fontWeight: activeFormats.bold ? "bold" : "normal",
                fontStyle: activeFormats.italic ? "italic" : "normal",
                textDecoration: [
                  activeFormats.underline ? "underline" : "",
                  activeFormats.strikethrough ? "line-through" : "",
                ]
                  .filter(Boolean)
                  .join(" "),
                backgroundColor: activeFormats.highlight ? "#fef08a" : "transparent",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

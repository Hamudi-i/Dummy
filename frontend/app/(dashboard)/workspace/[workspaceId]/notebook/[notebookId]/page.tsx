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
    `📐 Component Specifications & Guidelines\n\n- Primary Accent: #fdd355\n- Brand Blue: #2c5e91\n- Border Rules: Solid 1.8px #30312C sketch borders\n- Typography: Bricolage Grotesque for headers and Be Vietnam Pro for body.\n\nType here to start editing your notebook canvas...`
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

      {/* Editable White Document Container */}
      <div className="mt-12 w-full max-w-[896px] mx-auto bg-white min-h-[856.8px] h-[917px] border-r-[4px] border-b-[5px] border-[#E5E7EB] rounded-tl-[135px] rounded-tr-[120px] rounded-br-[120px] rounded-bl-[135px] shadow-[8px_8px_8px_0px_rgba(27,28,28,0.1)] overflow-hidden flex flex-col transition-all">
        {/* Formatting Toolbar - Clear Background with Dashed Divider */}
        <div className="bg-white border-b-2 border-dashed border-[#30312C]/20 px-14 sm:px-20 pt-10 pb-4 flex flex-wrap items-center justify-between gap-3">
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

        {/* Editable Area */}
        <div className="px-14 sm:px-20 pb-12 pt-6 flex-1 bg-white">
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
  );
}

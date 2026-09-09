"use client";

import React from "react";
import { Editor } from "@tiptap/react";
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
  Check,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  isSaved: boolean;
  onSave: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function EditorToolbar({
  editor,
  isSaved,
  onSave,
  onExport,
  onShare,
}: EditorToolbarProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      forceUpdate();
    };

    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="bg-white px-8 sm:px-12 pt-7 pb-3 flex items-center justify-between border-b border-[#30312C]/10 min-h-[64px]">
        <div className="h-6 w-48 bg-[#FAF7EE] animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="bg-white px-6 sm:px-10 pt-6 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#30312C]/10 select-none">
      {/* Left Side: Text Formatting Tools */}
      <div className="flex items-center space-x-1 flex-wrap gap-y-1">
        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("bold")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("italic")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("underline")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("strike")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-[1.5px] h-5 bg-[#30312C]/20 mx-1" />

        {/* Code Inline */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("code")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Inline Code"
        >
          <CodeIcon className="w-4 h-4" />
        </button>

        {/* Highlight */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("highlight")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Highlight Text"
        >
          <Highlighter className="w-4 h-4 text-amber-600" />
        </button>

        <span className="w-[1.5px] h-5 bg-[#30312C]/20 mx-1" />

        {/* Heading 1 */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("heading", { level: 1 })
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <span className="w-[1.5px] h-5 bg-[#30312C]/20 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Task List / Checklist */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("taskList")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Checklist"
        >
          <CheckSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Right Side: Document Actions (Save, Export, Share) */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaved}
          className={`h-9 px-3.5 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all flex items-center space-x-1.5 ${
            isSaved
              ? "bg-[#FAF7EE] text-[#737067] border-[#30312C]/30 cursor-default opacity-80"
              : "bg-[#30312C] text-white hover:bg-[#42443d] shadow-[1.5px_1.5px_0px_#30312C] cursor-pointer"
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{isSaved ? "Saved" : "Save Changes"}</span>
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="h-9 px-3.5 bg-[#FAF7EE] hover:bg-white text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onShare}
          className="h-9 px-3.5 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

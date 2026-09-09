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
  Image as ImageIcon,
  Upload,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
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
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

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

  // Global Keyboard Shortcut: Ctrl+S / Cmd+S for Save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImageUrl = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsImageModalOpen(false);
    }
  };

  if (!editor) {
    return (
      <div className="bg-white px-8 sm:px-12 pt-7 pb-3 flex items-center justify-between border-b border-[#30312C]/10 min-h-[64px]">
        <div className="h-6 w-48 bg-[#FAF7EE] animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 sm:px-10 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#30312C]/15 select-none transition-all shadow-xs">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

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

        {/* Insert Image */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsImageModalOpen(true)}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive("image")
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Insert Image (Upload or URL)"
        >
          <ImageIcon className="w-4 h-4 text-emerald-700" />
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

        {/* Align Left */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive({ textAlign: "left" })
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        {/* Align Center */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive({ textAlign: "center" })
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        {/* Align Right */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            editor.isActive({ textAlign: "right" })
              ? "bg-accent border-[#30312C] shadow-[1px_1px_0px_#30312C]"
              : "bg-white border-transparent hover:bg-[#FAF7EE] text-[#30312C]"
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
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
      <div className="flex items-center space-x-1.5 shrink-0">
        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaved}
          className={`h-8 px-2.5 font-header font-bold text-[11px] rounded-lg border border-[#30312C] transition-all flex items-center space-x-1 ${
            isSaved
              ? "bg-[#FAF7EE] text-[#737067] border-[#30312C]/30 cursor-default opacity-80"
              : "bg-[#30312C] text-white hover:bg-[#42443d] shadow-[1px_1px_0px_#30312C] cursor-pointer"
          }`}
          title="Save Changes (Ctrl+S)"
        >
          <Check className="w-3 h-3" />
          <span>{isSaved ? "Saved" : "Save Changes"}</span>
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="h-8 px-2.5 bg-[#FAF7EE] hover:bg-white text-[#30312C] font-header font-bold text-[11px] rounded-lg border border-[#30312C] shadow-[1px_1px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onShare}
          className="h-8 px-2.5 bg-primary text-white font-header font-bold text-[11px] rounded-lg border border-[#30312C] shadow-[1px_1px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer flex items-center space-x-1"
        >
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </button>
      </div>

      {/* Insert Image Modal */}
      {isImageModalOpen && (
        <div
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-3xl p-6 max-w-md w-full shadow-[8px_8px_0px_#30312C] space-y-4 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-header font-extrabold text-xl text-[#30312C] flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                <span>Insert Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="w-7 h-7 rounded-full border border-[#30312C] flex items-center justify-center text-[#30312C] hover:bg-white transition-colors cursor-pointer font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: File Upload */}
            <div className="space-y-2 pt-1">
              <span className="font-header font-bold text-xs text-[#66645e]">Option 1: Upload from Device</span>
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                  setIsImageModalOpen(false);
                }}
                className="w-full py-3 bg-white hover:bg-[#FAF7EE] border-1.5 border-dashed border-[#30312C] rounded-2xl flex items-center justify-center space-x-2 text-xs font-header font-bold text-[#30312C] cursor-pointer transition-all shadow-xs"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Choose Image File (PNG, JPG, WEBP)</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 py-1">
              <div className="border-t border-[#30312C]/20 flex-1" />
              <span className="text-[10px] font-header font-bold uppercase text-[#807d74]">OR</span>
              <div className="border-t border-[#30312C]/20 flex-1" />
            </div>

            {/* Option 2: Image URL */}
            <div className="space-y-2">
              <span className="font-header font-bold text-xs text-[#66645e]">Option 2: Image URL</span>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="flex-1 px-3 py-2 bg-white border border-[#30312C] rounded-xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleInsertImageUrl}
                  disabled={!imageUrl}
                  className="px-4 py-2 bg-primary disabled:opacity-50 text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


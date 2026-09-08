"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { INITIAL_WORKSPACES } from "@/lib/mock-data";
import { X, Plus, BookPlus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWorkspaceId?: string;
  onNotebookCreated?: (newNotebook: {
    id: string;
    workspaceId: string;
    title: string;
    description: string;
    icon: string;
  }) => void;
}

export const CreateNotebookModal: React.FC<CreateNotebookModalProps> = ({
  isOpen,
  onClose,
  defaultWorkspaceId = "ws-design-system",
  onNotebookCreated,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("book-open");
  const [workspaceId, setWorkspaceId] = useState(defaultWorkspaceId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (defaultWorkspaceId) {
      setWorkspaceId(defaultWorkspaceId);
    }
  }, [defaultWorkspaceId]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title Required", {
        description: "Please enter a title for your new notebook.",
      });
      return;
    }

    const newId = `nb-${Date.now()}`;
    const newNotebook = {
      id: newId,
      workspaceId,
      title: title.trim(),
      description: description.trim() || "Interactive notebook canvas for notes and drawings.",
      icon: icon || "book-open",
    };

    if (onNotebookCreated) {
      onNotebookCreated(newNotebook);
    }

    toast.success("Notebook Canvas Created!", {
      description: `Opening notebook "${newNotebook.title}"...`,
    });

    setTitle("");
    setDescription("");
    onClose();
    router.push(`/workspace/${workspaceId}/notebook/${newId}`);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
    >
      {/* Modal Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-6 sm:p-8 shadow-[8px_8px_0px_#30312C] space-y-5 text-[#30312C] animate-scaleIn"
      >
        {/* Tilted Top Tape Accent */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-white/70 border border-black/15 shadow-xs pointer-events-none rounded-xs backdrop-blur-[0.5px] z-20"
          style={{ transform: "translateX(-50%) rotate(-3deg)" }}
        />

        {/* Header Section */}
        <div className="flex items-start justify-between pt-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#fdd355] text-[#30312C] rounded-2xl border border-[#30312C] shadow-[2px_2px_0px_#30312C]">
              <BookPlus className="w-6 h-6 text-[#30312C]" />
            </div>
            <div>
              <h2 className="font-header text-xl font-extrabold text-[#30312C] leading-tight">
                Create Notebook
              </h2>
              <p className="font-body text-xs text-[#737067]">
                Add a new interactive document canvas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#30312C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Workspace Picker */}
          <div className="space-y-1.5">
            <label className="font-header font-bold text-xs text-[#30312C]">
              Target Workspace
            </label>
            <select
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-header font-bold text-xs text-[#30312C] focus:outline-none cursor-pointer shadow-xs"
            >
              {INITIAL_WORKSPACES.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.title}
                </option>
              ))}
            </select>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="font-header font-bold text-xs text-[#30312C]">
              Choose Notebook Icon
            </label>
            <div className="flex items-center space-x-2.5">
              {["book-open", "file-text", "layers", "pen-tool", "code", "compass"].map((iconKey) => (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setIcon(iconKey)}
                  className={`w-10 h-10 rounded-xl border border-[#30312C] flex items-center justify-center transition-all cursor-pointer ${
                    icon === iconKey
                      ? "bg-accent shadow-[1.5px_1.5px_0px_#30312C] scale-105"
                      : "bg-white hover:bg-neutral-50"
                  }`}
                >
                  <IconRenderer name={iconKey} className="w-5 h-5 text-[#30312C]" />
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="font-header font-bold text-xs text-[#30312C]">
              Notebook Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Component Guidelines & Specs"
              className="w-full px-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="font-header font-bold text-xs text-[#30312C]">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of notes, sketches, or guidelines..."
              className="w-full p-3 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t-2 border-dashed border-[#30312C]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Notebook</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

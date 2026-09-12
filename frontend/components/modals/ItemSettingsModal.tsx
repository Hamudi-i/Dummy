"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { X, Pencil, Archive, Trash2, Check, AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";

export interface ItemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    type: "workspace" | "notebook";
  } | null;
  onSave?: (updatedItem: { id: string; title: string; description?: string }) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: "up" | "down") => Promise<void> | void;
}

export const ItemSettingsModal: React.FC<ItemSettingsModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
  onArchive,
  onDelete,
  onMove,
}) => {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || "");
      setConfirmDelete(false);
    }
  }, [item]);

  if (!isOpen || !item || !mounted) return null;

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title Required", { description: "Please enter a valid title." });
      return;
    }
    if (onSave) {
      onSave({ id: item.id, title, description });
    }
    toast.success("Settings Saved", {
      description: `Updated settings for "${title}".`,
    });
    onClose();
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(item.id);
    }
    toast.success("Item Archived", {
      description: `"${item.title}" moved to the Archive vault.`,
    });
    onClose();
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
    toast.error("Item Deleted", {
      description: `"${item.title}" has been permanently removed.`,
    });
    onClose();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
    >
      {/* Modal Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#FAF7EE] border-2 border-[#30312C] rounded-[40px] p-6 sm:p-8 shadow-[8px_8px_0px_#30312C] space-y-6 text-[#30312C] animate-scaleIn"
      >
        {/* Tilted Top Tape Accent */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-white/70 border border-black/15 shadow-xs pointer-events-none rounded-xs backdrop-blur-[0.5px] z-20"
          style={{ transform: "translateX(-50%) rotate(-3deg)" }}
        />

        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 pt-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white rounded-2xl border border-[#30312C] shadow-[2px_2px_0px_#30312C]">
              <IconRenderer name={item.icon || (item.type === "workspace" ? "Folder" : "BookOpen")} className="w-6 h-6 text-[#30312C]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-header font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 rounded-md">
                  {item.type}
                </span>
              </div>
              <h2 className="font-header text-xl font-extrabold text-[#30312C] leading-tight mt-0.5">
                {item.type === "workspace" ? "Workspace Settings" : "Notebook Settings"}
              </h2>
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

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-header font-bold text-xs text-[#30312C]">
              Title
            </label>
            <div className="relative flex items-center">
              <Pencil className="absolute left-3.5 w-4 h-4 text-[#737067] pointer-events-none" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-header font-bold text-xs text-[#30312C]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or purpose..."
              rows={3}
              className="w-full p-3 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs resize-none"
            />
          </div>
        </div>

        {/* Quick Action Options */}
        <div className="space-y-2 pt-2 border-t-2 border-dashed border-[#30312C]/20">
          <span className="font-body text-xs text-[#737067] font-medium tracking-wide">
            Management Options
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={() => onMove?.(item.id, "up")} disabled={!onMove} className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 disabled:opacity-40 text-[#30312C] font-header font-bold text-xs rounded-2xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center justify-center space-x-2">
              <ArrowUp className="w-4 h-4" /><span>Move Up</span>
            </button>
            <button type="button" onClick={() => onMove?.(item.id, "down")} disabled={!onMove} className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 disabled:opacity-40 text-[#30312C] font-header font-bold text-xs rounded-2xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center justify-center space-x-2">
              <ArrowDown className="w-4 h-4" /><span>Move Down</span>
            </button>
            {/* Archive Button */}
            <button
              type="button"
              onClick={handleArchive}
              className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-header font-bold text-xs rounded-2xl border border-amber-300 shadow-[1.5px_1.5px_0px_#78350f] transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Archive className="w-4 h-4 text-amber-700" />
              <span>Archive</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDelete}
              className={`px-3.5 py-2.5 font-header font-bold text-xs rounded-2xl border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                confirmDelete
                  ? "bg-rose-600 text-white border-rose-800 shadow-[1.5px_1.5px_0px_#9f1239] animate-bounceOnce"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300 shadow-[1.5px_1.5px_0px_#9f1239]"
              }`}
            >
              {confirmDelete ? (
                <>
                  <AlertCircle className="w-4 h-4 text-white" />
                  <span>Confirm?</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 text-rose-700" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
        {/* Confirm Delete Modal */}
        <ConfirmDeleteModal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleConfirmDelete}
          itemTitle={item.title}
          itemType={item.type}
        />
      </div>
    </div>,
    document.body
  );
};

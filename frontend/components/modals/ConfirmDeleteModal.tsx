"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, Trash2 } from "lucide-react";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle?: string;
  itemType?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle = "this item",
  itemType = "item",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-6 sm:p-7 shadow-[8px_8px_0px_#30312C] space-y-5 text-[#30312C] animate-scaleIn"
      >
        {/* Tilted Top Tape Accent */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-white/70 border border-black/15 shadow-xs pointer-events-none rounded-xs backdrop-blur-[0.5px] z-20"
          style={{ transform: "translateX(-50%) rotate(-3deg)" }}
        />

        {/* Warning Header */}
        <div className="flex items-start justify-between pt-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-100 text-rose-800 rounded-2xl border border-rose-400 shadow-[2px_2px_0px_#9f1239]">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
            </div>
            <div>
              <h3 className="font-header text-lg font-extrabold text-[#30312C] leading-tight">
                Delete {itemType}?
              </h3>
              <p className="font-body text-[11px] text-rose-800 font-semibold">
                Action cannot be undone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#30312C] transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Question Text */}
        <p className="font-body text-xs text-[#55534c] leading-relaxed">
          Are you sure you want to delete <strong className="text-[#30312C]">"{itemTitle}"</strong>? It will be permanently removed.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5 pt-2 border-t-2 border-dashed border-[#30312C]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-header font-bold text-xs rounded-xl border border-rose-800 shadow-[1.5px_1.5px_0px_#9f1239] transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

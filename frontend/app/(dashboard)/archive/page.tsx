"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getArchivedItems, restoreItem, deleteArchivedItem, ArchivedItem } from "@/lib/archive-store";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { Archive, RotateCcw, Trash2, Folder, BookOpen, Search } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function ArchivePage() {
  const [archivedList, setArchivedList] = useState<ArchivedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "workspace" | "notebook">("all");

  useEffect(() => {
    setArchivedList(getArchivedItems());
  }, []);

  const handleRestore = (id: string, title: string) => {
    restoreItem(id);
    setArchivedList(getArchivedItems());
    toast.success("Restored Successfully", {
      description: `"${title}" has been restored to your active workspace.`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    deleteArchivedItem(id);
    setArchivedList(getArchivedItems());
    toast.error("Permanently Deleted", {
      description: `"${title}" removed from the archive vault.`,
    });
  };

  const filteredItems = archivedList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
          <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
            <Archive className="w-10 h-10 text-amber-700" />
            <span>Archive Vault</span>
            <span className="px-3 py-1 text-xs font-header font-bold text-amber-900 bg-amber-100 border border-amber-400 rounded-full translate-y-0.5">
              {archivedList.length} stored
            </span>
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
        <p className="font-body text-sm text-[#737067] max-w-xl">
          Historical project boards, inactive workspaces, and archived notebooks stored safely for future reference.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737067]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive vault..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-[2px_2px_0px_#30312C]"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(["all", "workspace", "notebook"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all cursor-pointer capitalize ${
                filterType === type
                  ? "bg-primary text-white shadow-[1.5px_1.5px_0px_#30312C]"
                  : "bg-white text-[#30312C] hover:bg-[#FAF7EE]"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Archived Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-12 shadow-[6px_6px_0px_#30312C] text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border-2 border-[#30312C] flex items-center justify-center text-3xl shadow-[2px_2px_0px_#30312C]">
            📦
          </div>
          <h2 className="font-header text-2xl font-extrabold text-[#30312C]">
            No Archived Items Found
          </h2>
          <p className="font-body text-sm text-[#737067]">
            {searchQuery
              ? `No items matching "${searchQuery}".`
              : "Items you archive will safely appear here. You can restore them anytime."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-white border-2 border-[#30312C] rounded-[28px] p-6 shadow-[5px_5px_0px_#30312C] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all group"
            >
              {/* Top Accent Tape */}
              <div
                className="absolute -top-3 left-6 w-10 h-4 bg-white/70 border border-black/15 shadow-2xs pointer-events-none rounded-xs backdrop-blur-[0.5px]"
                style={{ transform: "rotate(-12deg)" }}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-[#FAF7EE] rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C]">
                      <IconRenderer
                        name={item.icon || (item.type === "workspace" ? "Folder" : "BookOpen")}
                        className="w-5 h-5 text-[#30312C]"
                      />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 text-[10px] font-header font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 rounded-md">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <span className="font-body text-[11px] text-[#807D74]">
                    {item.archivedAt}
                  </span>
                </div>

                <div>
                  <h3 className="font-header text-lg font-bold text-[#30312C] group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-[#66645e] line-clamp-2 mt-1">
                    {item.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#30312C]/10">
                <button
                  type="button"
                  onClick={() => handleRestore(item.id, item.title)}
                  className="px-3.5 py-1.5 bg-[#FAF7EE] hover:bg-white text-[#30312C] font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-header font-bold text-xs rounded-xl border border-rose-300 shadow-[1.5px_1.5px_0px_#9f1239] transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

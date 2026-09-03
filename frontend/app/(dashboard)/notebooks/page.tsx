"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_NOTEBOOKS } from "@/lib/mock-data";

export default function NotebooksPage() {
  const [notebooks] = useState(INITIAL_NOTEBOOKS);

  return (
    <div className="space-y-8 animate-fadeIn select-none">
      <div className="border-b-2 border-[#30312C]/10 pb-5">
        <h1 className="font-header text-3xl sm:text-4xl font-extrabold text-[#30312C] tracking-tight">
          Notebooks
        </h1>
        <p className="font-body text-base text-[#66645e] mt-1">
          Explore all digital journals, specification notebooks, and working canvases across your workspaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notebooks.map((nb) => (
          <Link
            key={nb.id}
            href={`/workspace/${nb.workspaceId}/notebook/${nb.id}`}
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
  );
}

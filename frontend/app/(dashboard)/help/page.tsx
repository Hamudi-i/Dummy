import React from "react";

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b-2 border-[#30312C]/10 pb-4">
        <h1 className="font-header text-3xl font-bold text-[#30312C]">
          Help & Docs
        </h1>
        <p className="font-body text-base text-[#66645e] mt-1">
          Guides, keyboard shortcuts, and documentation for Co-Lab.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 shadow-[0_4px_0px_#30312C] space-y-2">
          <h3 className="font-header text-xl font-bold text-[#30312C]">💡 Quick Start Guide</h3>
          <p className="font-body text-[15px] text-[#52504a] leading-relaxed">
            Learn how to use hand-drawn tools, create shared sketchboards, and invite team members.
          </p>
        </div>

        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 shadow-[0_4px_0px_#30312C] space-y-2">
          <h3 className="font-header text-xl font-bold text-[#30312C]">⌨️ Keyboard Shortcuts</h3>
          <p className="font-body text-[15px] text-[#52504a] leading-relaxed">
            Press <code className="bg-[#e4e0d5] px-2 py-0.5 rounded border border-[#30312C] font-mono text-xs">Cmd + N</code> to create a new sketch anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

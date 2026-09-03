import React from "react";

export default function WorkspacePage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b-2 border-[#30312C]/10 pb-4">
        <div>
          <h1 className="font-school text-3xl font-bold text-[#30312C]">
            Workspace
          </h1>
          <p className="font-comic text-base text-[#66645e] mt-1">
            Welcome to your main studio workspace! All active projects & canvases live here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-5 shadow-[0_4px_0px_#30312C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2c5e91] text-white flex items-center justify-center font-comic font-bold text-lg">
            🎨
          </div>
          <h3 className="font-school text-xl font-bold text-[#30312C]">Interactive Whiteboard</h3>
          <p className="font-hand text-lg text-[#52504a]">
            Collaborative sketchboard with hand-drawn elements, sticky notes, and diagrams.
          </p>
        </div>

        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-5 shadow-[0_4px_0px_#30312C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#fdd355] text-[#30312C] flex items-center justify-center font-comic font-bold text-lg border border-[#30312C]">
            📝
          </div>
          <h3 className="font-school text-xl font-bold text-[#30312C]">Quick Notes</h3>
          <p className="font-hand text-lg text-[#52504a]">
            Jot down rapid ideas, outline workflows, and drop team comments.
          </p>
        </div>

        <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-5 shadow-[0_4px_0px_#30312C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e48358] text-white flex items-center justify-center font-comic font-bold text-lg border border-[#30312C]">
            🚀
          </div>
          <h3 className="font-school text-xl font-bold text-[#30312C]">Team Canvas</h3>
          <p className="font-hand text-lg text-[#52504a]">
            Real-time multi-user editing session with instant feedback and voting.
          </p>
        </div>
      </div>
    </div>
  );
}

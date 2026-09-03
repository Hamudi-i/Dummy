import React from "react";

export default function DraftsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b-2 border-[#30312C]/10 pb-4">
        <h1 className="font-school text-3xl font-bold text-[#30312C]">
          Drafts
        </h1>
        <p className="font-comic text-base text-[#66645e] mt-1">
          Unpublished sketches, WIP wireframes, and preliminary ideas.
        </p>
      </div>

      <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-8 shadow-[0_4px_0px_#30312C] text-center space-y-4">
        <div className="text-4xl">✏️</div>
        <h2 className="font-school text-2xl font-bold text-[#30312C]">Draft Canvas Empty</h2>
        <p className="font-hand text-lg text-[#66645e] max-w-md mx-auto">
          Click <span className="font-comic font-bold text-[#2c5e91]">+ New Sketch</span> in the sidebar to spawn a quick draft!
        </p>
      </div>
    </div>
  );
}

import React from "react";

export default function NotebooksPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b-2 border-[#30312C]/10 pb-4">
        <h1 className="font-school text-3xl font-bold text-[#30312C]">
          Notebooks
        </h1>
        <p className="font-comic text-base text-[#66645e] mt-1">
          Your collection of digital journals and structured project notebooks.
        </p>
      </div>

      <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-8 shadow-[0_4px_0px_#30312C] text-center space-y-4">
        <div className="text-4xl">📚</div>
        <h2 className="font-school text-2xl font-bold text-[#30312C]">No Notebooks Created Yet</h2>
        <p className="font-hand text-lg text-[#66645e] max-w-md mx-auto">
          Start organizing your research, code snippets, and design specs into bound notebooks.
        </p>
      </div>
    </div>
  );
}

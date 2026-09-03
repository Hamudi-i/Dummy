import React from "react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b-2 border-[#30312C]/10 pb-4">
        <h1 className="font-school text-3xl font-bold text-[#30312C]">
          Settings
        </h1>
        <p className="font-comic text-base text-[#66645e] mt-1">
          Manage your account, studio profile, theme, and integration preferences.
        </p>
      </div>

      <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-2xl p-6 shadow-[0_4px_0px_#30312C] space-y-4">
        <h2 className="font-school text-xl font-bold text-[#30312C]">Profile Customization</h2>
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full border-2 border-[#30312C] bg-[#fdd355] flex items-center justify-center font-comic font-bold text-lg">
            🦊
          </div>
          <div>
            <p className="font-comic font-bold text-[#30312C]">Studio Avatar</p>
            <p className="font-hand text-[#66645e]">Fox Mascot (Active)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

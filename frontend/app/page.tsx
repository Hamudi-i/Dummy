"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserProfile } from "@/lib/user-store";
import { INITIAL_WORKSPACES } from "@/lib/mock-data";

const demoProfile: UserProfile = {
  id: "demo-user",
  fullName: "Studio Creator",
  username: "creator_studio",
  email: "creator@colab.studio",
  bio: "Designing future collaborative tools.",
  profilePic: "/fox.png",
};

export default function LandingPage() {
  return (
    <div className="flex h-screen w-full bg-[#F8F5EC] text-[#30312C] font-body overflow-hidden selection:bg-[#2c5e91] selection:text-white">
      {/* Subtle Paper Texture Overlay (Global) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply bg-[radial-gradient(#30312C_1px,transparent_1px)] [background-size:16px_16px] z-0" />

      {/* Left 35% - Marketing & Action (Unified Background, No Divider Line) */}
      <div className="relative z-20 w-full md:w-[40%] xl:w-[35%] flex flex-col justify-center p-8 lg:p-12 xl:p-16 bg-[#F8F5EC] shrink-0">
        <div className="relative inline-block mb-3">
          <h1 className="font-header text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#30312C] tracking-tight leading-[1.15]">
            Think, Sketch <br /> & Collaborate
          </h1>
        </div>
        
        <div className="w-20 h-[6px] bg-[#E27D56] rounded-full mb-6 shadow-[0_2px_0px_#30312C]"></div>
        
        <p className="text-[16px] lg:text-[18px] font-medium text-[#5C5D58] mb-8 leading-relaxed max-w-[420px]">
          Bring your ideas to life on a dynamic, sketchbook-inspired workspace built for creators, teams, and thinkers.
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col gap-3.5 w-full max-w-[360px]">
          <Link
            href="/workspace"
            className="w-full h-[52px] bg-[#fdd355] text-[#30312C] font-header font-bold text-[18px] tracking-wide rounded-[12px] border-[2.5px] border-[#30312C] hover:bg-[#fcc833] active:translate-y-[1px] transition-all shadow-[0_4px_0px_#30312C] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>✨ Enter Studio Workspace</span>
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
            <Link
              href="/login"
              className="w-full sm:w-1/2 h-[46px] pencil-blue-texture text-[#1D2127] font-header font-bold text-[16px] tracking-wide rounded-[10px] border-[2px] border-[#30312C] hover:brightness-105 active:translate-y-[1px] transition-all shadow-[0_3px_0px_#30312C] flex items-center justify-center cursor-pointer"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-1/2 h-[46px] bg-[#FAF7EE] text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-[10px] border-[2px] border-[#30312C] hover:bg-[#F2ECE0] active:translate-y-[1px] transition-all shadow-[0_3px_0px_#30312C] flex items-center justify-center cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Right 65% - Floating Workspace Snapshot Frame (Unified Background, Reduced Height) */}
      <div className="relative z-10 hidden md:flex w-[60%] xl:w-[65%] h-full bg-[#F8F5EC] items-center justify-center p-6 lg:p-10 overflow-hidden select-none">
        
        {/* Floating Window Mockup Frame */}
        <div 
          className="w-full h-[78vh] max-h-[660px] max-w-[980px] bg-[#F8F5EC] border-[2.5px] border-[#30312C] rounded-[22px] shadow-[10px_10px_0px_#30312C] overflow-hidden flex flex-col relative pointer-events-none transform -rotate-1 hover:rotate-0 transition-transform duration-500"
          style={{ transform: 'scale(1)' }} /* Contains fixed position children */
        >
          {/* Top Window Control Bar (Sketchy Browser Frame) */}
          <div className="w-full h-[36px] bg-[#EBE5D8] border-b-[2px] border-[#30312C] px-4 flex items-center justify-between shrink-0 z-50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#E27D56] border border-[#30312C]" />
              <div className="w-3 h-3 rounded-full bg-[#fdd355] border border-[#30312C]" />
              <div className="w-3 h-3 rounded-full bg-[#5587C2] border border-[#30312C]" />
            </div>
            <div className="font-header font-extrabold text-[12px] tracking-wider text-[#30312C]/60 uppercase flex items-center space-x-1.5">
              <span>Co-Lab Studio Workspace Preview</span>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Embedded Real Workspace View */}
          <div className="relative flex-1 w-full overflow-hidden">
            {/* Mock Top Navbar */}
            <div className="absolute top-0 left-0 w-full z-40">
              <Navbar isSidebarOpen={true} profileOverride={demoProfile} />
            </div>

            {/* Mock Left Sidebar */}
            <Sidebar isCollapsed={false} profileOverride={demoProfile} className="!absolute shadow-[6px_0_24px_rgba(48,49,44,0.04)]" />

            {/* Mock Workspace Content with Real Items */}
            <main className="h-full w-full pt-[74px] pl-[256px] overflow-y-auto bg-[#F8F5EC]">
              <div className="p-6 lg:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-header text-3xl font-extrabold text-[#30312C] tracking-tight">
                      Recent Sketches
                    </h2>
                    <p className="font-body text-xs text-[#66645e] mt-1">
                      Pick up your pen where you left off or start a new canvas.
                    </p>
                  </div>
                  <div className="h-[36px] px-4 bg-accent text-[#30312C] font-header font-bold text-[13px] rounded-full border-1.5 border-[#30312C] flex items-center space-x-1">
                    <span>+</span>
                    <span>New Workspace</span>
                  </div>
                </div>

                {/* Workspaces Grid */}
                <div className="grid grid-cols-2 gap-5 max-w-4xl">
                  {INITIAL_WORKSPACES.slice(0, 4).map((ws, idx) => {
                    const rotations = ["-rotate-1", "rotate-1", "-rotate-1.5", "rotate-1.5"];
                    return (
                      <div
                        key={ws.id}
                        className={`bg-[#FFFFFF] border-2 border-[#1B1C1C] rounded-tl-[120px] rounded-tr-[120px] rounded-br-[80px] rounded-bl-[12px] p-4 min-h-[250px] shadow-[4px_4px_0px_rgba(27,28,28,0.18)] ${rotations[idx % rotations.length]} flex flex-col justify-between space-y-3 relative`}
                      >
                        {/* Tape Badge */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-20">
                          <div className="px-3 py-0.5 bg-[#FFF8DC] text-[#30312C] font-header font-bold text-[9px] tracking-wider uppercase border-y border-[#D6C79B] shadow-xs">
                            {ws.badgeLabel}
                          </div>
                        </div>

                        {/* Top dots */}
                        <div className="flex justify-end text-[#30312C]/40">
                          •••
                        </div>

                        {/* Image Preview */}
                        <div className="w-full h-20 rounded-lg border border-[#30312C]/30 overflow-hidden bg-[#FAF7EE] flex items-center justify-center relative">
                          <img
                            src="/sketch-preview.jpg"
                            alt="Preview"
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>

                        {/* Title */}
                        <h3 className="font-header text-base font-extrabold text-[#30312C] truncate">
                          {ws.title}
                        </h3>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#737067] border-t border-[#30312C]/10 pt-1.5">
                          <span>{ws.lastUpdated}</span>
                          <span className="bg-[#efe9d9] px-2 py-0.5 rounded-full border border-[#30312C]/20">
                            {ws.notebookCount} Notebooks
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

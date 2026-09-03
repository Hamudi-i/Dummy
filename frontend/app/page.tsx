"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F8F5EC] text-[#30312C] flex flex-col items-center justify-center relative overflow-hidden font-body p-4 select-none">
      {/* Subtle Paper Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply bg-[radial-gradient(#30312C_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full bg-[#FBF8EF] border-[2px] border-[#30312C] rounded-[20px] p-8 shadow-[6px_6px_0px_#30312C] text-center">
        
        {/* Main Title */}
        <h1 className="font-header text-3xl sm:text-4xl font-bold text-[#30312C] mb-2 tracking-tight">
          this is a landing page
        </h1>

        <div className="w-24 h-1 bg-[#E27D56] rounded-full mb-8"></div>

        {/* Buttons Container */}
        <div className="flex flex-col gap-4 w-full">
          {/* Direct Workspace Access (Dev Mode) */}
          <Link
            href="/workspace"
            className="w-full h-[48px] bg-[#fdd355] text-[#30312C] font-header font-bold text-[18px] tracking-wide rounded-[12px] border-[2px] border-[#30312C] hover:bg-[#fcc833] active:translate-y-[1px] transition-all shadow-[0_4px_0px_#30312C] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>✨ Enter Studio Workspace</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {/* Login Button */}
            <Link
              href="/login"
              className="w-full sm:w-1/2 h-[42px] pencil-blue-texture text-[#1D2127] font-header font-bold text-[16px] tracking-wide rounded-[8px] border-[1.8px] border-[#30312C] hover:brightness-105 active:translate-y-[1px] transition-all shadow-[0_3px_0px_#30312C] flex items-center justify-center cursor-pointer"
            >
              Login
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="w-full sm:w-1/2 h-[42px] bg-[#FAF7EE] text-[#30312C] font-header font-bold text-[16px] tracking-wide rounded-[8px] border-[1.8px] border-[#30312C] hover:bg-[#F2ECE0] active:translate-y-[1px] transition-all shadow-[0_3px_0px_#30312C] flex items-center justify-center cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

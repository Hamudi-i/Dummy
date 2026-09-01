"use client";

import React, { useState } from 'react';
import { ActiveModal } from '@/app/types';

interface HandDrawnModalProps {
  modal: ActiveModal;
  searchQuery?: string;
  onClose: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

export const HandDrawnModal: React.FC<HandDrawnModalProps> = ({
  modal,
  searchQuery = '',
  onClose,
  onSuccessToast,
}) => {
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  if (modal === 'none') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#30312C]/40 backdrop-blur-[2px] animate-fadeIn">
      {/* Modal Container */}
      <div
        className="w-full max-w-[420px] bg-[#D8B995] rounded-[18px] p-[6px] border-[2px] border-[#30312C] shadow-[0_12px_28px_rgba(0,0,0,0.18)] relative animate-scaleUp"
      >
        {/* Corner Screws */}
        <div className="absolute top-[8px] left-[8px] w-2 h-2 rounded-full border border-[#30312C] bg-[#BFA37E]"></div>
        <div className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full border border-[#30312C] bg-[#BFA37E]"></div>
        <div className="absolute bottom-[8px] left-[8px] w-2 h-2 rounded-full border border-[#30312C] bg-[#BFA37E]"></div>
        <div className="absolute bottom-[8px] right-[8px] w-2 h-2 rounded-full border border-[#30312C] bg-[#BFA37E]"></div>

        {/* Inner Card */}
        <div className="w-full bg-[#FBF8EF] rounded-[13px] border-[1.5px] border-[#30312C] p-5 relative">

          {/* Close Button */}
          <button
            id="colab-modal-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full border border-[#30312C] bg-[#FAF5EC] hover:bg-[#F2ECE0] flex items-center justify-center font-comic font-bold text-[#30312C] text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>

          {/* Modal Content Switch */}
          {modal === 'forgot_password' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="font-school text-[22px] font-bold text-[#30312C] mb-1">
                Reset Password
              </h3>
              <p className="font-comic text-[13px] text-[#55524B] mb-4">
                Enter your email address and we&apos;ll send you a recovery link!
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onClose();
                  onSuccessToast('Reset Link Sent', `Instructions dispatched to ${forgotEmail}`);
                }}
                className="w-full flex flex-col items-center space-y-3"
              >
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-[36px] px-3 text-[14px] font-comic bg-[#FFFFFF] text-[#30312C] rounded-[6px] border-[1.4px] border-[#30312C] focus:outline-none focus:ring-1 focus:ring-[#4B7DB9]"
                />
                <button
                  type="submit"
                  className="w-full h-[34px] pencil-blue-texture text-[#1D2127] font-comic font-bold text-[14px] rounded-[6px] border-[1.5px] border-[#30312C] hover:brightness-105 cursor-pointer shadow-[0_2px_0px_#30312C]"
                >
                  SEND RESET LINK
                </button>
              </form>
            </div>
          )}

          {modal === 'signup' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="font-school text-[22px] font-bold text-[#30312C] mb-1">
                Create Co-Lab Account
              </h3>
              <p className="font-comic text-[13px] text-[#55524B] mb-3">
                Join our hand-drawn creative document workspace!
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onClose();
                  onSuccessToast('Welcome Aboard!', `Account created for ${signupName || signupEmail}!`);
                }}
                className="w-full flex flex-col items-center space-y-2.5"
              >
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full h-[34px] px-3 text-[13.5px] font-comic bg-[#FFFFFF] text-[#30312C] rounded-[6px] border-[1.4px] border-[#30312C] focus:outline-none focus:ring-1 focus:ring-[#4B7DB9]"
                />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-[34px] px-3 text-[13.5px] font-comic bg-[#FFFFFF] text-[#30312C] rounded-[6px] border-[1.4px] border-[#30312C] focus:outline-none focus:ring-1 focus:ring-[#4B7DB9]"
                />
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Choose Password"
                  className="w-full h-[34px] px-3 text-[13.5px] font-comic bg-[#FFFFFF] text-[#30312C] rounded-[6px] border-[1.4px] border-[#30312C] focus:outline-none focus:ring-1 focus:ring-[#4B7DB9]"
                />
                <button
                  type="submit"
                  className="w-full h-[34px] pencil-blue-texture text-[#1D2127] font-comic font-bold text-[14px] rounded-[6px] border-[1.5px] border-[#30312C] hover:brightness-105 cursor-pointer shadow-[0_2px_0px_#30312C] mt-1"
                >
                  START CREATING
                </button>
              </form>
            </div>
          )}

          {modal === 'docs' && (
            <div className="flex flex-col text-left">
              <h3 className="font-school text-[22px] font-bold text-[#30312C] mb-2 flex items-center gap-2">
                <span>📖</span> Co-Lab Documentation
              </h3>
              <div className="space-y-2 text-[13px] font-comic text-[#423F39] max-h-[260px] overflow-y-auto pr-1">
                <div className="p-2 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <strong className="text-[#30312C]">1. Shared Notebooks:</strong> Real-time visual sketchboards and synchronized document editing.
                </div>
                <div className="p-2 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <strong className="text-[#30312C]">2. Team Spaces:</strong> Organize team members, brainstorm with lightbulb threads, and share assets.
                </div>
                <div className="p-2 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <strong className="text-[#30312C]">3. The Co-Lab Mascot:</strong> Keep your workflow warm, playful, and focused.
                </div>
              </div>
            </div>
          )}

          {modal === 'team' && (
            <div className="flex flex-col text-left">
              <h3 className="font-school text-[22px] font-bold text-[#30312C] mb-2 flex items-center gap-2">
                <span>👥</span> Co-Lab Workspace Team
              </h3>
              <div className="space-y-2 text-[13px] font-comic text-[#423F39] max-h-[260px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between p-2 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <div>
                    <div className="font-bold text-[#30312C]">Design & Illustration Studio</div>
                    <div className="text-xs text-[#7A756C]">6 active illustrators</div>
                  </div>
                  <span className="text-xs bg-[#F4D068] px-2 py-0.5 rounded border border-[#30312C] font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <div>
                    <div className="font-bold text-[#30312C]">Product Collaboration Guild</div>
                    <div className="text-xs text-[#7A756C]">12 writers & researchers</div>
                  </div>
                  <span className="text-xs bg-[#9CD7E8] px-2 py-0.5 rounded border border-[#30312C] font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          )}

          {modal === 'search' && (
            <div className="flex flex-col text-left">
              <h3 className="font-school text-[22px] font-bold text-[#30312C] mb-2 flex items-center gap-2">
                <span>🔍</span> Search: &quot;{searchQuery}&quot;
              </h3>
              <div className="space-y-2 text-[13px] font-comic text-[#423F39]">
                <div className="p-2.5 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <div className="font-bold text-[#30312C]">📄 Collaborative Documents &amp; Notes</div>
                  <div className="text-xs text-[#7A756C]">Matching space found for {searchQuery}</div>
                </div>
                <div className="p-2.5 bg-[#FAF5EC] border border-[#DDD4C5] rounded-[6px]">
                  <div className="font-bold text-[#30312C]">💡 Creative Brainstorming Spaces</div>
                  <div className="text-xs text-[#7A756C]">3 sketches and lightbulb threads matched</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Hand-Drawn Sketchy Ground Shadow (Card) */}
      <svg
        className="absolute bottom-[-14px] left-[5%] w-[90%] h-[20px] pointer-events-none opacity-30 select-none z-0"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
      >
        <ellipse cx="100" cy="5" rx="90" ry="3.5" fill="#30312C" />
        <path
          d="M 10 5 C 50 6.5, 150 3.5, 190 5 M 25 6 C 65 7.5, 135 4.5, 175 6 M 45 4 C 80 5, 120 3, 155 4"
          stroke="#30312C"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

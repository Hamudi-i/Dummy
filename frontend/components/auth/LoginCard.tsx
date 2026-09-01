"use client";

import React, { useState } from 'react';
import { AuthState } from '@/app/types';

interface LoginCardProps {
  onLogin: (credentials: { email: string; pass: string }) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onSocialLogin: (provider: 'Google' | 'GitHub' | 'Apple') => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    email: '',
    password: '',
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email: auth.email, pass: auth.password });
    }, 400);
  };

  return (
    <div
      id="colab-login-card-container"
      className="relative z-10 select-none"
    >
      {/* Hand-Drawn Flat Solid Shadow (Card) */}
      <div
        className="absolute w-[352px] sm:w-[360px] h-full min-h-[450px] bg-[#30312C] rounded-[18px] border-[2.2px] border-[#30312C] pointer-events-none translate-x-[8px] translate-y-[8px] opacity-25 z-0"
      />

      {/* Outer Cardboard/Wooden Frame */}
      <div
        className="w-[352px] sm:w-[360px] min-h-[450px] bg-[#D8B995] rounded-[18px] p-[6px] border-[2.2px] border-[#30312C] relative flex flex-col select-none z-10"
      >
        {/* Subtle White Brush Highlights on Outer Corners */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="brush-blur">
              <feGaussianBlur stdDeviation="1.0" />
            </filter>
          </defs>
        </svg>
        
        {/* Top-Left Brush Corner */}
        <svg className="absolute left-[-3px] top-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 2 22 A 20 20 0 0 1 22 2" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>
        {/* Top-Right Brush Corner */}
        <svg className="absolute right-[-3px] top-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 10 2 A 20 20 0 0 1 30 22" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>
        {/* Bottom-Right Brush Corner */}
        <svg className="absolute right-[-3px] bottom-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 30 10 A 20 20 0 0 1 10 30" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>
        {/* Bottom-Left Brush Corner */}
        <svg className="absolute left-[-3px] bottom-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 22 30 A 20 20 0 0 1 2 10" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>

        {/* Inner Panel */}
        <div className="flex-1 bg-[#FBF8EF] rounded-[13px] border-[1.5px] border-[#30312C] px-5 pt-6 pb-6 flex flex-col items-center relative">
          {/* Sketchy Hand-Drawn Inner Border with Inward Scalloped Corners */}
          <svg
            className="absolute inset-[14px] w-[calc(100%-28px)] h-[calc(100%-28px)] pointer-events-none select-none"
            viewBox="0 0 300 300"
            preserveAspectRatio="none"
          >
            {/* Smooth Inward Scalloped Border Path */}
            <path
              d="M 16 0 L 284 0 A 16 16 0 0 0 300 16 L 300 284 A 16 16 0 0 0 284 300 L 16 300 A 16 16 0 0 0 0 284 L 0 16 A 16 16 0 0 0 16 0 Z"
              stroke="#30312C"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Rivet / Screw Accents */}
            <circle cx="6" cy="6" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
            <circle cx="294" cy="6" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
            <circle cx="294" cy="294" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
            <circle cx="6" cy="294" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
          </svg>

          {/* Card Heading */}
          <div className="relative flex flex-col items-center mb-3">
            <h2 className="font-school text-[26.5px] font-bold text-[#30312C] tracking-wide leading-tight">
              Let&apos;s Get Started!
            </h2>
            {/* Hand-drawn Orange Curved Underline */}
            <svg
              width="132"
              height="8"
              viewBox="0 0 100 6"
              fill="none"
              className="mt-0.5"
            >
              <path
                d="M 2 3 C 25 5 75 5 98 2"
                stroke="#E27D56"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-3">

            {/* Email Field */}
            <div className="w-[260px] relative flex items-center">
              <input
                id="colab-email-input"
                type="email"
                required
                value={auth.email}
                onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                placeholder="Email Address"
                className="w-full h-[40px] pl-9 pr-2 text-[15.5px] font-comic bg-[#FFFFFF] text-[#30312C] placeholder-[#8A8780] rounded-[6px] border-[1.4px] border-[#30312C] focus:outline-none focus:border-[#4B7DB9] focus:ring-1 focus:ring-[#4B7DB9] transition-all"
              />
              {/* Envelope Icon */}
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                className="absolute left-2.5 text-[#4A4843] pointer-events-none"
              >
                <rect
                  x="1"
                  y="2"
                  width="14"
                  height="10"
                  rx="1.5"
                  stroke="#4A4843"
                  strokeWidth="1.3"
                />
                <path
                  d="M 1.5 3 L 8 8 L 14.5 3"
                  stroke="#4A4843"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Password Field */}
            <div className="w-[260px] relative flex items-center">
              <input
                id="colab-password-input"
                type={auth.showPassword ? 'text' : 'password'}
                required
                value={auth.password}
                onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                placeholder="Password"
                className="w-full h-[40px] pl-9 pr-9 text-[15.5px] font-comic bg-[#FFFFFF] text-[#30312C] placeholder-[#8A8780] rounded-[6px] border-[1.4px] border-[#30312C] focus:outline-none focus:border-[#4B7DB9] focus:ring-1 focus:ring-[#4B7DB9] transition-all"
              />
              {/* Lock Icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                className="absolute left-2.5 text-[#4A4843] pointer-events-none"
              >
                <rect
                  x="2.5"
                  y="6.5"
                  width="11"
                  height="8"
                  rx="1.5"
                  stroke="#4A4843"
                  strokeWidth="1.3"
                />
                <path
                  d="M 5 6.5 V 4.5 C 5 2.8 6.3 1.5 8 1.5 C 9.7 1.5 11 2.8 11 4.5 V 6.5"
                  stroke="#4A4843"
                  strokeWidth="1.3"
                />
                <circle cx="8" cy="10.5" r="1" fill="#4A4843" />
              </svg>

              {/* Password Eye Toggle */}
              <button
                id="colab-toggle-password-btn"
                type="button"
                onClick={() => setAuth({ ...auth, showPassword: !auth.showPassword })}
                className="absolute right-2.5 text-[#68655E] hover:text-[#30312C] transition-colors cursor-pointer"
                title={auth.showPassword ? 'Hide password' : 'Show password'}
              >
                {auth.showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M 1.5 8 C 3 4.5 7 2.5 8 2.5 C 9 2.5 13 4.5 14.5 8 C 13 11.5 9 13.5 8 13.5 C 7 13.5 3 11.5 1.5 8 Z"
                      stroke="#4A4843"
                      strokeWidth="1.2"
                    />
                    <circle cx="8" cy="8" r="2.2" stroke="#4A4843" strokeWidth="1.2" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M 1.5 8 C 3 4.5 7 2.5 8 2.5 C 9 2.5 13 4.5 14.5 8 C 13 11.5 9 13.5 8 13.5 C 7 13.5 3 11.5 1.5 8 Z"
                      stroke="#4A4843"
                      strokeWidth="1.2"
                    />
                    <circle cx="8" cy="8" r="2.2" stroke="#4A4843" strokeWidth="1.2" />
                    <line
                      x1="2.5"
                      y1="2.5"
                      x2="13.5"
                      y2="13.5"
                      stroke="#4A4843"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Login Button */}
            <div className="w-[260px] pt-0.5">
              <button
                id="colab-login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full h-[40px] pencil-blue-texture text-[#1D2127] font-comic font-bold text-[16px] tracking-wider rounded-[6px] border-[1.5px] border-[#30312C] hover:brightness-105 active:translate-y-[1px] transition-all shadow-[0_2px_0px_#30312C] flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse">LOGGING IN...</span>
                ) : (
                  'LOGIN'
                )}
              </button>
            </div>
          </form>

          {/* Account Links */}
          <div className="flex flex-col items-center mt-3 space-y-0.5 text-[15px] font-comic text-[#30312C]">
            <button
              id="colab-forgot-password-link"
              type="button"
              onClick={onForgotPassword}
              className="underline hover:text-[#254f85] transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
            <div className="flex items-center space-x-1">
              <span>Don&apos;t have an account?</span>
              <button
                id="colab-signup-link"
                type="button"
                onClick={onSignUp}
                className="underline font-bold hover:text-[#254f85] transition-colors cursor-pointer"
              >
                Sign Up!
              </button>
            </div>
          </div>

          {/* Divider with "Log in with" */}
          <div className="w-[190px] flex flex-col items-center mt-7 mb-4">
            <div className="w-full h-[1px] bg-[#C5C0B4]"></div>
            <span className="text-[14px] font-comic text-[#75726B] -mt-3 bg-[#FBF8EF] px-2">
              Log in with
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex items-center space-x-2.5 mt-2">
            {/* Google */}
            <button
              id="colab-social-google-btn"
              type="button"
              onClick={() => onSocialLogin('Google')}
              className="w-[44px] h-[43px] bg-[#FFFFFF] rounded-[6px] border-[1.3px] border-[#30312C] flex items-center justify-center hover:bg-[#F9F7F1] hover:scale-105 active:translate-y-[1px] transition-all cursor-pointer shadow-[0_1px_0px_rgba(0,0,0,0.1)]"
              title="Sign in with Google"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>

            {/* GitHub */}
            <button
              id="colab-social-github-btn"
              type="button"
              onClick={() => onSocialLogin('GitHub')}
              className="w-[44px] h-[43px] bg-[#FFFFFF] rounded-[6px] border-[1.3px] border-[#30312C] flex items-center justify-center hover:bg-[#F9F7F1] hover:scale-105 active:translate-y-[1px] transition-all cursor-pointer shadow-[0_1px_0px_rgba(0,0,0,0.1)]"
              title="Sign in with GitHub"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#30312C">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </button>

            {/* Apple */}
            <button
              id="colab-social-apple-btn"
              type="button"
              onClick={() => onSocialLogin('Apple')}
              className="w-[44px] h-[43px] bg-[#FFFFFF] rounded-[6px] border-[1.3px] border-[#30312C] flex items-center justify-center hover:bg-[#F9F7F1] hover:scale-105 active:translate-y-[1px] transition-all cursor-pointer shadow-[0_1px_0px_rgba(0,0,0,0.1)]"
              title="Sign in with Apple"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#30312C">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.88-.9.04-2.03.62-2.65 1.36-.55.63-1.03 1.68-.9 2.72.99.08 2-.45 2.54-1.2" />
              </svg>
            </button>
          </div>

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

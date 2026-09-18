"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface SignUpCardProps {
  onSignUp: (data: { name: string; email: string; pass: string }) => void;
  onSocialLogin: (provider: 'Google') => void;
}

export const SignUpCard: React.FC<SignUpCardProps> = ({
  onSignUp,
  onSocialLogin,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords don't match!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignUp({
        name: formData.name,
        email: formData.email,
        pass: formData.password,
      });
    }, 400);
  };

  return (
    <div id="colab-signup-card-container" className="relative z-10 select-none">
      {/* Hand-Drawn Flat Solid Shadow (Card) */}
      <div className="absolute w-[352px] sm:w-[360px] h-full min-h-[420px] bg-[#30312C] rounded-[18px] border-[2.2px] border-[#30312C] pointer-events-none translate-x-[8px] translate-y-[8px] opacity-25 z-0" />

      {/* Outer Cardboard/Wooden Frame */}
      <div className="card-container min-h-[420px]">
        {/* Corner Highlights */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="brush-blur">
              <feGaussianBlur stdDeviation="1.0" />
            </filter>
          </defs>
        </svg>
        <svg className="absolute left-[-3px] top-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 2 22 A 20 20 0 0 1 22 2" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>
        <svg className="absolute right-[-3px] top-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 10 2 A 20 20 0 0 1 30 22" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>
        <svg className="absolute right-[-3px] bottom-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 30 10 A 20 20 0 0 1 10 30" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>
        <svg className="absolute left-[-3px] bottom-[-3px] w-[32px] h-[32px] pointer-events-none" viewBox="0 0 32 32">
          <path d="M 22 30 A 20 20 0 0 1 2 10" stroke="white" strokeWidth="4.0" fill="none" strokeLinecap="round" opacity="0.65" filter="url(#brush-blur)" />
        </svg>

        {/* Inner Panel */}
        <div className="card-inner py-3.5">
          {/* Inner Scalloped Border */}
          <svg
            className="absolute inset-[12px] w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none select-none"
            viewBox="0 0 300 300"
            preserveAspectRatio="none"
          >
            <path
              d="M 16 0 L 284 0 A 16 16 0 0 0 300 16 L 300 284 A 16 16 0 0 0 284 300 L 16 300 A 16 16 0 0 0 0 284 L 0 16 A 16 16 0 0 0 16 0 Z"
              stroke="#30312C"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="6" cy="6" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
            <circle cx="294" cy="6" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
            <circle cx="294" cy="294" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
            <circle cx="6" cy="294" r="3" stroke="#30312C" strokeWidth="1.5" fill="#FBF8EF" />
          </svg>

          {/* Card Heading */}
          <div className="relative flex flex-col items-center mb-1.5">
            <h2 className="font-school text-[23px] font-bold text-[#30312C] tracking-wide leading-tight">
              Create Account!
            </h2>
            <svg width="115" height="7" viewBox="0 0 100 6" fill="none" className="mt-0.5">
              <path d="M 2 3 C 25 5 75 5 98 2" stroke="#5587C2" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-2">
            {/* Full Name Field */}
            <div className="w-[250px] relative flex items-center">
              <input
                id="colab-signup-name-input"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="input-sketch-compact"
              />
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-2.5 text-[#4A4843] pointer-events-none">
                <circle cx="8" cy="5" r="3" stroke="#4A4843" strokeWidth="1.3" />
                <path d="M 2.5 14 C 2.5 11 5 9.5 8 9.5 C 11 9.5 13.5 11 13.5 14" stroke="#4A4843" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Email Field */}
            <div className="w-[250px] relative flex items-center">
              <input
                id="colab-signup-email-input"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="input-sketch-compact"
              />
              <svg width="15" height="13" viewBox="0 0 16 14" fill="none" className="absolute left-2.5 text-[#4A4843] pointer-events-none">
                <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="#4A4843" strokeWidth="1.3" />
                <path d="M 1.5 3 L 8 8 L 14.5 3" stroke="#4A4843" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Password Field */}
            <div className="w-[250px] relative flex items-center">
              <input
                id="colab-signup-password-input"
                type={formData.showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="input-sketch-compact pr-8"
              />
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-2.5 text-[#4A4843] pointer-events-none">
                <rect x="2.5" y="6.5" width="11" height="8" rx="1.5" stroke="#4A4843" strokeWidth="1.3" />
                <path d="M 5 6.5 V 4.5 C 5 2.8 6.3 1.5 8 1.5 C 9.7 1.5 11 2.8 11 4.5 V 6.5" stroke="#4A4843" strokeWidth="1.3" />
              </svg>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                className="absolute right-2 text-[#68655E] hover:text-[#30312C] transition-colors cursor-pointer"
              >
                {formData.showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M 1.5 8 C 3 4.5 7 2.5 8 2.5 C 9 2.5 13 4.5 14.5 8 C 13 11.5 9 13.5 8 13.5 C 7 13.5 3 11.5 1.5 8 Z" stroke="#4A4843" strokeWidth="1.2" />
                    <circle cx="8" cy="8" r="2.2" stroke="#4A4843" strokeWidth="1.2" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M 1.5 8 C 3 4.5 7 2.5 8 2.5 C 9 2.5 13 4.5 14.5 8 C 13 11.5 9 13.5 8 13.5 C 7 13.5 3 11.5 1.5 8 Z" stroke="#4A4843" strokeWidth="1.2" />
                    <circle cx="8" cy="8" r="2.2" stroke="#4A4843" strokeWidth="1.2" />
                    <line x1="2.5" y1="2.5" x2="13.5" y2="13.5" stroke="#4A4843" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="w-[250px] relative flex items-center">
              <input
                id="colab-signup-confirm-password-input"
                type={formData.showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                className="input-sketch-compact"
              />
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-2.5 text-[#4A4843] pointer-events-none">
                <path d="M 3 8.5 L 6.5 12 L 13 4.5" stroke="#4A4843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-[12px] font-comic font-bold text-[#D34537] -mt-1 mb-0.5">
                {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <div className="w-[250px] pt-0.5">
              <button
                id="colab-signup-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-pencil-compact pencil-blue-texture"
              >
                {loading ? <span className="animate-pulse">CREATING ACCOUNT...</span> : 'SIGN UP'}
              </button>
            </div>
          </form>

          {/* Account Links */}
          <div className="flex items-center space-x-1.5 mt-2 text-[13.5px] font-comic text-[#30312C]">
            <span>Already have an account?</span>
            <Link
              id="colab-goto-login-link"
              href="/login"
              className="underline font-bold hover:text-[#254f85] transition-colors cursor-pointer"
            >
              Log In!
            </Link>
          </div>

          {/* Divider */}
          <div className="w-[250px] flex flex-col items-center mt-3 mb-2">
            <div className="w-full h-[1px] bg-[#C5C0B4]"></div>
            <span className="text-[12px] font-comic text-[#75726B] -mt-2.5 bg-[#FBF8EF] px-2">
              OR
            </span>
          </div>

          {/* Social Logins */}
          <div className="w-[250px] flex justify-center mt-0.5">
            <button
              id="colab-signup-social-google-btn"
              type="button"
              onClick={() => onSocialLogin('Google')}
              className="w-full h-[37px] bg-white rounded-[6px] border-[1.4px] border-[#30312C] shadow-[0_2px_0px_#30312C] flex items-center justify-center space-x-2.5 font-comic text-[14px] font-bold text-[#30312C] hover:bg-[#F9F7F1] active:translate-y-[1px] transition-all cursor-pointer"
              title="Sign up with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ground Shadow */}
      <svg
        className="absolute bottom-[-14px] left-[5%] w-[90%] h-[20px] pointer-events-none opacity-30 select-none z-0"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
      >
        <ellipse cx="100" cy="5" rx="90" ry="3.5" fill="#30312C" />
        <path d="M 10 5 C 50 6.5, 150 3.5, 190 5 M 25 6 C 65 7.5, 135 4.5, 175 6 M 45 4 C 80 5, 120 3, 155 4" stroke="#30312C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

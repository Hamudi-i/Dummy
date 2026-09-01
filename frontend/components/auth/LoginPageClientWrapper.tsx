"use client";

import React, { useState } from 'react';
import { ActiveModal, ToastMessage } from '@/app/types';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { LoginCard } from '@/components/auth/LoginCard';
import { HandDrawnModal } from '@/components/modals/HandDrawnModal';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface LoginPageClientWrapperProps {
  brandHeader: React.ReactNode;
  welcomeSign: React.ReactNode;
  foxMascot: React.ReactNode;
  sideIllustrations: React.ReactNode;
}

export const LoginPageClientWrapper: React.FC<LoginPageClientWrapperProps> = ({
  brandHeader,
  welcomeSign,
  foxMascot,
  sideIllustrations,
}) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogin = (creds: { email: string; pass: string }) => {
    addToast(
      'Welcome to Co-Lab!',
      `Logged in successfully as ${creds.email || 'Creative Member'}`
    );
  };

  const handleSocialLogin = (provider: 'Google' | 'GitHub' | 'Apple') => {
    addToast(
      `${provider} Authentication`,
      `Connecting to Co-Lab workspace via ${provider}...`
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveModal('search');
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F5EC] text-[#30312C] flex flex-col justify-between relative overflow-x-hidden font-comic">
      {/* Subtle Paper Texture Noise / Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply bg-[radial-gradient(#30312C_1px,transparent_1px)] [background-size:16px_16px]"
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      {/* Top Navigation (Client Component) */}
      <TopNav
        onOpenDocs={() => setActiveModal('docs')}
        onOpenTeam={() => setActiveModal('team')}
        onSearch={handleSearch}
      />

      {/* Main Canvas Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-1 relative z-10">
        {/* Side Illustrations (Combined Left & Right Server Component) */}
        {sideIllustrations}

        {/* Center Main Stage */}
        <div className="w-full max-w-[490px] flex flex-col items-center justify-center relative -mt-8 sm:-mt-12">
          {/* Main Logo & Subtitle (Server Component) */}
          {brandHeader}

          {/* Welcome Signpost pointing right (Server Component) */}
          {welcomeSign}

          {/* Center Card & Fox Wrapper */}
          <div className="relative mt-1">
            <LoginCard
              onLogin={handleLogin}
              onForgotPassword={() => setActiveModal('forgot_password')}
              onSignUp={() => setActiveModal('signup')}
              onSocialLogin={handleSocialLogin}
            />

            {/* Hand-drawn Fox Mascot (Server Component) */}
            {foxMascot}
          </div>
        </div>
      </main>

      {/* Footer (Client Component) */}
      <Footer
        onOpenPrivacy={() => setActiveModal('docs')}
        onOpenTerms={() => setActiveModal('docs')}
      />

      {/* Hand-Drawn Styled Modal */}
      <HandDrawnModal
        modal={activeModal}
        searchQuery={searchQuery}
        onClose={() => setActiveModal('none')}
        onSuccessToast={addToast}
      />
    </div>
  );
};

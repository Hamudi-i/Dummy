"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActiveModal, ToastMessage } from '@/app/types';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { SignUpCard } from '@/components/auth/SignUpCard';
import { HandDrawnModal } from '@/components/modals/HandDrawnModal';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface SignUpPageClientWrapperProps {
  brandHeader: React.ReactNode;
  welcomeSign: React.ReactNode;
  foxMascot: React.ReactNode;
  sideIllustrations: React.ReactNode;
}

export const SignUpPageClientWrapper: React.FC<SignUpPageClientWrapperProps> = ({
  brandHeader,
  welcomeSign,
  foxMascot,
  sideIllustrations,
}) => {
  const router = useRouter();
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

  const handleSignUp = (data: { name: string; email: string; pass: string }) => {
    addToast(
      'Account Created!',
      `Welcome to Co-Lab, ${data.name || data.email}! Redirecting to login...`
    );
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  const handleSocialLogin = (provider: 'Google' | 'GitHub' | 'Apple') => {
    addToast(
      `${provider} Sign Up`,
      `Creating your Co-Lab account via ${provider}...`
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

      {/* Top Navigation */}
      <TopNav
        onOpenDocs={() => setActiveModal('docs')}
        onOpenTeam={() => setActiveModal('team')}
        onSearch={handleSearch}
      />

      {/* Main Canvas Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-1 relative z-10">
        {/* Side Illustrations */}
        {sideIllustrations}

        {/* Center Main Stage */}
        <div className="w-full max-w-[490px] flex flex-col items-center justify-center relative -mt-8 sm:-mt-12">
          {/* Main Logo & Subtitle */}
          {brandHeader}

          {/* Welcome Signpost */}
          {welcomeSign}

          {/* Center Card & Fox Wrapper */}
          <div className="relative mt-1">
            <SignUpCard
              onSignUp={handleSignUp}
              onSocialLogin={handleSocialLogin}
            />

            {/* Hand-drawn Fox Mascot */}
            {foxMascot}
          </div>
        </div>
      </main>

      {/* Footer */}
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

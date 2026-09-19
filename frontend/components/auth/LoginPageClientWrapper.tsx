"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActiveModal, ToastMessage } from '@/app/types';
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

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const error = searchParams.get('error');
      if (error) {
        addToast('Authentication Failed', decodeURIComponent(error), 'error');
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const handleLogin = async (creds: { email: string; pass: string }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: creds.email,
          password: creds.pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store auth session details per teammate backend spec
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      addToast('Welcome to Co-Lab!', 'Logged in successfully!');

      // Redirect to main app/dashboard
      router.push('/workspace');
    } catch (err: any) {
      addToast('Login Failed', err.message || 'Unable to sign in. Please try again.', 'error');
    }
  };

  const handleSocialLogin = (provider: 'Google' | 'GitHub' | 'Apple') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.assign(`${apiUrl}/api/auth/oauth/${provider.toLowerCase()}`);
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

      {/* Main Canvas Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10">
        {/* Side Illustrations (Combined Left & Right Server Component) */}
        {sideIllustrations}

        {/* Center Main Stage */}
        <div className="w-full max-w-[490px] flex flex-col items-center justify-center relative my-auto">
          {/* Main Logo & Subtitle (Server Component) */}
          {brandHeader}

          {/* Welcome Signpost pointing right (Server Component) */}
          {welcomeSign}

          {/* Center Card & Fox Wrapper */}
          <div className="relative mt-1">
            <LoginCard
              onLogin={handleLogin}
              onForgotPassword={() => setActiveModal('forgot_password')}
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
        aria-modal="true"
        onClose={() => setActiveModal('none')}
        onSuccessToast={addToast}
      />
    </div>
  );
};

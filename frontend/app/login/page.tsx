import React from 'react';
import { BrandHeader } from '@/components/brand/BrandHeader';
import { WelcomeSign } from '@/components/brand/WelcomeSign';
import { FoxMascot } from '@/components/mascot/FoxMascot';
import { SideIllustrations } from '@/components/illustrations/SideIllustrations';
import { LoginPageClientWrapper } from '@/components/auth/LoginPageClientWrapper';

export default function LoginPage() {
  return (
    <LoginPageClientWrapper
      brandHeader={<BrandHeader />}
      welcomeSign={<WelcomeSign />}
      foxMascot={<FoxMascot />}
      sideIllustrations={<SideIllustrations />}
    />
  );
}

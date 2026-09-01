import React from 'react';
import { BrandHeader } from '@/components/brand/BrandHeader';
import { WelcomeSign } from '@/components/brand/WelcomeSign';
import { FoxMascot } from '@/components/mascot/FoxMascot';
import { SideIllustrations } from '@/components/illustrations/SideIllustrations';
import { SignUpPageClientWrapper } from '@/components/auth/SignUpPageClientWrapper';

export default function SignUpPage() {
  return (
    <SignUpPageClientWrapper
      brandHeader={<BrandHeader />}
      welcomeSign={<WelcomeSign text="WELCOME TO CO-LAB!" />}
      foxMascot={<FoxMascot />}
      sideIllustrations={<SideIllustrations />}
    />
  );
}

import React from 'react';
import { BrandHeader } from '@/components/brand/BrandHeader';
import { WelcomeSign } from '@/components/brand/WelcomeSign';
import { FoxMascot } from '@/components/mascot/FoxMascot';
import { LeftIllustrations } from '@/components/illustrations/LeftIllustrations';
import { RightIllustrations } from '@/components/illustrations/RightIllustrations';
import { LoginPageClientWrapper } from '@/components/auth/LoginPageClientWrapper';

export default function LoginPage() {
  return (
    <LoginPageClientWrapper
      brandHeader={<BrandHeader />}
      welcomeSign={<WelcomeSign />}
      foxMascot={<FoxMascot />}
      leftIllustrations={<LeftIllustrations />}
      rightIllustrations={<RightIllustrations />}
    />
  );
}

"use client";

import React from 'react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  return (
    <footer 
      id="colab-footer"
      className="w-full flex items-center justify-center pb-2 select-none z-20"
    >
      <div className="flex items-center space-x-3 text-[12px] font-comic text-[#30312C]">
        <span>© Co-Lab 2024</span>
        <button
          id="colab-privacy-link"
          type="button"
          onClick={onOpenPrivacy}
          className="underline hover:text-[#254f85] transition-colors cursor-pointer"
        >
          Privacy
        </button>
        <button
          id="colab-terms-link"
          type="button"
          onClick={onOpenTerms}
          className="underline hover:text-[#254f85] transition-colors cursor-pointer"
        >
          Terms
        </button>
      </div>
    </footer>
  );
};

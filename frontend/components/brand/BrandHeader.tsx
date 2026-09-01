import React from 'react';

export const BrandHeader: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center text-center select-none pt-2 pb-2">
      {/* CO-LAB Illustrated Bubble Logo with Stars */}
      <div className="relative inline-flex items-center justify-center">
        <div className="flex items-center justify-center">
          {/* eslint-disable-next-img-element */}
          <img
            src="/logo.png"
            alt="Co-Lab Logo"
            className="w-[460px] h-[120px] mr-8 object-contain filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.04)]"
          />
        </div>
      </div>

      {/* Subtitle */}
      <p
        id="colab-subtitle"
        className="font-school text-[#30312C] text-[19px] tracking-wide mt-1 mb-1 font-semibold"
      >
        Collaborative Documents & Creative Spaces
      </p>
    </header>
  );
};

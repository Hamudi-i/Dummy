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
            className="w-[490px] h-[130px] -mt-3 mr-8 object-contain filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.04)]"
          />
        </div>
      </div>

      {/* Subtitle */}
      <p id="colab-subtitle" className="subtitle-text mt-1 mb-1">
        Collaborative Documents &amp; Creative Spaces
      </p>
    </header>
  );
};

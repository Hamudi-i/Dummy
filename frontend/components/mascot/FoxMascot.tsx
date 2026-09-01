import React from 'react';

export const FoxMascot: React.FC = () => {
  return (
    <div
      id="colab-fox-mascot-container"
      className="absolute -right-[98px] sm:-right-[120px] bottom-[-16px] sm:bottom-[-11px] w-[185px] sm:w-[205px] h-[285px] pointer-events-none select-none z-20"
    >
      {/* Hand-Drawn Sketchy Ground Shadow */}
      <svg
        className="absolute bottom-[-2px] left-[32px] w-[140px] h-[16px] pointer-events-none opacity-30 select-none z-10"
        viewBox="0 0 100 10"
      >
        <ellipse cx="50" cy="5" rx="42" ry="2.5" fill="#30312C" />
        <path
          d="M 8 5 C 25 6, 75 4, 92 5 M 18 6 C 35 7, 65 5, 82 6 M 28 4 C 42 5, 58 3, 72 4"
          stroke="#30312C"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Fox Image Mascot */}
      {/* eslint-disable-next-img-element */}
      <img
        src="/fox.png"
        alt="Fox Mascot"
        className="relative w-[165px] h-auto ml-6 object-contain pointer-events-none z-10"
      />
    </div>
  );
};

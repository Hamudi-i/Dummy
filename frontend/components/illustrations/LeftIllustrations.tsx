import React from 'react';

export const LeftIllustrations: React.FC = () => {
  return (
    <div
      id="colab-left-illustrations"
      className="absolute left-0 top-0 w-[350px] xl:w-[410px] 2xl:w-[470px] h-full pointer-events-none select-none overflow-visible hidden lg:block"
    >
      {/* eslint-disable-next-img-element */}
      <img
        src="/illustration-left.png"
        alt="Left Side Illustrations"
        className="w-full h-full object-contain object-left transition-transform duration-700 pointer-events-auto"
      />
    </div>
  );
};

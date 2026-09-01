import React from 'react';

export const RightIllustrations: React.FC = () => {
  return (
    <div
      id="colab-right-illustrations"
      className="absolute right-8 xl:right-14 2xl:right-8 top-0 w-[300px] xl:w-[350px] 2xl:w-[400px] h-full pointer-events-none select-none overflow-visible hidden lg:block"
    >
      {/* eslint-disable-next-img-element */}
      <img
        src="/illustration-right.png"
        alt="Right Side Illustrations"
        className="w-full h-full object-contain object-right transition-transform duration-700 pointer-events-auto"
      />
    </div>
  );
};

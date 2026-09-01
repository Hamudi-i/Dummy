import React from 'react';

export const SideIllustrations: React.FC = () => {
  return (
    <>
      {/* Left Side Illustration */}
      <div
        id="colab-left-illustrations"
        className="illustration-side-left"
      >
        {/* eslint-disable-next-img-element */}
        <img
          src="/illustration-left.png"
          alt="Left Side Illustrations"
          className="illustration-img object-left"
        />
      </div>

      {/* Right Side Illustration */}
      <div
        id="colab-right-illustrations"
        className="illustration-side-right"
      >
        {/* eslint-disable-next-img-element */}
        <img
          src="/illustration-right.png"
          alt="Right Side Illustrations"
          className="illustration-img object-right"
        />
      </div>
    </>
  );
};

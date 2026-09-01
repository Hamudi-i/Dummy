import React from 'react';

export const WelcomeSign: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center -mb-2 z-10 select-none">
      {/* Hand-drawn Arrow Sign */}
      <div className="relative inline-flex items-center justify-center">
        <svg
          width="260"
          height="48"
          viewBox="0 0 204 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          {/* Outer sign boundary with arrow pointing right */}
          <path
            d="M 5 3 L 176 3 L 199 19 L 176 35 L 5 35 Z"
            fill="#FAF7EE"
            stroke="#30312C"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Inner subtle sketchy line */}
          <path
            d="M 8 6 L 174 6 L 194 19 L 174 32 L 8 32 Z"
            stroke="#30312C"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            strokeLinejoin="round"
          />
          {/* Tiny wood grain or sketch marks */}
          <path
            d="M 12 10 L 16 10 M 165 28 L 170 28"
            stroke="#B5ADA1"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>

        {/* Text inside sign */}
        <span className="absolute left-8 top-2.5 font-comic text-[#30312C] text-[16.5px] sm:text-[17px] font-bold tracking-wider">
          WELCOME TO CO-LAB!
        </span>
      </div>

      {/* Wooden Signpost Pole extending downward */}
      <div className="w-[13px] h-[22px] -mt-[1px] bg-[#CBB191] border-x-2 border-[#30312C] flex flex-col justify-between">
        <div className="w-full h-[2px] bg-[#B0926E] opacity-50 mt-1.5"></div>
      </div>
    </div>
  );
};

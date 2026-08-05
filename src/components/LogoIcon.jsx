import React from 'react';

export const LogoIcon = ({ className = "w-6 h-6", color = "currentColor" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Head Ring */}
      <circle cx="50" cy="16" r="5" stroke={color} strokeWidth="6" fill="none" />

      {/* Bottom Head Ring */}
      <circle cx="50" cy="84" r="5" stroke={color} strokeWidth="6" fill="none" />

      {/* Top Figure Body & Shoulders */}
      <path
        d="M 36 24 C 26 24 20 32 20 44"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 64 24 C 74 24 80 32 80 44"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Bottom Figure Body & Shoulders */}
      <path
        d="M 36 76 C 26 76 20 68 20 56"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 64 76 C 74 76 80 68 80 56"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Left Loop */}
      <path
        d="M 40 34 H 22 C 14 34 14 66 22 66 H 40"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Loop */}
      <path
        d="M 60 34 H 78 C 86 34 86 66 78 66 H 60"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Interlocking S-Curves */}
      <path
        d="M 42 25 V 42 C 42 46 46 50 50 50 H 62 C 67 50 71 54 71 59 V 65 C 71 70 67 74 62 74 H 42"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 58 75 V 58 C 58 54 54 50 50 50 H 38 C 33 50 29 46 29 41 V 35 C 29 30 33 26 38 26 H 58"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoIcon;

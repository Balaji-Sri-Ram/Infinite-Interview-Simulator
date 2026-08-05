import React from 'react';

export const LogoIcon = ({ className = "w-6 h-6", color = "currentColor" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Head */}
      <circle cx="50" cy="15" r="5.5" fill={color} />
      
      {/* Bottom Head */}
      <circle cx="50" cy="85" r="5.5" fill={color} />

      {/* Interlocking Infinity Figure Loop 1 */}
      <path
        d="M 32 30 C 32 10, 68 10, 68 30 V 42 C 68 46, 64 50, 60 50 H 40 C 36 50, 32 54, 32 58 V 70 C 32 90, 68 90, 68 70"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Interlocking Infinity Figure Loop 2 */}
      <path
        d="M 30 32 C 10 32, 10 68, 30 68 H 42 C 46 68, 50 64, 50 60 V 40 C 50 36, 54 32, 58 32 H 70 C 90 32, 90 68, 70 68"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoIcon;

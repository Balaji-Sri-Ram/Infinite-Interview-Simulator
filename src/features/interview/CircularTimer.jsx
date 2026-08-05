import React, { useState, useEffect } from 'react';
import { formatTime } from '../../shared/utils';

export const CircularTimer = ({
  totalSeconds = 30,
  isActive = false,
  onTimeExpired,
  label = "Timer",
  mode = "short" // 'short' (18s) or 'long' (03:45)
}) => {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds, isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      if (onTimeExpired) onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeExpired]);

  // SVG Circular math
  const radius = 26;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / (totalSeconds || 1)) * 100));
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Dynamic stroke color based on remaining time percentage
  let strokeColor = "#10B981"; // Green
  if (progressPercent < 20 || (mode === "short" && timeLeft <= 5)) {
    strokeColor = "#EF4444"; // Red
  } else if (progressPercent <= 50 || (mode === "short" && timeLeft <= 10)) {
    strokeColor = "#F59E0B"; // Amber
  }

  const displayText = mode === "long" ? formatTime(timeLeft) : `${timeLeft}s`;

  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          {/* Background Track Circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated Progress Stroke */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Centered Countdown Text */}
        <span className="absolute font-mono font-bold text-xs sm:text-sm text-[#111827]">
          {displayText}
        </span>
      </div>

      {label && (
        <span className="text-[10px] text-[#6B7280] font-medium mt-1 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { DIFFICULTY_THINK_TIME } from '../../shared/constants';
import { formatTime } from '../../shared/utils';

export const CountdownTimer = ({ difficulty = 5, isActive = false, onTimeExpired }) => {
  const initialSeconds = DIFFICULTY_THINK_TIME[difficulty] || 240;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const total = DIFFICULTY_THINK_TIME[difficulty] || 240;
    setTimeLeft(total);
  }, [difficulty, isActive]);

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

  const total = DIFFICULTY_THINK_TIME[difficulty] || 240;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / total) * 100));
  const minutesLimit = Math.round(total / 60);

  // Bar color: >60s = #10B981 (green), 30s-60s = #F59E0B (amber), <30s = #EF4444 (red)
  let barColorClass = "bg-[#10B981]";
  if (timeLeft < 30) {
    barColorClass = "bg-[#EF4444]";
  } else if (timeLeft <= 60) {
    barColorClass = "bg-[#F59E0B]";
  }

  return (
    <div className="w-full max-w-[700px] mx-auto space-y-2">
      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span>Time remaining for your answer ({minutesLimit} min limit)</span>
        <span className="font-mono text-[#111827] font-semibold text-sm">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Full-width Depleting Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
        <div
          className={`h-full ${barColorClass} transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

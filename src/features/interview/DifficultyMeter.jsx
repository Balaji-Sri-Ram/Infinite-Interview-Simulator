import React from 'react';
import { Flame } from 'lucide-react';

export const DifficultyMeter = ({ currentDifficulty = 5, peakDifficulty = 5 }) => {
  // Determine color theme based on difficulty scale
  const getLevelBadge = (level) => {
    if (level <= 3) return { label: 'Beginner', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (level <= 6) return { label: 'Intermediate', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    if (level <= 8) return { label: 'Advanced', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' };
    return { label: 'Expert Edge', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse' };
  };

  const levelInfo = getLevelBadge(currentDifficulty);

  return (
    <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
      {/* Flame Icon */}
      <div className="relative">
        <Flame className={`w-5 h-5 ${currentDifficulty >= 7 ? 'text-orange-500 animate-flame' : 'text-amber-400'}`} />
      </div>

      {/* Progress Bars (1 to 10) */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 10 }).map((_, idx) => {
            const level = idx + 1;
            const isActive = level <= currentDifficulty;
            return (
              <div
                key={level}
                className={`w-2 h-4 rounded-sm transition-all duration-300 ${
                  isActive
                    ? level <= 3
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                      : level <= 6
                      ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                      : level <= 8
                      ? 'bg-orange-500 shadow-sm shadow-orange-500/50'
                      : 'bg-rose-500 shadow-sm shadow-rose-500/80 animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Difficulty: <strong className="text-white">{currentDifficulty}/10</strong></span>
          <span>Peak: <strong className="text-indigo-400">{peakDifficulty}</strong></span>
        </div>
      </div>

      {/* Level Badge */}
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${levelInfo.color}`}>
        {levelInfo.label}
      </span>
    </div>
  );
};

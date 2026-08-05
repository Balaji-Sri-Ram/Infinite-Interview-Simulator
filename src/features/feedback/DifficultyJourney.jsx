import React from 'react';

export const DifficultyJourney = ({ difficultyHistory = [] }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        Difficulty Journey
      </h3>

      <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-between overflow-x-auto gap-3">
        {difficultyHistory.map((diff, index) => {
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-[60px] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">
                  {index === 0 ? 'Start' : `Q${index}`}
                </span>
                <div className="px-3 py-2 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-center">
                  <p className="text-xs font-bold text-[#111827]">
                    Level {diff}
                  </p>
                </div>
              </div>
              {index < difficultyHistory.length - 1 && (
                <span className="text-[#9CA3AF] font-bold text-sm shrink-0">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

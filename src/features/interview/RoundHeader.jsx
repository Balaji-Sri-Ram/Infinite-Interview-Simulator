import React from 'react';
import { TOPICS } from '../../shared/constants';
import { useInterviewStore } from '../../state/interviewStore';

export const RoundHeader = () => {
  const store = useInterviewStore();
  const topic = store.topic || 'DSA';
  const currentRound = store.currentRound || 1;
  const totalRounds = store.totalRounds || 5;
  const currentDifficulty = store.difficulty || store.currentDifficulty || 5;
  const resetSession = store.resetSession || store.resetInterview;
  
  const topicData = TOPICS[topic] || TOPICS.DSA;
  const progressPercent = (currentDifficulty / 10) * 100;
  
  let displayTitle = topicData.label;
  if (store.profileMode === 'resume') {
    displayTitle = "Resume-Based Interview";
  } else if (store.profileMode === 'linkedin') {
    displayTitle = "LinkedIn Profile Interview";
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10 my-3">
      {/* Left: Question Number & Topic */}
      <div className="text-sm sm:text-base font-bold text-[#111827] shrink-0 text-center sm:text-left">
        Question {currentRound} of {totalRounds} · {displayTitle}
      </div>

      {/* Center: Stacked Difficulty Progress Bar (Line on top, text below) */}
      <div className="flex flex-col items-center space-y-1.5 w-full sm:w-auto flex-1 max-w-[280px]">
        <div className="w-full h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
          <div
            className="h-full bg-[#2D3A2D] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[#6B7280] font-mono">
          Difficulty {currentDifficulty}/10
        </span>
      </div>

      {/* Right: Exit Session Link */}
      <button
        onClick={resetSession}
        className="text-xs sm:text-sm text-[#6B7280] hover:text-[#111827] font-semibold transition-colors cursor-pointer shrink-0"
      >
        Exit Session
      </button>
    </div>
  );
};

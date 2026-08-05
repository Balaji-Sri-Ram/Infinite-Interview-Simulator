import React, { useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { ttsService } from '../../services/ttsService';
import { useInterviewStore } from '../../state/interviewStore';
import { CircularTimer } from './CircularTimer';
import { INTERVIEWER_THINK_TIME } from '../../shared/constants';

export const QuestionDisplay = ({ questionText, isActive = false, onThinkTimeExpired }) => {
  const { isInterviewerSpeaking, setIsInterviewerSpeaking, currentDifficulty, screen } = useInterviewStore();

  const thinkSeconds = INTERVIEWER_THINK_TIME[currentDifficulty] || 20;

  useEffect(() => {
    if (isActive && screen === 'INTERVIEW' && questionText && ttsService.isSupported()) {
      ttsService.speak(questionText, {
        onStart: () => setIsInterviewerSpeaking(true),
        onEnd: () => setIsInterviewerSpeaking(false),
        onError: () => setIsInterviewerSpeaking(false),
      });
    } else {
      ttsService.cancel();
      setIsInterviewerSpeaking(false);
    }

    return () => {
      ttsService.cancel();
      setIsInterviewerSpeaking(false);
    };
  }, [questionText, isActive, screen]);

  const handleListenClick = () => {
    if (isInterviewerSpeaking) {
      ttsService.cancel();
      setIsInterviewerSpeaking(false);
    } else {
      ttsService.speak(questionText, {
        onStart: () => setIsInterviewerSpeaking(true),
        onEnd: () => setIsInterviewerSpeaking(false),
        onError: () => setIsInterviewerSpeaking(false),
      });
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto bg-white border border-[#E5E7EB] rounded-[12px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] space-y-4">
      {/* Header Row: Question Text + Circular Think Timer on Right Side */}
      <div className="flex items-start justify-between gap-6">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#111827] leading-snug flex-1">
          {questionText}
        </h2>

        {/* Circular Think Timer on Right Side */}
        <CircularTimer
          totalSeconds={thinkSeconds}
          isActive={isActive}
          onTimeExpired={onThinkTimeExpired}
          label="Think Time"
          mode="short"
        />
      </div>

      {/* Right-aligned Listen Button */}
      {ttsService.isSupported() && (
        <div className="flex justify-start sm:justify-end pt-2 border-t border-[#E5E7EB]/60">
          <button
            type="button"
            onClick={handleListenClick}
            className="flex items-center space-x-1.5 text-xs text-[#6B7280] hover:text-[#111827] font-medium transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#2D3A2D]" />
            <span>Listen to Question</span>
          </button>
        </div>
      )}
    </div>
  );
};

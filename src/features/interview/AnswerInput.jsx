import React, { useState, useEffect, useRef } from 'react';
import { sttService } from '../../services/sttService';
import { useInterviewStore } from '../../state/interviewStore';
import { CircularTimer } from './CircularTimer';
import { CANDIDATE_ANSWER_TIME } from '../../shared/constants';

export const AnswerInput = ({ onSubmitAnswer, isEvaluating, isActive = false, onTimeExpired, onTypingStateChange }) => {
  const { userAnswer, setUserAnswer, setIsUserSpeaking, isUserSpeaking, currentDifficulty } = useInterviewStore();
  const [sttError, setSttError] = useState('');
  const [interimText, setInterimText] = useState('');
  const typingTimerRef = useRef(null);

  const answerSeconds = CANDIDATE_ANSWER_TIME[currentDifficulty] || 240;

  useEffect(() => {
    if (isEvaluating) {
      sttService.stopListening();
      setIsUserSpeaking(false);
      if (onTypingStateChange) onTypingStateChange(false);
    }
  }, [isEvaluating]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setUserAnswer(val);

    // Trigger active typing state for avatar animation
    if (onTypingStateChange) {
      onTypingStateChange(true);
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // Stop active typing animation 1.2s after user stops typing
    typingTimerRef.current = setTimeout(() => {
      if (onTypingStateChange) {
        onTypingStateChange(false);
      }
    }, 1200);
  };

  const toggleMic = () => {
    setSttError('');
    if (isUserSpeaking) {
      sttService.stopListening();
      setIsUserSpeaking(false);
    } else {
      if (!sttService.isSupported()) {
        setSttError('Voice recognition requires Chrome browser.');
        return;
      }

      setIsUserSpeaking(true);
      sttService.startListening({
        onResult: ({ final, interim }) => {
          setInterimText(interim);
          if (final) {
            setUserAnswer(userAnswer ? `${userAnswer} ${final}` : final);
            setInterimText('');
          }
        },
        onError: (err) => {
          setIsUserSpeaking(false);
          setSttError(`Voice error: ${err}`);
        },
        onEnd: () => {
          setIsUserSpeaking(false);
          setSttError('');
        }
      });
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isEvaluating) return;
    sttService.stopListening();
    setIsUserSpeaking(false);
    if (onTypingStateChange) onTypingStateChange(false);
    onSubmitAnswer(userAnswer || interimText || '[No answer provided]');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-[720px] mx-auto bg-white border border-[#E5E7EB] rounded-[12px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] space-y-4">
      {/* Header Row: Label & Word Count Left + Circular Timer Right */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            YOUR ANSWER
          </label>
          <span className="text-xs font-mono text-[#6B7280]">{wordCount} words</span>
        </div>

        {/* Circular Answer Timer on Right Side */}
        <CircularTimer
          totalSeconds={answerSeconds}
          isActive={isActive}
          onTimeExpired={onTimeExpired}
          label="Answer Time"
          mode="long"
        />
      </div>

      {/* Textarea */}
      <textarea
        value={userAnswer + (interimText ? ` ${interimText}` : '')}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        disabled={isEvaluating}
        placeholder="Type your structured technical answer here..."
        className="w-full min-h-[160px] p-4 text-base text-[#111827] bg-white border border-[#E5E7EB] rounded-lg focus:border-[#2D3A2D] outline-none leading-relaxed resize-none disabled:opacity-50"
      />

      {sttError && (
        <p className="text-xs text-rose-600">{sttError}</p>
      )}

      {/* Two Buttons Side by Side */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {/* Left: Voice Input Outlined Button */}
        <button
          type="button"
          onClick={toggleMic}
          disabled={isEvaluating}
          className={`px-5 py-3 rounded-lg border border-[#2D3A2D] text-[#2D3A2D] bg-white font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 ${
            isUserSpeaking ? 'bg-[#F0EFFF] border-[#2D3A2D] font-semibold' : 'hover:bg-[#F5F3EF]'
          }`}
        >
          {isUserSpeaking ? 'Listening...' : 'Voice Input'}
        </button>

        {/* Right: Submit Answer Solid Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isEvaluating}
          className="px-6 py-3 rounded-lg bg-[#2D3A2D] hover:bg-[#4A5D4E] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          Submit Answer →
        </button>
      </div>

      {/* Hint Text */}
      <p className="text-xs text-[#6B7280] text-center sm:text-left pt-1">
        Ctrl + Enter to submit
      </p>
    </div>
  );
};

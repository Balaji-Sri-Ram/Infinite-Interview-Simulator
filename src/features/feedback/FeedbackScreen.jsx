import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useInterviewStore } from '../../state/interviewStore';
import { DifficultyJourney } from './DifficultyJourney';
import { ScoreBreakdown } from './ScoreBreakdown';
import { WeakestAnswers } from './WeakestAnswers';
import { TOPICS } from '../../shared/constants';
import { ttsService } from '../../services/ttsService';

export const FeedbackScreen = () => {
  const {
    topic,
    questionsHistory,
    difficultyHistory,
    peakDifficulty,
    totalRounds,
    resetSession
  } = useInterviewStore();

  const [copied, setCopied] = useState(false);
  const topicData = TOPICS[topic] || TOPICS.DSA;

  useEffect(() => {
    // Immediately silence and cancel any ongoing speech when interview results screen loads
    ttsService.cancel();
    const t1 = setTimeout(() => ttsService.cancel(), 100);
    const t2 = setTimeout(() => ttsService.cancel(), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const highCount = questionsHistory.filter(q => q.correctness === 'high').length;
  const overallScorePercent = Math.round((highCount / (totalRounds || 5)) * 100);

  const handleCopyReport = () => {
    const reportText = `
# Infinite Interview Simulator Report
Topic: ${topicData.label} (${topic})
Peak Difficulty Reached: Level ${peakDifficulty}/10
Overall Score: ${overallScorePercent}% (${highCount}/${totalRounds} High Ratings)

Question History:
${questionsHistory.map((q, i) => `
${i + 1}. Q: ${q.question}
   Difficulty: Level ${q.difficulty}/10
   Correctness: ${q.correctness.toUpperCase()} | Depth: ${q.depth}
   Feedback: ${q.feedback}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto space-y-6 py-4 px-2 sm:px-4"
    >
      {/* Top Header Bar with Home Button at Top Right */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
          Interview Performance Summary
        </span>
        <button
          type="button"
          onClick={resetSession}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F8F9FA] text-[#374151] hover:text-[#111827] text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <Home className="w-4 h-4 text-[#2D3A2D]" />
          <span>Home</span>
        </button>
      </div>
      {/* Celebration Summary Header Card */}
      <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] text-center space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-bold text-[#111827]">
          Interview Complete!
        </h1>
        <p className="text-sm text-[#6B7280]">
          Completed all {totalRounds} questions for <strong className="text-[#111827]">{topicData.label}</strong>.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E7EB] text-center">
            <span className="text-xs text-[#6B7280]">Peak Difficulty</span>
            <p className="text-xl font-bold text-[#111827] mt-0.5">
              Level {peakDifficulty}
            </p>
          </div>

          <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E7EB] text-center">
            <span className="text-xs text-[#6B7280]">Score Rating</span>
            <p className="text-xl font-bold text-[#111827] mt-0.5">
              {overallScorePercent}%
            </p>
          </div>

          <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E7EB] text-center">
            <span className="text-xs text-[#6B7280]">Questions Answered</span>
            <p className="text-xl font-bold text-[#111827] mt-0.5">
              {questionsHistory.length} / {totalRounds}
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty Journey */}
      <DifficultyJourney difficultyHistory={difficultyHistory} />

      {/* Strongest & Weakest Analysis */}
      <WeakestAnswers questionsHistory={questionsHistory} />

      {/* Breakdown Table */}
      <ScoreBreakdown questionsHistory={questionsHistory} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopyReport}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F8F9FA] font-medium text-sm transition-colors cursor-pointer"
        >
          {copied ? 'Report Copied!' : 'Copy Detailed Report'}
        </button>

        <button
          type="button"
          onClick={resetSession}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#2D3A2D] hover:bg-[#4A5D4E] text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Try Another Session
        </button>
      </div>
    </motion.div>
  );
};

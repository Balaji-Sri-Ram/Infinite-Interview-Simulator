import React from 'react';

export const WeakestAnswers = ({ questionsHistory = [] }) => {
  const sortedByPerf = [...questionsHistory].sort((a, b) => {
    const scoreMap = { high: 3, medium: 2, low: 1 };
    return (scoreMap[b.correctness] || 2) - (scoreMap[a.correctness] || 2);
  });

  const strongest = sortedByPerf[0];
  const weakest = sortedByPerf[sortedByPerf.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {strongest && (
        <div className="bg-white p-6 rounded-xl border border-[#A7F3D0] shadow-[0_2px_12px_rgba(0,0,0,0.08)] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
            Strongest Response (Question {strongest.round})
          </span>
          <p className="text-sm font-semibold text-[#111827]">
            {strongest.question}
          </p>
          <p className="text-xs text-[#4B5563] bg-[#F8F9FA] p-3 rounded-lg border border-[#E5E7EB]">
            {strongest.answer || '[No answer]'}
          </p>
          <p className="text-xs text-[#065F46]">
            {strongest.feedback}
          </p>
        </div>
      )}

      {weakest && (
        <div className="bg-white p-6 rounded-xl border border-[#FECACA] shadow-[0_2px_12px_rgba(0,0,0,0.08)] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
            Key Area for Improvement (Question {weakest.round})
          </span>
          <p className="text-sm font-semibold text-[#111827]">
            {weakest.question}
          </p>
          <p className="text-xs text-[#4B5563] bg-[#F8F9FA] p-3 rounded-lg border border-[#E5E7EB]">
            {weakest.answer || '[No answer provided]'}
          </p>
          <p className="text-xs text-[#991B1B]">
            {weakest.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

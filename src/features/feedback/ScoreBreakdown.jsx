import React from 'react';

export const ScoreBreakdown = ({ questionsHistory = [] }) => {
  const getCorrectnessBadge = (status) => {
    switch (status) {
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-medium">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs font-medium">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        Question-by-Question Breakdown
      </h3>

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8F9FA] text-[#6B7280] uppercase tracking-wider border-b border-[#E5E7EB] text-[11px]">
              <tr>
                <th className="py-3 px-4">Q#</th>
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Correctness</th>
                <th className="py-3 px-4">Depth</th>
                <th className="py-3 px-4">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#374151]">
              {questionsHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#6B7280]">Q{item.round}</td>
                  <td className="py-3.5 px-4 max-w-xs font-medium truncate" title={item.question}>
                    {item.question}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#111827]">
                    {item.difficulty}/10
                  </td>
                  <td className="py-3.5 px-4">{getCorrectnessBadge(item.correctness)}</td>
                  <td className="py-3.5 px-4 capitalize text-[#6B7280]">{item.depth}</td>
                  <td className="py-3.5 px-4 text-[#4B5563] text-xs">
                    {item.feedback}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

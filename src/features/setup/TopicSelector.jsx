import React from 'react';
import { TOPICS } from '../../shared/constants';

export const TopicSelector = ({ selectedTopic, onSelectTopic }) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
        SELECT TOPIC
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(TOPICS).map((topic) => {
          const isSelected = selectedTopic === topic.id;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full text-left p-4 rounded-lg transition-all duration-150 border cursor-pointer ${
                isSelected
                  ? 'bg-[#F0EFFF] border-[#2D3A2D] text-[#111827] font-semibold'
                  : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF]'
              }`}
            >
              <div className="text-sm font-medium">{topic.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

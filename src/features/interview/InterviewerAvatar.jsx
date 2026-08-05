import React from 'react';

export const InterviewerAvatar = ({ isSpeaking }) => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* 280px Avatar Circle Container with Concentric Ripple Rings */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        
        {/* THREE Concentric Ripple Rings with enhanced opacity */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-[#2D3A2D]/50 bg-[#2D3A2D]/10 ripple-ring-1 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-2 border-[#2D3A2D]/50 bg-[#2D3A2D]/10 ripple-ring-2 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-2 border-[#2D3A2D]/50 bg-[#2D3A2D]/10 ripple-ring-3 pointer-events-none" />
          </>
        )}

        {/* SVG Avatar Image */}
        <img
          src={isSpeaking ? "/avatars/interviewer-speaking.svg" : "/avatars/interviewer-idle.svg"}
          alt="AI Technical Interviewer"
          className="w-full h-full object-contain relative z-10"
        />
      </div>

      {/* Small Label Below */}
      <span className="text-xs text-[#6B7280] font-medium mt-2">
        AI Lead Technical Interviewer
      </span>
    </div>
  );
};

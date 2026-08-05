import React from 'react';

export const UserAvatar = ({ isUserSpeaking, isTyping }) => {
  const isActive = isUserSpeaking || isTyping;

  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* 280px Avatar Circle Container with Concentric Ripple Rings */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        
        {/* THREE Concentric Ripple Rings in Green with enhanced opacity */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-[#10B981]/50 bg-[#10B981]/10 ripple-ring-1 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-2 border-[#10B981]/50 bg-[#10B981]/10 ripple-ring-2 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-2 border-[#10B981]/50 bg-[#10B981]/10 ripple-ring-3 pointer-events-none" />
          </>
        )}

        {/* Candidate SVG Avatar */}
        <img
          src={isActive ? "/avatars/user-speaking.svg" : "/avatars/user-avatar.svg"}
          alt="Candidate Avatar"
          className="w-full h-full object-contain relative z-10"
        />

        {/* Dynamic Animated Mouth Overlay when active */}
        {isActive && (
          <div className="absolute top-[51%] left-[50%] -translate-x-1/2 w-4 h-2 bg-rose-900 rounded-full animate-mouth border border-rose-500/50 z-20" />
        )}
      </div>

      {/* Small Label Below */}
      <span className="text-xs text-[#6B7280] font-medium mt-2">
        Your Turn
      </span>
    </div>
  );
};

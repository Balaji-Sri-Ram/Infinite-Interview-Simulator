import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useInterviewStore } from './state/interviewStore';
import { SetupScreen } from './features/setup/SetupScreen';
import { InterviewScreen } from './features/interview/InterviewScreen';
import { FeedbackScreen } from './features/feedback/FeedbackScreen';
import { ttsService } from './services/ttsService';

export function App() {
  const { screen } = useInterviewStore();
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Stop any speech playback whenever active screen changes
    ttsService.cancel();
  }, [screen]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBFBF9]">
      {/* NAVBAR */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Left */}
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.svg"
              alt="Infinite Interview Simulator"
              className="h-7 w-auto object-contain shrink-0"
            />
            <span className="font-bold text-lg text-[#2D3A2D] tracking-tight">
              Infinite Interview Simulator
            </span>
          </div>

          {/* Right Status */}
          <div className="flex items-center space-x-2 text-sm text-[#374151]">
            <span className={`w-2.5 h-2.5 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="font-medium text-xs sm:text-sm">
              {apiKey ? "Gemini 2.5 Flash Connected" : "Add Gemini Key to .env"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Routing */}
      <main className="flex-1 py-8 px-4">
        <AnimatePresence mode="wait">
          {screen === 'SETUP' && <SetupScreen key="setup" />}
          {screen === 'INTERVIEW' && <InterviewScreen key="interview" />}
          {screen === 'FEEDBACK' && <FeedbackScreen key="feedback" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-4 text-center text-xs text-[#6B7280]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Infinite Interview Simulator — AI Technical Assessment Platform</span>
          <span>Powered by Google Gemini 2.5 Flash & Web Speech API</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

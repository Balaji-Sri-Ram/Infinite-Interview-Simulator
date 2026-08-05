// src/state/interviewStore.js
import { create } from 'zustand';

export const useInterviewStore = create((set, get) => ({
  // Setup
  topic: 'DSA',
  difficulty: 5,
  initialDifficultyLevel: 'medium',
  profileMode: 'topic',
  
  // Profile data
  resumeText: null,
  resumeFileName: '',
  linkedinUrl: '',
  candidateProfile: null,
  
  // Interview state
  phase: 'setup',
  screen: 'SETUP',
  currentQuestion: null,
  currentRound: 0,
  totalRounds: 5,
  pastQuestions: [],
  feedbackHistory: [],
  questionsHistory: [],
  peakDifficulty: 5,
  difficultyHistory: [5],
  isLoading: false,
  isEvaluating: false,
  loadingStep: 0,
  isInterviewerSpeaking: false,
  isUserSpeaking: false,
  userAnswer: '',
  error: null,
  
  // ── ACTIONS ──────────────────────────
  
  setTopic: (topic) => {
    console.log('STORE: setTopic', topic);
    set({ topic });
  },
  
  setDifficulty: (difficulty) => {
    console.log('STORE: setDifficulty', difficulty);
    set({ difficulty, peakDifficulty: Math.max(get().peakDifficulty, difficulty) });
  },
  
  setProfileMode: (mode) => {
    console.log('STORE: setProfileMode', mode);
    set({ profileMode: mode });
  },

  setSetupField: (field, value) => {
    if (field === 'initialDifficultyLevel') {
      const diffMap = { easy: 3, medium: 5, hard: 8 };
      const newDiff = diffMap[value] || 5;
      set({ initialDifficultyLevel: value, difficulty: newDiff, peakDifficulty: newDiff, difficultyHistory: [newDiff] });
    } else {
      set({ [field]: value });
    }
  },
  
  setResumeText: (text) => {
    console.log('STORE: setResumeText, length:', text?.length);
    set({ resumeText: text });
  },
  
  setCandidateProfile: (profile) => {
    console.log('STORE: setCandidateProfile', profile);
    set({ candidateProfile: profile });
  },
  
  setPhase: (phase) => {
    console.log('STORE: setPhase', phase);
    const screenMap = { setup: 'SETUP', interview: 'INTERVIEW', feedback: 'FEEDBACK' };
    set({ phase, screen: screenMap[phase] || 'SETUP' });
  },
  
  setCurrentQuestion: (question) => {
    console.log('STORE: setCurrentQuestion', question);
    const state = get();
    
    // Add to pastQuestions if not already there
    if (question && !state.pastQuestions.includes(question)) {
      const nextRound = state.currentRound + 1;
      set({ 
        currentQuestion: question,
        pastQuestions: [...state.pastQuestions, question],
        currentRound: nextRound,
      });
      console.log('STORE: pastQuestions now has', get().pastQuestions.length, 'items');
    } else {
      set({ currentQuestion: question });
    }
  },
  
  addFeedback: (feedbackObj) => {
    const state = get();
    const newDiffHist = [...state.difficultyHistory, state.difficulty];
    const newPeak = Math.max(state.peakDifficulty, state.difficulty);
    
    set({
      feedbackHistory: [...state.feedbackHistory, feedbackObj],
      questionsHistory: [...state.questionsHistory, feedbackObj],
      difficultyHistory: newDiffHist,
      peakDifficulty: newPeak
    });
  },
  
  setDifficultyLevel: (level) => {
    const clamped = Math.max(1, Math.min(10, level));
    console.log('STORE: difficulty updated to', clamped);
    set({ 
      difficulty: clamped,
      peakDifficulty: Math.max(get().peakDifficulty, clamped)
    });
  },
  
  setIsLoading: (val) => set({ isLoading: val, isEvaluating: val }),
  setLoadingStep: (step) => set({ loadingStep: step }),
  setIsInterviewerSpeaking: (val) => set({ isInterviewerSpeaking: val }),
  setIsUserSpeaking: (val) => set({ isUserSpeaking: val }),
  setUserAnswer: (text) => set({ userAnswer: text }),
  
  resetInterview: () => {
    console.log('STORE: resetInterview');
    set({
      phase: 'setup',
      screen: 'SETUP',
      currentQuestion: null,
      currentRound: 0,
      pastQuestions: [],
      feedbackHistory: [],
      questionsHistory: [],
      difficultyHistory: [5],
      peakDifficulty: 5,
      isLoading: false,
      isEvaluating: false,
      loadingStep: 0,
      candidateProfile: null,
      resumeText: null,
      resumeFileName: '',
      linkedinUrl: '',
      difficulty: 5,
      userAnswer: ''
    });
  },
  resetSession: () => get().resetInterview()
}));

export default useInterviewStore;

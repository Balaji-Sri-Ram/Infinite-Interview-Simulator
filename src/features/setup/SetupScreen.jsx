import React from 'react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../../state/interviewStore';
import { TopicSelector } from './TopicSelector';
import { generateFirstQuestionFromTopic, analyzeProfileAndGenerateFirst } from '../../services/geminiService';
import { extractTextFromPDF } from '../../services/pdfService';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const SetupScreen = () => {
  const {
    topic,
    difficulty,
    initialDifficultyLevel,
    resumeFileName,
    resumeText,
    linkedinUrl,
    profileMode,
    isLoading,
    loadingStep,
    setSetupField,
    setProfileMode,
    setCurrentQuestion,
    setCandidateProfile,
    setPhase,
    setIsLoading,
    setLoadingStep
  } = useInterviewStore();

  const handleModeChange = (mode) => {
    setProfileMode(mode);
    setSetupField('profileMode', mode);
    if (mode === 'topic') {
      setSetupField('resumeText', null);
      setSetupField('resumeFileName', '');
      setSetupField('linkedinUrl', '');
    } else if (mode === 'resume') {
      setSetupField('linkedinUrl', '');
    } else if (mode === 'linkedin') {
      setSetupField('resumeText', null);
      setSetupField('resumeFileName', '');
    }
  };

  const handleTopicSelect = (topicId) => {
    setSetupField('topic', topicId);
  };

  const handleDifficultySelect = (level) => {
    setSetupField('initialDifficultyLevel', level);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const text = await extractTextFromPDF(file);
        setSetupField('resumeText', text);
        setSetupField('resumeFileName', file.name);
        setProfileMode('resume');
        setSetupField('profileMode', 'resume');
      } else {
        const text = await file.text();
        setSetupField('resumeText', text);
        setSetupField('resumeFileName', file.name);
        setProfileMode('resume');
        setSetupField('profileMode', 'resume');
      }
    } catch (err) {
      console.error("PDF Extraction error:", err);
      alert('Could not extract PDF text: ' + err.message);
    }
  };

  const handleStartInterview = async () => {
    const state = useInterviewStore.getState();
    const effectiveTopic = state.topic || 'DSA';
    const effectiveDiff = state.difficulty || 5;
    const activeMode = state.profileMode || 'topic';
    const activeText = state.resumeText || state.linkedinUrl;

    console.log('START INTERVIEW:', { 
      topic: effectiveTopic, 
      difficulty: effectiveDiff, 
      profileMode: activeMode 
    });

    setIsLoading(true);

    try {
      if (activeMode === 'topic' || !activeText || activeText.trim().length < 20) {
        // ── FLOW 1: Topic only ──
        setLoadingStep(1);
        const question = await generateFirstQuestionFromTopic(effectiveTopic, effectiveDiff);
        setCurrentQuestion(question);
        setPhase('interview');
      } else {
        // ── FLOW 2: Resume or LinkedIn ──
        if (!activeText || activeText.trim().length < 20) {
          alert(
            'Profile text is too short or missing. ' +
            'Please upload your resume or paste ' + 
            'your LinkedIn profile text.'
          );
          setIsLoading(false);
          return;
        }

        console.log('USING PROFILE TEXT, LENGTH:', activeText.length);

        setLoadingStep(1); // Reading profile
        await sleep(300);

        setLoadingStep(2); // Analyzing
        const result = await analyzeProfileAndGenerateFirst(activeText, effectiveTopic, effectiveDiff);

        setLoadingStep(3); // Building questions
        if (result?.candidateProfile) {
          setCandidateProfile(result.candidateProfile);
        }
        await sleep(300);

        setLoadingStep(4); // Ready
        setCurrentQuestion(result.firstQuestion);
        await sleep(300);

        setPhase('interview');
      }
    } catch (error) {
      console.error('START INTERVIEW ERROR:', error);
      alert('Error starting interview: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[600px] mx-auto space-y-8 py-4"
    >
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
          Infinite Interview Simulator
        </h1>
        <p className="text-[#6B7280] text-sm">
          AI-powered adaptive technical interview platform
        </p>
      </div>

      {/* Setup Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 space-y-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        
        {/* TOP MODE SELECTOR BOXES */}
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            SELECT INPUT METHOD
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'topic', label: 'Choose Topic' },
              { id: 'resume', label: 'Upload Resume' },
              { id: 'linkedin', label: 'LinkedIn Profile' },
            ].map((box) => {
              const isSelected = (profileMode || 'topic') === box.id;
              return (
                <button
                  key={box.id}
                  type="button"
                  onClick={() => handleModeChange(box.id)}
                  className={`p-4 rounded-lg text-center transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0EFFF] border-2 border-[#2D3A2D] text-[#111827] font-bold shadow-sm'
                      : 'bg-[#F8F9FA] border border-[#E5E7EB] text-[#9CA3AF] opacity-60 hover:opacity-100 hover:border-[#9CA3AF]'
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    {box.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RESPECTIVE OPTIONS DISPLAYED BASED ON SELECTED MODE */}
        {(profileMode === 'topic' || !profileMode) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TopicSelector
              selectedTopic={topic || 'DSA'}
              onSelectTopic={handleTopicSelect}
            />
          </motion.div>
        )}

        {profileMode === 'resume' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
              UPLOAD RESUME (PDF / TXT)
            </label>
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#E5E7EB] rounded-lg hover:border-[#2D3A2D] bg-[#FBFBF9] cursor-pointer transition-colors text-center">
              <span className="text-sm text-[#374151] font-medium">
                {resumeFileName ? `Selected File: ${resumeFileName}` : 'Drop PDF here or click to browse'}
              </span>
              <span className="text-xs text-[#6B7280] mt-1">
                {resumeText ? `Extracted ${resumeText.length} characters of profile context` : 'Interview questions will adapt specifically to your experience'}
              </span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </motion.div>
        )}

        {profileMode === 'linkedin' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
              LINKEDIN PROFILE TEXT
            </label>
            <textarea
              value={linkedinUrl || ''}
              onChange={(e) => {
                const val = e.target.value;
                setSetupField('linkedinUrl', val);
                setSetupField('resumeText', val);
              }}
              placeholder="Open your LinkedIn profile, select all text (Ctrl+A), copy (Ctrl+C), and paste here (Ctrl+V)..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#2D3A2D] text-sm text-[#111827] outline-none bg-white resize-none"
            />
            <p className="text-xs text-[#6B7280]">
              Paste text from your LinkedIn profile to personalize interview questions based on your background.
            </p>
          </motion.div>
        )}

        {/* DIFFICULTY LEVEL */}
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            DIFFICULTY LEVEL
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'easy', label: 'Easy' },
              { id: 'medium', label: 'Medium' },
              { id: 'hard', label: 'Hard' },
            ].map((diff) => {
              const isSelected = initialDifficultyLevel === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => handleDifficultySelect(diff.id)}
                  className={`py-3.5 px-4 rounded-lg text-center border text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0EFFF] border-[#2D3A2D] text-[#111827] font-semibold'
                      : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF]'
                  }`}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* LOADING INDICATOR / START BUTTON */}
        {isLoading ? (
          <div className="p-4 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB] text-center space-y-2">
            <div className="inline-block w-5 h-5 border-2 border-[#2D3A2D] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#111827]">
              {loadingStep === 1 && "Reading profile & initializing interview..."}
              {loadingStep === 2 && "Analyzing candidate profile with Gemini AI..."}
              {loadingStep === 3 && "Building personalized interview questions..."}
              {loadingStep === 4 && "Preparing interview session..."}
              {(!loadingStep || loadingStep === 0) && "Calling Gemini API..."}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleStartInterview}
            className="w-full py-4 rounded-lg bg-[#2D3A2D] hover:bg-[#4A5D4E] text-white font-semibold text-base transition-colors cursor-pointer"
          >
            Start Interview
          </button>
        )}
      </div>
    </motion.div>
  );
};

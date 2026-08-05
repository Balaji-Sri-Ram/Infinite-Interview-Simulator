import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewStore } from '../../state/interviewStore';
import { RoundHeader } from './RoundHeader';
import { InterviewerAvatar } from './InterviewerAvatar';
import { UserAvatar } from './UserAvatar';
import { QuestionDisplay } from './QuestionDisplay';
import { AnswerInput } from './AnswerInput';
import { evaluateAndGetNextQuestion } from '../../services/geminiService';

export const InterviewScreen = () => {
  const {
    currentQuestion,
    difficulty,
    isLoading,
    isInterviewerSpeaking,
    isUserSpeaking,
    userAnswer,
    setUserAnswer,
    setIsLoading,
    setCurrentQuestion,
    setDifficultyLevel,
    addFeedback,
    setPhase
  } = useInterviewStore();

  const [activeStep, setActiveStep] = useState('QUESTION'); // 'QUESTION' | 'ANSWER'
  const [dotCount, setDotCount] = useState(1);
  const [isActivelyTyping, setIsActivelyTyping] = useState(false);

  // Cycle dots ("Evaluating.", "Evaluating..", "Evaluating...") during loading state
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleReadyToAnswer = () => {
    setActiveStep('ANSWER');
  };

  const handleSubmitAnswer = async (answerText) => {
    setIsActivelyTyping(false);
    const state = useInterviewStore.getState();
    const actualAnswer = answerText || state.userAnswer || "[No answer provided]";
    
    // Log everything before API call
    console.log('SUBMITTING ANSWER:', {
      topic: state.topic,
      difficulty: state.difficulty,
      question: state.currentQuestion,
      answerLength: actualAnswer.length,
      pastQuestionsCount: state.pastQuestions.length,
      pastQuestions: state.pastQuestions,
      candidateProfile: state.candidateProfile,
    });

    setIsLoading(true);

    try {
      const result = await evaluateAndGetNextQuestion({
        topic: state.topic || 'DSA',
        difficulty: state.difficulty || 5,
        questionAsked: state.currentQuestion,
        userAnswer: actualAnswer,
        pastQuestions: state.pastQuestions,
        candidateProfile: state.candidateProfile,
      });

      console.log('GOT NEXT QUESTION:', result.next_question);

      // Save feedback for end screen
      addFeedback({
        round: state.currentRound,
        question: state.currentQuestion,
        answer: actualAnswer,
        correctness: result.correctness,
        feedback: result.feedback || result.one_line_feedback,
        difficulty: state.difficulty,
        depth: result.depth || 'detailed'
      });

      // Check if total rounds completed (5 rounds)
      if (state.currentRound >= (state.totalRounds || 5)) {
        setPhase('feedback');
      } else {
        // Update difficulty
        setDifficultyLevel(result.next_difficulty);

        // Set next question (also adds to pastQuestions in store)
        setCurrentQuestion(result.next_question);

        // Clear answer input
        setUserAnswer('');
        setActiveStep('QUESTION');
      }

    } catch (error) {
      console.error('SUBMIT ERROR:', error);
      alert('Error getting next question: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when candidate 3-5 minute answer timer expires
  const handleAutoSubmit = () => {
    const currentAnswerText = userAnswer || "[Time expired — answer submitted]";
    handleSubmitAnswer(currentAnswerText);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FBFBF9] py-4 space-y-4 w-full">
      {/* Centered Container */}
      <div className="w-full max-w-4xl px-4 space-y-4 flex flex-col items-center">
        
        {/* Floating Rounded Header Bar */}
        <RoundHeader />

        {/* SCREEN 4 — LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <InterviewerAvatar isSpeaking={false} />
            <div className="text-sm font-medium text-[#374151]">
              Evaluating your answer with Gemini AI{'.'.repeat(dotCount)}
            </div>
          </div>
        ) : (
          <>
            {/* AVATAR STAGE WITH SLIDE TRANSITION */}
            <div className="w-full flex justify-center overflow-hidden py-1 min-h-[330px]">
              <AnimatePresence mode="wait">
                {activeStep === 'QUESTION' ? (
                  <motion.div
                    key="interviewer-avatar"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full flex flex-col items-center"
                  >
                    <InterviewerAvatar isSpeaking={isInterviewerSpeaking} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="candidate-avatar"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full flex flex-col items-center"
                  >
                    <UserAvatar
                      isUserSpeaking={isUserSpeaking}
                      isTyping={isActivelyTyping}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SCREEN 2 — INTERVIEWER TURN (Question Display + Circular Think Timer on Right) */}
            {activeStep === 'QUESTION' && (
              <div className="w-full space-y-5 flex flex-col items-center">
                {/* QUESTION CARD WITH CIRCULAR THINK TIMER ON RIGHT */}
                <QuestionDisplay
                  questionText={currentQuestion}
                  isActive={activeStep === 'QUESTION'}
                  onThinkTimeExpired={handleReadyToAnswer}
                />

                {/* READY TO ANSWER BUTTON */}
                <button
                  type="button"
                  onClick={handleReadyToAnswer}
                  className="w-full max-w-[720px] py-4 rounded-lg bg-[#2D3A2D] hover:bg-[#4A5D4E] text-white font-semibold text-base transition-colors cursor-pointer"
                >
                  Ready to Answer →
                </button>
              </div>
            )}

            {/* SCREEN 3 — CANDIDATE TURN (Answer Console + Circular 3-5 Min Answer Timer on Right) */}
            {activeStep === 'ANSWER' && (
              <div className="w-full space-y-4 flex flex-col items-center">
                {/* QUESTION REMINDER */}
                <p className="text-sm text-[#6B7280] w-full text-left max-w-[720px] px-1 break-words">
                  <span className="font-semibold text-[#111827]">Question:</span> {currentQuestion}
                </p>

                {/* ANSWER INPUT CARD WITH CIRCULAR ANSWER TIMER ON RIGHT */}
                <AnswerInput
                  onSubmitAnswer={handleSubmitAnswer}
                  isEvaluating={isLoading}
                  isActive={activeStep === 'ANSWER'}
                  onTimeExpired={handleAutoSubmit}
                  onTypingStateChange={setIsActivelyTyping}
                />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

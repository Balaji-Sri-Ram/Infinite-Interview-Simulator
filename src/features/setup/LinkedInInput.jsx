import React, { useState } from 'react';
import useInterviewStore from '../../state/interviewStore';

export const LinkedInInput = () => {
  const [pastedText, setPastedText] = useState('');
  const setResumeText = useInterviewStore((s) => s.setResumeText);
  const setProfileMode = useInterviewStore((s) => s.setProfileMode);
  const setSetupField = useInterviewStore((s) => s.setSetupField);

  const handleConfirm = () => {
    if (pastedText.trim().length < 50) {
      alert(
        'Please paste more text from your ' +
        'LinkedIn profile. Select all (Ctrl+A) ' +
        'and copy the full page.'
      );
      return;
    }
    
    // SAME as resume — save text to store
    setResumeText(pastedText);
    setProfileMode('linkedin');
    if (setSetupField) setSetupField('linkedinUrl', pastedText);
    
    console.log('LINKEDIN TEXT SAVED, LENGTH:', pastedText.length);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#6B7280]">
        Open your LinkedIn profile, select all text (Ctrl+A), copy (Ctrl+C), paste below (Ctrl+V):
      </p>
      <textarea
        value={pastedText}
        onChange={(e) => setPastedText(e.target.value)}
        placeholder="Paste your LinkedIn profile text here..."
        rows={6}
        className="w-full p-3 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] outline-none bg-white resize-none"
      />
      <button
        type="button"
        onClick={handleConfirm}
        className="px-4 py-2 rounded-lg bg-[#2D3A2D] hover:bg-[#4A5D4E] text-white text-xs font-semibold cursor-pointer"
      >
        Confirm Profile
      </button>
    </div>
  );
};

export default LinkedInInput;

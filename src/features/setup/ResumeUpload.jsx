import React from 'react';
import { extractTextFromPDF } from '../../services/pdfService';
import useInterviewStore from '../../state/interviewStore';

export const ResumeUpload = ({ onResumeParsed }) => {
  const setResumeText = useInterviewStore((s) => s.setResumeText);
  const setProfileMode = useInterviewStore((s) => s.setProfileMode);
  const setSetupField = useInterviewStore((s) => s.setSetupField);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file only.');
      return;
    }

    console.log('PDF FILE SELECTED:', file.name);

    try {
      const text = await extractTextFromPDF(file);

      // Save to store
      setResumeText(text);
      setProfileMode('resume');
      if (setSetupField) setSetupField('resumeFileName', file.name);
      if (onResumeParsed) onResumeParsed(text, file.name);

      console.log('RESUME TEXT SAVED TO STORE');
      console.log('PREVIEW:', text.slice(0, 200));

    } catch (error) {
      console.error('PDF ERROR:', error);
      alert('Could not read PDF: ' + error.message);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-wider text-[#6B7280]">
        📄 UPLOAD RESUME (PDF)
      </label>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="w-full text-sm text-[#374151] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#F0EFFF] file:text-[#111827] hover:file:bg-[#E5E5FF] cursor-pointer"
      />
    </div>
  );
};

export default ResumeUpload;

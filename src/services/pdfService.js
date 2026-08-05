// src/services/pdfService.js

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  console.log('EXTRACTING PDF TEXT from:', file.name);
  console.log('FILE SIZE:', file.size, 'bytes');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer 
    }).promise;
    
    console.log('PDF PAGES:', pdf.numPages);
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => item.str)
        .filter(str => str.trim().length > 0)
        .join(' ');
      fullText += pageText + '\n';
      console.log(`PAGE ${i} TEXT PREVIEW:`, 
        pageText.slice(0, 100));
    }
    
    console.log('TOTAL EXTRACTED TEXT LENGTH:', 
      fullText.length);
    console.log('EXTRACTED TEXT PREVIEW:', 
      fullText.slice(0, 500));
    
    if (fullText.trim().length < 50) {
      throw new Error(
        'Could not extract text from PDF. ' +
        'The PDF might be image-based or scanned.'
      );
    }
    
    return fullText;
    
  } catch (error) {
    console.error('PDF EXTRACTION ERROR:', error);
    throw error;
  }
};

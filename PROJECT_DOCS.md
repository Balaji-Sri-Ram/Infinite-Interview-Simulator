# 🚀 Infinite Interview Simulator

## 1. Introduction
The **Infinite Interview Simulator** is an advanced, AI-powered web application designed to help candidates prepare for technical interviews. It acts as a dynamic, real-time interviewer that can adapt its questions based on a candidate's resume, LinkedIn profile, or chosen technical topic (like Data Structures, DBMS, Machine Learning, etc.).

Unlike static question banks, this platform utilizes Generative AI (via OpenRouter) to evaluate answers in real-time, dynamically adjust the difficulty level, and provide instant verbal and textual feedback, simulating a true conversational interview experience.

---

## 2. System Architecture & Tech Stack

### Tech Stack
*   **Frontend Framework:** React.js (built with Vite for fast performance)
*   **Styling:** Tailwind CSS (for modern, responsive UI) & Framer Motion (for smooth animations)
*   **State Management:** Zustand (lightweight, unopinionated global state management)
*   **AI Provider:** OpenRouter API (dynamic routing to free LLMs like Llama 3, Gemma, etc.)
*   **Browser APIs:** Web Speech API for both Speech-to-Text (STT) and Text-to-Speech (TTS)
*   **PDF Parsing:** `pdfjs-dist` (local, client-side resume parsing)

### How It Works (Step-by-Step Flow)

1.  **Setup Phase (`SetupScreen`)**:
    *   The user selects a mode: **Topic-based**, **Resume-based**, or **LinkedIn-based**.
    *   If a PDF is uploaded, `pdfService.js` processes it entirely in the browser using Web Workers, extracting the raw text without sending the file to any server.
2.  **AI Initialization**:
    *   The raw profile data or topic is sent to the AI via `geminiService.js`.
    *   The AI acts as the interviewer, reads the data, and generates a personalized, highly relevant first question.
3.  **Interview Loop (`InterviewScreen`)**:
    *   **Question Delivery**: The generated question is displayed on screen and read aloud using the browser's native TTS (`ttsService.js`).
    *   **Candidate Answer**: The user clicks "Start Answering". The app uses STT (`sttService.js`) to transcribe their spoken words into text in real-time.
    *   **AI Evaluation**: Once submitted, the answer is sent to the AI. The AI evaluates the answer for **correctness** and **depth**.
    *   **Adaptive Difficulty**: Based on the AI's evaluation, the global Zustand state updates. If the answer was excellent, the difficulty increases (+1). If it was poor, it decreases (-1). 
    *   **Next Round**: The AI generates the next question at the newly adjusted difficulty level, ensuring no past questions are repeated.
4.  **Feedback Phase (`FeedbackScreen`)**:
    *   After 5 rounds (or the chosen limit), the interview concludes.
    *   The app displays a detailed dashboard showing the candidate's peak difficulty reached, an analysis of their strongest/weakest answers, and a copyable Markdown report.

---

## 3. Core File & Function Mapping

Here is a breakdown of the most important files and what they do:

### State Management (`src/state/interviewStore.js`)
*   **`useInterviewStore`**: The central brain of the app. It holds variables like `currentRound`, `difficulty`, `pastQuestions`, and `userAnswer`. Any component can access or update the interview state instantly without prop-drilling.

### AI Integration (`src/services/geminiService.js`)
*   **`callGemini(prompt)`**: The core fetch wrapper that talks to OpenRouter. It includes automatic retry logic (if rate-limited) and fallback models.
*   **`parseJSON(text)`**: A robust self-healing function that uses Regex to extract valid JSON from the AI's response, stripping away conversational text or markdown wrappers.
*   **`analyzeProfileAndGenerateFirst()`**: Takes the parsed resume text, asks the AI to identify skills/projects, and generates a highly personalized opening question.
*   **`evaluateAndGetNextQuestion()`**: Takes the user's answer, evaluates it against the previous question, calculates the new difficulty, and generates the *next* question.

### Voice Services (`src/services/`)
*   **`ttsService.js`**: Uses `window.speechSynthesis` to make the browser speak. Handles voice selection and canceling ongoing speech.
*   **`sttService.js`**: Uses `window.SpeechRecognition` to listen to the user's microphone and convert it to a string of text.

### PDF Parsing (`src/services/pdfService.js`)
*   **`extractTextFromPDF(file)`**: Uses Mozilla's PDF.js library to read a binary PDF file array buffer, iterate through its pages, and extract raw text for the AI to analyze.

---

## 4. Viva Preparation Questions

If you are presenting this project, be prepared to answer these questions:

> **Q1: Why did you choose Zustand over Redux for state management?**
> **Answer**: Redux is often overkill for a project of this size and introduces a lot of boilerplate code. Zustand is a minimalistic, hook-based state manager that allowed me to easily share complex interview states (like history, difficulty, and current phase) across components without wrapping my app in providers.

> **Q2: How does the AI know how to adjust the difficulty?**
> **Answer**: I wrote strict system prompts for the AI. When I send the user's answer to the AI, I instruct it to evaluate the answer's "correctness" and "depth". I provided a scoring rule: if the answer is highly correct and detailed, the AI returns a JSON property `"difficulty_adjustment": 1`. My frontend reads this JSON and updates the global difficulty state, which influences the strictness of the next question.

> **Q3: How are you parsing the PDF resumes? Are you sending user files to a server?**
> **Answer**: No, the PDF parsing is completely client-side for privacy and speed. I used `pdfjs-dist`. When a user uploads a file, a Web Worker reads the binary ArrayBuffer directly in the browser, extracts the text layer, and only sends the *text* to the AI prompt. The actual file never leaves the user's computer.

> **Q4: What happens if the AI model fails or hallucinated non-JSON output?**
> **Answer**: I implemented a robust `parseJSON` function. Often, LLMs return conversational text like "Here is your JSON: { ... }". My function uses a Regular Expression (`/\{[\s\S]*\}/`) to strictly pluck out only the JSON block. I also added string replacements to fix common AI mistakes, like illegal trailing commas. Furthermore, the API calls use `response_format: { type: "json_object" }` to force strict formatting at the API level.

> **Q5: Why are you using OpenRouter instead of the official Gemini or OpenAI SDK?**
> **Answer**: OpenRouter acts as an intelligent load balancer and aggregator. Instead of being locked into one provider, OpenRouter allows me to dynamically route requests to whichever free model is currently available (like Gemma, Llama 3, or Nemotron). If one model is rate-limited, my code automatically catches it and falls back to another model.

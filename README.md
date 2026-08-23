# Infinite Interview Simulator

> AI-powered adaptive interview platform that gets harder when you nail it, easier when you don't.

---



## Getting Started

1. **Clone this repo**:
   ```bash
   git clone https://github.com/yourname/infinite-interview-simulator.git
   cd infinite-interview-simulator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Get a free Gemini API key**:
   - Visit [Google AI Studio](https://aistudio.google.com) (free, Google account only)
   - Click **Get API Key** and copy your key.

4. **Set environment variable**:
   - Copy `.env.example` to `.env`
   - Paste your key:
     ```env
     VITE_GEMINI_API_KEY=your_key_here
     ```

5. **Run locally**:
   ```bash
   npm run dev
   ```

6. **Open Chrome**:
   - Open [http://localhost:5173](http://localhost:5173) in Google Chrome (required for Web Speech API speech-to-text recognition).

---

## How-To Guides

- **Add a new topic**: Add entry to `TOPICS` in `src/shared/constants.js` and update system prompt guidance in `src/shared/prompts.js`.
- **Change number of rounds**: Update `TOTAL_ROUNDS` constant in `src/shared/constants.js`.
- **Customize voices**: Update `src/services/ttsService.js` to target a different `SpeechSynthesisVoice` name.
- **Production Build & Deploy**:
  ```bash
  npm run build
  npx vercel --prod
  ```

---

## Environment Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | **Yes** | Free API key from Google AI Studio (`aistudio.google.com`) |

---

## Key Architectural Decisions (ADR)

1. **Framework — React + Vite (SPA)**: Zero SSR overhead, instant HMR, clean single-page state machine for rapid execution.
2. **LLM Engine — Google Gemini 2.5 Flash**: Completely free tier (1,500 requests/day), ultra-fast response times, combined evaluator + question generator in a single JSON API call.
3. **Voice Multimodal I/O — Browser Web Speech API**: Zero cost native `speechSynthesis` (TTS) and `SpeechRecognition` (STT) for real-time speech interaction without third-party audio API fees.
4. **State Machine — Zustand Store**: Unified session state store (`interviewStore.js`) tracking current round, question queue, difficulty trajectory, and detailed diagnostic logs without needing a database.
5. **Dynamic Think Timers — Difficulty Scaling Map**: Timers adjust based on question complexity (Easy 30s, Medium 20s, Hard 10s, Expert 5s).
6. **Parallel Animations & Non-blocking UX**: Transitions and thinking indicators fire immediately upon submission so the UI remains fluid and interactive.

---

## Viva / Presentation Defense Guide

When asked by evaluators why this project is advanced:

1. **Adaptive Assessment Engine**: Implements dynamic difficulty scaling inspired by Item Response Theory (IRT) used in GRE/GMAT testing. Questions scale up (+1) on high correctness and depth, scale down (-1) on surface/vague answers, or remain neutral (0).
2. **LLM-as-Judge & Generator Pattern**: Uses structured JSON output where Gemini concurrently acts as answer grader, depth assessor, and next question generator in a single round-trip prompt.
3. **Multimodal Voice & Text Input/Output**: Full text + voice interaction loop using native Web Speech API without external paid APIs.
4. **Zero-Latency Non-blocking UX**: Simultaneous execution of slide transitions, animated speech bubbles, sound wave indicators, and async Gemini calls.

---

## 🚀 Live Demo

Check out the live application here: [Infinite Interview Simulator](https://infinite-interview-simulator.vercel.app)

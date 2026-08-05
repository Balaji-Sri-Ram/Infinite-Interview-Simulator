/**
 * Strips markdown fences, quotes, and sanitize JSON responses from Gemini API
 */
export const cleanJsonText = (rawText) => {
  if (!rawText) return "";
  let clean = rawText.trim();
  // Remove markdown code fences like ```json ... ``` or ``` ... ```
  clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  // Find first '{' and last '}'
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end >= start) {
    clean = clean.substring(start, end + 1);
  }
  return clean.trim();
};

/**
 * Clamps a number between min and max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Sleep helper
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formats seconds into MM:SS
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

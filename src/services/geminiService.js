// src/services/geminiService.js

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
};

// ─────────────────────────────────────
// HELPER: call Gemini and return text
// ─────────────────────────────────────
const callGemini = async (prompt) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Please add your key to the .env file.");
  }

  // Active production models list (gemini-1.5-flash has free tier 15 RPM / 1500 RPD)
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastErrorText = "";

  for (const model of models) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      console.log(`CALLING GEMINI API (${model})...`);
      console.log('PROMPT PREVIEW:', prompt.slice(0, 200));

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: prompt }] 
          }],
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        lastErrorText = await response.text();
        console.warn(`Model ${model} returned error status ${response.status}:`, lastErrorText);
        // Continue to fallback model if 429 (Quota limit) or 404 (Not Found)
        continue;
      }

      const data = await response.json();
      console.log('GEMINI RAW RESPONSE:', data);

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        console.warn(`Model ${model} returned empty content, trying next model...`);
        continue;
      }

      console.log(`GEMINI SUCCESS (${model}):`, rawText);
      return rawText;
    } catch (err) {
      console.warn(`Attempt with ${model} failed:`, err);
      lastErrorText = err.message || String(err);
    }
  }

  throw new Error(`Gemini API failed across models: ${lastErrorText}`);
};

// ─────────────────────────────────────
// HELPER: parse JSON from Gemini text
// ─────────────────────────────────────
const parseJSON = (text) => {
  const clean = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error('JSON PARSE FAILED:', clean);
    throw new Error('Failed to parse Gemini JSON');
  }
};

// ─────────────────────────────────────
// FUNCTION 1: Generate first question
// for TOPIC ONLY flow
// ─────────────────────────────────────
export const generateFirstQuestionFromTopic = async (
  topic, 
  difficulty
) => {
  console.log('generateFirstQuestionFromTopic called', 
    { topic, difficulty });

  const prompt = `
You are a technical interviewer starting a 
${topic} interview.

Generate ONE interview question at difficulty 
${difficulty}/10.

Difficulty guide:
1-2: Basic definitions. "What is X?"
3-4: How things work. "How does X work?"
5-6: Tradeoffs. "When would you use X over Y?"
7-8: Design. "How would you design X for Y?"
9-10: Edge cases at scale.

IMPORTANT: Generate a UNIQUE question.
Use a random subtopic from ${topic}.
Do NOT use these overused questions:
- "What is a linked list?"
- "Explain OOPs concepts"
- "What is normalization?"

Respond with ONLY this JSON, nothing else:
{
  "question": "your question here",
  "subtopic": "which subtopic this covers",
  "difficulty": ${difficulty}
}
`;

  const text = await callGemini(prompt);
  const parsed = parseJSON(text);
  console.log('FIRST QUESTION GENERATED:', parsed);
  return parsed.question;
};

// ─────────────────────────────────────
// FUNCTION 2: Analyze resume/linkedin
// and generate first personalized question
// ─────────────────────────────────────
export const analyzeProfileAndGenerateFirst = async (
  profileText,
  topic,
  difficulty
) => {
  console.log('analyzeProfileAndGenerateFirst called');
  console.log('PROFILE TEXT LENGTH:', 
    profileText.length);
  console.log('PROFILE PREVIEW:', 
    profileText.slice(0, 300));

  const prompt = `
You are a technical interviewer who just read 
this candidate's profile:

"""
${profileText}
"""

INTERVIEW TOPIC: ${topic}
DIFFICULTY LEVEL: ${difficulty}/10

YOUR TASK:
1. Extract candidate details from the profile above
2. Generate a personalized first question based on 
   something SPECIFIC from their profile

Respond with ONLY this JSON, nothing else:
{
  "candidateProfile": {
    "name": "name if found, else Unknown",
    "experienceLevel": "fresher or junior or mid or senior",
    "skills": ["skill1", "skill2", "skill3"],
    "projects": [
      {
        "name": "project name",
        "tech": ["tech1", "tech2"],
        "description": "what they built"
      }
    ],
    "workExperience": [
      {
        "company": "company name",
        "role": "their role"
      }
    ]
  },
  "firstQuestion": "personalized question here",
  "questionIsBasedOn": "which part of profile"
}

RULES for firstQuestion:
- MUST reference something SPECIFIC from the profile
- If they have a project: ask about that project
- If they have work experience: ask about that role
- If they have specific skills: ask about those skills
- NEVER ask a generic question when profile data exists

GOOD example when profile has MySQL project:
"I can see you built a student management system 
using MySQL. How did you handle the case where 
two students tried to borrow the same book 
simultaneously?"

BAD example (never do this when profile exists):
"What is a primary key in a database?"
`;

  const text = await callGemini(prompt);
  const parsed = parseJSON(text);
  
  console.log('PROFILE ANALYSIS RESULT:', parsed);
  console.log('CANDIDATE PROFILE:', 
    parsed.candidateProfile);
  console.log('FIRST QUESTION:', parsed.firstQuestion);
  
  return {
    candidateProfile: parsed.candidateProfile,
    firstQuestion: parsed.firstQuestion,
  };
};

// ─────────────────────────────────────
// FUNCTION 3: Evaluate answer and 
// generate next question
// ─────────────────────────────────────
export const evaluateAndGetNextQuestion = async ({
  topic,
  difficulty,
  questionAsked,
  userAnswer,
  pastQuestions = [],
  candidateProfile = null,
}) => {
  console.log('evaluateAndGetNextQuestion called', {
    topic,
    difficulty,
    questionAsked,
    answerLength: (userAnswer || "").length,
    pastQuestionsCount: pastQuestions.length,
    pastQuestions,
    hasProfile: !!candidateProfile,
  });

  const profileBlock = candidateProfile ? `
CANDIDATE PROFILE (use to personalize questions):
Name: ${candidateProfile.name || 'Candidate'}
Level: ${candidateProfile.experienceLevel || 'N/A'}
Skills: ${candidateProfile.skills?.join(', ')}
Projects: ${candidateProfile.projects
  ?.map(p => `${p.name} (${p.tech?.join(', ')})`)
  .join('; ')}
Work: ${candidateProfile.workExperience
  ?.map(w => `${w.role} at ${w.company}`)
  .join('; ')}
` : 'No profile provided. Ask general questions.';

  const pastQuestionsBlock = pastQuestions.length > 0
    ? pastQuestions
        .map((q, i) => `${i + 1}. "${q}"`)
        .join('\n')
    : 'None — this is the second question.';

  const prompt = `
You are a strict technical interviewer for ${topic}.

${profileBlock}

━━━ EVALUATE THIS ANSWER ━━━
Question asked: "${questionAsked}"
Candidate answered: "${userAnswer}"

━━━ DO NOT REPEAT THESE QUESTIONS ━━━
${pastQuestionsBlock}

━━━ YOUR RESPONSE ━━━
Respond with ONLY this JSON, nothing else.
No markdown. No explanation. Just the JSON object.

{
  "correctness": "high or medium or low",
  "depth": "detailed or surface or vague",
  "difficulty_adjustment": 1 or 0 or -1,
  "next_difficulty": <${difficulty} plus adjustment, min 1 max 10>,
  "next_question": "completely new question here",
  "feedback": "one sentence about their answer"
}

━━━ SCORING RULES ━━━
high correctness + detailed depth = adjustment +1
low correctness OR vague depth = adjustment -1
anything else = adjustment 0

━━━ RULES FOR next_question ━━━
RULE 1: MUST be on a COMPLETELY DIFFERENT subtopic
than ALL questions listed in DO NOT REPEAT section.

RULE 2: BANNED PHRASES — never use:
- "elaborate further"
- "expand on"  
- "tell me more"
- "as you mentioned"
- "following up"
- "at difficulty level"
- "could you explain"

RULE 3: Match next_difficulty level:
1-2 = definition questions
3-4 = conceptual how/why questions
5-6 = tradeoff and application questions
7-8 = system design questions
9-10 = edge cases and failure scenarios

RULE 4: If candidateProfile exists, reference 
their actual projects/skills in the question
when naturally relevant.

RULE 5: Question must be ONE specific thing only.
Not multiple questions in one.
Not "explain everything about X".
`;

  const text = await callGemini(prompt);
  const parsed = parseJSON(text);
  
  console.log('EVALUATION RESULT:', parsed);
  console.log('NEXT QUESTION:', parsed.next_question);
  console.log('NEXT DIFFICULTY:', parsed.next_difficulty);
  
  return parsed;
};

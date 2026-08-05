const getSubtopics = (topic) => {
  const subtopics = {
    DSA: [
      "Arrays and string manipulation",
      "Linked lists (singly, doubly, circular)",
      "Stacks and queues",
      "Binary trees and BST operations",
      "Graph traversal (BFS, DFS)",
      "Dynamic programming and memoization",
      "Sorting algorithms and complexity",
      "Hashing and hash tables",
      "Heaps and priority queues",
      "Recursion and backtracking",
      "Greedy algorithms",
      "Segment trees and Fenwick trees",
      "Tries and prefix trees",
      "Sliding window technique",
      "Two pointer technique"
    ],
    DBMS: [
      "SQL joins (inner, outer, cross)",
      "Normalization (1NF, 2NF, 3NF, BCNF)",
      "Indexing strategies and B+ trees",
      "ACID properties and transactions",
      "Concurrency control and locking",
      "Query optimization and execution plans",
      "Stored procedures and triggers",
      "NoSQL vs SQL tradeoffs",
      "CAP theorem",
      "Sharding and partitioning",
      "Replication strategies",
      "Database deadlocks",
      "Views and materialized views",
      "Connection pooling",
      "Data warehousing concepts"
    ],
    OS: [
      "Process vs thread differences",
      "CPU scheduling algorithms",
      "Deadlock conditions and prevention",
      "Memory management and paging",
      "Virtual memory and page replacement",
      "File system structure",
      "Inter-process communication (IPC)",
      "Semaphores and mutex",
      "Context switching",
      "Banker's algorithm",
      "Cache memory hierarchy",
      "System calls",
      "Kernel vs user space",
      "Boot process",
      "Thrashing in virtual memory"
    ],
    CN: [
      "OSI model layers and roles",
      "TCP vs UDP differences",
      "HTTP vs HTTPS and TLS handshake",
      "DNS resolution process",
      "IP addressing and subnetting",
      "Routing protocols (OSPF, BGP)",
      "NAT and its types",
      "TCP three-way handshake",
      "Congestion control in TCP",
      "CDN architecture",
      "Load balancing strategies",
      "Websockets vs HTTP polling",
      "Firewall and packet filtering",
      "DHCP process",
      "ARP protocol"
    ]
  };

  const list = subtopics[topic] || subtopics.DSA;
  return list.map((s, i) => `${i + 1}. ${s}`).join('\n');
};

export const analyzeResumePrompt = (resumeText, topic, difficulty) => `
You are preparing a PERSONALIZED technical interview based on this candidate's resume.

RESUME TEXT:
"""
${resumeText}
"""

INTERVIEW TOPIC: ${topic}
STARTING DIFFICULTY: ${difficulty}/10

YOUR JOB:
1. Read the resume carefully
2. Extract ONLY details relevant to ${topic}
3. Generate a first question based on something SPECIFIC from their resume

Extract and respond in this EXACT JSON only.
No markdown. No explanation. Just JSON:

{
  "candidateProfile": {
    "name": "candidate name if found",
    "experienceLevel": "fresher|junior|mid|senior",
    "relevantSkills": [
      "only skills related to ${topic}"
    ],
    "relevantProjects": [
      {
        "name": "project name",
        "description": "what they built",
        "techUsed": ["tech1", "tech2"]
      }
    ],
    "relevantExperience": [
      {
        "company": "company name",
        "role": "their role",
        "relevantWork": "what they did related to ${topic}"
      }
    ],
    "collegeOrDegree": "their degree if found"
  },
  "firstQuestion": "personalized question here",
  "questionBasedOn": "which resume item this is based on"
}

RULES FOR firstQuestion:
- MUST reference something FROM THEIR RESUME
- If they listed MySQL project: ask about that project
- If they listed Python: ask about Python + ${topic}
- If fresher with no ${topic} experience: ask a difficulty ${difficulty} conceptual question mentioning their degree/college context
- NEVER ask a generic question like "What is X?" when you have resume data to reference

GOOD example (when resume has MySQL project):
"I see you built a library management system using MySQL. How did you design the schema to handle book borrowing with multiple copies of the same book?"

BAD example (generic, never do this):
"What is a primary key?"
`;

export const buildJudgeAndGeneratorPrompt = ({
  topic,
  difficulty,
  currentQuestion,
  userAnswer,
  pastQuestions = [],
  candidateProfile = null,
}) => `
CRITICAL INSTRUCTION — READ FIRST:
You have already asked these questions in this interview session. 
DO NOT ask any of these again.
DO NOT ask anything similar to these.
DO NOT use the same subtopic as any of these.

ALREADY ASKED (${pastQuestions.length} questions):
${
  pastQuestions.length === 0 
  ? "None yet — this is the first question."
  : pastQuestions.map((q, i) => `QUESTION ${i + 1}: "${q}"`).join('\n')
}

The next question MUST:
- Be on a completely different subtopic
- Not share any keyword with the above questions
- Feel like a brand new topic entirely

${
  candidateProfile 
  ? `
CANDIDATE BACKGROUND (use this to personalize):
Name: ${candidateProfile.name || 'Candidate'}
Level: ${candidateProfile.experienceLevel || 'N/A'}
Relevant Skills: ${(candidateProfile.relevantSkills || []).join(', ')}
Projects: ${(candidateProfile.relevantProjects || [])
  .map(p => `${p.name} (${(p.techUsed || []).join(', ')})`)
  .join(', ')}
Experience: ${(candidateProfile.relevantExperience || [])
  .map(e => `${e.role} at ${e.company}`)
  .join(', ')}

PERSONALIZATION RULES:
- Reference their ACTUAL projects when relevant
- Match question complexity to their experience level
- If they used a specific tech, ask about that tech
- Make the candidate feel you READ their resume
`
  : `
CANDIDATE: No resume provided. 
Ask general ${topic} questions.
`
}

You are a strict technical interviewer conducting a ${topic} interview.

STEP 1 — EVALUATE THIS ANSWER:
Question that was asked: "${currentQuestion}"
Candidate's answer: "${userAnswer || "[Candidate provided no response]"}"

Evaluate strictly based on technical depth and accuracy:
- If correctness is "high" AND depth is "detailed" -> difficulty_adjustment: 1
- If correctness is "low" OR depth is "vague" -> difficulty_adjustment: -1
- Otherwise -> difficulty_adjustment: 0

Respond with ONLY this JSON, nothing else, no markdown, no explanation:

{
  "correctness": "high" | "medium" | "low",
  "depth": "detailed" | "surface" | "vague",
  "difficulty_adjustment": 1 | 0 | -1,
  "next_difficulty": <integer between 1 and 10>,
  "next_question": "<see rules below>",
  "one_line_feedback": "<max 10 words about the answer>"
}

STEP 2 — GENERATE next_question BY FOLLOWING ALL RULES STRICTLY:

RULE 1 — ADAPTIVE DIFFICULTY MATCHING:
Compute next_difficulty = clamp(${difficulty} + difficulty_adjustment, 1, 10).
The next_question MUST precisely match this new next_difficulty level.
- If difficulty_adjustment = +1: Generate a harder, deeper, more challenging question matching level next_difficulty.
- If difficulty_adjustment = -1: Generate a simpler, more foundational question matching level next_difficulty.
- If difficulty_adjustment = 0: Generate a question at the same difficulty level.

RULE 2 — MUST BE A COMPLETELY DIFFERENT QUESTION:
The next_question MUST be on a DIFFERENT subtopic than "${currentQuestion}".
NEVER rephrase, reword, or extend the previous question.
NEVER mention the previous question's topic again.

RULE 3 — BANNED PHRASES (never use any of these):
- "elaborate further"
- "expand on"
- "tell me more about"
- "dig deeper into"
- "build on your previous"
- "as you mentioned"
- "going back to"
- "following up on"
- "at difficulty level X"
- Never mention difficulty level number in the question text

RULE 4 — PICK A FRESH SUBTOPIC:
For ${topic}, pick a subtopic from below that has NOT been asked yet:
${getSubtopics(topic)}

RULE 5 — DIFFICULTY LEVELS MEANING:
1-2: Basic definition questions. "What is X?"
3-4: Conceptual understanding. "How does X work?"
5-6: Application & trade-offs. "When would you use X over Y?"
7-8: Advanced problem solving. "How would you design X for Y?"
9-10: Expert edge cases. "What breaks when X meets Y at massive scale?"
`;

export const generateFirstQuestionPrompt = ({
  topic,
  difficulty,
  resumeContext = "",
  linkedinContext = "",
}) => `
You are a top tech industry technical interviewer starting a ${topic} technical interview.
Target starting difficulty level: ${difficulty}/10 (1-2: definitions, 3-4: mechanisms, 5-6: application/tradeoffs, 7-8: design, 9-10: expert edge cases).
${resumeContext ? `Candidate Resume Context: ${resumeContext}` : ""}
${linkedinContext ? `Candidate LinkedIn Context: ${linkedinContext}` : ""}

Available subtopics:
${getSubtopics(topic)}

Generate ONE clear, engaging opening interview question matching starting difficulty level ${difficulty} and picking a core subtopic from above.
Respond ONLY with the text of the question. Do not include quotes, preamble, markdown formatting, or postscript.
`;

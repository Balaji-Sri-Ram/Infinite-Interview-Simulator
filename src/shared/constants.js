// Think time map for Interviewer Question Turn (in seconds)
export const INTERVIEWER_THINK_TIME = {
  1: 30, 2: 30, 3: 30, 4: 30,  // Easy — 30 seconds
  5: 45, 6: 45, 7: 45,         // Medium — 45 seconds
  8: 60, 9: 60, 10: 60         // Hard & Expert — 60 seconds
};

// Answer time map for Candidate Turn (in seconds)
export const CANDIDATE_ANSWER_TIME = {
  1: 180, 2: 180, 3: 180,         // Easy — 3 minutes (180s)
  4: 240, 5: 240, 6: 240,         // Medium — 4 minutes (240s)
  7: 300, 8: 300, 9: 300, 10: 300 // Hard & Expert — 5 minutes (300s)
};

export const TOPICS = {
  DSA: {
    id: "DSA",
    label: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs, Dynamic Programming & Optimization"
  },
  DBMS: {
    id: "DBMS",
    label: "Database Management Systems",
    description: "SQL, Indexing, Transactions, ACID & NoSQL Architecture"
  },
  OS: {
    id: "OS",
    label: "Operating Systems",
    description: "Processes, Threads, Virtual Memory, Deadlocks & Synchronization"
  },
  CN: {
    id: "CN",
    label: "Computer Networks",
    description: "TCP/IP, OSI Layers, HTTP/HTTPS, DNS & Socket Programming"
  },
  ML: {
    id: "ML",
    label: "Machine Learning",
    description: "Supervised & Unsupervised Learning, Neural Networks, Model Evaluation"
  },
  AI: {
    id: "AI",
    label: "Artificial Intelligence",
    description: "Search Algorithms, NLP, Computer Vision, Expert Systems"
  },
};

export const TOTAL_ROUNDS = 5;
export const MAX_DIFFICULTY = 10;
export const MIN_DIFFICULTY = 1;

export const DIFFICULTY_START = {
  easy: 2,
  medium: 5,
  hard: 8,
};

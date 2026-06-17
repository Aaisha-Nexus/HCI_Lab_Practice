export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  codeSnippet?: string;
  type: 'multiple-choice' | 'trace-output';
  expectedOutput?: string;
}

export interface TopicData {
  id: string;
  title: string;
  category: 'JS-Basics' | 'JS-Runtime' | 'Performance' | 'React-Basics' | 'React-Data' | 'React-Hooks' | 'Exam-Special';
  order: number;
  description: string;
  explanations: {
    subtitle: string;
    text: string;
    codeSnippet?: string;
    points?: string[];
  }[];
  practices: Quiz[];
}

export interface UserProgress {
  completedTopics: string[]; // List of topic IDs
  quizScores: Record<string, number>; // quiz ID -> score or completed
  mockExamHistory: {
    date: string;
    score: number;
    total: number;
    answers: Record<string, any>;
  }[];
}

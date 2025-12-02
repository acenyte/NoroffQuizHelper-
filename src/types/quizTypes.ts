export type QuizMode = "edit" | "preview";

export type QuizData = {
  questions: Question[];
};

export type Question = {
  id: string;
  questionText: string;
  answers: Answer[];
  type: "single-choice" | "multiple-choice" | "short-answer";
};

export type Answer = {
  id: string;
  answerText: string;
  isCorrect: boolean;
};

export type QuestionValidation = {
  questionId: string;
  questionTextEmpty: boolean;
  hasCorrectAnswer: boolean;
  answers: { answerId: string; answerTextEmpty: boolean }[];
  isValid: boolean;
};

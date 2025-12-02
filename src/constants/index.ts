export const STORAGE_QUIZ_DATA_KEY = "noroff-quiz-builder-data";
export const STORAGE_QUIZ_MODE_KEY = "noroff-quiz-mode";
export const STORAGE_QUIZ_PROGRESS_KEY = "noroff-quiz-progress";

export const QUESTION_TYPES = [
  { value: "single-choice", label: "Single Choice" },
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "short-answer", label: "Short Text" },
] as const;

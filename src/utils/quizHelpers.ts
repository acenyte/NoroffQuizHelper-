import type { Question, Answer } from "../types/quizTypes";

export const generateId = (): string => globalThis.crypto.randomUUID();

export const createDefaultAnswer = (text = "", isCorrect = false): Answer => ({
  id: generateId(),
  answerText: text,
  isCorrect,
});

export const createDefaultQuestion = (): Question => ({
  id: generateId(),
  questionText: "",
  type: "single-choice",
  answers: [
    createDefaultAnswer("Option A", false),
    createDefaultAnswer("Option B", true),
    createDefaultAnswer("Option C", false),
    createDefaultAnswer("Option D", false),
  ],
});

export function updateQuestionText(
  questions: Question[],
  questionId: string,
  value: string
): Question[] {
  return questions.map((q) =>
    q.id === questionId ? { ...q, questionText: value } : q
  );
}

export function updateQuestionType(
  questions: Question[],
  questionId: string,
  newType: Question["type"]
): Question[] {
  return questions.map((q) => {
    if (q.id !== questionId) return q;
    const resetAnswers = q.answers.map((a) => ({ ...a, isCorrect: false }));
    return { ...q, type: newType, answers: resetAnswers };
  });
}

export function updateAnswerCorrectness(
  questions: Question[],
  questionId: string,
  answerId: string,
  isChecked: boolean
): Question[] {
  return questions.map((q) => {
    if (q.id !== questionId) return q;
    if (q.type === "single-choice") {
      const updated = q.answers.map((a) => ({
        ...a,
        isCorrect: a.id === answerId,
      }));
      return { ...q, answers: updated };
    }
    const updated = q.answers.map((a) =>
      a.id === answerId ? { ...a, isCorrect: isChecked } : a
    );
    return { ...q, answers: updated };
  });
}

export function updateAnswerText(
  questions: Question[],
  questionId: string,
  answerId: string,
  value: string
): Question[] {
  return questions.map((q) => {
    if (q.id !== questionId) return q;
    const updated = q.answers.map((a) =>
      a.id === answerId ? { ...a, answerText: value } : a
    );
    return { ...q, answers: updated };
  });
}

export function addAnswerToQuestion(
  questions: Question[],
  questionId: string
): Question[] {
  return questions.map((q) =>
    q.id === questionId
      ? { ...q, answers: [...q.answers, createDefaultAnswer()] }
      : q
  );
}

export function removeAnswerFromQuestion(
  questions: Question[],
  questionId: string,
  answerId: string
): Question[] {
  return questions.map((q) => {
    if (q.id !== questionId) return q;
    if (q.answers.length <= 2) return q;
    return { ...q, answers: q.answers.filter((a) => a.id !== answerId) };
  });
}

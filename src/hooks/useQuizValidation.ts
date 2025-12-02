import { useMemo } from "react";
import type { QuizData, QuestionValidation } from "../types/quizTypes";

export function useQuizValidation(quizData: QuizData) {
  const questionValidation: QuestionValidation[] = useMemo(() => {
    return quizData.questions.map((question) => {
      const questionTextEmpty = question.questionText.trim() === "";
      const isShortAnswer = question.type === "short-answer";

      const answersValidation = isShortAnswer
        ? []
        : question.answers.map((answer) => ({
            answerId: answer.id,
            answerTextEmpty: answer.answerText.trim() === "",
          }));

      const hasCorrectAnswer = isShortAnswer
        ? true
        : question.answers.some((answer) => answer.isCorrect);

      const isValid = isShortAnswer
        ? !questionTextEmpty
        : !questionTextEmpty &&
          hasCorrectAnswer &&
          answersValidation.every((a) => !a.answerTextEmpty);

      return {
        questionId: question.id,
        questionTextEmpty,
        hasCorrectAnswer,
        answers: answersValidation,
        isValid,
      };
    });
  }, [quizData.questions]);

  const isQuizValid = useMemo(() => {
    return (
      quizData.questions.length > 0 &&
      questionValidation.every((q) => q.isValid)
    );
  }, [quizData.questions.length, questionValidation]);

  return { questionValidation, isQuizValid };
}

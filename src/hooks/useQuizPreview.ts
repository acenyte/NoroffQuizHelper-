import { useCallback, useState } from "react";
import type { Question } from "../types/quizTypes";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_QUIZ_PROGRESS_KEY } from "../constants";

export function useQuizPreview(totalQuestions: number) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage(
    STORAGE_QUIZ_PROGRESS_KEY,
    0
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(
    new Set()
  );
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const selectAnswer = useCallback(
    (answerId: string, questionType: Question["type"]) => {
      if (hasChecked) return;

      if (questionType === "single-choice") {
        setSelectedAnswers(new Set([answerId]));
      } else {
        setSelectedAnswers((prev) => {
          const next = new Set(prev);
          if (next.has(answerId)) {
            next.delete(answerId);
          } else {
            next.add(answerId);
          }
          return next;
        });
      }
    },
    [hasChecked]
  );

  const checkAnswer = useCallback(
    (correctAnswerIds: Set<string>) => {
      const correct =
        selectedAnswers.size === correctAnswerIds.size &&
        [...selectedAnswers].every((id) => correctAnswerIds.has(id));
      setIsCorrect(correct);
      setHasChecked(true);
    },
    [selectedAnswers]
  );

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswers(new Set());
    setHasChecked(false);
    setIsCorrect(false);
  }, []);

  const finishQuiz = useCallback(() => {
    setQuizFinished(true);
  }, []);

  const restart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Set());
    setHasChecked(false);
    setIsCorrect(false);
    setQuizFinished(false);
  }, []);

  return {
    currentQuestionIndex,
    selectedAnswers,
    hasChecked,
    isCorrect,
    quizFinished,
    isLastQuestion,
    selectAnswer,
    checkAnswer,
    nextQuestion,
    finishQuiz,
    restart,
  };
}

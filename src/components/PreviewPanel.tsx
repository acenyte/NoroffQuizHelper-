import { useRef, useEffect } from "react";
import type { QuizData } from "../types/quizTypes";
import { useQuizPreview } from "../hooks/useQuizPreview";

type PreviewPanelProps = {
  quizData: QuizData;
};

export function PreviewPanel({ quizData }: Readonly<PreviewPanelProps>) {
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLOutputElement>(null);

  const hasQuestions = quizData.questions.length > 0;

  const {
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
  } = useQuizPreview(quizData.questions.length);

  const currentQuestion = hasQuestions
    ? quizData.questions[currentQuestionIndex]
    : null;

  useEffect(() => {
    if (hasQuestions && !currentQuestion) {
      restart();
    }
  }, [hasQuestions, currentQuestion, restart]);

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const correctAnswerIds = new Set(
      currentQuestion.answers.filter((a) => a.isCorrect).map((a) => a.id)
    );

    checkAnswer(correctAnswerIds);
  };

  useEffect(() => {
    if (hasQuestions && !quizFinished) {
      questionRef.current?.focus();
    }
  }, [currentQuestionIndex, hasQuestions, quizFinished]);

  useEffect(() => {
    if (hasChecked && resultRef.current) {
      resultRef.current.focus();
    }
  }, [hasChecked]);

  if (!hasQuestions) {
    return (
      <section
        id="preview-panel"
        role="tabpanel"
        aria-labelledby="preview-tab"
        aria-live="polite"
        className="py-16"
      >
        <p className="text-gray-500 text-sm">No questions to preview yet.</p>
      </section>
    );
  }

  const isShortAnswer = currentQuestion?.type === "short-answer";

  if (quizFinished) {
    return (
      <section
        id="preview-panel"
        role="tabpanel"
        aria-labelledby="preview-tab"
        aria-live="polite"
        className="py-16"
      >
        <div className="flex flex-col items-center gap-6 font-mono border-2 border-indigo-700 p-6">
          <h2 className="text-3xl font-bold text-black">QUIZ FINISHED</h2>
          <button
            type="button"
            className="px-4 py-2 border-2 border-black font-medium bg-indigo-700 text-white"
            onClick={restart}
          >
            Start Again?
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="preview-panel"
      role="tabpanel"
      aria-labelledby="preview-tab"
      aria-live="polite"
      className="py-16"
    >
      {currentQuestion && (
        <div className="flex flex-col gap-4 font-mono border-2 border-indigo-700 p-6 bg-white text-black">
          <div>
            <p className="text-lg font-semibold">
              Question {currentQuestionIndex + 1}:
            </p>
            <h2
              ref={questionRef}
              tabIndex={-1}
              className="text-3xl font-semibold mb-2 outline-none"
            >
              {currentQuestion.questionText}
            </h2>
          </div>

          {isShortAnswer ? (
            <input
              type="text"
              aria-label="Your answer"
              className="border border-gray-300 px-3 py-2 w-full"
              placeholder="Type your answer..."
            />
          ) : (
            <fieldset className="space-y-2 border-0 p-0 m-0">
              <legend className="sr-only">
                Answer options for question {currentQuestionIndex + 1}
              </legend>
              {currentQuestion.answers.map((answer) => {
                const isSelected = selectedAnswers.has(answer.id);
                let itemClass =
                  "flex items-center gap-2 p-2 cursor-pointer rounded transition-colors";

                if (hasChecked) {
                  if (answer.isCorrect) {
                    itemClass += " bg-green-100 border-2 border-green-500";
                  } else if (isSelected && !answer.isCorrect) {
                    itemClass += " bg-red-100 border-2 border-red-500";
                  } else {
                    itemClass += " border border-transparent";
                  }
                } else if (isSelected) {
                  itemClass += " bg-indigo-50 border-2 border-indigo-300";
                } else {
                  itemClass +=
                    " border border-transparent hover:bg-indigo-50 focus-within:ring-2 focus-within:ring-blue-500";
                }

                return (
                  <label key={answer.id} className={`${itemClass} block`}>
                    <span className="flex items-center gap-2 w-full cursor-pointer">
                      {currentQuestion.type === "single-choice" ? (
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          checked={isSelected}
                          onChange={() =>
                            selectAnswer(answer.id, currentQuestion.type)
                          }
                          disabled={hasChecked}
                          className="w-5 h-5 cursor-pointer"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            selectAnswer(answer.id, currentQuestion.type)
                          }
                          disabled={hasChecked}
                          className="w-5 h-5 cursor-pointer"
                        />
                      )}
                      <span>{answer.answerText}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          )}

          {hasChecked && (
            <output
              ref={resultRef}
              tabIndex={-1}
              aria-live="polite"
              className={`block font-semibold outline-none ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect."}
            </output>
          )}

          <div className="mt-4 flex items-center justify-between ">
            <p className="text-xs text-gray-500">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </p>

            <div className="flex gap-2">
              {!isShortAnswer && !hasChecked && (
                <button
                  type="button"
                  className={`px-4 py-2 border-2 border-black font-medium bg-indigo-700 text-white ${
                    selectedAnswers.size === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={selectedAnswers.size === 0}
                  onClick={handleCheckAnswer}
                >
                  Check answer
                </button>
              )}

              {(isShortAnswer || hasChecked) && !isLastQuestion && (
                <button
                  type="button"
                  className="px-4 py-2 border-2 border-black font-medium bg-indigo-700 text-white"
                  onClick={nextQuestion}
                >
                  Next question
                </button>
              )}

              {(isShortAnswer || hasChecked) && isLastQuestion && (
                <button
                  type="button"
                  className="px-4 py-2 border-2 border-black font-medium bg-indigo-700 text-white"
                  onClick={finishQuiz}
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

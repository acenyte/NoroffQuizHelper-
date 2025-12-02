import React, {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import type {
  QuizData,
  Question,
  QuestionValidation,
} from "../types/quizTypes";
import {
  createDefaultQuestion,
  updateQuestionText,
  updateQuestionType,
  updateAnswerCorrectness,
  updateAnswerText,
  addAnswerToQuestion,
  removeAnswerFromQuestion,
} from "../utils/quizHelpers";
import { QUESTION_TYPES } from "../constants";

type EditorPanelProps = {
  quizData: QuizData;
  questionValidation: QuestionValidation[];
  isQuizValid: boolean;
  setQuizData: Dispatch<SetStateAction<QuizData>>;
};

export function EditorPanel({
  quizData,
  questionValidation,
  isQuizValid,
  setQuizData,
}: Readonly<EditorPanelProps>) {
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<
    string | null
  >(null);
  const questionInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  useEffect(() => {
    if (newlyAddedQuestionId) {
      const input = questionInputRefs.current.get(newlyAddedQuestionId);
      if (input) {
        input.focus();
        setNewlyAddedQuestionId(null);
      }
    }
  }, [newlyAddedQuestionId, quizData.questions]);

  const handleAddQuestion = () => {
    const newQuestion = createDefaultQuestion();
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setNewlyAddedQuestionId(newQuestion.id);
  };

  const handleQuestionTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string
  ) => {
    const value = e.target.value;
    setQuizData((prev) => ({
      ...prev,
      questions: updateQuestionText(prev.questions, questionId, value),
    }));
  };

  const handleQuestionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    questionId: string
  ) => {
    const newType = e.target.value as Question["type"];
    setQuizData((prev) => ({
      ...prev,
      questions: updateQuestionType(prev.questions, questionId, newType),
    }));
  };

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
    answerId: string
  ) => {
    const isChecked = e.target.checked;
    setQuizData((prev) => ({
      ...prev,
      questions: updateAnswerCorrectness(
        prev.questions,
        questionId,
        answerId,
        isChecked
      ),
    }));
  };

  const handleAnswerTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
    answerId: string
  ) => {
    const value = e.target.value;
    setQuizData((prev) => ({
      ...prev,
      questions: updateAnswerText(prev.questions, questionId, answerId, value),
    }));
  };

  const handleAddAnswer = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: addAnswerToQuestion(prev.questions, questionId),
    }));
  };

  const handleRemoveAnswer = (questionId: string, answerId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: removeAnswerFromQuestion(prev.questions, questionId, answerId),
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    const confirmed = globalThis.confirm(
      "Are you sure you want to delete this entire question and all its answers?"
    );
    if (!confirmed) return;

    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  return (
    <section
      id="editor-panel"
      role="tabpanel"
      aria-labelledby="edit-tab"
      aria-live="polite"
      className="py-16"
    >
      {quizData.questions.length === 0 ? (
        <div className="flex flex-col gap-4 items-center justify-center ">
          <h6 className="text-center text-lg font-medium text-gray-900">
            Start by adding your first question.
          </h6>
          <button
            className="bg-blue-600 font-medium text-white px-4 py-2 border-2 border-black"
            onClick={handleAddQuestion}
          >
            Add Question +
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center ">
          {quizData.questions.map((question, index) => {
            const currentValidation = questionValidation.find(
              (q) => q.questionId === question.id
            );

            return (
              <form
                key={question.id}
                className="relative border-2 border-blue-900 p-4 w-full flex flex-col gap-4 bg-white"
              >
                <button
                  type="button"
                  aria-label="Delete question"
                  className="absolute top-2 right-2 text-xl text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  ×
                </button>
                <h6 className="text-lg font-medium mb-2 font-mono text-black">
                  Question {index + 1}
                </h6>
                <select
                  aria-label={`Question ${index + 1} type`}
                  className="border-2 border-gray-300 p-2 w-fit"
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(e, question.id)}
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col gap-1">
                  <input
                    ref={(el) => {
                      if (el) {
                        questionInputRefs.current.set(question.id, el);
                      } else {
                        questionInputRefs.current.delete(question.id);
                      }
                    }}
                    type="text"
                    aria-label={`Question ${index + 1} text`}
                    aria-invalid={currentValidation?.questionTextEmpty}
                    aria-describedby={
                      currentValidation?.questionTextEmpty
                        ? `q${index + 1}-error`
                        : undefined
                    }
                    className="border-2 border-gray-300 p-2 w-full"
                    placeholder="Enter your question"
                    value={question.questionText}
                    onChange={(e) => handleQuestionTextChange(e, question.id)}
                  />
                  {currentValidation?.questionTextEmpty && (
                    <p
                      id={`q${index + 1}-error`}
                      className="text-xs text-red-600"
                      role="alert"
                    >
                      Question text cannot be blank.
                    </p>
                  )}
                </div>
                {question.type !== "short-answer" && (
                  <fieldset className="flex flex-col gap-2">
                    <legend className="sr-only">
                      Answer options for Question {index + 1}
                    </legend>
                    {question.answers.map((answer) => {
                      const answerValidation = currentValidation?.answers.find(
                        (a) => a.answerId === answer.id
                      );

                      return question.type === "single-choice" ? (
                        <div
                          key={answer.id}
                          className="flex items-center gap-2 justify-between hover:bg-blue-50 px-2"
                        >
                          <label
                            htmlFor={answer.id}
                            className="flex items-center gap-2 cursor-pointer "
                          >
                            <input
                              id={answer.id}
                              type="radio"
                              name={`question-${question.id}`}
                              value={answer.id}
                              checked={answer.isCorrect}
                              className="w-5 h-5 cursor-pointer"
                              onChange={(e) =>
                                handleAnswerChange(e, question.id, answer.id)
                              }
                            />
                            <input
                              type="text"
                              aria-label="Answer text"
                              aria-invalid={answerValidation?.answerTextEmpty}
                              className="border border-gray-300 px-2 py-1 text-sm"
                              value={answer.answerText}
                              onChange={(e) =>
                                handleAnswerTextChange(
                                  e,
                                  question.id,
                                  answer.id
                                )
                              }
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            {answerValidation?.answerTextEmpty && (
                              <p className="text-xs text-red-600" role="alert">
                                Answer text cannot be blank.
                              </p>
                            )}
                            <button
                              type="button"
                              aria-label="Delete this answer option"
                              className={`text-red-600 hover:text-red-800 ${
                                question.answers.length <= 2
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={question.answers.length <= 2}
                              onClick={() =>
                                handleRemoveAnswer(question.id, answer.id)
                              }
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={answer.id}
                          className="flex items-center gap-2 justify-between hover:bg-blue-50 px-2"
                        >
                          <label
                            htmlFor={answer.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              id={answer.id}
                              type="checkbox"
                              name={answer.answerText}
                              value={answer.id}
                              checked={answer.isCorrect}
                              className="w-5 h-5 cursor-pointer"
                              onChange={(e) =>
                                handleAnswerChange(e, question.id, answer.id)
                              }
                            />
                            <input
                              type="text"
                              aria-label="Answer text"
                              aria-invalid={answerValidation?.answerTextEmpty}
                              className="border border-gray-300 px-2 py-1 text-sm"
                              value={answer.answerText}
                              onChange={(e) =>
                                handleAnswerTextChange(
                                  e,
                                  question.id,
                                  answer.id
                                )
                              }
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            {answerValidation?.answerTextEmpty && (
                              <p className="text-xs text-red-600" role="alert">
                                Answer text cannot be blank.
                              </p>
                            )}
                            <button
                              type="button"
                              aria-label="Delete this answer option"
                              className={`text-red-600 hover:text-red-800 ${
                                question.answers.length <= 2
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={question.answers.length <= 2}
                              onClick={() =>
                                handleRemoveAnswer(question.id, answer.id)
                              }
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {currentValidation &&
                      !currentValidation.hasCorrectAnswer && (
                        <p className="mt-1 text-xs text-red-600">
                          Mark at least one answer as correct.
                        </p>
                      )}
                    <button
                      type="button"
                      className="mt-2 self-start text-xs font-medium text-blue-700 hover:underline"
                      onClick={() => handleAddAnswer(question.id)}
                      aria-label={`Add answer option to Question ${index + 1}`}
                    >
                      + Add option
                    </button>
                  </fieldset>
                )}
              </form>
            );
          })}
          <button
            className={`bg-blue-600 font-medium text-white px-4 py-2 border-2 border-black my-8 ${
              isQuizValid ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isQuizValid}
            onClick={() => isQuizValid && handleAddQuestion()}
          >
            Add Question +
          </button>
        </div>
      )}
    </section>
  );
}

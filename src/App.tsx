import type { QuizMode, QuizData } from "./types/quizTypes";
import { EditorPanel } from "./components/EditorPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useQuizValidation } from "./hooks/useQuizValidation";
import { STORAGE_QUIZ_DATA_KEY, STORAGE_QUIZ_MODE_KEY } from "./constants";

export default function App() {
  // Core state management and data persistence
  const [mode, setMode] = useLocalStorage<QuizMode>(
    STORAGE_QUIZ_MODE_KEY,
    "edit"
  );
  const [quizData, setQuizData] = useLocalStorage<QuizData>(
    STORAGE_QUIZ_DATA_KEY,
    {
      questions: [],
    }
  );

  // Feature: Quiz validation
  const { questionValidation, isQuizValid } = useQuizValidation(quizData);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex items-end justify-between mb-6">
        <h1
          id="app-logo"
          className="text-4xl py-2 px-5 font-bold font-mono uppercase border-8 border-double border-black bg-white text-black"
        >
          Quiz <br></br>Builder
        </h1>
        <nav aria-label="Quiz modes">
          <div
            role="tablist"
            aria-label="Quiz mode tabs"
            className="flex items-center shadow-sm border-4 border-blue-950 font-semibold"
          >
            <button
              id="edit-tab"
              role="tab"
              aria-selected={mode === "edit"}
              aria-controls="editor-panel"
              className={`px-3 py-1 focus-visible:outline-8 ${
                mode === "edit"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setMode("edit")}
            >
              EDIT
            </button>
            <button
              id="preview-tab"
              role="tab"
              aria-selected={mode === "preview"}
              aria-controls="preview-panel"
              aria-disabled={!isQuizValid}
              disabled={!isQuizValid}
              className={`px-3 py-1 focus-visible:outline-8 ${
                mode === "preview"
                  ? "bg-indigo-700 text-white"
                  : "bg-white text-gray-700"
              } ${isQuizValid ? "" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => setMode("preview")}
            >
              PREVIEW
            </button>
          </div>
        </nav>
      </header>

      <main>
        {mode === "edit" ? (
          <EditorPanel
            quizData={quizData}
            questionValidation={questionValidation}
            isQuizValid={isQuizValid}
            setQuizData={setQuizData}
          />
        ) : (
          <PreviewPanel quizData={quizData} />
        )}
      </main>
    </div>
  );
}

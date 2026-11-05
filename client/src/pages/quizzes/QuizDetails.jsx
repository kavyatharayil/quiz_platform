import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizApi } from "../../api/quiz.api";
import { questionApi } from "../../api/question.api";
import Header from "../../components/layout/Header";

import QuizDetailsHero from "../../components/quiz/QuizDetailsHero";
import QuizInstructions from "../../components/quiz/QuizInstructions";

function QuizDetails() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setIsLoading(true);
        const [quizData, questionsData] = await Promise.all([
          quizApi.getQuizById(quizId),
          questionApi.getQuestionsByQuizId(quizId)
        ]);
        setQuiz(quizData);
        setQuestionsCount(questionsData.length);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (quizId) fetchQuizDetails();
  }, [quizId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 px-5 py-10 sm:px-8 lg:px-10 transition-colors duration-300">
        <div className="mx-auto flex min-h-[70vh] items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading quiz details...</p>
        </div>
      </main>
    );
  }

  // Quiz not found
  if (!quiz) {
    return (
      <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 px-5 py-10 sm:px-8 lg:px-10 transition-colors duration-300">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-16 text-center shadow-sm transition-colors duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
              Quiz not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              The quiz you're looking for doesn't exist or may
              no longer be available.
            </p>

            <button
              type="button"
              onClick={() => navigate("/quizzes")}
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              ← Back to Quizzes
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-300">

      {/* ================= TOP BAR ================= */}
      <Header />

      {/* ================= HERO ================= */}
      <QuizDetailsHero quiz={quiz} questionsCount={questionsCount} />

      {/* ================= INSTRUCTIONS ================= */}
      <QuizInstructions quiz={quiz} />

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-xs text-slate-400 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© 2026 Quizora</span>
          <span>Think. Answer. Improve.</span>
        </div>
      </footer>

    </main>
  );
}

export default QuizDetails;
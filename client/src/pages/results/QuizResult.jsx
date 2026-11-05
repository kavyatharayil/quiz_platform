import { useMemo } from "react";
import Header from "../../components/layout/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PerformanceChart from "../../components/quiz/PerformanceChart";

function QuizResult() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const quiz = location.state?.quiz;
  const questions = location.state?.questions || [];
  const answers = location.state?.answers || {};
  const backendResult = location.state?.result;

  // =========================================================
  // RESULT CALCULATION
  // =========================================================
  const result = useMemo(() => {
    if (backendResult) {
      return {
        correct: backendResult.correctAnswers || 0,
        incorrect: backendResult.wrongAnswers || 0,
        unanswered: questions.length - (backendResult.correctAnswers || 0) - (backendResult.wrongAnswers || 0),
        percentage: backendResult.percentage || 0,
      };
    }
    
    if (!quiz || questions.length === 0) {
      return {
        correct: 0,
        incorrect: 0,
        unanswered: 0,
        percentage: 0,
      };
    }

    let correct = 0;

    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        correct += 1;
      }
    });

    const total = questions.length;

    const incorrect = questions.filter(
      (question) =>
        answers[question._id] &&
        answers[question._id] !== question.correctAnswer
    ).length;

    const unanswered = total - correct - incorrect;

    const percentage =
      total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      correct,
      incorrect,
      unanswered,
      percentage,
    };
  }, [quiz, questions, answers, backendResult]);

  // =========================================================
  // QUIZ NOT FOUND
  // =========================================================
  if (!quiz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] dark:bg-slate-950 px-5 transition-colors duration-300">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <svg
              width="28"
              height="28"
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

          <h1 className="mt-6 text-2xl font-black text-slate-950">
            Result not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We couldn't find the result you're looking for.
          </p>

          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="mt-7 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
          >
            ← Back to Quizzes
          </button>

        </div>
      </main>
    );
  }

  // =========================================================
  // PERFORMANCE MESSAGE
  // =========================================================
  const getPerformance = () => {
    if (result.percentage >= 90) {
      return {
        title: "Outstanding! 🎉",
        description:
          "Excellent work! You have demonstrated a strong understanding of this topic.",
      };
    }

    if (result.percentage >= 70) {
      return {
        title: "Great Job! 👏",
        description:
          "You performed really well. Keep practicing to reach the next level.",
      };
    }

    if (result.percentage >= 50) {
      return {
        title: "Good Effort! 💪",
        description:
          "You're on the right track. Review the answers below and keep improving.",
      };
    }

    return {
      title: "Keep Practicing! 🚀",
      description:
        "Don't worry. Review the answers below and give the quiz another try.",
    };
  };

  const performance = getPerformance();

  const getFeedbackMessage = () => {
    const p = result.percentage;
    if (p >= 80) {
      const msgs = [
        "Excellent work! You have a strong understanding of this topic.",
        "Great job! Your performance shows a strong understanding.",
        "Outstanding result! Keep up the excellent work.",
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
    if (p >= 60) {
      const msgs = [
        "Good effort! You have a solid understanding with a few areas to improve.",
        "Nice work! Review the questions you missed and aim for an even better score.",
        "You're doing well! A little more practice can take your score higher.",
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
    if (p >= 40) {
      const msgs = [
        "Nice attempt! Review the incorrect answers and try again.",
        "You're on the right track. Keep practicing to strengthen your understanding.",
        "Good start! Reviewing the missed questions can help improve your next attempt.",
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
    if (p > 0) {
      const msgs = [
        "Keep practicing! Review the questions you missed and give it another try.",
        "Every attempt is a learning opportunity. Review your answers and try again.",
        "Don't give up! A little more practice can help improve your score.",
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
    
    const msgs = [
      "Don't worry! Every attempt is a chance to learn and improve.",
      "Use this attempt as a starting point and try again after reviewing the questions.",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  };

  const feedbackMessage = getFeedbackMessage();

  // =========================================================
  // SCORE CIRCLE
  // =========================================================
  const circumference = 2 * Math.PI * 52;

  const scoreOffset =
    circumference -
    (result.percentage / 100) * circumference;

  return (
    <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-300">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <Header />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* =================================================
            COMPLETION HEADER
        ================================================= */}
        <section className="text-center">

          {/* Success Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
            Quiz Completed
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {performance.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {performance.description}
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-400">
            {quiz.title}
          </p>

        </section>

        {/* =================================================
            SCORE CARD
        ================================================= */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 lg:p-10 shadow-sm transition-colors duration-300">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            
            {/* LEFT SIDE: Score + Summary */}
            <div className="flex flex-col gap-8">
              {/* Score */}
              <div className="flex justify-start">
                <div className="relative flex h-44 w-44 items-center justify-center">

                  {/* Circle */}
                  <svg
                    className="absolute inset-0 h-full w-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-100 dark:text-slate-800"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={scoreOffset}
                      className="text-indigo-600 transition-all duration-1000"
                    />
                  </svg>

                  <div className="relative text-center">
                    <p className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                      {result.percentage}%
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your Score
                    </p>
                  </div>

                </div>
              </div>

              {/* Performance */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Performance Summary
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  {result.correct} out of {questions.length}
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  questions answered correctly
                </p>

                {/* Progress */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Overall performance
                    </span>

                    <span className="text-xs font-bold text-indigo-600">
                      {result.percentage}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
                      style={{
                        width: `${result.percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-4">
                    <p className="text-xl font-black text-emerald-600">
                      {result.correct}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">
                      Correct
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 dark:bg-red-500/10 p-4">
                    <p className="text-xl font-black text-red-600">
                      {result.incorrect}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-600/70">
                      Incorrect
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
                    <p className="text-xl font-black text-slate-600 dark:text-slate-300">
                      {result.unanswered}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Skipped
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Chart */}
            <div className="flex flex-col justify-between border-t border-slate-100 dark:border-slate-800 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <PerformanceChart
                correct={result.correct}
                incorrect={result.incorrect}
                skipped={result.unanswered}
                total={questions.length}
              />

              {/* Feedback Block */}
              <div className="mt-8 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 p-5 border border-indigo-100/50 dark:border-indigo-500/20">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Quick Note
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-indigo-900/80 dark:text-indigo-200">
                  {feedbackMessage}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================
            QUESTION REVIEW
        ================================================= */}
        <section className="mt-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7 transition-colors duration-300">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                Review
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                Question Review
              </h2>
            </div>

            <p className="text-xs font-medium text-slate-400">
              {questions.length} questions
            </p>

          </div>

          <div className="mt-6 space-y-3">

            {questions.map((question, index) => {

              let userAnswer, isAnswered, isCorrect, correctAnswer;

              if (backendResult && backendResult.answers) {
                const resultAnswer = backendResult.answers.find(a => a.questionId === question._id);
                userAnswer = resultAnswer ? resultAnswer.selectedAnswer : null;
                isAnswered = Boolean(userAnswer);
                isCorrect = resultAnswer ? resultAnswer.isCorrect : false;
                correctAnswer = resultAnswer ? resultAnswer.correctAnswer : null;
              } else {
                userAnswer = answers[question._id];
                isAnswered = Boolean(userAnswer);
                isCorrect = userAnswer === question.correctAnswer;
                correctAnswer = question.correctAnswer;
              }
              
              const userOption = question.options?.find(opt => opt.id === userAnswer);
              const userText = userOption ? userOption.text : "Not answered";
              
              const correctOption = question.options?.find(opt => opt.id === correctAnswer);
              const correctText = correctOption ? correctOption.text : "N/A";

              return (
                <div
                  key={question._id}
                  className={`rounded-2xl border p-4 sm:p-5 ${
                    isCorrect
                      ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/10"
                      : isAnswered
                        ? "border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/10"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                  }`}
                >

                  {/* Question Header */}
                  <div className="flex items-start gap-3">

                    {/* Number / Status */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        isCorrect
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : isAnswered
                            ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {isCorrect
                        ? "✓"
                        : isAnswered
                          ? "×"
                          : index + 1}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center justify-between gap-2">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Question {index + 1}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : isAnswered
                                ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                          }`}
                        >
                          {isCorrect
                            ? "Correct"
                            : isAnswered
                              ? "Incorrect"
                              : "Skipped"}
                        </span>

                      </div>

                      {/* Question */}
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-900 dark:text-white">
                        {question.question}
                      </p>

                      {/* Answers */}
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">

                        <div className="rounded-xl border border-white/70 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/50 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Your answer
                          </p>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              isCorrect
                                ? "text-emerald-700 dark:text-emerald-400"
                                : isAnswered
                                  ? "text-red-700 dark:text-red-400"
                                  : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {userText}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/70 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/50 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Correct answer
                          </p>

                          <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            {correctText}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          {/* Try Again */}
          <button
            type="button"
            onClick={() =>
              navigate(`/quizzes/${quiz._id}`)
            }
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-600 hover:text-indigo-600 dark:hover:text-white"
          >
            ↻ Try Again
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            Back to Quiz List →
          </button>

        </div>

      </div>
    </main>
  );
}

export default QuizResult;
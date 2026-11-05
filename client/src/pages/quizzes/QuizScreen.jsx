import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizApi } from "../../api/quiz.api";
import { questionApi } from "../../api/question.api";
import { resultApi } from "../../api/result.api";

import QuizTimer from "../../components/quiz/QuizTimer";
import ThemeToggle from "../../components/common/ThemeToggle";

// Utility to shuffle an array (Fisher-Yates)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function QuizScreen() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [startError, setStartError] = useState(null);
  const [startErrorData, setStartErrorData] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setStartError(null);
        setStartErrorData(null);
        
        // Fetch quiz and questions first
        const [quizData, questionsData] = await Promise.all([
          quizApi.getQuizById(quizId),
          questionApi.getQuestionsByQuizId(quizId)
        ]);
        setQuiz(quizData);
        setQuestions(questionsData); // We can set this now, though we might shuffle it later
        
        // Then try to start the quiz
        const attemptData = await quizApi.startQuiz(quizId);
        
        setAttemptId(attemptData.attemptId);
        
        // Calculate remaining time based on server startedAt to persist across refreshes
        const startedAtMs = new Date(attemptData.startedAt).getTime();
        const elapsedSeconds = Math.floor((Date.now() - startedAtMs) / 1000);
        const totalDurationSeconds = quizData.duration * 60;
        const remainingTime = Math.max(0, totalDurationSeconds - elapsedSeconds);
        setTimeLeft(remainingTime);

        // Check if we have saved state in localStorage
        const storageKey = `quiz_attempt_${attemptData.attemptId}`;
        const savedState = localStorage.getItem(storageKey);

        if (savedState) {
          const parsed = JSON.parse(savedState);
          setQuestions(parsed.questions);
          setAnswers(parsed.answers || {});
          setMarkedForReview(parsed.markedForReview || []);
        } else {
          // First time loading: shuffle questions and options
          const shuffledQuestions = shuffleArray(questionsData).map(q => ({
            ...q,
            options: shuffleArray(q.options)
          }));
          setQuestions(shuffledQuestions);
          
          localStorage.setItem(storageKey, JSON.stringify({
            questions: shuffledQuestions,
            answers: {},
            markedForReview: []
          }));
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403 && err.response?.data?.message) {
          setStartError(err.response.data.message);
          if (err.response.data.data) {
            setStartErrorData(err.response.data.data);
          }
        } else {
          setStartError("Failed to load the quiz. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (quizId) loadQuiz();
  }, [quizId]);

  // Persist answers and review marks whenever they change
  useEffect(() => {
    if (attemptId && questions.length > 0) {
      const storageKey = `quiz_attempt_${attemptId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey)) || {};
      localStorage.setItem(storageKey, JSON.stringify({
        ...existing,
        answers,
        markedForReview
      }));
    }
  }, [answers, markedForReview, attemptId, questions]);

  // =========================================================
  // TIMER
  // =========================================================
  useEffect(() => {
    if (!quiz || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeLeft]);

  // =========================================================
  // AUTO SUBMIT
  // =========================================================
  useEffect(() => {
    if (quiz && timeLeft === 0 && attemptId && !isSubmitting && !hasAutoSubmitted) {
      setHasAutoSubmitted(true);
      handleSubmit();
    }
  }, [timeLeft, quiz, attemptId, isSubmitting, hasAutoSubmitted]);

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-5"><div className="w-full max-w-md text-center">Loading quiz...</div></main>;
  }

  // =========================================================
  // START ERROR
  // =========================================================
  if (startError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] dark:bg-slate-950 px-5 transition-colors duration-300">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
            Cannot Start Quiz
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {startError}
          </p>
          <div className="mt-7 flex flex-col gap-3">
            {startErrorData?.attemptId && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const resultData = await resultApi.getResult(startErrorData.attemptId);
                    navigate(`/quizzes/${quizId}/result`, {
                      state: { result: resultData, quiz, questions }
                    });
                  } catch (e) {
                    navigate('/users/dashboard');
                  }
                }}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                View Result
              </button>
            )}
            {!startErrorData?.attemptId && (
              <button
                type="button"
                onClick={() => navigate(`/users/dashboard`)}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Go to Dashboard
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/quizzes")}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // QUIZ NOT FOUND
  // =========================================================
  if (!quiz || questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">

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
            Quiz not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The quiz you're looking for doesn't exist or is no
            longer available.
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

  const question = questions[currentQuestion];

  const answeredCount = Object.keys(answers).length;

  const progressPercentage = Math.round(
    ((currentQuestion + 1) / questions.length) * 100
  );

  const isTimeWarning = timeLeft <= 120;
  const isTimeCritical = timeLeft <= 30;

  // =========================================================
  // ANSWER
  // =========================================================
  const handleAnswerSelect = (answerId) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [question._id]: answerId,
    }));
  };

  // =========================================================
  // NEXT
  // =========================================================
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  // =========================================================
  // PREVIOUS
  // =========================================================
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  // =========================================================
  // TOGGLE MARK FOR REVIEW
  // =========================================================
  const handleToggleMarkReview = () => {
    setMarkedForReview(prev => {
      if (prev.includes(question._id)) {
        return prev.filter(id => id !== question._id);
      }
      return [...prev, question._id];
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================
  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const submittedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));
      
      const resultData = await quizApi.submitQuiz(quizId, attemptId, submittedAnswers);
      
      // Clear local storage upon successful submit
      localStorage.removeItem(`quiz_attempt_${attemptId}`);
      
      navigate(`/quizzes/${quiz._id}/result`, {
        state: {
          result: resultData,
          quiz,
          questions
        },
      });
    } catch (err) {
      console.error("Failed to submit quiz", err);
      const errorMsg = err.response?.data?.message || err.message || "";
      if (
        errorMsg.toLowerCase().includes("already submitted") ||
        errorMsg.toLowerCase().includes("time expired") ||
        err.response?.status === 400
      ) {
        setSubmitError("You have already submitted this quiz or your time has expired.");
      } else {
        setIsSubmitting(false);
        setSubmitError("Failed to submit. Please try again.");
      }
    }
  };

  // =========================================================
  // FORMAT TIMER
  // =========================================================
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-300">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="flex min-h-[68px] items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex min-w-0 items-center gap-3">

              <button
                type="button"
                onClick={() => navigate("/")}
                className="group flex shrink-0 items-center gap-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-black text-white transition duration-200 group-hover:rotate-6">
                  Q
                </span>

                <span className="hidden text-base font-bold tracking-tight text-white sm:block">
                  Quizora
                </span>
              </button>

              <div className="hidden h-6 w-px bg-white/10 sm:block" />

              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                  {quiz.category}
                </p>

                <h1 className="truncate text-sm font-bold text-white">
                  {quiz.title}
                </h1>
              </div>

            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <ThemeToggle />
              
              {/* Timer */}
              <QuizTimer
                timeLeft={timeLeft}
                isTimeWarning={isTimeWarning}
                isTimeCritical={isTimeCritical}
                formatTime={formatTime}
              />
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">

        {/* =================================================
            PROGRESS
        ================================================= */}
        <div className="mb-4">

          <div className="mb-2 flex items-end justify-between gap-4">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                Current question
              </p>

              <h2 className="mt-0.5 text-base font-black text-slate-950 dark:text-white sm:text-lg">
                Question {currentQuestion + 1}

                <span className="font-medium text-slate-400 dark:text-slate-500">
                  {" "}
                  / {questions.length}
                </span>
              </h2>
            </div>

            <div className="text-right">
              <p className="text-base font-black text-slate-950 dark:text-white">
                {progressPercentage}%
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Progress
              </p>
            </div>

          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">

          {/* =================================================
              QUESTION CARD
          ================================================= */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5 lg:p-6 transition-colors duration-300">

            {/* Card Header */}
            <div className="flex items-start justify-between">
              
              {/* Question Label */}
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {String(currentQuestion + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    Question
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Select one answer
                  </p>
                </div>
              </div>
              
              {/* Flag for Review Button */}
              <button
                type="button"
                onClick={handleToggleMarkReview}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  markedForReview.includes(question._id)
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={markedForReview.includes(question._id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
                {markedForReview.includes(question._id) ? "Flagged" : "Flag for Review"}
              </button>
            </div>

            {/* Question */}
            <h3 className="mt-3 max-w-3xl text-lg font-black leading-6 tracking-tight text-slate-950 dark:text-white">
              {question.question}
            </h3>

            {/* =================================================
                ANSWER OPTIONS
            ================================================= */}
            <div className="mt-4 grid grid-cols-1 gap-2.5 lg:grid-cols-2">

              {question.options.map((optionObj, index) => {

                const isSelected =
                  answers[question._id] === optionObj.id;

                const optionLetter = String.fromCharCode(
                  65 + index
                );

                return (
                  <button
                    key={optionObj.id}
                    type="button"
                    onClick={() =>
                      handleAnswerSelect(optionObj.id)
                    }
                    disabled={isSubmitting || timeLeft <= 0}
                    className={`group w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 shadow-sm ring-2 ring-indigo-500/10 dark:ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm"
                    } disabled:opacity-75 disabled:cursor-not-allowed`}
                  >

                    <div className="flex items-center gap-3">

                      {/* Letter */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black transition ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        }`}
                      >
                        {optionLetter}
                      </span>

                      {/* Answer */}
                      <span
                        className={`flex-1 text-sm font-semibold ${
                          isSelected
                            ? "text-indigo-950 dark:text-indigo-200"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {optionObj.text}
                      </span>

                      {/* Check */}
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 dark:border-slate-700 text-transparent"
                        }`}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </span>

                    </div>

                  </button>
                );
              })}

            </div>

            {/* =================================================
                NAVIGATION BUTTONS
            ================================================= */}
            <div className="mt-4 flex flex-col-reverse gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Previous */}
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span>←</span>
                Previous
              </button>

              <div className="flex gap-2">

                {/* Next */}
                {currentQuestion <
                  questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600 sm:flex-none"
                  >
                    Next

                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                )}

                {/* Submit */}
                {currentQuestion === questions.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowSubmitModal(true)
                    }
                    disabled={isSubmitting || timeLeft <= 0}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || (timeLeft <= 0) ? "Submitting..." : "Submit"}

                    {!(isSubmitting || timeLeft <= 0) && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    )}
                  </button>
                )}

              </div>

            </div>

          </section>

          {/* =================================================
              QUESTION NAVIGATION SIDEBAR
          ================================================= */}
          <aside className="h-fit rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors duration-300">

            {/* Sidebar Header */}
            <div className="flex items-start justify-between">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                  Navigation
                </p>

                <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                  Your questions
                </h3>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-center">

                <p className="text-xs font-black text-slate-950 dark:text-white">
                  {answeredCount}/{questions.length}
                </p>

                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Answered
                </p>

              </div>

            </div>

            {/* Question Numbers */}
            <div className="mt-4 grid grid-cols-5 gap-2">

              {questions.map((item, index) => {

                const isCurrent =
                  currentQuestion === index;

                const isAnswered =
                  Boolean(answers[item._id]);

                const isMarked = markedForReview.includes(item._id);

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() =>
                      setCurrentQuestion(index)
                    }
                    aria-label={`Go to question ${
                      index + 1
                    }`}
                    className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : isMarked
                          ? "border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                          : isAnswered
                            ? "border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                            : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    {index + 1}
                    
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white dark:ring-slate-900">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        </svg>
                      </span>
                    )}

                    {isAnswered && !isCurrent && !isMarked && (
                      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                );
              })}

            </div>

            {/* Legend */}
            <div className="mt-5 space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-indigo-600" />

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Current question
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 ring-1 ring-indigo-200 dark:ring-indigo-500/30" />

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Answered
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700" />

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Not answered
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-amber-100 dark:bg-amber-500/20 ring-1 ring-amber-300 dark:ring-amber-500/50" />

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Flagged for review
                </span>
              </div>

            </div>

            {/* Time Reminder */}
            <div
              className={`mt-4 rounded-xl p-3 ${
                isTimeCritical
                  ? "bg-red-50"
                  : isTimeWarning
                    ? "bg-amber-50"
                    : "bg-indigo-50"
              }`}
            >

              <div className="flex items-start gap-3">

                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isTimeCritical
                      ? "bg-red-100 text-red-600"
                      : isTimeWarning
                        ? "bg-amber-100 text-amber-600"
                        : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>

                <div>

                  <p
                    className={`text-xs font-bold ${
                      isTimeCritical
                        ? "text-red-700"
                        : isTimeWarning
                          ? "text-amber-700"
                          : "text-indigo-700"
                    }`}
                  >
                    {isTimeCritical
                      ? "Time is almost up!"
                      : isTimeWarning
                        ? "Keep an eye on the timer"
                        : "Take your time"}
                  </p>

                  <p
                    className={`mt-1 text-[11px] leading-5 ${
                      isTimeCritical
                        ? "text-red-600/70"
                        : isTimeWarning
                          ? "text-amber-600/70"
                          : "text-indigo-600/70"
                    }`}
                  >
                    {isTimeCritical
                      ? "The quiz will submit automatically when the timer reaches zero."
                      : "You can move between questions and review your answers before submitting."}
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>
      </div>

      {/* =====================================================
          SUBMIT CONFIRMATION MODAL
      ===================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm">

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-quiz-title"
            className="w-full max-w-md rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl sm:p-7 transition-colors duration-300"
          >

            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>

            </div>

            <h2
              id="submit-quiz-title"
              className="mt-5 text-2xl font-black text-slate-950 dark:text-white"
            >
              Submit your quiz?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to finish this quiz? You have
              answered{" "}
              <strong className="text-slate-900 dark:text-white">
                {answeredCount}
              </strong>{" "}
              out of{" "}
              <strong className="text-slate-900 dark:text-white">
                {questions.length}
              </strong>{" "}
              questions.
            </p>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-3 gap-3">

              <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 dark:text-indigo-500">
                  Answered
                </p>

                <p className="mt-1 text-xl font-black text-indigo-950 dark:text-indigo-100">
                  {answeredCount}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 dark:text-amber-500">
                  Review
                </p>

                <p className="mt-1 text-xl font-black text-amber-950 dark:text-amber-100">
                  {markedForReview.length}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Remaining
                </p>

                <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                  {questions.length - answeredCount}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowSubmitModal(false)
                }
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Keep Working
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          ERROR MODAL
      ===================================================== */}
      {submitError && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl sm:p-7 text-center transition-colors duration-300"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <h2 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
              Submission Error
            </h2>
            
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {submitError}
            </p>
            
            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const resultData = await resultApi.getResult(attemptId);
                    navigate(`/quizzes/${quiz._id}/result`, {
                      state: { result: resultData, quiz, questions }
                    });
                  } catch (e) {
                    navigate('/quizzes');
                  }
                }}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                View Result
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setSubmitError(null);
                  navigate('/quizzes');
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default QuizScreen;
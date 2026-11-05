import { useNavigate } from "react-router-dom";

function QuizDetailsHero({ quiz, questionsCount = 0 }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-indigo-600/15 blur-3xl" />

        <div className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ================= LEFT SIDE ================= */}
          <div>
            {/* Category */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              {quiz.category}
            </div>

            {/* Title */}
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
              {quiz.title}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              {quiz.description}
            </p>

            {/* Stats */}
            <div className="mt-9 flex flex-wrap gap-3">

              {/* Questions */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4l2.5 2.5" />
                  </svg>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Questions
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {questionsCount}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <svg
                    width="18"
                    height="18"
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Time limit
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {quiz.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="lg:ml-auto lg:w-full lg:max-w-md">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-slate-900 p-6 sm:p-7">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-400">
                  Ready when you are
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Start your challenge.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Take your time, think carefully, and answer each
                  question to the best of your ability.
                </p>

                {/* Quick summary */}
                <div className="mt-7 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-slate-400">
                      Questions
                    </span>

                    <span className="text-sm font-bold text-white">
                      {questionsCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-slate-400">
                      Duration
                    </span>

                    <span className="text-sm font-bold text-white">
                      {quiz.duration} min
                    </span>
                  </div>
                </div>

                {/* Start Quiz */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/quizzes/${quiz.id || quiz._id}/start`)
                  }
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-400"
                >
                  Start Quiz

                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <p className="mt-4 text-center text-[11px] text-slate-600">
                  Your timer starts as soon as you begin.
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default QuizDetailsHero;
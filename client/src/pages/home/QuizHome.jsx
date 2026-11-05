import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";

function QuizHome() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-300">

      <Header />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-950">

        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -right-40 top-20 h-[550px] w-[550px] rounded-full bg-violet-500/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          {/* Hero content */}
          <div className="grid items-center gap-12 py-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-14">

            {/* Left */}
            <div className="relative z-10">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Challenge your knowledge
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Think fast.
                <br />
                <span className="text-indigo-400">
                  Answer smarter.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Explore carefully designed quizzes, challenge what
                you know, and discover where you stand — one question
                at a time.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/quizzes")}
                  className="group rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-400"
                >
                  Explore Quizzes
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                >
                  See how it works
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-white/10 pt-7">
                <div>
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Quizzes
                  </p>
                </div>

                <div className="border-l border-white/10 pl-6">
                  <p className="text-2xl font-bold text-white">50+</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Questions
                  </p>
                </div>

                <div className="border-l border-white/10 pl-6">
                  <p className="text-2xl font-bold text-white">5+</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Categories
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Interactive quiz preview */}
            <div className="relative mx-auto w-full max-w-lg lg:ml-auto">

              {/* Glow */}
              <div className="absolute -inset-8 rounded-[3rem] bg-indigo-500/10 blur-3xl" />

              {/* Floating label */}
              <div className="absolute -right-2 -top-5 z-20 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur sm:-right-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Live challenge
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Question 04 / 10
                </p>
              </div>

              {/* Quiz card */}
              <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-2.5 shadow-2xl backdrop-blur-xl">

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-5 sm:p-6">

                  {/* Card top */}
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
                        Knowledge Check
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-white">
                        General Knowledge Quiz
                      </h2>
                    </div>

                    
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-[11px] text-slate-500">
                      <span>Progress</span>
                      <span>40%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-2/5 rounded-full bg-indigo-500" />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mt-6">
                    <p className="text-xs font-medium text-slate-500">
                      QUESTION
                    </p>

                    <h3 className="mt-2 text-base font-bold leading-6 text-white sm:text-lg">
                      What is the capital city of Australia?
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="mt-5 space-y-2.5">

                    <div className="rounded-xl border border-indigo-400/60 bg-indigo-500/10 p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white">
                          A
                        </span>

                        <span className="text-sm font-semibold text-white">
                         Canberra
                        </span>

                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
                          ✓
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-slate-500">
                          B
                        </span>

                        <span className="text-sm text-slate-300">
                          Melbourne
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-slate-500">
                          C
                        </span>

                        <span className="text-sm text-slate-300">
                          Sydney
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-slate-600">
                      Select one answer
                    </span>

                    
                  </div>
                </div>
              </div>

              

            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="bg-white dark:bg-slate-950 px-5 py-24 sm:px-8 lg:px-10 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              The experience
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl transition-colors">
              Simple enough to start.
              <br />
              Powerful enough to challenge you.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
              Everything is designed to keep your attention on the
              questions, not the interface.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            {/* Step 1 */}
            <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  01
                </span>

                <span className="text-2xl text-slate-300 dark:text-slate-600 transition group-hover:text-indigo-300 dark:group-hover:text-indigo-400">
                  ↗
                </span>
              </div>

              <h3 className="mt-14 text-xl font-bold text-slate-950 dark:text-white">
                Discover
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Browse quizzes by topic and find a challenge that
                matches what you want to learn.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  02
                </span>

                <span className="text-2xl text-slate-300 dark:text-slate-600 transition group-hover:text-indigo-300 dark:group-hover:text-indigo-400">
                  ↗
                </span>
              </div>

              <h3 className="mt-14 text-xl font-bold text-slate-950 dark:text-white">
                Challenge
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Answer questions, manage your time, and move through
                the quiz at your own pace.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  03
                </span>

                <span className="text-2xl text-slate-300 dark:text-slate-600 transition group-hover:text-indigo-300 dark:group-hover:text-indigo-400">
                  ↗
                </span>
              </div>

              <h3 className="mt-14 text-xl font-bold text-slate-950 dark:text-white">
                Improve
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review your answers, understand your score, and
                identify where you can improve.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-slate-950 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-indigo-500 px-6 py-14 text-center sm:px-10">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slate-950/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">
                Your next challenge is waiting
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                Ready to find out
                what you really know?
              </h2>

              <button
                type="button"
                onClick={() => navigate("/quizzes")}
                className="mt-8 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-600 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Explore Quizzes →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-5 pb-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Quizora</span>
          <span>Think. Answer. Improve.</span>
        </div>
      </footer>

    </main>
  );
}

export default QuizHome;
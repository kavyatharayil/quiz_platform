import { useNavigate } from "react-router-dom";

function QuizInstructions({ quiz }) {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-slate-950 px-5 py-20 sm:px-8 lg:px-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Before you begin
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl transition-colors">
            A few things to keep in mind.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400 transition-colors">
            Make sure you're ready before starting. Once the
            quiz begins, the timer will start automatically.
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">

          {/* Instruction 1 */}
          <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-100/40 dark:hover:shadow-indigo-500/10">

            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-600">
                01
              </span>

              <span className="text-xl text-slate-300 transition group-hover:text-indigo-400">
                ✓
              </span>
            </div>

            <h3 className="mt-12 text-lg font-black text-slate-950 dark:text-white transition-colors">
              Read carefully
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 transition-colors">
              Read each question and all available options
              carefully before selecting your answer.
            </p>
          </div>

          {/* Instruction 2 */}
          <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-100/40 dark:hover:shadow-indigo-500/10">

            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-600">
                02
              </span>

              <span className="text-xl text-slate-300 transition group-hover:text-indigo-400">
                ↔
              </span>
            </div>

            <h3 className="mt-12 text-lg font-black text-slate-950 dark:text-white transition-colors">
              Navigate freely
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 transition-colors">
              Move between questions using the navigation
              controls and review your answers.
            </p>
          </div>

          {/* Instruction 3 */}
          <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-100/40 dark:hover:shadow-indigo-500/10">

            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-600">
                03
              </span>

              <span className="text-xl text-slate-300 transition group-hover:text-indigo-400">
                ◷
              </span>
            </div>

            <h3 className="mt-12 text-lg font-black text-slate-950 dark:text-white transition-colors">
              Watch the timer
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 transition-colors">
              Keep an eye on the remaining time. The quiz will
              submit automatically when time runs out.
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:flex-row sm:p-8 transition-colors duration-300">

          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white transition-colors">
              Ready to begin?
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
              You can start whenever you're ready.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/quizzes/${quiz.id || quiz._id}/start`)
            }
            className="group flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 dark:bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition duration-200 hover:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Start Quiz

            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>

        </div>

      </div>
    </section>
  );
}

export default QuizInstructions;
import { useNavigate } from "react-router-dom";

function QuizCard({ quiz }) {
  const navigate = useNavigate();

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20">

      {/* Card top */}
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {quiz.category}
        </span>

        <span className="text-xl text-slate-200 transition duration-300 group-hover:translate-x-1 group-hover:text-indigo-400">
          ↗
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-7 text-xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
        {quiz.title}
      </h2>

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {quiz.description}
      </p>

      {/* Metadata */}
      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-slate-100 dark:border-slate-800/50 pt-5">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Questions
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            {quiz.questionCount || quiz.questions?.length || 0}
          </p>
        </div>

        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Duration
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            {quiz.duration} min
          </p>
        </div>

        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Type
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            {quiz.type || "N/A"}
          </p>
        </div>

        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Level
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            {quiz.level || "N/A"}
          </p>
        </div>

      </div>

      {/* Button */}
      <button
        type="button"
        onClick={() => navigate(`/quizzes/${quiz.id || quiz._id}`)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition duration-200 group-hover:bg-indigo-600 hover:bg-indigo-600"
      >
        View Quiz

        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </button>

    </article>
  );
}

export default QuizCard;
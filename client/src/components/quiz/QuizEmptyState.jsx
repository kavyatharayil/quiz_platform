function QuizEmptyState({
  setSearchTerm,
  setSelectedCategory,
  setFilters,
}) {
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    if (setFilters) {
      setFilters({
        questions: "",
        duration: "",
        type: "",
        level: ""
      });
    }
  };

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-20 text-center transition-colors duration-300">
      <div className="mx-auto max-w-md">

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
          No quizzes found
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          We couldn't find any quizzes matching your
          current search or category.
        </p>

        {/* Clear Filters */}
        <button
          type="button"
          onClick={handleClearFilters}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Clear Filters
        </button>

      </div>
    </div>
  );
}

export default QuizEmptyState;
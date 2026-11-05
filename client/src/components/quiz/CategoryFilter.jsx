function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  isLoading,
}) {
  return (
    <div className="relative md:w-64">

      <label
        htmlFor="category-filter"
        className="sr-only"
      >
        Filter by category
      </label>

      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(event) =>
          setSelectedCategory(event.target.value)
        }
        disabled={isLoading}
        className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 pr-10 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none transition focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category === "All"
              ? "All Categories"
              : category}
          </option>
        ))}
      </select>

      {/* Dropdown icon */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>

    </div>
  );
}

export default CategoryFilter;
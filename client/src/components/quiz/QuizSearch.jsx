import { useState, useRef, useEffect } from "react";

function QuizSearch({ searchTerm, setSearchTerm, isLoading, filters, setFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFilterCount = filters ? Object.values(filters).filter(Boolean).length : 0;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? "" : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      questions: "",
      duration: "",
      type: "",
      level: ""
    });
    setIsFilterOpen(false);
  };

  return (
    <div className="relative flex-1" ref={filterRef}>
      <label
        htmlFor="quiz-search"
        className="sr-only"
      >
        Search quizzes
      </label>

      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </span>

      <input
        id="quiz-search"
        type="text"
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        placeholder="Search quizzes..."
        disabled={isLoading}
        className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-11 pr-12 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <button
        type="button"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        disabled={isLoading}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 transition disabled:opacity-50 ${
          isFilterOpen 
            ? "text-indigo-600 dark:text-indigo-400" 
            : "text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        {activeFilterCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isFilterOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Number of Questions */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Number of Questions</p>
              <div className="flex flex-wrap gap-2">
                {['1-5', '6-10', '11-20', '21+'].map(val => (
                  <button
                    key={val}
                    onClick={() => handleFilterChange('questions', val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.questions === val ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '< 10 min', value: 'under-10' },
                  { label: '10-20 min', value: '10-20' },
                  { label: '21-30 min', value: '21-30' },
                  { label: '30+ min', value: '30+' }
                ].map(item => (
                  <button
                    key={item.value}
                    onClick={() => handleFilterChange('duration', item.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.duration === item.value ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</p>
              <div className="flex flex-wrap gap-2">
                {['IT', 'Non-IT'].map(val => (
                  <button
                    key={val}
                    onClick={() => handleFilterChange('type', val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.type === val ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Level</p>
              <div className="flex flex-wrap gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(val => (
                  <button
                    key={val}
                    onClick={() => handleFilterChange('level', val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.level === val ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizSearch;
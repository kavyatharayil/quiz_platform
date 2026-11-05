import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizApi } from "../../api/quiz.api";

import QuizCard from "../../components/quiz/QuizCard";
import QuizSearch from "../../components/quiz/QuizSearch";
import CategoryFilter from "../../components/quiz/CategoryFilter";
import QuizLoading from "../../components/quiz/QuizLoading";
import QuizEmptyState from "../../components/quiz/QuizEmptyState";
import Header from "../../components/layout/Header";

function QuizListing() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    questions: "",
    duration: "",
    type: "",
    level: ""
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const res = await quizApi.getQuizzes();
        setQuizzes(res.quizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return ["All", ...new Set(quizzes.map((quiz) => quiz.category || "General"))];
  }, [quizzes]);

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        (quiz.category || "General") === selectedCategory;

      const qCount = quiz.questionCount || quiz.questions?.length || 0;
      const matchesQuestions = !filters.questions || 
        (filters.questions === '1-5' && qCount >= 1 && qCount <= 5) ||
        (filters.questions === '6-10' && qCount >= 6 && qCount <= 10) ||
        (filters.questions === '11-20' && qCount >= 11 && qCount <= 20) ||
        (filters.questions === '21+' && qCount >= 21);

      const d = quiz.duration || 0;
      const matchesDuration = !filters.duration || 
        (filters.duration === 'under-10' && d < 10) ||
        (filters.duration === '10-20' && d >= 10 && d <= 20) ||
        (filters.duration === '21-30' && d >= 21 && d <= 30) ||
        (filters.duration === '30+' && d > 30);

      const matchesType = !filters.type || quiz.type === filters.type;
      const matchesLevel = !filters.level || quiz.level === filters.level;

      return matchesSearch && matchesCategory && matchesQuestions && matchesDuration && matchesType && matchesLevel;
    });
  }, [searchTerm, selectedCategory, filters, quizzes]);

  return (
    <main className="min-h-screen bg-[#f7f8fc] dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-300">

      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-950">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-indigo-600/15 blur-3xl" />

          <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

            {/* Heading */}
            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Discover
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                Find your next
                <span className="block text-indigo-400">
                  challenge.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Explore quizzes across different topics, test your
                knowledge, and discover where you stand.
              </p>
            </div>

            {/* Quiz count */}
            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Available
              </p>

              <p className="mt-1 text-3xl font-black text-white">
                {quizzes.length}
              </p>

              <p className="text-xs text-slate-500">
                quizzes
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

        {/* Search / Filter */}
        <div className="relative z-10 -mt-16 mb-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 sm:p-4 transition-colors duration-300">

          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}
            <QuizSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLoading={isLoading}
              filters={filters}
              setFilters={setFilters}
            />

            {/* Category */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isLoading={isLoading}
            />

</div>
</div>
        {/* ================= LOADING ================= */}
        {isLoading ? (
          <QuizLoading />
        ) : (
          
       
          <>
            {/* Result count */}
            <div className="mb-6 flex items-center justify-between">

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {filteredQuizzes.length}
                </span>{" "}
                {filteredQuizzes.length === 1
                  ? "quiz"
                  : "quizzes"}{" "}
                found
              </p>

              {(searchTerm ||
                selectedCategory !== "All" ||
                Object.values(filters).some(Boolean)) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setFilters({ questions: "", duration: "", type: "", level: "" });
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Clear filters
                </button>
              )}

            </div>

            {/* ================= QUIZ CARDS ================= */}
            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            {filteredQuizzes.map((quiz) => (
            <QuizCard
            key={quiz.id || quiz._id || Math.random()}
            quiz={quiz}
            />
       ))}

    </div>
               
            ) : (
              /* ================= EMPTY STATE ================= */
              <QuizEmptyState
                setSearchTerm={setSearchTerm}
                setSelectedCategory={setSelectedCategory}
                setFilters={setFilters}
              />
            )}

          </>
        )}

      </section>

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

export default QuizListing;
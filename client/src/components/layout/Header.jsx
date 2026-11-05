import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Crown } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { authApi } from "../../api/auth.api";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  let variant = "default";
  if (path === "/") variant = "home";
  else if (path === "/quizzes") variant = "listing";
  else if (path.match(/^\/quizzes\/[^/]+$/)) variant = "details";
  else if (path.match(/^\/quizzes\/[^/]+\/result$/)) variant = "result";

  if (variant === "home") {
    return (
      <>
        {/* Spacer to maintain document flow */}
        <div className="h-20 w-full shrink-0 bg-slate-950"></div>
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
          <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition group-hover:rotate-6">
                Q
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Quizora
              </span>
            </button>

            <div className="hidden items-center gap-8 md:flex">
              <button
                type="button"
                onClick={() => navigate("/quizzes")}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Explore Quizzes
              </button>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                How It Works
              </button>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => navigate("/quizzes")}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-indigo-400/40 hover:bg-white/10"
              >
                Start Exploring
              </button>
            </div>
          </nav>
        </header>
      </>
    );
  }

  // Default / Other variants (listing, details, result)
  let rightContent = null;
  let containerClasses = "mx-auto flex items-center justify-between px-5 py-4 sm:px-6 lg:px-8";
  
  if (variant === "listing") {
    containerClasses = "mx-auto flex items-center justify-between max-w-7xl px-5 py-6 sm:px-8 lg:px-10";
    rightContent = (
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
      >
        ← Home
      </button>
    );
  } else if (variant === "details") {
    containerClasses = "mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8";
    rightContent = (
      <button
        type="button"
        onClick={() => navigate("/quizzes")}
        className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
      >
        ← All Quizzes
      </button>
    );
  } else if (variant === "result") {
    containerClasses = "mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8";
    rightContent = (
      <button
        type="button"
        onClick={() => navigate("/quizzes")}
        className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
      >
        ← Quiz Library
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className={containerClasses}>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white transition duration-200 group-hover:rotate-6">
            Q
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white transition-colors duration-300">
            Quizora
          </span>
        </button>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          {rightContent}
          <button
            type="button"
            onClick={async () => {
            try { await authApi.logout(); } catch(e){}
            localStorage.removeItem("currentUser");
              navigate("/login");
            }}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition ml-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

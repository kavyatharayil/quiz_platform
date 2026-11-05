import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard Overview", icon: "📊" },
    { path: "/admin/quizzes", label: "Manage Quizzes", icon: "📝" },
    { path: "/admin/questions", label: "Manage Questions", icon: "❓" },
    { path: "/admin/categories", label: "Manage Categories", icon: "🏷️" },
    { path: "/admin/users", label: "Manage Users", icon: "👥" },
    { path: "/admin/results", label: "Quiz Results", icon: "📈" },
    { path: "/admin/reports", label: "Quiz Reports", icon: "📑" },
  ];

  return (
    <aside className="relative w-64 bg-slate-950 text-slate-100 p-5 flex flex-col gap-6 min-h-screen border-r border-slate-800 shrink-0">
      {/* Subtle ambient blur background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Brand Header */}
      <div className="relative z-10 pb-5 border-b border-white/10">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full text-left group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-black text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
            Q
          </span>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-none transition group-hover:text-indigo-200">
              Quizora
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Admin Portal
            </span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="relative z-10 pt-4 border-t border-white/10 mt-auto flex flex-col gap-2">
        <button
          onClick={async () => {
            try { await authApi.logout(); } catch(e){}
            localStorage.removeItem("currentUser");
            navigate("/login");
          }}
          className="w-full group flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-transparent px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
        >
          <span>🚪</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

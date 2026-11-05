import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../../api/dashboard.api";

const SuperAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const data = await dashboardApi.getStats();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };
    
    fetchStats();
    
    // Real-time polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchStats(true);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const stats = [
    { title: "Total Quizzes", count: dashboardData?.totalQuizzes || 0, icon: "📝", bg: "bg-indigo-50", color: "text-indigo-600 border-indigo-100" },
    { title: "Total Questions", count: dashboardData?.totalQuestions || 0, icon: "❓", bg: "bg-emerald-50", color: "text-emerald-600 border-emerald-100" },
    { title: "Categories", count: dashboardData?.categories || 0, icon: "🏷️", bg: "bg-amber-50", color: "text-amber-600 border-amber-100" },
    { title: "Registered Users", count: dashboardData?.registeredUsers || 0, icon: "👥", bg: "bg-violet-50", color: "text-violet-600 border-violet-100" },
    { title: "Quiz Attempts", count: dashboardData?.quizAttempts || 0, icon: "📈", bg: "bg-rose-50", color: "text-rose-600 border-rose-100" },
  ];

  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Super Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 font-normal">
          Supervise platform statistics, user & admin activities, and global system management.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.title}
              </p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {stat.count}
              </h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Super Admin Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/superadmin/quizzes"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-200 transition text-slate-800 font-semibold text-sm shadow-xs hover:-translate-y-0.5"
            >
              <span>📝</span>
              <span>Manage Quizzes</span>
            </Link>
            <Link
              to="/superadmin/questions"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-200 transition text-slate-800 font-semibold text-sm shadow-xs hover:-translate-y-0.5"
            >
              <span>❓</span>
              <span>Manage Questions</span>
            </Link>
            <Link
              to="/superadmin/categories"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-200 transition text-slate-800 font-semibold text-sm shadow-xs hover:-translate-y-0.5"
            >
              <span>🏷️</span>
              <span>Manage Categories</span>
            </Link>
            <Link
              to="/superadmin/users"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-200 transition text-slate-800 font-semibold text-sm shadow-xs hover:-translate-y-0.5"
            >
              <span>👥</span>
              <span>Manage Users & Admins</span>
            </Link>
          </div>
        </div>

        {/* Recent Submissions Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Platform Activity
          </h3>
          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <strong className="text-sm font-bold text-slate-900 block">
                    {act.user}
                  </strong>
                  <p className="text-xs text-slate-500 mt-0.5">{act.action}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                    {act.score}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

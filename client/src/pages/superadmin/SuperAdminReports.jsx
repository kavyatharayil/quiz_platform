import React, { useState, useEffect } from "react";
import { reportApi } from "../../api/report.api";

const SuperAdminReports = () => {
  const [dateRange, setDateRange] = useState("30");
  const [summaryMetrics, setSummaryMetrics] = useState([]);
  const [topPerformingQuizzes, setTopPerformingQuizzes] = useState([]);
  const [recentUserActivity, setRecentUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const data = await reportApi.getSuperAdminReports(dateRange);
        setSummaryMetrics(data.summaryMetrics || []);
        setTopPerformingQuizzes(data.topPerformingQuizzes || []);
        setRecentUserActivity(data.recentUserActivity || []);
      } catch (err) {
        console.error("Failed to fetch super admin reports", err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };
    
    fetchReports();
    
    // Set up polling for real-time updates every 5 seconds
    const intervalId = setInterval(() => {
      fetchReports(true);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [dateRange]);

  if (loading && summaryMetrics.length === 0) {
    return <div className="p-6">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Super Admin Global Platform Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Complete platform performance metrics, global attempt breakdowns, and downloadable analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">All Time</option>
          </select>

          <button
            onClick={() => alert("Downloading full platform PDF report...")}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition hover:bg-violet-500"
          >
            <span>📥</span> Export PDF Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.label}</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">{m.value}</h2>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">{m.change} vs last period</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${m.color}`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Platform Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Quizzes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🏆</span> Top Performing Quizzes
          </h3>
          <div className="divide-y divide-slate-100">
            {topPerformingQuizzes.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <strong className="text-sm font-bold text-slate-900 block">{q.title}</strong>
                  <span className="text-xs text-slate-400 font-medium">{q.category} • {q.attempts} attempts</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                    Pass: {q.passRate}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Avg Score: {q.avgScore}</p>
                </div>
              </div>
            ))}
            {topPerformingQuizzes.length === 0 && (
              <p className="text-sm text-slate-500 py-4">No top quizzes found for this period.</p>
            )}
          </div>
        </div>

        {/* Global Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/50 space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>⚡</span> Real-time User Attempts & Activity
          </h3>
          <div className="divide-y divide-slate-100">
            {recentUserActivity.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900">{act.user}</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {act.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{act.quiz}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                      act.status === "Passed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {act.score} ({act.status})
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{act.date}</p>
                </div>
              </div>
            ))}
            {recentUserActivity.length === 0 && (
              <p className="text-sm text-slate-500 py-4">No recent activity found for this period.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;

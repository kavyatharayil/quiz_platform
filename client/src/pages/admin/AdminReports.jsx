import React, { useState, useEffect } from "react";
import { reportApi } from "../../api/report.api";

const AdminReports = () => {
  const [adminMetrics, setAdminMetrics] = useState([]);
  const [quizPerformance, setQuizPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const data = await reportApi.getAdminReports();
        setAdminMetrics(data.adminMetrics || []);
        setQuizPerformance(data.quizPerformance || []);
      } catch (err) {
        console.error("Failed to fetch admin reports", err);
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
  }, []);

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Admin Operational Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            View operational quiz statistics, submission performance, and user attempt breakdowns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {adminMetrics.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.label}</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">{m.value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${m.color}`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Quiz Attempt Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Quiz Title</th>
                <th className="p-3">Total Attempts</th>
                <th className="p-3">Average Score</th>
                <th className="p-3">Pass Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {quizPerformance.map((q, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-slate-900">{q.title}</td>
                  <td className="p-3">{q.totalAttempts}</td>
                  <td className="p-3 font-semibold text-indigo-600">{q.avgScore}</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{q.passRate}</span></td>
                </tr>
              ))}
              {quizPerformance.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-slate-500">No quiz performance data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

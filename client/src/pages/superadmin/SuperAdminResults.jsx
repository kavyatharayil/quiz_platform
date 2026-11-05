import React, { useState, useEffect } from "react";
import DataTable from "../../components/admin/common/DataTable";
import Modal from "../../components/admin/common/Modal";
import { resultApi } from "../../api/result.api";

const SuperAdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await resultApi.getAllResults();
      setResults(data.results || []);
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const columns = [
    {
      header: "User",
      key: "userId.name",
      render: (row) => <span className="font-bold text-slate-900">{row.userId?.name || 'Unknown'}</span>,
    },
    { header: "Quiz Title", key: "quizId.title", render: (row) => row.quizId?.title || 'Unknown' },
    {
      header: "Score",
      key: "score",
      render: (row) => (
        <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100 text-xs">
          {row.percentage != null ? `${Math.round(row.percentage)}%` : '-'}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => {
        const isPassed = row.percentage >= 60;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              isPassed
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                : "bg-rose-50 text-rose-700 border border-rose-200/80"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPassed ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {isPassed ? "Passed" : "Failed"}
          </span>
        );
      },
    },
    { 
      header: "Submission Date", 
      key: "submittedAt",
      render: (row) => row.submittedAt ? new Date(row.submittedAt).toLocaleString() : 'In Progress'
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => setSelectedResult(row)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition hover:border-slate-300"
        >
          View Details
        </button>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Result Status",
      options: [
        { label: "Passed", value: "Passed" },
        { label: "Failed", value: "Failed" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Super Admin Quiz Results & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Review user performance, test submissions, and overall platform pass rates.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={results}
        searchPlaceholder="Search results by user or quiz..."
        filters={filters}
      />

      {selectedResult && (
        <Modal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          title="Submission Breakdown"
        >
          <div className="space-y-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5 text-sm">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">User:</span>
                <span className="font-bold text-slate-900">{selectedResult.userId?.name || selectedResult.userName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Quiz:</span>
                <span className="font-semibold text-slate-800">{selectedResult.quizId?.title || selectedResult.quizTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Score Achieved:</span>
                <span className="font-bold text-violet-600">{selectedResult.percentage}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Result Status:</span>
                <span className={`font-bold ${selectedResult.percentage >= 60 ? "text-emerald-600" : "text-rose-600"}`}>
                  {selectedResult.percentage >= 60 ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Submitted At:</span>
                <span className="text-slate-700">{selectedResult.submittedAt ? new Date(selectedResult.submittedAt).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-md shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuperAdminResults;

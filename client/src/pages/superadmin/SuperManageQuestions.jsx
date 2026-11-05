import React, { useState, useEffect } from "react";
import { quizApi } from "../../api/quiz.api";
import { questionApi } from "../../api/question.api";
import DataTable from "../../components/admin/common/DataTable";
import Modal from "../../components/admin/common/Modal";

const SuperManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState({
    type: "Multiple Choice",
    text: "",
    quizId: "",
    section: "General",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    referenceAnswer: "",
    points: 5,
  });

  const fetchQuestionsData = async () => {
    try {
      setLoading(true);
      const quizzesResponse = await quizApi.getQuizzes();
      const quizzesData = quizzesResponse.quizzes || [];
      setAvailableQuizzes(quizzesData);
      
      let allQuestions = [];
      for (const q of quizzesData) {
        const qId = q._id || q.id;
        try {
          const qs = await questionApi.getQuestionsByQuizId(qId);
          const decoratedQs = qs.map((question) => ({
            ...question,
            text: question.question,
            points: question.marks,
            quizTitle: q.title,
            quizId: qId,
          }));
          allQuestions = [...allQuestions, ...decoratedQs];
        } catch (e) {
          console.error("Failed to fetch questions for quiz", qId);
        }
      }
      setQuestions(allQuestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsData();
  }, []);

  const selectedQuizData = availableQuizzes.find((q) => (q._id || q.id) === formData.quizId);

  const handleQuizChange = (newQuizId) => {
    const foundQuiz = availableQuizzes.find((q) => (q._id || q.id) === newQuizId);
    const defaultSection = foundQuiz && foundQuiz.sections && foundQuiz.sections.length > 0 ? foundQuiz.sections[0] : "General";
    setFormData((prev) => ({
      ...prev,
      quizId: newQuizId,
      section: defaultSection,
    }));
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    const defaultQuizId = availableQuizzes.length > 0 ? (availableQuizzes[0]._id || availableQuizzes[0].id) : "";
    setFormData({
      type: "Multiple Choice",
      text: "",
      quizId: defaultQuizId,
      section: "General",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      referenceAnswer: "",
      points: 5,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      type: question.type || "Multiple Choice",
      text: question.text || question.question,
      quizId: question.quizId,
      section: question.section || "General",
      optionA: question.options?.[0]?.text || "",
      optionB: question.options?.[1]?.text || "",
      optionC: question.options?.[2]?.text || "",
      optionD: question.options?.[3]?.text || "",
      correctAnswer: question.correctAnswer || "A",
      referenceAnswer: question.referenceAnswer || "",
      points: question.points || question.marks || 5,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await questionApi.deleteQuestion(id);
        fetchQuestionsData();
      } catch (err) {
        console.error("Failed to delete question", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isMultipleChoice = formData.type === "Multiple Choice";

    const formattedOptions = isMultipleChoice
      ? [
          { id: "A", text: formData.optionA || "Option A" },
          { id: "B", text: formData.optionB || "Option B" },
          { id: "C", text: formData.optionC || "Option C" },
          { id: "D", text: formData.optionD || "Option D" },
        ]
      : [];

    const payload = {
      question: formData.text,
      options: formattedOptions,
      correctAnswer: isMultipleChoice ? formData.correctAnswer : undefined,
      marks: Number(formData.points),
    };

    try {
      if (editingQuestion) {
        await questionApi.updateQuestion(editingQuestion._id || editingQuestion.id, payload);
      } else {
        await questionApi.createQuestion(formData.quizId, payload);
      }
      setIsModalOpen(false);
      fetchQuestionsData();
    } catch (err) {
      console.error("Failed to save question", err);
    }
  };

  const columns = [
    {
      header: "Question Statement",
      key: "text",
      render: (row) => {
        const isMultipleChoice = (row.type || "Multiple Choice") === "Multiple Choice";
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{row.text}</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isMultipleChoice
                    ? "bg-violet-50 text-violet-700 border-violet-100"
                    : "bg-purple-50 text-purple-700 border-purple-100"
                }`}
              >
                {isMultipleChoice ? "Multiple Choice" : "Technical & Logical"}
              </span>
            </div>
            {isMultipleChoice && row.options && (
              <div className="flex flex-wrap gap-1">
                {row.options.map((opt) => (
                  <span
                    key={opt.id}
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      row.correctAnswer === opt.id
                        ? "bg-emerald-100 font-bold text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {opt.id}: {opt.text} {row.correctAnswer === opt.id ? "✓" : ""}
                  </span>
                ))}
              </div>
            )}
            {!isMultipleChoice && row.referenceAnswer && (
              <p className="text-[11px] font-mono text-purple-800 bg-purple-50/60 p-1.5 rounded border border-purple-100">
                Key: {row.referenceAnswer}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "Quiz & Section",
      key: "quizTitle",
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{row.quizTitle}</span>
          <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 inline-block mt-0.5">
            {row.section || "General"}
          </span>
        </div>
      ),
    },
    {
      header: "Points",
      key: "points",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {row.points} pts
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition hover:border-slate-300"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id || row.id)}
            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: "quizTitle",
      label: "Quiz",
      options: availableQuizzes.map((q) => ({ label: q.title, value: q.title })),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Super Admin Question Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Add, edit, and organize Multiple Choice and Technical & Logical questions across all quizzes.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={questions}
        searchPlaceholder="Search questions statement..."
        filters={filters}
        actions={
          <button
            onClick={handleCreate}
            className="group flex items-center gap-2 rounded-xl bg-violet-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500"
          >
            <span>➕</span>
            <span>Add New Question</span>
          </button>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? "Edit Question" : "Add New Question"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Question Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
              >
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Technical & Logical">Technical & Logical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Quiz
              </label>
              <select
                value={formData.quizId}
                onChange={(e) => handleQuizChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
              >
                {availableQuizzes.map((q) => (
                  <option key={q._id || q.id} value={q._id || q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
              >
                {selectedQuizData && selectedQuizData.sections && selectedQuizData.sections.length > 0 ? (
                  selectedQuizData.sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))
                ) : (
                  <option value="General">General Section</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Question Statement
            </label>
            <textarea
              rows={3}
              required
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Enter question statement..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition placeholder:text-slate-400"
            />
          </div>

          {formData.type === "Multiple Choice" ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  4 Options (Select the correct option)
                </label>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Correct Choice: Option {formData.correctAnswer}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`flex items-center gap-2 border rounded-xl p-2.5 transition ${
                    formData.correctAnswer === "A"
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                      : "bg-slate-50/30 border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswerSelectModalSuper"
                    checked={formData.correctAnswer === "A"}
                    onChange={() => setFormData({ ...formData, correctAnswer: "A" })}
                    className="accent-emerald-600 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-500">A.</span>
                  <input
                    type="text"
                    placeholder="Option A"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent"
                  />
                </div>

                <div
                  className={`flex items-center gap-2 border rounded-xl p-2.5 transition ${
                    formData.correctAnswer === "B"
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                      : "bg-slate-50/30 border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswerSelectModalSuper"
                    checked={formData.correctAnswer === "B"}
                    onChange={() => setFormData({ ...formData, correctAnswer: "B" })}
                    className="accent-emerald-600 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-500">B.</span>
                  <input
                    type="text"
                    placeholder="Option B"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent"
                  />
                </div>

                <div
                  className={`flex items-center gap-2 border rounded-xl p-2.5 transition ${
                    formData.correctAnswer === "C"
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                      : "bg-slate-50/30 border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswerSelectModalSuper"
                    checked={formData.correctAnswer === "C"}
                    onChange={() => setFormData({ ...formData, correctAnswer: "C" })}
                    className="accent-emerald-600 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-500">C.</span>
                  <input
                    type="text"
                    placeholder="Option C"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent"
                  />
                </div>

                <div
                  className={`flex items-center gap-2 border rounded-xl p-2.5 transition ${
                    formData.correctAnswer === "D"
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                      : "bg-slate-50/30 border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswerSelectModalSuper"
                    checked={formData.correctAnswer === "D"}
                    onChange={() => setFormData({ ...formData, correctAnswer: "D" })}
                    className="accent-emerald-600 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-500">D.</span>
                  <input
                    type="text"
                    placeholder="Option D"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1.5">
                Reference Solution Key
              </label>
              <textarea
                rows={3}
                value={formData.referenceAnswer}
                onChange={(e) => setFormData({ ...formData, referenceAnswer: e.target.value })}
                placeholder="Enter sample code or logic solution key..."
                className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50/30 text-purple-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Points:</label>
              <input
                type="number"
                min="1"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-md shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5"
              >
                {editingQuestion ? "Update Question" : "Save Question"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SuperManageQuestions;

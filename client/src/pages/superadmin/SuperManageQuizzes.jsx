import React, { useState, useEffect } from "react";
import { quizApi } from "../../api/quiz.api";
import { questionApi } from "../../api/question.api";
import DataTable from "../../components/admin/common/DataTable";
import QuizModalForm from "../../components/admin/quiz/QuizModalForm";

const SuperManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [modalTab, setModalTab] = useState("details");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreate = () => {
    setEditingQuiz(null);
    setModalTab("details");
    setIsModalOpen(true);
  };

  const fetchAndFormatSections = async (quiz) => {
    try {
      const qs = await questionApi.getQuestionsByQuizId(quiz._id || quiz.id);
      if (!qs || qs.length === 0) {
        return [{ id: "sec_1", name: "Section 1: Core Multiple Choice", type: "Multiple Choice", questions: [] }];
      }
      
      const sectionsMap = {};
      qs.forEach((q) => {
        const secName = q.section || "General";
        if (!sectionsMap[secName]) {
          sectionsMap[secName] = { id: `sec_${Object.keys(sectionsMap).length + 1}`, name: secName, type: q.type || "Multiple Choice", questions: [] };
        }
        sectionsMap[secName].questions.push({
          ...q,
          id: q._id || q.id,
          text: q.question,
          points: q.marks,
        });
      });
      return Object.values(sectionsMap);
    } catch (err) {
      console.error("Failed to fetch questions for quiz", err);
      return [];
    }
  };

  const handleEdit = async (quiz) => {
    const formattedSections = await fetchAndFormatSections(quiz);
    setEditingQuiz({ ...quiz, sections: formattedSections });
    setModalTab("details");
    setIsModalOpen(true);
  };

  const handleManageQuestions = async (quiz) => {
    const formattedSections = await fetchAndFormatSections(quiz);
    setEditingQuiz({ ...quiz, sections: formattedSections });
    setModalTab("sections");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizApi.deleteQuiz(id);
        fetchQuizzes();
      } catch (err) {
        console.error("Failed to delete quiz", err);
      }
    }
  };

  const handleSaveQuiz = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration) || 15,
        totalMarks: parseInt(formData.totalMarks) || 10,
        category: formData.category,
        type: formData.type,
        level: formData.level,
        isPublished: formData.status === "Published"
      };

      let savedQuizId;
      if (editingQuiz) {
        await quizApi.updateQuiz(editingQuiz._id || editingQuiz.id, payload);
        savedQuizId = editingQuiz._id || editingQuiz.id;
      } else {
        const res = await quizApi.createQuiz(payload);
        savedQuizId = res.data?.data?._id || res.data?._id || res._id || res.id;
      }

      // Sync Questions
      if (savedQuizId && formData.sections) {
        const originalQuestions = editingQuiz?.sections?.flatMap(s => s.questions) || [];
        const currentQuestions = formData.sections.flatMap(s => s.questions.map(q => ({ ...q, section: s.name })));
        
        // Find deletions
        const currentQuestionIds = currentQuestions.map(q => q.id).filter(id => !String(id).startsWith('q_'));
        const deletedQuestions = originalQuestions.filter(oq => !currentQuestionIds.includes(oq.id));
        
        // Delete removed questions
        for (const dq of deletedQuestions) {
          await questionApi.deleteQuestion(dq.id);
        }

        // Create or update current questions
        for (const cq of currentQuestions) {
          const isMultipleChoice = cq.type === "Multiple Choice";
          const qPayload = {
            question: cq.text,
            options: isMultipleChoice ? cq.options : [],
            correctAnswer: isMultipleChoice ? cq.correctAnswer : undefined,
            referenceAnswer: !isMultipleChoice ? cq.referenceAnswer : undefined,
            marks: Number(cq.points),
            section: cq.section,
            type: cq.type,
          };

          if (String(cq.id).startsWith('q_')) {
            await questionApi.createQuestion(savedQuizId, qPayload);
          } else {
            await questionApi.updateQuestion(cq.id, qPayload);
          }
        }
      }

      setIsModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to save quiz and questions", err);
    }
  };

  const columns = [
    {
      header: "Quiz Title",
      key: "title",
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.title}</span>
          <span className="text-xs text-slate-500 font-medium">
            {row.sections ? row.sections.length : 0} Sections
          </span>
        </div>
      ),
    },
    { header: "Category", key: "category" },
    { header: "Duration", key: "duration", render: (row) => `${row.duration} mins` },
    {
      header: "Questions",
      key: "totalQuestions",
      render: (row) => {
        const count = row.sections
          ? row.sections.reduce((acc, s) => acc + (s.questions ? s.questions.length : 0), 0)
          : (row.questionCount || row.totalQuestions || 0);
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
            {count} Qs
          </span>
        );
      },
    },
    {
      header: "Status",
      key: "isPublished",
      render: (row) => {
        const isPublished = row.isPublished;
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isPublished
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPublished ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isPublished ? "Published" : "Draft"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleManageQuestions(row)}
            className="px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50/70 hover:bg-violet-100 text-violet-700 text-xs font-bold transition flex items-center gap-1 shadow-2xs"
            title="Manage Sections & Questions for this Quiz"
          >
            <span>🧩</span> Questions & Sections
          </button>
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
      key: "category",
      label: "Category",
      options: [
        { label: "Programming", value: "Programming" },
        { label: "Web Development", value: "Web Development" },
        { label: "Database", value: "Database" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Published", value: "Published" },
        { label: "Draft", value: "Draft" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Super Admin Quiz Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Create quizzes, organize sections, and manage questions directly under each quiz.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={quizzes}
        searchPlaceholder="Search quizzes by title..."
        filters={filters}
        actions={
          <button
            onClick={handleCreate}
            className="group flex items-center gap-2 rounded-xl bg-violet-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500"
          >
            <span>➕</span>
            <span>Create New Quiz</span>
          </button>
        }
      />

      {isModalOpen && (
        <QuizModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizToEdit={editingQuiz}
          initialTab={modalTab}
          onSave={handleSaveQuiz}
        />
      )}
    </div>
  );
};

export default SuperManageQuizzes;

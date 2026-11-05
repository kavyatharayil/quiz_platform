import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";

const QuizModalForm = ({ isOpen, onClose, quizToEdit, onSave, initialTab = "details" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Programming",
    type: "IT",
    level: "Beginner",
    duration: 15,
    passingScore: 70,
    status: "Published",
  });

  const [sections, setSections] = useState([
    {
      id: "sec_1",
      name: "Section 1: Core Multiple Choice",
      type: "Multiple Choice", // "Multiple Choice" | "Technical & Logical"
      questions: [],
    },
  ]);

  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionType, setNewSectionType] = useState("Multiple Choice");
  const [showAddSection, setShowAddSection] = useState(false);

  // Active question being added or edited under a specific section
  const [editingQuestion, setEditingQuestion] = useState(null); // { sectionId, questionId | null }
  const [questionFormData, setQuestionFormData] = useState({
    type: "Multiple Choice", // "Multiple Choice" | "Technical & Logical"
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    referenceAnswer: "",
    points: 5,
  });

  useEffect(() => {
    if (quizToEdit) {
      setFormData({
        title: quizToEdit.title || "",
        description: quizToEdit.description || "",
        category: quizToEdit.category || "Programming",
        type: quizToEdit.type || "IT",
        level: quizToEdit.level || "Beginner",
        duration: quizToEdit.duration || 15,
        passingScore: quizToEdit.passingScore || 70,
        status: quizToEdit.status || "Published",
      });

      if (quizToEdit.sections && quizToEdit.sections.length > 0) {
        setSections(quizToEdit.sections);
      } else {
        setSections([
          {
            id: "sec_1",
            name: "Section 1: Core Questions",
            type: "Multiple Choice",
            questions: quizToEdit.questions || [],
          },
        ]);
      }
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Programming",
        type: "IT",
        level: "Beginner",
        duration: 15,
        passingScore: 70,
        status: "Published",
      });
      setSections([
        {
          id: "sec_1",
          name: "Section 1: Core Multiple Choice",
          type: "Multiple Choice",
          questions: [],
        },
      ]);
    }
    setActiveTab(initialTab);
  }, [quizToEdit, isOpen, initialTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Section operations
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    const newSec = {
      id: `sec_${Date.now()}`,
      name: newSectionName.trim(),
      type: newSectionType,
      questions: [],
    };
    setSections((prev) => [...prev, newSec]);
    setNewSectionName("");
    setNewSectionType("Multiple Choice");
    setShowAddSection(false);
  };

  const handleDeleteSection = (secId) => {
    if (sections.length <= 1) {
      alert("A quiz must have at least one section.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this section and all its questions?")) {
      setSections((prev) => prev.filter((s) => s.id !== secId));
    }
  };

  // Question form handlers
  const handleOpenAddQuestion = (sec) => {
    setEditingQuestion({ sectionId: sec.id, questionId: null });
    setQuestionFormData({
      type: sec.type || "Multiple Choice",
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      referenceAnswer: "",
      points: 5,
    });
  };

  const handleOpenEditQuestion = (sec, q) => {
    setEditingQuestion({ sectionId: sec.id, questionId: q.id });
    setQuestionFormData({
      type: q.type || sec.type || "Multiple Choice",
      text: q.text || q.question || "",
      optionA: q.options?.[0]?.text || q.optionA || "",
      optionB: q.options?.[1]?.text || q.optionB || "",
      optionC: q.options?.[2]?.text || q.optionC || "",
      optionD: q.options?.[3]?.text || q.optionD || "",
      correctAnswer: q.correctAnswer || "A",
      referenceAnswer: q.referenceAnswer || "",
      points: q.points || 5,
    });
  };

  const handleSaveQuestion = (secId) => {
    if (!questionFormData.text.trim()) {
      alert("Question text is required.");
      return;
    }

    const isMultipleChoice = questionFormData.type === "Multiple Choice";

    const formattedOptions = isMultipleChoice
      ? [
          { id: "A", text: questionFormData.optionA || "Option A" },
          { id: "B", text: questionFormData.optionB || "Option B" },
          { id: "C", text: questionFormData.optionC || "Option C" },
          { id: "D", text: questionFormData.optionD || "Option D" },
        ]
      : [];

    setSections((prevSections) =>
      prevSections.map((sec) => {
        if (sec.id !== secId) return sec;

        let updatedQuestions;
        if (editingQuestion.questionId) {
          // Editing existing question
          updatedQuestions = sec.questions.map((q) =>
            q.id === editingQuestion.questionId
              ? {
                  ...q,
                  type: questionFormData.type,
                  text: questionFormData.text,
                  options: formattedOptions,
                  correctAnswer: isMultipleChoice ? questionFormData.correctAnswer : undefined,
                  referenceAnswer: !isMultipleChoice ? questionFormData.referenceAnswer : undefined,
                  points: Number(questionFormData.points),
                }
              : q
          );
        } else {
          // Creating new question
          const newQ = {
            id: `q_${Date.now()}`,
            type: questionFormData.type,
            text: questionFormData.text,
            options: formattedOptions,
            correctAnswer: isMultipleChoice ? questionFormData.correctAnswer : undefined,
            referenceAnswer: !isMultipleChoice ? questionFormData.referenceAnswer : undefined,
            points: Number(questionFormData.points),
          };
          updatedQuestions = [...sec.questions, newQ];
        }
        return { ...sec, questions: updatedQuestions };
      })
    );

    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (secId, qId) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === secId
          ? { ...sec, questions: sec.questions.filter((q) => q.id !== qId) }
          : sec
      )
    );
  };

  const totalQuestions = sections.reduce(
    (acc, sec) => acc + (sec.questions ? sec.questions.length : 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      sections,
      totalQuestions,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quizToEdit ? `Edit Quiz: ${formData.title || "Untitled"}` : "Create New Quiz"}
      maxWidth="max-w-3xl"
    >
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "details"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>📋 1. Quiz Details</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "sections"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>🧩 2. Sections & Questions</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            {sections.length} Sec • {totalQuestions} Qs
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: Quiz Details */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Quiz Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Web Development Assessment"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief overview of what this quiz evaluates..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database">Database</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
                  >
                    <option value="IT">IT</option>
                    <option value="Non-IT">Non-IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  min="1"
                  max="100"
                  value={formData.passingScore}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab("sections")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition"
              >
                Next: Add Sections & Questions ➔
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Sections & Questions */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
              <div>
                <h4 className="text-sm font-bold text-indigo-950">Quiz Sections & Question Builder</h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Create custom sections (*Multiple Choice* or *Technical & Logical*) and configure question items under each.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSection(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
              >
                <span>➕</span> Add New Section
              </button>
            </div>

            {/* Add Section Input Form */}
            {showAddSection && (
              <div className="p-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/30 space-y-3">
                <h5 className="text-xs font-bold text-slate-800">Add New Section</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      placeholder="e.g. Section 2: Technical & Logical Questions"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Section Type</label>
                    <select
                      value={newSectionType}
                      onChange={(e) => setNewSectionType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    >
                      <option value="Multiple Choice">Multiple Choice (4 Options)</option>
                      <option value="Technical & Logical">Technical & Logical (Code/Text)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSection(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            )}

            {/* List of Sections */}
            {sections.map((sec, secIdx) => (
              <div key={sec.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {secIdx + 1}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900">{sec.name}</h5>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        sec.type === "Technical & Logical"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      {sec.type || "Multiple Choice"}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {sec.questions ? sec.questions.length : 0} questions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAddQuestion(sec)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
                    >
                      + Add Question
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id)}
                      className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-md font-semibold transition"
                    >
                      Delete Section
                    </button>
                  </div>
                </div>

                {/* Question form under this section */}
                {editingQuestion && editingQuestion.sectionId === sec.id && (
                  <div className="p-4 bg-amber-50/40 border-b border-amber-200/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs font-black uppercase tracking-wide text-indigo-900">
                        {editingQuestion.questionId ? "Edit Question" : `New Question (${questionFormData.type})`}
                      </h6>
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Question Type</label>
                        <select
                          value={questionFormData.type}
                          onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="Multiple Choice">Multiple Choice (4 Options)</option>
                          <option value="Technical & Logical">Technical & Logical (Code/Text Response)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Points / Marks</label>
                        <input
                          type="number"
                          min="1"
                          value={questionFormData.points}
                          onChange={(e) => setQuestionFormData({ ...questionFormData, points: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Question Statement</label>
                      <textarea
                        rows={2}
                        required
                        value={questionFormData.text}
                        onChange={(e) =>
                          setQuestionFormData({ ...questionFormData, text: e.target.value })
                        }
                        placeholder="Enter the question statement or technical prompt..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                      />
                    </div>

                    {/* MULTIPLE CHOICE TYPE: 4 Options + Admin Correct Option Selection */}
                    {questionFormData.type === "Multiple Choice" ? (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-600">
                            4 Options (Admin: Select the radio button for the correct answer)
                          </label>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Admin Choice: Option {questionFormData.correctAnswer}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div
                            className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                              questionFormData.correctAnswer === "A"
                                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${sec.id}`}
                              checked={questionFormData.correctAnswer === "A"}
                              onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: "A" })}
                              className="accent-emerald-600 h-4 w-4"
                            />
                            <span className="text-xs font-bold text-slate-500">A.</span>
                            <input
                              type="text"
                              placeholder="Option A text"
                              value={questionFormData.optionA}
                              onChange={(e) => setQuestionFormData({ ...questionFormData, optionA: e.target.value })}
                              className="w-full text-xs outline-none bg-transparent"
                            />
                          </div>

                          <div
                            className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                              questionFormData.correctAnswer === "B"
                                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${sec.id}`}
                              checked={questionFormData.correctAnswer === "B"}
                              onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: "B" })}
                              className="accent-emerald-600 h-4 w-4"
                            />
                            <span className="text-xs font-bold text-slate-500">B.</span>
                            <input
                              type="text"
                              placeholder="Option B text"
                              value={questionFormData.optionB}
                              onChange={(e) => setQuestionFormData({ ...questionFormData, optionB: e.target.value })}
                              className="w-full text-xs outline-none bg-transparent"
                            />
                          </div>

                          <div
                            className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                              questionFormData.correctAnswer === "C"
                                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${sec.id}`}
                              checked={questionFormData.correctAnswer === "C"}
                              onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: "C" })}
                              className="accent-emerald-600 h-4 w-4"
                            />
                            <span className="text-xs font-bold text-slate-500">C.</span>
                            <input
                              type="text"
                              placeholder="Option C text"
                              value={questionFormData.optionC}
                              onChange={(e) => setQuestionFormData({ ...questionFormData, optionC: e.target.value })}
                              className="w-full text-xs outline-none bg-transparent"
                            />
                          </div>

                          <div
                            className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                              questionFormData.correctAnswer === "D"
                                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${sec.id}`}
                              checked={questionFormData.correctAnswer === "D"}
                              onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: "D" })}
                              className="accent-emerald-600 h-4 w-4"
                            />
                            <span className="text-xs font-bold text-slate-500">D.</span>
                            <input
                              type="text"
                              placeholder="Option D text"
                              value={questionFormData.optionD}
                              onChange={(e) => setQuestionFormData({ ...questionFormData, optionD: e.target.value })}
                              className="w-full text-xs outline-none bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* TECHNICAL & LOGICAL TYPE: Solution / Evaluation Key Input */
                      <div>
                        <label className="block text-xs font-bold text-purple-900 mb-1">
                          Admin Reference Solution / Key (Visible to Admin only)
                        </label>
                        <textarea
                          rows={3}
                          value={questionFormData.referenceAnswer}
                          onChange={(e) => setQuestionFormData({ ...questionFormData, referenceAnswer: e.target.value })}
                          placeholder="Enter sample solution code, explanation, or expected logic output..."
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs bg-purple-50/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-mono"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveQuestion(sec.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition"
                      >
                        Save Question
                      </button>
                    </div>
                  </div>
                )}

                {/* Questions List */}
                <div className="p-4 space-y-2 bg-white">
                  {(!sec.questions || sec.questions.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-2">
                      No questions in this section yet. Click "+ Add Question" above.
                    </p>
                  )}

                  {sec.questions &&
                    sec.questions.map((q, qIdx) => {
                      const isMultipleChoice = (q.type || sec.type || "Multiple Choice") === "Multiple Choice";
                      return (
                        <div
                          key={q.id}
                          className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">Q{qIdx + 1}.</span>
                              <span className="text-sm font-semibold text-slate-900">
                                {q.text || q.question}
                              </span>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                  isMultipleChoice
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                    : "bg-purple-50 text-purple-700 border-purple-100"
                                }`}
                              >
                                {isMultipleChoice ? "Multiple Choice" : "Technical & Logical"}
                              </span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {q.points || 5} pts
                              </span>
                            </div>

                            {/* Admin View: Multiple Choice Options with Correct Answer indicated */}
                            {isMultipleChoice && q.options && q.options.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {q.options.map((opt) => {
                                  const isCorrect =
                                    q.correctAnswer === opt.id || q.correctAnswer === opt.text;
                                  return (
                                    <span
                                      key={opt.id}
                                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border ${
                                        isCorrect
                                          ? "bg-emerald-100/80 border-emerald-300 text-emerald-900 font-bold"
                                          : "bg-white border-slate-200 text-slate-600"
                                      }`}
                                    >
                                      <strong className="mr-1">{opt.id}:</strong> {opt.text}
                                      {isCorrect && " ✓ (Admin Solution)"}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            {/* Admin View: Technical & Logical reference answer key */}
                            {!isMultipleChoice && q.referenceAnswer && (
                              <div className="mt-1 p-2 rounded-lg bg-purple-50/60 border border-purple-100 text-xs">
                                <span className="font-bold text-purple-900 block">Admin Reference Solution Key:</span>
                                <code className="text-purple-800 font-mono text-[11px]">{q.referenceAnswer}</code>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditQuestion(sec, q)}
                              className="px-2 py-1 text-xs text-indigo-600 font-semibold hover:bg-indigo-50 rounded-md"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(sec.id, q.id)}
                              className="px-2 py-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Modal Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5"
          >
            {quizToEdit ? "Save Quiz Changes" : "Create Quiz & Save Questions"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuizModalForm;

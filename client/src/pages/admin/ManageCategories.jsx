import React, { useState, useEffect } from "react";
import DataTable from "../../components/admin/common/DataTable";
import Modal from "../../components/admin/common/Modal";
import { categoryApi } from "../../api/category.api";

const initialCategories = [
  { id: "c1", name: "Programming", quizCount: 1, level: "Beginner", status: "Active" },
  { id: "c2", name: "Frontend", quizCount: 1, level: "Intermediate", status: "Active" },
  { id: "c3", name: "Web Development", quizCount: 1, level: "Intermediate", status: "Active" },
  { id: "c4", name: "Database", quizCount: 0, level: "Advanced", status: "Active" },
];

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [status, setStatus] = useState("Active");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        const enriched = data.map((cat, idx) => ({
          ...cat,
          level: cat.level || (idx % 3 === 0 ? "Beginner" : idx % 3 === 1 ? "Intermediate" : "Advanced")
        }));
        setCategories(enriched);
      } else {
        setCategories(initialCategories);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories(initialCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setName("");
    setLevel("Beginner");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setLevel(cat.level || "Beginner");
    setStatus(cat.status);
    setIsModalOpen(true);
  };

  const handleLevelChange = async (id, newLevel) => {
    setCategories((prev) =>
      prev.map((c) => ((c._id || c.id) === id ? { ...c, level: newLevel } : c))
    );
    try {
      await categoryApi.updateCategory(id, { level: newLevel });
    } catch (err) {
      console.log("Updated level locally for", id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await categoryApi.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory._id || editingCategory.id, { name, level, status });
        setCategories((prev) =>
          prev.map((c) =>
            (c._id || c.id) === (editingCategory._id || editingCategory.id)
              ? { ...c, name, level, status }
              : c
          )
        );
      } else {
        await categoryApi.createCategory({ name, level, status });
        const newCat = { id: `c_${Date.now()}`, name, quizCount: 0, level, status };
        setCategories((prev) => [...prev, newCat]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save category", err);
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            (c._id || c.id) === (editingCategory._id || editingCategory.id)
              ? { ...c, name, level, status }
              : c
          )
        );
      } else {
        const newCat = { id: `c_${Date.now()}`, name, quizCount: 0, level, status };
        setCategories((prev) => [...prev, newCat]);
      }
      setIsModalOpen(false);
    }
  };

  const getLevelBadge = (lvl) => {
    switch (lvl) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-300 focus:ring-emerald-500/20";
      case "Intermediate":
        return "bg-amber-50 text-amber-700 border-amber-300 focus:ring-amber-500/20";
      case "Advanced":
        return "bg-rose-50 text-rose-700 border-rose-300 focus:ring-rose-500/20";
      default:
        return "bg-slate-50 text-slate-700 border-slate-300";
    }
  };

  const columns = [
    {
      header: "Category Name",
      key: "name",
      render: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    {
      header: "Difficulty Level",
      key: "level",
      render: (row) => {
        const currentLevel = row.level || "Beginner";
        const catId = row._id || row.id;
        return (
          <select
            value={currentLevel}
            onChange={(e) => handleLevelChange(catId, e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer outline-none transition focus:ring-2 ${getLevelBadge(
              currentLevel
            )}`}
          >
            <option value="Beginner">🌱 Beginner</option>
            <option value="Intermediate">⚡ Intermediate</option>
            <option value="Advanced">🔥 Advanced</option>
          </select>
        );
      },
    },
    { header: "Associated Quizzes", key: "quizCount" },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {row.status}
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
      key: "level",
      label: "Difficulty Level",
      options: [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Manage quiz topic categories and set difficulty levels (Beginner, Intermediate, Advanced) directly from the table dropdown.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchPlaceholder="Search categories..."
        filters={filters}
        actions={
          <button
            onClick={handleCreate}
            className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
          >
            <span>🏷️</span>
            <span>Add Category</span>
          </button>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Difficulty Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
              >
                <option value="Beginner">🌱 Beginner</option>
                <option value="Intermediate">⚡ Intermediate</option>
                <option value="Advanced">🔥 Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;

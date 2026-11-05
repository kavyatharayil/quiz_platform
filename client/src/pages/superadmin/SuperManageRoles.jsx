import React, { useState, useEffect } from "react";
import DataTable from "../../components/admin/common/DataTable";
import Modal from "../../components/admin/common/Modal";
import { roleApi } from "../../api/role.api";

const SuperManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    dashboard: "Assigned/operational data",
    users: "View/manage users",
    roles: "None",
    quizzes: "Create/Edit/Manage",
    questions: "Create/Edit/Manage",
    categories: "Manage",
    attempts: "View",
    results: "View",
    reports: "Quiz/user reports",
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleApi.getRoles();
      setRoles(data || []);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      dashboard: "Assigned/operational data",
      users: "View/manage users",
      roles: "None",
      quizzes: "Create/Edit/Manage",
      questions: "Create/Edit/Manage",
      categories: "Manage",
      attempts: "View",
      results: "View",
      reports: "Quiz/user reports",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      code: role.code,
      description: role.description,
      ...role.permissions,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const roleToDelete = roles.find((r) => (r._id || r.id) === id);
    if (roleToDelete?.isSystem) {
      alert("System roles (Super Admin, Admin, User) cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this custom role?")) {
      try {
        await roleApi.deleteRole(id);
        fetchRoles();
      } catch (err) {
        console.error("Failed to delete role", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        permissions: {
          dashboard: formData.dashboard,
          users: formData.users,
          roles: formData.roles,
          quizzes: formData.quizzes,
          questions: formData.questions,
          categories: formData.categories,
          attempts: formData.attempts,
          results: formData.results,
          reports: formData.reports,
        },
      };

      if (editingRole) {
        await roleApi.updateRole(editingRole._id || editingRole.id, payload);
      } else {
        await roleApi.createRole(payload);
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (err) {
      console.error("Failed to save role configuration", err);
      alert(err?.response?.data?.message || "Failed to save role");
    }
  };

  const columns = [
    {
      header: "Role Name",
      key: "name",
      render: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{row.name}</span>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              {row.code}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-sm">{row.description}</p>
        </div>
      ),
    },
    {
      header: "Users",
      key: "usersCount",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
          {row.usersCount || 0} Assigned
        </span>
      ),
    },
    {
      header: "Permissions Summary",
      key: "permissions",
      render: (row) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Roles:</span>
            <span className={`font-bold ${row.permissions?.roles === "Full control" ? "text-violet-600" : "text-slate-400"}`}>
              {row.permissions?.roles || "None"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Users:</span>
            <span className="text-slate-800 font-medium">{row.permissions?.users || "None"}</span>
          </div>
        </div>
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
            Configure
          </button>
          {!row.isSystem && (
            <button
              onClick={() => handleDelete(row._id || row.id)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading && roles.length === 0) {
    return <div className="p-6">Loading roles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Roles & Permissions Control
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Configure system access matrix, granular privileges, and administrative security roles.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        searchPlaceholder="Search roles..."
        actions={
          <button
            onClick={handleCreate}
            className="group flex items-center gap-2 rounded-xl bg-violet-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500"
          >
            <span>🛡️</span>
            <span>Create Custom Role</span>
          </button>
        }
      />

      {/* Role Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRole ? `Configure Role: ${editingRole.name}` : "Create New Role"}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Content Evaluator"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
                  disabled={editingRole?.isSystem}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Role Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. EVALUATOR"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
                  disabled={editingRole?.isSystem}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role responsibilities..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
                disabled={editingRole?.isSystem}
              />
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-700">
                Module Privilege Configuration
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Users Module</label>
                  <select
                    value={formData.users}
                    onChange={(e) => setFormData({ ...formData, users: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                    disabled={editingRole?.isSystem}
                  >
                    <option value="Create, edit, delete, activate/deactivate">Full Control</option>
                    <option value="View/manage users">Manage Only</option>
                    <option value="None">None (Restricted)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Roles & Permissions</label>
                  <select
                    value={formData.roles}
                    onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                    disabled={editingRole?.isSystem}
                  >
                    <option value="Full control">Full control</option>
                    <option value="None">None (Restricted)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Quizzes & Questions</label>
                  <select
                    value={formData.quizzes}
                    onChange={(e) => setFormData({ ...formData, quizzes: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                    disabled={editingRole?.isSystem}
                  >
                    <option value="Full control">Full control</option>
                    <option value="Create/Edit/Manage">Create/Edit/Manage</option>
                    <option value="Take quizzes">Take quizzes only</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Reports & Analytics</label>
                  <select
                    value={formData.reports}
                    onChange={(e) => setFormData({ ...formData, reports: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                    disabled={editingRole?.isSystem}
                  >
                    <option value="All reports">All system reports</option>
                    <option value="Quiz/user reports">Quiz/user reports</option>
                    <option value="Personal stats">Personal stats only</option>
                    <option value="None">None</option>
                  </select>
                </div>
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
              {!editingRole?.isSystem && (
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-md shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5"
                >
                  Save Configuration
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SuperManageRoles;

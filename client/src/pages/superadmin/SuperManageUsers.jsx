import React, { useState, useEffect } from "react";
import DataTable from "../../components/admin/common/DataTable";
import Modal from "../../components/admin/common/Modal";
import { userApi } from "../../api/user.api";

const SuperManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    status: "Active",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "USER",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || "USER",
      status: user.status || "Active",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${user.name}?`)) {
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== (user._id || user.id)));
    }
  };

  const toggleStatus = async (user) => {
    try {
      const newStatus = user.status === "Active" ? "Blocked" : "Active";
      await userApi.updateUserStatus(user._id || user.id, newStatus);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === (editingUser._id || editingUser.id)
            ? { ...u, ...formData }
            : u
        )
      );
    } else {
      const newUserObj = {
        _id: `usr_${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUserObj, ...prev]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "User Name",
      key: "name",
      render: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    { header: "Email Address", key: "email" },
    {
      header: "Role",
      key: "role",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            row.role === "SUPER_ADMIN" || row.role === "SUPERADMIN"
              ? "bg-violet-100 text-violet-800 border border-violet-200"
              : row.role === "ADMIN"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
              : "bg-sky-50 text-sky-700 border border-sky-200/80"
          }`}
        >
          {row.role === "SUPER_ADMIN" || row.role === "SUPERADMIN"
            ? "Super Admin"
            : row.role === "ADMIN"
            ? "Admin"
            : "User"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
              : "bg-rose-50 text-rose-700 border border-rose-200/80"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          {row.status}
        </span>
      ),
    },
    { 
      header: "Joined Date", 
      key: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: "Actions",
      render: (row) => {
        const currentUserRaw = localStorage.getItem("currentUser");
        let currentUserEmail = null;
        if (currentUserRaw) {
          try {
            currentUserEmail = JSON.parse(currentUserRaw).email;
          } catch (e) {}
        }
        
        if (row.email === currentUserEmail) {
          return <span className="text-xs text-slate-400 font-medium italic">Current User</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition hover:border-slate-300"
            >
              Edit
            </button>
            <button
              onClick={() => toggleStatus(row)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                row.status === "Active"
                  ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
              }`}
            >
              {row.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => handleDelete(row)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const filters = [
    {
      key: "role",
      label: "Role",
      options: [
        { label: "Super Admin", value: "SUPER_ADMIN" },
        { label: "Admin", value: "ADMIN" },
        { label: "User", value: "USER" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Blocked", value: "Blocked" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Super Admin User & Admin Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Create, edit, delete, assign roles, and activate/deactivate accounts across the entire platform.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        filters={filters}
        actions={
          <button
            onClick={handleCreate}
            className="group flex items-center gap-2 rounded-xl bg-violet-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500"
          >
            <span>👤</span>
            <span>Create User / Admin</span>
          </button>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit Account: ${editingUser.name}` : "Create New User / Admin"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Assign Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition font-medium"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition font-medium"
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked / Inactive</option>
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
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-md shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5"
            >
              Save Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SuperManageUsers;

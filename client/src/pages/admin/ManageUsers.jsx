import React, { useState, useEffect } from "react";
import DataTable from "../../components/admin/common/DataTable";
import { userApi } from "../../api/user.api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const toggleStatus = async (user) => {
    try {
      const newStatus = user.status === "Active" ? "Blocked" : "Active";
      await userApi.updateUserStatus(user._id || user.id, newStatus);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
    }
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
            row.role === "SUPER_ADMIN"
              ? "bg-violet-50 text-violet-700 border border-violet-200/80"
              : row.role === "ADMIN"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
              : "bg-sky-50 text-sky-700 border border-sky-200/80"
          }`}
        >
          {row.role === "SUPER_ADMIN" ? "Super Admin" : row.role === "ADMIN" ? "Admin" : "User"}
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
        
        if (row.role === "SUPER_ADMIN" || row.email === currentUserEmail) {
          return <span className="text-xs text-slate-400 font-medium italic">Not available</span>;
        }

        return (
          <button
            onClick={() => toggleStatus(row)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              row.status === "Active"
                ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
            }`}
          >
            {row.status === "Active" ? "Block User" : "Unblock User"}
          </button>
        );
      },
    },
  ];

  const filters = [
    {
      key: "role",
      label: "Role",
      options: [
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
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            View users, update roles, and manage access statuses.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        filters={filters}
      />
    </div>
  );
};

export default ManageUsers;


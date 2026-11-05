import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../../components/superadmin/SuperAdminSidebar";
import SuperAdminHeader from "../../components/superadmin/SuperAdminHeader";

const SuperAdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f8fc] text-slate-900 font-sans">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminHeader />
        <main className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;

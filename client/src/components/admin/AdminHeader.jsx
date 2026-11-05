import React from "react";

const AdminHeader = () => {
  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Admin Console
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs shadow-xs">
          <span className="w-6 h-6 rounded-lg bg-indigo-500 text-white font-black flex items-center justify-center text-xs shadow-sm shadow-indigo-500/20">
            A
          </span>
          <span>Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;


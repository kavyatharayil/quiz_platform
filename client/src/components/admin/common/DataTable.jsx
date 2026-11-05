import React, { useState } from "react";

const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = "Search...",
  filters = [],
  onSearchChange,
  onFilterChange,
  actions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    if (onSearchChange) onSearchChange(value);
  };

  const handleFilter = (filterKey, value) => {
    const updated = { ...selectedFilters, [filterKey]: value };
    setSelectedFilters(updated);
    setCurrentPage(1);
    if (onFilterChange) onFilterChange(updated);
  };

  // Client-side filtering logic
  const filteredData = data.filter((row) => {
    const matchesSearch = Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(selectedFilters).every(
      ([key, value]) => !value || row[key] === value
    );

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/50 space-y-5">
      {/* Controls Header: Search & Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
            />
          </div>

          {filters.map((filter) => (
            <select
              key={filter.key}
              value={selectedFilters[filter.key] || ""}
              onChange={(e) => handleFilter(filter.key, e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
            >
              <option value="">All {filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/60">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  className="px-4 py-3.5 uppercase text-[11px] font-bold tracking-wider text-slate-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-slate-50/70 transition-colors duration-150 text-slate-700 font-medium"
                >
                  {columns.map((col) => (
                    <td key={col.key || col.header} className="px-4 py-3.5">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-slate-400 font-medium text-sm"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;


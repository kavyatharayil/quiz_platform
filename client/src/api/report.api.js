import apiClient from "./apiClient";

export const reportApi = {
  getAdminReports: async () => {
    const response = await apiClient.get("/reports/admin");
    return response.data.data;
  },

  getSuperAdminReports: async (dateRange = "30") => {
    const response = await apiClient.get(`/reports/superadmin?dateRange=${dateRange}`);
    return response.data.data;
  },
};

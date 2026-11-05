import apiClient from "./apiClient";

export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data.data;
  },
};

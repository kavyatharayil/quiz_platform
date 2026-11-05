import apiClient from "./apiClient";

export const userApi = {
  getUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await apiClient.patch(`/users/${userId}/status`, { status });
    return response.data.data;
  },
};

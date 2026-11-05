import apiClient from "./apiClient";

export const roleApi = {
  getRoles: async () => {
    const response = await apiClient.get("/roles");
    return response.data.data;
  },

  createRole: async (roleData) => {
    const response = await apiClient.post("/roles", roleData);
    return response.data;
  },

  updateRole: async (id, roleData) => {
    const response = await apiClient.patch(`/roles/${id}`, roleData);
    return response.data;
  },

  deleteRole: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },
};

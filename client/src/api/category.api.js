import apiClient from "./apiClient";

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data.data;
  },

  createCategory: async (categoryData) => {
    const response = await apiClient.post("/categories", categoryData);
    return response.data.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
    return response.data.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

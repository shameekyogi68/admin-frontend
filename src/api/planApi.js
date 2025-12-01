// Plan API - Plan Management
import axiosInstance from './axiosInstance';

const planApi = {
  /**
   * Get all plans
   */
  async getAll() {
    try {
      const response = await axiosInstance.get('/plans/all');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Get plan by ID
   */
  async getById(id) {
    try {
      const response = await axiosInstance.get(`/plans/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Create new plan
   */
  async create(planData) {
    try {
      const response = await axiosInstance.post('/plans/add', planData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Update plan
   */
  async update(id, planData) {
    try {
      const response = await axiosInstance.put(`/plans/update/${id}`, planData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Delete plan
   */
  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/plans/delete/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default planApi;

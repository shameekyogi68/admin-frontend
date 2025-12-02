// Plan API - Plan Management
import axiosInstance from './axiosInstance';

const planApi = {
  /**
   * Get all plans
   */
  async getAll() {
    try {
      const response = await axiosInstance.get('/api/plans/all');
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
      const response = await axiosInstance.get(`/api/plans/${id}`);
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
      const response = await axiosInstance.post('/api/plans/add', planData);
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
      const response = await axiosInstance.put(`/api/plans/update/${id}`, planData);
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
      const response = await axiosInstance.delete(`/api/plans/delete/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default planApi;

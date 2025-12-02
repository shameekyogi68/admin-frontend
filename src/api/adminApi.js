// Admin API - Admin User Management
import axiosInstance from './axiosInstance';

const adminApi = {
  /**
   * Get all admins
   */
  async getAll() {
    try {
      const response = await axiosInstance.get('/api/admin/admins');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Create new admin
   */
  async create(adminData) {
    try {
      const response = await axiosInstance.post('/api/admin/admins', adminData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Update admin
   */
  async update(id, adminData) {
    try {
      const response = await axiosInstance.put(`/api/admin/admins/${id}`, adminData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Delete admin
   */
  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/api/admin/admins/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default adminApi;

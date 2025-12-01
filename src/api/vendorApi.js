// Vendor API - Vendor Management
import axiosInstance from './axiosInstance';

const vendorApi = {
  /**
   * Get all vendors with optional filters
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const queryString = params.toString();
      const url = queryString ? `/vendors/getall?${queryString}` : '/vendors/getall';
      
      const response = await axiosInstance.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Get vendor by ID
   */
  async getById(id) {
    try {
      const response = await axiosInstance.get(`/vendors/get/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Block/Unblock vendor
   */
  async toggleBlock(id, block) {
    try {
      const response = await axiosInstance.patch(`/vendors/${id}/block`, { block });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Delete vendor
   */
  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/vendors/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default vendorApi;

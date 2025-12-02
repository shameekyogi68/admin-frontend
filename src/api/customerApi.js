// Customer API - Customer Management
import axiosInstance from './axiosInstance';

const customerApi = {
  /**
   * Get all customers with optional filters
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.pack) params.append('pack', filters.pack);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);

      const queryString = params.toString();
      const url = queryString ? `/api/customers/getCustomers?${queryString}` : '/api/customers/getCustomers';
      
      const response = await axiosInstance.get(url);
      
      // Backend returns { data: [...], total: ... }, unwrap if needed
      const data = response.data?.data || response.data;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Get customer by ID
   */
  async getById(id) {
    try {
      const response = await axiosInstance.get(`/api/customers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Block customer
   */
  async block(id) {
    try {
      const response = await axiosInstance.patch(`/api/customers/${id}/block`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Unblock customer
   */
  async unblock(id) {
    try {
      const response = await axiosInstance.patch(`/api/customers/${id}/unblock`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default customerApi;

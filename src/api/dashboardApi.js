// Dashboard API - Dashboard Stats & Analytics
import axiosInstance from './axiosInstance';

const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    try {
      const response = await axiosInstance.get('/admin/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default dashboardApi;

// Auth API - Authentication & Authorization
import axiosInstance from './axiosInstance';

const authApi = {
  /**
   * Admin login
   */
  async login(email, password) {
    try {
      const response = await axiosInstance.post('/api/admin/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Admin registration
   */
  async register(adminData) {
    try {
      const response = await axiosInstance.post('/api/admin/register', adminData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Logout - Clear local storage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
  },

  /**
   * Get stored auth token
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Get stored admin data
   */
  getAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authApi;

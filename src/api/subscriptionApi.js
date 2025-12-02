// Subscription API - Subscription & Plan Management
import axiosInstance from './axiosInstance';

const subscriptionApi = {
  /**
   * Get subscription by user ID
   */
  async getByUserId(userId) {
    try {
      const response = await axiosInstance.get(`/api/subscriptions/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Get all subscriptions
   */
  async getAll() {
    try {
      const response = await axiosInstance.get('/api/subscriptions/all');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Create new subscription
   */
  async create(subscriptionData) {
    try {
      const response = await axiosInstance.post('/api/subscriptions/add', subscriptionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Update subscription
   */
  async update(id, subscriptionData) {
    try {
      const response = await axiosInstance.put(`/api/subscriptions/update/${id}`, subscriptionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default subscriptionApi;

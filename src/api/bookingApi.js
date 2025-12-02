// Booking API - Booking Management
import axiosInstance from './axiosInstance';

const bookingApi = {
  /**
   * Get all bookings
   */
  async getAll() {
    try {
      const response = await axiosInstance.get('/api/bookings/all');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Create new booking
   */
  async create(bookingData) {
    try {
      const response = await axiosInstance.post('/api/bookings/add', bookingData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default bookingApi;

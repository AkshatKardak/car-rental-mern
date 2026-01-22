import api from './api';

export const bookingService = {
  // Get user's bookings (Protected route)
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');

      return {
        success: true,
        data: response.data.data || response.data || []
      };
    } catch (error) {
      console.error('Get user bookings error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Create new booking (Protected route)
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Create booking error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  // Get booking by ID (Protected route)
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get booking error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  // Update booking (Admin/Manager only)
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, bookingData);

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Update booking error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  },

  // Cancel booking (typically updates status to 'Cancelled')
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status: 'Cancelled' });

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  // Delete booking (Admin only)
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Delete booking error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete booking');
    }
  },

  // Get all bookings (Admin/Manager only)
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');

      return {
        success: true,
        data: response.data.data || response.data || []
      };
    } catch (error) {
      console.error('Get all bookings error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch all bookings');
    }
  }
};

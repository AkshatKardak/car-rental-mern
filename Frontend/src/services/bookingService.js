import api from './api';

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get all user bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/user');
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, updateData) => {
    const response = await api.put(`/bookings/${id}`, updateData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Get booking details with car and user info
  getBookingDetails: async (id) => {
    const response = await api.get(`/bookings/${id}/details`);
    return response.data;
  },
};

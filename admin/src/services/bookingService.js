import adminApi from './adminApi';

export const bookingService = {
  // Get all bookings
  getAllBookings: async (filters = {}) => {
    const response = await adminApi.get('/bookings', { params: filters });
    return response.data;
  },

  // Get single booking
  getBookingById: async (id) => {
    const response = await adminApi.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, updateData) => {
    const response = await adminApi.put(`/bookings/${id}`, updateData);
    return response.data;
  },

  // Approve booking
  approveBooking: async (id) => {
    const response = await adminApi.put(`/bookings/${id}/approve`);
    return response.data;
  },

  // Reject booking
  rejectBooking: async (id, reason) => {
    const response = await adminApi.put(`/bookings/${id}/reject`, { reason });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await adminApi.delete(`/bookings/${id}`);
    return response.data;
  },
};

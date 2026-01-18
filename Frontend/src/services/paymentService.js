import api from './api';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    const response = await api.post('/payments/create-order', orderData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Get user payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  // Request refund
  requestRefund: async (paymentId, reason) => {
    const response = await api.post('/payments/refund', {
      paymentId,
      reason,
    });
    return response.data;
  },
};

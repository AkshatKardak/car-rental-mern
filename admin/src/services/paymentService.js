import adminApi from './adminApi';

export const paymentService = {
  // Get all payments
  getAllPayments: async (filters = {}) => {
    const response = await adminApi.get('/payments', { params: filters });
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await adminApi.get(`/payments/${id}`);
    return response.data;
  },

  // Process refund
  processRefund: async (paymentId, amount, reason) => {
    const response = await adminApi.post('/payments/refund', {
      paymentId,
      amount,
      reason,
    });
    return response.data;
  },

  // Get revenue report
  getRevenueReport: async (startDate, endDate) => {
    const response = await adminApi.get('/payments/revenue-report', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

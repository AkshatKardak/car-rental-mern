import adminApi from './adminApi';

export const statsService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await adminApi.get('/admin/stats/dashboard');
    return response.data;
  },

  // Get revenue statistics
  getRevenueStats: async (dateRange) => {
    const response = await adminApi.get('/admin/stats/revenue', {
      params: dateRange,
    });
    return response.data;
  },

  // Get fleet statistics
  getFleetStats: async () => {
    const response = await adminApi.get('/admin/stats/fleet');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 5) => {
    const response = await adminApi.get('/bookings', {
      params: { limit, sort: '-createdAt' },
    });
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (period = '30d') => {
    const response = await adminApi.get('/admin/analytics', {
      params: { period },
    });
    return response.data;
  },
};

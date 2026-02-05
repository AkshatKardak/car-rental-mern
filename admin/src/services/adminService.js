import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const adminService = {
  // ========================================
  // USER MANAGEMENT
  // ========================================
  getUsers: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error.response?.data || error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/users/${userId}/status`,
        { status },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw error.response?.data || error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error.response?.data || error;
    }
  },

  // ========================================
  // PAYMENT MANAGEMENT
  // ========================================
  getPayments: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/admin/payments`, {
        headers: getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Get payments error:', error);
      throw error.response?.data || error;
    }
  },

  updatePaymentStatus: async (bookingId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/payments/${bookingId}/status`,
        { status },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error.response?.data || error;
    }
  },

  // ========================================
  // PROMOTION MANAGEMENT
  // ========================================
  getPromotions: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/admin/promotions`, {
        headers: getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Get promotions error:', error);
      throw error.response?.data || error;
    }
  },

  createPromotion: async (promotionData) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/promotions`,
        promotionData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Create promotion error:', error);
      throw error.response?.data || error;
    }
  },

  updatePromotion: async (promotionId, promotionData) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/promotions/${promotionId}`,
        promotionData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Update promotion error:', error);
      throw error.response?.data || error;
    }
  },

  deletePromotion: async (promotionId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/promotions/${promotionId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Delete promotion error:', error);
      throw error.response?.data || error;
    }
  },

  togglePromotion: async (promotionId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/promotions/${promotionId}/toggle`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Toggle promotion error:', error);
      throw error.response?.data || error;
    }
  },

  // ========================================
  // DASHBOARD STATS
  // ========================================
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats/dashboard`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error.response?.data || error;
    }
  },

  getRecentActivity: async (limit = 5) => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats/recent-activity`, {
        headers: getAuthHeader(),
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get recent activity error:', error);
      throw error.response?.data || error;
    }
  },

  getRevenueAnalytics: async (period = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats/revenue-analytics`, {
        headers: getAuthHeader(),
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      throw error.response?.data || error;
    }
  }
};

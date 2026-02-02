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
  // Get all users
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

  // Get all payments
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

  // Get all promotions
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

  // Get dashboard stats
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
  }
};

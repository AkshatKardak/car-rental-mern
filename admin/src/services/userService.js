import adminApi from './adminApi';

export const userService = {
  // Get all users
  getAllUsers: async (filters = {}) => {
    const response = await adminApi.get('/users', { params: filters });
    return response.data;
  },

  // Get single user
  getUserById: async (id) => {
    const response = await adminApi.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await adminApi.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await adminApi.delete(`/users/${id}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const response = await adminApi.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Block/Unblock user
  toggleUserStatus: async (id) => {
    const response = await adminApi.put(`/users/${id}/toggle-status`);
    return response.data;
  },
};

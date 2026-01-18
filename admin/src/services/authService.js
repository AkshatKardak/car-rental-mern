import adminApi from './adminApi';

export const authService = {
  // Admin login
  login: async (email, password) => {
    const response = await adminApi.post('/auth/login', { email, password });
    if (response.data.token && response.data.user.role === 'admin') {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      return response.data;
    } else {
      throw new Error('Unauthorized: Admin access required');
    }
  },

  // Admin logout
  logout: async () => {
    try {
      await adminApi.post('/auth/logout');
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Get admin user
  getAdminUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },
};

import adminApi from './adminApi';

export const damageService = {
  // Get all damage reports (Admin: pending, User: own)
  getAllReports: async (filters = {}) => {
    const response = await adminApi.get('/damages', { params: filters });
    return response.data;
  },

  // Get pending reports for admin dashboard
  getPendingReports: async () => {
    const response = await adminApi.get('/damages/admin/pending');
    return response.data;
  },

  // Get single damage report
  getReportById: async (id) => {
    const response = await adminApi.get(`/damages/${id}`);
    return response.data;
  },

  // Create damage report
  createReport: async (reportData) => {
    const formData = new FormData();

    Object.keys(reportData).forEach(key => {
      if (key === 'images') {
        reportData[key].forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, reportData[key]);
      }
    });

    const response = await adminApi.post('/damages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update damage report
  updateReport: async (id, reportData) => {
    const response = await adminApi.put(`/damages/${id}`, reportData);
    return response.data;
  },

  // Approve damage report
  approveReport: async (id, data) => {
    const response = await adminApi.put(`/damages/${id}/approve`, data);
    return response.data;
  },

  // Reject damage report
  rejectReport: async (id, data) => {
    const response = await adminApi.put(`/damages/${id}/reject`, data);
    return response.data;
  },

  // Set under review
  setUnderReview: async (id) => {
    const response = await adminApi.put(`/damages/${id}/review`, {});
    return response.data;
  },

  // Delete damage report
  deleteReport: async (id) => {
    const response = await adminApi.delete(`/damages/${id}`);
    return response.data;
  },

  // Get car damage statistics
  getCarDamageStats: async (carId) => {
    const response = await adminApi.get(`/damages/car/${carId}/stats`);
    return response.data;
  },

  // Get admin stats
  getAdminStats: async () => {
    const response = await adminApi.get('/damages/admin/stats');
    return response.data;
  }
};

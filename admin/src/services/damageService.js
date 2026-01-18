import adminApi from './adminApi';

export const damageService = {
  // Get all damage reports
  getAllReports: async (filters = {}) => {
    const response = await adminApi.get('/damage-reports', { params: filters });
    return response.data;
  },

  // Get single damage report
  getReportById: async (id) => {
    const response = await adminApi.get(`/damage-reports/${id}`);
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

    const response = await adminApi.post('/damage-reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update damage report
  updateReport: async (id, reportData) => {
    const response = await adminApi.put(`/damage-reports/${id}`, reportData);
    return response.data;
  },

  // Delete damage report
  deleteReport: async (id) => {
    const response = await adminApi.delete(`/damage-reports/${id}`);
    return response.data;
  },

  // Get car damage statistics
  getCarDamageStats: async (carId) => {
    const response = await adminApi.get(`/damage-reports/car/${carId}/stats`);
    return response.data;
  },
};

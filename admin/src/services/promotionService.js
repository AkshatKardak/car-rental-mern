import adminApi from './adminApi';

export const promotionService = {
  // Get all promotions
  getAllPromotions: async (filters = {}) => {
    const response = await adminApi.get('/promotions', { params: filters });
    return response.data;
  },

  // Get single promotion
  getPromotionById: async (id) => {
    const response = await adminApi.get(`/promotions/${id}`);
    return response.data;
  },

  // Create promotion
  createPromotion: async (promotionData) => {
    const response = await adminApi.post('/promotions', promotionData);
    return response.data;
  },

  // Update promotion
  updatePromotion: async (id, promotionData) => {
    const response = await adminApi.put(`/promotions/${id}`, promotionData);
    return response.data;
  },

  // Delete promotion
  deletePromotion: async (id) => {
    const response = await adminApi.delete(`/promotions/${id}`);
    return response.data;
  },

  // Get promotion statistics
  getPromotionStats: async (id) => {
    const response = await adminApi.get(`/promotions/${id}/stats`);
    return response.data;
  },
};

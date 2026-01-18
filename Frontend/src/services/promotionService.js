import api from './api';

export const promotionService = {
  // Get all active promotions
  getAllPromotions: async () => {
    const response = await api.get('/promotions?active=true');
    return response.data;
  },

  // Get promotion by code
  getPromotionByCode: async (code) => {
    const response = await api.get(`/promotions/${code}`);
    return response.data;
  },

  // Validate promotion code
  validatePromoCode: async (code, vehicleId, bookingAmount) => {
    const response = await api.post('/promotions/validate', {
      code,
      vehicleId,
      bookingAmount,
    });
    return response.data;
  },
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true
  };
};

/**
 * Get all active promotions
 */
const getAllPromotions = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/promotions`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

/**
 * Validate a promo code
 */
const validatePromoCode = async (code) => {
  try {
    const response = await axios.post(
      `${API_URL}/promotions/validate`,
      { code },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error validating promo code:', error);
    throw error;
  }
};

/**
 * Get promotion by ID
 */
const getPromotionById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/promotions/${id}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
};

export const promotionService = {
  getAllPromotions,
  validatePromoCode,
  getPromotionById
};

export default promotionService;

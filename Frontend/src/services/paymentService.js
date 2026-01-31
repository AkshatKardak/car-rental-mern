import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

// Configure axios with auth token
const getAxiosConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true
  };
};

/**
 * Create Razorpay Order
 */
const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/process`, 
      orderData,
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Verify Payment
 */
const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/verify`, 
      paymentData,
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Create QR Payment Order
 */
const createQRPayment = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/create-qr-payment`, 
      data,
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating QR payment:', error);
    throw error;
  }
};

/**
 * Get Payment History
 */
const getPaymentHistory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/payments/history`,
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

export const paymentService = {
  createOrder,
  verifyPayment,
  createQRPayment,
  getPaymentHistory
};

export default paymentService;

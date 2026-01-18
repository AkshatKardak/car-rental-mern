import api from './api';

export const carService = {
  // Get all cars with filters
  getAllCars: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.transmission) params.append('transmission', filters.transmission);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.seats) params.append('seats', filters.seats);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const response = await api.get(`/cars?${params.toString()}`);
    return response.data;
  },

  // Get single car by ID
  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  // Search cars
  searchCars: async (query) => {
    const response = await api.get(`/cars?search=${query}`);
    return response.data;
  },

  // Get available cars for date range
  getAvailableCars: async (startDate, endDate) => {
    const response = await api.get('/cars', {
      params: { startDate, endDate, status: 'Available' }
    });
    return response.data;
  },
};

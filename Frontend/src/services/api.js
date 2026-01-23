import axios from 'axios';

// USE 127.0.0.1 TO AVOID LOCALHOST ISSUES
const API_BASE_URL = 'http://127.0.0.1:5005/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ... keep your interceptors as they are ...
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

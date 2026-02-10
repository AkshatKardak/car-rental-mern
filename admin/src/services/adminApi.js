import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rentridebackend-seven.vercel.app/api'

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})


adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors gracefully
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    
    console.error(`❌ API Error [${status}]:`, url)
    
    
    if (status === 404) {
      console.warn('⚠️ Endpoint not found:', url)
    } else if (status === 401) {
      console.warn('⚠️ Unauthorized request:', url)
      
    } else if (status === 500) {
      console.error('⚠️ Server error:', url)
    }
    
    return Promise.reject(error)
  }
)

export default adminApi

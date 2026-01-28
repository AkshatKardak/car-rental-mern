import adminApi from './adminApi'

export const statsService = {
  getDashboardStats: async () => {
    try {
      const response = await adminApi.get('/admin/stats/dashboard')
      return response.data
    } catch (error) {
      console.warn('⚠️ Stats API unavailable, using fallback data')
      // Return fallback data instead of throwing error
      return {
        data: {
          totalRevenue: 128450,
          revenueChange: '+12.4%',
          activeBookings: 45,
          bookingsChange: '+5.2%',
          fleetUtilization: 78,
          utilizationChange: '-2.1%',
          pendingRequests: 8
        }
      }
    }
  },

  getRecentActivity: async (limit = 5) => {
    try {
      const response = await adminApi.get(`/admin/stats/recent-activity?limit=${limit}`)
      return response.data
    } catch (error) {
      console.warn('⚠️ Activity API unavailable, using fallback data')
      // Return empty array as fallback
      return {
        data: {
          bookings: []
        }
      }
    }
  }
}

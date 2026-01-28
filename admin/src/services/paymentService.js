// Payment Event Service for Real-time Updates
class PaymentEventService {
  constructor() {
    this.listeners = new Set()
  }

  // Subscribe to payment events
  subscribe(callback) {
    this.listeners.add(callback)
    console.log('📡 New subscriber added. Total listeners:', this.listeners.size)
    return () => {
      this.listeners.delete(callback)
      console.log('📡 Subscriber removed. Total listeners:', this.listeners.size)
    }
  }

  // Notify all subscribers when payment occurs
  notifyPaymentReceived(paymentData) {
    console.log('💰 Payment Event Triggered:', paymentData)
    this.listeners.forEach(callback => {
      try {
        callback({
          type: 'PAYMENT_RECEIVED',
          data: paymentData,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error notifying subscriber:', error)
      }
    })
  }

  // Notify settlement update
  notifySettlementUpdate(settlementData) {
    console.log('🔄 Settlement Update Triggered:', settlementData)
    this.listeners.forEach(callback => {
      try {
        callback({
          type: 'SETTLEMENT_UPDATE',
          data: settlementData,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error notifying subscriber:', error)
      }
    })
  }

  // Notify booking status change
  notifyBookingUpdate(bookingData) {
    console.log('📋 Booking Update Triggered:', bookingData)
    this.listeners.forEach(callback => {
      try {
        callback({
          type: 'BOOKING_UPDATE',
          data: bookingData,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error notifying subscriber:', error)
      }
    })
  }
}

export const paymentEventService = new PaymentEventService()

// For testing in console
if (typeof window !== 'undefined') {
  window.paymentEventService = paymentEventService
}

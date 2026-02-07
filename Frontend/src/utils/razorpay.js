// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initRazorpayPayment = (order, bookingDetails, onSuccess, onFailure) => {
  return new Promise((resolve, reject) => {
    // Get Razorpay key from environment variable
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_key';

    if (!razorpayKey || razorpayKey === 'rzp_test_demo_key') {
      console.warn('⚠️ Using demo Razorpay key. Add VITE_RAZORPAY_KEY_ID to your .env file');
    }

    const options = {
      key: razorpayKey, // ← This is the missing key!
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'FTS Car Rental',
      description: bookingDetails.description || 'Car Rental Payment',
      order_id: order.id,
      image: '/logo.png', // Your company logo
      prefill: {
        name: bookingDetails.name || '',
        email: bookingDetails.email || '',
        contact: bookingDetails.contact || ''
      },
      notes: {
        booking_id: bookingDetails.bookingId || '',
        car_name: bookingDetails.name || ''
      },
      theme: {
        color: '#10b981' // Green color matching your theme
      },
      handler: function (response) {
        console.log('✅ Payment successful:', response);
        if (onSuccess) {
          onSuccess(response);
        }
        resolve(response);
      },
      modal: {
        ondismiss: function () {
          console.log('❌ Payment cancelled by user');
          const error = new Error('Payment cancelled by user');
          if (onFailure) {
            onFailure(error);
          }
          reject(error);
        },
        escape: true,
        backdropclose: false
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        const error = new Error(response.error.description || 'Payment failed');
        if (onFailure) {
          onFailure(error);
        }
        reject(error);
      });
      paymentObject.open();
    } catch (error) {
      console.error('❌ Razorpay initialization error:', error);
      if (onFailure) {
        onFailure(error);
      }
      reject(error);
    }
  });
};

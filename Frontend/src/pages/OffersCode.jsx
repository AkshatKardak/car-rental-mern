import { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiTag, FiPercent, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { promotionService } from '../services/promotionService';

const OffersCode = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getAllPromotions();
      
      if (response.success && response.data.length > 0) {
        setPromotions(response.data);
      } else {
        setPromotions(getFallbackPromotions());
        toast.error('Using fallback promotions. Database might be empty.');
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      setPromotions(getFallbackPromotions());
      toast.error('Failed to load promotions from server. Using fallback data.');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPromotions = () => [
    {
      code: 'WELCOME50',
      name: 'Welcome Bonus',
      description: 'Flat ₹50 off on your first booking',
      type: 'fixed',
      value: 50,
      maxDiscount: 50,
      minBookingAmount: 500,
    },
    {
      code: 'WEEKEND20',
      name: 'Weekend Special',
      description: '20% off on weekend bookings',
      type: 'percentage',
      value: 20,
      maxDiscount: 500,
      minBookingAmount: 1000,
    },
    {
      code: 'LUXURY1000',
      name: 'Luxury Special',
      description: 'Flat ₹1000 off on luxury car rentals',
      type: 'fixed',
      value: 1000,
      maxDiscount: 1000,
      minBookingAmount: 5000,
    },
    {
      code: 'LONGTERM30',
      name: 'Long Term Deal',
      description: '30% off on bookings above 7 days',
      type: 'percentage',
      value: 30,
      maxDiscount: 2000,
      minBookingAmount: 10000,
    },
    {
      code: 'FLASH500',
      name: 'Flash Sale',
      description: 'Limited time ₹500 instant discount',
      type: 'fixed',
      value: 500,
      maxDiscount: 500,
      minBookingAmount: 3000,
    },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied to clipboard!`);
    
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyCode = (promo) => {
    localStorage.setItem('appliedPromoCode', JSON.stringify({
      code: promo.code,
      name: promo.name || promo.code,
      type: promo.type,
      value: promo.value,
      maxDiscount: promo.maxDiscount,
      minBookingAmount: promo.minBookingAmount,
      description: promo.description
    }));
    
    toast.success(`Promo "${promo.code}" applied! Redirecting to booking...`, {
      duration: 2000,
    });
    
    setTimeout(() => {
      window.location.href = '/browsecars';
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Exclusive Offers & Promo Codes
          </h1>
          <p className="text-lg text-gray-600">
            Save big on your next car rental! Apply these codes at checkout.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.code || Math.random()}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500"
            >
              {/* Card Header - GREEN GRADIENT */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {promo.type === 'percentage' ? (
                      <FiPercent className="text-2xl" />
                    ) : (
                      <FiDollarSign className="text-2xl" />
                    )}
                    <h3 className="text-2xl font-bold">{promo.code || 'PROMO'}</h3>
                  </div>
                  <FiTag className="text-3xl opacity-50" />
                </div>
                <p className="text-green-100 text-sm font-semibold">
                  {promo.name || 'Special Offer'}
                </p>
                <p className="text-green-50 text-xs mt-1">
                  {promo.type === 'percentage'
                    ? `${promo.value || 0}% OFF`
                    : `₹${(promo.value || 0).toLocaleString()} OFF`}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-700 mb-4 min-h-[60px]">
                  {promo.description || 'Limited time offer - save on your booking!'}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Max Discount:</span>
                    <span className="font-semibold text-green-600">
                      ₹{(promo.maxDiscount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Booking:</span>
                    <span className="font-semibold">
                      ₹{(promo.minBookingAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <FiCheck className="text-green-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleApplyCode(promo)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Promotions Message */}
        {promotions.length === 0 && (
          <div className="text-center py-12">
            <FiTag className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No active promotions available
            </h3>
            <p className="text-gray-500">Check back later for new offers!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersCode;

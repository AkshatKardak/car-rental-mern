import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/DashboardNavbar';
import { promotionService } from '../services/promotionService';
import { Tag, Clock, ChevronRight, Copy, CheckCircle2, AlertCircle, History } from 'lucide-react';

const Offers = () => {
  const navigate = useNavigate();

  // State for promotions from API
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [promoCode, setPromoCode] = useState('');
  const [showToast, setShowToast] = useState(false);

  // For promo validation
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [bookingAmount, setBookingAmount] = useState(0);

  // Dummy offers data as fallback
  const dummyOffers = [
    {
      id: 1,
      title: 'Weekend Special',
      description: 'Save on weekend rentals for your next getaway',
      discount: '25%',
      code: 'WEEKEND25',
      category: 'weekend',
      badge: 'Hot',
      badgeColor: 'primary',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80'
    },
    {
      id: 2,
      title: 'Long-term Discount',
      description: 'Book for 7+ days and save big',
      discount: '30%',
      code: 'LONGTERM30',
      category: 'longterm',
      badge: 'Best Value',
      badgeColor: 'blue',
      image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80'
    },
    {
      id: 3,
      title: 'Luxury Experience',
      description: 'Exclusive discount for premium car models',
      discount: '₹500',
      code: 'LUXURY500',
      category: 'luxury',
      badge: null,
      badgeColor: null,
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80'
    },
    {
      id: 4,
      title: 'Flash Sale',
      description: 'Limited time offer, book before it expires',
      discount: '40%',
      code: 'FLASH40',
      category: 'flash',
      badge: 'Ending Soon',
      badgeColor: 'red',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
    },
  ];

  // Fetch promotions on mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionService.getAllPromotions();

      if (response.success && response.data) {
        const mappedPromotions = response.data.map((promo) => ({
          id: promo._id,
          title: promo.name || 'Special Offer',
          description: promo.description || 'Limited time discount',
          discount: promo.discountType === 'percentage'
            ? `${promo.discountValue}%`
            : `₹${promo.discountValue}`,
          code: promo.code,
          category: promo.category || 'all',
          badge: promo.featured ? 'Featured' : null,
          badgeColor: 'primary',
          image: promo.imageUrl || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
          validUntil: promo.validUntil,
          minBookingAmount: promo.minBookingAmount,
        }));

        setPromotions(mappedPromotions);
      } else {
        setPromotions(dummyOffers);
      }
    } catch (err) {
      console.error('Failed to fetch promotions:', err);
      setError(err.message || 'Failed to load promotions');
      setPromotions(dummyOffers);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }

    const code = promoCode.trim().toUpperCase();

    if (selectedCarId && bookingAmount) {
      try {
        const response = await promotionService.validatePromoCode(
          code,
          selectedCarId,
          bookingAmount
        );

        if (response.success) {
          alert(`Promo applied! You saved ₹${response.data.discount}`);
          navigate('/payment', {
            state: {
              promoCode: code,
              promoDiscount: response.data.discount,
            },
          });
        }
      } catch (error) {
        console.error('Promo validation error:', error);
        alert(error.response?.data?.message || 'Invalid or expired promo code');
      }
    } else {
      alert(`Promo code "${code}" will be applied at checkout!`);
      setPromoCode('');
    }
  };

  const offers = promotions.length > 0 ? promotions : dummyOffers;

  const filteredOffers = selectedFilter === 'all'
    ? offers
    : offers.filter(offer => offer.category === selectedFilter);

  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-text-primary">
              Exclusive <span className="text-primary italic">Deals</span> <br /> & Corporate Rewards
            </h1>
            <p className="text-text-secondary text-lg max-w-lg">
              Unlock premium savings for your next journey. Whether it's a weekend getaway or a long-term rental, we've got you covered.
            </p>
          </div>

          <button
            onClick={() => navigate('/mybookings')}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-border-light text-sm font-bold text-text-primary hover:bg-gray-50 hover:border-primary/30 transition-all shadow-sm group"
          >
            <History className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            Booking History
          </button>
        </motion.div>

        {/* Promo Code Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 mb-12 relative overflow-hidden bg-white border border-border-light shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 justify-between">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-3">
                <Tag className="w-3 h-3" />
                Voucher Program
              </div>
              <h2 className="text-3xl font-black mb-2 text-text-primary">Have a secret code?</h2>
              <p className="text-text-secondary font-medium">Redeem your corporate discount or gift voucher here.</p>
            </div>

            <div className="flex w-full max-w-md bg-background-secondary border border-border-light rounded-2xl p-1.5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner">
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-6 text-text-primary font-bold placeholder:text-text-secondary/40 text-lg"
                placeholder="PROMO CODE"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <button
                onClick={handleApplyPromo}
                className="px-10 py-4 rounded-xl font-black text-white text-sm uppercase tracking-widest transition-all bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20"
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar"
          >
            {['all', 'weekend', 'longterm', 'luxury', 'flash'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-8 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all border shadow-sm ${selectedFilter === filter
                    ? 'bg-primary text-white border-primary shadow-primary/20 scale-105'
                    : 'bg-white border-border-light text-text-secondary hover:border-primary/30 hover:text-text-primary hover:bg-gray-50'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace('term', '-Term')}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6"></div>
            <p className="text-text-secondary font-bold text-lg animate-pulse">Fetching the best deals for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-3xl p-12 text-center mb-12 bg-white border border-red-100 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-text-primary font-black text-xl mb-2">Something went wrong</p>
            <p className="text-text-secondary text-sm mb-8">{error}</p>
            <button
              onClick={fetchPromotions}
              className="px-10 py-3 rounded-2xl bg-primary text-white font-black hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Offer Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-border-light hover:border-primary/50 transition-all group relative flex flex-col shadow-xl hover:shadow-2xl hover:-translate-y-2 duration-300"
                >
                  {/* Image Header with Gradient */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 z-10"></div>
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={offer.image}
                      alt={offer.title}
                    />

                    {offer.badge && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                          {offer.badge}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-6 z-20 text-right">
                      <p className="text-4xl font-black text-primary drop-shadow-sm">{offer.discount}</p>
                      <p className="text-[10px] font-black text-text-primary/60 uppercase tracking-widest">Off Total Bill</p>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black mb-2 text-text-primary group-hover:text-primary transition-colors">{offer.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">{offer.description}</p>

                    <div className="mt-auto space-y-4">
                      {offer.minBookingAmount > 0 && (
                        <div className="flex items-center gap-2 text-text-secondary/60 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Min. booking of ₹{offer.minBookingAmount}
                        </div>
                      )}

                      {/* Promo Code Box */}
                      <div className="bg-background-secondary border border-border-light rounded-2xl p-5 flex items-center justify-between group/code transition-colors hover:border-primary/30 shadow-inner">
                        <div>
                          <p className="text-[9px] uppercase text-text-secondary font-black tracking-widest mb-1 opacity-60">Promo Code</p>
                          <p className="font-mono text-xl font-bold text-text-primary tracking-[0.2em]">{offer.code}</p>
                        </div>
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="w-12 h-12 rounded-xl bg-white border border-border-light flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-90"
                          title="Copy code"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer info */}
        <section className="mt-24 border-t border-border-light pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <p className="text-text-secondary text-sm font-bold italic">Corporate Reward Program 2024</p>
          </div>
          <div className="flex gap-8 text-sm font-black text-text-secondary uppercase tracking-widest">
            <a className="hover:text-primary cursor-pointer transition-colors">Safety</a>
            <a className="hover:text-primary cursor-pointer transition-colors">Returns</a>
            <a className="hover:text-primary cursor-pointer transition-colors">Privacy</a>
          </div>
        </section>
      </main>

      {/* Copy Notification Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 inset-x-0 flex justify-center z-[100] px-4"
          >
            <div className="bg-text-primary text-white rounded-2xl px-8 py-4 flex items-center gap-4 shadow-2xl">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <p className="font-bold">Promo code successfully copied!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Offers;

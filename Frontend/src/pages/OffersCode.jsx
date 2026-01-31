import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { promotionService } from '../services/promotionService';
import { Tag, Clock, ChevronRight, Copy, CheckCircle2, AlertCircle, History } from 'lucide-react';

const Offers = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

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

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8f9fa',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
  };

  // Category mapping helper
  const getCategoryFromPromo = (promo) => {
    const code = promo.code?.toUpperCase() || '';
    const name = promo.name?.toLowerCase() || '';
    const desc = promo.description?.toLowerCase() || '';

    // Check code patterns
    if (code.includes('WEEKEND')) return 'weekend';
    if (code.includes('LONG')) return 'longterm';
    if (code.includes('LUXURY')) return 'luxury';
    if (code.includes('FLASH')) return 'flash';
    if (code.includes('FIRST') || code.includes('NEW')) return 'weekend';

    // Check name patterns
    if (name.includes('weekend')) return 'weekend';
    if (name.includes('long') || name.includes('term')) return 'longterm';
    if (name.includes('luxury') || name.includes('premium')) return 'luxury';
    if (name.includes('flash') || name.includes('sale')) return 'flash';

    // Check description patterns
    if (desc.includes('weekend')) return 'weekend';
    if (desc.includes('7+ days') || desc.includes('long')) return 'longterm';
    if (desc.includes('luxury') || desc.includes('premium')) return 'luxury';
    if (desc.includes('limited') || desc.includes('flash')) return 'flash';

    return 'all';
  };

  // Get badge info based on category and discount
  const getBadgeInfo = (promo, category) => {
    const discountValue = promo.type === 'percentage' ? promo.value : 0;
    
    if (category === 'flash') return { badge: 'Ending Soon', color: 'red' };
    if (category === 'luxury') return { badge: 'Premium', color: 'purple' };
    if (discountValue >= 30) return { badge: 'Hot Deal', color: 'primary' };
    if (category === 'longterm') return { badge: 'Best Value', color: 'blue' };
    if (category === 'weekend') return { badge: 'Weekend Only', color: 'green' };
    
    return { badge: null, color: null };
  };

  // Category images
  const categoryImages = {
    weekend: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    longterm: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80',
    luxury: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
    flash: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    all: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'
  };

  // Fetch promotions on mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionService.getAllPromotions();

      if (response.success && response.data && response.data.length > 0) {
        const mappedPromotions = response.data.map((promo) => {
          const category = getCategoryFromPromo(promo);
          const badgeInfo = getBadgeInfo(promo, category);
          
          return {
            id: promo._id,
            title: promo.name || 'Special Offer',
            description: promo.description || 'Limited time discount',
            discount: promo.type === 'percentage'
              ? `${promo.value}%`
              : `₹${promo.value}`,
            code: promo.code,
            category: category,
            badge: badgeInfo.badge,
            badgeColor: badgeInfo.color,
            image: categoryImages[category] || categoryImages.all,
            validTo: promo.validTo,
            minBookingAmount: promo.minBookingAmount || 0,
            discountType: promo.type,
            discountValue: promo.value
          };
        });

        setPromotions(mappedPromotions);
      } else {
        setError('No promotions available');
      }
    } catch (err) {
      console.error('Failed to fetch promotions:', err);
      setError(err.message || 'Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setPromoCode(code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }

    const code = promoCode.trim().toUpperCase();

    // Navigate to browse cars with promo code
    navigate('/cars', {
      state: {
        promoCode: code
      }
    });
  };

  const filteredOffers = selectedFilter === 'all'
    ? promotions
    : promotions.filter(offer => offer.category === selectedFilter);

  return (
    <div 
      className="min-h-screen pt-20 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight" style={{ color: theme.text }}>
              Exclusive <span className="text-green-500 italic">Deals</span> <br /> & Corporate Rewards
            </h1>
            <p className="text-lg max-w-lg" style={{ color: theme.textSecondary }}>
              Unlock premium savings for your next journey. Whether it's a weekend getaway or a long-term rental, we've got you covered.
            </p>
          </div>

          <button
            onClick={() => navigate('/mybookings')}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl border text-sm font-bold hover:bg-opacity-50 transition-all shadow-sm group"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.text
            }}
          >
            <History className="w-5 h-5 text-green-500 group-hover:rotate-12 transition-transform" />
            Booking History
          </button>
        </motion.div>

        {/* Promo Code Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 mb-12 relative overflow-hidden border shadow-xl"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 justify-between">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest mb-3">
                <Tag className="w-3 h-3" />
                Voucher Program
              </div>
              <h2 className="text-3xl font-black mb-2" style={{ color: theme.text }}>
                Have a secret code?
              </h2>
              <p className="font-medium" style={{ color: theme.textSecondary }}>
                Redeem your corporate discount or gift voucher here.
              </p>
            </div>

            <div 
              className="flex w-full max-w-md border rounded-2xl p-1.5 focus-within:border-green-500/50 focus-within:ring-4 focus-within:ring-green-500/5 transition-all shadow-inner"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.border
              }}
            >
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-6 font-bold text-lg"
                style={{ color: theme.text }}
                placeholder="PROMO CODE"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <button
                onClick={handleApplyPromo}
                className="px-10 py-4 rounded-xl font-black text-white text-sm uppercase tracking-widest transition-all bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        {!loading && promotions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar"
          >
            {[
              { key: 'all', label: 'All Offers', count: promotions.length },
              { key: 'weekend', label: 'Weekend', count: promotions.filter(p => p.category === 'weekend').length },
              { key: 'longterm', label: 'Long-Term', count: promotions.filter(p => p.category === 'longterm').length },
              { key: 'luxury', label: 'Luxury', count: promotions.filter(p => p.category === 'luxury').length },
              { key: 'flash', label: 'Flash Sale', count: promotions.filter(p => p.category === 'flash').length },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-8 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all border shadow-sm relative ${
                  selectedFilter === filter.key
                    ? 'bg-green-500 text-white border-green-500 shadow-green-500/20 scale-105'
                    : 'border-opacity-50 hover:border-green-500/30 hover:bg-opacity-50'
                }`}
                style={
                  selectedFilter !== filter.key
                    ? {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.border,
                        color: theme.textSecondary,
                      }
                    : {}
                }
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedFilter === filter.key
                      ? 'bg-white/20'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-green-500/10 border-t-green-500 rounded-full animate-spin mb-6"></div>
            <p className="font-bold text-lg animate-pulse" style={{ color: theme.textSecondary }}>
              Fetching the best deals for you...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div 
            className="rounded-3xl p-12 text-center mb-12 border shadow-sm"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="font-black text-xl mb-2" style={{ color: theme.text }}>
              Something went wrong
            </p>
            <p className="text-sm mb-8" style={{ color: theme.textSecondary }}>
              {error}
            </p>
            <button
              onClick={fetchPromotions}
              className="px-10 py-3 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State for filtered results */}
        {!loading && !error && filteredOffers.length === 0 && (
          <div 
            className="rounded-3xl p-12 text-center border shadow-sm"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: theme.textSecondary }} />
            <p className="font-black text-xl mb-2" style={{ color: theme.text }}>
              No offers in this category
            </p>
            <p className="text-sm mb-8" style={{ color: theme.textSecondary }}>
              Try selecting a different filter or check back later for new deals.
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="px-10 py-3 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
            >
              View All Offers
            </button>
          </div>
        )}

        {/* Offer Cards Grid */}
        {!loading && filteredOffers.length > 0 && (
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
                  className="rounded-3xl overflow-hidden border hover:border-green-500/50 transition-all group relative flex flex-col shadow-xl hover:shadow-2xl hover:-translate-y-2 duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border
                  }}
                >
                  {/* Image Header with Gradient */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-current via-transparent to-black/20 z-10" style={{ color: theme.cardBg }}></div>
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={offer.image}
                      alt={offer.title}
                    />

                    {offer.badge && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20">
                          {offer.badge}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-6 z-20 text-right">
                      <p className="text-4xl font-black text-green-500 drop-shadow-sm">{offer.discount}</p>
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest text-white drop-shadow">
                        Off Total Bill
                      </p>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black mb-2 group-hover:text-green-500 transition-colors" style={{ color: theme.text }}>
                      {offer.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: theme.textSecondary }}>
                      {offer.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      {offer.minBookingAmount > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: theme.textSecondary, opacity: 0.6 }}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Min. booking of ₹{offer.minBookingAmount}
                        </div>
                      )}

                      {offer.validTo && (
                        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: theme.textSecondary, opacity: 0.6 }}>
                          <Clock className="w-3.5 h-3.5" />
                          Valid until {new Date(offer.validTo).toLocaleDateString('en-IN')}
                        </div>
                      )}

                      {/* Promo Code Box */}
                      <div 
                        className="border rounded-2xl p-5 flex items-center justify-between group/code transition-colors hover:border-green-500/30 shadow-inner"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.border
                        }}
                      >
                        <div>
                          <p className="text-[9px] uppercase font-black tracking-widest mb-1 opacity-60" style={{ color: theme.textSecondary }}>
                            Promo Code
                          </p>
                          <p className="font-mono text-xl font-bold tracking-[0.2em]" style={{ color: theme.text }}>
                            {offer.code}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="w-12 h-12 rounded-xl border flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shadow-sm active:scale-90"
                          style={{
                            backgroundColor: theme.cardBg,
                            borderColor: theme.border,
                            color: theme.textSecondary
                          }}
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
        <section 
          className="mt-24 border-t pt-12 flex flex-col md:flex-row justify-between items-center gap-8"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <History className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm font-bold italic" style={{ color: theme.textSecondary }}>
              Corporate Reward Program 2026
            </p>
          </div>
          <div className="flex gap-8 text-sm font-black uppercase tracking-widest" style={{ color: theme.textSecondary }}>
            <a className="hover:text-green-500 cursor-pointer transition-colors">Safety</a>
            <a className="hover:text-green-500 cursor-pointer transition-colors">Returns</a>
            <a className="hover:text-green-500 cursor-pointer transition-colors">Privacy</a>
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
            <div 
              className="rounded-2xl px-8 py-4 flex items-center gap-4 shadow-2xl border"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <p className="font-bold" style={{ color: theme.text }}>Promo code copied! Use it at checkout.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Offers;

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/DashboardNavbar'

const Offers = () => {
  const [promoCode, setPromoCode] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const offers = [
    {
      id: 1,
      title: 'Weekend Warrior',
      description: '15% OFF SUV rentals',
      discount: '15%',
      code: 'WEEKEND15',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      badge: 'Featured',
      badgeColor: 'primary',
      category: 'weekend'
    },
    {
      id: 2,
      title: 'First Ride',
      description: 'Welcome discount for newcomers',
      discount: '20%',
      code: 'START20',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      badge: null,
      category: 'all'
    },
    {
      id: 3,
      title: 'Midnight Cruise',
      description: 'Special night-time rates',
      discount: '30%',
      code: 'NIGHTDRIVE',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      badge: 'Limited Time',
      badgeColor: 'purple',
      category: 'flash'
    },
    {
      id: 4,
      title: 'Business Class',
      description: 'Executive sedan rentals',
      discount: '10%',
      code: 'BIZ10',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
      badge: null,
      category: 'all'
    },
    {
      id: 5,
      title: 'Eco Explorer',
      description: '25% OFF Electric Vehicles',
      discount: '25%',
      code: 'GREENGO',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
      badge: null,
      category: 'all'
    },
    {
      id: 6,
      title: 'Coastal Cruise',
      description: 'Long-term convertible rentals',
      discount: '15%',
      code: 'COASTAL15',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      badge: null,
      category: 'longterm'
    },
  ]

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      alert(`Promo code "${promoCode}" applied successfully!`)
      setPromoCode('')
    }
  }

  const filteredOffers = selectedFilter === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === selectedFilter)

  return (
    <div className="relative min-h-screen w-full bg-dashboard-gradient">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-10 relative z-10">
        {/* Page Heading */}
        <motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12"
>
  <div className="flex flex-col gap-2">
    <h1 className="text-5xl font-black tracking-tight leading-tight text-white">
      Exclusive Rewards <br /> <span className="text-primary">& Deals</span>
    </h1>
    <p className="text-slate-400 text-lg max-w-md">Fuel your next journey with premium savings and corporate benefits.</p>
  </div>
  <div className="flex gap-3">
    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-sm font-bold text-white hover:bg-slate-700/50 transition-all">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2} 
        stroke="currentColor" 
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      View History
    </button>
  </div>
</motion.div>

        {/* CTA Section / Manual Apply */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-8 mb-12 relative overflow-hidden group border border-primary/30 shadow-neon"
        >
          <div className="absolute -right-20 -top-20 size-64 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute -left-20 -bottom-20 size-64 bg-accent-purple/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-white">Have a secret code?</h2>
              <p className="text-slate-400">Redeem your voucher or corporate discount here.</p>
            </div>
            <div className="flex w-full max-w-md bg-slate-900/80 border border-white/10 rounded-xl p-1 focus-within:border-primary/50 transition-all">
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-4 text-white placeholder:text-slate-500" 
                placeholder="Enter promo code..." 
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <button 
                onClick={handleApplyPromo}
                className="px-8 py-3 rounded-lg font-bold text-slate-900 text-sm uppercase tracking-wider transition-all bg-gradient-to-r from-accent-purple to-primary hover:shadow-neon"
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>

        {/* Chips / Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              selectedFilter === 'all' 
                ? 'bg-primary text-slate-900 shadow-neon' 
                : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-primary/50 hover:text-white'
            }`}
          >
            All Offers
          </button>
          <button 
            onClick={() => setSelectedFilter('weekend')}
            className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedFilter === 'weekend' 
                ? 'bg-primary text-slate-900 font-bold shadow-neon' 
                : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-primary/50 hover:text-white'
            }`}
          >
            Weekend
          </button>
          <button 
            onClick={() => setSelectedFilter('longterm')}
            className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedFilter === 'longterm' 
                ? 'bg-primary text-slate-900 font-bold shadow-neon' 
                : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-primary/50 hover:text-white'
            }`}
          >
            Long-term
          </button>
          <button 
            onClick={() => setSelectedFilter('luxury')}
            className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedFilter === 'luxury' 
                ? 'bg-primary text-slate-900 font-bold shadow-neon' 
                : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-primary/50 hover:text-white'
            }`}
          >
            Luxury
          </button>
          <button 
            onClick={() => setSelectedFilter('flash')}
            className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedFilter === 'flash' 
                ? 'bg-primary text-slate-900 font-bold shadow-neon' 
                : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-primary/50 hover:text-white'
            }`}
          >
            Flash Deals
          </button>
        </motion.div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all group relative"
            >
              {/* Badge */}
              {offer.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <span 
                    className={`${
                      offer.badgeColor === 'primary' 
                        ? 'bg-primary text-slate-900 shadow-neon' 
                        : 'bg-accent-purple text-white'
                    } text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}
                  >
                    {offer.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src={offer.image}
                  alt={offer.title}
                />
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">{offer.title}</h3>
                    <p className="text-slate-400 text-sm">{offer.description}</p>
                  </div>
                  <span className="text-3xl font-black text-primary">
                    {offer.discount}
                  </span>
                </div>

                {/* Promo Code Box */}
                <div className="bg-slate-900/80 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Promo Code</p>
                    <p className="font-mono text-lg font-bold text-white tracking-widest">{offer.code}</p>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(offer.code)}
                    className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-slate-900 transition-all group/btn"
                    title="Copy code"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2} 
                      stroke="currentColor" 
                      className="w-5 h-5"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Section */}
        <footer className="mt-20 border-t border-white/10 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <p className="text-slate-500 text-sm font-medium">© 2024 RentRide Premium Mobility Services.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-slate-500 hover:text-primary transition-colors text-sm cursor-pointer">Terms</a>
            <a className="text-slate-500 hover:text-primary transition-colors text-sm cursor-pointer">Privacy</a>
            <a className="text-slate-500 hover:text-primary transition-colors text-sm cursor-pointer">Affiliates</a>
          </div>
        </footer>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <div className="glass-panel border border-primary/50 rounded-xl px-6 py-4 flex items-center gap-4 shadow-neon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2.5} 
              stroke="currentColor" 
              className="w-6 h-6 text-primary"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-bold text-white">Code Copied!</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Offers
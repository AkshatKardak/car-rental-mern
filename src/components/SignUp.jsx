import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo.png';

const SignUp = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.terms) {
      setError('Please accept the Terms & Privacy Policy.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const userData = {
        id: 'dummy-user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'user'
      }
      localStorage.setItem('token', 'dummy-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify(userData))
      navigate('/dashboard')
    }, 900)
  }

  return (
    <div className="min-h-screen bg-[#101f22] text-white font-display overflow-x-hidden antialiased selection:bg-[#13c8ec] selection:text-[#101f22]">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWcmcDeKsipVRtSoE6ybXxplNZsdl9di6BOUhXShXy-dQBkoQeuRxXjcpw2Um-HEP3gyuWjX2rI7spk3oHe0HaoBWZOf25Q3w_Jo9uNYv--G_X3loqoe2odlLBCu2DEejAcVzIphwcXoBL1wJGCS-BFPF4tv8m7nRhN9AXHyvnanWBqCiQajP79kRx7nMLnOMcI4A5OxlGUGKkHhMWJSrDVbgi7i11LBzD3Ph8RtXDomyp08amYvCOwifJE0ZdNzVn-K3_o6t6lrQ')"
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#13c8ec]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-50 w-full border-b border-white/10 bg-[#101f22]/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="size-8 text-[#13c8ec]">
            </div>
            <img src={Logo} alt="RentRide Logo" className="h-10 w-auto object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <span className="text-sm font-medium text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">
              Home
            </span>
            <span className="text-sm font-medium text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">
              Inventory
            </span>
            <span className="text-sm font-medium text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">
              About Us
            </span>
            <span className="text-sm font-medium text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">
              Contact
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-medium text-white hover:text-[#13c8ec] transition-colors">
              Sign In
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#13c8ec]/10 border border-[#13c8ec]/50 px-4 py-2 text-sm font-medium text-[#13c8ec] hover:bg-[#13c8ec] hover:text-[#101f22] transition-all duration-300 shadow-[0_0_20px_rgba(19,200,236,0.15)]"
            >
              Start Driving
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-64px)] w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div
          className="w-full max-w-5xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
          }}
        >
          {/* Left: Promo panel */}
          <div className="hidden md:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-[#101f22]/80">
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#13c8ec]/30 bg-[#13c8ec]/10 px-3 py-1 text-xs font-medium text-[#13c8ec] mb-6">
                <span>Premium Experience</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl mb-4">
                Drive the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#13c8ec]">
                  Extraordinary.
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-sm leading-relaxed">
                Access an exclusive fleet of luxury and sports cars. Zero paperwork, 100% thrill.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#13c8ec]">
                    ⚡
                  </div>
                  <div>
                    <p className="font-bold text-white">Instant Booking</p>
                    <p className="text-xs text-slate-400">Get on the road in minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#13c8ec]">
                    🔒
                  </div>
                  <div>
                    <p className="font-bold text-white">Secure & Private</p>
                    <p className="text-xs text-slate-400">Your data is encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 bg-[#101f22]/80 md:bg-transparent">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-slate-400 text-sm mt-1">Demo mode: account is stored locally.</p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500
                             focus:border-[#13c8ec] focus:bg-white/10 focus:ring-1 focus:ring-[#13c8ec] sm:text-sm transition-all"
                  placeholder="John Doe"
                  type="text"
                  required
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500
                               focus:border-[#13c8ec] focus:bg-white/10 focus:ring-1 focus:ring-[#13c8ec] sm:text-sm transition-all"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500
                               focus:border-[#13c8ec] focus:bg-white/10 focus:ring-1 focus:ring-[#13c8ec] sm:text-sm transition-all"
                    placeholder="(555) 000-0000"
                    type="tel"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                  Password
                </label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500
                             focus:border-[#13c8ec] focus:bg-white/10 focus:ring-1 focus:ring-[#13c8ec] sm:text-sm transition-all"
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 ml-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-500
                             focus:border-[#13c8ec] focus:bg-white/10 focus:ring-1 focus:ring-[#13c8ec] sm:text-sm transition-all"
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-white/5 text-[#13c8ec] focus:ring-[#13c8ec]/50"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-slate-400">
                    I agree to the{' '}
                    <span className="text-[#13c8ec] hover:text-[#13c8ec]/80 underline underline-offset-2 cursor-pointer">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-[#13c8ec] hover:text-[#13c8ec]/80 underline underline-offset-2 cursor-pointer">
                      Privacy Policy
                    </span>
                    .
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-lg
                             bg-gradient-to-r from-purple-600 to-[#13c8ec]
                             px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300
                             hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(19,200,236,0.15)]
                             focus:outline-none focus:ring-2 focus:ring-[#13c8ec] focus:ring-offset-2 focus:ring-offset-[#101f22]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 rounded-lg bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">{loading ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-400">Already have an account?</span>
              <Link to="/signin" className="ml-1 font-semibold text-[#13c8ec] hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUp

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from "../../assets/logo.png";


const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!formData.email || !formData.password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      const userData = {
        id: 'dummy-user-' + Date.now(),
        name: formData.email.split('@')[0],
        email: formData.email,
        role: 'user',
      };

      localStorage.setItem('token', 'dummy-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101f22]/80 to-purple-900/40 text-white font-display relative overflow-hidden">
      {/* Background image + gradient + glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-[#101f22]/80" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-purple-900/40 to-[#101f22]/80 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-purple-900/40 to-[#101f22]/80 rounded-full blur-[120px]" />
      </div>

      {/* Simple top bar (optional) */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-10 border-b border-white/5 bg-[#111f22]/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="RentRide Logo" className="h-10 w-auto object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <span className="text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">Inventory</span>
          <span className="text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">Locations</span>
          <span className="text-slate-300 hover:text-[#13c8ec] transition-colors cursor-pointer">About</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-slate-400  hover:text-[#13c8ec] transition-colors text-sm">New to RentRide?</span>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-lg border border-white/10 bg-white/5 hover:text-[#13c8ec] transition-all text-white text-sm font-semibold transition-all backdrop-blur-sm"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Centered glass panel */}
      <main className="relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <div
          className="w-full max-w-[480px] rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col gap-6"
          style={{
            background: 'rgba(16, 31, 34, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 pb-1">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-base font-medium">Access your premium fleet.</p>
          </div>

          {/* Demo banner */}
          <div className="flex items-center justify-center gap-2 rounded-lg bg-[#13c8ec]/10 border border-[#13c8ec]/20 p-3">
            <span className="text-[#13c8ec] text-sm font-semibold">Demo mode: any credentials allowed</span>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Email Address</label>
              <div className="flex items-center w-full rounded-xl bg-[#0c1619] border border-[#325e67] transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(19,200,236,0.15)] focus-within:border-[#13c8ec]/50">
                <input
                  type="email"
                  name="email"
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 h-12 text-base px-4"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
              <div className="flex items-center w-full rounded-xl bg-[#0c1619] border border-[#325e67] transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(19,200,236,0.15)] focus-within:border-[#13c8ec]/50">
                <input
                  type="password"
                  name="password"
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 h-12 text-base px-4"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Remember / forgot */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-[#0c1619]" />
                <span className="text-sm text-slate-300 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-[#13c8ec] hover:text-[#0fc2e6] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-slate-900 text-base font-bold tracking-wide mt-2
                         bg-gradient-to-br from-[#7c3aed] to-[#13c8ec] bg-[length:200%_200%]
                         hover:bg-right-top transition-[background-position,box-shadow] duration-500
                         disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_0_rgba(0,0,0,0)]
                         hover:shadow-[0_0_20px_rgba(19,200,236,0.4)]"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Bottom link */}
          <div className="text-center pt-2">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-white font-semibold hover:underline decoration-[#13c8ec] underline-offset-4"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-slate-500 text-xs">© 2025 RentRide Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignIn;

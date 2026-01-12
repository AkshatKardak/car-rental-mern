import React, { useState } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const LoginCard = ({ formData, handleChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-[440px]"
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass-panel rounded-xl shadow-glass overflow-hidden relative"
      >
        {/* Decorative top line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 origin-center"
        />

        <div className="p-8 md:p-10 flex flex-col gap-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center md:text-left space-y-2"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 lg:hidden">
              <img
                src={logo}
                alt="RentRide Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access the fleet dashboard.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Email Field */}
            <InputField
              label="Admin Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@rentride.com"
              icon="mail"
              delay={0.9}
            />

            {/* Password Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="space-y-2"
            >
              <label className="block text-xs font-semibold text-primary tracking-wider uppercase mb-1">
                Password
              </label>
              <div className="input-glass rounded-lg flex items-center px-4 py-3 group focus-within:ring-1 focus-within:ring-primary/50 relative">
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-xl mr-3"
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                >
                  lock
                </motion.span>
                <input
                  className="bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 w-full p-0 text-sm leading-6 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-slate-500 hover:text-white transition-colors focus:outline-none ml-2"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span 
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center justify-between mt-1"
            >
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-0 w-4 h-4 accent-primary"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Remember me
                </span>
              </label>
              <motion.a
                whileHover={{ x: 3 }}
                className="text-xs font-medium text-primary hover:text-primary-hover hover:underline transition-all"
                href="#"
              >
                Forgot password?
              </motion.a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 0 25px rgb(19 200 236 / 0.6)'
              }}
              whileTap={{ scale: 0.98 }}
              className="relative group mt-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-cyan-400 p-[1px] shadow-neon transition-all duration-300"
              type="submit"
            >
              <motion.div 
                className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"
                initial={false}
              />
              <div className="relative flex items-center justify-center gap-2 rounded-[inherit] bg-background-dark/20 backdrop-blur-sm px-6 py-3.5 transition-all group-hover:bg-transparent">
                <span className="font-bold text-white tracking-wide text-sm group-hover:text-white">
                  ADMIN LOGIN
                </span>
                <motion.span 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="material-symbols-outlined text-white text-lg"
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                >
                  arrow_forward
                </motion.span>
              </div>
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.3 }}
            className="relative py-2"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#161f32] px-2 text-slate-500 rounded-full">
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* SSO Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: 'rgb(51 65 85 / 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-200 group"
            type="button"
          >
            <motion.img
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              alt="Google Logo"
              className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
              src="https://www.google.com/favicon.ico"
            />
            <span className="text-sm font-medium text-slate-400 group-hover:text-white">
              Sign in with SSO
            </span>
          </motion.button>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500"
        >
          <motion.a
            whileHover={{ x: -3 }}
            className="hover:text-primary transition-colors flex items-center gap-1"
            href="#"
          >
            <span 
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20' }}
            >
              arrow_back
            </span>
            Back to User Site
          </motion.a>
          <span>v2.4.0 (Beta)</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const InputField = ({ label, type, name, value, onChange, placeholder, icon, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="space-y-2"
    >
      <label className="block text-xs font-semibold text-primary tracking-wider uppercase mb-1">
        {label}
      </label>
      <div className="input-glass rounded-lg flex items-center px-4 py-3 group focus-within:ring-1 focus-within:ring-primary/50">
        <motion.span 
          whileHover={{ scale: 1.1 }}
          className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-xl mr-3"
          style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
        >
          {icon}
        </motion.span>
        <input
          className="bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 w-full p-0 text-sm leading-6 outline-none"
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </motion.div>
  )
}

export default LoginCard

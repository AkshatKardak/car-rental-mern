import React, { useState } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'

const LoginCard = ({ formData, handleChange, handleSubmit, error }) => {
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
        className="bg-background-primary rounded-2xl shadow-xl border border-border-light overflow-hidden relative"
      >
        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-0 left-0 w-full h-1 bg-primary origin-center"
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
            <h2 className="text-2xl font-bold text-text-primary">Welcome Back</h2>
            <p className="text-text-secondary text-sm">
              Enter your credentials to access the fleet dashboard.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

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
              icon={<Mail size={18} />}
              delay={0.9}
            />

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="space-y-2"
            >
              <label className="block text-[10px] font-bold text-text-muted tracking-widest uppercase ml-1">
                Password
              </label>
              <div className="bg-background-secondary border border-border-light rounded-xl flex items-center px-4 py-3 group focus-within:border-primary transition-all relative">
                <span className="text-text-muted group-focus-within:text-primary transition-colors mr-3">
                  <Lock size={18} />
                </span>
                <input
                  className="bg-transparent border-none text-text-primary placeholder-text-muted focus:ring-0 w-full p-0 text-sm leading-6 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  className="text-text-muted hover:text-text-primary transition-colors focus:outline-none ml-2"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  className="rounded border-border-light bg-background-secondary text-primary focus:ring-primary focus:ring-offset-0 w-4 h-4"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <a
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-all"
                href="#"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{
                scale: 1.01,
                backgroundColor: 'var(--color-primary)'
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
              type="submit"
            >
              <span className="font-bold text-white tracking-wider text-sm">
                ADMIN LOGIN
              </span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white"
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-4 py-2"
          >
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest px-2">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-border-light" />
          </motion.div>

          {/* SSO Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            whileHover={{
              backgroundColor: 'var(--color-background-secondary)'
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-border-light hover:border-text-muted transition-all duration-200 group"
            type="button"
          >
            <img
              alt="Google Logo"
              className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100"
              src="https://www.google.com/favicon.ico"
            />
            <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary">
              Sign in with SSO
            </span>
          </motion.button>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-background-secondary p-4 border-t border-border-light flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-wider"
        >
          <a
            className="hover:text-primary transition-colors flex items-center gap-1"
            href="#"
          >
            <ArrowLeft size={14} />
            Back to User Site
          </a>
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
      <label className="block text-[10px] font-bold text-text-muted tracking-widest uppercase ml-1">
        {label}
      </label>
      <div className="bg-background-secondary border border-border-light rounded-xl flex items-center px-4 py-3 group focus-within:border-primary transition-all">
        <span className="text-text-muted group-focus-within:text-primary transition-colors mr-3">
          {icon}
        </span>
        <input
          className="bg-transparent border-none text-text-primary placeholder-text-muted focus:ring-0 w-full p-0 text-sm leading-6 outline-none"
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

export default LoginCard;

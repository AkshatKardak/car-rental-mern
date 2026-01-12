import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BackgroundEffects from '../components/BackgroundEffects'
import BrandSection from '../components/BrandSection'
import LoginCard from '../components/LoginCard'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')

  // Admin Credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@rentride.com',
    password: 'admin123'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate credentials
    if (formData.email === ADMIN_CREDENTIALS.email && 
        formData.password === ADMIN_CREDENTIALS.password) {
      console.log('Login successful:', formData)
      // Navigate to dashboard
      navigate('/admin/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user types
    if (error) setError('')
  }

  return (
    <div className="bg-background-dark text-slate-200 antialiased min-h-screen relative overflow-hidden flex items-center justify-center">
      <BackgroundEffects />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl px-4 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 h-full"
      >
        <BrandSection />
        <LoginCard 
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          error={error}
        />
      </motion.main>

      {/* Decorative Corner Gradient */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-purple via-primary to-transparent opacity-60 z-50 origin-left"
      />
    </div>
  )
}

export default AdminLogin

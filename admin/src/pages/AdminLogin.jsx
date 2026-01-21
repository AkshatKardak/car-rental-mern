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
    <div className="bg-background-secondary text-text-primary antialiased min-h-screen relative overflow-hidden flex items-center justify-center">
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
    </div>
  )
}

export default AdminLogin;

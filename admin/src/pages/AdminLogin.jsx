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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:5005/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Double check if user is admin
        if (data.user?.role !== 'admin' && data.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          return;
        }

        console.log('Login successful');
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user || { email: formData.email, role: 'admin' }));

        // Navigate to dashboard
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection to server failed. Please ensure backend is running.');
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

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

    // --- 🚨 DUMMY DATA BYPASS ---
    // This allows login even if backend is offline or failing
    if (formData.email === 'admin@rentride.com' && formData.password === 'password123') {
        console.log('Using Dummy Login Bypass');
        const dummyUser = { name: 'Admin User', email: 'admin@rentride.com', role: 'admin' };
        localStorage.setItem('adminToken', 'dummy-token-12345'); 
        localStorage.setItem('adminUser', JSON.stringify(dummyUser));
        navigate('/admin/dashboard');
        return; 
    }
    // ---------------------------

    try {
      const response = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user?.role !== 'admin' && data.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          return;
        }
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user || { email: formData.email, role: 'admin' }));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Try "admin@rentride.com" / "password123"');
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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

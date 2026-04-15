import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import AuthCard from '../components/ui/AuthCard'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import SocialButton from '../components/ui/SocialButton'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const result = await login(formData)
      if (result.success) {
        navigate('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setLoading(true)
    try {
      // Implement social login logic here
      console.log(`Logging in with ${provider}`)
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CentriFlow</h1>
            <p className="text-gray-600">AI-Powered Education Management</p>
          </motion.div>

          <AuthCard>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-8">Sign in to your account to continue</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon="email"
                  required
                />

                <InputField
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon="password"
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="md"
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or continue with</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <SocialButton
                    provider="google"
                    onClick={() => handleSocialLogin('google')}
                    loading={loading}
                  />
                  <SocialButton
                    provider="github"
                    onClick={() => handleSocialLogin('github')}
                    loading={loading}
                  />
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </motion.div>
          </AuthCard>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:flex-1 bg-blue-50 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full max-w-lg">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop"
              alt="Education"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Transform Education with AI
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Join thousands of educators and students using CentriFlow to revolutionize the learning experience.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import AuthCard from '../components/ui/AuthCard'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import SocialButton from '../components/ui/SocialButton'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++

    const strengthLevels = [
      { strength: 0, text: '', color: '' },
      { strength: 1, text: 'Weak', color: 'text-red-500' },
      { strength: 2, text: 'Fair', color: 'text-yellow-500' },
      { strength: 3, text: 'Good', color: 'text-blue-500' },
      { strength: 4, text: 'Strong', color: 'text-green-500' }
    ]

    return strengthLevels[strength]
  }

  const passwordStrength = getPasswordStrength(formData.password)

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
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const result = await signup(formData)
      if (result.success) {
        navigate('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignup = async (provider) => {
    setLoading(true)
    try {
      // Implement social signup logic here
      console.log(`Signing up with ${provider}`)
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Signup Form */}
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

          <AuthCard className="max-h-[600px] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 mb-8">Join thousands of educators and students</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon="user"
                  required
                />

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

                <div>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon="password"
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    required
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Password strength</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                            passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/4' :
                            passwordStrength.strength === 3 ? 'bg-blue-500 w-3/4' :
                            passwordStrength.strength === 4 ? 'bg-green-500 w-full' : ''
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <InputField
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon="password"
                  showPasswordToggle
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="md"
                >
                  Create Account
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
                    onClick={() => handleSocialSignup('google')}
                    loading={loading}
                  />
                  <SocialButton
                    provider="github"
                    onClick={() => handleSocialSignup('github')}
                    loading={loading}
                  />
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Login
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
              src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop"
              alt="AI Education"
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
              Smart Learning Analytics
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Get AI-powered insights, track progress, and personalize learning paths for optimal educational outcomes.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup

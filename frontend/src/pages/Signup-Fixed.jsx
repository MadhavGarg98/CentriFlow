import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

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
  const { register } = useAuth()
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
      { strength: 1, text: 'Weak', color: '#ef4444' },
      { strength: 2, text: 'Fair', color: '#f59e0b' },
      { strength: 3, text: 'Good', color: '#3b82f6' },
      { strength: 4, text: 'Strong', color: '#10b981' }
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
      const result = await register(formData)
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
      console.log(`Signing up with ${provider}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Left Side - Signup Form */}
      <div className="auth-left">
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          {/* Logo */}
          <div className="auth-logo auth-fade-in">
            <div className="auth-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1>CentriFlow</h1>
            <p>AI-Powered Education Management</p>
          </div>

          <div className="auth-card auth-fade-in-delay" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <h2>Create Account</h2>
            <p className="subtitle">Join thousands of educators and students</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <FiUser />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`auth-input ${errors.name ? 'error' : ''}`}
                  required
                />
                {errors.name && <div className="auth-error">{errors.name}</div>}
              </div>

              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  required
                />
                {errors.email && <div className="auth-error">{errors.email}</div>}
              </div>

              <div>
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <div className="auth-error">{errors.password}</div>}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="auth-password-strength">
                    <div className="auth-strength-label">
                      <span>Password strength</span>
                      <span className="auth-strength-text" style={{ color: passwordStrength.color }}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="auth-strength-bar">
                      <div
                        className={`auth-strength-fill ${
                          passwordStrength.strength === 1 ? 'weak' :
                          passwordStrength.strength === 2 ? 'fair' :
                          passwordStrength.strength === 3 ? 'good' :
                          passwordStrength.strength === 4 ? 'strong' : ''
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <FiLock />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-password-toggle"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
              </div>

              <div className="auth-select-group">
                <label className="auth-select-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="auth-select"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-button"
              >
                {loading ? (
                  <div className="auth-button loading">
                    <div className="auth-spinner"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <div className="auth-divider-text">
                <span>or continue with</span>
              </div>
            </div>

            <div className="auth-social-buttons">
              <button
                onClick={() => handleSocialSignup('google')}
                disabled={loading}
                className="auth-social-button google"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <button
                onClick={() => handleSocialSignup('github')}
                disabled={loading}
                className="auth-social-button github"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957.266 1.983 1.008 2.722 1.008.538 0 1.045-.075 1.485-.213v2.461c0 .316.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="auth-right">
        <div className="auth-image-container auth-fade-in-delay-2">
          <img
            src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop"
            alt="AI Education"
            className="auth-image"
          />
          <div className="auth-image-overlay"></div>
        </div>
        
        <div className="auth-content auth-fade-in-delay-2">
          <h3>Smart Learning Analytics</h3>
          <p>
            Get AI-powered insights, track progress, and personalize learning paths for optimal educational outcomes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

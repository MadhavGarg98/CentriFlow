import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiCalendar, FiCamera, FiEdit2, FiSave, FiX, FiSettings, FiShield, FiActivity } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null
  })
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profileImage: null
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? e.target.files[0] : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }))
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.updateProfile(formData)
      
      if (response.data.success) {
        updateUser(response.data.data.user)
        setIsEditing(false)
        setPreviewImage(null)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      profileImage: null
    })
    setPreviewImage(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card p-6 text-center">
            {/* Profile Image */}
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full overflow-hidden shadow-lg">
                {(previewImage || user?.profileImage) ? (
                  <img
                    src={previewImage || user?.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <span className="text-white text-3xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-1/2 transform translate-x-16 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                  <FiCamera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="mb-6">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-800 mb-2"
              >
                {user?.name || 'User Name'}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-600 mb-4 capitalize inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
              >
                {user?.role || 'student'}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-500 mb-6 flex items-center"
              >
                <FiMail className="w-4 h-4 mr-2" />
                {user?.email || 'user@example.com'}
              </motion.p>
            </div>

            {/* Stats */}
            <div className="space-y-3 text-left">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Member Since</span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {formatDate(user?.enrollmentDate || new Date())}
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiActivity className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Last Login</span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {formatDate(user?.lastLogin || new Date())}
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiShield className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Account Status</span>
                </div>
                <span className={`text-sm font-medium inline-flex items-center px-2 py-1 rounded-full ${
                  user?.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  className="input bg-gray-50 capitalize"
                />
              </div>

              {/* Account Information */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrollment Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={formatDate(user?.enrollmentDate)}
                        disabled
                        className="input pl-10 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <input
                      type="text"
                      value={user?.isActive ? 'Active' : 'Inactive'}
                      disabled
                      className={`input bg-gray-50 ${
                        user?.isActive ? 'text-green-600' : 'text-red-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="card p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <button className="w-full btn btn-secondary text-left justify-start">
                Change Password
              </button>
              <button className="w-full btn btn-secondary text-left justify-start">
                Enable Two-Factor Authentication
              </button>
              <button className="w-full btn btn-secondary text-left justify-start">
                Download My Data
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile

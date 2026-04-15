import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHome, FiSearch, FiAlertCircle } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-4"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8"
        >
          <FiAlertCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Error Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold text-gray-800 mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-gray-800 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-8"
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/dashboard"
            className="btn btn-primary"
          >
            <FiHome className="w-4 h-4" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            <FiSearch className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you believe this is an error, please contact our support team or check out our help center.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Contact Support
            </button>
            <span className="text-gray-400">•</span>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Visit Help Center
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound

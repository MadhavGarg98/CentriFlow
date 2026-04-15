import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiBell, FiSearch, FiUser } from 'react-icons/fi'

const Header = ({ onMenuClick, user, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2 w-80">
            <FiSearch className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Profile Settings
                  </button>
                  
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Help & Support
                  </button>
                  
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

import React from 'react'
import { motion } from 'framer-motion'

const AuthCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`
        w-full max-w-md mx-auto
        bg-white rounded-2xl shadow-xl
        border border-gray-100
        p-8
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AuthCard

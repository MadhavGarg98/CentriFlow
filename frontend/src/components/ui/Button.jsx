import React from 'react'
import { motion } from 'framer-motion'
import { FiLoader } from 'react-icons/fi'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <FiLoader className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default Button

import React from 'react'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'

const InputField = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'email':
        return <FiMail className="w-5 h-5 text-gray-400" />
      case 'password':
        return <FiLock className="w-5 h-5 text-gray-400" />
      case 'user':
        return <FiUser className="w-5 h-5 text-gray-400" />
      default:
        return icon
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {getIcon()}
      </div>
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl
          text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-300'}
          ${showPasswordToggle ? 'pr-12' : ''}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}

export default InputField

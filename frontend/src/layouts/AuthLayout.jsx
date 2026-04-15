import React from 'react'

const AuthLayout = ({ children }) => {
  // The new Login and Signup components have their own layouts
  // This wrapper is now minimal
  return <>{children}</>
}

export default AuthLayout

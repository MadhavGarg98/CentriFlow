import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Login from './pages/Login-Fixed'
import Signup from './pages/Signup-Fixed'
import Dashboard from './pages/Dashboard-Final'
import Attendance from './pages/Attendance'
import Analytics from './pages/Analytics'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
}

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-primary">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <AuthLayout>
                  <Signup />
                </AuthLayout>
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Navigate to="/dashboard" replace />
                </motion.div>
              }
            />
            <Route
              path="dashboard"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              }
            />
            <Route
              path="attendance"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Attendance />
                </motion.div>
              }
            />
            <Route
              path="analytics"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Analytics />
                </motion.div>
              }
            />
            <Route
              path="chat"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Chat />
                </motion.div>
              }
            />
            <Route
              path="profile"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Profile />
                </motion.div>
              }
            />
          </Route>

          {/* 404 page */}
          <Route
            path="*"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <NotFound />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      }
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          const response = await authAPI.getCurrentUser()
          if (response.data.success) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: response.data.data.user,
                token
              }
            })
          }
        } catch (error) {
          localStorage.removeItem('token')
          dispatch({ type: 'LOGOUT' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    loadUser()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.login(credentials)
      
      if (response.data.success) {
        const { user, token } = response.data.data
        localStorage.setItem('token', token)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        })
        toast.success('Login successful!')
        return { success: true }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' })
      const response = await authAPI.register(userData)
      
      if (response.data.success) {
        const { user, token } = response.data.data
        localStorage.setItem('token', token)
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { user, token }
        })
        toast.success('Registration successful!')
        return { success: true }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...registerData } = userData
    return api.post('/auth/register', registerData)
  },
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => {
    const formData = new FormData()
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key])
      }
    })
    return api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Users API
export const usersAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getStudents: (params) => api.get('/users/students/list', { params }),
  updateFaceData: (faceData) => api.put('/face-data', { faceData }),
}

// Attendance API
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance', data),
  markAttendanceWithFace: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.post('/attendance/face-recognition', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getAttendance: (params) => api.get('/attendance', { params }),
  getAttendanceStats: (params) => api.get('/attendance/stats', { params }),
}

// Analytics API
export const analyticsAPI = {
  getStudentAnalytics: (params) => api.get('/analytics/student', { params }),
  generatePrediction: (data) => api.post('/analytics/predict', data),
  getDashboardAnalytics: (params) => api.get('/analytics/dashboard', { params }),
  getPerformanceTrends: (params) => api.get('/analytics/trends', { params }),
}

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
  getChatHistory: () => api.get('/chat/history'),
}

export default api

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiTarget, FiActivity, FiRefreshCw } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { analyticsAPI } from '../services/api'
import toast from 'react-hot-toast'

const Analytics = () => {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [trendsData, setTrendsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatingPrediction, setGeneratingPrediction] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024')

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

  useEffect(() => {
    fetchAnalyticsData()
    fetchTrendsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await analyticsAPI.getStudentAnalytics({ semester: selectedSemester })
      if (response.data.success) {
        setAnalyticsData(response.data.data.analytics)
      }
    } catch (error) {
      toast.error('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendsData = async () => {
    try {
      const response = await analyticsAPI.getPerformanceTrends({ semester: selectedSemester })
      if (response.data.success) {
        setTrendsData(response.data.data.trends)
      }
    } catch (error) {
      console.error('Failed to fetch trends data:', error)
    }
  }

  const generatePrediction = async () => {
    try {
      setGeneratingPrediction(true)
      const response = await analyticsAPI.generatePrediction({
        studentId: user?._id,
        semester: selectedSemester
      })

      if (response.data.success) {
        setAnalyticsData(response.data.data.analytics)
        toast.success('AI prediction generated successfully')
      }
    } catch (error) {
      toast.error('Failed to generate prediction')
    } finally {
      setGeneratingPrediction(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return <FiTrendingDown className="w-5 h-5" />
      case 'medium':
        return <FiAlertCircle className="w-5 h-5" />
      case 'low':
        return <FiTrendingUp className="w-5 h-5" />
      default:
        return <FiActivity className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Insights</h1>
            <p className="text-gray-600">Track your academic performance and AI-powered predictions</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input"
            >
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Summer 2024">Summer 2024</option>
            </select>
            <button
              onClick={generatePrediction}
              disabled={generatingPrediction}
              className="btn btn-primary"
            >
              {generatingPrediction ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <FiRefreshCw className="w-4 h-4" />
                  Generate AI Prediction
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {analyticsData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <FiTarget className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Attendance</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {analyticsData.attendancePercentage?.toFixed(1)}%
              </h3>
              <p className="text-sm text-gray-600">
                {analyticsData.presentClasses}/{analyticsData.totalClasses} classes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Performance</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">B+</h3>
              <p className="text-sm text-gray-600">Current Grade</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  analyticsData.riskLevel === 'high' ? 'from-red-500 to-red-600' :
                  analyticsData.riskLevel === 'medium' ? 'from-yellow-500 to-yellow-600' :
                  'from-green-500 to-green-600'
                }`}>
                  {getRiskIcon(analyticsData.riskLevel)}
                </div>
                <span className="text-sm font-medium text-gray-500">Risk Level</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 capitalize">
                {analyticsData.riskLevel}
              </h3>
              <p className="text-sm text-gray-600">
                Risk Score: {analyticsData.riskScore?.toFixed(1)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
                  <FiActivity className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Trend</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 capitalize">
                {analyticsData.performanceTrend}
              </h3>
              <p className="text-sm text-gray-600">Performance Trend</p>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Attendance Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendancePercentage" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Subject Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.subjects || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#8b5cf6" name="Attendance %" />
                  <Bar dataKey="grade" fill="#ec4899" name="Grade" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* AI Insights */}
          {analyticsData.aiPredictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Risk Analysis */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Risk Analysis</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Dropout Risk</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            analyticsData.aiPredictions.dropoutRisk > 70 ? 'bg-red-500' :
                            analyticsData.aiPredictions.dropoutRisk > 40 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${analyticsData.aiPredictions.dropoutRisk}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {analyticsData.aiPredictions.dropoutRisk?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Performance Prediction</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${analyticsData.aiPredictions.performancePrediction}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {analyticsData.aiPredictions.performancePrediction?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  {analyticsData.aiPredictions.recommendations?.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

export default Analytics

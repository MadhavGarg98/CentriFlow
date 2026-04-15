import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCalendar, FiTrendingUp, FiAlertCircle, FiBookOpen, FiAward, FiActivity, FiTarget, FiClock, FiCheckCircle, FiXCircle, FiMessageCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { analyticsAPI, attendanceAPI } from '../services/api'

const StatCard = ({ icon: Icon, title, value, change, color, delay, subtitle }) => {
  const isPositive = change > 0
  
  const getColorClass = (color) => {
    switch(color) {
      case '#3b82f6': return 'bg-blue-500'
      case '#8b5cf6': return 'bg-purple-500'
      case '#10b981': return 'bg-green-500'
      case '#ef4444': return 'bg-red-500'
      case '#f59e0b': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl shadow-md ${getColorClass(color)}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {isPositive ? <FiTrendingUp className="w-3 h-3" /> : <FiAlertCircle className="w-3 h-3" />}
            <span className="text-xs font-medium">
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  )
}

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      if (user?.role === 'admin') {
        const response = await analyticsAPI.getDashboardAnalytics()
        if (response.data.success) {
          setStats(response.data.data.overview)
        }
      } else {
        // For students and faculty, get personal stats
        const attendanceResponse = await attendanceAPI.getAttendanceStats()
        if (attendanceResponse.data.success) {
          setStats(attendanceResponse.data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value={stats.totalStudents || 0}
          change={12}
          color="#3b82f6"
          delay={0.1}
          subtitle="Active enrollment"
        />
        <StatCard
          icon={FiAward}
          title="Total Faculty"
          value={stats.totalFaculty || 0}
          change={5}
          color="#8b5cf6"
          delay={0.2}
          subtitle="Teaching staff"
        />
        <StatCard
          icon={FiCheckCircle}
          title="Avg Attendance"
          value={`${stats.overallAttendancePercentage?.toFixed(1) || 0}%`}
          change={8}
          color="#10b981"
          delay={0.3}
          subtitle="This month"
        />
        <StatCard
          icon={FiAlertCircle}
          title="At Risk Students"
          value={stats.atRiskStudents || 12}
          change={-3}
          color="#ef4444"
          delay={0.4}
          subtitle="Need attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiActivity className="w-5 h-5 mr-2 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats.recentActivity?.slice(0, 5).map((activity, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'present' 
                    ? 'bg-green-100' 
                    : activity.status === 'absent' 
                    ? 'bg-red-100' 
                    : 'bg-yellow-100'
                }`}>
                  {activity.status === 'present' ? (
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  ) : activity.status === 'absent' ? (
                    <FiXCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <FiClock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.student?.name || 'Student'} marked {activity.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.subject || 'Class'} · {new Date(activity.date || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTarget className="w-5 h-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all shadow-sm hover:shadow-md border border-blue-100"
            >
              <FiUsers className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">Add/Edit students</p>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all shadow-sm hover:shadow-md border border-purple-100"
            >
              <FiCalendar className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Mark Attendance</p>
              <p className="text-xs text-gray-500 mt-1">Daily tracking</p>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all shadow-sm hover:shadow-md border border-green-100"
            >
              <FiTrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">View Analytics</p>
              <p className="text-xs text-gray-500 mt-1">Performance data</p>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all shadow-sm hover:shadow-md border border-red-100"
            >
              <FiAlertCircle className="w-6 h-6 text-red-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Risk Reports</p>
              <p className="text-xs text-gray-500 mt-1">At-risk students</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )

  const renderStudentDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiCheckCircle}
          title="Attendance Rate"
          value={`${stats.attendancePercentage?.toFixed(1) || 0}%`}
          change={5}
          color="#10b981"
          delay={0.1}
          subtitle="This semester"
        />
        <StatCard
          icon={FiBookOpen}
          title="Classes Attended"
          value={`${stats.presentClasses || 0}/${stats.totalClasses || 0}`}
          change={8}
          color="#3b82f6"
          delay={0.2}
          subtitle="Total classes"
        />
        <StatCard
          icon={FiAward}
          title="Performance"
          value={stats.averageGrades ? `${stats.averageGrades.toFixed(1)}%` : "B+"}
          change={12}
          color="#8b5cf6"
          delay={0.3}
          subtitle="Grade average"
        />
        <StatCard
          icon={stats.riskLevel === 'low' ? FiCheckCircle : stats.riskLevel === 'medium' ? FiAlertCircle : FiXCircle}
          title="Risk Level"
          value={stats.riskLevel || "Low"}
          change={-15}
          color={stats.riskLevel === 'low' ? "#10b981" : stats.riskLevel === 'medium' ? "#f59e0b" : "#ef4444"}
          delay={0.4}
          subtitle="Academic risk"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiCalendar className="w-5 h-5 mr-2 text-purple-600" />
            Recent Attendance
          </h3>
          <div className="space-y-3">
            {['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'].map((subject, index) => {
              const attendanceRate = 75 + Math.random() * 25; // Random between 75-100
              const isHighAttendance = attendanceRate >= 85;
              
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isHighAttendance ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <FiBookOpen className={`w-4 h-4 ${
                        isHighAttendance ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{subject}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          isHighAttendance ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${attendanceRate}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      isHighAttendance ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {Math.round(attendanceRate)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiMessageCircle className="w-5 h-5 mr-2 text-purple-600" />
            AI Assistant
          </h3>
          <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiMessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-1">
                  "Great job! Your attendance has improved by {Math.round(stats.attendancePercentage || 85)}% this month. Keep maintaining this excellent performance!"
                </p>
                <p className="text-xs text-gray-500">- Groq AI Assistant</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full"
            >
              <FiMessageCircle className="w-4 h-4 mr-2" />
              Chat with AI Assistant
            </motion.button>
            <div className="grid grid-cols-2 gap-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-secondary text-sm"
              >
                View Analytics
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-secondary text-sm"
              >
                Get Tips
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )

  const renderFacultyDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value="45"
          change={8}
          color="#3b82f6"
          delay={0.1}
        />
        <StatCard
          icon={FiCalendar}
          title="Classes Today"
          value="6"
          change={0}
          color="#8b5cf6"
          delay={0.2}
        />
        <StatCard
          icon={FiTrendingUp}
          title="Avg Attendance"
          value="87%"
          change={3}
          color="#10b981"
          delay={0.3}
        />
        <StatCard
          icon={FiAlertCircle}
          title="Pending Tasks"
          value="3"
          change={-25}
          color="#f59e0b"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Classes</h3>
          <div className="space-y-3">
            {['Mathematics - 9:00 AM', 'Physics - 11:00 AM', 'Chemistry - 2:00 PM'].map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiBookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{classItem}</p>
                    <p className="text-xs text-gray-500">32 students enrolled</p>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm">
                  Mark Attendance
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left border border-blue-100">
              <FiCalendar className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Mark Attendance</p>
            </button>
            <button className="w-full p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left border border-purple-100">
              <FiTrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">View Student Analytics</p>
            </button>
            <button className="w-full p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left border border-green-100">
              <FiUsers className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Manage Students</p>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'admin' && 'Here\'s what\'s happening across your institution.'}
          {user?.role === 'student' && 'Track your academic progress and stay updated.'}
          {user?.role === 'faculty' && 'Manage your classes and monitor student progress.'}
        </p>
      </motion.div>

      {/* Dashboard Content */}
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'student' && renderStudentDashboard()}
      {user?.role === 'faculty' && renderFacultyDashboard()}
    </div>
  )
}

export default Dashboard

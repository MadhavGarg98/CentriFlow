import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/dashboard/Layout'
import StatCard from '../components/dashboard/StatCard'
import ActivityCard from '../components/dashboard/ActivityCard'
import QuickActions from '../components/dashboard/QuickActions'
import { 
  FiUsers, 
  FiAward, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiCalendar, 
  FiTrendingUp,
  FiBookOpen,
  FiTarget,
  FiActivity,
  FiClock
} from 'react-icons/fi'
import styles from '../styles/modules/Dashboard.module.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data based on role
      if (user?.role === 'admin') {
        setStats({
          totalStudents: 1250,
          totalFaculty: 85,
          riskStudents: 23,
          systemHealth: 98
        })
      } else if (user?.role === 'faculty') {
        setStats({
          classesToday: 6,
          totalStudents: 45,
          attendanceRate: 87,
          pendingTasks: 3
        })
      } else {
        setStats({
          attendanceRate: 92,
          performance: 85,
          upcomingClasses: 3,
          assignmentsDue: 2
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const renderAdminDashboard = () => (
    <>
      <div className={styles.dashboardHeader}>
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's what's happening with your system today</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value={stats.totalStudents?.toLocaleString()}
          change={12}
          description="Active enrollment"
          color="blue"
        />
        <StatCard
          icon={FiAward}
          title="Total Faculty"
          value={stats.totalFaculty}
          change={5}
          description="Teaching staff"
          color="purple"
        />
        <StatCard
          icon={FiAlertCircle}
          title="Risk Students"
          value={stats.riskStudents}
          change={-8}
          description="Need attention"
          color="red"
        />
      </div>

      <div className={styles.contentSections}>
        <ActivityCard
          title="Recent Activity"
          icon={FiActivity}
          activities={[
            {
              type: 'user',
              title: 'New Student Registration',
              description: 'John Doe joined the platform',
              time: '2 hours ago'
            },
            {
              type: 'alert',
              title: 'Low Attendance Alert',
              description: '5 students below 75% attendance',
              time: '4 hours ago'
            },
            {
              type: 'success',
              title: 'System Update Complete',
              description: 'Version 2.1.0 deployed successfully',
              time: '6 hours ago'
            }
          ]}
        />
        
        <QuickActions
          actions={[
            {
              icon: FiUsers,
              title: 'Manage Users',
              description: 'Add and manage users',
              color: 'blue'
            },
            {
              icon: FiTarget,
              title: 'View Analytics',
              description: 'Performance insights',
              color: 'purple'
            }
          ]}
        />
      </div>
    </>
  )

  const renderFacultyDashboard = () => (
    <>
      <div className={styles.dashboardHeader}>
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's your teaching overview for today</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          icon={FiCalendar}
          title="Classes Today"
          value={stats.classesToday}
          change={0}
          description="Scheduled sessions"
          color="blue"
        />
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value={stats.totalStudents}
          change={3}
          description="Enrolled students"
          color="green"
        />
        <StatCard
          icon={FiCheckCircle}
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change={2}
          description="This month"
          color="purple"
        />
      </div>

      <div className={styles.contentSections}>
        <ActivityCard
          title="Today's Classes"
          icon={FiCalendar}
          activities={[
            {
              type: 'attendance',
              title: 'Mathematics - Grade 10',
              description: '9:00 AM - Room 201',
              time: 'In 30 minutes'
            },
            {
              type: 'attendance',
              title: 'Physics - Grade 10',
              description: '11:00 AM - Room 305',
              time: 'In 2 hours'
            },
            {
              type: 'attendance',
              title: 'Chemistry - Grade 10',
              description: '2:00 PM - Lab 102',
              time: 'In 5 hours'
            }
          ]}
        />
        
        <QuickActions
          actions={[
            {
              icon: FiCalendar,
              title: 'Mark Attendance',
              description: 'Record today\'s classes',
              color: 'green'
            },
            {
              icon: FiBookOpen,
              title: 'View Students',
              description: 'Manage student records',
              color: 'blue'
            }
          ]}
        />
      </div>
    </>
  )

  const renderStudentDashboard = () => (
    <>
      <div className={styles.dashboardHeader}>
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's your academic progress overview</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          icon={FiCheckCircle}
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change={5}
          description="This semester"
          color="green"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Performance"
          value={`${stats.performance}%`}
          change={8}
          description="Grade average"
          color="blue"
        />
        <StatCard
          icon={FiClock}
          title="Upcoming Classes"
          value={stats.upcomingClasses}
          change={0}
          description="This week"
          color="purple"
        />
      </div>

      <div className={styles.contentSections}>
        <ActivityCard
          title="Recent Activity"
          icon={FiActivity}
          activities={[
            {
              type: 'success',
              title: 'Assignment Submitted',
              description: 'Mathematics - Chapter 5',
              time: '1 hour ago'
            },
            {
              type: 'attendance',
              title: 'Class Attended',
              description: 'Physics - Lecture 12',
              time: '3 hours ago'
            },
            {
              type: 'alert',
              title: 'Assignment Due',
              description: 'Chemistry Lab Report',
              time: 'Tomorrow'
            }
          ]}
        />
        
        <QuickActions
          actions={[
            {
              icon: FiBookOpen,
              title: 'View Assignments',
              description: 'Check pending work',
              color: 'blue'
            },
            {
              icon: FiTarget,
              title: 'AI Chat Assistant',
              description: 'Get help with studies',
              color: 'purple'
            }
          ]}
        />
      </div>
    </>
  )

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  return (
    <Layout user={user}>
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'faculty' && renderFacultyDashboard()}
      {user?.role === 'student' && renderStudentDashboard()}
    </Layout>
  )
}

export default Dashboard

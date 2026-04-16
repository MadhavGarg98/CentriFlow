import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
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
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiBell,
  FiSettings
} from 'react-icons/fi'
import styles from '../styles/modules/PremiumDashboard.module.css'

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
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's what's happening with your system today</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <FiUsers />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>12%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalStudents?.toLocaleString()}</div>
          <div className={styles.statLabel}>Total Students</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.purple}`}>
              <FiAward />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>5%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalFaculty}</div>
          <div className={styles.statLabel}>Total Faculty</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.red}`}>
              <FiAlertCircle />
            </div>
            <div className={`${styles.growthBadge} ${styles.negative}`}>
              <FiArrowDown />
              <span>8%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.riskStudents}</div>
          <div className={styles.statLabel}>Risk Students</div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={styles.contentSections}>
        <div className={styles.activityCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiActivity />
            </div>
            <h3>Recent Activity</h3>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.success}`}>
                <FiUsers />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>New Student Registration</div>
                <div className={styles.activityDescription}>John Doe joined the platform</div>
                <div className={styles.activityTime}>2 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.warning}`}>
                <FiAlertCircle />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Low Attendance Alert</div>
                <div className={styles.activityDescription}>5 students below 75% attendance</div>
                <div className={styles.activityTime}>4 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.info}`}>
                <FiCheckCircle />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>System Update Complete</div>
                <div className={styles.activityDescription}>Version 2.1.0 deployed successfully</div>
                <div className={styles.activityTime}>6 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.quickActionsCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiTarget />
            </div>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActionsGrid}>
            <div className={styles.quickActionButton}>
              <div className={`${styles.quickActionIcon} ${styles.blue}`}>
                <FiUsers />
              </div>
              <div className={styles.quickActionTitle}>Manage Users</div>
              <div className={styles.quickActionDescription}>Add and manage users</div>
            </div>
            <div className={styles.quickActionButton}>
              <div className={`${styles.quickActionIcon} ${styles.purple}`}>
                <FiTarget />
              </div>
              <div className={styles.quickActionTitle}>View Analytics</div>
              <div className={styles.quickActionDescription}>Performance insights</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderFacultyDashboard = () => (
    <>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's your teaching overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <FiCalendar />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>0%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.classesToday}</div>
          <div className={styles.statLabel}>Classes Today</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <FiUsers />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>3%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalStudents}</div>
          <div className={styles.statLabel}>Total Students</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.purple}`}>
              <FiCheckCircle />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>2%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.attendanceRate}%</div>
          <div className={styles.statLabel}>Attendance Rate</div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={styles.contentSections}>
        <div className={styles.activityCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiCalendar />
            </div>
            <h3>Today's Classes</h3>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.info}`}>
                <FiCalendar />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Mathematics - Grade 10</div>
                <div className={styles.activityDescription}>9:00 AM - Room 201</div>
                <div className={styles.activityTime}>In 30 minutes</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.info}`}>
                <FiCalendar />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Physics - Grade 10</div>
                <div className={styles.activityDescription}>11:00 AM - Room 305</div>
                <div className={styles.activityTime}>In 2 hours</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.info}`}>
                <FiCalendar />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Chemistry - Grade 10</div>
                <div className={styles.activityDescription}>2:00 PM - Lab 102</div>
                <div className={styles.activityTime}>In 5 hours</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.quickActionsCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiTarget />
            </div>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActionsGrid}>
            <div className={styles.quickActionButton}>
              <div className={`${styles.quickActionIcon} ${styles.green}`}>
                <FiCalendar />
              </div>
              <div className={styles.quickActionTitle}>Mark Attendance</div>
              <div className={styles.quickActionDescription}>Record today's classes</div>
            </div>
            <div className={styles.quickActionButton}>
              <div className={`${styles.quickActionIcon} ${styles.blue}`}>
                <FiBookOpen />
              </div>
              <div className={styles.quickActionTitle}>View Students</div>
              <div className={styles.quickActionDescription}>Manage student records</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderStudentDashboard = () => (
    <>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's your academic progress overview</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <FiCheckCircle />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>5%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.attendanceRate}%</div>
          <div className={styles.statLabel}>Attendance Rate</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <FiTrendingUp />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>8%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.performance}%</div>
          <div className={styles.statLabel}>Performance</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIcon} ${styles.purple}`}>
              <FiClock />
            </div>
            <div className={`${styles.growthBadge} ${styles.positive}`}>
              <FiArrowUp />
              <span>0%</span>
            </div>
          </div>
          <div className={styles.statValue}>{stats.upcomingClasses}</div>
          <div className={styles.statLabel}>Upcoming Classes</div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={styles.contentSections}>
        <div className={styles.activityCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiActivity />
            </div>
            <h3>Recent Activity</h3>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.success}`}>
                <FiCheckCircle />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Assignment Submitted</div>
                <div className={styles.activityDescription}>Mathematics - Chapter 5</div>
                <div className={styles.activityTime}>1 hour ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.info}`}>
                <FiCalendar />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Class Attended</div>
                <div className={styles.activityDescription}>Physics - Lecture 12</div>
                <div className={styles.activityTime}>3 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles.warning}`}>
                <FiAlertCircle />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Assignment Due</div>
                <div className={styles.activityDescription}>Chemistry Lab Report</div>
                <div className={styles.activityTime}>Tomorrow</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.quickActionsCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiTarget />
            </div>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActionsGrid}>
            <div className={styles.quickActionButton}>
              <div className={`${styles.quickActionIcon} ${styles.blue}`}>
                <FiBookOpen />
              </div>
              <div className={styles.quickActionTitle}>View Assignments</div>
              <div className={styles.quickActionDescription}>Check pending work</div>
            </div>
            <div className={styles.quickActionButton}>
              <div className={`${styles.quickActionIcon} ${styles.purple}`}>
                <FiTarget />
              </div>
              <div className={styles.quickActionTitle}>AI Chat Assistant</div>
              <div className={styles.quickActionDescription}>Get help with studies</div>
            </div>
          </div>
        </div>
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
    <div className={styles.dashboard}>
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'faculty' && renderFacultyDashboard()}
      {user?.role === 'student' && renderStudentDashboard()}
    </div>
  )
}

export default Dashboard

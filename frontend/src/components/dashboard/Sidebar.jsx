import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  FiHome, 
  FiCalendar, 
  FiBarChart2, 
  FiMessageSquare, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import styles from '../../styles/modules/Sidebar.module.css'

const Sidebar = ({ user, isOpen, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', roles: ['admin', 'faculty', 'student'] },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance', roles: ['admin', 'faculty', 'student'] },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics', roles: ['admin', 'faculty'] },
    { path: '/chat', icon: FiMessageSquare, label: 'Chat', roles: ['admin', 'faculty', 'student'] },
    { path: '/users', icon: FiUsers, label: 'Users', roles: ['admin'] },
    { path: '/settings', icon: FiSettings, label: 'Settings', roles: ['admin', 'faculty', 'student'] }
  ]

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role?.toLowerCase())
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className={styles.sidebarToggle}
        onClick={onToggle}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className={styles.logoText}>
              <h1>CentriFlow</h1>
              <span>{user?.role} Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <item.icon className={styles.navIcon} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FiLogOut className={styles.navIcon} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

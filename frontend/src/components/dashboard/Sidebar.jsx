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
import styles from '../../styles/modules/PremiumSidebar.module.css'

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
              CF
            </div>
            <div>
              <div className={styles.logoText}>CentriFlow</div>
              <div className={styles.logoSubtext}>{user?.role} Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Main</div>
            <ul className={styles.navList}>
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path} className={styles.navItem}>
                    <Link
                      to={item.path}
                      className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                      <item.icon className={styles.navIcon} />
                      <span className={styles.navText}>{item.label}</span>
                      {item.label === 'Chat' && (
                        <span className={styles.navBadge}>3</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
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
              <div className={styles.userRole}>{user?.role}</div>
            </div>
            <FiSettings className={styles.userMenu} />
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

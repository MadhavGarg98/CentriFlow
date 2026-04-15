import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import styles from '../../styles/modules/Dashboard.module.css'

const Layout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar user={user} isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={styles.mainContent}>
        <Navbar user={user} />
        <div style={{ marginTop: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

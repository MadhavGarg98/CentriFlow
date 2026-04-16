import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import styles from '../../styles/modules/PremiumLayout.module.css'

const Layout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={styles.layout}>
      <Sidebar user={user} isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={styles.mainContent}>
        <Navbar user={user} />
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

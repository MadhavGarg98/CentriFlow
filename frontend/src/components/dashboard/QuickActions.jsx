import React from 'react'
import { FiUsers, FiCalendar, FiBarChart2, FiSettings } from 'react-icons/fi'
import styles from '../../styles/modules/Card.module.css'

const QuickActions = ({ actions }) => {
  const defaultActions = [
    {
      icon: FiUsers,
      title: 'Manage Users',
      description: 'Add and manage users',
      color: 'blue'
    },
    {
      icon: FiCalendar,
      title: 'Mark Attendance',
      description: 'Record daily attendance',
      color: 'green'
    },
    {
      icon: FiBarChart2,
      title: 'View Analytics',
      description: 'Performance insights',
      color: 'purple'
    },
    {
      icon: FiSettings,
      title: 'System Settings',
      description: 'Configure system',
      color: 'yellow'
    }
  ]

  const actionsToRender = actions || defaultActions

  return (
    <div className={styles.quickActionCard}>
      <h3 className={styles.quickActionHeader}>Quick Actions</h3>
      
      <div className={styles.quickActions}>
        {actionsToRender.map((action, index) => (
          <button key={index} className={styles.quickActionButton}>
            <action.icon className={styles.quickActionButtonIcon} />
            <div className={styles.quickActionButtonContent}>
              <div className={styles.quickActionButtonTitle}>{action.title}</div>
              <div className={styles.quickActionButtonDescription}>{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions

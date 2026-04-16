import React from 'react'
import { FiCalendar, FiTrendingUp, FiActivity, FiBook } from 'react-icons/fi'
import styles from './QuickActions.module.css'

const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'attendance',
      icon: <FiCalendar className={styles.icon} />,
      title: 'Check Attendance',
      description: 'View your attendance history and statistics',
      prompt: 'Can you help me check my attendance?'
    },
    {
      id: 'performance',
      icon: <FiTrendingUp className={styles.icon} />,
      title: 'Performance Insights',
      description: 'Get detailed analysis of your academic performance',
      prompt: 'Show me my performance insights and recommendations'
    },
    {
      id: 'risk',
      icon: <FiActivity className={styles.icon} />,
      title: 'Risk Analysis',
      description: 'Identify potential academic risks and get help',
      prompt: 'Analyze my academic risks and suggest improvements'
    },
    {
      id: 'study',
      icon: <FiBook className={styles.icon} />,
      title: 'Study Recommendations',
      description: 'Personalized study tips and resources',
      prompt: 'Give me personalized study recommendations'
    }
  ]

  const handleCardClick = (action) => {
    if (onActionClick) {
      onActionClick(action.prompt)
    }
  }

  return (
    <div className={styles.container}>
      {actions.map(action => (
        <div
          key={action.id}
          className={styles.card}
          onClick={() => handleCardClick(action)}
        >
          {action.icon}
          <div className={styles.content}>
            <h3 className={styles.title}>{action.title}</h3>
            <p className={styles.description}>{action.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickActions

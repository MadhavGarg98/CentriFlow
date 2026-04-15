import React from 'react'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import styles from '../../styles/modules/Card.module.css'

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  description, 
  color = 'blue',
  className = '' 
}) => {
  const isPositive = change > 0
  const changeValue = Math.abs(change)
  
  const getColorClass = () => {
    switch(color) {
      case 'blue': return styles.statIcon.blue
      case 'green': return styles.statIcon.green
      case 'purple': return styles.statIcon.purple
      case 'red': return styles.statIcon.red
      case 'yellow': return styles.statIcon.yellow
      default: return styles.statIcon.blue
    }
  }

  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.statHeader}>
        <div className={`${styles.statIcon} ${getColorClass()}`}>
          <Icon />
        </div>
        
        {change !== undefined && (
          <div className={`${styles.statBadge} ${isPositive ? styles.statBadge.positive : styles.statBadge.negative}`}>
            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{isPositive ? '+' : '-'}{changeValue}%</span>
          </div>
        )}
      </div>
      
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{title}</div>
      {description && (
        <div className={styles.statDescription}>{description}</div>
      )}
    </div>
  )
}

export default StatCard

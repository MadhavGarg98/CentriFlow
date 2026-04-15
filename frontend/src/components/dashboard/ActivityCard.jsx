import React from 'react'
import { FiUsers, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import styles from '../../styles/modules/Card.module.css'

const ActivityCard = ({ title, icon: Icon, activities }) => {
  return (
    <div className={styles.activityCard}>
      <div className={styles.activityHeader}>
        <Icon />
        <h3>{title}</h3>
      </div>
      
      <ul className="activityList">
        {activities?.map((activity, index) => (
          <li key={index} className="activityItem">
            <div className="activityIcon">
              {activity.type === 'user' && <FiUsers />}
              {activity.type === 'attendance' && <FiCalendar />}
              {activity.type === 'success' && <FiCheckCircle />}
              {activity.type === 'alert' && <FiAlertCircle />}
            </div>
            <div className="activityContent">
              <div className="activityTitle">{activity.title}</div>
              <div className="activityDescription">{activity.description}</div>
              <div className="activityTime">{activity.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityCard

import React from 'react'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import styles from './AttendanceActions.module.css'

const AttendanceActions = ({
  selectedStudent,
  selectedSubject,
  selectedSession,
  onMarkPresent,
  onMarkAbsent,
  isMarking = false
}) => {
  const isDisabled = !selectedStudent || !selectedSubject || !selectedSession || isMarking

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.presentButton}`}
        onClick={onMarkPresent}
        disabled={isDisabled}
      >
        <FiCheckCircle className={styles.buttonIcon} />
        {isMarking ? 'Marking...' : 'Mark Present'}
      </button>
      
      <button
        className={`${styles.button} ${styles.absentButton}`}
        onClick={onMarkAbsent}
        disabled={isDisabled}
      >
        <FiXCircle className={styles.buttonIcon} />
        Mark Absent
      </button>
    </div>
  )
}

export default AttendanceActions

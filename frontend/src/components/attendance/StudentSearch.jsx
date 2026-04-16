import React from 'react'
import { FiSearch } from 'react-icons/fi'
import styles from './StudentSearch.module.css'

const StudentSearch = ({
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedSession,
  onSessionChange,
  mode,
  onModeChange,
  subjects = [],
  sessions = []
}) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className={styles.dropdown}>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.dropdown}>
          <select
            value={selectedSession}
            onChange={(e) => onSessionChange(e.target.value)}
          >
            <option value="">Select Session</option>
            {sessions.map(session => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeButton} ${mode === 'manual' ? styles.active : ''}`}
            onClick={() => onModeChange('manual')}
          >
            Manual
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'face' ? styles.active : ''}`}
            onClick={() => onModeChange('face')}
          >
            Face Recognition
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentSearch

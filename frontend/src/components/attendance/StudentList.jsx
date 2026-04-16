import React, { useState, useMemo } from 'react'
import { FiUser, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import styles from './StudentList.module.css'

const StudentList = ({ 
  students = [], 
  selectedStudent = '', 
  onStudentSelect,
  searchTerm = '',
  className = ''
}) => {
  const [sortOrder, setSortOrder] = useState('asc')

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [students, searchTerm, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    const colors = [
      '#2563eb', // blue-600
      '#059669', // emerald-600
      '#7c3aed', // violet-600
      '#dc2626', // red-600
      '#ea580c', // orange-600
      '#0891b2'  // cyan-600
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Select Student</h3>
        <button
          onClick={toggleSortOrder}
          className={styles.sortButton}
        >
          {sortOrder === 'asc' ? (
            <FiChevronUp className={styles.sortIcon} />
          ) : (
            <FiChevronDown className={styles.sortIcon} />
          )}
          Sort A-Z
        </button>
      </div>

      {/* Student List */}
      <div className={styles.listContainer}>
        {filteredAndSortedStudents.length === 0 ? (
          <div className={styles.emptyState}>
            <FiUser className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {searchTerm ? 'No students found' : 'No students available'}
            </p>
          </div>
        ) : (
          filteredAndSortedStudents.map((student) => (
            <div
              key={student._id || student.id}
              onClick={() => onStudentSelect(student._id || student.id)}
              className={`${styles.studentItem} ${
                selectedStudent === (student._id || student.id) ? styles.selected : ''
              }`}
            >
              <div className={styles.studentContent}>
                <div 
                  className={styles.avatar}
                  style={{ backgroundColor: getAvatarColor(student.name) }}
                >
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                    />
                  ) : (
                    getInitials(student.name)
                  )}
                </div>
                
                <div className={styles.studentInfo}>
                  <p className={styles.studentName}>{student.name}</p>
                  {student.email && (
                    <p className={styles.studentEmail}>{student.email}</p>
                  )}
                  {student.id && (
                    <p className={styles.studentId}>ID: {student.id}</p>
                  )}
                </div>
                
                {selectedStudent === (student._id || student.id) && (
                  <div className={styles.selectedIndicator}>
                    <svg
                      className={styles.checkIcon}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudentList

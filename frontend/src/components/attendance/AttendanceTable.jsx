import React, { useState, useMemo } from 'react'
import { FiCalendar, FiSearch, FiCheckCircle, FiXCircle, FiAlertCircle, FiCamera } from 'react-icons/fi'
import styles from './AttendanceTable.module.css'

const AttendanceTable = ({ 
  attendanceData = [],
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  // Filter and search logic
  const filteredAttendance = useMemo(() => {
    let filtered = attendanceData.filter(record => {
      const matchesSearch = 
        record.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.verificationMethod?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter

      const matchesDate = dateFilter 
        ? new Date(record.date).toDateString() === new Date(dateFilter).toDateString()
        : true

      return matchesSearch && matchesStatus && matchesDate
    })

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    return filtered
  }, [attendanceData, searchTerm, statusFilter, dateFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredAttendance.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const paginatedData = filteredAttendance.slice(startIndex, startIndex + recordsPerPage)

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'present'
      case 'absent':
        return 'absent'
      case 'late':
        return 'late'
      default:
        return 'present'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheckCircle className={styles.statusIcon} />
      case 'absent':
        return <FiXCircle className={styles.statusIcon} />
      case 'late':
        return <FiAlertCircle className={styles.statusIcon} />
      default:
        return null
    }
  }

  const getMethodIcon = (method) => {
    return method === 'face-recognition' ? 
      <FiCamera className={styles.methodIcon} /> : 
      <FiCalendar className={styles.methodIcon} />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <h3 className={styles.title}>Attendance Records</h3>
          </div>
          
          <div className={styles.controls}>
            <div className={styles.searchInput}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className={styles.filter}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            
            <div className={styles.filter}>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {filteredAttendance.length === 0 ? (
          <div className={styles.emptyState}>
            <FiCalendar className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No attendance records found</p>
            <p className={styles.emptyText}>
              {searchTerm || statusFilter !== 'all' || dateFilter 
                ? 'Try adjusting your filters' 
                : 'Start marking attendance to see records here'}
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Student</th>
                <th className={styles.th}>Subject</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Method</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record) => (
                <tr key={record._id} className={styles.tr}>
                  <td className={styles.td}>
                    {formatDate(record.date)}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.studentCell}>
                      <div 
                        className={styles.avatar}
                        style={{ backgroundColor: getAvatarColor(record.student?.name || 'Unknown') }}
                      >
                        {getInitials(record.student?.name || 'Unknown')}
                      </div>
                      <div className={styles.studentInfo}>
                        <p className={styles.studentName}>
                          {record.student?.name || 'Unknown Student'}
                        </p>
                        {record.student?.id && (
                          <p className={styles.studentId}>
                            ID: {record.student.id}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    {record.subject}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${styles[getStatusColor(record.status)]}`}>
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.methodCell}>
                      {getMethodIcon(record.verificationMethod)}
                      <span>
                        {record.verificationMethod === 'face-recognition' 
                          ? 'Face Recognition' 
                          : 'Manual'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredAttendance.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredAttendance.length)} of{' '}
            {filteredAttendance.length} records
          </div>
          
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationButton}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className={styles.pageIndicator}>
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              className={styles.paginationButton}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceTable

import React, { useState, useMemo } from 'react'
import { FiCalendar, FiFilter, FiCheckCircle, FiXCircle, FiAlertCircle, FiCamera } from 'react-icons/fi'
import SearchInput from './SearchInput'

const AttendanceTable = ({ 
  attendanceData = [], 
  className = '',
  maxHeight = '500px'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheckCircle className="w-4 h-4" />
      case 'absent':
        return <FiXCircle className="w-4 h-4" />
      case 'late':
        return <FiAlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getMethodIcon = (method) => {
    return method === 'face-recognition' ? 
      <FiCamera className="w-4 h-4" /> : 
      <FiCalendar className="w-4 h-4" />
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
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Attendance Records</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:w-64"
            />
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredAttendance.length === 0 ? (
          <div className="p-12 text-center">
            <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No attendance records found</p>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter 
                ? 'Try adjusting your filters' 
                : 'Start marking attendance to see records here'}
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight }}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendance.map((record, index) => (
                  <tr
                    key={record._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${getAvatarColor(record.student?.name || 'Unknown')} rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                          {getInitials(record.student?.name || 'Unknown')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {record.student?.name || 'Unknown Student'}
                          </p>
                          {record.student?.id && (
                            <p className="text-xs text-gray-500">
                              ID: {record.student.id}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.subject}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
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
          </div>
        )}
      </div>

      {/* Footer with count */}
      {filteredAttendance.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredAttendance.length}</span> of{' '}
            <span className="font-medium">{attendanceData.length}</span> records
          </p>
        </div>
      )}
    </div>
  )
}

export default AttendanceTable

import React, { useState, useMemo } from 'react'
import { FiUser, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import SearchInput from './SearchInput'

const StudentList = ({ 
  students = [], 
  selectedStudent = '', 
  onStudentSelect, 
  className = '',
  maxHeight = '400px'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Select Student</h3>
          <button
            onClick={toggleSortOrder}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <FiChevronUp className="w-4 h-4" />
            ) : (
              <FiChevronDown className="w-4 h-4" />
            )}
            <span>Sort A-Z</span>
          </button>
        </div>
        
        <SearchInput
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Student List */}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredAndSortedStudents.length === 0 ? (
          <div className="p-8 text-center">
            <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {searchTerm ? 'No students found' : 'No students available'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAndSortedStudents.map((student) => (
              <div
                key={student._id || student.id}
                onClick={() => onStudentSelect(student._id || student.id)}
                className={`p-3 cursor-pointer transition-all duration-200 ${
                  selectedStudent === (student._id || student.id)
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getAvatarColor(student.name)} rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(student.name)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {student.name}
                    </p>
                    {student.id && (
                      <p className="text-xs text-gray-500">
                        ID: {student.id}
                      </p>
                    )}
                    {student.email && (
                      <p className="text-xs text-gray-500 truncate">
                        {student.email}
                      </p>
                    )}
                  </div>
                  
                  {selectedStudent === (student._id || student.id) && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentList

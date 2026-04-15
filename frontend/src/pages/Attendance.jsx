import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiCamera, FiUser, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { attendanceAPI, usersAPI } from '../services/api'
import toast from 'react-hot-toast'

const Attendance = () => {
  const { user } = useAuth()
  const [attendanceData, setAttendanceData] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAttendance, setMarkingAttendance] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [useFaceRecognition, setUseFaceRecognition] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology']
  const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024']

  useEffect(() => {
    fetchAttendanceData()
    if (user?.role === 'faculty' || user?.role === 'admin') {
      fetchStudents()
    }
  }, [])

  const fetchAttendanceData = async () => {
    try {
      const response = await attendanceAPI.getAttendance()
      if (response.data.success) {
        setAttendanceData(response.data.data.attendance)
      }
    } catch (error) {
      toast.error('Failed to fetch attendance data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await usersAPI.getStudents()
      if (response.data.success) {
        setStudents(response.data.data.students)
      }
    } catch (error) {
      toast.error('Failed to fetch students')
    }
  }

  const handleMarkAttendance = async (status = 'present') => {
    if (!selectedStudent || !selectedSubject || !selectedSemester) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setMarkingAttendance(true)
      const response = await attendanceAPI.markAttendance({
        student: selectedStudent,
        subject: selectedSubject,
        semester: selectedSemester,
        status
      })

      if (response.data.success) {
        toast.success('Attendance marked successfully')
        fetchAttendanceData()
        setSelectedStudent('')
        setSelectedSubject('')
        setSelectedSemester('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setMarkingAttendance(false)
    }
  }

  const handleFaceRecognition = async () => {
    if (!selectedSubject || !selectedSemester) {
      toast.error('Please select subject and semester')
      return
    }

    if (!capturedImage) {
      toast.error('Please capture an image first')
      return
    }

    try {
      setMarkingAttendance(true)
      const formData = new FormData()
      formData.append('image', capturedImage)
      formData.append('subject', selectedSubject)
      formData.append('semester', selectedSemester)

      const response = await attendanceAPI.markAttendanceWithFace(formData)
      
      if (response.data.success) {
        toast.success(`Attendance marked for ${response.data.data.student.name}`)
        fetchAttendanceData()
        setCapturedImage(null)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Face recognition failed')
    } finally {
      setMarkingAttendance(false)
    }
  }

  const handleImageCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCapturedImage(file)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-100'
      case 'absent':
        return 'text-red-600 bg-red-100'
      case 'late':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h1>
        <p className="text-gray-600">
          {user?.role === 'student' && 'View your attendance records and statistics.'}
          {(user?.role === 'faculty' || user?.role === 'admin') && 'Mark attendance and view attendance records.'}
        </p>
      </motion.div>

      {(user?.role === 'faculty' || user?.role === 'admin') && (
        /* Mark Attendance Section */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Mark Attendance</h2>
          
          {/* Toggle between manual and face recognition */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUseFaceRecognition(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !useFaceRecognition
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Manual Marking
            </button>
            <button
              onClick={() => setUseFaceRecognition(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                useFaceRecognition
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Face Recognition
            </button>
          </div>

          {!useFaceRecognition ? (
            /* Manual Attendance Form */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="input"
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="input"
                >
                  <option value="">Select Semester</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end space-x-2">
                <button
                  onClick={() => handleMarkAttendance('present')}
                  disabled={markingAttendance}
                  className="btn btn-primary flex-1"
                >
                  {markingAttendance ? 'Marking...' : 'Mark Present'}
                </button>
                <button
                  onClick={() => handleMarkAttendance('absent')}
                  disabled={markingAttendance}
                  className="btn btn-secondary flex-1"
                >
                  Mark Absent
                </button>
              </div>
            </div>
          ) : (
            /* Face Recognition Form */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capture Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {capturedImage ? (
                    <div className="space-y-4">
                      <img
                        src={URL.createObjectURL(capturedImage)}
                        alt="Captured"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setCapturedImage(null)}
                        className="btn btn-secondary"
                      >
                        Retake Photo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FiCamera className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-600">Capture student photo for attendance</p>
                      <label className="btn btn-primary cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageCapture}
                          className="hidden"
                        />
                        Capture Photo
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="input"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="input"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(semester => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleFaceRecognition}
                  disabled={markingAttendance}
                  className="btn btn-primary w-full"
                >
                  {markingAttendance ? 'Processing...' : 'Mark Attendance with Face Recognition'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Attendance Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Attendance Records</h2>
        
        {attendanceData.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No attendance records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Method</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <motion.tr
                    key={record._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {record.student?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-800">{record.student?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{record.subject}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span>{record.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.verificationMethod === 'face-recognition' ? 'Face Recognition' : 'Manual'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Attendance

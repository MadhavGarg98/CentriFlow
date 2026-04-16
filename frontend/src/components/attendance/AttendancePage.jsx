import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { attendanceAPI, usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

// Import components
import StudentSearch from './StudentSearch'
import StudentList from './StudentList'
import AttendanceActions from './AttendanceActions'
import AttendanceTable from './AttendanceTable'

import styles from './AttendancePage.module.css'

const AttendancePage = () => {
  const { user } = useAuth()
  
  // State
  const [attendanceData, setAttendanceData] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAttendance, setMarkingAttendance] = useState(false)
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSession, setSelectedSession] = useState('')
  const [mode, setMode] = useState('manual')
  const [capturedImage, setCapturedImage] = useState(null)
  
  // Static data
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology']
  const sessions = ['Fall 2024', 'Spring 2024', 'Summer 2024']

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
        setAttendanceData(response.data.data.attendance || [])
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
        setStudents(response.data.data.students || [])
      }
    } catch (error) {
      toast.error('Failed to fetch students')
    }
  }

  const handleMarkAttendance = async (status = 'present') => {
    if (!selectedStudent || !selectedSubject || !selectedSession) {
      toast.error('Please select a student, subject, and session')
      return
    }

    try {
      setMarkingAttendance(true)
      const response = await attendanceAPI.markAttendance({
        student: selectedStudent,
        subject: selectedSubject,
        semester: selectedSession,
        status
      })

      if (response.data.success) {
        toast.success(`Attendance marked as ${status}`)
        fetchAttendanceData()
        setSelectedStudent('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setMarkingAttendance(false)
    }
  }

  const handleFaceRecognition = async () => {
    if (!selectedSubject || !selectedSession) {
      toast.error('Please select subject and session')
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
      formData.append('semester', selectedSession)

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

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <h1 className={styles.title}>Attendance Management</h1>
        <p className={styles.subtitle}>Mark and track attendance efficiently</p>
      </motion.div>

      {(user?.role === 'faculty' || user?.role === 'admin') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.content}
        >
          {/* Student Selection Section - Always Visible */}
          <div className={styles.studentSection}>
            {/* Search and Filters */}
            <StudentSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedSession={selectedSession}
              onSessionChange={setSelectedSession}
              mode={mode}
              onModeChange={setMode}
              subjects={subjects}
              sessions={sessions}
            />

            {/* Student List */}
            <StudentList
              students={students}
              selectedStudent={selectedStudent}
              onStudentSelect={setSelectedStudent}
              searchTerm={searchTerm}
            />

            {/* Action Buttons */}
            {mode === 'manual' && (
              <AttendanceActions
                selectedStudent={selectedStudent}
                selectedSubject={selectedSubject}
                selectedSession={selectedSession}
                onMarkPresent={() => handleMarkAttendance('present')}
                onMarkAbsent={() => handleMarkAttendance('absent')}
                isMarking={markingAttendance}
              />
            )}
          </div>

          {/* Face Recognition Panel - Right Side */}
          {mode === 'face' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.faceRecognitionPanel}
            >
              <h3 className={styles.faceRecognitionTitle}>Face Recognition</h3>
              
              <div className={styles.faceRecognitionContent}>
                <div className={styles.photoSection}>
                  <label className={styles.label}>Capture Photo</label>
                  <div className={styles.photoDropzone}>
                    {capturedImage ? (
                      <div>
                        <img
                          src={URL.createObjectURL(capturedImage)}
                          alt="Captured"
                          className={styles.photoPreview}
                        />
                        <button
                          onClick={() => setCapturedImage(null)}
                          className={styles.retakeButton}
                        >
                          Retake Photo
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiCamera className={styles.photoIcon} />
                        <p className={styles.photoText}>Capture student photo for attendance</p>
                        <label className={styles.captureButton}>
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
                
                <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Session</label>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option value="">Select Session</option>
                      {sessions.map(session => (
                        <option key={session} value={session}>{session}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleFaceRecognition}
                    disabled={markingAttendance || !capturedImage || !selectedSubject || !selectedSession}
                    className={styles.submitButton}
                  >
                    {markingAttendance ? 'Processing...' : 'Mark Attendance with Face Recognition'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Attendance Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={styles.recordsSection}
      >
        <AttendanceTable
          attendanceData={attendanceData}
        />
      </motion.div>
    </div>
  )
}

export default AttendancePage

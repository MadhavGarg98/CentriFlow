import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

// Import components
import QuickActions from './QuickActions'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

import styles from './ChatPage.module.css'

const ChatPage = () => {
  const { user } = useAuth()
  
  // State
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'ai',
      content: `Hello ${user?.name || 'there'}! I'm your AI assistant. I can help you with attendance tracking, performance insights, study recommendations, and much more. How can I assist you today?`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [user])

  const handleSendMessage = async (content) => {
    if (!content.trim()) return

    // Add user message
    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          content: generateAIResponse(content),
          timestamp: new Date()
        }

        setMessages(prev => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    } catch (error) {
      toast.error('Failed to send message')
      setIsTyping(false)
    }
  }

  const handleQuickAction = (prompt) => {
    handleSendMessage(prompt)
  }

  const generateAIResponse = (userMessage) => {
    const responses = {
      'attendance': "I can help you check your attendance! Based on your recent records, you have an attendance rate of 92%. You've missed 3 classes this month. Would you like me to show you a detailed breakdown?",
      'performance': "Great question about your performance! Your current GPA is 3.7, with strong performance in Mathematics and Computer Science. I notice room for improvement in Physics. Would you like specific study recommendations?",
      'risk': "I've analyzed your academic patterns. You're at low risk overall, but I notice some concerning trends in your recent assignment submissions. Let me create a personalized improvement plan for you.",
      'study': "Based on your learning style and current subjects, I recommend the Pomodoro Technique for focused study sessions. Try 25-minute focused blocks with 5-minute breaks. Would you like me to create a study schedule?",
      'default': "I understand you need help with that. Let me analyze your request and provide you with the best possible assistance. Could you give me more details about what specifically you'd like help with?"
    }

    const lowerMessage = userMessage.toLowerCase()
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    
    return responses.default
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <h1 className={styles.title}>AI Assistant</h1>
        <p className={styles.subtitle}>Get personalized help with your academic journey</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <QuickActions onActionClick={handleQuickAction} />
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={styles.chatContainer}
      >
        {messages.length === 1 ? (
          <div className={styles.welcomeMessage}>
            <h2 className={styles.welcomeTitle}>Welcome to Your AI Assistant</h2>
            <p className={styles.welcomeText}>
              Feel free to ask me anything about your academics, attendance, or get personalized recommendations. 
              You can also use the quick action cards above for common requests.
            </p>
          </div>
        ) : (
          <>
            <ChatMessages messages={messages} isTyping={isTyping} />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isLoading || isTyping}
            />
          </>
        )}
      </motion.div>
    </div>
  )
}

export default ChatPage

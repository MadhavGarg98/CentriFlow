import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMessageCircle, FiUser, FiLoader } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { chatAPI } from '../services/api'
import toast from 'react-hot-toast'

const Chat = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
    
    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ])
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await chatAPI.sendMessage({
        message: inputMessage,
        userId: user?.id
      })

      setMessages(prev => [...prev, 
        {
          id: Date.now(),
          type: 'user',
          content: inputMessage,
          timestamp: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          type: 'assistant',
          content: response.data.response,
          timestamp: new Date().toISOString()
        }
      ])

      setInputMessage('')
    } catch (error) {
      toast.error('Failed to send message')
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
    inputRef.current?.focus()
  }

  const formatMessage = (content) => {
    // Convert newlines to <br> and basic formatting
    return content
      .split('\n')
      .map((line, index) => (
        <span key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}
        </span>
      ))
  }

  const quickQuestions = [
    "What is my current attendance?",
    "How am I performing this semester?",
    "What are my risk factors?",
    "Give me study recommendations",
    "Show me my recent progress"
  ]

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:col-span-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Assistant</h1>
        <p className="text-gray-600">Get personalized help with your academic journey</p>
      </motion.div>

      {/* Quick Questions Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1"
      >
        <div className={styles.section}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Questions</h3>
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleQuickQuestion(question)}
                className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all text-sm text-gray-700"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chat Tips */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1"
      >
        <div className={styles.section}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be specific in your questions</li>
            <li>• Ask about attendance, grades, or recommendations</li>
            <li>• I can analyze your performance trends</li>
            <li>• Available 24/7 for your queries</li>
          </ul>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 flex flex-col"
      >
        <div className={styles.section}>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px]">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {message.type === 'user' ? (
                      <FiUser className="w-4 h-4" />
                    ) : (
                      <FiMessageCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {formatMessage(message.content)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center space-x-3 p-4 border-t border-gray-200">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSend className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Chat

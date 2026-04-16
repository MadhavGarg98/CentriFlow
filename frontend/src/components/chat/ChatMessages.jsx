import React, { useEffect, useRef } from 'react'
import { FiUser, FiCpu } from 'react-icons/fi'
import styles from './ChatMessages.module.css'

const ChatMessages = ({ messages = [], isTyping = false }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date) => {
    const today = new Date()
    const messageDate = new Date(date)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true
    
    const currentDate = new Date(currentMessage.timestamp).toDateString()
    const previousDate = new Date(previousMessage.timestamp).toDateString()
    
    return currentDate !== previousDate
  }

  return (
    <div className={styles.container}>
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1]
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage)
        
        return (
          <React.Fragment key={message.id}>
            {showDateSeparator && (
              <div className={styles.dateSeparator}>
                <div className={styles.dateLine} />
                <span className={styles.dateText}>
                  {formatDate(message.timestamp)}
                </span>
              </div>
            )}
            
            <div
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div
                className={`${styles.bubble} ${
                  message.sender === 'user' ? styles.userBubble : styles.aiBubble
                }`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
              </div>
              
              <div
                className={`${styles.timestamp} ${
                  message.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </React.Fragment>
        )
      })}
      
      {isTyping && (
        <div className={`${styles.message} ${styles.aiMessage}`}>
          <div className={styles.typingIndicator}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages

import React, { useState, useRef, useEffect } from 'react'
import { FiSend, FiPaperclip } from 'react-icons/fi'
import styles from './ChatInput.module.css'

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef(null)

  const handleSend = () => {
    if (message.trim() && !disabled && !isComposing) {
      onSendMessage(message.trim())
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  useEffect(() => {
    // Focus input on mount
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className={styles.container}>
      <button className={styles.attachButton} title="Attach file">
        <FiPaperclip className={styles.attachIcon} />
      </button>
      
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="Type your message..."
          className={styles.input}
          disabled={disabled}
          rows={1}
        />
      </div>
      
      <button
        className={styles.sendButton}
        onClick={handleSend}
        disabled={disabled || !message.trim() || isComposing}
        title="Send message"
      >
        <FiSend className={styles.sendIcon} />
      </button>
    </div>
  )
}

export default ChatInput

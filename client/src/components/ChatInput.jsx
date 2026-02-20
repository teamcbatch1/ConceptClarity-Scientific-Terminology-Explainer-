import { useState, useRef } from 'react'
import { useChat } from '../context/ChatContext'
import { chatService } from '../services/chatService'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const { currentChat, addMessage, setLoading: setChatLoading, createNewChat } = useChat()
  const recognitionRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim() && selectedFiles.length === 0) return

    const userMessage = message.trim()

    // If no current chat, create one first with the message as title
    let chatId = currentChat
    let isNewChat = false
    if (!chatId) {
      try {
        const chatTitle = userMessage.slice(0, 50) || 'New Chat'
        const newChatResponse = await chatService.createChat(chatTitle)
        chatId = newChatResponse.data._id
        isNewChat = true
        if (createNewChat) {
          createNewChat(newChatResponse.data)
        }
      } catch (error) {
        console.error('Error creating chat:', error)
        return
      }
    }

    // Add user message immediately
    addMessage({
      message: userMessage,
      sender: 'user',
      sentiment: 'neutral',
      timestamp: new Date(),
      files: selectedFiles,
      isTyping: false
    })

    setMessage('')
    setSelectedFiles([])
    setLoading(true)
    setChatLoading(true)

    try {
      const response = await chatService.sendMessage(chatId, userMessage)
      
      // Add bot message with typing effect
      addMessage({
        message: response.data.botMessage.message,
        sender: 'bot',
        sentiment: 'neutral',
        timestamp: response.data.botMessage.createdAt,
        isTyping: true
      })
      
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage({
        message: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        sentiment: 'neutral',
        timestamp: new Date(),
        isTyping: false
      })
    } finally {
      setLoading(false)
      setChatLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage(prev => prev + ' ' + transcript)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleNewChat = async () => {
    try {
      const response = await chatService.createChat('New Chat')
      if (createNewChat) {
        createNewChat(response.data)
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files)
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }))
    setSelectedFiles(prev => [...prev, ...fileData])
    setShowAttachMenu(false)
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap max-w-5xl mx-auto">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
                  <span className="text-2xl">📄</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <p className="text-xs text-center mt-1 truncate w-20">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-center max-w-5xl mx-auto">
        {/* New Chat Button */}
        <button
          type="button"
          onClick={handleNewChat}
          className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110 group"
          title="New Chat"
        >
          <svg 
            className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Attach Files Button with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110 group"
            title="Attach files"
          >
            <svg 
              className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 w-48 animate-fadeIn">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-xl">📷</span>
                <span>Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-xl">📁</span>
                <span>Upload File</span>
              </button>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e, 'image')}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e, 'file')}
            className="hidden"
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about FinTech concepts..."
          className="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          disabled={loading}
        />

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title={isListening ? 'Stop Recording' : 'Voice Input'}
          disabled={loading}
        >
          <svg 
            className={`w-5 h-5 ${isListening ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || (!message.trim() && selectedFiles.length === 0)}
          className="btn-primary shimmer bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Send
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </button>
      </div>

      {isListening && (
        <div className="text-center mt-2 text-sm text-red-600 dark:text-red-400 animate-pulse">
          🎤 Listening... Speak now
        </div>
      )}
    </form>
  )
}

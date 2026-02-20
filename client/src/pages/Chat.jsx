import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { chatService } from '../services/chatService'
import Sidebar from '../components/Sidebar'
import ChatBubble from '../components/ChatBubble'
import ChatInput from '../components/ChatInput'
import AdminNavbar from '../components/AdminNavbar'
import UserNavbar from '../components/UserNavbar'
import FeedbackPopup from '../components/FeedbackPopup'

export default function Chat() {
  const { user, loading: authLoading } = useAuth()
  const { messages, currentChat, setCurrentChat, setChatHistory } = useChat()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false)
  const messagesEndRef = useRef(null)
  const lastMessageCountRef = useRef(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show feedback popup after bot response (only for users, not admins)
  useEffect(() => {
    if (user?.role !== 'admin' && messages.length > lastMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.sender === 'bot' && !lastMessage.isTyping) {
        // Show popup 2 seconds after bot response
        const timer = setTimeout(() => {
          setShowFeedbackPopup(true)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
    lastMessageCountRef.current = messages.length
  }, [messages, user])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && !authLoading) {
      loadChats()
    }
  }, [user, authLoading])

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat)
    }
  }, [currentChat])

  const loadChats = async () => {
    try {
      const response = await chatService.getChats()
      setChatHistory(response.data)
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId) => {
    setLoadingMessages(true)
    try {
      const response = await chatService.getMessages(chatId)
      const formattedMessages = response.data.map(msg => ({
        message: msg.message,
        sender: msg.sender,
        sentiment: msg.sentiment,
        timestamp: msg.createdAt,
        isTyping: false
      }))
      setCurrentChat(chatId, formattedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleFeedbackYes = () => {
    setShowFeedbackPopup(false)
    navigate('/user/feedback', { state: { chatId: currentChat } })
  }

  const handleFeedbackNotNow = () => {
    setShowFeedbackPopup(false)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {user?.role === 'admin' ? <AdminNavbar /> : <UserNavbar />}
      
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 w-full lg:w-auto">
          <div className="flex-1 overflow-auto p-2 sm:p-4 space-y-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-2xl px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome, {user?.username || 'User'}! 👋
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
                    Your AI-powered learning assistant is ready to help you understand any concept
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                      <div className="text-2xl sm:text-3xl mb-3">💡</div>
                      <h3 className="font-bold text-base sm:text-lg mb-2">Ask Questions</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Get instant explanations about any topic - technology, science, history, and more
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                      <div className="text-2xl sm:text-3xl mb-3">🎯</div>
                      <h3 className="font-bold text-base sm:text-lg mb-2">Learn Concepts</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Understand complex topics explained in simple, structured terms
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                      <div className="text-2xl sm:text-3xl mb-3">📚</div>
                      <h3 className="font-bold text-base sm:text-lg mb-2">Save History</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        All your conversations are saved for future reference
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                      <div className="text-2xl sm:text-3xl mb-3">🚀</div>
                      <h3 className="font-bold text-base sm:text-lg mb-2">Multi-Modal</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Use text, voice, or images to ask your questions
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                      💬 <strong>Tip:</strong> Start by typing your question in the input box below or use the voice assistant
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <ChatBubble 
                    key={idx} 
                    message={msg.message}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    isTyping={msg.isTyping}
                    chatId={currentChat}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <ChatInput />
        </div>
      </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <FeedbackPopup
          onYes={handleFeedbackYes}
          onNotNow={handleFeedbackNotNow}
        />
      )}
    </div>
  )
}

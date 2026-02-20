import { createContext, useState, useContext } from 'react'

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [loading, setLoading] = useState(false)

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message])
  }

  const clearMessages = () => {
    setMessages([])
  }

  const createChat = (chatId, title) => {
    const newChat = {
      _id: chatId,
      title,
      createdAt: new Date()
    }
    setChatHistory((prev) => [newChat, ...prev])
    setCurrentChat(chatId)
    clearMessages()
    return newChat
  }

  const createNewChat = (chatData) => {
    setChatHistory((prev) => [chatData, ...prev])
    setCurrentChat(chatData._id)
    clearMessages()
    return chatData
  }

  const setCurrentChatWithMessages = (chatId, chatMessages = []) => {
    setCurrentChat(chatId)
    setMessages(chatMessages)
  }

  const deleteChat = (chatId) => {
    setChatHistory((prev) => prev.filter(chat => chat._id !== chatId))
    if (currentChat === chatId) {
      setCurrentChat(null)
      clearMessages()
    }
  }

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      chatHistory,
      setChatHistory,
      createChat,
      createNewChat,
      deleteChat,
      currentChat,
      setCurrentChat: setCurrentChatWithMessages,
      loading,
      setLoading
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)

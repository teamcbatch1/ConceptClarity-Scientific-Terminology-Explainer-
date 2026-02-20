import api from './api'

export const chatService = {
  createChat: (title) => api.post('/chat/create', { title }),
  sendMessage: (chatId, message) => api.post('/chat/send', { chatId, message }),
  getChats: () => api.get('/chat'),
  getMessages: (chatId) => api.get(`/chat/${chatId}`),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`)
}

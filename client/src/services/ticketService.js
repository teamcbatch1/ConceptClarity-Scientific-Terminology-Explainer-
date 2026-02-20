import api from './api'

export const ticketService = {
  // Create a new ticket
  createTicket: async (ticketData) => {
    return await api.post('/tickets/create', ticketData)
  },

  // Get user's tickets
  getMyTickets: async () => {
    return await api.get('/tickets/my-tickets')
  },

  // Get all tickets (admin only)
  getAllTickets: async () => {
    return await api.get('/tickets/all')
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    return await api.get(`/tickets/${id}`)
  },

  // Update ticket (admin only)
  updateTicket: async (id, updateData) => {
    return await api.put(`/tickets/${id}`, updateData)
  },

  // Get ticket statistics (admin only)
  getTicketStats: async () => {
    return await api.get('/tickets/stats')
  }
}

export const notificationService = {
  // Get user's notifications
  getNotifications: async () => {
    return await api.get('/notifications')
  },

  // Get unread count
  getUnreadCount: async () => {
    return await api.get('/notifications/unread-count')
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return await api.put(`/notifications/${id}/read`)
  },

  // Mark all as read
  markAllAsRead: async () => {
    return await api.put('/notifications/mark-all-read')
  }
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminNavbar from '../components/AdminNavbar'
import { ticketService } from '../services/ticketService'

export default function AdminSupport() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({ pending: 0, active: 0, resolved: 0 })
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (user && user.role !== 'admin') {
      navigate('/chat')
    } else if (user && user.role === 'admin') {
      loadData()
    }
  }, [user, loading, navigate])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await Promise.all([fetchTickets(), fetchStats()])
    } catch (err) {
      setError('Failed to load support data')
      console.error('Load data error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTickets = async () => {
    try {
      console.log('Fetching all tickets...')
      const response = await ticketService.getAllTickets()
      console.log('Tickets response:', response.data)
      setTickets(response.data.tickets || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      console.error('Error details:', error.response?.data)
      setTickets([])
      throw error
    }
  }

  const fetchStats = async () => {
    try {
      console.log('Fetching stats...')
      const response = await ticketService.getTicketStats()
      console.log('Stats response:', response.data)
      setStats(response.data.stats || { pending: 0, active: 0, resolved: 0 })
    } catch (error) {
      console.error('Error fetching stats:', error)
      console.error('Error details:', error.response?.data)
      setStats({ pending: 0, active: 0, resolved: 0 })
      throw error
    }
  }

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
    setShowReplyForm(false)
    setReplyText('')
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedTicket) return

    setIsSubmitting(true)
    try {
      await ticketService.updateTicket(selectedTicket._id, {
        adminReply: replyText,
        status: 'active'
      })
      
      // Refresh tickets and close modal
      await loadData()
      setSelectedTicket(null)
      setShowReplyForm(false)
      setReplyText('')
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('Failed to submit reply. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await ticketService.updateTicket(ticketId, { status: newStatus })
      await loadData()
      if (selectedTicket && selectedTicket._id === ticketId) {
        const updatedTicket = tickets.find(t => t._id === ticketId)
        if (updatedTicket) {
          setSelectedTicket({ ...updatedTicket, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return '🔧'
      case 'Account Information': return '👤'
      case 'billing': return '💳' // Keep for backward compatibility
      case 'general': return '💬'
      case 'other': return '📝'
      default: return '❓'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading support center...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminNavbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              Support Center 🎧
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Manage support requests and help users
            </p>
          </div>

          {/* Support Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <span className="text-3xl">⏳</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <span className="text-3xl">💬</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <span className="text-3xl">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Support Tickets</h2>
            
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎧</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No support tickets yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Support tickets from users will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket._id} 
                    onClick={() => handleTicketClick(ticket)}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{getCategoryIcon(ticket.category)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{ticket.subject}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                            <span>👤 {ticket.userId?.username || 'Unknown'}</span>
                            <span>📧 {ticket.userId?.email || 'N/A'}</span>
                            <span>🕒 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(ticket._id, ticket.status === 'resolved' ? 'pending' : 'resolved')
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                            ticket.status === 'resolved'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200'
                          }`}
                        >
                          {ticket.status === 'resolved' ? 'Reopen' : 'Resolve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal with Reply Form */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white relative">
              <button
                onClick={() => {
                  setSelectedTicket(null)
                  setShowReplyForm(false)
                  setReplyText('')
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold pr-10">Ticket Details</h2>
              <p className="text-sm opacity-90 mt-1">#{selectedTicket._id?.slice(-8)}</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Status & Actions */}
              <div className="flex items-center justify-between mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                </span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* User Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">User Information</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {selectedTicket.userId?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.userId?.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTicket.userId?.email}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subject</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTicket.subject}</p>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Category</label>
                <p className="text-gray-900 dark:text-white capitalize flex items-center gap-2">
                  <span>{getCategoryIcon(selectedTicket.category)}</span>
                  {selectedTicket.category}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Description</label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Time */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Created At</label>
                <p className="text-gray-900 dark:text-white">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>

              {/* Admin Reply */}
              {selectedTicket.adminReply && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Your Reply</label>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedTicket.adminReply}</p>
                    {selectedTicket.repliedAt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Replied: {new Date(selectedTicket.repliedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              {showReplyForm ? (
                <form onSubmit={handleReplySubmit} className="mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {selectedTicket.adminReply ? 'Update Reply' : 'Send Reply'}
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary resize-none"
                    rows="4"
                    required
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplyForm(false)
                        setReplyText('')
                      }}
                      className="px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setShowReplyForm(true)
                    setReplyText(selectedTicket.adminReply || '')
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {selectedTicket.adminReply ? 'Update Reply' : 'Reply to Ticket'}
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-6">
              <button
                onClick={() => {
                  setSelectedTicket(null)
                  setShowReplyForm(false)
                  setReplyText('')
                }}
                className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

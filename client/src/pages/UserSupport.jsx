import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import UserNavbar from '../components/UserNavbar'
import { ticketService } from '../services/ticketService'
import TicketDetailModal from '../components/TicketDetailModal'

export default function UserSupport() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Technical',
    description: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getMyTickets()
      setTickets(response.data.tickets || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setTickets([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await ticketService.createTicket(formData)
      setSubmitted(true)
      fetchTickets()
      
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ subject: '', category: 'Technical', description: '' })
      }, 3000)
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const openTickets = tickets.filter(t => t.status === 'pending' || t.status === 'active').length
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <UserNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Support Center 🎫</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Need help? We're here for you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Submit a Support Ticket</h2>

              {submitted && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-4 py-4 rounded-lg mb-6 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="font-semibold">Ticket submitted successfully! We'll get back to you soon.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Technical">Technical Issue</option>
                    <option value="Account Information">Account Information</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          </div>

          {/* Support Info Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
              <h3 className="text-xl font-bold mb-4">Your Tickets</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all duration-300 cursor-pointer group">
                  <span className="font-semibold group-hover:scale-105 transition-transform">Open</span>
                  <span className="text-2xl font-bold text-yellow-600 animate-pulse group-hover:animate-bounce">{openTickets}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 cursor-pointer group">
                  <span className="font-semibold group-hover:scale-105 transition-transform">Resolved</span>
                  <span className="text-2xl font-bold text-green-600 animate-pulse group-hover:animate-bounce">{resolvedTickets}</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Help</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <p className="font-semibold text-sm">How to reset password?</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <p className="font-semibold text-sm">Update profile picture</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <p className="font-semibold text-sm">Chat not working?</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
              <h3 className="text-xl font-bold mb-3">Need Urgent Help?</h3>
              <p className="text-sm mb-4">Our support team is available 24/7</p>
              <div className="space-y-2 text-sm">
                <a 
                  href="mailto:support@conceptclarity.com"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <span className="group-hover:animate-bounce">📧</span>
                  <span className="group-hover:underline">support@conceptclarity.com</span>
                </a>
                <a 
                  href="tel:+15551234567"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <span className="group-hover:animate-bounce">📞</span>
                  <span className="group-hover:underline">+1 (555) 123-4567</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* My Tickets Section - Full Width Below */}
        {tickets.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <div 
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:scale-102 hover:shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1">{ticket.subject}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold whitespace-nowrap ml-2 ${
                      ticket.status === 'pending' 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                        : ticket.status === 'active'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="flex items-center gap-1">
                      📁 {ticket.category}
                    </span>
                    <span className="flex items-center gap-1">
                      🕒 {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.adminReply && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                        💬 Admin replied
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { feedbackService } from '../services/feedbackService'
import { chatService } from '../services/chatService'
import UserNavbar from '../components/UserNavbar'
import FeedbackDetailModal from '../components/FeedbackDetailModal'

export default function UserFeedback() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  // Feedback form state
  const [showForm, setShowForm] = useState(false)
  const [chats, setChats] = useState([])
  const [formData, setFormData] = useState({
    chatId: '',
    category: 'Topic Response Quality',
    feedbackText: '',
    stars: 0
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      loadFeedbacks()
      loadChats()
    }
  }, [user])

  // Check if redirected from chat with chatId
  useEffect(() => {
    if (location.state?.chatId) {
      setFormData(prev => ({ ...prev, chatId: location.state.chatId }))
      setShowForm(true)
    }
  }, [location.state])

  const loadFeedbacks = async () => {
    try {
      const response = await feedbackService.getUserFeedbacks()
      setFeedbacks(response.data)
    } catch (error) {
      console.error('Error loading feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChats = async () => {
    try {
      const response = await chatService.getChats()
      setChats(response.data)
    } catch (error) {
      console.error('Error loading chats:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.chatId || !formData.feedbackText || formData.stars === 0) {
      setError('Please fill in all fields and select a star rating')
      return
    }

    setSubmitting(true)

    try {
      await feedbackService.createFeedback(formData)
      setSuccess('Feedback submitted successfully! 🎉')
      setFormData({ chatId: '', category: 'Topic Response Quality', feedbackText: '', stars: 0 })
      setShowForm(false)
      loadFeedbacks()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback)
    setShowModal(true)
  }

  const handleDeleteFeedback = (feedbackId) => {
    setFeedbacks(feedbacks.filter(f => f._id !== feedbackId))
    setSuccess('Feedback deleted successfully! 🗑️')
    setTimeout(() => setSuccess(''), 3000)
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'Negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    }
  }

  const renderStars = (count) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < count ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
            {i < count ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    )
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
      <UserNavbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Feedback Center ⭐
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your feedback submissions
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl animate-fadeIn">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl animate-fadeIn">
            {error}
          </div>
        )}

        {/* Stats and Recent Feedbacks Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Feedbacks Card */}
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:rotate-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wide mb-2">Total Feedbacks</p>
                <p className="text-4xl font-bold animate-pulse">{feedbacks.length}</p>
              </div>
              <div className="text-5xl animate-bounce">📊</div>
            </div>
          </div>

          {/* Recent Feedbacks Section */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="bg-gradient-to-r from-primary to-secondary p-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🕒</span>
                Recent Feedbacks
              </h3>
            </div>
            <div className="p-6">
            
            {feedbacks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No feedbacks yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbacks.slice(0, 2).map((feedback) => (
                  <div
                    key={feedback._id}
                    onClick={() => handleViewDetails(feedback)}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:-translate-y-1 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1 group-hover:text-primary transition-colors">
                          {feedback.chatName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                          {feedback.feedbackText}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm transition-transform group-hover:scale-110 ${i < feedback.stars ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                {i < feedback.stars ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all group-hover:scale-105">
                            {feedback.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Give Feedback Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-2xl">✍️</span>
            <span>Give New Feedback</span>
          </button>
        )}

        {/* Feedback Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Submit Feedback
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Chat */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Chat
                </label>
                <select
                  value={formData.chatId}
                  onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Choose a chat...</option>
                  {chats.map(chat => (
                    <option key={chat._id} value={chat._id}>
                      {chat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Feedback Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="Topic Response Quality">Topic Response Quality</option>
                  <option value="Response Quality">Response Quality</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Stars Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rating {formData.stars > 0 && `(${formData.stars} star${formData.stars > 1 ? 's' : ''})`}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, stars: star })}
                      className="text-5xl transition-all duration-300 hover:scale-125 active:scale-110"
                    >
                      {star <= formData.stars ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                {formData.stars === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Click on a star to rate
                  </p>
                )}
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={formData.feedbackText}
                  onChange={(e) => setFormData({ ...formData, feedbackText: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-300"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || formData.stars === 0}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {/* Feedbacks List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            My Feedbacks
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              onClick={() => handleViewDetails(feedback)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
            >
              {/* Chat Name */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                {feedback.chatName}
              </h3>

              {/* Category Badge */}
              <div className="mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {feedback.category}
                </span>
              </div>

              {/* Stars */}
              <div className="mb-3">
                {renderStars(feedback.stars)}
              </div>

              {/* Feedback Preview */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {feedback.feedbackText}
              </p>

              {/* Date */}
              <div className="flex items-center justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {feedbacks.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Feedbacks Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by giving feedback on your chats!
            </p>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {showModal && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setShowModal(false)}
          onDelete={handleDeleteFeedback}
          showDelete={true}
        />
      )}
    </div>
  )
}

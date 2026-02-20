import { useState } from 'react'
import { feedbackService } from '../services/feedbackService'

export default function FeedbackDetailModal({ feedback, onClose, onDelete, showDelete = false }) {
  const [deleting, setDeleting] = useState(false)

  if (!feedback) return null

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    setDeleting(true)
    try {
      await feedbackService.deleteFeedback(feedback._id)
      if (onDelete) {
        onDelete(feedback._id)
      }
      onClose()
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('Failed to delete feedback')
      setDeleting(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'Negative':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
    }
  }

  const renderStars = (count) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-2xl ${i < count ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
            {i < count ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Blue Gradient */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold pr-10">Feedback Details</h2>
          <p className="text-sm opacity-90 mt-1">{feedback.chatName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Category */}
          {feedback.category && (
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Category
              </label>
              <div className="mt-2">
                <span className="px-4 py-2 rounded-lg font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {feedback.category}
                </span>
              </div>
            </div>
          )}

          {/* Stars */}
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Rating
            </label>
            <div className="mt-2">
              {renderStars(feedback.stars)}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Feedback
            </label>
            <p className="text-gray-900 dark:text-white mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl leading-relaxed">
              {feedback.feedbackText}
            </p>
          </div>

          {/* Sentiment - Only show for admin */}
          {!showDelete && (
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Sentiment Analysis
              </label>
              <div className="mt-2 flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-semibold ${getSentimentColor(feedback.sentiment.label)}`}>
                  {feedback.sentiment.label}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Confidence: {(feedback.sentiment.score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Submitted On
            </label>
            <p className="text-gray-900 dark:text-white mt-1">
              {new Date(feedback.createdAt).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 flex gap-4">
          {showDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {deleting ? 'Deleting...' : 'Delete Feedback'}
            </button>
          )}
          <button
            onClick={onClose}
            className={`${showDelete ? 'flex-1' : 'w-full'} bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

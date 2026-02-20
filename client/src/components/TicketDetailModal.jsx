export default function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold pr-10">Ticket Details</h2>
          <p className="text-sm opacity-90 mt-1">#{ticket._id?.slice(-8)}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(ticket.status)}`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Subject
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {ticket.subject}
            </p>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Category
            </label>
            <p className="text-gray-900 dark:text-white capitalize">
              {ticket.category}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Description
            </label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Created At
            </label>
            <p className="text-gray-900 dark:text-white">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Admin Reply */}
          {ticket.adminReply && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Admin Reply
              </label>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {ticket.adminReply}
                </p>
                {ticket.repliedAt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Replied: {new Date(ticket.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

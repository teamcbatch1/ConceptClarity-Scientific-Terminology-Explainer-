import { useState } from 'react'

export default function FeedbackPopup({ onYes, onNotNow }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scaleIn">
        <div className="text-center">
          {/* Star Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900/40 dark:to-blue-900/40 rounded-full flex items-center justify-center">
              <span className="text-3xl">⭐</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Give Feedback
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            How was your experience with this chat? Your feedback helps us improve!
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onYes}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Yes, Give Feedback
            </button>
            <button
              onClick={onNotNow}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

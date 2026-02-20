import { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'

const ForgotPassword = memo(function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      setMessage(response.data.message)
      setSubmitted(true)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.'
      setError(errorMessage)
      console.error('Forgot password error:', err)
    }
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Forgot Password</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300 px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">❌</span>
                <span className="font-semibold text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border-2 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">✓</span>
                <span className="font-semibold text-sm sm:text-base">{message}</span>
              </div>
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary shimmer w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setEmail('')
                  setMessage('')
                  setError('')
                }}
                className="text-primary font-bold hover:underline text-sm sm:text-base"
              >
                Send Another Reset Link
              </button>
            </div>
          )}

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Remember your password? <Link to="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ForgotPassword
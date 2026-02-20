import { useState, useEffect, memo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authService } from '../services/authService'

const ResetPassword = memo(function ResetPassword() {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Clear previous messages
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await authService.resetPassword(token, formData.newPassword)
      setMessage(response.data.message)
      setSuccess(true)
      setLoading(false)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setLoading(false)
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.'
      setError(errorMessage)
      console.error('Reset password error:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-red-600">Invalid Reset Link</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link 
              to="/forgot-password" 
              className="btn-primary shimmer bg-primary text-white py-2.5 px-6 rounded-lg font-bold hover:bg-secondary transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Enter your new password below. This link expires in 5 minutes.
            </p>
          </div>

          {/* Error Message */}
          {error && !success && (
            <div className="bg-red-50 border-2 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300 px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">❌</span>
                <span className="font-semibold text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">✓</span>
                <span className="font-semibold text-sm sm:text-base">{message}</span>
              </div>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Must be at least 10 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary shimmer w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Redirecting to login page in 3 seconds...
              </p>
              <Link 
                to="/login" 
                className="text-primary font-bold hover:underline text-sm sm:text-base"
              >
                Go to Login Now
              </Link>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Remember your password? <Link to="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ResetPassword
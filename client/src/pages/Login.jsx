import { useState, memo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

const Login = memo(function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await authService.loginUser(formData.identifier, formData.password)
      const { user, token } = response.data
      
      login(user, token)
      setSuccess(true)
      setLoading(false)
      
      // Redirect based on user role after 2.5 seconds
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      }, 2500)
    } catch (err) {
      setLoading(false)
      
      // Set error message
      const errorMessage = err.response?.status === 401 
        ? 'Incorrect credentials, please enter correctly'
        : err.response?.data?.message || 'Login failed. Please try again.'
      
      setError(errorMessage)
      
      // Clear form fields
      setFormData({ identifier: '', password: '' })
      
      console.error('Login error:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Login</h2>

          {/* Error Message - Between heading and form */}
          {error && !success && (
            <div 
              className="bg-red-50 border-2 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300 px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-6 shadow-lg"
              style={{ minHeight: '60px', opacity: 1, display: 'block' }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">❌</span>
                <span className="font-semibold text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message - Between heading and form */}
          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">✓</span>
                <span className="font-semibold text-sm sm:text-base">Login successful! Redirecting...</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email or Username</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email or username"
                required
                disabled={success || loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
                required
                disabled={success || loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary shimmer w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              {loading ? 'Logging in...' : success ? 'Redirecting...' : 'Login'}
            </button>
          </form>

          {/* Temporarily hidden until email is configured
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-primary font-bold hover:underline text-sm sm:text-base">
              Forgot password?
            </Link>
          </div>
          */}

          <p className="text-center mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
})

export default Login

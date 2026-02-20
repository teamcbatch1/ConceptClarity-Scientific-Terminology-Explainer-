import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adminExists, setAdminExists] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState('')
  const navigate = useNavigate()

  // Clear form when component mounts (user navigates to page)
  useEffect(() => {
    setFormData({ 
      username: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      role: 'user'
    })
    setError('')
    setSuccess(false)
    setPasswordStrength('')
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const response = await authService.checkAdminExists()
      setAdminExists(response.data.adminExists)
    } catch (err) {
      console.error('Error checking admin:', err)
    }
  }

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*?&#^()_+=\-{}[\]|:;"'<>,./]/.test(password)
    const isLongEnough = password.length >= 10

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      setPasswordStrength('Strong ✓')
      return true
    } else if (password.length >= 6) {
      setPasswordStrength('Weak - Must have 10+ chars, uppercase, lowercase, number, and special character')
      return false
    } else {
      setPasswordStrength('Too short')
      return false
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (name === 'password') {
      validatePassword(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (!validatePassword(formData.password)) {
      setError('Password does not meet strength requirements')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await authService.registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      
      setSuccess(true)
      setError('')
      
      // Redirect to login after 3 seconds (give user time to read message)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      setSuccess(false)
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded mb-4 flex items-center gap-2 animate-fadeIn">
            <span className="text-lg sm:text-xl">✗</span>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-3 rounded mb-4 flex items-center gap-2 animate-fadeIn">
            <span className="text-lg sm:text-xl">✓</span>
            <span className="text-sm sm:text-base">Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter username"
              required
              disabled={success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter email"
              required
              disabled={success}
            />
          </div>

          {!adminExists && (
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={success}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">First user can register as admin</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Min 10 characters"
              required
              disabled={success}
            />
            {passwordStrength && (
              <p className={`text-xs mt-1 ${
                passwordStrength.includes('Strong') 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {passwordStrength}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm password"
              required
              disabled={success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary shimmer w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105"
          >
            {loading ? 'Registering...' : success ? 'Redirecting...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

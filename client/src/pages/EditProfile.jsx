import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminNavbar from '../components/AdminNavbar'
import UserNavbar from '../components/UserNavbar'
import api from '../services/api'

export default function EditProfile() {
  const { user, loading, updateUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploadMethod, setUploadMethod] = useState('url') // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (user) {
      setFormData({
        username: user.username || '',
        avatar: user.avatar || '',
        newPassword: '',
        confirmNewPassword: ''
      })
      setAvatarPreview(user.avatar || '')
    }
  }, [user, loading, navigate])

  const validatePassword = (password) => {
    if (!password) {
      setPasswordStrength('')
      return true // Empty password is okay (means no change)
    }

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
    
    if (name === 'newPassword') {
      validatePassword(value)
    }
  }

  const handleAvatarChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, avatar: value })
    setAvatarPreview(value)
    setSelectedFile(null) // Clear file if URL is entered
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData({ ...formData, avatar: reader.result })
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleDeleteAvatar = async () => {
    setDeletingAvatar(true)
    try {
      // Update the database immediately
      const response = await api.put(`/users/${user._id}`, { 
        ...formData, 
        avatar: '' 
      })
      
      // Update local state
      setFormData({ ...formData, avatar: '' })
      setAvatarPreview('')
      setSelectedFile(null)
      setShowDeleteConfirm(false)
      
      // Update user in context so it reflects everywhere
      if (updateUser) {
        updateUser(response.data.user)
      }
      
      // Show success message
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile picture')
      setShowDeleteConfirm(false)
    } finally {
      setDeletingAvatar(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate password if provided
    if (formData.newPassword) {
      if (!validatePassword(formData.newPassword)) {
        setError('Password does not meet strength requirements')
        return
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('Passwords do not match')
        return
      }
    }

    setSaving(true)

    try {
      const response = await api.put(`/users/${user._id}`, formData)
      
      // Update user in context
      if (updateUser) {
        updateUser(response.data.user)
      }
      
      setSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
      console.error('Update error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
      {user?.role === 'admin' ? <AdminNavbar /> : <UserNavbar />}
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile ✏️</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded mb-4 flex items-center gap-2 animate-fadeIn">
                <span className="text-lg sm:text-xl">✗</span>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-3 rounded mb-4 flex items-center gap-2 animate-fadeIn">
                <span className="text-lg sm:text-xl">✓</span>
                <span className="text-sm sm:text-base">Profile updated successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{formData.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  {/* Delete button - only show if there's an avatar */}
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                      title="Remove profile picture"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {/* Upload Method Toggle */}
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      uploadMethod === 'url'
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      uploadMethod === 'file'
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {/* Avatar URL Input */}
                {uploadMethod === 'url' && (
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">Avatar URL</label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleAvatarChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://example.com/avatar.jpg"
                      disabled={success}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a URL to your profile picture</p>
                  </div>
                )}

                {/* File Upload Input */}
                {uploadMethod === 'file' && (
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">Upload Image</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={success}
                        />
                      </label>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        ✓ {selectedFile.name} selected
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* User ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">User ID</label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-sm break-all">{user?._id}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">User ID cannot be changed</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={success}
                />
                <p className="text-xs text-gray-500 mt-1">Choose a unique username</p>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">{user?.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                
                <div className="space-y-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Leave blank to keep current password"
                      disabled={success}
                    />
                    {passwordStrength && formData.newPassword && (
                      <p className={`text-xs mt-1 ${
                        passwordStrength.includes('Strong') 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {passwordStrength}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  {formData.newPassword && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Re-enter new password"
                        disabled={success}
                      />
                      {formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <span className="capitalize font-medium">{user?.role}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving || success}
                  className="flex-1 btn-primary shimmer bg-primary text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                >
                  {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  disabled={saving}
                  className="px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Avatar Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗑️</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Remove Profile Picture?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Do you want to remove your profile picture? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAvatar}
                  disabled={deletingAvatar}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingAvatar ? 'Removing...' : 'Yes, Remove'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deletingAvatar}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  No, Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

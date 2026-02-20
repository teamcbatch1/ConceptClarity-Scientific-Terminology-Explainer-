import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminNavbar from '../components/AdminNavbar'
import UserNavbar from '../components/UserNavbar'

export default function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile 👤</h1>
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <span>✏️</span>
                <span>Edit Profile</span>
              </Link>
            </div>

            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center gap-4 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl sm:text-4xl font-bold overflow-hidden shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer group">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <span className="group-hover:scale-110 transition-transform duration-300">{user?.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{user?.email}</p>
                <span className="inline-block mt-2 px-3 sm:px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xs sm:text-sm font-semibold">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 sm:space-y-6 mt-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">User ID</label>
                <p className="text-base sm:text-lg font-mono text-gray-900 dark:text-white break-all">{user?._id}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">{user?.username}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">{user?.email}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Role</label>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">{user?.role}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Member Since</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

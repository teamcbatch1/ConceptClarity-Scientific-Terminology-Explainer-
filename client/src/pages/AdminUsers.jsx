import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminNavbar from '../components/AdminNavbar'
import api from '../services/api'

export default function AdminUsers() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    avatar: ''
  })
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (user && user.role !== 'admin') {
      navigate('/chat')
    } else if (user) {
      fetchUsers()
    }
  }, [user, loading, navigate])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleDeleteClick = (userToDelete) => {
    setDeletingUser(userToDelete)
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return
    
    setDeleting(true)
    try {
      await api.delete(`/users/${deletingUser._id}`)
      fetchUsers()
      setDeletingUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setDeletingUser(null)
  }

  const handleEditUser = (userToEdit) => {
    // If admin is trying to edit themselves, redirect to edit profile page
    if (userToEdit._id === user._id) {
      navigate('/profile/edit')
      return
    }
    
    setEditingUser(userToEdit)
    setEditForm({
      username: userToEdit.username,
      email: userToEdit.email,
      avatar: userToEdit.avatar || ''
    })
    setEditError('')
    setEditSuccess(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditError('')
    setSaving(true)

    try {
      const response = await api.put(`/users/${editingUser._id}`, editForm)
      
      // Update the users list with the updated user
      setUsers(users.map(u => u._id === editingUser._id ? response.data.user : u))
      
      setEditSuccess(true)
      setTimeout(() => {
        setEditingUser(null)
        setEditSuccess(false)
      }, 1500)
    } catch (err) {
      if (err.response?.status === 400) {
        setEditError(err.response.data.message)
      } else {
        setEditError('Failed to update user. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

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
      <AdminNavbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              User Management 👥
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Manage all users and their permissions
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Users</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.username} className="w-full h-full object-cover" />
                            ) : (
                              <span>{u.username.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditUser(u)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(u)}
                            disabled={u._id === user._id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:scale-105"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {editError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2 animate-fadeIn">
                  <span className="text-xl">✗</span>
                  <span className="text-sm">{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2 animate-fadeIn">
                  <span className="text-xl">✓</span>
                  <span className="text-sm">User updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Avatar */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-lg">
                      {editForm.avatar ? (
                        <img src={editForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{editForm.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Profile Picture Preview</p>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* User ID (Read-only) */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">User ID</label>
                        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400 font-mono text-sm break-all">{editingUser._id}</span>
                        </div>
                      </div>

                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={editForm.username}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                          disabled={saving || editSuccess}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                          disabled={saving || editSuccess}
                        />
                      </div>

                      {/* Avatar URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Avatar URL</label>
                        <input
                          type="url"
                          name="avatar"
                          value={editForm.avatar}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="https://example.com/avatar.jpg"
                          disabled={saving || editSuccess}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to use default avatar</p>
                      </div>

                      {/* Role (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            editingUser.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {editingUser.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                      </div>

                      {/* Member Since */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Member Since</label>
                        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(editingUser.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={saving || editSuccess}
                        className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:scale-105"
                      >
                        {saving ? 'Saving...' : editSuccess ? 'Saved!' : 'Save Changes'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        disabled={saving}
                        className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scaleIn">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Delete User Permanently?
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                    {deletingUser.avatar ? (
                      <img src={deletingUser.avatar} alt={deletingUser.username} className="w-full h-full object-cover" />
                    ) : (
                      <span>{deletingUser.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">{deletingUser.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{deletingUser.email}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. All user data, chats, and associated information will be permanently deleted.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

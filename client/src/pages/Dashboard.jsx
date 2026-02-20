import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminNavbar from '../components/AdminNavbar'
import api from '../services/api'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeChats: 0,
    supportChats: 0,
    totalFeedbacks: 0,
    systemStatus: 'online'
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (user && user.role !== 'admin') {
      navigate('/chat')
    } else if (user) {
      fetchDashboardData()
    }
  }, [user, loading, navigate])

  const fetchDashboardData = async () => {
    try {
      const usersResponse = await api.get('/users')
      const chatsResponse = await api.get('/chat')
      const feedbacksResponse = await api.get('/feedbacks/admin/all')
      const ticketsResponse = await api.get('/tickets/all')
      
      const chats = chatsResponse.data || []
      const feedbacks = feedbacksResponse.data || []
      const tickets = ticketsResponse.data?.tickets || ticketsResponse.data || []
      
      setStats({
        totalUsers: usersResponse.data.length,
        activeChats: chats.length,
        supportChats: tickets.length,
        totalFeedbacks: feedbacks.length,
        systemStatus: 'online'
      })

      // Combine and sort recent activity
      const activities = []
      
      // Add recent chats
      if (chats.length > 0) {
        chats.slice(0, 5).forEach(chat => {
          activities.push({
            type: 'chat',
            icon: '💬',
            title: `New chat: ${chat.title || 'Untitled'}`,
            time: new Date(chat.createdAt).toLocaleString(),
            timestamp: new Date(chat.createdAt).getTime()
          })
        })
      }
      
      // Add recent tickets
      if (tickets.length > 0) {
        tickets.slice(0, 5).forEach(ticket => {
          activities.push({
            type: 'ticket',
            icon: '🎫',
            title: `Support ticket: ${ticket.subject}`,
            time: new Date(ticket.createdAt).toLocaleString(),
            timestamp: new Date(ticket.createdAt).getTime()
          })
        })
      }
      
      // Add recent feedbacks
      if (feedbacks.length > 0) {
        feedbacks.slice(0, 5).forEach(feedback => {
          activities.push({
            type: 'feedback',
            icon: '⭐',
            title: `Feedback: ${feedback.chatName}`,
            time: new Date(feedback.createdAt).toLocaleString(),
            timestamp: new Date(feedback.createdAt).getTime()
          })
        })
      }
      
      // Sort by timestamp (most recent first) and take top 5
      activities.sort((a, b) => b.timestamp - a.timestamp)
      setRecentActivity(activities.slice(0, 5))
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
      <AdminNavbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
              Welcome back, {user?.username}! <span className="text-gray-900 dark:text-white">👋</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Manage your platform, monitor users, and keep everything running smoothly
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <span className="text-2xl sm:text-3xl">👥</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+12%</span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">TOTAL USERS</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">Active learners</p>
            </div>

            {/* Active Chats */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <span className="text-2xl sm:text-3xl">💬</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+8%</span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">ACTIVE CHATS</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stats.activeChats}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">Ongoing conversations</p>
            </div>

            {/* Support Chats */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <span className="text-2xl sm:text-3xl">🎧</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+5%</span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">SUPPORT CHATS</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stats.supportChats}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">All conversations</p>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <span className="text-2xl sm:text-3xl">⚡</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">SYSTEM STATUS</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">99.9%</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">Uptime SLA</p>
            </div>

            {/* Total Feedbacks */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                  <span className="text-2xl sm:text-3xl">⭐</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">+15%</span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">TOTAL FEEDBACKS</h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stats.totalFeedbacks}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">User feedback</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                <button className="text-primary hover:text-secondary transition-colors text-xs sm:text-sm font-semibold">
                  View All →
                </button>
              </div>
              
              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl sm:text-6xl mb-4">📊</div>
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">Activity will appear here as users interact with the platform</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-base">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{activity.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & System Status */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <span className="text-xl">👥</span>
                    <span>Manage Users</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/support')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <span className="text-xl">🎧</span>
                    <span>Support Center</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/feedback')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <span className="text-xl">⭐</span>
                    <span>View Feedbacks</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <span className="text-xl">💬</span>
                    <span>Start Chat</span>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Server Status</span>
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Database</span>
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AI Service</span>
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

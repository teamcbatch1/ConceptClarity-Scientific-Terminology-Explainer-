import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { feedbackService } from '../services/feedbackService'
import AdminNavbar from '../components/AdminNavbar'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function AdminFeedback() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartAnimated, setChartAnimated] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData()
    }
  }, [user])

  useEffect(() => {
    if (stats && !chartAnimated) {
      setTimeout(() => setChartAnimated(true), 300)
    }
  }, [stats, chartAnimated])

  const loadData = async () => {
    try {
      const [feedbacksRes, statsRes] = await Promise.all([
        feedbackService.getAllFeedbacks(),
        feedbackService.getFeedbackStats()
      ])
      setFeedbacks(feedbacksRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error loading feedback data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'Negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    }
  }

  const renderStars = (count) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`${i < count ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
            {i < count ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    )
  }

  // Chart data with gradient colors
  const chartData = stats ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          stats.positiveFeedbacks,
          stats.neutralFeedbacks,
          stats.negativeFeedbacks
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(234, 179, 8, 0.9)',
          'rgba(239, 68, 68, 0.9)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 3,
        hoverOffset: 20,
        hoverBorderWidth: 4
      }
    ]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  if (authLoading || loading) {
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
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Feedback Management 📊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and analyze user feedback
          </p>
        </div>

        {/* Stats Cards, Recent Feedbacks, and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Total Feedbacks and Recent Feedbacks */}
          <div className="flex flex-col gap-6">
            {/* Total Feedbacks Card */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:rotate-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm uppercase tracking-wide mb-2">
                    Total Feedbacks
                  </p>
                  <p className="text-4xl font-bold animate-pulse">{stats?.totalFeedbacks || 0}</p>
                  <p className="text-white/80 text-sm mt-2">
                    Avg Rating: {stats?.avgStars || 0} ⭐
                  </p>
                </div>
                <div className="text-5xl animate-bounce">⭐</div>
              </div>
            </div>

            {/* Recent Feedbacks Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-primary to-secondary p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🕒</span>
                  Recent Feedbacks
                </h3>
              </div>
              <div className="p-6 flex-1">
              
              {feedbacks.length === 0 ? (
                <div className="text-center py-6 flex-1 flex items-center justify-center">
                  <div>
                    <div className="text-3xl mb-2">📝</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No feedbacks yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {feedbacks.slice(0, 3).map((feedback) => (
                    <div
                      key={feedback._id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate flex-1 group-hover:text-primary transition-colors">
                            {feedback.chatName}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                          {feedback.feedbackText}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs transition-transform group-hover:scale-110 ${i < feedback.stars ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                {i < feedback.stars ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold transition-all group-hover:scale-105 ${getSentimentColor(feedback.sentiment.label)}`}>
                            {feedback.sentiment.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Sentiment Chart */}
          <div className={`lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 flex flex-col ${chartAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="bg-gradient-to-r from-primary to-secondary p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Sentiment Distribution
                </h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
            {chartData && (
              <div className="flex-1 relative min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl opacity-50"></div>
                <div className="relative h-full p-4">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
            
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats?.positiveFeedbacks || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Positive</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats?.neutralFeedbacks || 0}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">Neutral</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats?.negativeFeedbacks || 0}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Negative</p>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Feedbacks Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <h2 className="text-2xl font-bold text-white">
              All Feedbacks
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Chat Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Stars
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {feedbacks.map((feedback, index) => (
                  <tr 
                    key={feedback._id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {feedback.userEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {feedback.chatName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {feedback.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                      <div className="line-clamp-2">
                        {feedback.feedbackText}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(feedback.stars)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getSentimentColor(feedback.sentiment.label)}`}>
                        {feedback.sentiment.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {feedbacks.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Feedbacks Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Feedbacks will appear here once users start submitting them
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

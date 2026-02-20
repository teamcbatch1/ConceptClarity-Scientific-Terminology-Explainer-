import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import AdminUsers from './pages/AdminUsers'
import AdminSupport from './pages/AdminSupport'
import UserSupport from './pages/UserSupport'
import AdminFeedback from './pages/AdminFeedback'
import UserFeedback from './pages/UserFeedback'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

function ScrollToSection() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [location])

  return null
}

// Component to conditionally render navbar based on route
function ConditionalNavbar() {
  const location = useLocation()
  const protectedRoutes = ['/dashboard', '/user/dashboard', '/admin/users', '/admin/support', '/admin/feedback', '/user/support', '/user/feedback', '/profile', '/profile/edit', '/chat']
  
  // Don't show navbar on protected routes (they have their own navbar)
  if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
    return null
  }
  
  return <Navbar />
}

// Component to conditionally render footer
function ConditionalFooter() {
  const location = useLocation()
  const noFooterRoutes = ['/dashboard', '/user/dashboard', '/admin/users', '/admin/support', '/admin/feedback', '/user/support', '/user/feedback', '/chat']
  
  // Don't show footer on protected routes
  if (noFooterRoutes.some(route => location.pathname.startsWith(route))) {
    return null
  }
  
  return <Footer />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <ScrollToSection />
            <div className="flex flex-col min-h-screen dark:bg-gray-950 bg-white dark:text-white">
              <ConditionalNavbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/support" element={<AdminSupport />} />
                  <Route path="/admin/feedback" element={<AdminFeedback />} />
                  <Route path="/user/support" element={<UserSupport />} />
                  <Route path="/user/feedback" element={<UserFeedback />} />
                </Routes>
              </main>
              <ConditionalFooter />
            </div>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

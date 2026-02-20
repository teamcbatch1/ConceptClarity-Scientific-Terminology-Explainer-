import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' }
  ]

  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'))
      if (!sections.length) return
      let closest = sections[0]
      let closestDist = Math.abs(sections[0].getBoundingClientRect().top - 120)
      sections.forEach((sec) => {
        const dist = Math.abs(sec.getBoundingClientRect().top - 120)
        if (dist < closestDist) {
          closest = sec
          closestDist = dist
        }
      })
      setActive(closest.id || 'home')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // initialize
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const id = href.slice(1)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
      setIsMenuOpen(false)
    } else if (href === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActive('home')
      navigate('/')
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-950 shadow-lg z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Concept Clarity
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const id = link.href.startsWith('#') ? link.href.slice(1) : link.href === '/' ? 'home' : ''
              const isActive = active === id
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-link transition font-medium ${isActive ? 'active text-primary' : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <span className="text-xl">☀️</span>
              ) : (
                <span className="text-xl">🌙</span>
              )}
            </button>

            {/* Auth Links */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-primary shimmer bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all duration-300 font-medium hover:shadow-lg hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary shimmer bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all duration-300 font-medium hover:shadow-lg hover:scale-105">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t dark:border-gray-800 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block py-2 transition font-medium ${active === (link.href.startsWith('#') ? link.href.slice(1) : link.href === '/' ? 'home' : '') ? 'text-primary underline underline-offset-4 decoration-2' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t dark:border-gray-800 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium py-2"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

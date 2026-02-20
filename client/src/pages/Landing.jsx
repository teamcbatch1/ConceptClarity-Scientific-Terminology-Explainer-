import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import FeatureCard from '../components/FeatureCard'
import heroImage from '../image.png'

export default function Landing() {
  const { user } = useAuth()
  const [counters, setCounters] = useState({ users: 0, concepts: 0, uptime: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const statsRef = useRef(null)

  const features = [
    {
      icon: '💬',
      title: 'AI Chat Assistant',
      description: 'Ask any FinTech question and get instant, accurate explanations powered by advanced AI.'
    },
    {
      icon: '📚',
      title: 'Concept Explanations',
      description: 'Learn complex financial concepts in simple language with real-world examples.'
    },
    {
      icon: '🤖',
      title: 'GPT + Local Model',
      description: 'Hybrid AI approach combining OpenAI GPT and local NLP models for best results.'
    },
    {
      icon: '📝',
      title: 'Chat History',
      description: 'Keep track of all your conversations and revisit previous learning sessions anytime.'
    },
    {
      icon: '🔐',
      title: 'Secure Login',
      description: 'Enterprise-grade JWT authentication with role-based access control for safety.'
    },
    {
      icon: '🎙️',
      title: 'Multi-Modal Input',
      description: 'Ask questions via text, voice, or images for flexible learning experience.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up or log in with your email to get started instantly.'
    },
    {
      number: '02',
      title: 'Ask Questions',
      description: 'Type your FinTech questions in natural language to the AI assistant.'
    },
    {
      number: '03',
      title: 'Learn Instantly',
      description: 'Get detailed explanations and save them to your learning history.'
    }
  ]

  // Animated counter effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounters()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [hasAnimated])

  const animateCounters = () => {
    const targets = { users: 10, concepts: 500, uptime: 99.9 }
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setCounters({
        users: Math.floor(targets.users * progress),
        concepts: Math.floor(targets.concepts * progress),
        uptime: parseFloat((targets.uptime * progress).toFixed(1))
      })

      if (currentStep >= steps) {
        setCounters(targets)
        clearInterval(timer)
      }
    }, interval)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Understand FinTech
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Concepts Instantly with AI
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Master financial concepts with intelligent AI tutoring. Get real-time explanations, learn from experts, and become a FinTech pro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to="/chat"
                    className="btn-primary shimmer px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center"
                  >
                    Go to Chat →
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary shimmer px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center"
                    >
                      Get Started →
                    </Link>
                    <Link
                      to="/login"
                      className="glow-on-hover px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 text-center border-2 border-gray-300 dark:border-gray-700"
                    >
                      Try Demo
                    </Link>
                  </>
                )}
              </div>

              <div className="flex gap-8 pt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>Instant Responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <span>Completely Secure</span>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration Image */}
            <div className="relative h-96 md:h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
              <div className="hero-image-container relative rounded-2xl p-4 border border-primary/20 dark:border-primary/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm cursor-pointer">
                <img
                  src={heroImage}
                  alt="Concept Clarity illustration"
                  className="w-[360px] md:w-[480px] h-auto object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to master FinTech concepts and excel in your financial career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to start learning FinTech with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Card */}
                <div className="glow-on-hover bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full cursor-pointer">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-6 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
            About Concept Clarity
          </h2>
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Concept Clarity is designed for everyone passionate about FinTech—from students learning about blockchain to professionals diving into decentralized finance. Our AI-powered platform breaks down complex financial concepts into simple, digestible explanations.
            </p>
            <p>
              We combine the power of advanced language models with a curated knowledge base of FinTech terminology. Whether you're exploring cryptocurrencies, understanding smart contracts, or mastering risk management, we've got you covered.
            </p>
            <p>
              With secure JWT authentication, chat history persistence, and support for multiple input formats, Concept Clarity offers a complete learning ecosystem for modern financial professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12" ref={statsRef}>
            <div className="text-center transform transition-all duration-500 hover:scale-110">
              <div className="text-4xl font-bold text-primary mb-2">
                {counters.users}K+
              </div>
              <p className="text-gray-600 dark:text-gray-400">Active Learners</p>
            </div>
            <div className="text-center transform transition-all duration-500 hover:scale-110">
              <div className="text-4xl font-bold text-primary mb-2">
                {counters.concepts}+
              </div>
              <p className="text-gray-600 dark:text-gray-400">Concepts Explained</p>
            </div>
            <div className="text-center transform transition-all duration-500 hover:scale-110">
              <div className="text-4xl font-bold text-primary mb-2">
                {counters.uptime}%
              </div>
              <p className="text-gray-600 dark:text-gray-400">Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Master FinTech?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start learning with AI today. No credit card required.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary shimmer px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="glow-on-hover px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FeedbackPopup from './FeedbackPopup'

export default function ChatBubble({ message, sender, timestamp, isTyping = false, chatId }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (sender === 'bot' && !isComplete && isTyping) {
      let index = 0
      const text = message || ''
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          setIsComplete(true)
          clearInterval(interval)
        }
      }, 20) // 20ms per character for smooth typing effect

      return () => clearInterval(interval)
    } else {
      setDisplayedText(message)
      setIsComplete(true)
    }
  }, [message, sender, isTyping, isComplete])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (speaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [speaking])

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      // Remove markdown formatting for cleaner copy
      const plainText = message.replace(/\*\*/g, '').replace(/# /g, '')
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Text to speech using Web Speech API (free, built-in)
  const handleSpeak = () => {
    if (speaking) {
      // Stop speaking
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    // Start speaking
    const plainText = message.replace(/\*\*/g, '').replace(/# /g, '').replace(/---/g, '')
    
    const utterance = new SpeechSynthesisUtterance(plainText)
    utterance.rate = 0.9 // Slightly slower for clarity
    utterance.pitch = 1
    utterance.volume = 1
    
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }

  // Open feedback popup
  const handleFeedback = () => {
    setShowFeedbackPopup(true)
  }

  // Handle feedback Yes
  const handleFeedbackYes = () => {
    setShowFeedbackPopup(false)
    navigate('/user/feedback', { state: { chatId, fromChat: true } })
  }

  // Handle feedback Not Now
  const handleFeedbackNotNow = () => {
    setShowFeedbackPopup(false)
  }

  // Format text with markdown-like syntax
  const formatText = (text) => {
    if (!text) return null

    // Split by lines
    const lines = text.split('\n')
    
    return lines.map((line, idx) => {
      // Handle headings (# Heading)
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-xl font-bold mb-3 mt-2">
            {line.substring(2)}
          </h2>
        )
      }

      // Handle horizontal rules (---)
      if (line.trim() === '---') {
        return <hr key={idx} className="my-3 border-gray-300 dark:border-gray-600" />
      }

      // Process line with both links and bold text
      const processLine = (text) => {
        const elements = []
        let lastIndex = 0
        
        // Combined regex to match both links and bold text
        const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)/g
        let match
        
        while ((match = combinedRegex.exec(text)) !== null) {
          // Add text before match
          if (match.index > lastIndex) {
            elements.push(text.substring(lastIndex, match.index))
          }
          
          if (match[1]) {
            // It's a link [text](url)
            const linkText = match[2]
            const linkUrl = match[3]
            elements.push(
              <a 
                key={match.index} 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {linkText}
              </a>
            )
          } else if (match[4]) {
            // It's bold text **text**
            const boldText = match[5]
            elements.push(<strong key={match.index} className="font-bold">{boldText}</strong>)
          }
          
          lastIndex = match.index + match[0].length
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
          elements.push(text.substring(lastIndex))
        }
        
        return elements.length > 0 ? elements : text
      }

      // Regular paragraph
      if (line.trim()) {
        return (
          <p key={idx} className="mb-2">
            {processLine(line)}
          </p>
        )
      }

      // Empty line
      return <br key={idx} />
    })
  }

  const isUser = sender === 'user'

  return (
    <>
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
        <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
            } shadow-md`}
          >
            <div className="text-sm md:text-base break-words">
              {sender === 'bot' ? formatText(displayedText) : displayedText}
              {sender === 'bot' && !isComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse"></span>
              )}
            </div>

            {/* Action buttons for bot messages */}
            {sender === 'bot' && isComplete && (
              <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
                <div className="flex items-center justify-end gap-3">
                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    className="group relative p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Copy response"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  {/* Voice button */}
                  <button
                    onClick={handleSpeak}
                    className="group relative p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                    title={speaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    <span className={`text-lg ${speaking ? 'animate-pulse' : ''}`}>
                      {speaking ? '🔊' : '🔉'}
                    </span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {speaking ? 'Stop' : 'Listen'}
                    </span>
                  </button>

                  {/* Feedback button */}
                  <button
                    onClick={handleFeedback}
                    className="group relative p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Give feedback"
                  >
                    <span className="text-lg">⭐</span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Feedback
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {timestamp && (
            <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      {/* Feedback Popup Modal */}
      {showFeedbackPopup && (
        <FeedbackPopup
          onYes={handleFeedbackYes}
          onNotNow={handleFeedbackNotNow}
        />
      )}
    </>
  )
}

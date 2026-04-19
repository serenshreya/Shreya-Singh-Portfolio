import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaArrowLeft } from 'react-icons/fa'
import { chatWithGemini } from '../lib/geminiClient'

const SUGGESTIONS = [
  "What projects has Shreya built?",
  "What are her top skills?",
  "How can I hire her?",
  "Tell me about Healix AI",
  "What's her GitHub?"
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm Shreya's AI assistant. Ask me about her skills, projects, or how to get in touch! 🚀"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, isMobile])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMsg = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowSuggestions(false)
    setIsLoading(true)

    try {
      const history = messages
        .filter(m => m.role !== 'bot' || messages.indexOf(m) !== 0)
        .slice(-10)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))

      const response = await chatWithGemini(text.trim(), history)
      setMessages(prev => [...prev, { role: 'bot', text: response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Oops! I'm having trouble connecting. Please try again in a moment. 😅"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-[9998] bg-dark2 border border-white/[0.08] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
              isMobile
                ? 'inset-0 w-screen h-dvh rounded-none'
                : 'bottom-[104px] right-8 w-[380px] h-[520px] rounded-2xl'
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-blue py-4 px-5 flex justify-between items-center">
              {isMobile ? (
                <>
                  <button className="bg-transparent border-none text-white text-lg cursor-pointer opacity-70 hover:opacity-100 transition-opacity mr-2" onClick={() => setIsOpen(false)}>
                    <FaArrowLeft />
                  </button>
                  <span className="text-sm font-bold flex-1 flex items-center gap-2">
                    💬 Ask me about Shreya
                  </span>
                  <FaRobot className="opacity-60" />
                </>
              ) : (
                <>
                  <span className="text-sm font-bold flex items-center gap-2">
                    <FaRobot /> Ask me about Shreya
                  </span>
                  <button className="bg-transparent border-none text-white text-lg cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => setIsOpen(false)}>
                    <FaTimes />
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] py-3 px-4 text-[13px] leading-relaxed break-words ${
                  msg.role === 'user'
                    ? 'self-end bg-accent text-black rounded-[18px_18px_4px_18px] font-medium'
                    : 'self-start bg-card border border-white/[0.08] rounded-[18px_18px_18px_4px] text-white'
                }`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="self-start bg-card border border-white/[0.08] rounded-[18px_18px_18px_4px] py-3 px-4">
                  <div className="flex gap-1 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-dot-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="py-1.5 px-3 text-[11px] bg-accent/[0.08] border border-accent/20 text-accent cursor-pointer transition-all hover:bg-accent/[0.15] hover:border-accent font-sans rounded-full">
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              className="flex items-center py-3 px-4 border-t border-white/[0.08] gap-2"
              onSubmit={handleSubmit}
              style={isMobile ? { paddingBottom: 'max(12px, env(safe-area-inset-bottom))' } : {}}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-transparent border-none text-white font-sans text-[13px] outline-none placeholder:text-muted"
                inputMode="text"
                autoComplete="off"
              />
              <button type="submit" disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-full bg-accent text-black border-none cursor-pointer flex items-center justify-center text-base hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                <FaPaperPlane />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`fixed right-8 w-[60px] h-[60px] rounded-full bg-accent text-black border-none cursor-pointer text-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(200,255,0,0.3)] z-[9999] transition-all hover:scale-110 hover:shadow-[0_12px_40px_rgba(200,255,0,0.4)] ${
          isMobile ? 'bottom-20' : 'bottom-8'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </motion.button>
    </>
  )
}

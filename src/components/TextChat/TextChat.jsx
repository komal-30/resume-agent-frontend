import { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import MessageBubble from './MessageBubble'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import { askQuestion } from '../../services/chatService'
import './TextChat.css'

const WELCOME = {
  role: 'agent',
  text: "Hello! I'm the Resume Agent. Ask me anything about the resume — skills, experience, projects, education, or anything else.",
}

export default function TextChat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSubmit(e) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      const data = await askQuestion(question)
      setMessages((prev) => [...prev, { role: 'agent', text: data.answer }])
    } catch (err) {
      setError(err.message || 'Failed to get a response. Please try again.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleReset() {
    setMessages([WELCOME])
    setError(null)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="text-chat">
      {/* Message list */}
      <div className="text-chat__messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <div className="msg-row msg-row--agent">
            <div className="msg-avatar msg-avatar--agent typing-avatar">
              <span /><span /><span />
            </div>
            <div className="msg-bubble msg-bubble--agent msg-bubble--typing">
              <LoadingSpinner size="sm" text="Searching resume…" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="text-chat__error">
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Input bar */}
      <div className="text-chat__input-bar">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="input-field"
            type="text"
            placeholder="Ask anything about the resume…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            maxLength={500}
            autoComplete="off"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>

        <button
          className="reset-btn"
          onClick={handleReset}
          aria-label="Clear chat"
          title="Clear conversation"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  )
}

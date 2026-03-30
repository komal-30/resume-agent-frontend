import { User, Bot } from 'lucide-react'

/**
 * @param {{ role: 'user'|'agent', text: string }} props
 */
export default function MessageBubble({ role, text }) {
  const isUser = role === 'user'

  return (
    <div className={`msg-row msg-row--${role}`}>
      <div className={`msg-avatar msg-avatar--${role}`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div className={`msg-bubble msg-bubble--${role}`}>
        <span className="msg-sender">{isUser ? 'You' : 'Resume Agent'}</span>
        <p className="msg-text">{text}</p>
      </div>
    </div>
  )
}

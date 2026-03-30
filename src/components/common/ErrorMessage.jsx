import { AlertCircle, X } from 'lucide-react'
import './common.css'

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="error-message" role="alert">
      <AlertCircle size={16} className="error-icon" />
      <span className="error-text">{message}</span>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

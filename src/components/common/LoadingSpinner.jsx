import './common.css'

export default function LoadingSpinner({ size = 'md', text = 'Processing...' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <svg
        className="spinner-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeOpacity="0.2"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  )
}

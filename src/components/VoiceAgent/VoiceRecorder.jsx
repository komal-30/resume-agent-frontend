import { Mic, Square, MicOff } from 'lucide-react'

export default function VoiceRecorder({ isListening, isSupported, isDisabled, onStart, onStop }) {
  if (!isSupported) {
    return (
      <div className="recorder-unsupported">
        <MicOff size={32} />
        <p>Speech recognition is not supported in this browser.</p>
        <span>Try Chrome or Edge for voice features.</span>
      </div>
    )
  }

  return (
    <div className="recorder-container">
      <div className="mic-wrapper">
        {isListening && (
          <>
            <span className="pulse-ring pulse-ring--1" />
            <span className="pulse-ring pulse-ring--2" />
            <span className="pulse-ring pulse-ring--3" />
          </>
        )}
        <button
          className={`mic-btn${isListening ? ' mic-btn--recording' : ''}`}
          onClick={isListening ? onStop : onStart}
          disabled={isDisabled}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
        >
          {isListening ? <Square size={26} fill="white" /> : <Mic size={30} />}
        </button>
      </div>

      <p className="recorder-hint">
        {isListening
          ? 'Listening… click to stop'
          : isDisabled
          ? 'Processing your question…'
          : 'Click to ask about the resume'}
      </p>
    </div>
  )
}

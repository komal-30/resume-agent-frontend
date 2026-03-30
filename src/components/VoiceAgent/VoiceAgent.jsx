import { useState, useEffect, useRef } from 'react'
import { User, Bot } from 'lucide-react'
import VoiceRecorder from './VoiceRecorder'
import AudioPlayer from './AudioPlayer'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useAudioPlayback } from '../../hooks/useAudioPlayback'
import { askVoiceQuestion } from '../../services/voiceService'
import './VoiceAgent.css'

export default function VoiceAgent() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    transcript,
    finalTranscript,
    isListening,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition()

  const { isPlaying, playAudio, stopAudio } = useAudioPlayback()

  // Track previous finalTranscript to avoid re-submitting same result
  const prevFinalRef = useRef('')

  useEffect(() => {
    if (finalTranscript && finalTranscript !== prevFinalRef.current) {
      prevFinalRef.current = finalTranscript
      handleAsk(finalTranscript)
    }
  }, [finalTranscript])

  async function handleAsk(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    setQuestion(trimmed)
    setResponse(null)
    setError(null)
    setLoading(true)

    try {
      const data = await askVoiceQuestion(trimmed)
      setResponse(data)
      if (data.audioBase64) {
        playAudio(data.audioBase64)
      }
    } catch (err) {
      setError(err.message || 'Failed to get a response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const combinedError = speechError || error

  return (
    <div className="voice-agent">
      <div className="voice-agent__recorder-card">
        <VoiceRecorder
          isListening={isListening}
          isSupported={isSupported}
          isDisabled={loading}
          onStart={startListening}
          onStop={stopListening}
        />

        {/* Live interim transcript */}
        {isListening && transcript && (
          <p className="voice-agent__interim">"{transcript}"</p>
        )}
      </div>

      {combinedError && (
        <div className="voice-agent__error">
          <ErrorMessage message={combinedError} onDismiss={() => setError(null)} />
        </div>
      )}

      {(question || loading) && (
        <div className="voice-agent__exchange">
          {question && (
            <div className="exchange-row exchange-row--user">
              <div className="exchange-avatar exchange-avatar--user">
                <User size={14} />
              </div>
              <div className="exchange-bubble exchange-bubble--user">
                <span className="exchange-label">You</span>
                <p>{question}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="exchange-row exchange-row--agent">
              <div className="exchange-avatar exchange-avatar--agent">
                <Bot size={14} />
              </div>
              <div className="exchange-bubble exchange-bubble--agent">
                <LoadingSpinner size="sm" text="Thinking…" />
              </div>
            </div>
          )}

          {response && !loading && (
            <div className="exchange-row exchange-row--agent">
              <div className="exchange-avatar exchange-avatar--agent">
                <Bot size={14} />
              </div>
              <div className="exchange-bubble exchange-bubble--agent">
                <span className="exchange-label">Resume Agent</span>
                <p>{response.text}</p>
                <AudioPlayer
                  isPlaying={isPlaying}
                  onPlay={() => playAudio(response.audioBase64)}
                  onStop={stopAudio}
                  disabled={!response.audioBase64}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!question && !loading && (
        <div className="voice-agent__tips">
          <p className="tips-heading">Try asking:</p>
          <ul className="tips-list">
            <li>"What are Koko's technical skills?"</li>
            <li>"Tell me about the work experience."</li>
            <li>"What projects has Koko built?"</li>
          </ul>
        </div>
      )}
    </div>
  )
}

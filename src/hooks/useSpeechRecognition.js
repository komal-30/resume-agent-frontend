import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook wrapping the Web Speech API.
 *
 * Returns:
 *   transcript      – live text as user speaks (cleared on each new session)
 *   finalTranscript – confirmed final text (set when speech ends)
 *   isListening     – true while microphone is active
 *   isSupported     – false if browser lacks SpeechRecognition
 *   error           – string error message, or null
 *   startListening  – () => void
 *   stopListening   – () => void
 */
export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(true)

  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += text
        } else {
          interim += text
        }
      }

      setTranscript(final || interim)
      if (final) setFinalTranscript(final)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.')
      } else {
        setError(`Speech recognition error: ${event.error}`)
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript('')
    setFinalTranscript('')
    setError(null)
    try {
      recognitionRef.current.start()
    } catch {
      // recognition already started – ignore
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
  }, [])

  return {
    transcript,
    finalTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  }
}

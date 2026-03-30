import { useState, useRef, useCallback } from 'react'
import { base64ToBlob, createAudioUrl } from '../utils/audioUtils'

/**
 * Custom hook for playing base64-encoded audio.
 *
 * Returns:
 *   isPlaying  – true while audio is playing
 *   playAudio  – (base64: string) => void
 *   stopAudio  – () => void
 */
export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const urlRef = useRef(null)

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onplay = null
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current = null
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }, [])

  const playAudio = useCallback((base64Audio) => {
    cleanup()

    const blob = base64ToBlob(base64Audio, 'audio/mpeg')
    const url = createAudioUrl(blob)
    urlRef.current = url

    const audio = new Audio(url)
    audioRef.current = audio

    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => {
      setIsPlaying(false)
      cleanup()
    }
    audio.onerror = () => {
      setIsPlaying(false)
      cleanup()
    }

    audio.play().catch(() => setIsPlaying(false))
  }, [cleanup])

  const stopAudio = useCallback(() => {
    cleanup()
    setIsPlaying(false)
  }, [cleanup])

  return { isPlaying, playAudio, stopAudio }
}

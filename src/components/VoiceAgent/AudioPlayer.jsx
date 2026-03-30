import { Play, Square, Volume2 } from 'lucide-react'

export default function AudioPlayer({ isPlaying, onPlay, onStop, disabled }) {
  return (
    <div className="audio-player">
      <Volume2 size={15} className="audio-player__icon" />
      <button
        className={`audio-player__btn${isPlaying ? ' audio-player__btn--playing' : ''}`}
        onClick={isPlaying ? onStop : onPlay}
        disabled={disabled}
        aria-label={isPlaying ? 'Stop audio' : 'Play audio response'}
      >
        {isPlaying
          ? <><Square size={12} fill="white" /> Stop</>
          : <><Play  size={12} fill="white" /> Play Response</>
        }
      </button>

      {isPlaying && (
        <span className="audio-player__waveform">
          <span /><span /><span /><span /><span />
        </span>
      )}
    </div>
  )
}

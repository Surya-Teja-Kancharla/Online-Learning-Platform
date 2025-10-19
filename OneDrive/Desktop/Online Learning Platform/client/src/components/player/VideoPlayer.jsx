/**
 * VideoPlayer Component
 * Supports YouTube, Vimeo, and HTML5 video
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({
  url,
  provider = 'youtube',
  startPosition = 0,
  onProgress,
  onComplete,
  onReady,
  darkMode = false,
}) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Seek to start position when ready
  useEffect(() => {
    if (playerRef.current && startPosition > 0) {
      playerRef.current.seekTo(startPosition, 'seconds');
    }
  }, [startPosition]);

  // Save progress periodically
  useEffect(() => {
    if (playing && onProgress) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          onProgress(currentTime);
        }
      }, 5000); // Save every 5 seconds
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [playing, onProgress]);

  const handleProgress = (state) => {
    setProgress(state.playedSeconds);
    setLoaded(state.loadedSeconds);
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const handleEnded = () => {
    setPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleReady = () => {
    if (onReady) {
      onReady();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = ('0' + date.getUTCSeconds()).slice(-2);
    if (hh) {
      return `${hh}:${('0' + mm).slice(-2)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div className={`relative w-full ${darkMode ? 'bg-gray-900' : 'bg-black'}`}>
      {/* Player Container */}
      <div className="relative pt-[56.25%]">
        <ReactPlayer
          ref={playerRef}
          url={url}
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
          playing={playing}
          controls
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          onReady={handleReady}
          config={{
            youtube: {
              playerVars: { showinfo: 1 }
            },
            vimeo: {
              playerOptions: { byline: false }
            }
          }}
        />
      </div>

      {/* Custom Controls Overlay (optional) */}
      <div className={`flex items-center justify-between px-4 py-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <button
          onClick={() => setPlaying(!playing)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 mx-4">
          <div className="text-sm">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
        </div>

        <div className="text-sm">
          {provider === 'youtube' && '📺 YouTube'}
          {provider === 'vimeo' && '🎬 Vimeo'}
          {provider === 'custom' && '▶️ Video'}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
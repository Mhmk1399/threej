"use client";
import { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;
      
      // Force play on component mount and page reload
      const startPlaying = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Playing successfully
          }).catch(() => {
            // If autoplay is blocked, try again on user interaction
            const playOnInteraction = () => {
              audio.play();
              window.removeEventListener('click', playOnInteraction);
              window.removeEventListener('touchstart', playOnInteraction);
            };
            window.addEventListener('click', playOnInteraction);
            window.addEventListener('touchstart', playOnInteraction);
          });
        }
      };

      // Start playing immediately
      startPlaying();

      // Also try to play when window gains focus
      window.addEventListener('focus', startPlaying);
      
      return () => {
        window.removeEventListener('focus', startPlaying);
        audio.pause();
      };
    }
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.play();
        audio.volume = 1;
      } else {
        audio.pause();
        audio.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <audio ref={audioRef} src="/audio/akMusic.mp3" loop preload="auto" />
      <button
        onClick={toggleMute}
        className="p-2 mt-3 rounded-full hover:bg-white/20  transition-colors"
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;

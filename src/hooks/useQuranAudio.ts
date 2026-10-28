import { useState, useEffect, useRef, useCallback } from 'react';
import { Reciter } from '../types/quran';
import { getSurahAudioUrl, getSurahAudioFallbacks } from '../data/reciters';
import { updateLastStopped } from '../services/storage';

export interface UseQuranAudioProps {
  currentReciter: Reciter;
  currentSurahId: number;
  onSurahChange: (newSurahId: number) => void;
}

export function useQuranAudio({ currentReciter, currentSurahId, onSurahChange }: UseQuranAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<'off' | 'surah' | 'all'>('surah');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Fallback mirrors tracking
  const fallbacksRef = useRef<string[]>([]);
  const fallbackIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Keep isPlayingRef in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    const handleEnded = () => {
      setIsPlaying(false);
      if (loopMode === 'surah') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
        setIsPlaying(true);
      } else if (loopMode === 'all') {
        const nextSurah = currentSurahId < 114 ? currentSurahId + 1 : 1;
        onSurahChange(nextSurah);
      }
    };

    const handleError = () => {
      // Automatic fallback failover
      if (fallbackIndexRef.current < fallbacksRef.current.length - 1) {
        fallbackIndexRef.current += 1;
        const nextMirror = fallbacksRef.current[fallbackIndexRef.current];
        console.warn(`Audio stream failed on mirror. Switching to fallback mirror ${fallbackIndexRef.current}:`, nextMirror);
        audio.src = nextMirror;
        audio.load();
        if (isPlayingRef.current) {
          audio.play().catch(err => console.warn('Fallback play interrupted:', err));
        }
      } else {
        setIsLoading(false);
        setIsPlaying(false);
        setHasError(true);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  // Update audio source when reciter or surah changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const fallbacks = getSurahAudioFallbacks(currentReciter, currentSurahId);
    fallbacksRef.current = fallbacks;
    fallbackIndexRef.current = 0;

    const audioUrl = fallbacks[0] || getSurahAudioUrl(currentReciter, currentSurahId);
    const wasPlaying = isPlaying;

    setIsLoading(true);
    setHasError(false);
    audio.src = audioUrl;
    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;

    // Track last stopped in storage
    updateLastStopped(currentSurahId, 1, currentReciter.id);

    if (wasPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Playback interrupted:', err);
        // Attempt immediate failover if initial source fails
        if (fallbackIndexRef.current < fallbacksRef.current.length - 1) {
          fallbackIndexRef.current += 1;
          audio.src = fallbacksRef.current[fallbackIndexRef.current];
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(false);
        }
      });
    } else {
      setIsPlaying(false);
    }
  }, [currentReciter, currentSurahId]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setHasError(false);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          updateLastStopped(currentSurahId, 1, currentReciter.id);
        })
        .catch(err => {
          console.warn('Audio primary play failed, attempting fallback mirror:', err);
          if (fallbackIndexRef.current < fallbacksRef.current.length - 1) {
            fallbackIndexRef.current += 1;
            audio.src = fallbacksRef.current[fallbackIndexRef.current];
            audio.play()
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
                updateLastStopped(currentSurahId, 1, currentReciter.id);
              })
              .catch(err2 => {
                console.error('All mirrors failed:', err2);
                setIsPlaying(false);
                setIsLoading(false);
                setHasError(true);
              });
          } else {
            setIsPlaying(false);
            setIsLoading(false);
            setHasError(true);
          }
        });
    }
  }, [isPlaying, currentSurahId, currentReciter]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const changeVolume = useCallback((newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const nextSurah = useCallback(() => {
    const next = currentSurahId < 114 ? currentSurahId + 1 : 1;
    onSurahChange(next);
  }, [currentSurahId, onSurahChange]);

  const prevSurah = useCallback(() => {
    const prev = currentSurahId > 1 ? currentSurahId - 1 : 114;
    onSurahChange(prev);
  }, [currentSurahId, onSurahChange]);

  return {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    loopMode,
    isLoading,
    hasError,
    togglePlay,
    seek,
    changePlaybackRate,
    changeVolume,
    toggleMute,
    setLoopMode,
    nextSurah,
    prevSurah,
    audioUrl: getSurahAudioUrl(currentReciter, currentSurahId)
  };
}

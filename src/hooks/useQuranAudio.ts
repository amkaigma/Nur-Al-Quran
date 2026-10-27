import { useState, useEffect, useRef, useCallback } from 'react';
import { Reciter } from '../types/quran';
import { getSurahAudioUrl } from '../data/reciters';
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
      setIsLoading(false);
      setIsPlaying(false);
      setHasError(true);
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

    const audioUrl = getSurahAudioUrl(currentReciter, currentSurahId);
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
        setIsPlaying(false);
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
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          updateLastStopped(currentSurahId, 1, currentReciter.id);
        })
        .catch(err => {
          console.error('Audio play failed:', err);
          setIsPlaying(false);
          setIsLoading(false);
          setHasError(true);
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

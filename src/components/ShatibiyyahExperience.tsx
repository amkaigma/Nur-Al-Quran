import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Volume2, 
  VolumeX, 
  Search, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Info, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Sliders, 
  Repeat, 
  Repeat1, 
  Music, 
  UserCheck, 
  Layers, 
  Eye, 
  ExternalLink,
  BookMarked,
  X
} from 'lucide-react';
import { 
  SHATIBIYYAH_META, 
  SHATIBIYYAH_ABWAB, 
  SHATIBIYYAH_ABYAT, 
  ShatibiyyahBab, 
  ShatibiyyahBayt, 
  getShatibiyyahBabById, 
  getAbyatByBabId, 
  searchShatibiyyah 
} from '../data/shatibiyyahData';

export const ShatibiyyahExperience: React.FC = () => {
  // Navigation & Content Selection
  const [selectedBabId, setSelectedBabId] = useState<string>('muqaddimah');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBaytId, setActiveBaytId] = useState<string>('shat-1');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showDownloadToast, setShowDownloadToast] = useState<string | null>(null);

  // Reading Preferences
  const [readingMode, setReadingMode] = useState<'shatrain' | 'study' | 'continuous'>('shatrain');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [colorTheme, setColorTheme] = useState<'emerald' | 'cream' | 'sepia' | 'dark'>('emerald');

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<'chapter' | 'bayt' | 'continuous'>('chapter');

  // Bookmarks & Clipboard Persistence
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_shatibiyyah_bookmarks');
      return saved ? JSON.parse(saved) : ['shat-1', 'shat-100', 'shat-109'];
    } catch {
      return ['shat-1', 'shat-100', 'shat-109'];
    }
  });

  // Audio Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active Bab
  const activeBab = useMemo<ShatibiyyahBab>(() => {
    return getShatibiyyahBabById(selectedBabId) || SHATIBIYYAH_ABWAB[0];
  }, [selectedBabId]);

  // Abyat to display
  const displayedAbyat = useMemo<ShatibiyyahBayt[]>(() => {
    if (searchQuery.trim()) {
      return searchShatibiyyah(searchQuery);
    }
    return getAbyatByBabId(selectedBabId);
  }, [selectedBabId, searchQuery]);

  // Audio Setup & Track Switching
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = activeBab.audioTrack.audioUrl;
    audio.playbackRate = playbackSpeed;
    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Audio auto-play prevented:', err);
        setIsPlaying(false);
      });
    }
  }, [activeBab.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || activeBab.audioTrack.durationSeconds || 180);
    };

    const handleEnded = () => {
      if (loopMode === 'chapter') {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else if (loopMode === 'continuous') {
        // Advance to next chapter
        const currentIndex = SHATIBIYYAH_ABWAB.findIndex(b => b.id === activeBab.id);
        if (currentIndex < SHATIBIYYAH_ABWAB.length - 1) {
          const nextBab = SHATIBIYYAH_ABWAB[currentIndex + 1];
          setSelectedBabId(nextBab.id);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeBab.id, loopMode]);

  // Playback Control Handlers
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback initiation failed:', err);
      });
    }
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleNextSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const toggleLoopMode = () => {
    if (loopMode === 'chapter') setLoopMode('continuous');
    else if (loopMode === 'continuous') setLoopMode('bayt');
    else setLoopMode('chapter');
  };

  // Direct Audio Download Handler
  const handleDownloadAudio = (bab: ShatibiyyahBab) => {
    const link = document.createElement('a');
    link.href = bab.audioTrack.downloadUrl;
    link.download = `Matn_Shatibiyyah_${bab.number}_${bab.id}_Sheikh_Okasha_Kameny.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowDownloadToast(`Downloaded: ${bab.titleArabic} — Sheikh Okasha Kameny (الشيخ عكاشة كميني)`);
    setTimeout(() => setShowDownloadToast(null), 4500);
  };

  // Bookmark Toggle
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('nur_quran_shatibiyyah_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Copy to Clipboard
  const copyBaytText = (bayt: ShatibiyyahBayt, withNotes = false) => {
    let text = `${bayt.shatrA} ... ${bayt.shatrB}\n(متن الشاطبية — البيت ${bayt.baytNumber})`;
    if (withNotes) {
      text += `\n\nEnglish: ${bayt.englishTranslation}\n\nQira'at Rule: ${bayt.qiraatExplanation}`;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(bayt.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Active theme classes
  const themeStyles = {
    emerald: {
      card: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-950 dark:text-emerald-100',
      activeCard: 'border-emerald-600 bg-emerald-900/10 dark:bg-emerald-900/20 shadow-md',
      baytA: 'text-emerald-950 dark:text-emerald-50',
      baytB: 'text-emerald-900 dark:text-emerald-200',
      accent: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
    },
    cream: {
      card: 'bg-[#faf6eb] dark:bg-[#1a1714] border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-100',
      activeCard: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-md',
      baytA: 'text-amber-950 dark:text-amber-50',
      baytB: 'text-amber-900 dark:text-amber-200',
      accent: 'text-amber-700 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
    },
    sepia: {
      card: 'bg-[#f4ecd8] dark:bg-[#201c18] border-yellow-300/40 dark:border-yellow-900/40 text-stone-900 dark:text-stone-100',
      activeCard: 'border-yellow-600 bg-yellow-100/50 dark:bg-yellow-950/30 shadow-md',
      baytA: 'text-stone-900 dark:text-stone-50',
      baytB: 'text-stone-800 dark:text-stone-200',
      accent: 'text-yellow-800 dark:text-yellow-400',
      badge: 'bg-yellow-200/70 dark:bg-yellow-900/60 text-yellow-900 dark:text-yellow-300 border-yellow-400 dark:border-yellow-700'
    },
    dark: {
      card: 'bg-slate-900 border-slate-800 text-slate-100',
      activeCard: 'border-emerald-500 bg-slate-850 shadow-md',
      baytA: 'text-white',
      baytB: 'text-slate-200',
      accent: 'text-emerald-400',
      badge: 'bg-slate-800 text-emerald-300 border-slate-700'
    }
  }[colorTheme];

  // Font size classes
  const fontStyles = {
    normal: { arabic: 'text-lg sm:text-xl leading-relaxed', english: 'text-xs sm:text-sm' },
    large: { arabic: 'text-xl sm:text-2xl leading-loose', english: 'text-sm sm:text-base' },
    xlarge: { arabic: 'text-2xl sm:text-3xl leading-loose', english: 'text-base sm:text-lg' }
  }[fontSize];

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Download Toast Notification */}
      {showDownloadToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-slide-up">
          <Download className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs sm:text-sm font-medium leading-snug">
            {showDownloadToast}
          </div>
          <button 
            onClick={() => setShowDownloadToast(null)}
            className="p-1 text-emerald-300 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 1. Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-10 border border-emerald-700/50 shadow-xl">
        {/* Background Islamic Watermark Calligraphy */}
        <div className="absolute -right-6 -bottom-10 opacity-10 font-arabic text-8xl sm:text-9xl pointer-events-none select-none">
          الشاطبية
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seven Canonical Qira’at · القراءات السبع</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reciter: Sheikh Okasha Kameny (الشيخ عكاشة كميني)</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-arabic text-amber-300 leading-snug">
              {SHATIBIYYAH_META.titleArabic}
            </h1>
            <p className="text-base sm:text-xl font-bold text-emerald-100 mt-1">
              {SHATIBIYYAH_META.commonName} (حرز الأماني ووجه التهاني)
            </p>
          </div>

          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
            Composed by <span className="font-semibold text-white">{SHATIBIYYAH_META.author}</span> ({SHATIBIYYAH_META.authorYears}). The universal foundation poem of 1,173 poetic couplets codifying the Seven Canonical Readings of the Holy Quran in Bahr at-Taweel.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Recitation' : 'Listen: Sheikh Okasha Kameny'}</span>
            </button>

            <button
              onClick={() => handleDownloadAudio(activeBab)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-500/40 text-emerald-100 font-semibold text-xs sm:text-sm transition-all"
              title="Download MP3 of current chapter"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download MP3</span>
            </button>

            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/90 font-medium text-xs sm:text-sm transition-all"
            >
              <Info className="w-4 h-4" />
              <span>Book & Author Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Dedicated Audio Player & Reciter Controller Bar ── */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Active Track Title & Reciter Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-arabic font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {activeBab.titleArabic}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
                  Bab {activeBab.number}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {activeBab.audioTrack.reciterArabic} (Sheikh Okasha Kameny)
                </span>
                <span>•</span>
                <span>{activeBab.versesCount} Abyat</span>
              </div>
            </div>
          </div>

          {/* Quick Player Actions */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            {/* Speed Selector */}
            <button
              onClick={handleNextSpeed}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              title="Change playback speed"
            >
              {playbackSpeed}x
            </button>

            {/* Loop Mode Toggle */}
            <button
              onClick={toggleLoopMode}
              className={`p-2 rounded-xl transition-colors ${
                loopMode !== 'chapter' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              title={`Repeat: ${loopMode === 'chapter' ? 'Repeat Bab' : loopMode === 'bayt' ? 'Repeat Bayt' : 'Continuous'}`}
            >
              {loopMode === 'bayt' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mute/Volume */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Direct Download MP3 Button */}
            <button
              onClick={() => handleDownloadAudio(activeBab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-xs"
              title="Download MP3 audio file of this chapter recited by Sheikh Okasha Kameny"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Download MP3</span>
            </button>
          </div>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 180}
              step="0.5"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Chapter (Bab) Selection & Search Toolbar ── */}
      <div className="space-y-3">
        {/* Search Bar & View Modes */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Arabic word, English meaning, or Bayt number (e.g. بسمل، مالك، ورش، 100)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reader Display Mode Switch */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 shrink-0">
            <button
              onClick={() => setReadingMode('shatrain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                readingMode === 'shatrain'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Poetic Hemistich View"
            >
              عرض الشطرين
            </button>
            <button
              onClick={() => setReadingMode('study')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                readingMode === 'study'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Study & Qira'at Commentary"
            >
              الشرح والرموز
            </button>
            <button
              onClick={() => setReadingMode('continuous')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                readingMode === 'continuous'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Continuous Reader Mode"
            >
              قراءة مسترسلة
            </button>
          </div>
        </div>

        {/* Visual Customization: Theme & Font Size */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Theme:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setColorTheme('emerald')}
                className={`px-2.5 py-1 rounded-lg font-semibold border ${
                  colorTheme === 'emerald'
                    ? 'bg-emerald-800 text-white border-emerald-700'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                Emerald
              </button>
              <button
                onClick={() => setColorTheme('cream')}
                className={`px-2.5 py-1 rounded-lg font-semibold border ${
                  colorTheme === 'cream'
                    ? 'bg-amber-700 text-white border-amber-600'
                    : 'bg-[#faf6eb] text-amber-950 border-amber-300 dark:bg-[#1a1714] dark:text-amber-300'
                }`}
              >
                Cream
              </button>
              <button
                onClick={() => setColorTheme('sepia')}
                className={`px-2.5 py-1 rounded-lg font-semibold border ${
                  colorTheme === 'sepia'
                    ? 'bg-yellow-700 text-white border-yellow-600'
                    : 'bg-[#f4ecd8] text-yellow-950 border-yellow-300 dark:bg-[#201c18] dark:text-yellow-300'
                }`}
              >
                Sepia
              </button>
              <button
                onClick={() => setColorTheme('dark')}
                className={`px-2.5 py-1 rounded-lg font-semibold border ${
                  colorTheme === 'dark'
                    ? 'bg-slate-700 text-white border-slate-600'
                    : 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Night
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Font Size:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  fontSize === 'normal'
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  fontSize === 'large'
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  fontSize === 'xlarge'
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                A++
              </button>
            </div>
          </div>
        </div>

        {/* Abwab Horizontal Chips Bar */}
        {!searchQuery && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {SHATIBIYYAH_ABWAB.map((bab) => {
              const isSelected = bab.id === selectedBabId;
              return (
                <button
                  key={bab.id}
                  onClick={() => {
                    setSelectedBabId(bab.id);
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-600'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-emerald-900 text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {bab.number}
                  </span>
                  <span className="font-arabic">{bab.titleArabic}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 4. Main Reading & Audio Section ── */}
      <div className="space-y-4">
        {/* Active Bab Summary Header */}
        {!searchQuery && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  Bab {activeBab.number} of {SHATIBIYYAH_ABWAB.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Abyat {activeBab.baytRange.start} – {activeBab.baytRange.end} ({activeBab.versesCount} couplets)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-arabic text-slate-900 dark:text-white">
                {activeBab.titleArabic}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {activeBab.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownloadAudio(activeBab)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Audio Track</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Results Count */}
        {searchQuery && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
            <span>Found {displayedAbyat.length} couplets matching &quot;{searchQuery}&quot;</span>
            <button 
              onClick={() => setSearchQuery('')}
              className="font-bold underline hover:text-emerald-950 dark:hover:text-white"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Abyat Cards Listing */}
        {displayedAbyat.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">No couplets found</h3>
            <p className="text-xs text-slate-500 mt-1">Try another search term or bayt number.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAbyat.map((bayt) => {
              const isActive = activeBaytId === bayt.id;
              const isBookmarked = bookmarks.includes(bayt.id);
              const isCopied = copiedId === bayt.id;

              return (
                <div
                  key={bayt.id}
                  onClick={() => setActiveBaytId(bayt.id)}
                  className={`rounded-3xl p-5 sm:p-6 border transition-all duration-200 relative ${themeStyles.card} ${
                    isActive ? themeStyles.activeCard : 'hover:border-emerald-500/50'
                  }`}
                >
                  {/* Top Bayt Card Meta: Number & Actions */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${themeStyles.badge}`}>
                        البيت #{bayt.baytNumber}
                      </span>
                      {bayt.keyTheme && (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {bayt.keyTheme}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyBaytText(bayt, false);
                        }}
                        className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Copy Arabic text"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(bayt.id);
                        }}
                        className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark couplet'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ── Visual Mode 1: Classic Poetic Hemistich View (عرض الشطرين) ── */}
                  {readingMode === 'shatrain' && (
                    <div className="space-y-4 my-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        {/* First Hemistich (صدر البيت) */}
                        <div className="text-right p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">صَدْرُ البَيْتِ</span>
                          <div className={`font-arabic font-bold ${themeStyles.baytA} ${fontStyles.arabic}`}>
                            {bayt.shatrA}
                          </div>
                        </div>

                        {/* Second Hemistich (عَجُز البيت) */}
                        <div className="text-right p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">عَجُزُ البَيْتِ</span>
                          <div className={`font-arabic font-bold ${themeStyles.baytB} ${fontStyles.arabic}`}>
                            {bayt.shatrB}
                          </div>
                        </div>
                      </div>

                      {/* Brief Translation Underneath */}
                      <div className="pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
                        &quot;{bayt.englishTranslation}&quot;
                      </div>
                    </div>
                  )}

                  {/* ── Visual Mode 2: Study & Qira'at Commentary View ── */}
                  {readingMode === 'study' && (
                    <div className="space-y-4 my-2">
                      {/* Arabic Full Bayt */}
                      <div className={`font-arabic font-bold text-right leading-loose ${themeStyles.baytA} ${fontStyles.arabic}`}>
                        {bayt.fullArabic}
                      </div>

                      {/* Translation */}
                      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">Meaning in English:</span>
                        {bayt.englishTranslation}
                      </div>

                      {/* Qira'at Rule Explanation */}
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Qira’at Codification (توجيه القراءة):</span>
                        </span>
                        {bayt.qiraatExplanation}
                      </div>

                      {/* Cryptographic Symbols Breakdown (رموز القراءات) */}
                      {bayt.ramzBreakdown && bayt.ramzBreakdown.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Cryptographic Symbols in this Couplet (رموز القراء):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {bayt.ramzBreakdown.map((ramz, idx) => (
                              <div 
                                key={idx}
                                className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2"
                              >
                                <span className="font-bold font-arabic px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-sm">
                                  {ramz.symbol}
                                </span>
                                <div>
                                  <span className="font-semibold">{ramz.imamOrRawi}</span>
                                  <span className="text-[11px] opacity-80 block">{ramz.meaning}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Visual Mode 3: Continuous Reading View ── */}
                  {readingMode === 'continuous' && (
                    <div className="space-y-2 my-2">
                      <div className={`font-arabic font-bold text-right ${themeStyles.baytA} ${fontStyles.arabic}`}>
                        {bayt.fullArabic}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {bayt.englishTranslation}
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/5 dark:border-white/5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyBaytText(bayt, true);
                        }}
                        className="hover:underline flex items-center gap-1 font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy with Notes</span>
                      </button>
                    </div>

                    <span className="text-[11px] font-arabic opacity-70">
                      بحر الطويل · رويّ اللام
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. Book & Author Info Modal ── */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg sm:text-xl font-bold font-arabic text-slate-900 dark:text-white">
                  عن متن الشاطبية والإمام الشاطبي
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  كتاب حرز الأماني ووجه التهاني في القراءات السبع
                </h4>
                <p>
                  من أعظم وأشهر المنظومات العلمية في تاريخ علوم القرآن. نظمها الإمام الشاطبي الأندلسي في 1,173 بيتاً من بحر الطويل، وقافيتها اللام، ولذلك سميت بـ &quot;اللامية&quot;. وهي اختصار وتسهيل لكتاب &quot;التيسير في القراءات السبع&quot; لأبي عمرو الداني.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Author: Imam Al-Shatibi (538 – 590 AH / 1144 – 1194 CE)
                </h4>
                <p>
                  {SHATIBIYYAH_META.authorBio}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Audio Reciter: Sheikh Okasha Kameny (الشيخ عكاشة كميني)
                </h4>
                <p>
                  {SHATIBIYYAH_META.reciterBio}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
                  نظام الرموز الحرفية في الشاطبية (Cryptographic Cipher)
                </h4>
                <p className="mb-2">
                  استخدم الإمام الشاطبي حساب الجمل لترتيب رموز القراء السبعة ورواتهم الأربعة عشر:
                </p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-arabic text-xs">
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">أَبَج: نافع (أ)، قالون (ب)، ورش (ج)</li>
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">دَهَز: ابن كثير (د)، البزي (هـ)، قنبل (ز)</li>
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">حُطِّي: أبو عمرو (ح)، الدوري (ط)، السوسي (ي)</li>
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">كَلَمَن: ابن عامر (ك)، هشام (ل)، ابن ذكوان (م)</li>
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">نَصَع: عاصم (ن)، شعبة (ص)، حفص (ع)</li>
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">فَضَق: حمزة (ف)، خلف (ض)، خلاد (ق)</li>
                  <li className="bg-white dark:bg-slate-800 p-2 rounded-xl">رَسَت: الكسائي (ر)، أبو الحارث (س)، الدوري (ت)</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

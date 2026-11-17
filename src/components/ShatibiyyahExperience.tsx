import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Settings2,
  X,
  Search,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Repeat,
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  HardDriveDownload,
  WifiOff,
  AlertCircle,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Youtube,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  SHATIBIYYAH_META,
  SHATIBIYYAH_ABWAB,
  SHATIBIYYAH_ABYAT,
  SHATIBIYYAH_DEFAULT_AUDIO_PARTS,
  ShatibiyyahBab,
  ShatibiyyahBayt,
  ShatibiyyahAudioPart,
  ShatibiyyahTimestampEntry,
  getShatibiyyahBabById,
  getAbyatByBabId,
  getAbyatByPage,
  getBaytByNumber,
  getBaytById,
  searchShatibiyyah,
  normalizeShatibiyyahBookmarks
} from '../data/shatibiyyahData';
import { fetchShatibiyyahSyncState } from '../services/adminService';
import {
  ShatibiyyahPlaybackMode,
  PersistedShatibiyyahPlayback,
  SHATIBIYYAH_PLAYBACK_STORAGE_KEY,
  ShatibiyyahAudioDiagnosticsReport,
  enrichBaytWithTimestamp,
  resolveBaytAudioSegment,
  getFirstAvailableAudioPart,
  getPartPlaybackKind,
  getSyncedBaytsForPart,
  getMissingTimestampsSummary,
  findBaytAtTime,
  computePlaybackProgress,
  runShatibiyyahAudioDiagnostics
} from '../utils/shatibiyyahSync';
import {
  SHATIBIYYAH_YOUTUBE_VIDEO_ID,
  SHATIBIYYAH_YOUTUBE_URL,
  YTPlayerInstance,
  YT_PLAYER_STATE,
  describeYouTubeError,
  loadYouTubeIframeAPI
} from '../utils/youtubePlayer';
import { ShatibiyyahTimestampEditor } from './ShatibiyyahTimestampEditor';

interface ReadingSettings {
  fontSize: 'compact' | 'medium' | 'large' | 'xlarge';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  pageLayout: 'pages' | 'continuous';
  readingTheme: 'cream' | 'sepia' | 'white' | 'dark';
  autoHighlight: boolean;
  autoScroll: boolean;
  showBaytNumber: boolean;
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 'medium',
  lineSpacing: 'normal',
  pageLayout: 'pages',
  readingTheme: 'cream',
  autoHighlight: true,
  autoScroll: true,
  showBaytNumber: true
};

const OFFLINE_CACHE_NAME = 'nur-quran-shatibiyyah-offline-v1';
const ALLOWED_SPEEDS = [0.75, 1.0, 1.25, 1.5];

type PlaybackStatus =
  | 'idle'
  | 'loading'
  | 'seeking'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';

interface PendingSeek {
  partId: string;
  targetTime: number;
  autoPlay: boolean;
  baytId: string;
  mode: ShatibiyyahPlaybackMode;
  phase: 'need_metadata' | 'awaiting_seeked';
}

interface UnavailableFeedback {
  baytNumber: number;
  reason: 'no_audio' | 'no_timestamp';
  message: string;
}

interface ShatibiyyahExperienceProps {
  onBack?: () => void;
}

function readSavedPlayback(): Partial<PersistedShatibiyyahPlayback> {
  try {
    const raw = localStorage.getItem(SHATIBIYYAH_PLAYBACK_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const ShatibiyyahExperience: React.FC<ShatibiyyahExperienceProps> = ({ onBack }) => {
  const initialSavedPlayback = useMemo(() => readSavedPlayback(), []);

  // Navigation & Content Selection (restored safely if valid)
  const [selectedBabId, setSelectedBabId] = useState<string>(() => {
    if (
      initialSavedPlayback.selectedBabId &&
      getShatibiyyahBabById(initialSavedPlayback.selectedBabId)
    ) {
      return initialSavedPlayback.selectedBabId;
    }
    return SHATIBIYYAH_ABWAB[0].id;
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const p = initialSavedPlayback.currentPage;
    if (typeof p === 'number' && p >= 1 && p <= SHATIBIYYAH_META.totalPages) {
      return p;
    }
    return 1;
  });

  const [activeBaytId, setActiveBaytId] = useState<string>(() => {
    if (initialSavedPlayback.activeBaytId && getBaytById(initialSavedPlayback.activeBaytId)) {
      return initialSavedPlayback.activeBaytId;
    }
    return 'shat-0001';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Sync & Authorized Audio State from Server
  const [audioParts, setAudioParts] = useState<ShatibiyyahAudioPart[]>(SHATIBIYYAH_DEFAULT_AUDIO_PARTS);
  const [verifiedTimestamps, setVerifiedTimestamps] = useState<
    Record<string, ShatibiyyahTimestampEntry>
  >({});
  const [syncLoaded, setSyncLoaded] = useState<boolean>(false);
  const [selectedPartId, setSelectedPartId] = useState<string>(
    () => initialSavedPlayback.selectedPartId || 'part-01'
  );
  const [offlinePartIds, setOfflinePartIds] = useState<string[]>([]);
  const [cachingPartId, setCachingPartId] = useState<string | null>(null);
  const offlineBlobUrlRef = useRef<string | null>(null);
  const offlineUrlMapRef = useRef<Record<string, string>>({});

  // Audio Playback State
  const [playbackMode, setPlaybackMode] = useState<ShatibiyyahPlaybackMode>(() =>
    initialSavedPlayback.playbackMode === 'book' ? 'book' : 'single'
  );
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [unavailableFeedback, setUnavailableFeedback] = useState<UnavailableFeedback | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(() =>
    typeof initialSavedPlayback.currentTime === 'number' && initialSavedPlayback.currentTime >= 0
      ? initialSavedPlayback.currentTime
      : 0
  );
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() => {
    const sp = initialSavedPlayback.playbackSpeed;
    return typeof sp === 'number' && ALLOWED_SPEEDS.includes(sp) ? sp : 1.0;
  });
  const [repeatBayt, setRepeatBayt] = useState<boolean>(false);

  // Audio Diagnostics & Timestamp Editor Modal State
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState<boolean>(false);
  const [diagnosticsReport, setDiagnosticsReport] =
    useState<ShatibiyyahAudioDiagnosticsReport | null>(null);
  const [isTimestampEditorOpen, setIsTimestampEditorOpen] = useState<boolean>(false);
  const [editorInitialBayt, setEditorInitialBayt] = useState<number>(1);
  const [isVideoCompact, setIsVideoCompact] = useState<boolean>(false);

  // Official YouTube IFrame Player API state
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const ytVideoIdRef = useRef<string | null>(null);
  const ytReadyRef = useRef<boolean>(false);
  const pendingYtSeekRef = useRef<{
    videoId: string;
    targetTime: number;
    autoPlay: boolean;
    baytId: string;
    mode: ShatibiyyahPlaybackMode;
  } | null>(null);
  const [ytReady, setYtReady] = useState<boolean>(false);
  const [ytErrorMessage, setYtErrorMessage] = useState<string | null>(null);

  // Reading Settings with LocalStorage persistence
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_shatibiyyah_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Bookmarks persistence with automatic migration of legacy IDs
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_shatibiyyah_bookmarks');
      if (saved) {
        const migrated = normalizeShatibiyyahBookmarks(JSON.parse(saved));
        localStorage.setItem('nur_quran_shatibiyyah_bookmarks', JSON.stringify(migrated));
        return migrated.length > 0 ? migrated : ['shat-0001', 'shat-0100', 'shat-1173'];
      }
      return ['shat-0001', 'shat-0100', 'shat-1173'];
    } catch {
      return ['shat-0001', 'shat-0100', 'shat-1173'];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSeekRef = useRef<PendingSeek | null>(null);
  const loadedPartIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const playbackStatusRef = useRef<PlaybackStatus>('idle');
  const restoredSeekQueuedRef = useRef<boolean>(false);
  const noticeTimerRef = useRef<number | null>(null);
  const loadingWatchdogRef = useRef<number | null>(null);
  const lastSavedTimeRef = useRef<number>(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    playbackStatusRef.current = playbackStatus;
  }, [playbackStatus]);

  useEffect(() => {
    ytReadyRef.current = ytReady;
  }, [ytReady]);

  const flashNotice = useCallback((msg: string) => {
    setStatusNotice(msg);
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setStatusNotice(null);
      noticeTimerRef.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  // Fetch server audio parts & verified timestamps on mount
  useEffect(() => {
    fetchShatibiyyahSyncState()
      .then((data) => {
        if (Array.isArray(data.parts) && data.parts.length > 0) {
          setAudioParts(data.parts);
          // Validate restored selectedPartId against server parts (handles Single-File mode cleanly!)
          setSelectedPartId((prevId) => {
            const exists = data.parts.some((p: ShatibiyyahAudioPart) => p.id === prevId);
            if (exists) return prevId;
            return data.parts[0].id;
          });
        }
        if (data.timestamps) {
          setVerifiedTimestamps(data.timestamps);
        }
      })
      .catch(() => {
        // Keep honest default empty-audio state if offline
      })
      .finally(() => {
        setSyncLoaded(true);
      });
  }, []);

  // Queue restored currentTime once after initial sync state arrives (for Reload & Resume)
  useEffect(() => {
    if (!syncLoaded || restoredSeekQueuedRef.current) return;
    restoredSeekQueuedRef.current = true;

    if (pendingSeekRef.current) return; // Never overwrite an active user click

    const savedTime = initialSavedPlayback.currentTime;
    const savedBaytId = initialSavedPlayback.activeBaytId;
    if (typeof savedTime === 'number' && savedTime > 0 && savedBaytId) {
      const baytObj = getBaytById(savedBaytId);
      if (baytObj) {
        const resolved = resolveBaytAudioSegment(
          baytObj.baytNumber,
          audioParts,
          verifiedTimestamps
        );
        if (resolved?.hasPartAudio && resolved.part) {
          pendingSeekRef.current = {
            partId: resolved.part.id,
            targetTime: savedTime,
            autoPlay: false,
            baytId: baytObj.id,
            mode: initialSavedPlayback.playbackMode === 'book' ? 'book' : 'single',
            phase: 'need_metadata'
          };
          if (resolved.part.id !== selectedPartId) {
            setSelectedPartId(resolved.part.id);
          }
        }
      }
    }
  }, [syncLoaded, audioParts, verifiedTimestamps, initialSavedPlayback, selectedPartId]);

  // Persist playback state to localStorage cleanly
  const persistPlaybackState = useCallback(
    (timeOverride?: number) => {
      try {
        const payload: PersistedShatibiyyahPlayback = {
          activeBaytId,
          selectedPartId,
          currentPage,
          selectedBabId,
          currentTime: typeof timeOverride === 'number' ? timeOverride : currentTime,
          playbackMode,
          playbackSpeed
        };
        localStorage.setItem(SHATIBIYYAH_PLAYBACK_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage quota failures
      }
    },
    [activeBaytId, selectedPartId, currentPage, selectedBabId, currentTime, playbackMode, playbackSpeed]
  );

  useEffect(() => {
    persistPlaybackState();
  }, [activeBaytId, selectedPartId, currentPage, selectedBabId, playbackMode, playbackSpeed, isPlaying]);

  // Check which parts are cached offline & pre-warm object URLs for instant synchronous Bayt clicks
  const refreshOfflineCacheStatus = useCallback(async (partsList: ShatibiyyahAudioPart[]) => {
    if (typeof caches === 'undefined') return;
    try {
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      const cachedIds: string[] = [];
      for (const p of partsList) {
        if (p.audioUrl) {
          const match = await cache.match(p.audioUrl);
          if (match) {
            cachedIds.push(p.id);
            if (!offlineUrlMapRef.current[p.id]) {
              const blob = await match.blob();
              offlineUrlMapRef.current[p.id] = URL.createObjectURL(blob);
            }
          }
        }
      }
      setOfflinePartIds(cachedIds);
    } catch {
      // Cache API unavailable
    }
  }, []);

  useEffect(() => {
    refreshOfflineCacheStatus(audioParts);
  }, [audioParts, refreshOfflineCacheStatus]);

  // Safety watchdog: prevent stuck loading spinner if browser audio stalls indefinitely
  useEffect(() => {
    if (loadingWatchdogRef.current) {
      window.clearTimeout(loadingWatchdogRef.current);
      loadingWatchdogRef.current = null;
    }
    if (isAudioLoading) {
      loadingWatchdogRef.current = window.setTimeout(() => {
        setIsAudioLoading(false);
        setPlaybackStatus((prev) => (prev === 'loading' || prev === 'seeking' ? 'error' : prev));
        setAudioError('انتهت مهلة تحميل المقطع الصوتي — تحقق من الاتصال وأعد المحاولة.');
      }, 12000);
    }
    return () => {
      if (loadingWatchdogRef.current) {
        window.clearTimeout(loadingWatchdogRef.current);
        loadingWatchdogRef.current = null;
      }
    };
  }, [isAudioLoading]);

  // Cleanup any created object URLs on unmount
  useEffect(() => {
    return () => {
      if (offlineBlobUrlRef.current) {
        URL.revokeObjectURL(offlineBlobUrlRef.current);
      }
      Object.values(offlineUrlMapRef.current).forEach((url) => URL.revokeObjectURL(url));
      offlineUrlMapRef.current = {};
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ReadingSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('nur_quran_shatibiyyah_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const getBaytWithSync = useCallback(
    (bayt: ShatibiyyahBayt): ShatibiyyahBayt => enrichBaytWithTimestamp(bayt, verifiedTimestamps),
    [verifiedTimestamps]
  );

  // Active Bab
  const activeBab = useMemo<ShatibiyyahBab>(() => {
    return getShatibiyyahBabById(selectedBabId) || SHATIBIYYAH_ABWAB[0];
  }, [selectedBabId]);

  // Displayed Abyat (Search OR Bookmarks OR Printed Page 1..94 OR Continuous Bab)
  const displayedAbyat = useMemo<ShatibiyyahBayt[]>(() => {
    let base: ShatibiyyahBayt[];
    if (searchQuery.trim()) {
      base = searchShatibiyyah(searchQuery);
    } else if (showBookmarksOnly) {
      const set = new Set(bookmarks);
      base = SHATIBIYYAH_ABYAT.filter((b) => set.has(b.id));
    } else if (settings.pageLayout === 'pages') {
      base = getAbyatByPage(currentPage);
    } else {
      base = getAbyatByBabId(selectedBabId);
    }
    return base.map(getBaytWithSync);
  }, [
    searchQuery,
    showBookmarksOnly,
    bookmarks,
    settings.pageLayout,
    currentPage,
    selectedBabId,
    getBaytWithSync
  ]);

  // Current active Bayt object (enriched with verified timestamp)
  const currentActiveBayt = useMemo<ShatibiyyahBayt | undefined>(() => {
    const found = getBaytById(activeBaytId);
    return found ? getBaytWithSync(found) : undefined;
  }, [activeBaytId, getBaytWithSync]);

  // Active Audio Part & Playback Kind (YouTube IFrame vs Uploaded MP3)
  const activePart = useMemo<ShatibiyyahAudioPart>(() => {
    return audioParts.find((p) => p.id === selectedPartId) || audioParts[0];
  }, [audioParts, selectedPartId]);

  const activePartKind = useMemo(() => getPartPlaybackKind(activePart), [activePart]);
  const isYoutubeActive =
    activePartKind.sourceType === 'youtube' && Boolean(activePartKind.youtubeVideoId);
  const activeYoutubeId = activePartKind.youtubeVideoId || SHATIBIYYAH_YOUTUBE_VIDEO_ID;
  const activeYoutubeWatchUrl =
    activePart?.youtubeUrl || `https://www.youtube.com/watch?v=${activeYoutubeId}`;

  // Verified timestamps in the currently loaded audio part & global coverage summary
  const partSyncedBayts = useMemo(() => {
    return getSyncedBaytsForPart(activePart, verifiedTimestamps);
  }, [activePart, verifiedTimestamps]);

  const missingSummary = useMemo(() => {
    return getMissingTimestampsSummary(verifiedTimestamps);
  }, [verifiedTimestamps]);

  // Segment-aware progress calculation for footer slider & timer
  const playbackProgress = useMemo(() => {
    return computePlaybackProgress(playbackMode, currentTime, duration, currentActiveBayt);
  }, [playbackMode, currentTime, duration, currentActiveBayt]);

  const scrollBaytIntoView = useCallback((baytId: string) => {
    window.setTimeout(() => {
      const el = document.getElementById(`bayt-${baytId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  }, []);

  // Jump to a specific Bab cleanly
  const handleSelectBab = (babId: string) => {
    const bab = getShatibiyyahBabById(babId);
    if (!bab) return;
    setSelectedBabId(bab.id);
    setCurrentPage(bab.startPage);
    setSearchQuery('');
    setShowBookmarksOnly(false);
    const firstBayt = getBaytByNumber(bab.baytRange.start);
    if (firstBayt) {
      setActiveBaytId(firstBayt.id);
      const resolved = resolveBaytAudioSegment(
        firstBayt.baytNumber,
        audioParts,
        verifiedTimestamps
      );
      if (resolved?.part && resolved.part.id !== selectedPartId && !isPlaying) {
        setSelectedPartId(resolved.part.id);
      }
    }
  };

  // Update Bab dropdown label when turning pages in Page Mode
  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(SHATIBIYYAH_META.totalPages, nextPage));
    setCurrentPage(clamped);
    const pageAbyat = getAbyatByPage(clamped);
    if (pageAbyat.length > 0) {
      setSelectedBabId(pageAbyat[0].babId);
      const firstBayt = pageAbyat[0];
      const resolved = resolveBaytAudioSegment(
        firstBayt.baytNumber,
        audioParts,
        verifiedTimestamps
      );
      if (resolved?.part && resolved.part.id !== selectedPartId && !isPlaying) {
        setSelectedPartId(resolved.part.id);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start playback with explicit promise error classification (never fail silently!)
  const startAudioPlayback = useCallback(
    (audio: HTMLAudioElement) => {
      try {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsAudioLoading(false);
              setPlaybackStatus('playing');
              setAudioError(null);
            })
            .catch((err: any) => {
              if (err?.name === 'AbortError') return; // Normal interruption from rapid Bayt switching
              setIsPlaying(false);
              setIsAudioLoading(false);
              if (err?.name === 'NotAllowedError') {
                setPlaybackStatus('paused');
                setAudioError('المتصفح منع التشغيل التلقائي — اضغط زر التشغيل للمتابعة.');
                flashNotice('المتصفح منع التشغيل التلقائي — اضغط زر التشغيل في المشغّل.');
              } else {
                const detail = err?.message ? ` (${err.message})` : '';
                setPlaybackStatus('error');
                setAudioError(`تعذر تشغيل التسجيل الصوتي${detail}`);
                flashNotice(`تعذر تشغيل التسجيل الصوتي${detail}`);
              }
            });
        }
      } catch (err: any) {
        setIsPlaying(false);
        setIsAudioLoading(false);
        setPlaybackStatus('error');
        setAudioError(err?.message || 'تعذر تشغيل الملف الصوتي.');
      }
    },
    [flashNotice]
  );

  // Seek or initiate playback once metadata is available
  const processPendingSeek = useCallback(
    (audio: HTMLAudioElement, currentPartId: string) => {
      const pending = pendingSeekRef.current;
      if (!pending || pending.partId !== currentPartId) return;
      if (audio.readyState < 1) return;

      const maxDuration =
        Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : undefined;
      const safeTarget =
        maxDuration !== undefined
          ? Math.max(0, Math.min(pending.targetTime, Math.max(0, maxDuration - 0.04)))
          : Math.max(0, pending.targetTime);

      if (pending.phase === 'need_metadata') {
        if (Math.abs(audio.currentTime - safeTarget) <= 0.06) {
          const shouldAutoPlay = pending.autoPlay;
          pendingSeekRef.current = null;
          setCurrentTime(safeTarget);
          if (shouldAutoPlay) {
            startAudioPlayback(audio);
          } else {
            setIsAudioLoading(false);
            setPlaybackStatus('paused');
          }
        } else {
          pending.phase = 'awaiting_seeked';
          setPlaybackStatus('seeking');
          setIsAudioLoading(true);
          try {
            audio.currentTime = safeTarget;
            setCurrentTime(safeTarget);
          } catch {
            pendingSeekRef.current = null;
            setIsAudioLoading(false);
          }
        }
        return;
      }

      // If browser finished seeking before seeked listener handled it
      if (
        pending.phase === 'awaiting_seeked' &&
        !audio.seeking &&
        Math.abs(audio.currentTime - safeTarget) <= 0.3
      ) {
        const shouldAutoPlay = pending.autoPlay;
        pendingSeekRef.current = null;
        if (shouldAutoPlay) {
          startAudioPlayback(audio);
        } else {
          setIsAudioLoading(false);
          setPlaybackStatus('paused');
        }
      }
    },
    [startAudioPlayback]
  );

  // Bind uploaded <audio> only when activePart uses an uploaded audio file (not YouTube)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;

    const bindSource = async () => {
      if (isYoutubeActive || !activePart || !activePart.hasAudio || !activePart.audioUrl) {
        loadedPartIdRef.current = null;
        pendingSeekRef.current = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        if (!isYoutubeActive) {
          setIsPlaying(false);
          setIsAudioLoading(false);
          setPlaybackStatus('idle');
          setCurrentTime(0);
          setDuration(0);
        }
        return;
      }

      // Avoid double-loading if playSingleBayt / handlePlayFullBook already bound synchronously on click!
      if (loadedPartIdRef.current === activePart.id && audio.getAttribute('src')) {
        return;
      }

      setAudioError(null);
      setIsAudioLoading(true);
      setPlaybackStatus('loading');

      let srcToUse = offlineUrlMapRef.current[activePart.id] || activePart.audioUrl;
      if (!offlineUrlMapRef.current[activePart.id] && typeof caches !== 'undefined') {
        try {
          const cache = await caches.open(OFFLINE_CACHE_NAME);
          const cached = await cache.match(activePart.audioUrl);
          if (cached) {
            const blob = await cached.blob();
            const objUrl = URL.createObjectURL(blob);
            offlineUrlMapRef.current[activePart.id] = objUrl;
            srcToUse = objUrl;
          }
        } catch {
          // fallback to network URL
        }
      }

      if (cancelled) return;
      if (loadedPartIdRef.current === activePart.id && audio.getAttribute('src')) {
        return;
      }

      loadedPartIdRef.current = activePart.id;
      audio.src = srcToUse;
      audio.playbackRate = playbackSpeed;
      audio.load();

      const pendingForThisPart =
        pendingSeekRef.current && pendingSeekRef.current.partId === activePart.id
          ? pendingSeekRef.current
          : null;

      if (!pendingForThisPart) {
        setCurrentTime(0);
      }
      setDuration(activePart.durationSeconds || 0);
    };

    bindSource();
    return () => {
      cancelled = true;
    };
  }, [isYoutubeActive, activePart?.id, activePart?.hasAudio, activePart?.audioUrl, playbackSpeed]);

  // Official YouTube IFrame Player API lifecycle & switching
  useEffect(() => {
    if (!isYoutubeActive) {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
        ytVideoIdRef.current = null;
        setYtReady(false);
      }
      return;
    }

    // If player already exists and ready, only switch videoId when changed
    if (ytPlayerRef.current && ytReadyRef.current) {
      if (ytVideoIdRef.current !== activeYoutubeId) {
        ytVideoIdRef.current = activeYoutubeId;
        const pending = pendingYtSeekRef.current;
        if (pending && pending.videoId === activeYoutubeId) {
          pendingYtSeekRef.current = null;
          if (pending.autoPlay) {
            ytPlayerRef.current.loadVideoById(activeYoutubeId, pending.targetTime);
          } else {
            ytPlayerRef.current.cueVideoById(activeYoutubeId, pending.targetTime);
          }
        } else {
          ytPlayerRef.current.cueVideoById(activeYoutubeId, 0);
        }
      }
      return;
    }

    let cancelled = false;
    setYtErrorMessage(null);
    setYtReady(false);

    loadYouTubeIframeAPI()
      .then((YT) => {
        if (cancelled || !ytContainerRef.current) return;
        ytVideoIdRef.current = activeYoutubeId;
        const player = new YT.Player(ytContainerRef.current, {
          videoId: activeYoutubeId,
          width: '100%',
          height: '100%',
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (ev) => {
              if (cancelled) return;
              ytPlayerRef.current = ev.target;
              ytReadyRef.current = true;
              setYtReady(true);
              setYtErrorMessage(null);
              setAudioError(null);
              setIsAudioLoading(false);

              const dur = ev.target.getDuration?.() || 0;
              if (dur > 0) setDuration(dur);

              try {
                ev.target.setPlaybackRate(playbackSpeed);
              } catch {
                // ignore
              }

              const pending = pendingYtSeekRef.current;
              if (pending) {
                pendingYtSeekRef.current = null;
                if (pending.videoId !== ytVideoIdRef.current) {
                  ytVideoIdRef.current = pending.videoId;
                  if (pending.autoPlay) {
                    ev.target.loadVideoById(pending.videoId, pending.targetTime);
                  } else {
                    ev.target.cueVideoById(pending.videoId, pending.targetTime);
                  }
                } else {
                  ev.target.seekTo(Math.max(0, pending.targetTime), true);
                  setCurrentTime(Math.max(0, pending.targetTime));
                  if (pending.autoPlay) {
                    ev.target.playVideo();
                  } else {
                    setPlaybackStatus('paused');
                  }
                }
              } else {
                setPlaybackStatus('paused');
              }
            },
            onStateChange: (ev) => {
              if (cancelled) return;
              const st = ev.data;
              const dur = ev.target.getDuration?.() || 0;
              if (dur > 0) setDuration(dur);

              if (st === YT_PLAYER_STATE.PLAYING) {
                setIsPlaying(true);
                setIsAudioLoading(false);
                setPlaybackStatus('playing');
                setAudioError(null);
              } else if (st === YT_PLAYER_STATE.BUFFERING) {
                setIsAudioLoading(true);
                setPlaybackStatus('loading');
              } else if (st === YT_PLAYER_STATE.PAUSED || st === YT_PLAYER_STATE.CUED) {
                setIsPlaying(false);
                setIsAudioLoading(false);
                setPlaybackStatus('paused');
                const t = ev.target.getCurrentTime?.();
                if (Number.isFinite(t)) {
                  setCurrentTime(t);
                  persistPlaybackState(t);
                }
              } else if (st === YT_PLAYER_STATE.ENDED) {
                setIsPlaying(false);
                setIsAudioLoading(false);
                setPlaybackStatus('ended');
              }
            },
            onError: (ev) => {
              if (cancelled) return;
              const desc = describeYouTubeError(ev.data);
              setIsPlaying(false);
              setIsAudioLoading(false);
              setPlaybackStatus('error');
              setYtErrorMessage(`${desc.ar} (${desc.en})`);
              setAudioError(desc.ar);
              flashNotice(desc.ar);
            }
          }
        });
        ytPlayerRef.current = player;
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err?.message || 'تعذر تحميل واجهة يوتيوب الرسمية.';
          setYtErrorMessage(msg);
          setAudioError(msg);
          setIsAudioLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isYoutubeActive, activeYoutubeId]);

  useEffect(() => {
    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
        ytReadyRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
    if (ytPlayerRef.current && ytReady) {
      try {
        ytPlayerRef.current.setPlaybackRate(playbackSpeed);
      } catch {
        // ignore
      }
    }
  }, [playbackSpeed, ytReady]);

  // Complete <audio> lifecycle event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      if (activePart?.hasAudio) {
        setIsAudioLoading(true);
        setPlaybackStatus('loading');
        setAudioError(null);
      }
    };

    const handleWaiting = () => {
      setIsAudioLoading(true);
      setPlaybackStatus((prev) => (prev === 'seeking' ? 'seeking' : 'loading'));
    };

    const handlePlay = () => {
      setPlaybackStatus('playing');
    };

    const handlePlaying = () => {
      setIsAudioLoading(false);
      setAudioError(null);
      setIsPlaying(true);
      setPlaybackStatus('playing');
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsAudioLoading(false);
      setPlaybackStatus((prev) => (prev === 'error' || prev === 'ended' ? prev : 'paused'));
      persistPlaybackState(audio.currentTime);
    };

    const handleSeeking = () => {
      setIsAudioLoading(true);
      setPlaybackStatus('seeking');
    };

    const handleSeeked = () => {
      setCurrentTime(audio.currentTime);
      const pending = pendingSeekRef.current;
      const activeId = loadedPartIdRef.current || activePart?.id;
      if (pending && activeId && pending.partId === activeId) {
        const shouldAutoPlay = pending.autoPlay;
        pendingSeekRef.current = null;
        if (shouldAutoPlay) {
          startAudioPlayback(audio);
          return;
        }
      }
      setIsAudioLoading(false);
      setPlaybackStatus(audio.paused ? 'paused' : 'playing');
    };

    const handleError = () => {
      if (!audio.getAttribute('src')) return;
      pendingSeekRef.current = null;
      setIsAudioLoading(false);
      setIsPlaying(false);
      setPlaybackStatus('error');

      const code = audio.error?.code;
      const errMsg =
        code === 1
          ? 'تم إيقاف تحميل الملف الصوتي قبل اكتماله.'
          : code === 2
          ? 'خطأ في الشبكة أثناء تحميل تلاوة الشيخ عكاشة كميني.'
          : code === 3
          ? 'تعذر فك ترميز الملف الصوتي — الملف غير صالح.'
          : code === 4
          ? 'ملف الصوت غير موجود على الخادم أو صيغته غير مدعومة.'
          : 'تعذر تحميل التسجيل الصوتي للشيخ عكاشة كميني.';

      setAudioError(errMsg);
      flashNotice(errMsg);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      const activeId = loadedPartIdRef.current || activePart?.id;
      if (activeId && pendingSeekRef.current?.partId === activeId) {
        processPendingSeek(audio, activeId);
      } else {
        setIsAudioLoading(false);
        if (playbackStatusRef.current === 'loading') {
          setPlaybackStatus('paused');
        }
      }
    };

    const handleCanPlay = () => {
      const activeId = loadedPartIdRef.current || activePart?.id;
      if (activeId && pendingSeekRef.current?.partId === activeId) {
        processPendingSeek(audio, activeId);
      } else {
        setIsAudioLoading(false);
      }
    };

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      if (Math.abs(time - lastSavedTimeRef.current) >= 1.2) {
        lastSavedTimeRef.current = time;
        persistPlaybackState(time);
      }

      // 1. INDIVIDUAL BAYT MODE ('single'): stop cleanly at currentActiveBayt.audioEnd (or loop if repeatBayt)
      if (
        playbackMode === 'single' &&
        currentActiveBayt?.hasTimestamp &&
        currentActiveBayt.audioStart !== null &&
        currentActiveBayt.audioEnd !== null
      ) {
        if (time >= currentActiveBayt.audioEnd - 0.04) {
          if (repeatBayt) {
            audio.currentTime = currentActiveBayt.audioStart;
            setCurrentTime(currentActiveBayt.audioStart);
          } else {
            audio.pause();
            audio.currentTime = currentActiveBayt.audioEnd;
            setCurrentTime(currentActiveBayt.audioEnd);
            setIsPlaying(false);
            setPlaybackStatus('ended');
            persistPlaybackState(currentActiveBayt.audioEnd);
          }
        }
        return;
      }

      // 2. FULL BOOK MODE ('book'): repeat Bayt loop OR advance highlight + scroll + page continuously
      if (
        repeatBayt &&
        currentActiveBayt?.hasTimestamp &&
        currentActiveBayt.audioStart !== null &&
        currentActiveBayt.audioEnd !== null &&
        time >= currentActiveBayt.audioEnd - 0.04
      ) {
        audio.currentTime = currentActiveBayt.audioStart;
        setCurrentTime(currentActiveBayt.audioStart);
        return;
      }

      const matched = findBaytAtTime(partSyncedBayts, time);
      if (matched && matched.id !== activeBaytId) {
        setActiveBaytId(matched.id);
        setSelectedBabId(matched.babId);

        if (settings.pageLayout === 'pages' && matched.pageNumber !== currentPage && !searchQuery) {
          setCurrentPage(matched.pageNumber);
        }

        if (settings.autoScroll) {
          scrollBaytIntoView(matched.id);
        }
      }
    };

    const handleEnded = () => {
      if (playbackMode === 'single') {
        if (
          repeatBayt &&
          currentActiveBayt?.hasTimestamp &&
          currentActiveBayt.audioStart !== null
        ) {
          audio.currentTime = currentActiveBayt.audioStart;
          startAudioPlayback(audio);
        } else {
          setIsPlaying(false);
          setPlaybackStatus('ended');
        }
        return;
      }

      // Continuous Full-Book Auto-Advance across available uploaded parts up to Bayt 1173
      const idx = audioParts.findIndex((p) => p.id === activePart?.id);
      const remainingParts = idx >= 0 ? audioParts.slice(idx + 1) : [];
      const nextPart = remainingParts.find((p) => p.hasAudio && p.audioUrl);
      if (nextPart && nextPart.hasAudio && nextPart.audioUrl) {
        const firstBaytOfNext = getBaytByNumber(nextPart.startBayt);
        const resolvedNext = firstBaytOfNext
          ? resolveBaytAudioSegment(firstBaytOfNext.baytNumber, audioParts, verifiedTimestamps)
          : null;

        if (firstBaytOfNext) {
          setActiveBaytId(firstBaytOfNext.id);
          setSelectedBabId(firstBaytOfNext.babId);
          if (settings.pageLayout === 'pages' && !searchQuery) {
            setCurrentPage(firstBaytOfNext.pageNumber);
          }
          if (settings.autoScroll) {
            scrollBaytIntoView(firstBaytOfNext.id);
          }
        }

        const nextTarget = resolvedNext?.audioStart ?? 0;
        const nextUrl = offlineUrlMapRef.current[nextPart.id] || nextPart.audioUrl;
        pendingSeekRef.current = {
          partId: nextPart.id,
          targetTime: nextTarget,
          autoPlay: true,
          baytId: firstBaytOfNext?.id || activeBaytId,
          mode: 'book',
          phase: 'need_metadata'
        };
        loadedPartIdRef.current = nextPart.id;
        audio.src = nextUrl;
        audio.playbackRate = playbackSpeed;
        audio.load();
        setSelectedPartId(nextPart.id);
      } else if (remainingParts.length > 0) {
        setIsPlaying(false);
        setPlaybackStatus('ended');
        flashNotice('تم إتمام تشغيل جميع الأجزاء الصوتية المرفوعة المتاحة حالياً.');
      } else {
        setIsPlaying(false);
        setPlaybackStatus('ended');
        flashNotice('تم إتمام تلاوة متن الشاطبية كاملاً بحمد الله (١١٧٣ بيتاً).');
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('seeking', handleSeeking);
    audio.addEventListener('seeked', handleSeeked);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('seeking', handleSeeking);
      audio.removeEventListener('seeked', handleSeeked);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [
    activePart,
    playbackMode,
    playbackSpeed,
    partSyncedBayts,
    activeBaytId,
    repeatBayt,
    currentActiveBayt,
    settings.autoScroll,
    settings.pageLayout,
    currentPage,
    searchQuery,
    audioParts,
    verifiedTimestamps,
    startAudioPlayback,
    processPendingSeek,
    scrollBaytIntoView,
    persistPlaybackState,
    flashNotice
  ]);

  // YouTube Time Sync Polling & Single-Bayt End Enforcement + Full-Book Auto-Highlight/Scroll
  useEffect(() => {
    if (!isYoutubeActive || !ytReady) return;

    const intervalId = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;

      const state = player.getPlayerState?.();
      const dur = player.getDuration?.();
      if (Number.isFinite(dur) && dur > 0 && Math.abs(dur - duration) > 0.5) {
        setDuration(dur);
      }

      if (state !== YT_PLAYER_STATE.PLAYING && state !== YT_PLAYER_STATE.BUFFERING) {
        return;
      }

      const time = player.getCurrentTime();
      if (!Number.isFinite(time)) return;
      setCurrentTime(time);

      if (Math.abs(time - lastSavedTimeRef.current) >= 1.2) {
        lastSavedTimeRef.current = time;
        persistPlaybackState(time);
      }

      // Single-Bayt boundary enforcement if current Bayt has verified start/end timestamps
      if (
        playbackMode === 'single' &&
        currentActiveBayt?.hasTimestamp &&
        currentActiveBayt.audioStart !== null &&
        currentActiveBayt.audioEnd !== null &&
        time >= currentActiveBayt.audioEnd - 0.05
      ) {
        if (repeatBayt) {
          player.seekTo(currentActiveBayt.audioStart, true);
          setCurrentTime(currentActiveBayt.audioStart);
        } else {
          player.pauseVideo();
          player.seekTo(currentActiveBayt.audioEnd, true);
          setCurrentTime(currentActiveBayt.audioEnd);
          setIsPlaying(false);
          setPlaybackStatus('ended');
          persistPlaybackState(currentActiveBayt.audioEnd);
        }
        return;
      }

      // Full-Book mode repeat-Bayt OR auto-highlight + auto-page-turn + auto-scroll
      if (
        playbackMode === 'book' &&
        repeatBayt &&
        currentActiveBayt?.hasTimestamp &&
        currentActiveBayt.audioStart !== null &&
        currentActiveBayt.audioEnd !== null &&
        time >= currentActiveBayt.audioEnd - 0.05
      ) {
        player.seekTo(currentActiveBayt.audioStart, true);
        setCurrentTime(currentActiveBayt.audioStart);
        return;
      }

      const matched = findBaytAtTime(partSyncedBayts, time);
      if (matched && matched.id !== activeBaytId) {
        setActiveBaytId(matched.id);
        setSelectedBabId(matched.babId);
        if (settings.pageLayout === 'pages' && matched.pageNumber !== currentPage && !searchQuery) {
          setCurrentPage(matched.pageNumber);
        }
        if (settings.autoScroll) {
          scrollBaytIntoView(matched.id);
        }
      }
    }, 180);

    return () => window.clearInterval(intervalId);
  }, [
    isYoutubeActive,
    ytReady,
    duration,
    playbackMode,
    repeatBayt,
    currentActiveBayt,
    partSyncedBayts,
    activeBaytId,
    settings.pageLayout,
    settings.autoScroll,
    currentPage,
    searchQuery,
    scrollBaytIntoView,
    persistPlaybackState
  ]);

  // Helper to pause whichever media backend is active
  const pauseAllMedia = useCallback(() => {
    audioRef.current?.pause();
    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    }
  }, []);

  // Open Timestamp Editor focused on a specific Bayt
  const openTimestampEditorForBayt = useCallback(
    (baytNumber: number, partId?: string) => {
      pauseAllMedia();
      setIsPlaying(false);
      setEditorInitialBayt(baytNumber);
      if (partId) setSelectedPartId(partId);
      setIsTimestampEditorOpen(true);
    },
    [pauseAllMedia]
  );

  // Core Individual Bayt Playback Helper (YouTube IFrame API + Local MP3 Fallback)
  const playSingleBayt = useCallback(
    (rawBayt: ShatibiyyahBayt) => {
      const resolved = resolveBaytAudioSegment(
        rawBayt.baytNumber,
        audioParts,
        verifiedTimestamps
      );
      if (!resolved) return;

      const {
        bayt,
        part,
        sourceType,
        youtubeVideoId,
        hasPartAudio,
        hasVerifiedTimestamp,
        audioStart
      } = resolved;

      setPlaybackMode('single');
      setActiveBaytId(bayt.id);
      setSelectedBabId(bayt.babId);
      setAudioError(null);

      if (settings.pageLayout === 'pages' && bayt.pageNumber !== currentPage && !searchQuery) {
        setCurrentPage(bayt.pageNumber);
      }
      if (settings.autoScroll) {
        scrollBaytIntoView(bayt.id);
      }

      if (!hasPartAudio || !part) {
        pendingSeekRef.current = null;
        pendingYtSeekRef.current = null;
        pauseAllMedia();
        setIsPlaying(false);
        setIsAudioLoading(false);
        setPlaybackStatus('idle');
        if (part && part.id !== selectedPartId) {
          setSelectedPartId(part.id);
        }
        const msg = `البيت ${bayt.baytNumber} (${bayt.babTitle}): لا يوجد تسجيل متصل لـ "${part?.titleArabic || 'هذا الجزء'}" بعد.`;
        setUnavailableFeedback({
          baytNumber: bayt.baytNumber,
          reason: 'no_audio',
          message: msg
        });
        flashNotice(msg);
        return;
      }

      if (part.id !== selectedPartId) {
        setSelectedPartId(part.id);
      }

      // Honest enforcement: never guess or invent a Bayt timestamp!
      if (!hasVerifiedTimestamp || audioStart === null) {
        pendingSeekRef.current = null;
        pendingYtSeekRef.current = null;
        pauseAllMedia();
        setIsPlaying(false);
        setIsAudioLoading(false);
        setPlaybackStatus('paused');
        const msg = `البيت #${bayt.baytNumber}: تسجيل الشيخ عكاشة كميني متصل، لكن التوقيت الفردي لهذا البيت غير مضبوط بعد (${missingSummary.verifiedCount}/${SHATIBIYYAH_META.totalAbyat}). اضبط التوقيت أو شغّل التلاوة المتواصلة.`;
        setUnavailableFeedback({
          baytNumber: bayt.baytNumber,
          reason: 'no_timestamp',
          message: msg
        });
        flashNotice(msg);
        return;
      }

      setUnavailableFeedback(null);

      // Engine 1: Official YouTube IFrame Player API
      if (sourceType === 'youtube' && youtubeVideoId) {
        audioRef.current?.pause();
        const player = ytPlayerRef.current;
        if (player && ytReadyRef.current) {
          setIsAudioLoading(true);
          setPlaybackStatus('seeking');
          if (ytVideoIdRef.current !== youtubeVideoId) {
            ytVideoIdRef.current = youtubeVideoId;
            player.loadVideoById(youtubeVideoId, audioStart);
          } else {
            player.seekTo(audioStart, true);
            player.setPlaybackRate(playbackSpeed);
            player.playVideo();
          }
          setCurrentTime(audioStart);
        } else {
          pendingYtSeekRef.current = {
            videoId: youtubeVideoId,
            targetTime: audioStart,
            autoPlay: true,
            baytId: bayt.id,
            mode: 'single'
          };
          setIsAudioLoading(true);
          setPlaybackStatus('loading');
        }
        return;
      }

      // Engine 2: Local / Uploaded Audio File Fallback
      const audio = audioRef.current;
      if (!audio || !part.audioUrl) return;
      const immediateUrl = offlineUrlMapRef.current[part.id] || part.audioUrl;

      if (loadedPartIdRef.current === part.id && audio.getAttribute('src') && audio.readyState >= 1) {
        if (Math.abs(audio.currentTime - audioStart) <= 0.06) {
          pendingSeekRef.current = null;
          setCurrentTime(audioStart);
          startAudioPlayback(audio);
        } else {
          pendingSeekRef.current = {
            partId: part.id,
            targetTime: audioStart,
            autoPlay: true,
            baytId: bayt.id,
            mode: 'single',
            phase: 'awaiting_seeked'
          };
          setIsAudioLoading(true);
          setPlaybackStatus('seeking');
          audio.currentTime = audioStart;
          setCurrentTime(audioStart);
        }
        return;
      }

      pendingSeekRef.current = {
        partId: part.id,
        targetTime: audioStart,
        autoPlay: true,
        baytId: bayt.id,
        mode: 'single',
        phase: 'need_metadata'
      };
      loadedPartIdRef.current = part.id;
      setIsAudioLoading(true);
      setPlaybackStatus('loading');
      audio.src = immediateUrl;
      audio.playbackRate = playbackSpeed;
      audio.load();
    },
    [
      audioParts,
      verifiedTimestamps,
      missingSummary.verifiedCount,
      selectedPartId,
      playbackSpeed,
      settings.pageLayout,
      settings.autoScroll,
      currentPage,
      searchQuery,
      scrollBaytIntoView,
      startAudioPlayback,
      pauseAllMedia,
      flashNotice
    ]
  );

  // Full Book Continuous Playback (YouTube Cx76SdfINxU or uploaded audio)
  const handlePlayFullBook = useCallback(() => {
    if (playbackMode === 'book' && isPlaying) {
      pauseAllMedia();
      setIsPlaying(false);
      setPlaybackStatus('paused');
      return;
    }

    const resolvedFromFirst = resolveBaytAudioSegment(1, audioParts, verifiedTimestamps);
    const firstAvailable = getFirstAvailableAudioPart(audioParts);
    const targetPart =
      resolvedFromFirst?.hasPartAudio && resolvedFromFirst.part
        ? resolvedFromFirst.part
        : firstAvailable;

    if (!targetPart) {
      pendingSeekRef.current = null;
      pendingYtSeekRef.current = null;
      pauseAllMedia();
      setIsPlaying(false);
      setPlaybackStatus('idle');
      const msg = 'مصدر الصوت غير متاح (Audio source unavailable): لم يتم ربط تسجيل يوتيوب أو ملف صوتي بعد.';
      setUnavailableFeedback({
        baytNumber: 1,
        reason: 'no_audio',
        message: msg
      });
      flashNotice(msg);
      return;
    }

    const kind = getPartPlaybackKind(targetPart);
    const startingBaytNumber = targetPart.startBayt || 1;
    const startBayt = getBaytByNumber(startingBaytNumber) || getBaytByNumber(1);
    if (!startBayt) return;

    const resolvedStart = resolveBaytAudioSegment(
      startBayt.baytNumber,
      audioParts,
      verifiedTimestamps
    );

    setPlaybackMode('book');
    setSearchQuery('');
    setShowBookmarksOnly(false);
    setSelectedBabId(startBayt.babId);
    setCurrentPage(startBayt.pageNumber);
    setActiveBaytId(startBayt.id);
    if (targetPart.id !== selectedPartId) {
      setSelectedPartId(targetPart.id);
    }
    setAudioError(null);
    setUnavailableFeedback(null);
    scrollBaytIntoView(startBayt.id);

    const startTime =
      resolvedStart?.hasVerifiedTimestamp && resolvedStart.audioStart !== null
        ? resolvedStart.audioStart
        : 0;

    if (!resolvedStart?.hasVerifiedTimestamp) {
      flashNotice(
        `تم بدء تلاوة الشيخ عكاشة كميني متواصلة (الموثّق: ${missingSummary.verifiedCount}/${SHATIBIYYAH_META.totalAbyat} بيتاً — يمكنك ضبط التوقيت من محرر التوقيتات).`
      );
    }

    // Engine 1: YouTube IFrame Player
    if (kind.sourceType === 'youtube' && kind.youtubeVideoId) {
      audioRef.current?.pause();
      const player = ytPlayerRef.current;
      if (player && ytReadyRef.current) {
        setIsAudioLoading(true);
        setPlaybackStatus('loading');
        if (ytVideoIdRef.current !== kind.youtubeVideoId) {
          ytVideoIdRef.current = kind.youtubeVideoId;
          player.loadVideoById(kind.youtubeVideoId, startTime);
        } else {
          player.seekTo(startTime, true);
          player.setPlaybackRate(playbackSpeed);
          player.playVideo();
        }
        setCurrentTime(startTime);
      } else {
        pendingYtSeekRef.current = {
          videoId: kind.youtubeVideoId,
          targetTime: startTime,
          autoPlay: true,
          baytId: startBayt.id,
          mode: 'book'
        };
        setIsAudioLoading(true);
        setPlaybackStatus('loading');
      }
      return;
    }

    // Engine 2: Uploaded MP3
    const audio = audioRef.current;
    if (!audio || !targetPart.audioUrl) return;
    const immediateUrl = offlineUrlMapRef.current[targetPart.id] || targetPart.audioUrl;

    if (
      loadedPartIdRef.current === targetPart.id &&
      audio.getAttribute('src') &&
      audio.readyState >= 1
    ) {
      if (Math.abs(audio.currentTime - startTime) <= 0.06) {
        pendingSeekRef.current = null;
        setCurrentTime(startTime);
        startAudioPlayback(audio);
      } else {
        pendingSeekRef.current = {
          partId: targetPart.id,
          targetTime: startTime,
          autoPlay: true,
          baytId: startBayt.id,
          mode: 'book',
          phase: 'awaiting_seeked'
        };
        setIsAudioLoading(true);
        setPlaybackStatus('seeking');
        audio.currentTime = startTime;
        setCurrentTime(startTime);
      }
      return;
    }

    pendingSeekRef.current = {
      partId: targetPart.id,
      targetTime: startTime,
      autoPlay: true,
      baytId: startBayt.id,
      mode: 'book',
      phase: 'need_metadata'
    };
    loadedPartIdRef.current = targetPart.id;
    setIsAudioLoading(true);
    setPlaybackStatus('loading');
    audio.src = immediateUrl;
    audio.playbackRate = playbackSpeed;
    audio.load();
  }, [
    playbackMode,
    isPlaying,
    audioParts,
    verifiedTimestamps,
    missingSummary.verifiedCount,
    selectedPartId,
    playbackSpeed,
    pauseAllMedia,
    scrollBaytIntoView,
    startAudioPlayback,
    flashNotice
  ]);

  // Run 7-Point Live Audio Diagnostics on user click
  const handleRunDiagnostics = useCallback(
    async (baytNumberOverride?: number) => {
      const targetNum = baytNumberOverride || currentActiveBayt?.baytNumber || 1;
      setIsDiagnosticsOpen(true);
      setIsRunningDiagnostics(true);
      try {
        const ytDur = ytPlayerRef.current?.getDuration?.() || duration;
        const report = await runShatibiyyahAudioDiagnostics({
          baytNumber: targetNum,
          audioParts,
          verifiedTimestamps,
          ytPlayerReady: ytReadyRef.current,
          ytDuration: ytDur,
          ytErrorMessage
        });
        setDiagnosticsReport(report);
      } finally {
        setIsRunningDiagnostics(false);
      }
    },
    [currentActiveBayt, audioParts, verifiedTimestamps, duration, ytErrorMessage]
  );

  const togglePlay = useCallback(() => {
    const kind = getPartPlaybackKind(activePart);
    if (!activePart?.hasAudio || kind.sourceType === 'none') {
      const msg =
        'مصدر الصوت لهذا الجزء غير مربوط بعد — يمكن ربط فيديو يوتيوب أو رفع ملف صوتي من لوحة المشرف.';
      setUnavailableFeedback({
        baytNumber: currentActiveBayt?.baytNumber || 1,
        reason: 'no_audio',
        message: msg
      });
      flashNotice(msg);
      return;
    }

    // Engine 1: YouTube Player Toggle / Resume
    if (isYoutubeActive && kind.youtubeVideoId) {
      const player = ytPlayerRef.current;
      if (!player || !ytReadyRef.current) {
        pendingYtSeekRef.current = {
          videoId: kind.youtubeVideoId,
          targetTime: currentTime > 0 ? currentTime : 0,
          autoPlay: true,
          baytId: currentActiveBayt?.id || 'shat-0001',
          mode: playbackMode
        };
        setIsAudioLoading(true);
        setPlaybackStatus('loading');
        return;
      }

      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
        setPlaybackStatus('paused');
        return;
      }

      if (
        playbackMode === 'single' &&
        currentActiveBayt?.hasTimestamp &&
        currentActiveBayt.audioStart !== null &&
        currentActiveBayt.audioEnd !== null
      ) {
        const t = player.getCurrentTime?.() ?? currentTime;
        if (
          t < currentActiveBayt.audioStart - 0.1 ||
          t >= currentActiveBayt.audioEnd - 0.08
        ) {
          player.seekTo(currentActiveBayt.audioStart, true);
          setCurrentTime(currentActiveBayt.audioStart);
        }
      }
      player.setPlaybackRate(playbackSpeed);
      player.playVideo();
      return;
    }

    // Engine 2: Local MP3 Toggle / Resume
    const audio = audioRef.current;
    if (!audio || !activePart.audioUrl) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setPlaybackStatus('paused');
      return;
    }

    if (
      playbackMode === 'single' &&
      currentActiveBayt?.hasTimestamp &&
      currentActiveBayt.audioStart !== null &&
      currentActiveBayt.audioEnd !== null
    ) {
      const resolved = resolveBaytAudioSegment(
        currentActiveBayt.baytNumber,
        audioParts,
        verifiedTimestamps
      );
      if (resolved?.part && resolved.part.id !== selectedPartId) {
        playSingleBayt(currentActiveBayt);
        return;
      }
      if (audio.readyState < 1 || !audio.getAttribute('src')) {
        playSingleBayt(currentActiveBayt);
        return;
      }
      if (
        audio.currentTime < currentActiveBayt.audioStart - 0.1 ||
        audio.currentTime >= currentActiveBayt.audioEnd - 0.08
      ) {
        pendingSeekRef.current = {
          partId: activePart.id,
          targetTime: currentActiveBayt.audioStart,
          autoPlay: true,
          baytId: currentActiveBayt.id,
          mode: 'single',
          phase: 'awaiting_seeked'
        };
        setIsAudioLoading(true);
        setPlaybackStatus('seeking');
        audio.currentTime = currentActiveBayt.audioStart;
        setCurrentTime(currentActiveBayt.audioStart);
        return;
      }
    }

    if (audio.readyState < 1 || !audio.getAttribute('src')) {
      const url = offlineUrlMapRef.current[activePart.id] || activePart.audioUrl;
      pendingSeekRef.current = {
        partId: activePart.id,
        targetTime: currentTime > 0 ? currentTime : 0,
        autoPlay: true,
        baytId: currentActiveBayt?.id || 'shat-0001',
        mode: playbackMode,
        phase: 'need_metadata'
      };
      loadedPartIdRef.current = activePart.id;
      setIsAudioLoading(true);
      setPlaybackStatus('loading');
      audio.src = url;
      audio.playbackRate = playbackSpeed;
      audio.load();
      return;
    }

    startAudioPlayback(audio);
  }, [
    activePart,
    isYoutubeActive,
    isPlaying,
    playbackMode,
    playbackSpeed,
    currentTime,
    currentActiveBayt,
    audioParts,
    verifiedTimestamps,
    selectedPartId,
    playSingleBayt,
    startAudioPlayback,
    flashNotice
  ]);

  const handleReplayCurrentBayt = useCallback(() => {
    if (!currentActiveBayt) return;
    playSingleBayt(currentActiveBayt);
  }, [currentActiveBayt, playSingleBayt]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (!Number.isFinite(newTime)) return;
    setCurrentTime(newTime);
    if (isYoutubeActive && ytPlayerRef.current && ytReadyRef.current) {
      ytPlayerRef.current.seekTo(newTime, true);
    } else if (audioRef.current && audioRef.current.readyState >= 1) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleBaytClick = (bayt: ShatibiyyahBayt) => {
    const sel = typeof window !== 'undefined' ? window.getSelection()?.toString()?.trim() : '';
    if (sel) return;
    playSingleBayt(bayt);
  };

  const handlePrevBayt = () => {
    const num = currentActiveBayt?.baytNumber || 1;
    if (num > 1) {
      const prev = getBaytByNumber(num - 1);
      if (prev) playSingleBayt(getBaytWithSync(prev));
    }
  };

  const handleNextBayt = () => {
    const num = currentActiveBayt?.baytNumber || 1;
    if (num < SHATIBIYYAH_META.totalAbyat) {
      const next = getBaytByNumber(num + 1);
      if (next) playSingleBayt(getBaytWithSync(next));
    }
  };

  const handleSwitchPart = (direction: -1 | 1) => {
    const idx = audioParts.findIndex((p) => p.id === activePart?.id);
    const nextIdx = idx + direction;
    if (nextIdx >= 0 && nextIdx < audioParts.length) {
      const target = audioParts[nextIdx];
      pendingSeekRef.current = null;
      pendingYtSeekRef.current = null;
      setSelectedPartId(target.id);
      const firstBayt = getBaytByNumber(target.startBayt);
      if (firstBayt) {
        setActiveBaytId(firstBayt.id);
        setSelectedBabId(firstBayt.babId);
        if (settings.pageLayout === 'pages') {
          setCurrentPage(firstBayt.pageNumber);
        }
      }
    }
  };

  const toggleSpeed = () => {
    const currentIdx = ALLOWED_SPEEDS.indexOf(playbackSpeed);
    const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % ALLOWED_SPEEDS.length : 1;
    setPlaybackSpeed(ALLOWED_SPEEDS[nextIdx]);
  };

  // Download or Open Official Source
  const handleDownload = () => {
    if (isYoutubeActive) {
      flashNotice('هذا التسجيل يعمل عبر مشغّل يوتيوب الرسمي المدمج (لا يُعاد تحميله من يوتيوب).');
      return;
    }
    if (!activePart?.hasAudio || !activePart.audioUrl) {
      flashNotice('لا يوجد ملف صوتي مرفوع لهذا الجزء للتحميل بعد.');
      return;
    }
    const link = document.createElement('a');
    link.href = `${activePart.audioUrl}?download=1`;
    link.download = `Matn_Shatibiyyah_${activePart.id}_Sheikh_Okasha_Kameny.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flashNotice(`جاري التحميل: ${activePart.titleArabic} — الشيخ عكاشة كميني`);
  };

  // Save / Remove Offline Audio via Cache API
  const handleToggleOfflineCache = async () => {
    if (!activePart?.hasAudio || !activePart.audioUrl) {
      flashNotice('يرجى رفع التسجيل أولاً لتفعيل الحفظ دون اتصال.');
      return;
    }
    if (typeof caches === 'undefined') {
      flashNotice('التخزين دون اتصال غير مدعوم في هذا المتصفح.');
      return;
    }

    setCachingPartId(activePart.id);
    try {
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      if (offlinePartIds.includes(activePart.id)) {
        await cache.delete(activePart.audioUrl);
        if (offlineUrlMapRef.current[activePart.id]) {
          URL.revokeObjectURL(offlineUrlMapRef.current[activePart.id]);
          delete offlineUrlMapRef.current[activePart.id];
        }
        setOfflinePartIds((prev) => prev.filter((id) => id !== activePart.id));
        flashNotice(`تمت إزالة ${activePart.titleArabic} من الذاكرة المحلية.`);
      } else {
        const res = await fetch(activePart.audioUrl);
        if (!res.ok) throw new Error('Download failed');
        const resClone = res.clone();
        await cache.put(activePart.audioUrl, res);
        const blob = await resClone.blob();
        if (offlineUrlMapRef.current[activePart.id]) {
          URL.revokeObjectURL(offlineUrlMapRef.current[activePart.id]);
        }
        offlineUrlMapRef.current[activePart.id] = URL.createObjectURL(blob);
        setOfflinePartIds((prev) => [...prev, activePart.id]);
        flashNotice(`تم حفظ ${activePart.titleArabic} للاستماع دون اتصال بالإنترنت.`);
      }
    } catch {
      flashNotice('تعذر حفظ الملف للاستماع دون اتصال.');
    } finally {
      setCachingPartId(null);
    }
  };

  const copyBayt = (bayt: ShatibiyyahBayt, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${bayt.shatrA} ۞ ${bayt.shatrB} [${bayt.baytNumber} — ${bayt.babTitle}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(bayt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('nur_quran_shatibiyyah_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Authentic Classical Book Paper Themes (Strict hairline borders, zero thick left/right stripes)
  const themeClasses = {
    cream: {
      bg: 'bg-[#faf7ee] text-[#1c1917]',
      surface: 'bg-[#f4efe0]',
      pageBorder: 'border-[#dfd5be]',
      headerBorder: 'border-[#e4dbc7]',
      activeHighlight: 'bg-[#efe4c6] ring-1 ring-amber-800/35',
      baytHover: 'hover:bg-[#f4ecd8]',
      sadrText: 'text-[#1c1917]',
      ajuzText: 'text-[#292524]',
      separator: 'text-amber-800/70',
      baytNum: 'text-stone-500',
      headingBorder: 'border-amber-900/25 bg-[#f2ead6] text-amber-950',
      bottomBar: 'bg-[#faf7ee]/95 border-[#dfd5be] text-[#1c1917]'
    },
    sepia: {
      bg: 'bg-[#f3ebd6] text-[#231c15]',
      surface: 'bg-[#ebe0c5]',
      pageBorder: 'border-[#d6c7a8]',
      headerBorder: 'border-[#dacba9]',
      activeHighlight: 'bg-[#e5d5b0] ring-1 ring-[#8c4b1a]/40',
      baytHover: 'hover:bg-[#ece1c6]',
      sadrText: 'text-[#231c15]',
      ajuzText: 'text-[#332a21]',
      separator: 'text-[#8c4b1a]/70',
      baytNum: 'text-[#73634e]',
      headingBorder: 'border-[#8c4b1a]/30 bg-[#e9dcc0] text-[#4a270d]',
      bottomBar: 'bg-[#f3ebd6]/95 border-[#d6c7a8] text-[#231c15]'
    },
    white: {
      bg: 'bg-white text-slate-900',
      surface: 'bg-slate-50',
      pageBorder: 'border-slate-200',
      headerBorder: 'border-slate-200',
      activeHighlight: 'bg-emerald-50 ring-1 ring-emerald-700/30',
      baytHover: 'hover:bg-slate-50',
      sadrText: 'text-slate-900',
      ajuzText: 'text-slate-800',
      separator: 'text-emerald-700/70',
      baytNum: 'text-slate-400',
      headingBorder: 'border-emerald-800/20 bg-emerald-50/60 text-emerald-950',
      bottomBar: 'bg-white/95 border-slate-200 text-slate-900'
    },
    dark: {
      bg: 'bg-[#0c111d] text-[#e2e8f0]',
      surface: 'bg-[#131b2c]',
      pageBorder: 'border-[#1e293b]',
      headerBorder: 'border-[#1e293b]',
      activeHighlight: 'bg-[#1a253b] ring-1 ring-amber-400/40',
      baytHover: 'hover:bg-[#131b2c]',
      sadrText: 'text-[#f8fafc]',
      ajuzText: 'text-[#cbd5e1]',
      separator: 'text-amber-400/70',
      baytNum: 'text-slate-400',
      headingBorder: 'border-amber-500/25 bg-[#151e30] text-amber-200',
      bottomBar: 'bg-[#0c111d]/95 border-[#1e293b] text-[#e2e8f0]'
    }
  }[settings.readingTheme];

  const fontClasses = {
    compact: 'text-base sm:text-lg',
    medium: 'text-lg sm:text-xl',
    large: 'text-xl sm:text-2xl',
    xlarge: 'text-2xl sm:text-3xl'
  }[settings.fontSize];

  const lineSpacingClass = {
    compact: 'py-2 leading-[2.1]',
    normal: 'py-2.5 sm:py-3 leading-[2.35]',
    relaxed: 'py-3.5 sm:py-4 leading-[2.65]'
  }[settings.lineSpacing];

  const connectedPartsCount = audioParts.filter((p) => {
    const k = getPartPlaybackKind(p);
    return p.hasAudio && k.sourceType !== 'none';
  }).length;
  const verifiedTimestampsCount = missingSummary.verifiedCount;
  const isCurrentOffline = activePart ? offlinePartIds.includes(activePart.id) : false;

  const statusLabelArabic =
    playbackStatus === 'loading'
      ? 'جاري التحميل'
      : playbackStatus === 'seeking'
      ? 'جاري الانتقال'
      : isPlaying || playbackStatus === 'playing'
      ? 'جاري التلاوة'
      : playbackStatus === 'error'
      ? 'خطأ في التشغيل'
      : playbackStatus === 'ended'
      ? 'انتهى المقطع'
      : activePart?.hasAudio
      ? 'جاهز للتشغيل'
      : 'الصوت غير مربوط';

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} font-arabic transition-colors duration-200 flex flex-col`}
    >
      <audio ref={audioRef} preload="auto" playsInline />

      {/* Transient Status Notification */}
      {statusNotice && (
        <div
          dir="rtl"
          className="fixed top-14 right-3 left-3 sm:left-auto z-50 sm:max-w-sm bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-amber-500/40 flex items-center gap-2 text-xs"
        >
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="flex-1 leading-relaxed">{statusNotice}</span>
          <button
            onClick={() => setStatusNotice(null)}
            className="p-1 text-slate-400 hover:text-white shrink-0"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 1. Compact Sticky Top Bar (~48px) ── */}
      <header
        dir="rtl"
        className={`sticky top-0 z-30 ${themeClasses.bg} border-b ${themeClasses.headerBorder} px-3 sm:px-6 py-1.5 transition-colors`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Brand + Chapter Jump Selector */}
          <div className="flex items-center gap-1.5 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                title="العودة للمكتبة"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <span className="font-bold text-xs sm:text-sm whitespace-nowrap shrink-0">
              متن الشاطبية
            </span>

            <select
              value={selectedBabId}
              onChange={(e) => handleSelectBab(e.target.value)}
              aria-label="اختر الباب أو السورة"
              className={`text-xs font-bold font-arabic px-2 py-1 rounded-md bg-transparent border ${themeClasses.pageBorder} cursor-pointer max-w-[140px] sm:max-w-xs truncate focus:outline-none`}
            >
              {SHATIBIYYAH_ABWAB.map((bab) => (
                <option key={bab.id} value={bab.id} className="text-slate-900 bg-white">
                  {bab.number}. {bab.titleArabic} ({bab.baytRange.start}–{bab.baytRange.end})
                </option>
              ))}
            </select>
          </div>

          {/* Right Controls: Page Count, Timestamp Editor, Bookmarks, Search, Aa Settings */}
          <div className="flex items-center gap-1 shrink-0 text-xs">
            {settings.pageLayout === 'pages' && !searchQuery && !showBookmarksOnly && (
              <span className="px-1.5 py-0.5 text-[11px] font-mono tabular-nums opacity-80 whitespace-nowrap">
                ص {currentPage}/{SHATIBIYYAH_META.totalPages}
              </span>
            )}

            <button
              onClick={() => openTimestampEditorForBayt(currentActiveBayt?.baytNumber || 1)}
              className="min-h-[34px] px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 font-bold text-xs whitespace-nowrap"
              title="ضبط توقيتات الأبيات"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="hidden sm:inline">التوقيتات</span>
            </button>

            <button
              onClick={() => {
                setShowBookmarksOnly((v) => !v);
                setSearchQuery('');
              }}
              className={`min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg transition-colors ${
                showBookmarksOnly
                  ? 'bg-amber-700 text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={`الأبيات المحفوظة (${bookmarks.length})`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className={`min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg transition-colors ${
                showSearch || searchQuery
                  ? 'bg-amber-700 text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title="بحث في الأبيات الـ ١١٧٣"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="min-h-[34px] px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 font-bold text-xs whitespace-nowrap"
              title="خيارات القراءة والصوت"
            >
              <span className="text-sm font-serif">Aa</span>
              <Settings2 className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearch && (
          <div className="max-w-5xl mx-auto pt-2 pb-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowBookmarksOnly(false);
                }}
                placeholder="ابحث بكلمة عربية أو برقم البيت (1 إلى 1173)..."
                className={`w-full text-xs font-arabic px-3 py-2 pr-3 pl-8 rounded-lg border ${themeClasses.pageBorder} bg-black/5 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-amber-700`}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── 2. Authentic Printed Book Canvas ── */}
      <main
        className="flex-1 max-w-5xl w-full mx-auto px-2.5 sm:px-8 py-3 sm:py-6 pb-36 sm:pb-40"
        dir="rtl"
      >
        {/* Subtle Edition Metadata Line */}
        <div className="text-center mb-3 sm:mb-5 space-y-1.5">
          <h1 className="text-base sm:text-xl font-bold tracking-wide">
            {SHATIBIYYAH_META.titleArabic}
          </h1>
          <div className="text-[11px] opacity-75 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            <span>{SHATIBIYYAH_META.editorArabic}</span>
            <span aria-hidden="true">·</span>
            <span>{SHATIBIYYAH_META.publisherArabic}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">١,١٧٣ بيتاً كاملاً</span>
            <span aria-hidden="true">·</span>
            <span>بصوت {SHATIBIYYAH_META.reciterArabic}</span>
          </div>
        </div>

        {/* Printed Page Frame */}
        <div
          className={`rounded-xl border ${themeClasses.pageBorder} px-3 py-4 sm:px-10 sm:py-7 transition-colors`}
        >
          {/* Running Book Header + Compact Full Book Recitation Action */}
          <div
            className={`flex items-center justify-between gap-2 pb-2.5 mb-3 border-b ${themeClasses.headerBorder} text-[11px] select-none`}
          >
            <span className="truncate opacity-75">{activeBab.titleArabic}</span>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePlayFullBook}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-[11px] font-bold whitespace-nowrap transition-colors ${
                  playbackMode === 'book' && isPlaying
                    ? 'bg-amber-700 text-white border-amber-700'
                    : `${themeClasses.pageBorder} hover:bg-black/5 dark:hover:bg-white/5`
                }`}
                title="بدء تلاوة متن الشاطبية كاملاً بصوت الشيخ عكاشة كميني"
              >
                {playbackMode === 'book' && isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>إيقاف القراءة الكاملة</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>تشغيل الكتاب كاملاً</span>
                  </>
                )}
              </button>

              <span className="opacity-70 tabular-nums whitespace-nowrap">
                {searchQuery
                  ? `نتائج البحث (${displayedAbyat.length})`
                  : showBookmarksOnly
                  ? `المحفوظات (${displayedAbyat.length})`
                  : settings.pageLayout === 'pages'
                  ? `صفحة ${currentPage} من ${SHATIBIYYAH_META.totalPages}`
                  : `${activeBab.baytRange.start} – ${activeBab.baytRange.end}`}
              </span>
            </div>
          </div>

          {/* Official YouTube IFrame Player Dock for Sheikh Okasha Kameny (Cx76SdfINxU) */}
          {isYoutubeActive && (
            <div
              className={`mb-4 rounded-xl border ${themeClasses.pageBorder} ${themeClasses.surface} p-2.5 sm:p-3 transition-all`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Keep iframe >= 210x118px even in compact mode so YouTube IFrame API playback stays valid */}
                <div
                  className={`relative bg-black rounded-lg overflow-hidden border border-black/15 shrink-0 ${
                    isVideoCompact ? 'w-[216px] aspect-video' : 'w-full sm:w-[272px] aspect-video'
                  }`}
                >
                  <div ref={ytContainerRef} className="w-full h-full" />
                  {!ytReady && !ytErrorMessage && (
                    <div className="absolute inset-0 bg-slate-950/85 text-white flex flex-col items-center justify-center gap-1.5 text-[11px] pointer-events-none">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      <span>جاري تحميل تسجيل الشيخ عكاشة كميني...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2 w-full text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="truncate">
                          تسجيل الشيخ عكاشة كميني — حرز الأماني ووجه التهاني
                        </span>
                      </div>
                      <p className="text-[11px] opacity-75 mt-0.5 tabular-nums">
                        الأبيات الموثّقة بالتوقيت: {verifiedTimestampsCount} / ١,١٧٣ (
                        {missingSummary.percentComplete}%) · المتبقي بدون توقيت:{' '}
                        {missingSummary.missingCount}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsVideoCompact((v) => !v)}
                      className={`p-1.5 rounded-md border ${themeClasses.pageBorder} hover:bg-black/5 shrink-0`}
                      title={isVideoCompact ? 'توسيع شاشة الفيديو' : 'تصغير شاشة الفيديو'}
                    >
                      {isVideoCompact ? (
                        <Maximize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Minimize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {ytErrorMessage && (
                    <div className="p-2 rounded-lg bg-red-950/20 border border-red-600/30 text-[11px] text-red-700 dark:text-red-300">
                      {ytErrorMessage}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => openTimestampEditorForBayt(currentActiveBayt?.baytNumber || 1)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        ضبط توقيت البيت #{currentActiveBayt?.baytNumber || 1} (محرر التوقيتات)
                      </span>
                    </button>

                    <button
                      onClick={() => handleRunDiagnostics(currentActiveBayt?.baytNumber || 1)}
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg border ${themeClasses.pageBorder} text-[11px] font-bold flex items-center gap-1 hover:bg-black/5`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>تشخيص الصوت</span>
                    </button>

                    <a
                      href={activeYoutubeWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg border ${themeClasses.pageBorder} text-[11px] font-bold flex items-center gap-1 hover:bg-black/5`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح على يوتيوب</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Honest Inline Readiness Strip if non-YouTube parts or 0 audio */}
          {syncLoaded && !isYoutubeActive && (connectedPartsCount === 0 || verifiedTimestampsCount === 0) && (
            <div
              className={`mb-3 px-3 py-2.5 rounded-lg border ${themeClasses.headingBorder} text-xs flex flex-wrap items-center justify-between gap-2`}
            >
              <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">
                  {connectedPartsCount === 0
                    ? `النص الكامل محقق (١١٧٣ بيتاً)، لكن مصدر الصوت غير مربوط بعد — لا يُستخدم أي صوت بديل أو مصطنع.`
                    : `التسجيلات الصوتية متاحة (${connectedPartsCount}/${audioParts.length} أجزاء)، وتوقيت الأبيات الفردي المضبوط حالياً (${verifiedTimestampsCount}/١١٧٣).`}
                </span>
              </div>
              <button
                onClick={() => handleRunDiagnostics(currentActiveBayt?.baytNumber || 1)}
                className="px-2.5 py-1.5 rounded-md bg-amber-800 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1.5 shrink-0"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>تشخيص الصوت</span>
              </button>
            </div>
          )}

          {/* Search / Bookmark Banner */}
          {(searchQuery || showBookmarksOnly) && (
            <div
              className={`mb-3 px-3 py-2 rounded-lg ${themeClasses.surface} text-xs flex items-center justify-between`}
            >
              <span>
                {searchQuery
                  ? `عرض نتائج "${searchQuery}" (${displayedAbyat.length} بيت)`
                  : `الأبيات المحفوظة (${displayedAbyat.length})`}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowBookmarksOnly(false);
                }}
                className="underline font-bold"
              >
                العودة للكتاب
              </button>
            </div>
          )}

          {/* Bayts List with Inline Traditional Chapter Banners */}
          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {displayedAbyat.length === 0 ? (
              <div className="py-12 text-center text-sm opacity-60">
                لا توجد أبيات مطابقة للعرض الحالي.
              </div>
            ) : (
              displayedAbyat.map((bayt, idx) => {
                const prevBayt = idx > 0 ? displayedAbyat[idx - 1] : null;
                const showSectionBanner =
                  idx === 0
                    ? bayt.baytNumber === 1 ||
                      !prevBayt ||
                      bayt.babId !== activeBab.id ||
                      getShatibiyyahBabById(bayt.babId)?.baytRange.start === bayt.baytNumber
                    : prevBayt?.babId !== bayt.babId;

                const isActive = activeBaytId === bayt.id && settings.autoHighlight;
                const isBookmarked = bookmarks.includes(bayt.id);
                const isCopied = copiedId === bayt.id;

                return (
                  <React.Fragment key={bayt.id}>
                    {showSectionBanner && (
                      <div className="py-3 first:pt-1">
                        <div
                          className={`mx-auto max-w-xl text-center py-1.5 px-4 rounded-lg border ${themeClasses.headingBorder} text-xs sm:text-sm font-bold`}
                        >
                          {bayt.babTitle}
                        </div>
                      </div>
                    )}

                    <div
                      id={`bayt-${bayt.id}`}
                      onClick={() => handleBaytClick(bayt)}
                      className={`group transition-colors duration-150 cursor-pointer rounded-lg px-2 sm:px-4 ${lineSpacingClass} ${
                        isActive ? themeClasses.activeHighlight : themeClasses.baytHover
                      }`}
                    >
                      {/* Desktop & Tablet: Classical Balanced 2-Column Hemistich Layout */}
                      <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div
                          className={`text-right font-bold select-text ${themeClasses.sadrText} ${fontClasses}`}
                        >
                          {bayt.shatrA}
                        </div>

                        <div className="flex items-center justify-center gap-1.5 select-none px-1.5 shrink-0">
                          <span className={`text-xs ${themeClasses.separator}`}>۞</span>
                          {settings.showBaytNumber && (
                            <span
                              className={`text-[11px] font-mono tabular-nums ${themeClasses.baytNum} ${
                                isActive ? 'font-bold opacity-100' : 'opacity-70 group-hover:opacity-100'
                              }`}
                              title={`البيت ${bayt.baytNumber}`}
                            >
                              {bayt.arabicNumeral}
                            </span>
                          )}
                        </div>

                        <div
                          className={`text-left font-bold select-text ${themeClasses.ajuzText} ${fontClasses}`}
                        >
                          {bayt.shatrB}
                        </div>
                      </div>

                      {/* Mobile: Clean Compact Stacked Hemistichs (Zero horizontal overflow) */}
                      <div className="sm:hidden space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={`font-bold select-text text-right flex-1 ${themeClasses.sadrText} ${fontClasses}`}
                          >
                            {bayt.shatrA}
                          </div>
                          {settings.showBaytNumber && (
                            <span
                              className={`text-[10px] font-mono tabular-nums shrink-0 pt-1 ${themeClasses.baytNum}`}
                            >
                              {bayt.arabicNumeral}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-2 pr-2">
                          <span className={`text-xs pt-1 ${themeClasses.separator} select-none`}>
                            ۞
                          </span>
                          <div
                            className={`font-bold select-text text-right flex-1 ${themeClasses.ajuzText} ${fontClasses}`}
                          >
                            {bayt.shatrB}
                          </div>
                        </div>
                      </div>

                      {/* Quiet Action Strip (Visible on hover or when active) */}
                      <div
                        className={`flex items-center justify-between pt-1 text-[10px] transition-opacity ${
                          isActive ? 'opacity-85' : 'opacity-0 group-hover:opacity-85'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => copyBayt(bayt, e)}
                            className="hover:underline flex items-center gap-1 opacity-75 hover:opacity-100"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{isCopied ? 'تم النسخ' : 'نسخ'}</span>
                          </button>

                          <button
                            onClick={(e) => toggleBookmark(bayt.id, e)}
                            className="hover:underline flex items-center gap-1 opacity-75 hover:opacity-100"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-3 h-3 text-amber-700" />
                            ) : (
                              <Bookmark className="w-3 h-3" />
                            )}
                            <span>{isBookmarked ? 'محفوظ' : 'حفظ'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 font-mono opacity-60 tabular-nums">
                          <span>
                            {bayt.hasTimestamp && bayt.audioStart !== null
                              ? `${formatTime(bayt.audioStart)}–${formatTime(bayt.audioEnd || 0)}`
                              : 'بدون توقيت'}
                          </span>
                          <span>·</span>
                          <span>#{bayt.baytNumber}</span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>

          {/* Printed Page Footer Navigation (Pages 1..94) */}
          {settings.pageLayout === 'pages' && !searchQuery && !showBookmarksOnly && (
            <div
              className={`flex items-center justify-between pt-4 mt-5 border-t ${themeClasses.headerBorder} select-none`}
            >
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`min-h-[40px] flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentPage <= 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابقة</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
                <span>صفحة</span>
                <input
                  type="number"
                  min={1}
                  max={SHATIBIYYAH_META.totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) handlePageChange(v);
                  }}
                  aria-label="رقم الصفحة"
                  className={`w-12 text-center py-1 rounded border ${themeClasses.pageBorder} bg-transparent font-bold`}
                />
                <span>/ {SHATIBIYYAH_META.totalPages}</span>
              </div>

              <button
                disabled={currentPage >= SHATIBIYYAH_META.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`min-h-[40px] flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentPage >= SHATIBIYYAH_META.totalPages
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span>التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Inline Audio / Timestamp Feedback Strip above Docked Player */}
      {unavailableFeedback && (
        <div
          dir="rtl"
          className="fixed bottom-16 left-2.5 right-2.5 sm:left-6 sm:right-6 z-40 max-w-5xl mx-auto"
        >
          <div className="bg-slate-900/95 text-amber-100 border border-amber-500/40 rounded-lg px-3 py-2 shadow-lg flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate sm:whitespace-normal">{unavailableFeedback.message}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {unavailableFeedback.reason === 'no_timestamp' && (
                <>
                  <button
                    onClick={() => {
                      setUnavailableFeedback(null);
                      handlePlayFullBook();
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>تشغيل التسجيل</span>
                  </button>
                  <button
                    onClick={() => openTimestampEditorForBayt(unavailableFeedback.baytNumber)}
                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    <span>ضبط التوقيت #{unavailableFeedback.baytNumber}</span>
                  </button>
                </>
              )}
              <button
                onClick={() => handleRunDiagnostics(unavailableFeedback.baytNumber)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] flex items-center gap-1"
              >
                <Activity className="w-3 h-3" />
                <span>تشخيص</span>
              </button>
              <button
                onClick={() => setUnavailableFeedback(null)}
                className="p-1 text-slate-400 hover:text-white shrink-0"
                aria-label="إغلاق التنبيه"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Compact Docked Bottom Audio Bar (Honest, Segment-Aware, Mobile-First) ── */}
      <footer
        dir="rtl"
        className={`fixed bottom-0 left-0 right-0 z-40 ${themeClasses.bottomBar} backdrop-blur-md border-t px-2.5 sm:px-6 py-2 shadow-lg transition-colors`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Transport Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              onClick={() => handleSwitchPart(-1)}
              disabled={audioParts[0]?.id === activePart?.id}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 hidden sm:inline-flex"
              title="الجزء الصوتي السابق"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrevBayt}
              disabled={(currentActiveBayt?.baytNumber || 1) <= 1}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
              title="البيت السابق"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-sm transition-colors shrink-0 ${
                activePart?.hasAudio
                  ? 'bg-amber-700 hover:bg-amber-600 text-white'
                  : 'bg-black/10 dark:bg-white/10 opacity-60'
              }`}
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              title={
                activePart?.hasAudio
                  ? 'تشغيل / إيقاف تلاوة الشيخ عكاشة كميني'
                  : 'التسجيل غير مربوط لهذا الجزء بعد'
              }
            >
              {isAudioLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextBayt}
              disabled={(currentActiveBayt?.baytNumber || 1) >= SHATIBIYYAH_META.totalAbyat}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
              title="البيت التالي"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSwitchPart(1)}
              disabled={audioParts[audioParts.length - 1]?.id === activePart?.id}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 hidden sm:inline-flex"
              title="الجزء الصوتي التالي"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Part & Bayt Info + Playback Status + Segment/Track Scrubber */}
          <div className="flex-1 min-w-0 px-1 space-y-0.5">
            <div className="flex items-center justify-between text-[11px] gap-2">
              <div className="truncate font-bold">
                {audioError ? (
                  <span className="text-red-500">{audioError}</span>
                ) : activePart?.hasAudio ? (
                  <span>
                    {playbackMode === 'book' ? 'الكتاب كاملاً' : 'بيت مفرد'}
                    {currentActiveBayt ? ` · البيت ${currentActiveBayt.baytNumber}` : ''}
                    <span className="opacity-70 font-normal"> · {statusLabelArabic}</span>
                    {isYoutubeActive ? ' (يوتيوب)' : ''}
                  </span>
                ) : (
                  <span className="opacity-75">
                    {activePart?.titleArabic} — مصدر الصوت غير مربوط ({connectedPartsCount}/
                    {audioParts.length} · توقيت: {verifiedTimestampsCount}/1173)
                  </span>
                )}
              </div>

              <div className="font-mono text-[10px] opacity-70 tabular-nums shrink-0">
                {activePart?.hasAudio
                  ? `${formatTime(playbackProgress.elapsed)} / ${formatTime(playbackProgress.total)}`
                  : `${activePart?.startBayt}–${activePart?.endBayt}`}
              </div>
            </div>

            <input
              type="range"
              min={playbackProgress.minSeek}
              max={playbackProgress.maxSeek}
              step="0.1"
              disabled={!activePart?.hasAudio}
              value={
                playbackProgress.mode === 'single'
                  ? Math.max(
                      playbackProgress.minSeek,
                      Math.min(playbackProgress.maxSeek, currentTime)
                    )
                  : currentTime
              }
              onChange={handleSeek}
              aria-label="شريط تقدم التلاوة"
              className="w-full h-1 bg-black/10 dark:bg-white/10 rounded appearance-none cursor-pointer accent-amber-700 disabled:opacity-35"
            />
          </div>

          {/* Right Quick Actions: Replay Current Bayt, Loop Bayt, Speed, Timestamp Editor, Offline/Download */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 text-xs">
            <button
              onClick={handleReplayCurrentBayt}
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100"
              title="إعادة تشغيل البيت الحالي"
              aria-label="إعادة تشغيل البيت الحالي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setRepeatBayt((v) => !v)}
              className={`p-1.5 rounded transition-colors ${
                repeatBayt
                  ? 'bg-amber-700 text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-75'
              }`}
              title="تكرار البيت الحالي"
              aria-label="تكرار البيت الحالي"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleSpeed}
              className="px-1.5 py-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[11px] font-bold font-mono tabular-nums"
              title="سرعة التلاوة"
            >
              {playbackSpeed}x
            </button>

            {!isYoutubeActive && (
              <>
                <button
                  onClick={handleToggleOfflineCache}
                  disabled={!activePart?.hasAudio || cachingPartId === activePart?.id}
                  className={`p-1.5 rounded transition-colors hidden sm:inline-flex ${
                    isCurrentOffline
                      ? 'text-emerald-600'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-75 disabled:opacity-30'
                  }`}
                  title={
                    isCurrentOffline ? 'محفوظ للاستماع دون اتصال' : 'حفظ للاستماع دون اتصال'
                  }
                >
                  {isCurrentOffline ? (
                    <WifiOff className="w-4 h-4" />
                  ) : (
                    <HardDriveDownload className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!activePart?.hasAudio}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                  title="تحميل الملف الصوتي"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* ── 4. Collapsible Reading & Audio Settings Sheet ── */}
      {isSettingsOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            className={`w-full sm:max-w-md ${themeClasses.bg} rounded-t-2xl sm:rounded-2xl border ${themeClasses.pageBorder} p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto`}
          >
            <div
              className={`flex items-center justify-between pb-2 border-b ${themeClasses.headerBorder}`}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-700" />
                <h3 className="font-bold text-sm">خيارات القراءة والمزامنة الصوتية</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-70 block">طابع صفحة الكتاب:</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'cream', name: 'كريمي', cls: 'bg-[#faf7ee] text-slate-900 border-[#dfd5be]' },
                  { id: 'sepia', name: 'مخطوطة', cls: 'bg-[#f3ebd6] text-amber-950 border-[#d6c7a8]' },
                  { id: 'white', name: 'أبيض', cls: 'bg-white text-slate-900 border-slate-200' },
                  { id: 'dark', name: 'ليلي', cls: 'bg-slate-900 text-white border-slate-700' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ readingTheme: t.id as any })}
                    className={`py-2 px-1 rounded-lg text-center font-bold border transition-all ${
                      t.cls
                    } ${settings.readingTheme === t.id ? 'ring-2 ring-amber-700' : 'opacity-80'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-70 block">حجم الخط العربي:</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'compact', label: 'صغير' },
                  { id: 'medium', label: 'متوسط' },
                  { id: 'large', label: 'كبير' },
                  { id: 'xlarge', label: 'جلي' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateSettings({ fontSize: s.id as any })}
                    className={`py-1.5 rounded-lg font-bold border transition-colors ${
                      settings.fontSize === s.id
                        ? 'bg-amber-700 text-white border-amber-700'
                        : `${themeClasses.pageBorder} hover:bg-black/5`
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Layout */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold opacity-70 block">طريقة العرض:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => updateSettings({ pageLayout: 'pages' })}
                  className={`py-2 px-3 rounded-lg font-bold border flex items-center justify-center gap-1.5 ${
                    settings.pageLayout === 'pages'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : themeClasses.pageBorder
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>صفحات الكتاب (٩٤ ص)</span>
                </button>
                <button
                  onClick={() => updateSettings({ pageLayout: 'continuous' })}
                  className={`py-2 px-3 rounded-lg font-bold border flex items-center justify-center gap-1.5 ${
                    settings.pageLayout === 'continuous'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : themeClasses.pageBorder
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>حسب الباب (مستمر)</span>
                </button>
              </div>
            </div>

            {/* Audio Parts Selector & Sync Toggles */}
            <div className={`space-y-2 pt-2 border-t ${themeClasses.headerBorder}`}>
              <label className="text-xs font-bold opacity-70 block">
                أجزاء التلاوة (الشيخ عكاشة كميني — {connectedPartsCount}/{audioParts.length} متصل):
              </label>
              <select
                value={activePart?.id || ''}
                onChange={(e) => {
                  const target = audioParts.find((p) => p.id === e.target.value);
                  if (target) {
                    pendingSeekRef.current = null;
                    pendingYtSeekRef.current = null;
                    setSelectedPartId(target.id);
                    const b = getBaytByNumber(target.startBayt);
                    if (b) {
                      setActiveBaytId(b.id);
                      setSelectedBabId(b.babId);
                      setCurrentPage(b.pageNumber);
                    }
                  }
                }}
                className={`w-full px-2.5 py-2 rounded-lg border ${themeClasses.pageBorder} bg-transparent text-xs font-bold`}
              >
                {audioParts.map((p) => (
                  <option key={p.id} value={p.id} className="text-slate-900 bg-white">
                    {p.titleArabic} ({p.startBayt}–{p.endBayt}){' '}
                    {p.hasAudio ? '✓ متصل' : '— غير مربوط'}
                  </option>
                ))}
              </select>

              {activePart?.hasAudio && !isYoutubeActive && (
                <button
                  onClick={handleToggleOfflineCache}
                  className={`w-full py-2 px-3 rounded-lg border ${themeClasses.pageBorder} text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/5`}
                >
                  {isCurrentOffline ? (
                    <>
                      <WifiOff className="w-4 h-4 text-emerald-600" />
                      <span>الجزء محفوظ دون اتصال (اضغط للإزالة)</span>
                    </>
                  ) : (
                    <>
                      <HardDriveDownload className="w-4 h-4" />
                      <span>حفظ الجزء الحالي للاستماع دون اتصال</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className={`space-y-2 pt-2 border-t ${themeClasses.headerBorder}`}>
              <span className="text-xs font-bold opacity-70 block">خيارات التزامن:</span>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span>تمييز البيت المتلو حالياً</span>
                <input
                  type="checkbox"
                  checked={settings.autoHighlight}
                  onChange={(e) => updateSettings({ autoHighlight: e.target.checked })}
                  className="rounded accent-amber-700 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span>التمرير التلقائي مع التلاوة</span>
                <input
                  type="checkbox"
                  checked={settings.autoScroll}
                  onChange={(e) => updateSettings({ autoScroll: e.target.checked })}
                  className="rounded accent-amber-700 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span>إظهار أرقام الأبيات</span>
                <input
                  type="checkbox"
                  checked={settings.showBaytNumber}
                  onChange={(e) => updateSettings({ showBaytNumber: e.target.checked })}
                  className="rounded accent-amber-700 w-4 h-4"
                />
              </label>
            </div>

            <div className={`pt-2 border-t ${themeClasses.headerBorder} space-y-2`}>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  handleRunDiagnostics(currentActiveBayt?.baytNumber || 1);
                }}
                className={`w-full py-2 px-3 rounded-lg border ${themeClasses.pageBorder} text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5`}
              >
                <Activity className="w-4 h-4 text-amber-700" />
                <span>فحص وتشخيص الصوت (Audio Diagnostics)</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs"
              >
                إغلاق وحفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. 7-Point Live Audio Diagnostics Modal ── */}
      {isDiagnosticsOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs"
        >
          <div
            className={`w-full sm:max-w-lg ${themeClasses.bg} rounded-t-2xl sm:rounded-2xl border ${themeClasses.pageBorder} p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto`}
          >
            <div
              className={`flex items-center justify-between pb-2.5 border-b ${themeClasses.headerBorder}`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-700" />
                <div>
                  <h3 className="font-bold text-sm">
                    تشخيص صوت متن الشاطبية (Audio Diagnostics)
                  </h3>
                  <p className="text-[11px] opacity-70">
                    البيت #{diagnosticsReport?.baytNumber || currentActiveBayt?.baytNumber || 1} ·{' '}
                    {SHATIBIYYAH_META.reciterArabic}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDiagnosticsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isRunningDiagnostics ? (
              <div className="py-10 flex flex-col items-center justify-center gap-3 text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
                <span>جاري إجراء الفحوصات السبعة للخادم والملف الصوتي والتوقيت...</span>
              </div>
            ) : diagnosticsReport ? (
              <div className="space-y-3">
                {/* Summary Result Banner */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    diagnosticsReport.overallPass
                      ? 'bg-emerald-950/15 border-emerald-600/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-950/15 border-amber-600/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-bold">
                    <span>
                      {diagnosticsReport.overallPass
                        ? 'النتيجة: الصوت والتوقيت جاهزان للتشغيل'
                        : diagnosticsReport.primaryErrorCode || 'تعذر التشغيل'}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      {diagnosticsReport.checks.filter((c) => c.status === 'pass').length}/
                      {diagnosticsReport.checks.length} PASS
                    </span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    {diagnosticsReport.primaryMessageArabic}
                  </p>
                </div>

                {/* Individual 7 Diagnostic Checks */}
                <div className="space-y-2">
                  {diagnosticsReport.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className={`p-2.5 rounded-lg border ${themeClasses.pageBorder} text-xs space-y-1`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {chk.status === 'pass' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : chk.status === 'fail' ? (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span>{chk.labelArabic}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            chk.status === 'pass'
                              ? 'bg-emerald-500/15 text-emerald-600'
                              : chk.status === 'fail'
                              ? 'bg-red-500/15 text-red-500'
                              : 'bg-amber-500/15 text-amber-600'
                          }`}
                        >
                          {chk.errorCode || chk.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-80 leading-relaxed">{chk.detailArabic}</p>
                      <p className="text-[10px] font-mono opacity-60" dir="ltr">
                        {chk.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleRunDiagnostics(currentActiveBayt?.baytNumber || 1)}
                disabled={isRunningDiagnostics}
                className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الفحص الآن</span>
              </button>
              <button
                onClick={() => setIsDiagnosticsOpen(false)}
                className={`px-4 py-2.5 rounded-xl border ${themeClasses.pageBorder} font-bold text-xs hover:bg-black/5`}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Interactive Timestamp Editor Modal (Saves permanently to DB) ── */}
      <ShatibiyyahTimestampEditor
        isOpen={isTimestampEditorOpen}
        onClose={() => setIsTimestampEditorOpen(false)}
        audioParts={audioParts}
        verifiedTimestamps={verifiedTimestamps}
        initialBaytNumber={editorInitialBayt}
        initialPartId={activePart?.id}
        onTimestampsUpdated={(next) => {
          setVerifiedTimestamps(next);
          flashNotice(`تم تحديث وحفظ التوقيتات (${Object.keys(next).length}/1173 بيتاً).`);
        }}
      />
    </div>
  );
};

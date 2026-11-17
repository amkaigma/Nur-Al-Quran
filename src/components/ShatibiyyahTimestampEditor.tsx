import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  Save,
  RotateCcw,
  Volume2,
  ChevronRight,
  FileUp,
  Download,
  Trash2,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Youtube
} from 'lucide-react';
import {
  SHATIBIYYAH_ABYAT,
  SHATIBIYYAH_META,
  ShatibiyyahAudioPart,
  ShatibiyyahTimestampEntry
} from '../data/shatibiyyahData';
import {
  getMissingTimestampsSummary,
  getPartPlaybackKind
} from '../utils/shatibiyyahSync';
import {
  SHATIBIYYAH_YOUTUBE_VIDEO_ID,
  YTPlayerInstance,
  YT_PLAYER_STATE,
  describeYouTubeError,
  loadYouTubeIframeAPI
} from '../utils/youtubePlayer';
import {
  getStoredAdminToken,
  loginSuperAdmin,
  saveShatibiyyahTimestamps
} from '../services/adminService';

interface DraftTimestamp {
  audioStart: string;
  audioEnd: string;
  dirty?: boolean;
  clear?: boolean;
}

interface ShatibiyyahTimestampEditorProps {
  isOpen: boolean;
  onClose: () => void;
  audioParts: ShatibiyyahAudioPart[];
  verifiedTimestamps: Record<string, ShatibiyyahTimestampEntry>;
  initialBaytNumber?: number;
  initialPartId?: string;
  onTimestampsUpdated: (nextTimestamps: Record<string, ShatibiyyahTimestampEntry>) => void;
}

function parseFlexibleTime(raw: string): number {
  const s = (raw || '').trim();
  if (!s) return NaN;
  if (/^\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const parts = s.split(':').map((p) => parseFloat(p.trim()));
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return NaN;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return NaN;
}

export const ShatibiyyahTimestampEditor: React.FC<ShatibiyyahTimestampEditorProps> = ({
  isOpen,
  onClose,
  audioParts,
  verifiedTimestamps,
  initialBaytNumber = 1,
  initialPartId,
  onTimestampsUpdated
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>(
    initialPartId || audioParts[0]?.id || 'part-01'
  );
  const [cursorBaytNum, setCursorBaytNum] = useState<number>(initialBaytNumber);
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'verified'>('all');
  const [drafts, setDrafts] = useState<Record<number, DraftTimestamp>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showBulkImport, setShowBulkImport] = useState<boolean>(false);
  const [bulkInput, setBulkInput] = useState<string>('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Admin auth inside editor
  const [hasAdminToken, setHasAdminToken] = useState<boolean>(() => Boolean(getStoredAdminToken()));
  const [adminEmail, setAdminEmail] = useState<string>('abdalkaigama@gmail.com');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Media Player State (Supports both YouTube IFrame API & uploaded MP3)
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ytReady, setYtReady] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const selectedPart = useMemo(
    () => audioParts.find((p) => p.id === selectedPartId) || audioParts[0],
    [audioParts, selectedPartId]
  );
  const partKind = useMemo(() => getPartPlaybackKind(selectedPart), [selectedPart]);
  const isYouTube = partKind.sourceType === 'youtube';
  const activeVideoId = partKind.youtubeVideoId || SHATIBIYYAH_YOUTUBE_VIDEO_ID;

  const missingSummary = useMemo(
    () => getMissingTimestampsSummary(verifiedTimestamps),
    [verifiedTimestamps]
  );

  // Sync initial selection when opened
  useEffect(() => {
    if (!isOpen) return;
    setHasAdminToken(Boolean(getStoredAdminToken()));
    setCursorBaytNum(initialBaytNumber);
    if (initialPartId) {
      setSelectedPartId(initialPartId);
    } else {
      const matchedPart = audioParts.find(
        (p) => initialBaytNumber >= p.startBayt && initialBaytNumber <= p.endBayt
      );
      if (matchedPart) setSelectedPartId(matchedPart.id);
    }
  }, [isOpen, initialBaytNumber, initialPartId, audioParts]);

  // Initialize YouTube Player inside Editor Modal when open & part uses YouTube
  useEffect(() => {
    if (!isOpen || !isYouTube) return;

    let cancelled = false;
    let pollTimer: number | null = null;
    setMediaError(null);
    setYtReady(false);

    loadYouTubeIframeAPI()
      .then((YT) => {
        if (cancelled || !ytContainerRef.current) return;
        const player = new YT.Player(ytContainerRef.current, {
          videoId: activeVideoId,
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
              setYtReady(true);
              setDuration(ev.target.getDuration() || 0);
              try {
                ev.target.setPlaybackRate(playbackSpeed);
              } catch {
                // ignore
              }
            },
            onStateChange: (ev) => {
              if (cancelled) return;
              const st = ev.data;
              setIsPlaying(st === YT_PLAYER_STATE.PLAYING || st === YT_PLAYER_STATE.BUFFERING);
              const d = ev.target.getDuration();
              if (d > 0) setDuration(d);
            },
            onError: (ev) => {
              if (cancelled) return;
              const desc = describeYouTubeError(ev.data);
              setMediaError(`${desc.ar} (${desc.en})`);
              setIsPlaying(false);
            }
          }
        });
        ytPlayerRef.current = player;

        pollTimer = window.setInterval(() => {
          const p = ytPlayerRef.current;
          if (p && typeof p.getCurrentTime === 'function') {
            const t = p.getCurrentTime();
            if (Number.isFinite(t)) setCurrentTime(t);
            const d = p.getDuration?.();
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }
        }, 180);
      })
      .catch((err) => {
        if (!cancelled) {
          setMediaError(err?.message || 'Failed to initialize YouTube Player.');
        }
      });

    return () => {
      cancelled = true;
      if (pollTimer) window.clearInterval(pollTimer);
      try {
        ytPlayerRef.current?.destroy();
      } catch {
        // ignore
      }
      ytPlayerRef.current = null;
      setYtReady(false);
      setIsPlaying(false);
    };
  }, [isOpen, isYouTube, activeVideoId]);

  // Apply playback rate changes
  useEffect(() => {
    if (isYouTube && ytPlayerRef.current && ytReady) {
      try {
        ytPlayerRef.current.setPlaybackRate(playbackSpeed);
      } catch {
        // ignore
      }
    } else if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, isYouTube, ytReady]);

  // Visible rows inside editor
  const visibleAbyat = useMemo(() => {
    const base = selectedPart
      ? SHATIBIYYAH_ABYAT.filter(
          (b) => b.baytNumber >= selectedPart.startBayt && b.baytNumber <= selectedPart.endBayt
        )
      : SHATIBIYYAH_ABYAT;

    if (filterMode === 'missing') {
      return base.filter((b) => !verifiedTimestamps[String(b.baytNumber)]);
    }
    if (filterMode === 'verified') {
      return base.filter((b) => Boolean(verifiedTimestamps[String(b.baytNumber)]));
    }
    return base;
  }, [selectedPart, filterMode, verifiedTimestamps]);

  const togglePlay = () => {
    if (isYouTube) {
      const p = ytPlayerRef.current;
      if (!p || !ytReady) return;
      if (isPlaying) {
        p.pauseVideo();
      } else {
        p.playVideo();
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => setMediaError(e?.message || 'Audio playback failed.'));
      }
    }
  };

  const seekToTime = (sec: number, autoPlay: boolean = false) => {
    const clamped = Math.max(0, sec);
    setCurrentTime(clamped);
    if (isYouTube && ytPlayerRef.current && ytReady) {
      ytPlayerRef.current.seekTo(clamped, true);
      if (autoPlay) ytPlayerRef.current.playVideo();
    } else if (audioRef.current) {
      audioRef.current.currentTime = clamped;
      if (autoPlay) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => setMediaError(e?.message || 'Audio playback failed.'));
      }
    }
  };

  const getRowTiming = (baytNum: number) => {
    const d = drafts[baytNum];
    if (d) {
      return { start: d.audioStart, end: d.audioEnd, dirty: !!d.dirty, clear: !!d.clear };
    }
    const saved = verifiedTimestamps[String(baytNum)];
    if (saved) {
      return { start: String(saved.audioStart), end: String(saved.audioEnd), dirty: false, clear: false };
    }
    return { start: '', end: '', dirty: false, clear: false };
  };

  const setBaytDraft = (baytNum: number, patch: Partial<DraftTimestamp>) => {
    setDrafts((prev) => {
      const existing = prev[baytNum] || {
        audioStart: verifiedTimestamps[String(baytNum)]
          ? String(verifiedTimestamps[String(baytNum)].audioStart)
          : '',
        audioEnd: verifiedTimestamps[String(baytNum)]
          ? String(verifiedTimestamps[String(baytNum)].audioEnd)
          : ''
      };
      return {
        ...prev,
        [baytNum]: { ...existing, ...patch, dirty: true }
      };
    });
  };

  const markStartNow = () => {
    const t = Math.round(currentTime * 100) / 100;
    setBaytDraft(cursorBaytNum, { audioStart: String(t), clear: false });
  };

  const markEndAndAdvance = () => {
    const t = Math.round(currentTime * 100) / 100;
    const row = getRowTiming(cursorBaytNum);
    const startVal = row.start !== '' ? row.start : '0';
    setBaytDraft(cursorBaytNum, {
      audioStart: startVal,
      audioEnd: String(t),
      clear: false
    });
    const maxBayt = selectedPart?.endBayt || SHATIBIYYAH_META.totalAbyat;
    if (cursorBaytNum < maxBayt) {
      const nextNum = cursorBaytNum + 1;
      setBaytDraft(nextNum, { audioStart: String(t), clear: false });
      setCursorBaytNum(nextNum);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setNotice(null);
    try {
      await loginSuperAdmin(adminEmail.trim(), adminPassword, true);
      setHasAdminToken(true);
      setAdminPassword('');
      setNotice({ type: 'ok', text: 'تم تسجيل دخول المشرف — يمكنك الآن حفظ التوقيتات في قاعدة البيانات.' });
    } catch (err: any) {
      setNotice({ type: 'err', text: err?.message || 'فشل تسجيل الدخول.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSaveDirty = async () => {
    if (!selectedPart) return;
    const dirtyEntries = Object.entries(drafts)
      .filter(([, d]) => d.dirty)
      .map(([numStr, d]) => {
        const baytNumber = Number(numStr);
        const baytObj = SHATIBIYYAH_ABYAT[baytNumber - 1];
        if (d.clear || d.audioStart.trim() === '' || d.audioEnd.trim() === '') {
          return {
            baytNumber,
            audioPartId: selectedPart.id,
            audioStart: null,
            audioEnd: null,
            clear: true
          };
        }
        return {
          baytId: baytObj?.id,
          baytNumber,
          arabicText: baytObj?.fullArabic,
          chapterName: baytObj?.babTitle,
          recordingId: partKind.recordingId || activeVideoId,
          audioPartId: selectedPart.id,
          audioStart: parseFlexibleTime(d.audioStart),
          audioEnd: parseFlexibleTime(d.audioEnd)
        };
      });

    if (dirtyEntries.length === 0) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const res = await saveShatibiyyahTimestamps(dirtyEntries);
      onTimestampsUpdated(res.timestamps || {});
      setDrafts({});
      setNotice({
        type: 'ok',
        text: `تم حفظ ${res.updatedCount} توقيتاً موثقاً في قاعدة البيانات الدائمة.`
      });
    } catch (err: any) {
      if (String(err?.message || '').toLowerCase().includes('unauthorized')) {
        setHasAdminToken(false);
      }
      setNotice({ type: 'err', text: err?.message || 'تعذر حفظ التوقيتات.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkInput.trim() || !selectedPart) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const trimmed = bulkInput.trim();
      let entries: Array<{
        baytId?: string;
        baytNumber: number;
        arabicText?: string;
        chapterName?: string;
        recordingId?: string;
        audioPartId: string;
        audioStart: number;
        audioEnd: number;
      }> = [];

      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        const list = Array.isArray(parsed) ? parsed : parsed.entries || [];
        entries = list.map((item: any) => {
          const n = Number(item.baytNumber ?? item.bayt);
          const b = SHATIBIYYAH_ABYAT[n - 1];
          return {
            baytId: b?.id,
            baytNumber: n,
            arabicText: b?.fullArabic,
            chapterName: b?.babTitle,
            recordingId: String(item.recordingId || partKind.recordingId || activeVideoId),
            audioPartId: String(item.audioPartId || selectedPart.id),
            audioStart: parseFlexibleTime(String(item.audioStart ?? item.start)),
            audioEnd: parseFlexibleTime(String(item.audioEnd ?? item.end))
          };
        });
      } else {
        entries = trimmed
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('#') && !line.toLowerCase().startsWith('bayt'))
          .map((line) => {
            const cols = line.split(/[,\t;]+/).map((c) => c.trim());
            const n = Number(cols[0]);
            const b = SHATIBIYYAH_ABYAT[n - 1];
            return {
              baytId: b?.id,
              baytNumber: n,
              arabicText: b?.fullArabic,
              chapterName: b?.babTitle,
              recordingId: partKind.recordingId || activeVideoId,
              audioPartId: cols[3] || selectedPart.id,
              audioStart: parseFlexibleTime(cols[1]),
              audioEnd: parseFlexibleTime(cols[2])
            };
          });
      }

      if (entries.length === 0) {
        setNotice({ type: 'err', text: 'لم يتم العثور على صفوف صالحة.' });
        return;
      }

      const res = await saveShatibiyyahTimestamps(entries);
      onTimestampsUpdated(res.timestamps || {});
      setBulkInput('');
      setShowBulkImport(false);
      setNotice({ type: 'ok', text: `تم استيراد وحفظ ${res.updatedCount} توقيتاً بنجاح.` });
    } catch (err: any) {
      setNotice({ type: 'err', text: err?.message || 'فشل الاستيراد الجماعي.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const list = Object.values(verifiedTimestamps).sort((a, b) => a.baytNumber - b.baytNumber);
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shatibiyyah_timestamps_${activeVideoId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '00:00.0';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const tenths = Math.floor((secs * 10) % 10);
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`;
  };

  const dirtyCount = Object.values(drafts).filter((d) => d.dirty).length;

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs"
    >
      <div className="w-full max-w-4xl bg-slate-950 text-slate-100 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate">
              محرر توقيتات أبيات الشاطبية (الشيخ عكاشة كميني)
            </h3>
            <p className="text-[11px] text-slate-400 tabular-nums">
              الموثّق: {missingSummary.verifiedCount} / 1,173 ({missingSummary.percentComplete}%) · غير الموثّق:{' '}
              {missingSummary.missingCount} ({missingSummary.missingRangesLabel})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isYouTube && selectedPart?.audioUrl && (
            <audio
              ref={audioRef}
              src={selectedPart.audioUrl}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration || 0)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          {/* Optional Super Admin Unlock Strip if not yet signed in */}
          {!hasAdminToken && (
            <form
              onSubmit={handleAdminSignIn}
              className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/35 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
            >
              <div className="flex items-center gap-2 text-amber-200 font-bold shrink-0">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>تسجيل دخول المشرف لحفظ التوقيتات:</span>
              </div>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                dir="ltr"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="كلمة مرور المشرف"
                dir="ltr"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <button
                type="submit"
                disabled={isLoggingIn}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0"
              >
                {isLoggingIn ? 'جاري التحقق...' : 'فتح الحفظ'}
              </button>
            </form>
          )}

          {notice && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                notice.type === 'ok'
                  ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300'
                  : 'bg-red-950/30 border-red-600/40 text-red-300'
              }`}
            >
              {notice.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
          )}

          {/* Embedded YouTube Player + Transport Marking Bar */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-slate-800">
              {isYouTube ? (
                <div ref={ytContainerRef} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  MP3 Local Audio
                </div>
              )}
              {isYouTube && !ytReady && !mediaError && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center gap-2 text-xs text-slate-300 pointer-events-none">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>تحميل يوتيوب...</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-2.5">
              {mediaError ? (
                <div className="p-2 rounded-lg bg-red-950/40 border border-red-700/40 text-xs text-red-300">
                  {mediaError}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="font-bold">تسجيل يوتيوب:</span>
                    <span className="font-mono text-amber-300" dir="ltr">
                      {activeVideoId}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-emerald-400 tabular-nums" dir="ltr">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              )}

              <input
                type="range"
                min={0}
                max={duration || 3600}
                step={0.1}
                value={currentTime}
                onChange={(e) => seekToTime(parseFloat(e.target.value), false)}
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={togglePlay}
                  disabled={isYouTube && !ytReady}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}</span>
                </button>

                <button
                  onClick={() => seekToTime(currentTime - 2, false)}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono"
                  dir="ltr"
                >
                  -2s
                </button>
                <button
                  onClick={() => seekToTime(currentTime + 2, false)}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono"
                  dir="ltr"
                >
                  +2s
                </button>

                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                </select>

                <button
                  onClick={markStartNow}
                  className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                >
                  بداية البيت #{cursorBaytNum} ({currentTime.toFixed(1)}ث)
                </button>

                <button
                  onClick={markEndAndAdvance}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                >
                  <span>نهاية #{cursorBaytNum} والتالي</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter & Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold max-w-xs"
              >
                {audioParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.order} · {p.titleArabic} ({p.startBayt}–{p.endBayt})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'missing', label: 'الناقصة فقط' },
                  { id: 'verified', label: 'الموثّقة فقط' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterMode(tab.id as any)}
                    className={`px-2.5 py-1 rounded-md font-bold ${
                      filterMode === tab.id ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowBulkImport((v) => !v)}
                className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs flex items-center gap-1.5"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>استيراد CSV/JSON</span>
              </button>

              {missingSummary.verifiedCount > 0 && (
                <button
                  onClick={handleExport}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير</span>
                </button>
              )}

              {dirtyCount > 0 && (
                <button
                  onClick={() => setDrafts({})}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تراجع ({dirtyCount})</span>
                </button>
              )}

              <button
                onClick={handleSaveDirty}
                disabled={isSaving || dirtyCount === 0 || !hasAdminToken}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'جاري الحفظ...' : `حفظ التوقيتات (${dirtyCount})`}</span>
              </button>
            </div>
          </div>

          {showBulkImport && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-bold">
                أدخل التوقيتات بصيغة CSV (رقم_البيت,البداية,النهاية بالثواني أو MM:SS) أو JSON:
              </div>
              <textarea
                rows={4}
                dir="ltr"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={'1,00:08,00:15\n2,00:15,00:22'}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!hasAdminToken || isSaving}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-slate-950 font-bold text-xs disabled:opacity-40"
                >
                  اعتماد وحفظ
                </button>
              </div>
            </div>
          )}

          {/* Bayts Editable Rows */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 divide-y divide-slate-800 max-h-[340px] overflow-y-auto">
            {visibleAbyat.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                لا توجد أبيات مطابقة للفلتر المحدد.
              </div>
            ) : (
              visibleAbyat.map((bayt) => {
                const timing = getRowTiming(bayt.baytNumber);
                const isCursor = cursorBaytNum === bayt.baytNumber;
                const isSaved = Boolean(verifiedTimestamps[String(bayt.baytNumber)]) && !timing.clear;

                return (
                  <div
                    key={bayt.id}
                    onClick={() => setCursorBaytNum(bayt.baytNumber)}
                    className={`p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 cursor-pointer ${
                      isCursor ? 'bg-emerald-950/35' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold tabular-nums shrink-0 ${
                          isCursor
                            ? 'bg-emerald-500 text-slate-950'
                            : isSaved
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{bayt.baytNumber}
                      </span>
                      <div className="min-w-0 flex-1 font-arabic text-sm text-white leading-relaxed">
                        <span>{bayt.shatrA}</span>
                        <span className="text-amber-400 mx-1.5">۞</span>
                        <span>{bayt.shatrB}</span>
                      </div>
                    </div>

                    <div
                      className="flex flex-wrap items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        dir="ltr"
                        value={timing.start}
                        placeholder="Start (sec or MM:SS)"
                        onChange={(e) =>
                          setBaytDraft(bayt.baytNumber, {
                            audioStart: e.target.value,
                            clear: false
                          })
                        }
                        className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={timing.end}
                        placeholder="End (sec or MM:SS)"
                        onChange={(e) =>
                          setBaytDraft(bayt.baytNumber, {
                            audioEnd: e.target.value,
                            clear: false
                          })
                        }
                        className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                      />

                      {timing.start !== '' && (
                        <button
                          onClick={() => {
                            const sec = parseFlexibleTime(timing.start);
                            if (Number.isFinite(sec)) seekToTime(sec, true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                          title="تشغيل من هذا التوقيت"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {(timing.start !== '' || timing.end !== '') && (
                        <button
                          onClick={() =>
                            setBaytDraft(bayt.baytNumber, {
                              audioStart: '',
                              audioEnd: '',
                              clear: true
                            })
                          }
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                          title="مسح التوقيت"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

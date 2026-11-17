import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Upload,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Save,
  Plus,
  RotateCcw,
  Volume2,
  ChevronRight,
  FileUp,
  Download,
  Layers,
  Link2,
  Activity,
  XCircle,
  Loader2,
  Youtube
} from 'lucide-react';
import {
  SHATIBIYYAH_ABWAB,
  SHATIBIYYAH_ABYAT,
  ShatibiyyahAudioPart,
  ShatibiyyahTimestampEntry
} from '../../data/shatibiyyahData';
import {
  fetchShatibiyyahSyncState,
  uploadShatibiyyahPartAudio,
  importShatibiyyahPartFromUrl,
  setShatibiyyahPartYoutubeSource,
  deleteShatibiyyahPartAudio,
  saveShatibiyyahPartMeta,
  saveShatibiyyahTimestamps
} from '../../services/adminService';
import {
  getPartPlaybackKind,
  getMissingTimestampsSummary,
  runShatibiyyahAudioDiagnostics,
  ShatibiyyahAudioDiagnosticsReport
} from '../../utils/shatibiyyahSync';
import {
  SHATIBIYYAH_YOUTUBE_VIDEO_ID,
  YTPlayerInstance,
  YT_PLAYER_STATE,
  loadYouTubeIframeAPI,
  describeYouTubeError
} from '../../utils/youtubePlayer';
import { ShatibiyyahTimestampEditor } from '../ShatibiyyahTimestampEditor';

interface ShatibiyyahAdminStudioProps {
  onFlashMessage: (msg: string) => void;
}

interface DraftTimestamp {
  audioStart: string;
  audioEnd: string;
  dirty?: boolean;
  clear?: boolean;
}

export const ShatibiyyahAdminStudio: React.FC<ShatibiyyahAdminStudioProps> = ({
  onFlashMessage
}) => {
  const [subMode, setSubMode] = useState<'parts' | 'sync'>('parts');
  const [parts, setParts] = useState<ShatibiyyahAudioPart[]>([]);
  const [timestamps, setTimestamps] = useState<Record<string, ShatibiyyahTimestampEntry>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadingPartId, setUploadingPartId] = useState<string | null>(null);
  const [attributionInput, setAttributionInput] = useState<string>(
    'Authorized Sheikh Okasha Kameny recitation archive'
  );
  const [rightsConfirmed, setRightsConfirmed] = useState<boolean>(true);

  // Add / Edit Part Form State
  const [showAddPart, setShowAddPart] = useState<boolean>(false);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [newPartTitleAr, setNewPartTitleAr] = useState<string>('');
  const [newPartTitleEn, setNewPartTitleEn] = useState<string>('');
  const [newPartStartBayt, setNewPartStartBayt] = useState<number>(1);
  const [newPartEndBayt, setNewPartEndBayt] = useState<number>(100);
  const [selectedBabPreset, setSelectedBabPreset] = useState<string>('');

  // Authorized URL / YouTube Link State
  const [urlImportPartId, setUrlImportPartId] = useState<string | null>(null);
  const [remoteAudioUrl, setRemoteAudioUrl] = useState<string>('');
  const [isImportingUrl, setIsImportingUrl] = useState<boolean>(false);
  const [ytLinkPartId, setYtLinkPartId] = useState<string | null>(null);
  const [ytLinkInput, setYtLinkInput] = useState<string>('');
  const [isLinkingYoutube, setIsLinkingYoutube] = useState<boolean>(false);
  const [isModalEditorOpen, setIsModalEditorOpen] = useState<boolean>(false);

  // Part Diagnostics State
  const [diagReport, setDiagReport] = useState<ShatibiyyahAudioDiagnosticsReport | null>(null);
  const [diagRunningPartId, setDiagRunningPartId] = useState<string | null>(null);

  // Sync Studio State
  const [selectedPartId, setSelectedPartId] = useState<string>('part-01');
  const [cursorBaytNum, setCursorBaytNum] = useState<number>(1);
  const [drafts, setDrafts] = useState<Record<number, DraftTimestamp>>({});
  const [isSavingTimestamps, setIsSavingTimestamps] = useState<boolean>(false);
  const [showBulkImport, setShowBulkImport] = useState<boolean>(false);
  const [bulkJsonInput, setBulkJsonInput] = useState<string>('');

  // Dual Media Player State inside Sync Studio (YouTube IFrame API + Local MP3 fallback)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const ytReadyRef = useRef<boolean>(false);
  const [ytReady, setYtReady] = useState<boolean>(false);
  const [ytError, setYtError] = useState<string | null>(null);
  const pendingSeekRef = useRef<{ partId: string; time: number; autoPlay: boolean } | null>(null);
  const [playingPartId, setPlayingPartId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const loadSyncState = async () => {
    setIsLoading(true);
    try {
      const data = await fetchShatibiyyahSyncState();
      setParts(data.parts || []);
      setTimestamps(data.timestamps || {});
      if (
        data.parts?.length > 0 &&
        !data.parts.some((p: ShatibiyyahAudioPart) => p.id === selectedPartId)
      ) {
        setSelectedPartId(data.parts[0].id);
      }
    } catch (err: any) {
      onFlashMessage(`Failed to load Shatibiyyah state: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSyncState();
  }, []);

  const selectedPart = useMemo(
    () => parts.find((p) => p.id === selectedPartId) || parts[0],
    [parts, selectedPartId]
  );

  const partAbyat = useMemo(() => {
    if (!selectedPart) return [];
    return SHATIBIYYAH_ABYAT.filter(
      (b) => b.baytNumber >= selectedPart.startBayt && b.baytNumber <= selectedPart.endBayt
    );
  }, [selectedPart]);

  const selectedPartKind = useMemo(() => getPartPlaybackKind(selectedPart), [selectedPart]);
  const isSelectedYoutube =
    selectedPartKind.sourceType === 'youtube' && Boolean(selectedPartKind.youtubeVideoId);
  const selectedYoutubeId = selectedPartKind.youtubeVideoId || SHATIBIYYAH_YOUTUBE_VIDEO_ID;
  const missingSummary = useMemo(() => getMissingTimestampsSummary(timestamps), [timestamps]);

  // Keep cursor within selected part
  useEffect(() => {
    if (selectedPart) {
      setCursorBaytNum((prev) =>
        prev >= selectedPart.startBayt && prev <= selectedPart.endBayt
          ? prev
          : selectedPart.startBayt
      );
    }
  }, [selectedPart?.id]);

  // Audio listeners for local uploaded MP3s
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      setDuration(audio.duration || 0);
      const pending = pendingSeekRef.current;
      if (pending) {
        pendingSeekRef.current = null;
        audio.currentTime = Math.max(0, pending.time);
        setCurrentTime(Math.max(0, pending.time));
        if (pending.autoPlay) {
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => onFlashMessage(`Audio playback error: ${err.message}`));
        }
      }
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // YouTube Player lifecycle inside Sync Studio sub-mode
  useEffect(() => {
    if (subMode !== 'sync' || !isSelectedYoutube) {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
        ytReadyRef.current = false;
        setYtReady(false);
      }
      return;
    }

    let cancelled = false;
    let pollId: number | null = null;
    setYtError(null);
    setYtReady(false);

    loadYouTubeIframeAPI()
      .then((YT) => {
        if (cancelled || !ytContainerRef.current) return;
        const player = new YT.Player(ytContainerRef.current, {
          videoId: selectedYoutubeId,
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
              const d = ev.target.getDuration?.() || 0;
              if (d > 0) setDuration(d);
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
              const d = ev.target.getDuration?.() || 0;
              if (d > 0) setDuration(d);
            },
            onError: (ev) => {
              if (cancelled) return;
              const desc = describeYouTubeError(ev.data);
              setYtError(desc.en);
              setIsPlaying(false);
            }
          }
        });
        ytPlayerRef.current = player;

        pollId = window.setInterval(() => {
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
        if (!cancelled) setYtError(err?.message || 'Failed to load YouTube Player API.');
      });

    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
        ytReadyRef.current = false;
      }
      setYtReady(false);
    };
  }, [subMode, isSelectedYoutube, selectedYoutubeId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
    if (ytPlayerRef.current && ytReadyRef.current) {
      try {
        ytPlayerRef.current.setPlaybackRate(playbackSpeed);
      } catch {
        // ignore
      }
    }
  }, [playbackSpeed]);

  const loadAudioForPart = (
    part: ShatibiyyahAudioPart,
    autoPlay: boolean = false,
    seekTime?: number
  ) => {
    const kind = getPartPlaybackKind(part);
    if (kind.sourceType === 'youtube') {
      if (ytPlayerRef.current && ytReadyRef.current) {
        const target = Math.max(0, seekTime ?? 0);
        ytPlayerRef.current.seekTo(target, true);
        setCurrentTime(target);
        if (autoPlay) ytPlayerRef.current.playVideo();
      }
      setPlayingPartId(part.id);
      return;
    }

    const audio = audioRef.current;
    if (!audio || !part.hasAudio || !part.audioUrl) return;
    if (playingPartId !== part.id || !audio.getAttribute('src')) {
      pendingSeekRef.current =
        seekTime !== undefined
          ? { partId: part.id, time: seekTime, autoPlay }
          : null;
      audio.src = part.audioUrl;
      audio.playbackRate = playbackSpeed;
      audio.load();
      setPlayingPartId(part.id);
      if (autoPlay && seekTime === undefined) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => onFlashMessage(`Audio playback error: ${err.message}`));
      }
      return;
    }

    audio.playbackRate = playbackSpeed;
    if (seekTime !== undefined) {
      audio.currentTime = Math.max(0, seekTime);
      setCurrentTime(Math.max(0, seekTime));
    }
    if (autoPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => onFlashMessage(`Audio playback error: ${err.message}`));
    }
  };

  const togglePlayPart = (part: ShatibiyyahAudioPart) => {
    const kind = getPartPlaybackKind(part);
    if (kind.sourceType === 'youtube') {
      const p = ytPlayerRef.current;
      if (!p || !ytReadyRef.current) {
        onFlashMessage('YouTube Player is initializing — please wait a second.');
        return;
      }
      if (isPlaying) {
        p.pauseVideo();
      } else {
        p.playVideo();
      }
      setPlayingPartId(part.id);
      return;
    }

    const audio = audioRef.current;
    if (!audio || !part.hasAudio || !part.audioUrl) return;

    if (playingPartId === part.id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else if (playingPartId === part.id) {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    } else {
      loadAudioForPart(part, true);
    }
  };

  const detectAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const objUrl = URL.createObjectURL(file);
      const tempAudio = new Audio(objUrl);
      const timer = setTimeout(() => {
        URL.revokeObjectURL(objUrl);
        resolve(0);
      }, 3000);
      tempAudio.addEventListener('loadedmetadata', () => {
        clearTimeout(timer);
        const dur = Number.isFinite(tempAudio.duration) ? tempAudio.duration : 0;
        URL.revokeObjectURL(objUrl);
        resolve(dur);
      });
      tempAudio.addEventListener('error', () => {
        clearTimeout(timer);
        URL.revokeObjectURL(objUrl);
        resolve(0);
      });
    });
  };

  const handleFileUpload = async (part: ShatibiyyahAudioPart, file: File) => {
    if (!rightsConfirmed) {
      onFlashMessage('Confirm Sheikh Okasha Kameny authenticity & rights before uploading.');
      return;
    }
    setUploadingPartId(part.id);
    try {
      const detectedDuration = await detectAudioDuration(file);
      await uploadShatibiyyahPartAudio(part.id, file, {
        durationSeconds: detectedDuration,
        attribution: attributionInput.trim() || 'Authorized Sheikh Okasha Kameny recording',
        rightsConfirmed: true
      });
      await loadSyncState();
      onFlashMessage(`Uploaded Sheikh Okasha Kameny audio for ${part.titleArabic}`);
    } catch (err: any) {
      onFlashMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploadingPartId(null);
    }
  };

  const handleImportAudioUrl = async (part: ShatibiyyahAudioPart) => {
    if (!rightsConfirmed) {
      onFlashMessage('Confirm Sheikh Okasha Kameny authenticity & rights before importing.');
      return;
    }
    const cleanUrl = remoteAudioUrl.trim();
    if (!cleanUrl || !/^https?:\/\//i.test(cleanUrl)) {
      onFlashMessage('Enter a valid https:// direct MP3/M4A/WAV URL.');
      return;
    }
    setIsImportingUrl(true);
    try {
      await importShatibiyyahPartFromUrl(part.id, {
        url: cleanUrl,
        attribution:
          attributionInput.trim() || 'Authorized Sheikh Okasha Kameny recitation archive',
        rightsConfirmed: true
      });
      setRemoteAudioUrl('');
      setUrlImportPartId(null);
      await loadSyncState();
      onFlashMessage(`Verified and imported remote audio for ${part.titleArabic}`);
    } catch (err: any) {
      onFlashMessage(`URL import failed: ${err.message}`);
    } finally {
      setIsImportingUrl(false);
    }
  };

  const handleLinkYoutubeForPart = async (part: ShatibiyyahAudioPart) => {
    const clean = ytLinkInput.trim();
    if (!clean) {
      onFlashMessage('Enter a YouTube URL or 11-character video ID.');
      return;
    }
    setIsLinkingYoutube(true);
    try {
      await setShatibiyyahPartYoutubeSource(
        part.id,
        clean,
        attributionInput.trim() || 'Sheikh Okasha Kameny — Official YouTube Embed'
      );
      setYtLinkInput('');
      setYtLinkPartId(null);
      await loadSyncState();
      onFlashMessage(`Linked YouTube recording for ${part.titleArabic}`);
    } catch (err: any) {
      onFlashMessage(`YouTube link failed: ${err.message}`);
    } finally {
      setIsLinkingYoutube(false);
    }
  };

  const handleRunPartDiagnostics = async (part: ShatibiyyahAudioPart, baytNum?: number) => {
    setDiagRunningPartId(part.id);
    try {
      const report = await runShatibiyyahAudioDiagnostics({
        baytNumber: baytNum || part.startBayt || 1,
        audioParts: parts,
        verifiedTimestamps: timestamps,
        partOverride: part
      });
      setDiagReport(report);
    } finally {
      setDiagRunningPartId(null);
    }
  };

  const handleDeleteAudio = async (part: ShatibiyyahAudioPart) => {
    try {
      if (playingPartId === part.id && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingPartId(null);
      }
      await deleteShatibiyyahPartAudio(part.id);
      await loadSyncState();
      onFlashMessage(`Removed audio for ${part.titleArabic}`);
    } catch (err: any) {
      onFlashMessage(`Delete failed: ${err.message}`);
    }
  };

  const handleConfigureSingleFullBookPart = async () => {
    try {
      await saveShatibiyyahPartMeta({
        id: 'part-01',
        order: 1,
        titleArabic: 'متن الشاطبية كاملاً (الأبيات ١ – ١١٧٣)',
        titleEnglish: 'Complete Matn Ash-Shatibiyyah Recording (Abyat 1–1173)',
        startBayt: 1,
        endBayt: 1173
      });
      await loadSyncState();
      onFlashMessage('Configured Part #1 to cover all 1,173 Bayts for single-file audio.');
    } catch (err: any) {
      onFlashMessage(`Failed to configure full-book part: ${err.message}`);
    }
  };

  const handleSavePartForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartTitleAr.trim()) return;
    try {
      await saveShatibiyyahPartMeta({
        id: editingPartId || undefined,
        order: editingPartId
          ? parts.find((p) => p.id === editingPartId)?.order
          : parts.length + 1,
        titleArabic: newPartTitleAr.trim(),
        titleEnglish: newPartTitleEn.trim() || newPartTitleAr.trim(),
        startBayt: newPartStartBayt,
        endBayt: newPartEndBayt,
        sourceAttribution: 'Awaiting authorized Sheikh Okasha Kameny studio recording upload'
      });
      setNewPartTitleAr('');
      setNewPartTitleEn('');
      setEditingPartId(null);
      setShowAddPart(false);
      await loadSyncState();
      onFlashMessage(editingPartId ? 'Audio part updated.' : 'Audio part created.');
    } catch (err: any) {
      onFlashMessage(`Failed to save part: ${err.message}`);
    }
  };

  const getRowTiming = (baytNum: number) => {
    const draft = drafts[baytNum];
    if (draft) {
      return {
        start: draft.audioStart,
        end: draft.audioEnd,
        dirty: !!draft.dirty,
        clear: !!draft.clear
      };
    }
    const saved = timestamps[String(baytNum)];
    if (saved) {
      return {
        start: String(saved.audioStart),
        end: String(saved.audioEnd),
        dirty: false,
        clear: false
      };
    }
    return { start: '', end: '', dirty: false, clear: false };
  };

  const setBaytDraft = (baytNum: number, patch: Partial<DraftTimestamp>) => {
    setDrafts((prev) => {
      const current = prev[baytNum] || {
        audioStart: timestamps[String(baytNum)]
          ? String(timestamps[String(baytNum)].audioStart)
          : '',
        audioEnd: timestamps[String(baytNum)] ? String(timestamps[String(baytNum)].audioEnd) : ''
      };
      return {
        ...prev,
        [baytNum]: {
          ...current,
          ...patch,
          dirty: true
        }
      };
    });
  };

  const markStartAtCurrentTime = () => {
    const t = Math.round(currentTime * 100) / 100;
    setBaytDraft(cursorBaytNum, { audioStart: String(t), clear: false });
  };

  const markEndAndAdvance = () => {
    const t = Math.round(currentTime * 100) / 100;
    const curTiming = getRowTiming(cursorBaytNum);
    const startVal = curTiming.start !== '' ? curTiming.start : '0';
    setBaytDraft(cursorBaytNum, {
      audioStart: startVal,
      audioEnd: String(t),
      clear: false
    });
    if (selectedPart && cursorBaytNum < selectedPart.endBayt) {
      const nextNum = cursorBaytNum + 1;
      setBaytDraft(nextNum, { audioStart: String(t), clear: false });
      setCursorBaytNum(nextNum);
    }
  };

  const handleSaveDirtyTimestamps = async () => {
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
          recordingId: selectedPartKind.recordingId || selectedYoutubeId,
          audioPartId: selectedPart.id,
          audioStart: parseFloat(d.audioStart),
          audioEnd: parseFloat(d.audioEnd)
        };
      });

    if (dirtyEntries.length === 0) {
      onFlashMessage('No unsaved timestamp edits.');
      return;
    }

    setIsSavingTimestamps(true);
    try {
      const res = await saveShatibiyyahTimestamps(dirtyEntries);
      setTimestamps(res.timestamps || {});
      setDrafts({});
      onFlashMessage(`Saved ${res.updatedCount} verified Bayt timestamps.`);
    } catch (err: any) {
      onFlashMessage(`Failed to save timestamps: ${err.message}`);
    } finally {
      setIsSavingTimestamps(false);
    }
  };

  const handleBulkImportSubmit = async () => {
    if (!bulkJsonInput.trim() || !selectedPart) return;
    try {
      const trimmed = bulkJsonInput.trim();
      let entries: Array<{
        baytNumber: number;
        audioPartId: string;
        audioStart: number;
        audioEnd: number;
      }> = [];

      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        const list = Array.isArray(parsed) ? parsed : parsed.entries || [];
        entries = list.map((item: any) => ({
          baytNumber: Number(item.baytNumber ?? item.bayt),
          audioPartId: String(item.audioPartId || selectedPart.id),
          audioStart: Number(item.audioStart ?? item.start),
          audioEnd: Number(item.audioEnd ?? item.end)
        }));
      } else {
        // Support CSV lines: baytNumber,audioStart,audioEnd
        entries = trimmed
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('#') && !line.toLowerCase().startsWith('bayt'))
          .map((line) => {
            const cols = line.split(/[,\t;]+/).map((s) => s.trim());
            return {
              baytNumber: Number(cols[0]),
              audioPartId: cols[3] || selectedPart.id,
              audioStart: Number(cols[1]),
              audioEnd: Number(cols[2])
            };
          });
      }

      if (entries.length === 0) {
        onFlashMessage('No valid timestamp rows found in input.');
        return;
      }

      const res = await saveShatibiyyahTimestamps(entries);
      setTimestamps(res.timestamps || {});
      setShowBulkImport(false);
      setBulkJsonInput('');
      onFlashMessage(`Imported & verified ${res.updatedCount} Bayt timestamps.`);
    } catch (err: any) {
      onFlashMessage(`Bulk import error: ${err.message}`);
    }
  };

  const handleExportTimestamps = () => {
    const list = Object.values(timestamps).sort((a, b) => a.baytNumber - b.baytNumber);
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shatibiyyah_verified_timestamps.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const connectedCount = parts.filter((p) => {
    const k = getPartPlaybackKind(p);
    return p.hasAudio && k.sourceType !== 'none';
  }).length;
  const verifiedTimestampCount = missingSummary.verifiedCount;
  const dirtyCount = Object.values(drafts).filter((d) => d.dirty).length;

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '00:00.0';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const tenths = Math.floor((secs * 10) % 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`;
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} preload="metadata" />

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold uppercase text-slate-400">Verified Matn Text</div>
          <div className="text-2xl font-black text-white tabular-nums">1,173 Bayts</div>
          <div className="text-xs text-emerald-400">Az-Zu&apos;bi / Dar al-Huda (94 Pages · 79 Sections)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold uppercase text-slate-400">
            Sheikh Okasha Kameny Audio
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {connectedCount} / {parts.length || 11} Parts
          </div>
          <div className={`text-xs ${connectedCount > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {connectedCount === 0
              ? 'No audio/YouTube source linked — zero fake substitutes'
              : `YouTube Embed (${SHATIBIYYAH_YOUTUBE_VIDEO_ID}) / authorized streams active`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold uppercase text-slate-400">Verified Bayt Sync</div>
          <div className="text-2xl font-black text-white tabular-nums">
            {verifiedTimestampCount} / 1,173
          </div>
          <div className="text-xs text-slate-400">
            {verifiedTimestampCount === 0
              ? `Missing: ${missingSummary.missingCount} Bayts (${missingSummary.missingRangesLabel})`
              : `${missingSummary.percentComplete}% synchronized · Missing: ${missingSummary.missingCount}`}
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setSubMode('parts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              subMode === 'parts'
                ? 'bg-emerald-600 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audio &amp; YouTube Sources ({connectedCount}/{parts.length || 11})
          </button>
          <button
            onClick={() => setSubMode('sync')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              subMode === 'sync'
                ? 'bg-emerald-600 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bayt Timestamp Synchronizer ({verifiedTimestampCount}/1173)
          </button>
        </div>

        {subMode === 'parts' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleConfigureSingleFullBookPart}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
              title="Set Part #1 range to 1–1173 if uploading a single full-book audio file"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Single-File Mode (1–1173)</span>
            </button>

            <button
              onClick={() => {
                setEditingPartId(null);
                setNewPartTitleAr('');
                setNewPartTitleEn('');
                setShowAddPart((v) => !v);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Part</span>
            </button>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* SUB-MODE 1: AUDIO PARTS UPLOAD MANAGER */}
      {/* ================================================================= */}
      {subMode === 'parts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white">
                  Strict Audio Authenticity Rule — Sheikh Okasha Kameny (الشيخ عكاشة كميني)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Upload either one full-book recording (using Single-File Mode above) or separate
                  part recordings of Sheikh Okasha Kameny. Every Bayt maps cleanly via verified
                  timestamps without duplicating audio files.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Source Attribution / License Note
                </label>
                <input
                  type="text"
                  value={attributionInput}
                  onChange={(e) => setAttributionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  placeholder="e.g. Official Al-Hirz Institute authorized MP3"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer pt-4 sm:pt-5">
                <input
                  type="checkbox"
                  checked={rightsConfirmed}
                  onChange={(e) => setRightsConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>Confirm authentic Sheikh Okasha Kameny audio &amp; usage rights</span>
              </label>
            </div>
          </div>

          {showAddPart && (
            <form
              onSubmit={handleSavePartForm}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-white">
                  {editingPartId ? `Edit Audio Part (${editingPartId})` : 'Add Audio Part'}
                </div>

                <select
                  value={selectedBabPreset}
                  onChange={(e) => {
                    const babId = e.target.value;
                    setSelectedBabPreset(babId);
                    const bab = SHATIBIYYAH_ABWAB.find((b) => b.id === babId);
                    if (bab) {
                      setNewPartTitleAr(bab.titleArabic);
                      setNewPartTitleEn(bab.titleEnglish || bab.titleArabic);
                      setNewPartStartBayt(bab.baytRange.start);
                      setNewPartEndBayt(bab.baytRange.end);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 max-w-xs"
                >
                  <option value="">Assign from Chapter (Bab)...</option>
                  {SHATIBIYYAH_ABWAB.map((bab) => (
                    <option key={bab.id} value={bab.id}>
                      {bab.number}. {bab.titleArabic} ({bab.baytRange.start}–{bab.baytRange.end})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newPartTitleAr}
                  onChange={(e) => setNewPartTitleAr(e.target.value)}
                  placeholder="Arabic Title"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  dir="rtl"
                />
                <input
                  type="text"
                  value={newPartTitleEn}
                  onChange={(e) => setNewPartTitleEn(e.target.value)}
                  placeholder="English Title"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="number"
                  min={1}
                  max={1173}
                  value={newPartStartBayt}
                  onChange={(e) => setNewPartStartBayt(Number(e.target.value))}
                  placeholder="Start Bayt"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="number"
                  min={1}
                  max={1173}
                  value={newPartEndBayt}
                  onChange={(e) => setNewPartEndBayt(Number(e.target.value))}
                  placeholder="End Bayt"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPart(false);
                    setEditingPartId(null);
                    setSelectedBabPreset('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-slate-950 font-bold text-xs"
                >
                  Save Part
                </button>
              </div>
            </form>
          )}

          {/* Live 7-Check Part Diagnostics Report Panel */}
          {diagReport && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>
                    Audio Diagnostics: {diagReport.partTitle} (Bayt #{diagReport.baytNumber})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      diagReport.overallPass
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {diagReport.overallPass ? 'ALL PASS' : diagReport.primaryErrorCode}
                  </span>
                </div>
                <button
                  onClick={() => setDiagReport(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {diagReport.checks.map((chk) => (
                  <div
                    key={chk.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {chk.status === 'pass' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : chk.status === 'fail' ? (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {chk.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {chk.errorCode || chk.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-slate-400">{chk.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
              Loading Ash-Shatibiyyah audio parts...
            </div>
          ) : (
            <div className="space-y-2.5">
              {parts.map((part) => {
                const isUploading = uploadingPartId === part.id;
                const kind = getPartPlaybackKind(part);
                const isYoutubePart = kind.sourceType === 'youtube';
                const isThisPlaying = playingPartId === part.id && isPlaying;
                const syncedInPart = Object.values(timestamps).filter(
                  (ts) => ts.baytNumber >= part.startBayt && ts.baytNumber <= part.endBayt
                ).length;
                const totalInPart = part.endBayt - part.startBayt + 1;

                return (
                  <div
                    key={part.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-slate-400">#{part.order}</span>
                          <span className="font-bold text-white font-arabic text-sm">
                            {part.titleArabic}
                          </span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300">{part.titleEnglish}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 tabular-nums">
                          <span>
                            Abyat {part.startBayt} – {part.endBayt} ({totalInPart} verses)
                          </span>
                          <span>·</span>
                          <span>
                            Synced: {syncedInPart} / {totalInPart}
                          </span>
                          {part.hasAudio && isYoutubePart ? (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <Youtube className="w-3.5 h-3.5 text-red-400" />
                                YouTube Embed ({kind.youtubeVideoId})
                              </span>
                            </>
                          ) : part.hasAudio ? (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Audio Uploaded ({(part.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                                {part.durationSeconds > 0
                                  ? ` · ${formatTime(part.durationSeconds)}`
                                  : ''}
                                )
                              </span>
                            </>
                          ) : (
                            <>
                              <span>·</span>
                              <span className="text-amber-400 font-semibold">
                                Missing Recording
                              </span>
                            </>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 truncate">
                          Source: {part.sourceAttribution}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRunPartDiagnostics(part)}
                          disabled={diagRunningPartId === part.id}
                          className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs border border-slate-700 flex items-center gap-1"
                          title="Run 7-point audio & timestamp diagnostics"
                        >
                          {diagRunningPartId === part.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Activity className="w-3.5 h-3.5" />
                          )}
                          <span>Diagnose</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingPartId(part.id);
                            setNewPartTitleAr(part.titleArabic);
                            setNewPartTitleEn(part.titleEnglish);
                            setNewPartStartBayt(part.startBayt);
                            setNewPartEndBayt(part.endBayt);
                            setShowAddPart(true);
                          }}
                          className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                        >
                          Edit Range
                        </button>

                        <button
                          onClick={() => {
                            setYtLinkPartId((prev) => (prev === part.id ? null : part.id));
                            setYtLinkInput(part.youtubeUrl || part.youtubeVideoId || '');
                          }}
                          className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-300 text-xs border border-slate-700 flex items-center gap-1"
                          title="Link official YouTube video URL or ID for this part"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>Link YouTube</span>
                        </button>

                        <button
                          onClick={() =>
                            setUrlImportPartId((prev) => (prev === part.id ? null : part.id))
                          }
                          className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center gap-1"
                          title="Import verified authorized remote audio URL"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Import URL</span>
                        </button>

                        {part.hasAudio && (part.audioUrl || isYoutubePart) && (
                          <>
                            {!isYoutubePart && (
                              <button
                                onClick={() => togglePlayPart(part)}
                                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                              >
                                {isThisPlaying ? (
                                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                                <span>{isThisPlaying ? 'Pause' : 'Test Play'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedPartId(part.id);
                                setSubMode('sync');
                                if (!isYoutubePart) loadAudioForPart(part, false);
                              }}
                              className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 text-xs font-bold flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Sync Bayts</span>
                            </button>

                            <button
                              onClick={() => handleDeleteAudio(part)}
                              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/40"
                              title="Remove uploaded file or reset source"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <label
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                            isUploading
                              ? 'bg-slate-800 text-slate-400 cursor-wait'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploading
                              ? 'Uploading...'
                              : part.hasAudio && !isYoutubePart
                              ? 'Replace Audio'
                              : 'Upload MP3 / M4A'}
                          </span>
                          <input
                            type="file"
                            accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
                            disabled={isUploading}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload(part, f);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {ytLinkPartId === part.id && (
                      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={ytLinkInput}
                          onChange={(e) => setYtLinkInput(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=Cx76SdfINxU"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => handleLinkYoutubeForPart(part)}
                          disabled={isLinkingYoutube}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold disabled:opacity-50 whitespace-nowrap"
                        >
                          {isLinkingYoutube ? 'Verifying via YouTube...' : 'Verify & Link YouTube'}
                        </button>
                      </div>
                    )}

                    {urlImportPartId === part.id && (
                      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="url"
                          value={remoteAudioUrl}
                          onChange={(e) => setRemoteAudioUrl(e.target.value)}
                          placeholder="https://authorized-archive.example/okasha-shatibiyyah-part1.mp3"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => handleImportAudioUrl(part)}
                          disabled={isImportingUrl}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold disabled:opacity-50 whitespace-nowrap"
                        >
                          {isImportingUrl ? 'Verifying & Importing...' : 'Verify & Import Audio'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-MODE 2: BAYT TIMESTAMP SYNCHRONIZER */}
      {/* ================================================================= */}
      {subMode === 'sync' && selectedPart && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <label className="text-xs font-bold text-slate-400 shrink-0">Part:</label>
                <select
                  value={selectedPart.id}
                  onChange={(e) => {
                    const next = parts.find((p) => p.id === e.target.value);
                    if (next) {
                      setSelectedPartId(next.id);
                      if (next.hasAudio) loadAudioForPart(next, false);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white max-w-md truncate"
                >
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.order} · {p.titleArabic} ({p.startBayt}–{p.endBayt}){' '}
                      {p.hasAudio ? '[Audio Ready]' : '[No Audio]'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsModalEditorOpen(true)}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Full Timestamp Modal</span>
                </button>

                <button
                  onClick={() => setShowBulkImport((v) => !v)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Import JSON/CSV</span>
                </button>

                {verifiedTimestampCount > 0 && (
                  <button
                    onClick={handleExportTimestamps}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                )}

                {dirtyCount > 0 && (
                  <button
                    onClick={() => setDrafts({})}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discard ({dirtyCount})</span>
                  </button>
                )}

                <button
                  onClick={handleSaveDirtyTimestamps}
                  disabled={isSavingTimestamps || dirtyCount === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    dirtyCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {isSavingTimestamps
                      ? 'Saving...'
                      : `Save Timestamps (${dirtyCount} pending)`}
                  </span>
                </button>
              </div>
            </div>

            {showBulkImport && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">
                  Bulk Import Verified Timestamps (JSON array or CSV lines:{' '}
                  <code className="text-emerald-400">baytNumber,audioStart,audioEnd</code>)
                </div>
                <textarea
                  rows={4}
                  value={bulkJsonInput}
                  onChange={(e) => setBulkJsonInput(e.target.value)}
                  placeholder={'1,0.0,6.4\n2,6.4,12.8'}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowBulkImport(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImportSubmit}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-slate-950 font-bold text-xs"
                  >
                    Validate &amp; Save
                  </button>
                </div>
              </div>
            )}

            {!selectedPart.hasAudio ? (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-3">
                <span>
                  No YouTube video or uploaded Sheikh Okasha Kameny audio linked yet for this part.
                </span>
                <button
                  onClick={() => setSubMode('parts')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap"
                >
                  Configure Source
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                {isSelectedYoutube && (
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-3 items-center pb-2 border-b border-slate-800">
                    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-slate-800">
                      <div ref={ytContainerRef} className="w-full h-full" />
                      {!ytReady && !ytError && (
                        <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center gap-1.5 text-xs text-slate-300 pointer-events-none">
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Loading YouTube...</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Youtube className="w-4 h-4 text-red-500" />
                        <span>Official YouTube Embed Active: {selectedYoutubeId}</span>
                      </div>
                      <p className="text-slate-400">
                        Play Sheikh Okasha Kameny&apos;s recording above and click &ldquo;Set Bayt Start&rdquo; /
                        &ldquo;End &amp; Next&rdquo; as each Bayt begins and ends.
                      </p>
                      {ytError && <p className="text-red-400">{ytError}</p>}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlayPart(selectedPart)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      {playingPartId === selectedPart.id && isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {playingPartId === selectedPart.id && isPlaying ? 'Pause' : 'Play'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        const target = Math.max(0, currentTime - 2);
                        loadAudioForPart(selectedPart, false, target);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono"
                    >
                      -2s
                    </button>
                    <button
                      onClick={() => {
                        const target = currentTime + 2;
                        loadAudioForPart(selectedPart, false, target);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono"
                    >
                      +2s
                    </button>

                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1.0x</option>
                      <option value="1.25">1.25x</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold tabular-nums px-2">
                      {formatTime(currentTime)} /{' '}
                      {formatTime(duration || selectedPart.durationSeconds)}
                    </span>

                    <button
                      onClick={markStartAtCurrentTime}
                      className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                    >
                      Set Bayt #{cursorBaytNum} Start ({currentTime.toFixed(2)}s)
                    </button>

                    <button
                      onClick={markEndAndAdvance}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <span>End #{cursorBaytNum} &amp; Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={duration || selectedPart.durationSeconds || 3600}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    loadAudioForPart(selectedPart, false, val);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="max-h-[540px] overflow-y-auto divide-y divide-slate-800">
              {partAbyat.map((bayt) => {
                const timing = getRowTiming(bayt.baytNumber);
                const isCursor = cursorBaytNum === bayt.baytNumber;
                const isSaved = !!timestamps[String(bayt.baytNumber)] && !timing.clear;

                return (
                  <div
                    key={bayt.id}
                    onClick={() => setCursorBaytNum(bayt.baytNumber)}
                    className={`p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isCursor ? 'bg-emerald-950/30' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono font-bold tabular-nums shrink-0 ${
                          isCursor
                            ? 'bg-emerald-500 text-slate-950'
                            : isSaved
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{bayt.baytNumber}
                      </span>

                      <div
                        className="min-w-0 flex-1 text-right font-arabic text-sm text-white leading-relaxed"
                        dir="rtl"
                      >
                        <span>{bayt.shatrA}</span>
                        <span className="text-amber-400 mx-2">۞</span>
                        <span>{bayt.shatrB}</span>
                      </div>
                    </div>

                    <div
                      className="flex flex-wrap items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">Start:</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={timing.start}
                          placeholder="sec"
                          onChange={(e) =>
                            setBaytDraft(bayt.baytNumber, {
                              audioStart: e.target.value,
                              clear: false
                            })
                          }
                          className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono tabular-nums"
                        />
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">End:</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={timing.end}
                          placeholder="sec"
                          onChange={(e) =>
                            setBaytDraft(bayt.baytNumber, {
                              audioEnd: e.target.value,
                              clear: false
                            })
                          }
                          className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono tabular-nums"
                        />
                      </div>

                      {selectedPart.hasAudio && timing.start !== '' && (
                        <button
                          onClick={() => {
                            const startSec = Math.max(0, parseFloat(timing.start) || 0);
                            loadAudioForPart(selectedPart, true, startSec);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                          title="Jump audio to this Bayt start"
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
                          title="Clear timestamp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {timing.dirty && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase">
                          Edited
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <ShatibiyyahTimestampEditor
        isOpen={isModalEditorOpen}
        onClose={() => setIsModalEditorOpen(false)}
        audioParts={parts}
        verifiedTimestamps={timestamps}
        initialBaytNumber={cursorBaytNum}
        initialPartId={selectedPart?.id}
        onTimestampsUpdated={(next) => {
          setTimestamps(next);
          onFlashMessage(`Updated timestamps (${Object.keys(next).length}/1173).`);
        }}
      />
    </div>
  );
};

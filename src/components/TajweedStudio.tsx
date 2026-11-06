import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Volume2, 
  Sliders, 
  Layers,
  History,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Check,
  RefreshCw,
  Trash2,
  Share2,
  Info,
  ShieldCheck,
  Flame,
  VolumeX,
  X,
  FastForward,
  Rewind,
  Repeat,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TAJWEED_RULES, TajweedRuleDetail } from '../data/tajweedRules';
import { Reciter, Ayah, SurahMeta } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { fetchSurahVerses } from '../services/quranApi';
import { 
  VERSE_BY_VERSE_RECITERS, 
  getVerseAudioUrl, 
  getWordAudioUrl,
  RecitationAnalysisResult, 
  TajweedIssue,
  extractTajweedPointsFromAyah,
  getBenchmarkDurationForAyah,
  evaluateRecitationAlgorithmic
} from '../services/tajweedAnalysisService';

interface TajweedStudioProps {
  currentReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  preselectedTarget?: { surahId: number; ayahNumber: number } | null;
  onProgressUpdate: () => void;
}

interface SavedPracticeSession {
  id: string;
  surahId: number;
  ayahNumber: number;
  surahName: string;
  date: string;
  wordsRecognizedCount: number;
  wordsNeedingAttentionCount: number;
  confidence: string;
  method: string;
  durationSeconds: number;
  mistakesCount: number;
}

export const TajweedStudio: React.FC<TajweedStudioProps> = ({
  currentReciter,
  onSelectReciter,
  preselectedTarget,
  onProgressUpdate
}) => {
  // Navigation View Tab: 'studio' | 'report' | 'practice_history' | 'rules_guide'
  const [activeView, setActiveView] = useState<'studio' | 'report' | 'history'>('studio');

  // STEP 1 & 2: SURAH AND AYAH SELECTION
  const [selectedSurahId, setSelectedSurahId] = useState<number>(() => preselectedTarget?.surahId || 1);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState<number>(() => preselectedTarget?.ayahNumber || 1);
  const [selectionMode, setSelectionMode] = useState<'single' | 'range' | 'full_surah'>('single');
  const [rangeEndAyah, setRangeEndAyah] = useState<number>(1);
  const [surahSearchQuery, setSurahSearchQuery] = useState('');
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState(false);

  // Loaded Ayahs for Current Surah
  const [surahAyahs, setSurahAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);

  // STEP 3: BENCHMARK RECITER & VERSE AUDIO PLAYER
  const [selectedVerseReciterId, setSelectedVerseReciterId] = useState<string>('husary_muallim');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isReferencePlaying, setIsReferencePlaying] = useState<boolean>(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number>(1);
  const referenceAudioRef = useRef<HTMLAudioElement | null>(null);

  // STEP 4 & 5: USER AUDIO RECORDING
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPausedRecording, setIsPausedRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedBase64, setRecordedBase64] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(8));
  const [isUserAudioPlaying, setIsUserAudioPlaying] = useState<boolean>(false);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // INDIVIDUAL WORD AUDIO PLAYBACK & TEACHER CORRECTION
  const [playingWordAudioUrl, setPlayingWordAudioUrl] = useState<string | null>(null);
  const wordAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // FOCUSED SINGLE-WORD PRACTICE WORKFLOW
  const [wordPracticeTarget, setWordPracticeTarget] = useState<TajweedIssue | null>(null);
  const [isWordRecording, setIsWordRecording] = useState<boolean>(false);
  const [wordRecordingDuration, setWordRecordingDuration] = useState<number>(0);
  const [wordRecordedAudioUrl, setWordRecordedAudioUrl] = useState<string | null>(null);
  const [isWordUserAudioPlaying, setIsWordUserAudioPlaying] = useState<boolean>(false);
  const wordMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wordAudioChunksRef = useRef<Blob[]>([]);
  const wordRecordingTimerRef = useRef<number | null>(null);
  const wordUserAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // STEP 6, 7 & 8: RECITATION ANALYSIS & ERROR REPORTS
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<RecitationAnalysisResult | null>(null);
  const [activeHighlightedWordIdx, setActiveHighlightedWordIdx] = useState<number | null>(null);
  const [selectedIssueForPractice, setSelectedIssueForPractice] = useState<TajweedIssue | null>(null);

  // STEP 9 & 10: ATTEMPT 2 (COMPARISON WORKFLOW)
  const [previousAttemptAnalysis, setPreviousAttemptAnalysis] = useState<RecitationAnalysisResult | null>(null);
  const [practiceAttemptCount, setPracticeAttemptCount] = useState<number>(1);

  // PRACTICE HISTORY
  const [savedSessions, setSavedSessions] = useState<SavedPracticeSession[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_tajweed_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // MediaRecorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const selectedSurahMeta = getSurahById(selectedSurahId) || SURAHS[0];
  const selectedVerseReciter = VERSE_BY_VERSE_RECITERS.find(r => r.id === selectedVerseReciterId) || VERSE_BY_VERSE_RECITERS[0];

  // Load verses of the selected Surah
  useEffect(() => {
    let isMounted = true;
    setIsLoadingAyahs(true);

    fetchSurahVerses(selectedSurahId).then((fetched) => {
      if (isMounted) {
        setSurahAyahs(fetched);
        setIsLoadingAyahs(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahId]);

  // Handle preselected targets from reader
  useEffect(() => {
    if (preselectedTarget) {
      setSelectedSurahId(preselectedTarget.surahId);
      setSelectedAyahNumber(preselectedTarget.ayahNumber);
      setRangeEndAyah(preselectedTarget.ayahNumber);
      setSelectionMode('single');
    }
  }, [preselectedTarget]);

  // Clean up audio elements on unmount
  useEffect(() => {
    return () => {
      if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
        referenceAudioRef.current.src = '';
      }
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current.src = '';
      }
      if (wordAudioPlayerRef.current) {
        wordAudioPlayerRef.current.pause();
        wordAudioPlayerRef.current.src = '';
      }
      if (wordUserAudioPlayerRef.current) {
        wordUserAudioPlayerRef.current.pause();
        wordUserAudioPlayerRef.current.src = '';
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (wordRecordingTimerRef.current) clearInterval(wordRecordingTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute selected Ayah text
  const currentAyahObj = useMemo(() => {
    return surahAyahs.find(a => a.numberInSurah === selectedAyahNumber) || surahAyahs[0];
  }, [surahAyahs, selectedAyahNumber]);

  // Compute range of selected Ayahs if range mode is on
  const selectedAyahsList = useMemo(() => {
    if (selectionMode === 'single') {
      return currentAyahObj ? [currentAyahObj] : [];
    }
    if (selectionMode === 'full_surah') {
      return surahAyahs;
    }
    const start = Math.min(selectedAyahNumber, rangeEndAyah);
    const end = Math.max(selectedAyahNumber, rangeEndAyah);
    return surahAyahs.filter(a => a.numberInSurah >= start && a.numberInSurah <= end);
  }, [selectionMode, currentAyahObj, surahAyahs, selectedAyahNumber, rangeEndAyah]);

  // =========================================================================
  // STEP 3: REFERENCE AUDIO PLAYBACK FOR EXACT AYAH
  // =========================================================================
  const playReferenceAyah = (ayahNum: number) => {
    const audioUrl = getVerseAudioUrl(selectedVerseReciter.folder, selectedSurahId, ayahNum);
    setCurrentPlayingAyah(ayahNum);

    if (!referenceAudioRef.current) {
      referenceAudioRef.current = new Audio(audioUrl);
    } else {
      referenceAudioRef.current.src = audioUrl;
    }

    const audio = referenceAudioRef.current;
    audio.playbackRate = playbackRate;

    audio.onended = () => {
      if (isLooping && selectionMode === 'single') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      // If in range or full surah mode, advance to next Ayah
      if (selectionMode !== 'single') {
        const nextAyah = ayahNum + 1;
        const maxAyah = selectionMode === 'full_surah' ? selectedSurahMeta.versesCount : Math.max(selectedAyahNumber, rangeEndAyah);
        if (nextAyah <= maxAyah) {
          playReferenceAyah(nextAyah);
          return;
        }
      }

      setIsReferencePlaying(false);
    };

    audio.onerror = () => {
      console.warn(`Verse audio failed for ${selectedSurahId}:${ayahNum}, falling back to Alafasy.`);
      audio.src = getVerseAudioUrl('Alafasy_128kbps', selectedSurahId, ayahNum);
      audio.play().catch(e => console.warn('Fallback play failed:', e));
    };

    audio.play().then(() => {
      setIsReferencePlaying(true);
    }).catch(err => {
      console.warn('Playback error:', err);
      setIsReferencePlaying(false);
    });
  };

  const handleToggleReferencePlay = () => {
    if (isReferencePlaying) {
      if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
      }
      setIsReferencePlaying(false);
    } else {
      playReferenceAyah(selectedAyahNumber);
    }
  };

  const handleChangeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (referenceAudioRef.current) {
      referenceAudioRef.current.playbackRate = rate;
    }
  };

  // =========================================================================
  // STEP 5: REAL MICROPHONE VOICE RECORDING
  // =========================================================================
  const handleStartRecording = async () => {
    setMicPermissionDenied(false);
    audioChunksRef.current = [];
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setRecordedBase64(null);
    setRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateBars = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const sampled: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 20));
        for (let i = 0; i < 20; i++) {
          const val = dataArray[i * step] || 0;
          sampled.push(Math.max(6, Math.min(100, Math.round((val / 255) * 100))));
        }
        setAudioLevels(sampled);
        animFrameRef.current = requestAnimationFrame(updateBars);
      };
      animFrameRef.current = requestAnimationFrame(updateBars);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
      
      const mediaRecorder = mimeType 
        ? new MediaRecorder(stream, { mimeType }) 
        : new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlob(audioBlob);
        setRecordedAudioUrl(url);

        // Convert Blob to Base64 for server-side Multimodal analysis
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setRecordedBase64(base64);
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach(t => t.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPausedRecording(false);

      const startTime = Date.now();
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((Date.now() - startTime) / 1000);
      }, 100);

    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setMicPermissionDenied(true);
      setIsRecording(false);
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPausedRecording(true);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPausedRecording(false);
      const resumedTime = Date.now() - (recordingDuration * 1000);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((Date.now() - resumedTime) / 1000);
      }, 100);
    }
  };

  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPausedRecording(false);
  };

  const handleDeleteRecording = () => {
    if (isUserAudioPlaying && userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      setIsUserAudioPlaying(false);
    }
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setRecordedBase64(null);
    setRecordingDuration(0);
    setAnalysisResult(null);
  };

  const handleToggleUserAudioPlay = () => {
    if (!recordedAudioUrl) return;

    if (isUserAudioPlaying) {
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
      }
      setIsUserAudioPlaying(false);
    } else {
      if (!userAudioPlayerRef.current) {
        userAudioPlayerRef.current = new Audio(recordedAudioUrl);
      } else {
        userAudioPlayerRef.current.src = recordedAudioUrl;
      }
      const audio = userAudioPlayerRef.current;
      audio.onended = () => setIsUserAudioPlaying(false);
      audio.play().then(() => setIsUserAudioPlaying(true)).catch(() => setIsUserAudioPlaying(false));
    }
  };

  // =========================================================================
  // SINGLE-WORD AUDIO PLAYBACK & TEACHER CORRECTION (QURAN CDN)
  // =========================================================================
  const handleToggleWordAudio = (url?: string) => {
    if (!url) return;
    if (playingWordAudioUrl === url) {
      if (wordAudioPlayerRef.current) {
        wordAudioPlayerRef.current.pause();
      }
      setPlayingWordAudioUrl(null);
      return;
    }

    if (!wordAudioPlayerRef.current) {
      wordAudioPlayerRef.current = new Audio(url);
    } else {
      wordAudioPlayerRef.current.src = url;
    }
    const audio = wordAudioPlayerRef.current;
    audio.onended = () => setPlayingWordAudioUrl(null);
    audio.onerror = () => setPlayingWordAudioUrl(null);
    audio.play().then(() => {
      setPlayingWordAudioUrl(url);
    }).catch(() => {
      setPlayingWordAudioUrl(null);
    });
  };

  // =========================================================================
  // FOCUSED SINGLE-WORD PRACTICE RECORDER
  // =========================================================================
  const handleOpenWordPractice = (issue: TajweedIssue) => {
    setWordPracticeTarget(issue);
    setWordRecordedAudioUrl(null);
    setWordRecordingDuration(0);
    setIsWordRecording(false);
    setIsWordUserAudioPlaying(false);
  };

  const handleStartWordRecording = async () => {
    wordAudioChunksRef.current = [];
    setWordRecordedAudioUrl(null);
    setWordRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      wordMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) wordAudioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(wordAudioChunksRef.current, { type: mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setWordRecordedAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start(100);
      setIsWordRecording(true);
      const start = Date.now();
      wordRecordingTimerRef.current = window.setInterval(() => {
        setWordRecordingDuration((Date.now() - start) / 1000);
      }, 100);
    } catch (err) {
      console.warn('Word recording mic error:', err);
    }
  };

  const handleStopWordRecording = () => {
    if (wordRecordingTimerRef.current) {
      clearInterval(wordRecordingTimerRef.current);
      wordRecordingTimerRef.current = null;
    }
    if (wordMediaRecorderRef.current && wordMediaRecorderRef.current.state !== 'inactive') {
      wordMediaRecorderRef.current.stop();
    }
    setIsWordRecording(false);
  };

  const handleToggleUserWordAudio = () => {
    if (!wordRecordedAudioUrl) return;
    if (isWordUserAudioPlaying) {
      if (wordUserAudioPlayerRef.current) wordUserAudioPlayerRef.current.pause();
      setIsWordUserAudioPlaying(false);
    } else {
      if (!wordUserAudioPlayerRef.current) {
        wordUserAudioPlayerRef.current = new Audio(wordRecordedAudioUrl);
      } else {
        wordUserAudioPlayerRef.current.src = wordRecordedAudioUrl;
      }
      const audio = wordUserAudioPlayerRef.current;
      audio.onended = () => setIsWordUserAudioPlaying(false);
      audio.play().then(() => setIsWordUserAudioPlaying(true)).catch(() => setIsWordUserAudioPlaying(false));
    }
  };

  const handlePracticeAgainWholeAyah = () => {
    if (analysisResult) {
      setPreviousAttemptAnalysis(analysisResult);
    }
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setRecordedBase64(null);
    setRecordingDuration(0);
    setAnalysisResult(null);

    // Smooth scroll to recorder card
    setTimeout(() => {
      const el = document.getElementById('step-4-recorder-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // =========================================================================
  // STEP 5: CHECK MY RECITATION WITH TEACHER
  // =========================================================================
  const handleAnalyzeRecitation = async () => {
    if (!currentAyahObj) return;
    setIsAnalyzing(true);

    if (analysisResult) {
      setPreviousAttemptAnalysis(analysisResult);
    }

    try {
      const response = await fetch('/api/tajweed/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahId: selectedSurahId,
          ayahNumber: selectedAyahNumber,
          surahName: selectedSurahMeta.nameEnglish,
          textArabic: currentAyahObj.textArabic,
          riwayahId: currentReciter.riwayahId || 'hafs',
          durationSeconds: recordingDuration,
          audioBase64: recordedBase64,
          mimeType: recordedBlob?.type || 'audio/webm'
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis server returned ${response.status}`);
      }

      const result: RecitationAnalysisResult = await response.json();
      setAnalysisResult(result);
      setPracticeAttemptCount(prev => prev + 1);

      // Save to practice session history
      const newSession: SavedPracticeSession = {
        id: 'sess_' + Date.now(),
        surahId: selectedSurahId,
        ayahNumber: selectedAyahNumber,
        surahName: selectedSurahMeta.nameEnglish,
        date: new Date().toISOString(),
        wordsRecognizedCount: result.wordsRecognizedCount,
        wordsNeedingAttentionCount: result.wordsNeedingAttentionCount,
        confidence: result.confidence,
        method: result.analysisMethod,
        durationSeconds: recordingDuration,
        mistakesCount: result.detectedIssues.filter(i => i.status === 'needs_improvement').length
      };

      const updatedHistory = [newSession, ...savedSessions.slice(0, 49)];
      setSavedSessions(updatedHistory);
      try {
        localStorage.setItem('nur_quran_tajweed_sessions', JSON.stringify(updatedHistory));
      } catch (err) {
        console.warn('Failed to save session history:', err);
      }

      onProgressUpdate();

      // Confetti celebratory feedback if zero errors!
      if (result.wordsNeedingAttentionCount === 0 && result.detectedIssues.filter(i => i.status === 'needs_improvement').length === 0) {
        try {
          confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
        } catch {}
      }

    } catch (err) {
      console.warn('Backend analysis request failed, executing deterministic client-side engine:', err);
      // Deterministic client-side evaluation fallback
      const benchmarkSec = getBenchmarkDurationForAyah(
        selectedSurahId, 
        selectedAyahNumber, 
        currentAyahObj.textArabic.split(/\s+/).length
      );
      const fallbackResult = evaluateRecitationAlgorithmic({
        surahId: selectedSurahId,
        ayahNumber: selectedAyahNumber,
        surahName: selectedSurahMeta.nameEnglish,
        textArabic: currentAyahObj.textArabic,
        recordingDurationSeconds: recordingDuration,
        benchmarkDurationSeconds: benchmarkSec,
        riwayahId: currentReciter.riwayahId || 'hafs'
      });
      setAnalysisResult(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter Surahs for Quick Search
  const filteredSurahs = useMemo(() => {
    const q = surahSearchQuery.toLowerCase().trim();
    if (!q) return SURAHS;
    return SURAHS.filter(s => 
      s.id.toString() === q ||
      s.id.toString().startsWith(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.transliteration.toLowerCase().includes(q)
    );
  }, [surahSearchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      {/* View Switcher Tabs: Studio / Detailed Report / Practice History */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          <button
            onClick={() => setActiveView('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'studio'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-600" />
            <span>Practice Studio</span>
          </button>

          {analysisResult && (
            <button
              onClick={() => setActiveView('report')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'report'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Detailed Report ({analysisResult.detectedIssues.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-indigo-500" />
            <span>Practice History ({savedSessions.length})</span>
          </button>
        </div>

        {/* Selected Ayah Pill Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <span>Surah {selectedSurahMeta.id}: {selectedSurahMeta.nameEnglish}</span>
          <span>·</span>
          <span>Ayah {selectedAyahNumber}</span>
          <span>·</span>
          <span>{currentReciter.riwayah}</span>
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: PRACTICE STUDIO
         ===================================================================== */}
      {activeView === 'studio' && (
        <div className="space-y-6">

          {/* =================================================================
              STEP 1 & 2: SURAH AND AYAH SELECTION
             ================================================================= */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>1. Choose a Surah & 2. Choose an Ayah</span>
              </div>

              {/* Selection Mode Selector: Single Ayah, Range, or Full Surah */}
              <div className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setSelectionMode('single')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectionMode === 'single' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Single Ayah
                </button>
                <button
                  onClick={() => {
                    setSelectionMode('range');
                    setRangeEndAyah(Math.min(selectedAyahNumber + 2, selectedSurahMeta.versesCount));
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectionMode === 'range' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Ayah Range
                </button>
                <button
                  onClick={() => setSelectionMode('full_surah')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectionMode === 'full_surah' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Full Surah
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              
              {/* Surah Dropdown Selector with Instant Search */}
              <div className="sm:col-span-6 relative">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  1. Choose a Surah (1 to 114):
                </label>
                <button
                  onClick={() => setIsSurahDropdownOpen(prev => !prev)}
                  className="w-full py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-mono">
                      {selectedSurahMeta.id}
                    </span>
                    <span className="truncate">{selectedSurahMeta.nameEnglish}</span>
                    <span className="font-arabic text-slate-400">({selectedSurahMeta.nameArabic})</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {isSurahDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 max-h-72 flex flex-col space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={surahSearchQuery}
                        onChange={(e) => setSurahSearchQuery(e.target.value)}
                        placeholder="Search Surah by name or number..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        autoFocus
                      />
                    </div>

                    <div className="overflow-y-auto space-y-0.5 max-h-52 pr-1">
                      {filteredSurahs.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedSurahId(s.id);
                            setSelectedAyahNumber(1);
                            setRangeEndAyah(Math.min(3, s.versesCount));
                            setIsSurahDropdownOpen(false);
                            setSurahSearchQuery('');
                            setAnalysisResult(null);
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                            s.id === selectedSurahId 
                              ? 'bg-emerald-700 text-white font-bold' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] opacity-70 font-mono w-4">{s.id}.</span>
                            <span>{s.nameEnglish}</span>
                          </span>
                          <span className="font-arabic text-xs opacity-80">{s.nameArabic}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Exact Ayah Selection */}
              {selectionMode === 'single' && (
                <div className="sm:col-span-6">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    2. Choose an Ayah (Total: {selectedSurahMeta.versesCount} Ayat):
                  </label>
                  <select
                    value={selectedAyahNumber}
                    onChange={(e) => {
                      setSelectedAyahNumber(parseInt(e.target.value, 10));
                      setAnalysisResult(null);
                    }}
                    className="w-full py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                  >
                    {Array.from({ length: selectedSurahMeta.versesCount }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        Ayah {num} of {selectedSurahMeta.versesCount}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Range Ayah Selection */}
              {selectionMode === 'range' && (
                <>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Start Ayah:
                    </label>
                    <select
                      value={selectedAyahNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setSelectedAyahNumber(val);
                        if (rangeEndAyah < val) setRangeEndAyah(val);
                        setAnalysisResult(null);
                      }}
                      className="w-full py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                    >
                      {Array.from({ length: selectedSurahMeta.versesCount }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          Ayah {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      End Ayah:
                    </label>
                    <select
                      value={rangeEndAyah}
                      onChange={(e) => {
                        setRangeEndAyah(parseInt(e.target.value, 10));
                        setAnalysisResult(null);
                      }}
                      className="w-full py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                    >
                      {Array.from({ length: selectedSurahMeta.versesCount }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num} disabled={num < selectedAyahNumber}>
                          Ayah {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Full Surah Mode */}
              {selectionMode === 'full_surah' && (
                <div className="sm:col-span-6 flex items-center pt-5">
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 w-full text-center">
                    All {selectedSurahMeta.versesCount} Ayat selected for sequential recitation practice
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* =================================================================
              STEP 3: LISTEN AND LEARN (REFERENCE AUDIO & RECITER SELECTOR)
             ================================================================= */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>3. Listen and Learn (Single-Click Reference Playback)</span>
              </div>

              {/* Master Benchmark Reciter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Reciter:</span>
                <select
                  value={selectedVerseReciterId}
                  onChange={(e) => {
                    setSelectedVerseReciterId(e.target.value);
                    if (isReferencePlaying && referenceAudioRef.current) {
                      referenceAudioRef.current.pause();
                      setIsReferencePlaying(false);
                    }
                  }}
                  className="py-1 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                >
                  {VERSE_BY_VERSE_RECITERS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reference Player Bar */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 dark:bg-slate-800/60 border border-emerald-500/20 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleReferencePlay}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all shadow-md ${
                    isReferencePlaying
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                  title={isReferencePlaying ? 'Pause Reference' : 'Play Selected Ayah'}
                >
                  {isReferencePlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isReferencePlaying 
                      ? `Playing Surah ${selectedSurahId}, Ayah ${currentPlayingAyah}...`
                      : `Listen to Ayah ${selectedAyahNumber}`}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedVerseReciter.style}
                  </div>
                </div>
              </div>

              {/* Playback Speed & Repeat Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                  {[0.5, 0.75, 1.0, 1.25].map(spd => (
                    <button
                      key={spd}
                      onClick={() => handleChangeRate(spd)}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        playbackRate === spd
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsLooping(prev => !prev)}
                  title="Loop / Repeat Ayah"
                  className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 font-semibold ${
                    isLooping
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Repeat</span>
                </button>
              </div>
            </div>
          </div>

          {/* =================================================================
              ARABIC TEXT OF THE SELECTED AYAH (INTERACTIVE WORD-BY-WORD AUDIO)
             ================================================================= */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-center">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-semibold">Uthmani Text · Surah {selectedSurahMeta.nameEnglish} ({selectedSurahId}:{selectedAyahNumber})</span>
              <span className="text-[11px]">Click any word to hear Sheikh's pronunciation</span>
            </div>

            {isLoadingAyahs ? (
              <div className="py-8 text-slate-400 text-xs animate-pulse">
                Loading verified Quranic Uthmani text...
              </div>
            ) : (
              <div className="space-y-4">
                {selectedAyahsList.map((ayah) => {
                  const words = ayah.textArabic.trim().split(/\s+/);
                  return (
                    <div key={ayah.numberInSurah} className="space-y-3 py-2">
                      <div 
                        className="font-arabic text-2xl sm:text-3xl leading-[2.5] text-slate-900 dark:text-white text-right dir-rtl select-text"
                        dir="rtl"
                      >
                        {words.map((w, wIdx) => {
                          const wordIdx1 = wIdx + 1;
                          const wordAudioUrl = getWordAudioUrl(selectedSurahId, ayah.numberInSurah, wordIdx1);
                          const isWordPlaying = playingWordAudioUrl === wordAudioUrl;
                          const hasIssue = analysisResult?.detectedIssues.find(i => i.wordIndex === wIdx && i.status === 'needs_improvement');
                          const isHighlighted = activeHighlightedWordIdx === wIdx;

                          return (
                            <span 
                              key={wIdx} 
                              className={`inline-flex flex-col items-center px-2 py-1 rounded-xl transition-all mx-1 cursor-pointer select-none group relative ${
                                isWordPlaying
                                  ? 'bg-emerald-100 dark:bg-emerald-900/60 ring-2 ring-emerald-500 scale-105'
                                  : hasIssue
                                  ? 'bg-amber-100/70 dark:bg-amber-950/50 border border-amber-400/80 text-amber-900 dark:text-amber-200'
                                  : isHighlighted
                                  ? 'bg-amber-300 dark:bg-amber-500 text-slate-950 font-bold scale-105 shadow-sm'
                                  : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                              }`}
                              onClick={() => {
                                setActiveHighlightedWordIdx(wIdx === activeHighlightedWordIdx ? null : wIdx);
                                handleToggleWordAudio(wordAudioUrl);
                              }}
                              title={`Word ${wordIdx1}: Click to listen`}
                            >
                              <span>{w}</span>
                              <span className="text-[9px] font-sans font-normal opacity-60 group-hover:opacity-100 text-slate-400">
                                {isWordPlaying ? '🔊' : `${wordIdx1}`}
                              </span>
                            </span>
                          );
                        })}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold mr-2 align-middle">
                          {ayah.numberInSurah}
                        </span>
                      </div>

                      {ayah.translation && (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic text-left">
                          "{ayah.translation}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================================
              STEP 4: RECORD MY RECITATION
             ================================================================= */}
          <div id="step-4-recorder-card" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Mic className="w-4 h-4 text-rose-500" />
                <span>4. Record My Recitation</span>
              </div>

              {recordingDuration > 0 && (
                <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
                  <span>{recordingDuration.toFixed(1)}s</span>
                </div>
              )}
            </div>

            {/* Permission Banner */}
            {micPermissionDenied && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Microphone access was blocked or dismissed.</strong>
                  <div className="text-[11px] mt-0.5">Please allow microphone permissions in your browser address bar to record your voice.</div>
                </div>
              </div>
            )}

            {/* Real-time Waveform Audio Visualizer */}
            {isRecording && (
              <div className="h-16 bg-slate-900 rounded-2xl flex items-center justify-center gap-1.5 px-4 overflow-hidden">
                {audioLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-gradient-to-t from-emerald-500 to-amber-400 rounded-full transition-all duration-75"
                    style={{ height: `${lvl}%` }}
                  />
                ))}
              </div>
            )}

            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>{recordedAudioUrl ? 'Record Again' : 'Start Recording'}</span>
                </button>
              ) : (
                <>
                  {!isPausedRecording ? (
                    <button
                      onClick={handlePauseRecording}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-300"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeRecording}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
                    >
                      Resume
                    </button>
                  )}

                  <button
                    onClick={handleStopRecording}
                    className="py-3 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Recording</span>
                  </button>
                </>
              )}

              {/* Listen to My Recording */}
              {recordedAudioUrl && !isRecording && (
                <>
                  <button
                    onClick={handleToggleUserAudioPlay}
                    className="py-3 px-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-emerald-100"
                  >
                    {isUserAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isUserAudioPlaying ? 'Playing Voice...' : 'Listen to My Recording'}</span>
                  </button>

                  <button
                    onClick={handleDeleteRecording}
                    title="Delete this recording"
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* =================================================================
                STEP 5: CHECK MY RECITATION WITH TEACHER
               ================================================================= */}
            {recordedAudioUrl && !isRecording && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={handleAnalyzeRecitation}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 mx-auto disabled:opacity-50 active:scale-98"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Checking Your Recitation with Teacher...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>Check My Recitation with Teacher (Attempt #{practiceAttemptCount})</span>
                    </>
                  )}
                </button>
                <div className="text-[11px] text-slate-400 mt-2">
                  Checks your pronunciation, Makharij articulation, Madd prolongation, Ghunnah, and Tajweed rules.
                </div>
              </div>
            )}
          </div>

          {/* =================================================================
              STEP 6: MY MISTAKES & HEAR THE CORRECTION
             ================================================================= */}
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-md space-y-6 animate-scale-up">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>6. My Mistakes & Hear the Correction</span>
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Surah {analysisResult.surahName} · Ayah {analysisResult.ayahNumber} · Attempt #{practiceAttemptCount}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    analysisResult.confidence === 'high' 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}>
                    {analysisResult.confidence.toUpperCase()} CONFIDENCE
                  </span>
                </div>
              </div>

              {/* ATTEMPT 1 VS ATTEMPT 2 SIDE-BY-SIDE COMPARISON (IF PREVIOUS ATTEMPT EXISTS) */}
              {previousAttemptAnalysis && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Progress Comparison: Attempt #{practiceAttemptCount - 1} vs Attempt #{practiceAttemptCount}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Side-by-Side Review</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Attempt #{practiceAttemptCount - 1}</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        {previousAttemptAnalysis.wordsNeedingAttentionCount === 0
                          ? 'Flawless Recitation'
                          : `${previousAttemptAnalysis.wordsNeedingAttentionCount} words needed attention`}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {previousAttemptAnalysis.recordingDurationSeconds.toFixed(1)}s · {previousAttemptAnalysis.overallPacingStatus}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Attempt #{practiceAttemptCount} (Current)</div>
                      <div className="font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
                        {analysisResult.wordsNeedingAttentionCount === 0
                          ? '✓ All words accurate!'
                          : `${analysisResult.wordsNeedingAttentionCount} words need attention`}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        {analysisResult.recordingDurationSeconds.toFixed(1)}s · {analysisResult.overallPacingStatus}
                      </div>
                    </div>
                  </div>

                  {analysisResult.wordsNeedingAttentionCount < previousAttemptAnalysis.wordsNeedingAttentionCount && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 pt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Great improvement! You reduced mistakes from {previousAttemptAnalysis.wordsNeedingAttentionCount} to {analysisResult.wordsNeedingAttentionCount}!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Review Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                    {analysisResult.wordsRecognizedCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    Words Recognized
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">
                    {analysisResult.wordsNeedingAttentionCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Words Needing Attention
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-400 font-mono">
                    {analysisResult.detectedIssues.filter(i => i.status === 'needs_improvement').length}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-purple-900 dark:text-purple-200">
                    Rules to Improve
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                    {analysisResult.recordingDurationSeconds.toFixed(1)}s
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Pacing ({analysisResult.overallPacingStatus})
                  </div>
                </div>
              </div>

              {/* INTERACTIVE WORD-BY-WORD AYAH STRIP WITH STATUS BADGES */}
              {currentAyahObj && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Word-by-Word Recitation Accuracy (Tap any word to listen):</span>
                    <span className="text-[11px] text-slate-400">Ayah {currentAyahObj.numberInSurah}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 dir-rtl" dir="rtl">
                    {currentAyahObj.textArabic.trim().split(/\s+/).map((word, wIdx) => {
                      const wordIdx1 = wIdx + 1;
                      const wordAudioUrl = getWordAudioUrl(selectedSurahId, selectedAyahNumber, wordIdx1);
                      const isWordPlaying = playingWordAudioUrl === wordAudioUrl;
                      const issue = analysisResult.detectedIssues.find(i => i.wordIndex === wIdx && i.status === 'needs_improvement');
                      const hasMistake = !!issue;

                      return (
                        <div
                          key={wIdx}
                          onClick={() => handleToggleWordAudio(wordAudioUrl)}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center select-none shadow-xs group ${
                            isWordPlaying
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 ring-2 ring-emerald-500 scale-105'
                              : hasMistake
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 hover:border-amber-500'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                          title={`Word ${wordIdx1}: ${word} - Tap to hear Sheikh`}
                        >
                          <span className="font-arabic text-xl font-bold text-slate-900 dark:text-white">
                            {word}
                          </span>

                          <div className="flex items-center gap-1 mt-1 text-[10px] font-sans font-semibold">
                            {hasMistake ? (
                              <span className="text-amber-700 dark:text-amber-300 flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                <span>Needs Attention</span>
                              </span>
                            ) : (
                              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Correct</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[9px] text-slate-400 mt-0.5 font-sans">
                            {isWordPlaying ? '🔊 Playing' : `Word ${wordIdx1}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CELEBRATION IF ZERO MISTAKES */}
              {analysisResult.wordsNeedingAttentionCount === 0 && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl shadow-md">
                    ✓
                  </div>
                  <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-base">
                    Masha'Allah! Flawless Recitation
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                    All words recognized clearly, pacing matches Murattal benchmarks, and no Tajweed rule infractions were found!
                  </p>
                </div>
              )}

              {/* STRUCTURED ERROR CARDS FOR WORDS THAT NEED ATTENTION */}
              {analysisResult.detectedIssues.filter(i => i.status === 'needs_improvement' || i.status === 'uncertain').length > 0 && (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Words That Need Attention & Specific Corrections:</span>
                    <span className="text-amber-600 font-semibold">
                      {analysisResult.detectedIssues.filter(i => i.status === 'needs_improvement').length} issues detected
                    </span>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.detectedIssues
                      .filter(issue => issue.status === 'needs_improvement' || issue.status === 'uncertain')
                      .map((issue, idx) => {
                        const wordAudioUrl = issue.wordAudioUrl || getWordAudioUrl(selectedSurahId, selectedAyahNumber, issue.wordIndex + 1);
                        const isWordPlaying = playingWordAudioUrl === wordAudioUrl;

                        return (
                          <div
                            key={issue.id || idx}
                            className="p-5 rounded-3xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/20 space-y-3 shadow-xs"
                          >
                            {/* Card Top: Word & Position */}
                            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-200/50 dark:border-amber-800/40 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-arabic text-2xl font-bold text-slate-900 dark:text-white px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800">
                                  {issue.wordArabic}
                                </span>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {issue.ruleName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    <strong>Where it appears:</strong> Ayah {issue.ayahNumber}, {issue.wordPositionInAyah}
                                  </div>
                                </div>
                              </div>

                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Needs Attention</span>
                              </span>
                            </div>

                            {/* Exact Structured Report: What happened & What you should do */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                              
                              {/* What Happened */}
                              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide block">
                                  What Happened:
                                </span>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                  {issue.detectedProblem}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                                  {issue.whatWasDoneIncorrectly}
                                </div>
                              </div>

                              {/* What You Should Do */}
                              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide block">
                                  What You Should Do:
                                </span>
                                <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                                  {issue.howToPronounceCorrectly}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                                  {issue.simpleExplanation}
                                </div>
                              </div>

                            </div>

                            {/* Practice Tip */}
                            <div className="text-xs text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                              <strong className="text-amber-800 dark:text-amber-300">Teacher's Tip:</strong> {issue.practiceExercise}
                            </div>

                            {/* Actions: Listen to Correct Word & Practise This Word Again */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-amber-200/50 dark:border-amber-800/40">
                              
                              {/* Listen to the correct word button */}
                              <button
                                onClick={() => handleToggleWordAudio(wordAudioUrl)}
                                className={`w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                                  isWordPlaying
                                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                              >
                                {isWordPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                                <span>{isWordPlaying ? 'Playing Correct Word...' : 'Listen to the Correct Word'}</span>
                              </button>

                              {/* Practise this word again button */}
                              <button
                                onClick={() => handleOpenWordPractice(issue)}
                                className="w-full sm:w-auto py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                              >
                                <Mic className="w-3.5 h-3.5 text-rose-400" />
                                <span>Practise This Word Again</span>
                              </button>

                            </div>

                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* STEP 7: PRACTISE AGAIN (WHOLE AYAH) & FULL REPORT */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handlePracticeAgainWholeAyah}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Practise Again (Whole Ayah — Attempt #{practiceAttemptCount + 1})</span>
                </button>

                <button
                  onClick={() => setActiveView('report')}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>View All Rules Guide & Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* =====================================================================
          FOCUSED SINGLE-WORD PRACTICE MODAL / CARD (PART 1 STEP 7)
         ===================================================================== */}
      {wordPracticeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setWordPracticeTarget(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                Single-Word Pronunciation Practice
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Practise: {wordPracticeTarget.wordArabic}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {wordPracticeTarget.wordPositionInAyah} · Rule: {wordPracticeTarget.ruleName}
              </p>
            </div>

            {/* Arabic Word Display */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
              <div className="font-arabic text-4xl sm:text-5xl font-black text-emerald-800 dark:text-emerald-300 py-1">
                {wordPracticeTarget.wordArabic}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold max-w-sm mx-auto">
                {wordPracticeTarget.howToPronounceCorrectly}
              </p>
            </div>

            {/* Listen to Sheikh's Master Word Audio */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">1. Listen to Sheikh's Word</div>
                <div className="text-[11px] text-slate-400">Authentic recitation from Quran Audio Masters</div>
              </div>

              <button
                onClick={() => handleToggleWordAudio(wordPracticeTarget.wordAudioUrl)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  playingWordAudioUrl === wordPracticeTarget.wordAudioUrl
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {playingWordAudioUrl === wordPracticeTarget.wordAudioUrl ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Hear Word</span>
                  </>
                )}
              </button>
            </div>

            {/* Word Practice Microphone Recording */}
            <div className="p-4 rounded-2xl bg-rose-50/30 dark:bg-rose-950/20 border border-rose-300/60 dark:border-rose-800/40 space-y-3 text-center">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                2. Record Your Pronunciation of This Word
              </div>

              {wordRecordingDuration > 0 && (
                <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  {wordRecordingDuration.toFixed(1)}s
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                {!isWordRecording ? (
                  <button
                    onClick={handleStartWordRecording}
                    className="py-2.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{wordRecordedAudioUrl ? 'Record Word Again' : 'Record This Word'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopWordRecording}
                    className="py-2.5 px-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {wordRecordedAudioUrl && !isWordRecording && (
                  <button
                    onClick={handleToggleUserWordAudio}
                    className="py-2.5 px-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    {isWordUserAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    <span>{isWordUserAudioPlaying ? 'Playing...' : 'Play My Attempt'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Done button */}
            <div className="pt-2">
              <button
                onClick={() => setWordPracticeTarget(null)}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800"
              >
                I'm Ready · Return to Recitation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: DETAILED ERROR REPORT & PRACTICE CORRECTIONS (PART 2.F & 2.G)
         ===================================================================== */}
      {activeView === 'report' && analysisResult && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Detailed Tajweed Correction Report
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Surah {analysisResult.surahName} (Ayah {analysisResult.ayahNumber}) · Canonical Tajweed Standards
                </p>
              </div>

              <button
                onClick={() => setActiveView('studio')}
                className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                ← Return to Studio
              </button>
            </div>

            {/* Status Legend (Three clearly distinguishable statuses) */}
            <div className="flex items-center gap-3 flex-wrap text-xs font-semibold p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400">Status Legend:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Correct (متقن)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Needs Improvement (يحتاج تدريب)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>Uncertain (غير مؤكد - أعد التسجيل)</span>
              </span>
            </div>

            {/* List of Detailed Issues */}
            <div className="space-y-4 pt-2">
              {analysisResult.detectedIssues.map((issue, idx) => {
                const isNeedsImprovement = issue.status === 'needs_improvement';
                const isUncertain = issue.status === 'uncertain';

                return (
                  <div
                    key={issue.id || idx}
                    className={`p-5 rounded-3xl border transition-all space-y-3 ${
                      isNeedsImprovement
                        ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/20'
                        : isUncertain
                        ? 'border-sky-400/80 bg-sky-50/20 dark:bg-sky-950/20'
                        : 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10'
                    }`}
                  >
                    {/* Header: Word & Rule */}
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-3">
                        <span className="font-arabic text-xl font-bold text-slate-900 dark:text-white px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                          {issue.wordArabic}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {issue.ruleName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Category: {issue.category} · Ayah {issue.ayahNumber}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isNeedsImprovement
                          ? 'bg-amber-500 text-slate-950'
                          : isUncertain
                          ? 'bg-sky-500 text-white'
                          : 'bg-emerald-700 text-white'
                      }`}>
                        {isNeedsImprovement ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Needs Improvement</span>
                          </>
                        ) : isUncertain ? (
                          <>
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Uncertain</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Correct</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Breakdown of the 9 required points */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                        <span className="text-[10px] font-bold text-rose-600 uppercase block">
                          3. Detected Problem & What Was Done Incorrectly
                        </span>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{issue.detectedProblem}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">{issue.whatWasDoneIncorrectly}</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase block">
                          6. How to Pronounce It Correctly
                        </span>
                        <div className="font-semibold text-emerald-800 dark:text-emerald-300">{issue.howToPronounceCorrectly}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">{issue.simpleExplanation}</div>
                      </div>
                    </div>

                    {/* Practice Exercise & Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <strong className="text-amber-700 dark:text-amber-400">Practice Tip:</strong> {issue.practiceExercise}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {/* Play affected word */}
                        <button
                          onClick={() => handleToggleWordAudio(issue.wordAudioUrl || getWordAudioUrl(selectedSurahId, selectedAyahNumber, issue.wordIndex + 1))}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            playingWordAudioUrl === (issue.wordAudioUrl || getWordAudioUrl(selectedSurahId, selectedAyahNumber, issue.wordIndex + 1))
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>
                            {playingWordAudioUrl === (issue.wordAudioUrl || getWordAudioUrl(selectedSurahId, selectedAyahNumber, issue.wordIndex + 1))
                              ? 'Playing...'
                              : 'Listen to Correct Word'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleOpenWordPractice(issue)}
                          className="py-1.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Mic className="w-3.5 h-3.5 text-rose-400" />
                          <span>Practise This Word Again</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          VIEW 3: PRACTICE HISTORY & PROGRESS
         ===================================================================== */}
      {activeView === 'history' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-6 h-6 text-indigo-500" />
                  <span>Tajweed Recitation Practice History</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Privately saved recitation evaluations and improvement logs
                </p>
              </div>

              <button
                onClick={() => setActiveView('studio')}
                className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                ← Back to Studio
              </button>
            </div>

            {savedSessions.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">No practice sessions logged yet.</div>
                <div className="text-[11px] text-slate-400">Select any Ayah in the Studio, record your recitation, and analyze your progress!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {savedSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Surah {sess.surahName} · Ayah {sess.ayahNumber}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{new Date(sess.date).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{sess.durationSeconds.toFixed(1)}s recorded</span>
                        <span>·</span>
                        <span className="capitalize">{sess.confidence} confidence</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {sess.wordsRecognizedCount} words recognized
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sess.mistakesCount === 0 ? '✓ Flawless recitation' : `${sess.mistakesCount} rule corrections`}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedSurahId(sess.surahId);
                          setSelectedAyahNumber(sess.ayahNumber);
                          setActiveView('studio');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold"
                      >
                        Practice Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

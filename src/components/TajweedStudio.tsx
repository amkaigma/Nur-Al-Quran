import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRightLeft, 
  Sliders, 
  Layers,
  History,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Reciter, TajweedPracticeRecord } from '../types/quran';
import { RECITERS, getSurahAudioUrl } from '../data/reciters';
import { TAJWEED_PRACTICE_TARGETS, TajweedPracticeTarget, TAJWEED_RULES } from '../data/tajweedRules';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { saveTajweedRecord, getTajweedHistory } from '../services/storage';

interface TajweedStudioProps {
  currentReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  preselectedTarget?: { surahId: number; ayahNumber: number } | null;
  onProgressUpdate: () => void;
}

export const TajweedStudio: React.FC<TajweedStudioProps> = ({
  currentReciter,
  onSelectReciter,
  preselectedTarget,
  onProgressUpdate
}) => {
  // Practice Target selection
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(0);
  const target: TajweedPracticeTarget = TAJWEED_PRACTICE_TARGETS[selectedTargetIndex] || TAJWEED_PRACTICE_TARGETS[0];

  // Benchmark Sheikh selection
  const [benchmarkReciterId, setBenchmarkReciterId] = useState<string>(() => {
    return currentReciter.id === 'mahmoud-khalil-al-husary' ? currentReciter.id : 'mahmoud-khalil-al-husary';
  });
  const benchmarkReciter = RECITERS.find(r => r.id === benchmarkReciterId) || RECITERS[3]; // default Al-Husary

  // Audio players for Sheikh and User
  const [isSheikhPlaying, setIsSheikhPlaying] = useState<boolean>(false);
  const [isUserAudioPlaying, setIsUserAudioPlaying] = useState<boolean>(false);
  const [abMode, setAbMode] = useState<'sheikh' | 'user'>('sheikh');
  
  const sheikhAudioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Voice recorder hook
  const {
    isRecording,
    recordingDuration,
    recordedAudioUrl,
    audioLevels,
    micPermissionDenied,
    analysis,
    startRecording,
    stopRecording,
    resetRecording
  } = useVoiceRecorder();

  // User self assessment state
  const [selfRating, setSelfRating] = useState<number>(5);
  const [practiceNotes, setPracticeNotes] = useState<string>('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [practiceHistory, setPracticeHistory] = useState<TajweedPracticeRecord[]>(() => getTajweedHistory());
  const [activeTab, setActiveTab] = useState<'practice' | 'history' | 'rules'>('practice');

  // Handle preselected target if passed from reader
  useEffect(() => {
    if (preselectedTarget) {
      const idx = TAJWEED_PRACTICE_TARGETS.findIndex(
        t => t.surahId === preselectedTarget.surahId && t.ayahNumber === preselectedTarget.ayahNumber
      );
      if (idx !== -1) {
        setSelectedTargetIndex(idx);
      }
    }
  }, [preselectedTarget]);

  // Setup Sheikh benchmark audio
  useEffect(() => {
    const audioUrl = getSurahAudioUrl(benchmarkReciter, target.surahId);
    if (!sheikhAudioRef.current) {
      sheikhAudioRef.current = new Audio(audioUrl);
    } else {
      sheikhAudioRef.current.src = audioUrl;
    }

    const audio = sheikhAudioRef.current;
    const handleEnded = () => setIsSheikhPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
    };
  }, [benchmarkReciter, target.surahId]);

  // Setup User audio playback
  useEffect(() => {
    if (recordedAudioUrl) {
      if (!userAudioPlayerRef.current) {
        userAudioPlayerRef.current = new Audio(recordedAudioUrl);
      } else {
        userAudioPlayerRef.current.src = recordedAudioUrl;
      }

      const audio = userAudioPlayerRef.current;
      const handleEnded = () => setIsUserAudioPlaying(false);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.pause();
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [recordedAudioUrl]);

  const togglePlaySheikh = () => {
    if (!sheikhAudioRef.current) return;
    if (isSheikhPlaying) {
      sheikhAudioRef.current.pause();
      setIsSheikhPlaying(false);
    } else {
      if (userAudioPlayerRef.current) userAudioPlayerRef.current.pause();
      setIsUserAudioPlaying(false);
      sheikhAudioRef.current.play().then(() => setIsSheikhPlaying(true)).catch(console.error);
    }
  };

  const togglePlayUserAudio = () => {
    if (!userAudioPlayerRef.current || !recordedAudioUrl) return;
    if (isUserAudioPlaying) {
      userAudioPlayerRef.current.pause();
      setIsUserAudioPlaying(false);
    } else {
      if (sheikhAudioRef.current) sheikhAudioRef.current.pause();
      setIsSheikhPlaying(false);
      userAudioPlayerRef.current.play().then(() => setIsUserAudioPlaying(true)).catch(console.error);
    }
  };

  const handleAbToggle = (mode: 'sheikh' | 'user') => {
    setAbMode(mode);
    if (mode === 'sheikh') {
      if (userAudioPlayerRef.current) userAudioPlayerRef.current.pause();
      setIsUserAudioPlaying(false);
      if (sheikhAudioRef.current) {
        sheikhAudioRef.current.currentTime = 0;
        sheikhAudioRef.current.play().then(() => setIsSheikhPlaying(true)).catch(console.error);
      }
    } else {
      if (sheikhAudioRef.current) sheikhAudioRef.current.pause();
      setIsSheikhPlaying(false);
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.currentTime = 0;
        userAudioPlayerRef.current.play().then(() => setIsUserAudioPlaying(true)).catch(console.error);
      }
    }
  };

  const handleSaveSession = () => {
    if (!analysis) return;
    const record: TajweedPracticeRecord = {
      id: `practice-${Date.now()}`,
      timestamp: Date.now(),
      surahId: target.surahId,
      surahName: target.surahName,
      ayahNumber: target.ayahNumber,
      reciterId: benchmarkReciter.id,
      reciterName: benchmarkReciter.name,
      riwayah: benchmarkReciter.riwayah,
      audioDurationSeconds: Math.round(recordingDuration * 10) / 10,
      alignmentScore: analysis.overallScore,
      breakdown: {
        pacingMatch: analysis.pacingMatch,
        maddElongation: analysis.maddElongation,
        ghunnahTiming: analysis.ghunnahTiming,
        waqfStopTiming: analysis.waqfStopTiming,
        rhymeHarmony: analysis.rhymeHarmony
      },
      notes: practiceNotes || `Practiced ${target.rhymeEnding} alignment with Sheikh ${benchmarkReciter.name}.`,
      selfRating
    };

    const updated = saveTajweedRecord(record);
    setPracticeHistory(updated);
    setIsSaved(true);
    onProgressUpdate();

    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch {
      // safe
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Studio Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        {/* Subtle illuminated manuscript texture */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/tajweed_illumination_1793095242022.jpg"
            alt="Illuminated Quran manuscript page with vocalization marks"
            className="w-full h-full object-cover object-right opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-2">
            <span>Interactive Tajweed Studio</span>
            <span aria-hidden="true">·</span>
            <span>Rhyme & Alignment Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Sheikh Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Tajweed Alignment & Rhyme Studio
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Recite and listen in real time to hear if your Tajweed rhymes and goes in line with the Sheikh’s recitation style. Compare breath pacing, Madd elongation, and Ghunnah resonance side by side.
          </p>

          {/* Sub-navigation tabs */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Studio & Alignment</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Practice History ({practiceHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tajweed Rules Guide</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark */}
        <div className="absolute right-6 -bottom-8 text-slate-800/40 font-arabic text-9xl select-none pointer-events-none hidden md:block">
          تَجْوِيد
        </div>
      </div>

      {activeTab === 'practice' && (
        <div className="space-y-6">
          
          {/* Practice Configuration Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* Target Verse Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Ayah for Tajweed Practice:
              </label>
              <select
                value={selectedTargetIndex}
                onChange={(e) => {
                  setSelectedTargetIndex(Number(e.target.value));
                  resetRecording();
                  setIsSaved(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {TAJWEED_PRACTICE_TARGETS.map((t, idx) => (
                  <option key={idx} value={idx}>
                    Surah {t.surahName} (Ayah {t.ayahNumber}) · Rhyme: {t.rhymeEnding}
                  </option>
                ))}
              </select>
            </div>

            {/* Benchmark Sheikh Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Benchmark Sheikh / Scholar to Match:
              </label>
              <select
                value={benchmarkReciterId}
                onChange={(e) => {
                  setBenchmarkReciterId(e.target.value);
                  resetRecording();
                  setIsSaved(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    Sheikh {r.name} ({r.riwayah} - {r.style})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Target Verse Focus Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">Surah {target.surahName}</span>
                <span aria-hidden="true">·</span>
                <span>Ayah {target.ayahNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 dark:text-amber-400 font-medium">Rhyme Ending: {target.rhymeEnding}</span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Sheikh Style: <strong className="text-slate-800 dark:text-slate-200">{benchmarkReciter.riwayah} ({benchmarkReciter.style})</strong>
              </div>
            </div>

            {/* Large Arabic Uthmani Script */}
            <div 
              className="font-arabic text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 leading-[2.4] text-center font-semibold py-2" 
              dir="rtl"
            >
              {target.arabicText}
            </div>

            {/* Transliteration & English */}
            <div className="text-center space-y-1">
              <div className="text-xs font-medium text-emerald-900 dark:text-emerald-400 italic">
                {target.transliteration}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {target.translation}
              </div>
            </div>

            {/* Key Tajweed Rules for this verse */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 mr-1">Key Tajweed Targets:</span>
                {target.primaryRules.map((rule, idx) => (
                  <span key={idx} className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded text-[11px] font-medium">
                    {rule}
                  </span>
                ))}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic max-w-sm text-right">
                💡 {target.tips}
              </div>
            </div>

          </div>

          {/* Interactive Dual Audio Player & Visualizer Studio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Player 1: Benchmark Sheikh Audio */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Benchmark: Sheikh {benchmarkReciter.name.split(' ')[0]}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {benchmarkReciter.country} · {benchmarkReciter.riwayah}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Gold Standard
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Listen closely to the Sheikh’s breath pacing, how he stops at the Waqf, and the duration of his Madd elongation.
                </p>

                {/* Sheikh Audio Controls */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-lg p-3.5 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={togglePlaySheikh}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
                  >
                    {isSheikhPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isSheikhPlaying ? 'Pause Sheikh' : 'Play Benchmark Audio'}</span>
                  </button>

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Surah {target.surahName}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/50 p-2.5 rounded border border-slate-100 dark:border-slate-800">
                <strong>Pedagogical tip:</strong> Notice how the Sheikh articulates the throat letters and avoids cutting the vowel short.
              </div>
            </div>

            {/* Player 2: User Voice Recorder & Realtime Visualizer */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Your Recitation & Voice Test
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Microphone capture with Tajweed wave analysis
                      </p>
                    </div>
                  </div>

                  {isRecording && (
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                      Recording ({recordingDuration.toFixed(1)}s)
                    </span>
                  )}
                </div>

                {/* Live Real-time Audio Wave Visualizer */}
                <div className="h-16 bg-slate-900 rounded-lg p-2.5 flex items-end justify-center gap-1 mb-4 border border-slate-800">
                  {audioLevels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="w-2 rounded-t transition-all duration-75"
                      style={{
                        height: isRecording ? `${lvl}%` : (recordedAudioUrl ? '30%' : '15%'),
                        backgroundColor: isRecording 
                          ? (lvl > 60 ? '#f59e0b' : '#10b981') 
                          : (recordedAudioUrl ? '#059669' : '#334155')
                      }}
                    />
                  ))}
                </div>

                {/* Recorder Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{recordedAudioUrl ? 'Re-record Recitation' : 'Record Your Voice'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => stopRecording(5.0)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop & Analyze Tajweed</span>
                    </button>
                  )}

                  {recordedAudioUrl && !isRecording && (
                    <button
                      onClick={togglePlayUserAudio}
                      className="py-2 px-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {isUserAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>Hear Your Voice ({recordingDuration.toFixed(1)}s)</span>
                    </button>
                  )}
                </div>

                {micPermissionDenied && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                    Microphone access was denied. Please allow microphone permissions in your browser to record.
                  </p>
                )}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/50 p-2.5 rounded border border-slate-100 dark:border-slate-800">
                <strong>Goal:</strong> Pronounce clearly, hold the {target.rhymeEnding} rhyme, and align your tempo with the Sheikh.
              </div>
            </div>

          </div>

          {/* Step 3: A/B "Rhyme & Alignment" Listening Toggle & Synchronizer */}
          {recordedAudioUrl && (
            <div className="bg-emerald-950 text-white rounded-xl p-5 border border-emerald-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                    <span>A/B Rhyme & Cadence Alignment Test</span>
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Toggle between the Sheikh and your own voice to immediately hear differences in prolongation, melody, and stop timing.
                  </p>
                </div>

                {/* A/B Switcher Buttons */}
                <div className="flex items-center gap-1 bg-emerald-900/80 p-1 rounded-lg border border-emerald-700/60">
                  <button
                    onClick={() => handleAbToggle('sheikh')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      abMode === 'sheikh'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    Listen to Sheikh
                  </button>
                  <button
                    onClick={() => handleAbToggle('user')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      abMode === 'user'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    Listen to Your Voice
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Tajweed Alignment Scorecard & Detailed Feedback */}
          {analysis && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Tajweed Evaluation Matrix</span>
                    <span aria-hidden="true">·</span>
                    <span>Benchmarked against Sheikh {benchmarkReciter.name}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tajweed Harmony & Rhyme Analysis
                  </h3>
                </div>

                {/* Overall Score Badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {analysis.overallScore}%
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Alignment Match
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-600 dark:border-emerald-500 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                    {analysis.overallScore >= 90 ? 'Mumtaz' : 'Jayyid'}
                  </div>
                </div>
              </div>

              {/* 5 Dimensional Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Pacing / Tempo</span>
                    <strong className="text-emerald-800 dark:text-emerald-400">{analysis.pacingMatch}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.pacingMatch}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Breath timing match</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Madd Elongation</span>
                    <strong className="text-emerald-800 dark:text-emerald-400">{analysis.maddElongation}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.maddElongation}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">2, 4, 6 Harakat hold</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Ghunnah Timing</span>
                    <strong className="text-emerald-800 dark:text-emerald-400">{analysis.ghunnahTiming}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.ghunnahTiming}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Nasal resonance (2 counts)</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Waqf / Stop Rhyme</span>
                    <strong className="text-emerald-800 dark:text-emerald-400">{analysis.waqfStopTiming}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.waqfStopTiming}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">{target.rhymeEnding} release</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Tonal Rhyme</span>
                    <strong className="text-emerald-800 dark:text-emerald-400">{analysis.rhymeHarmony}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.rhymeHarmony}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Melodic cadence & flow</p>
                </div>

              </div>

              {/* Feedback Advice */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 rounded-lg p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Scholarly Tajweed Guidance:</span>
                </h4>
                <ul className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1 pl-4 list-disc">
                  {analysis.feedback.map((f, fIdx) => (
                    <li key={fIdx}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Self Assessment & Practice Logging */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Self Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelfRating(star)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${star <= selfRating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                      >
                        <Star className={`w-4 h-4 ${star <= selfRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save to History Button */}
                <button
                  onClick={handleSaveSession}
                  disabled={isSaved}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                    isSaved
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaved ? 'Session Logged in History' : 'Save Session to History'}</span>
                </button>

              </div>

            </div>
          )}

        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Tajweed Practice Log & Improvement Track
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every session where you recited and aligned your Tajweed with a Sheikh is recorded here.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded">
              {practiceHistory.length} Sessions Logged
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {practiceHistory.map((rec) => (
              <div key={rec.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(rec.timestamp).toLocaleDateString()}</span>
                    <span aria-hidden="true">·</span>
                    <span>Surah {rec.surahName} (Ayah {rec.ayahNumber})</span>
                    <span aria-hidden="true">·</span>
                    <span>Sheikh {rec.reciterName}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                    "{rec.notes}"
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Pacing: {rec.breakdown.pacingMatch}%</span>
                    <span>Madd: {rec.breakdown.maddElongation}%</span>
                    <span>Ghunnah: {rec.breakdown.ghunnahTiming}%</span>
                    <span>Stop: {rec.breakdown.waqfStopTiming}%</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{rec.alignmentScore}%</span>
                    <span className="text-[11px] text-slate-400 block">Harmony</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rec.selfRating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Guide Tab */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TAJWEED_RULES.map((rule) => (
            <div key={rule.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{rule.category}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{rule.name}</h3>
                </div>
                <span className="font-arabic text-xl font-bold text-emerald-800 dark:text-emerald-400">{rule.arabicName}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rule.definition}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded text-xs text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/80">
                <strong>Timing & Measure:</strong> {rule.timingRule}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Example:</span>
                {rule.examples.map((ex, i) => (
                  <div key={i} className="bg-emerald-50/50 dark:bg-emerald-950/40 p-2 rounded mb-1 text-slate-800 dark:text-slate-200">
                    <span className="font-arabic text-base font-semibold text-emerald-950 dark:text-emerald-300 block">{ex.verse}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">{ex.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

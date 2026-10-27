import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Mic, 
  Trophy,
  RotateCcw
} from 'lucide-react';
import { ReadingProgress, SurahMeta } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { getReciterById } from '../data/reciters';
import { getTajweedHistory, markSurahCompleted, saveStoredProgress } from '../services/storage';
import { DailyQuranGoal } from './DailyQuranGoal';

interface ProgressTrackerProps {
  progress: ReadingProgress;
  onNavigateToSurah: (surahId: number) => void;
  onNavigateToTajweed: () => void;
  onRefresh: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  onNavigateToSurah,
  onNavigateToTajweed,
  onRefresh
}) => {
  const stoppedSurah = getSurahById(progress.lastStoppedSurahId) || SURAHS[0];
  const lastReciter = getReciterById(progress.lastReciterId);
  const tajweedHistory = getTajweedHistory();

  const totalSurahs = 114;
  const completedCount = progress.completedSurahIds.length;
  const percentComplete = Math.round((completedCount / totalSurahs) * 100);

  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'remaining'>('all');

  const avgTajweedScore = tajweedHistory.length > 0
    ? Math.round(tajweedHistory.reduce((acc, curr) => acc + curr.alignmentScore, 0) / tajweedHistory.length)
    : 92;

  const handleToggleSurah = (surahId: number) => {
    const isDone = progress.completedSurahIds.includes(surahId);
    markSurahCompleted(surahId, !isDone);
    onRefresh();
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your Quran reading completion progress?')) {
      saveStoredProgress({
        completedSurahIds: [],
        lastStoppedSurahId: 1,
        lastStoppedAyahId: 1
      });
      onRefresh();
    }
  };

  const displayedSurahs = SURAHS.filter(s => {
    const isDone = progress.completedSurahIds.includes(s.id);
    if (filterMode === 'completed') return isDone;
    if (filterMode === 'remaining') return !isDone;
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Flagship "Where Did You Stop?" Card */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Exact Quran Bookmark & Reading Position</span>
            </div>

            <div className="text-sm text-emerald-200">
              You last stopped at:
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Surah {stoppedSurah.nameEnglish}
              </h1>
              <span className="font-arabic text-2xl sm:text-3xl text-amber-300">
                {stoppedSurah.nameArabic}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100/90 mt-3">
              <span>Surah #{stoppedSurah.id} of 114</span>
              <span aria-hidden="true">·</span>
              <span>Ayah #{progress.lastStoppedAyahId}</span>
              <span aria-hidden="true">·</span>
              <span>Juz {stoppedSurah.juzStart}</span>
              <span aria-hidden="true">·</span>
              <span>Reciter: Sheikh {lastReciter.name.split(' ')[0]}</span>
            </div>

            <p className="text-xs text-emerald-200/80 mt-2">
              Updated {new Date(progress.lastUpdatedTimestamp).toLocaleDateString()} at{' '}
              {new Date(progress.lastUpdatedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              onClick={() => onNavigateToSurah(stoppedSurah.id)}
              className="px-5 py-3 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue from {stoppedSurah.nameEnglish}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToTajweed}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800/80 hover:bg-emerald-800 rounded-lg border border-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" />
              <span>Practice Tajweed for this Surah</span>
            </button>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-emerald-800/40 font-arabic text-8xl select-none pointer-events-none hidden md:block">
          الْقُرْآنُ
        </div>
      </div>

      {/* Daily Quran Goal Component with Streak & Consistency Rewards */}
      <DailyQuranGoal
        onNavigateToReader={() => onNavigateToSurah(progress.lastStoppedSurahId)}
        onNavigateToTajweed={onNavigateToTajweed}
        onGoalCompleted={onRefresh}
      />

      {/* Analytics & Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Khatma Completion</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {percentComplete}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${percentComplete}%` }} />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {completedCount} of 114 Surahs completed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Avg Tajweed Alignment</span>
            <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {avgTajweedScore}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${avgTajweedScore}%` }} />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Across {tajweedHistory.length} recorded sessions
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Recitation Streak</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {progress.dailyStreak} Days
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep listening daily to build consistent Quran habit
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Listening Log</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {progress.totalListeningMinutes} mins
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synchronized audio across global scholars
          </p>
        </div>

      </div>

      {/* 114 Surahs Visual Completion Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              114 Surahs Quran Completion Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any Surah to jump directly into reading, or click the checkmark to mark as completed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterMode === 'all' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                All (114)
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterMode === 'completed' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Done ({completedCount})
              </button>
              <button
                onClick={() => setFilterMode('remaining')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterMode === 'remaining' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Remaining ({114 - completedCount})
              </button>
            </div>

            <button
              onClick={handleResetProgress}
              title="Reset progress"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[500px] overflow-y-auto p-1">
          {displayedSurahs.map((surah) => {
            const isDone = progress.completedSurahIds.includes(surah.id);
            const isStoppedHere = progress.lastStoppedSurahId === surah.id;

            return (
              <div
                key={surah.id}
                onClick={() => onNavigateToSurah(surah.id)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isStoppedHere
                    ? 'border-amber-400 dark:border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-300 dark:ring-amber-500/40'
                    : isDone
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[11px] font-bold tabular-nums ${
                    isStoppedHere 
                      ? 'text-amber-800 dark:text-amber-300' 
                      : isDone 
                      ? 'text-emerald-700 dark:text-emerald-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    #{surah.id}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSurah(surah.id);
                    }}
                    title={isDone ? 'Mark as unread' : 'Mark as completed'}
                    className="p-0.5"
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'}`} />
                  </button>
                </div>

                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {surah.nameEnglish}
                  </div>
                  <div className="font-arabic text-sm text-slate-700 dark:text-slate-300 truncate" dir="rtl">
                    {surah.nameArabic}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  {surah.versesCount} Ayahs
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Tajweed Progress Summary Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tajweed Rhyme & Articulation Track
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track how your recitation aligns with classical recitation standards.
            </p>
          </div>

          <button
            onClick={onNavigateToTajweed}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Launch Studio</span>
          </button>
        </div>

        {tajweedHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tajweedHistory.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-900 dark:text-slate-100">{item.surahName} (Ayah {item.ayahNumber})</strong>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.alignmentScore}% Match</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Benchmarked vs Sheikh {item.reciterName.split(' ')[0]} ({item.riwayah})
                </p>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
                  "{item.notes}"
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">No Tajweed practice recordings yet. Visit the Tajweed Studio to record and align your recitation.</p>
        )}
      </div>

    </div>
  );
};

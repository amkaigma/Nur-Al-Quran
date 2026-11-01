import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Mic, 
  BookOpen, 
  Book, 
  X, 
  ChevronUp, 
  Users, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { Reciter, SurahMeta } from '../types/quran';
import { isSurahAvailableForReciter } from '../data/reciters';

interface MobileCompactAudioPlayerProps {
  currentReciter: Reciter;
  currentSurah: SurahMeta;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  loopMode: 'off' | 'surah' | 'all';
  isLoading: boolean;
  hasError?: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onChangeRate: (rate: number) => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onToggleLoop: (mode: 'off' | 'surah' | 'all') => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenReader: () => void;
  onOpenMushaf?: () => void;
  onOpenTajweed: () => void;
  onOpenReciterSwitcher: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const MobileCompactAudioPlayer: React.FC<MobileCompactAudioPlayerProps> = ({
  currentReciter,
  currentSurah,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  isMuted,
  loopMode,
  isLoading,
  hasError,
  onTogglePlay,
  onSeek,
  onChangeRate,
  onChangeVolume,
  onToggleMute,
  onToggleLoop,
  onNext,
  onPrev,
  onOpenReader,
  onOpenMushaf,
  onOpenTajweed,
  onOpenReciterSwitcher
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAvailable = isSurahAvailableForReciter(currentReciter, currentSurah.id);
  const nextLoop = loopMode === 'surah' ? 'all' : (loopMode === 'all' ? 'off' : 'surah');
  const nextRate = playbackRate === 1 ? 1.25 : (playbackRate === 1.25 ? 0.75 : 1);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* 1. Compact Docked Bar (Visible on mobile screens, hidden on md+) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl transition-all">
        
        {/* Scrubber progress line at the very top */}
        <div 
          className="w-full bg-slate-800 h-1 cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            onSeek(clickPos * (duration || 1));
          }}
        >
          <div 
            className="bg-emerald-500 h-full relative" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="px-3.5 py-2 flex items-center justify-between gap-2.5">
          
          {/* Left: Surah badge & Name (taps to expand full audio sheet) */}
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 font-arabic border border-emerald-700/60 shadow-sm">
              {currentSurah.id}
            </div>

            <div className="truncate min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {currentSurah.nameEnglish}
                </span>
                <span className="font-arabic text-xs text-amber-300 truncate">
                  {currentSurah.nameArabic}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <span className="truncate">
                  {currentReciter.countryCode === 'NG' ? `🇳🇬 ${currentReciter.name}` : currentReciter.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Quick Switch Reciter Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenReciterSwitcher();
              }}
              title="Change Reciter Voice"
              aria-label="Change Reciter Voice"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors flex items-center justify-center"
            >
              <Users className="w-4 h-4" />
            </button>

            {/* Prev Track */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              title="Previous Surah"
              aria-label="Previous Surah"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
              disabled={!isAvailable}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition-transform active:scale-95 ${
                !isAvailable
                  ? 'bg-slate-700 opacity-50 cursor-not-allowed text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              title="Next Surah"
              aria-label="Next Surah"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Expand Drawer Button */}
            <button
              onClick={() => setIsExpanded(true)}
              title="Expand Controls"
              aria-label="Expand player controls"
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* 2. Expanded Mobile Audio Bottom Sheet Modal */}
      {isExpanded && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 text-white max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl">
            
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Now Reciting
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Surah & Reciter Details */}
            <div className="text-center space-y-1.5 py-2">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold mb-1">
                Surah {currentSurah.id} · {currentSurah.versesCount} Ayahs
              </div>
              <h2 className="text-xl font-bold text-white">
                {currentSurah.nameEnglish}
              </h2>
              <p className="font-arabic text-2xl text-amber-300 font-bold" dir="rtl">
                {currentSurah.nameArabic}
              </p>
              <p className="text-xs text-slate-400">
                {currentSurah.meaning} · {currentSurah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
              </p>
            </div>

            {/* Reciter Badge & Change Reciter Button */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between gap-3">
              <div className="truncate min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                  <span>{currentReciter.countryCode === 'NG' ? '🇳🇬' : '🌍'}</span>
                  <span className="truncate">{currentReciter.name}</span>
                </div>
                <div className="text-[11px] text-emerald-400 truncate">
                  {currentReciter.style} · {currentReciter.country}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenReciterSwitcher();
                }}
                className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch Reciter</span>
              </button>
            </div>

            {/* Interactive Progress Slider & Time Labels */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime || 0}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Playback Controls Bar */}
            <div className="flex items-center justify-center gap-6 py-2">
              <button
                onClick={onPrev}
                className="p-3 text-slate-300 hover:text-white transition-colors"
                title="Previous Surah"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={onTogglePlay}
                disabled={!isAvailable}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  !isAvailable
                    ? 'bg-slate-700 opacity-50 cursor-not-allowed text-slate-400'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-3 text-slate-300 hover:text-white transition-colors"
                title="Next Surah"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Audio Settings: Speed, Loop, Volume */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onChangeRate(nextRate)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Speed: {playbackRate}x</span>
              </button>

              <button
                onClick={() => onToggleLoop(nextLoop)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                {loopMode === 'surah' ? (
                  <>
                    <Repeat1 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Repeat Surah</span>
                  </>
                ) : loopMode === 'all' ? (
                  <>
                    <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Repeat All</span>
                  </>
                ) : (
                  <>
                    <Repeat className="w-3.5 h-3.5 text-slate-400" />
                    <span>Repeat Off</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Action Destinations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenReader();
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Reader</span>
              </button>

              {onOpenMushaf && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenMushaf();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Book className="w-4 h-4" />
                  <span>Open Mushaf</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenTajweed();
                }}
                className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Mic className="w-4 h-4" />
                <span>Tajweed Studio</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
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
  BookOpen 
} from 'lucide-react';
import { Reciter, SurahMeta } from '../types/quran';
import { isSurahAvailableForReciter } from '../data/reciters';

interface AudioPlayerBarProps {
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
  onOpenTajweed: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
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
  onOpenTajweed
}) => {
  const nextLoop = loopMode === 'surah' ? 'all' : (loopMode === 'all' ? 'off' : 'surah');
  const nextRate = playbackRate === 1 ? 1.25 : (playbackRate === 1.25 ? 0.75 : 1);

  const isAvailable = isSurahAvailableForReciter(currentReciter, currentSurah.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl">
      
      {/* Tiny progress scrub line at top edge */}
      <div 
        className="w-full bg-slate-800 h-1 cursor-pointer group relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          onSeek(clickPos * (duration || 1));
        }}
      >
        <div 
          className="bg-emerald-500 h-full relative" 
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Reciter & Surah Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs">
          <button
            onClick={onOpenReader}
            className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 font-arabic hover:bg-emerald-700 transition-colors"
            title="View in Reader"
          >
            {currentSurah.id}
          </button>
          
          <div className="truncate min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate">
                {currentSurah.nameEnglish}
              </span>
              <span className="font-arabic text-xs text-amber-300 truncate hidden sm:inline">
                {currentSurah.nameArabic}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
              <span>{currentReciter.countryCode === 'NG' ? `🇳🇬 ${currentReciter.name}` : currentReciter.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">{currentReciter.style}</span>
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
          <div className="flex items-center gap-3">
            
            {/* Prev Surah */}
            <button
              onClick={onPrev}
              title="Previous Surah"
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Main Button */}
            <button
              onClick={onTogglePlay}
              disabled={!isAvailable}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow transition-transform active:scale-95 ${
                !isAvailable
                  ? 'bg-slate-700 opacity-50 cursor-not-allowed text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title={
                !isAvailable 
                  ? `Surah ${currentSurah.nameEnglish} is not recorded in this Riwayah by ${currentReciter.name}` 
                  : isPlaying 
                  ? 'Pause' 
                  : 'Play'
              }
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Surah */}
            <button
              onClick={onNext}
              title="Next Surah"
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

          </div>

          {/* Time scrubber text or Error indicator */}
          {!isAvailable ? (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/80">
              <span>Surah not recorded in this Riwayah</span>
            </div>
          ) : hasError ? (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/80 animate-pulse">
              <span>Stream interrupted. Tap play to retry mirror</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Right: Quick actions & volume */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Speed */}
          <button
            onClick={() => onChangeRate(nextRate)}
            title="Playback Speed"
            className="hidden md:inline-flex px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
          >
            {playbackRate}x
          </button>

          {/* Loop Mode */}
          <button
            onClick={() => onToggleLoop(nextLoop)}
            title={`Loop: ${loopMode}`}
            className="hidden md:inline-flex p-1.5 text-slate-300 hover:text-white transition-colors"
          >
            {loopMode === 'surah' ? (
              <Repeat1 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Repeat className={`w-4 h-4 ${loopMode === 'all' ? 'text-emerald-400' : 'text-slate-500'}`} />
            )}
          </button>

          {/* Practice in Tajweed Studio */}
          <button
            onClick={onOpenTajweed}
            title="Practice Tajweed alignment for this Surah"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tajweed Studio</span>
          </button>

        </div>

      </div>
    </div>
  );
};

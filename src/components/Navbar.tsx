import React from 'react';
import { BookOpen, Mic, Users, CheckCircle2, Play, Moon, Sun, Layers, Sparkles, Radio, Languages, Clock, Compass } from 'lucide-react';
import { SurahMeta } from '../types/quran';

export type AppTab = 'riwayah' | 'reciters' | 'haramain' | 'translations' | 'prayer_times' | 'reader' | 'tajweed' | 'progress';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  lastStoppedSurah: SurahMeta;
  onResume: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lastStoppedSurah,
  onResume,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Wordmark */}
        <div 
          onClick={() => setActiveTab('riwayah')}
          className="cursor-pointer text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm font-arabic">
            نور
          </span>
          <span className="hidden sm:inline">Nur Al-Quran</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50 hidden md:inline">
            eTilawa+
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-5 text-xs 2xl:text-sm font-medium">
          <button
            onClick={() => setActiveTab('riwayah')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'riwayah' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Riwayat</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
              20
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reciters')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'reciters' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Reciters</span>
          </button>

          {/* eTilawa Feature: Haramain Portal */}
          <button
            onClick={() => setActiveTab('haramain')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'haramain' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Haramain</span>
            <span className="text-[9px] font-bold px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              LIVE
            </span>
          </button>

          {/* eTilawa Feature: Audio Translations */}
          <button
            onClick={() => setActiveTab('translations')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'translations' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Languages className="w-4 h-4 text-blue-500" />
            <span>Translations (12)</span>
          </button>

          {/* eTilawa Feature: Prayer Times & Qibla */}
          <button
            onClick={() => setActiveTab('prayer_times')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'prayer_times' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Prayer & Qibla</span>
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'reader' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Reader</span>
          </button>

          <button
            onClick={() => setActiveTab('tajweed')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'tajweed' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Tajweed</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'progress' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Progress</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & dark mode toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Dark Mode Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode for Night Reading'}
            aria-label="Toggle dark mode theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onResume}
            title={`Resume recitation of Surah ${lastStoppedSurah.nameEnglish}`}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Resume:</span>
            <span className="truncate max-w-[110px] font-medium">{lastStoppedSurah.nameEnglish}</span>
          </button>
        </div>

      </div>

      {/* Responsive nav bar strip for screens below XL */}
      <div className="flex xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto px-4 py-2 gap-4 text-xs font-medium items-center scrollbar-none">
        <button
          onClick={() => setActiveTab('riwayah')}
          className={`whitespace-nowrap shrink-0 flex items-center gap-1 ${activeTab === 'riwayah' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          <span>Riwayat</span>
          <span className="text-[9px] px-1 rounded-full bg-emerald-100 dark:bg-emerald-950 font-bold">20</span>
        </button>
        <button
          onClick={() => setActiveTab('reciters')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'reciters' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Reciters
        </button>
        <button
          onClick={() => setActiveTab('haramain')}
          className={`whitespace-nowrap shrink-0 flex items-center gap-1 ${activeTab === 'haramain' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          <span>Haramain</span>
          <span className="text-[8px] px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">LIVE</span>
        </button>
        <button
          onClick={() => setActiveTab('translations')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'translations' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Translations
        </button>
        <button
          onClick={() => setActiveTab('prayer_times')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'prayer_times' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Prayer & Qibla
        </button>
        <button
          onClick={() => setActiveTab('reader')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'reader' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Reader
        </button>
        <button
          onClick={() => setActiveTab('tajweed')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'tajweed' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Tajweed
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'progress' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Progress
        </button>
      </div>
    </header>
  );
};

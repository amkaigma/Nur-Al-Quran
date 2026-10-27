import React from 'react';
import { BookOpen, Mic, Users, CheckCircle2, Play, Moon, Sun } from 'lucide-react';
import { SurahMeta } from '../types/quran';

interface NavbarProps {
  activeTab: 'reciters' | 'reader' | 'tajweed' | 'progress';
  setActiveTab: (tab: 'reciters' | 'reader' | 'tajweed' | 'progress') => void;
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
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => setActiveTab('reciters')}
          className="cursor-pointer text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm font-arabic">
            نور
          </span>
          <span>Nur Al-Quran</span>
        </div>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
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

          <button
            onClick={() => setActiveTab('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'reader' 
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 dark:border-emerald-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quran Reader (1-114)</span>
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
            <span>Tajweed Studio</span>
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
            <span>Progress & Khatma</span>
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
            <span className="truncate max-w-[130px] font-medium">{lastStoppedSurah.nameEnglish}</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar strip */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto px-4 py-2 gap-4 text-xs font-medium justify-between items-center">
        <div className="flex items-center gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reciters')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'reciters' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Reciters
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
            Tajweed Studio
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'progress' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Progress
          </button>
        </div>

        <button
          onClick={onToggleDarkMode}
          aria-label="Toggle dark mode"
          className="p-1.5 rounded-md text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 shrink-0 ml-2"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};

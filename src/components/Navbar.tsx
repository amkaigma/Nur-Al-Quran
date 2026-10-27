import React from 'react';
import { BookOpen, Mic, Users, CheckCircle2, Play } from 'lucide-react';
import { SurahMeta } from '../types/quran';

interface NavbarProps {
  activeTab: 'reciters' | 'reader' | 'tajweed' | 'progress';
  setActiveTab: (tab: 'reciters' | 'reader' | 'tajweed' | 'progress') => void;
  lastStoppedSurah: SurahMeta;
  onResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lastStoppedSurah,
  onResume
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => setActiveTab('reciters')}
          className="cursor-pointer text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm font-arabic">
            نور
          </span>
          <span className="text-slate-900 font-bold">Nur Al-Quran</span>
        </div>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('reciters')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'reciters' 
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Reciters</span>
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'reader' 
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quran Reader (1-114)</span>
          </button>

          <button
            onClick={() => setActiveTab('tajweed')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'tajweed' 
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Tajweed Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'progress' 
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Progress & Khatma</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onResume}
            title={`Resume recitation of Surah ${lastStoppedSurah.nameEnglish}`}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Resume:</span>
            <span className="truncate max-w-[130px] font-medium">{lastStoppedSurah.nameEnglish}</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar strip */}
      <div className="flex md:hidden border-t border-slate-200 overflow-x-auto px-4 py-2 gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('reciters')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'reciters' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Reciters
        </button>
        <button
          onClick={() => setActiveTab('reader')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'reader' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Reader
        </button>
        <button
          onClick={() => setActiveTab('tajweed')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'tajweed' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Tajweed Studio
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'progress' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Progress
        </button>
      </div>
    </header>
  );
};

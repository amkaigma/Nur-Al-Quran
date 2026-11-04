import React, { useState } from 'react';
import { 
  Home,
  BookOpen, 
  Book, 
  Users, 
  Layers, 
  BookMarked,
  Clock, 
  Compass, 
  Sparkles, 
  Languages, 
  Mic, 
  CheckCircle2, 
  Flame, 
  Settings, 
  Play, 
  Moon, 
  Sun, 
  Activity, 
  Menu, 
  X, 
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Volume2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SurahMeta } from '../types/quran';

export type AppTab = 
  | 'home'
  | 'reader' 
  | 'mushaf'
  | 'reciters' 
  | 'riwayah' 
  | 'library' 
  | 'prayer_times' 
  | 'adhan_voices'
  | 'qibla' 
  | 'haramain' 
  | 'translations' 
  | 'tajweed' 
  | 'progress' 
  | 'goals'
  | 'settings';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  lastStoppedSurah: SurahMeta;
  onResume: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAudioHealth?: () => void;
  onOpenAdmin?: () => void;
  onOpenReportIssue?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lastStoppedSurah,
  onResume,
  isDarkMode,
  onToggleDarkMode,
  onOpenAudioHealth,
  onOpenAdmin,
  onOpenReportIssue
}) => {
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);

  const getPageTitle = (tab: AppTab): string => {
    switch (tab) {
      case 'home': return 'Home Dashboard';
      case 'reader': return 'Quran Reader';
      case 'mushaf': return 'Traditional Mushaf';
      case 'reciters': return 'Reciters Directory';
      case 'riwayah': return '20 Riwayat';
      case 'library': return 'Islamic Library';
      case 'prayer_times': return 'Prayer Times';
      case 'adhan_voices': return 'Worldwide Adhan Voices';
      case 'qibla': return 'Qibla Direction';
      case 'haramain': return 'Haramain Live';
      case 'translations': return 'Audio Translations';
      case 'tajweed': return 'Tajweed Studio';
      case 'progress': return 'Progress Tracker';
      case 'goals': return 'Daily Goals';
      case 'settings': return 'Settings & Iqama';
      default: return 'Nur Al-Quran';
    }
  };

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    setIsMobileMoreOpen(false);
    setIsTabletMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine whether current tab is in the "More" category on mobile
  const isMoreActive = [
    'mushaf', 
    'riwayah', 
    'prayer_times',
    'adhan_voices', 
    'qibla', 
    'haramain', 
    'translations', 
    'tajweed', 
    'progress', 
    'goals', 
    'settings'
  ].includes(activeTab);

  return (
    <>
      {/* ========================================================
          1. TOP APP BAR (All devices, responsive layout)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 py-2.5 sm:py-3.5">
          
          {/* Left Zone: Brand / Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Back button if not on Home */}
            {activeTab !== 'home' ? (
              <button
                onClick={() => handleSelectTab('home')}
                className="md:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-semibold"
                aria-label="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : null}

            <div 
              onClick={() => handleSelectTab('home')}
              className="cursor-pointer text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm font-arabic">
                نور
              </span>
              <span className="hidden sm:inline">Nur Al-Quran</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50 hidden md:inline">
                eTilawa+
              </span>
            </div>

            {/* Mobile Current Page Title Badge */}
            <div className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 truncate max-w-[140px]">
              <span className="truncate">{getPageTitle(activeTab)}</span>
            </div>
          </div>

          {/* Center Zone: Tablet & Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-medium">
            <button
              onClick={() => handleSelectTab('home')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'home'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleSelectTab('reader')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'reader'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Quran</span>
            </button>

            <button
              onClick={() => handleSelectTab('mushaf')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'mushaf'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Book className="w-4 h-4 text-amber-500" />
              <span>Mushaf (604)</span>
            </button>

            <button
              onClick={() => handleSelectTab('reciters')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'reciters'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Reciters</span>
            </button>

            <button
              onClick={() => handleSelectTab('riwayah')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'riwayah'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>20 Riwayat</span>
            </button>

            <button
              onClick={() => handleSelectTab('library')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'library'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookMarked className="w-4 h-4 text-purple-500" />
              <span>Library</span>
            </button>

            <button
              onClick={() => handleSelectTab('prayer_times')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'prayer_times'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-teal-500" />
              <span>Prayers</span>
            </button>

            <button
              onClick={() => handleSelectTab('qibla')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'qibla'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Qibla</span>
            </button>

            {/* Desktop More Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsTabletMenuOpen(prev => !prev)}
                className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isTabletMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 space-y-1">
                  <button
                    onClick={() => handleSelectTab('haramain')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Haramain Live</span>
                    </span>
                    <span className="text-[9px] px-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-bold">LIVE</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('adhan_voices')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                      <span>Adhan Voice Library</span>
                    </span>
                    <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold">25+</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('translations')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Languages className="w-4 h-4 text-blue-500" />
                    <span>Translations (12)</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('tajweed')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4 text-amber-500" />
                    <span>Tajweed Studio</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('goals')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Daily Quran Goals</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('progress')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Progress Tracker</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('settings')}
                    className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-2"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Settings & Iqama</span>
                  </button>

                  {onOpenReportIssue && (
                    <button
                      onClick={() => {
                        setIsTabletMenuOpen(false);
                        onOpenReportIssue();
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span>Report Issue / Audio Bug</span>
                    </button>
                  )}

                  {onOpenAdmin && (
                    <button
                      onClick={() => {
                        setIsTabletMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 flex items-center gap-2 border border-amber-200 dark:border-amber-800/60 mt-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Super Admin Gateway</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right Zone: Diagnostics, Theme, Resume, Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Audio Health Diagnostics Modal Trigger */}
            {onOpenAudioHealth && (
              <button
                onClick={onOpenAudioHealth}
                title="Audio Diagnostics"
                aria-label="Inspect audio health and streams"
                className="p-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors border border-emerald-300 dark:border-emerald-800"
              >
                <Activity className="w-4 h-4" />
              </button>
            )}

            {/* Dark Mode Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Resume Button (Desktop & Tablet) */}
            <button
              onClick={onResume}
              title={`Resume Surah ${lastStoppedSurah.nameEnglish}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">Resume:</span>
              <span className="truncate max-w-[100px] font-medium">{lastStoppedSurah.nameEnglish}</span>
            </button>

            {/* Settings Shortcut */}
            <button
              onClick={() => handleSelectTab('settings')}
              title="Settings & Iqama Configuration"
              aria-label="Settings & Iqama"
              className={`p-2 rounded-lg transition-colors border ${
                activeTab === 'settings'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Tablet Horizontal Scrolling Nav Strip (Visible between md and lg) */}
        <div className="hidden md:flex lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto px-4 py-2 gap-2 text-xs font-medium items-center scrollbar-none">
          <button
            onClick={() => handleSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'home' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleSelectTab('reader')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reader' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quran</span>
          </button>

          <button
            onClick={() => handleSelectTab('mushaf')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'mushaf' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Book className="w-3.5 h-3.5 text-amber-500" />
            <span>Mushaf (604)</span>
          </button>

          <button
            onClick={() => handleSelectTab('reciters')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reciters' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Reciters</span>
          </button>

          <button
            onClick={() => handleSelectTab('riwayah')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'riwayah' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>20 Riwayat</span>
          </button>

          <button
            onClick={() => handleSelectTab('library')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'library' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-purple-500" />
            <span>Library</span>
          </button>

          <button
            onClick={() => handleSelectTab('prayer_times')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'prayer_times' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>Prayers</span>
          </button>

          <button
            onClick={() => handleSelectTab('qibla')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'qibla' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Qibla</span>
          </button>

          <button
            onClick={() => handleSelectTab('haramain')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'haramain' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Haramain</span>
          </button>

          <button
            onClick={() => handleSelectTab('translations')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'translations' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-blue-500" />
            <span>Translations</span>
          </button>

          <button
            onClick={() => handleSelectTab('tajweed')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tajweed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-500" />
            <span>Tajweed</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. MOBILE DEDICATED BOTTOM NAVIGATION BAR
          5 Primary Destinations: Home, Quran, Reciters, Library, More
         ======================================================== */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1 px-2 flex items-center justify-around shadow-lg transition-colors"
        aria-label="Mobile Navigation"
      >
        {/* 1. Home */}
        <button
          onClick={() => handleSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-lg transition-colors ${
            activeTab === 'home'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Quran */}
        <button
          onClick={() => handleSelectTab('reader')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-lg transition-colors ${
            activeTab === 'reader'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'reader' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Quran</span>
        </button>

        {/* 3. Reciters */}
        <button
          onClick={() => handleSelectTab('reciters')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-lg transition-colors ${
            activeTab === 'reciters'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'reciters' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Reciters</span>
        </button>

        {/* 4. Library */}
        <button
          onClick={() => handleSelectTab('library')}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-lg transition-colors ${
            activeTab === 'library'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookMarked className={`w-5 h-5 ${activeTab === 'library' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Library</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-lg transition-colors relative ${
            isMoreActive
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Menu className={`w-5 h-5 ${isMoreActive ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">More</span>
          {isMoreActive && (
            <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>
      </nav>

      {/* ========================================================
          3. MOBILE "MORE" BOTTOM DRAWER SHEET
          Contains all remaining dedicated destinations cleanly
         ======================================================== */}
      {isMobileMoreOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn"
          onClick={() => setIsMobileMoreOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-sm font-arabic">
                  نور
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    All Destinations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a dedicated page to explore
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Dedicated Destinations */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              
              {/* Traditional Mushaf */}
              <button
                onClick={() => handleSelectTab('mushaf')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'mushaf'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Book className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Traditional Mushaf</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">604 facsimile pages</div>
                </div>
              </button>

              {/* 20 Riwayat */}
              <button
                onClick={() => handleSelectTab('riwayah')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'riwayah'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">20 Riwayat</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">All canonical chains</div>
                </div>
              </button>

              {/* Prayer Times */}
              <button
                onClick={() => handleSelectTab('prayer_times')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'prayer_times'
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 dark:border-teal-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Prayer Times</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Accurate daily times</div>
                </div>
              </button>

              {/* Qibla Direction */}
              <button
                onClick={() => handleSelectTab('qibla')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'qibla'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Compass className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Qibla Direction</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Compass needle & GPS</div>
                </div>
              </button>

              {/* Haramain Live */}
              <button
                onClick={() => handleSelectTab('haramain')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'haramain'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Haramain Live</span>
                    <span className="text-[8px] px-1 bg-amber-100 text-amber-800 rounded font-bold">24/7</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Makkah & Madinah</div>
                </div>
              </button>

              {/* Audio Translations */}
              <button
                onClick={() => handleSelectTab('translations')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'translations'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Languages className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Translations</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">12 languages audio</div>
                </div>
              </button>

              {/* Tajweed Studio */}
              <button
                onClick={() => handleSelectTab('tajweed')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'tajweed'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Mic className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Tajweed Studio</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Voice recorder & coach</div>
                </div>
              </button>

              {/* Daily Goals */}
              <button
                onClick={() => handleSelectTab('goals')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'goals'
                    ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-400 dark:border-orange-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Flame className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Daily Goals</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Streaks & rewards</div>
                </div>
              </button>

              {/* Progress Tracker */}
              <button
                onClick={() => handleSelectTab('progress')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'progress'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Progress Tracker</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Khatm & memory logs</div>
                </div>
              </button>

              {/* Worldwide Adhan Voices */}
              <button
                onClick={() => handleSelectTab('adhan_voices')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'adhan_voices'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Volume2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Adhan Voices</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Authentic Muezzins</div>
                </div>
              </button>

              {/* Settings & Iqama */}
              <button
                onClick={() => handleSelectTab('settings')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'settings'
                    ? 'bg-slate-200 dark:bg-slate-700 border-slate-400'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Settings & Iqama</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Audio, times & theme</div>
                </div>
              </button>

              {/* Report Issue Modal Trigger */}
              {onOpenReportIssue && (
                <button
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    onOpenReportIssue();
                  }}
                  className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-left flex items-start gap-2.5 hover:bg-rose-100/50 transition-all"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Report Issue</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Audio bug & feedback</div>
                  </div>
                </button>
              )}

              {/* Super Admin Gateway */}
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    onOpenAdmin();
                  }}
                  className="p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-left flex items-start gap-2.5 hover:bg-amber-100/60 transition-all"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>Super Admin</span>
                      <span className="text-[8px] px-1 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded font-bold">SECURE</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Portal & control center</div>
                  </div>
                </button>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
};

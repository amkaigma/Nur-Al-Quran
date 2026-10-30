import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Search,
  Book,
  Compass,
  FileText,
  Info,
  X,
  Activity,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { Reciter, SurahMeta } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { 
  JUZ_LIST, 
  getJuzForPage, 
  getPageImageUrl, 
  preloadAdjacentPages, 
  toArabicNumerals,
  getSurahsForPage,
  getPrimarySurahForPage
} from '../data/mushafData';
import { fetchMushafPage, MushafPageContent, PageAyah } from '../services/mushafService';
import { getSurahAudioUrl, isSurahAvailableForReciter, RECITERS } from '../data/reciters';
import { AudioHealthCheckerModal } from './AudioHealthCheckerModal';

interface TraditionalMushafReaderProps {
  initialPage?: number;
  currentSurahId: number;
  onSelectSurah: (surahId: number) => void;
  currentReciter: Reciter;
  onSelectReciter?: (reciter: Reciter) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSwitchToStudyView?: () => void;
}

export type MushafDisplayMode = 'facsimile' | 'digital_page';
export type MushafTheme = 'madinah_cream' | 'antique_sepia' | 'nocturnal_dark' | 'crisp_white';
export type PageSpread = 'single' | 'double';

export const TraditionalMushafReader: React.FC<TraditionalMushafReaderProps> = ({
  initialPage,
  currentSurahId,
  onSelectSurah,
  currentReciter,
  onSelectReciter,
  isPlaying,
  onTogglePlay,
  onSwitchToStudyView
}) => {
  // Page state (1 to 604)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage && initialPage >= 1 && initialPage <= 604) {
      return initialPage;
    }
    const saved = localStorage.getItem('nur_quran_last_mushaf_page');
    if (saved) {
      const p = parseInt(saved, 10);
      if (!isNaN(p) && p >= 1 && p <= 604) return p;
    }
    const currentSurah = getSurahById(currentSurahId);
    return currentSurah ? currentSurah.pageStart : 1;
  });

  const [pageInput, setPageInput] = useState<string>(currentPage.toString());
  const [displayMode, setDisplayMode] = useState<MushafDisplayMode>('facsimile');
  const [spreadMode, setSpreadMode] = useState<PageSpread>('single');
  const [mushafTheme, setMushafTheme] = useState<MushafTheme>('madinah_cream');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_mushaf_bookmarks');
      return saved ? JSON.parse(saved) : [1, 293, 582];
    } catch {
      return [1, 293, 582];
    }
  });

  // Digital page content state
  const [pageContent, setPageContent] = useState<MushafPageContent | null>(null);
  const [pageContentLeft, setPageContentLeft] = useState<MushafPageContent | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [selectedAyah, setSelectedAyah] = useState<PageAyah | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<boolean>(false);

  // Single verse audio preview state
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPreviewingAyah, setIsPreviewingAyah] = useState<boolean>(false);
  const [isAudioHealthOpen, setIsAudioHealthOpen] = useState<boolean>(false);

  // Container ref for fullscreen
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Compute all Surahs appearing on the currently viewed page
  const surahsOnCurrentPage = React.useMemo(() => {
    return getSurahsForPage(currentPage);
  }, [currentPage]);

  const primarySurahOnPage = surahsOnCurrentPage[0] || getSurahById(1)!;
  const activeDisplaySurah = surahsOnCurrentPage.find(s => s.id === currentSurahId) || primarySurahOnPage;
  const isCurrentSurahAvailable = isSurahAvailableForReciter(currentReciter, activeDisplaySurah.id);

  // Update current page when currentSurahId changes externally
  useEffect(() => {
    const s = getSurahById(currentSurahId);
    if (s && Math.abs(s.pageStart - currentPage) > 10) {
      // Only jump if significantly different to avoid disrupting user flipping
      setCurrentPage(s.pageStart);
      setPageInput(s.pageStart.toString());
    }
  }, [currentSurahId]);

  // Save last read page
  useEffect(() => {
    localStorage.setItem('nur_quran_last_mushaf_page', currentPage.toString());
    preloadAdjacentPages(currentPage);
  }, [currentPage]);

  // Load digital page content when in digital_page mode
  useEffect(() => {
    if (displayMode === 'digital_page') {
      setIsLoadingPage(true);
      fetchMushafPage(currentPage).then(content => {
        setPageContent(content);
        setIsLoadingPage(false);
      });

      if (spreadMode === 'double' && currentPage < 604) {
        fetchMushafPage(currentPage + 1).then(content => {
          setPageContentLeft(content);
        });
      }
    }
  }, [currentPage, displayMode, spreadMode]);

  // Page navigation handlers with automatic Surah synchronization
  const goToPage = useCallback((pageNum: number) => {
    const clamped = Math.max(1, Math.min(604, pageNum));
    setCurrentPage(clamped);
    setPageInput(clamped.toString());
    setSelectedAyah(null);
    if (previewAudio) {
      previewAudio.pause();
      setIsPreviewingAyah(false);
    }
    const pageSurahs = getSurahsForPage(clamped);
    if (pageSurahs.length > 0 && !pageSurahs.some(s => s.id === currentSurahId)) {
      onSelectSurah(pageSurahs[0].id);
    }
  }, [previewAudio, currentSurahId, onSelectSurah]);

  // In Arabic/Quran reading, turning to next page progresses forward (page + 1 or +2)
  const handleNextPage = () => {
    const step = spreadMode === 'double' ? 2 : 1;
    if (currentPage < 604) {
      goToPage(currentPage + step);
    }
  };

  const handlePrevPage = () => {
    const step = spreadMode === 'double' ? 2 : 1;
    if (currentPage > 1) {
      goToPage(currentPage - step);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        // In Arabic Mushaf, turning left advances to next page
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        // Turning right goes back to previous page
        handlePrevPage();
      } else if (e.key === 'Escape') {
        setSelectedAyah(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, spreadMode]);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput.trim(), 10);
    if (!isNaN(p)) {
      goToPage(p);
    }
  };

  const toggleBookmark = (page: number) => {
    let next: number[];
    if (bookmarks.includes(page)) {
      next = bookmarks.filter(b => b !== page);
    } else {
      next = [...bookmarks, page].sort((a, b) => a - b);
    }
    setBookmarks(next);
    localStorage.setItem('nur_quran_mushaf_bookmarks', JSON.stringify(next));
  };

  const toggleFullscreen = () => {
    if (!readerContainerRef.current) return;
    if (!document.fullscreenElement) {
      readerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleAyahClick = (ayah: PageAyah) => {
    setSelectedAyah(ayah);
    setCopiedAyah(false);
  };

  const handleCopyAyah = (ayah: PageAyah) => {
    const text = `${ayah.textArabic}\n\n"${ayah.translation}"\n[Surah ${ayah.surahNameEnglish} ${ayah.surahNumber}:${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(true);
    setTimeout(() => setCopiedAyah(false), 2000);
  };

  const handlePlayAyahAudio = (ayah: PageAyah) => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setIsPreviewingAyah(false);
    }
    if (currentSurahId !== ayah.surahNumber) {
      onSelectSurah(ayah.surahNumber);
    }
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const currentJuz = getJuzForPage(currentPage);
  const isPageBookmarked = bookmarks.includes(currentPage);

  // Background style helper based on selected theme
  const getThemeClasses = () => {
    switch (mushafTheme) {
      case 'madinah_cream':
        return 'bg-[#FBF8EE] text-[#1C1917] border-[#D4C3A3]';
      case 'antique_sepia':
        return 'bg-[#F4EEDD] text-[#292524] border-[#C8B896]';
      case 'nocturnal_dark':
        return 'bg-[#181B1E] text-[#E6E1D3] border-[#363B42]';
      case 'crisp_white':
        return 'bg-white text-slate-900 border-slate-200';
      default:
        return 'bg-[#FBF8EE] text-[#1C1917] border-[#D4C3A3]';
    }
  };

  const isDark = mushafTheme === 'nocturnal_dark';

  return (
    <div 
      ref={readerContainerRef}
      className={`rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/80 border-slate-200'
      } ${isFullscreen ? 'p-4 sm:p-6 fixed inset-0 z-50 rounded-none' : 'p-3 sm:p-5'}`}
    >
      
      {/* ── Control Header Bar ── */}
      <div className={`p-3 sm:p-4 rounded-xl mb-4 border transition-colors flex flex-col lg:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        
        {/* Left: Navigation and Page Indicator */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-start">
          
          {/* Turn Page Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              title="Previous Page (السابق) [Arrow Right]"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= 604}
              title="Next Page (التالي) [Arrow Left]"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-700 shadow-xs"
            >
              <span>Next Page</span>
              <ChevronLeft className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          {/* Direct Page Input Form */}
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Page</span>
            <input
              type="number"
              min={1}
              max={604}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-14 px-2 py-1.5 rounded-lg text-center font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
            <span className="text-slate-400">/ 604</span>
            <button
              type="submit"
              className="px-2 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
            >
              Go
            </button>
          </form>

          {/* Quick Bookmark Toggle */}
          <button
            onClick={() => toggleBookmark(currentPage)}
            title={isPageBookmarked ? "Remove Bookmark" : "Bookmark this Page"}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
              isPageBookmarked 
                ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 text-amber-800 dark:text-amber-300' 
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isPageBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden md:inline">{isPageBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>

        {/* Center: Juz & Surah Jumps */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center">
          
          {/* Juz Jump Dropdown */}
          <select
            value={currentJuz.number}
            onChange={(e) => {
              const jNum = parseInt(e.target.value, 10);
              const found = JUZ_LIST.find(j => j.number === jNum);
              if (found) goToPage(found.startPage);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            {JUZ_LIST.map((j) => (
              <option key={j.number} value={j.number}>
                Juz {j.number}: {j.nameArabic} (p. {j.startPage})
              </option>
            ))}
          </select>

          {/* Surah Jump Dropdown */}
          <select
            value={currentSurahId}
            onChange={(e) => {
              const sId = parseInt(e.target.value, 10);
              const s = getSurahById(sId);
              if (s) {
                onSelectSurah(sId);
                goToPage(s.pageStart);
              }
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600 max-w-[150px] sm:max-w-[200px]"
          >
            {SURAHS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.nameEnglish} ({s.nameArabic})
              </option>
            ))}
          </select>

        </div>

        {/* Right: Display Settings & Modes */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-end">
          
          {/* Display Mode: Facsimile vs Digital Page */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDisplayMode('facsimile')}
              className={`px-2 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                displayMode === 'facsimile'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Book className="w-3.5 h-3.5" />
              <span>Printed Scan</span>
            </button>
            <button
              onClick={() => setDisplayMode('digital_page')}
              className={`px-2 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                displayMode === 'digital_page'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Page</span>
            </button>
          </div>

          {/* Spread Mode (Desktop Only): Single vs Double Book Spread */}
          <div className="hidden xl:flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setSpreadMode('single')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                spreadMode === 'single'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              1 Page
            </button>
            <button
              onClick={() => setSpreadMode('double')}
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                spreadMode === 'double'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              2 Pages (Book)
            </button>
          </div>

          {/* Theme Palette Switcher */}
          <select
            value={mushafTheme}
            onChange={(e) => setMushafTheme(e.target.value as MushafTheme)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="madinah_cream">Madinah Cream</option>
            <option value="antique_sepia">Antique Sepia</option>
            <option value="nocturnal_dark">Nocturnal Night</option>
            <option value="crisp_white">Crisp White</option>
          </select>

          {/* Switch back to verse study view if desired */}
          {onSwitchToStudyView && (
            <button
              onClick={onSwitchToStudyView}
              title="Switch to detailed verse-by-verse list view"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Study View</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reading"}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* ── Mushaf Audio Companion Bar ── */}
      <div className={`p-3 rounded-xl mb-3 border transition-colors flex flex-col md:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-emerald-950 text-white border-emerald-900 shadow-md'
      }`}>
        {/* Left: Active Surah(s) on this Mushaf Page with Direct Play/Pause */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Main Play/Pause Button */}
          <button
            onClick={() => {
              if (!surahsOnCurrentPage.some(s => s.id === currentSurahId)) {
                onSelectSurah(primarySurahOnPage.id);
                if (!isPlaying) onTogglePlay();
              } else {
                onTogglePlay();
              }
            }}
            disabled={!isCurrentSurahAvailable}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition-all ${
              !isCurrentSurahAvailable
                ? 'bg-slate-700 opacity-50 cursor-not-allowed text-slate-400'
                : isPlaying
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 scale-105'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white'
            }`}
            title={isPlaying ? "Pause Surah" : `Play Surah ${activeDisplaySurah.nameEnglish}`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Surah Pills: If single or multiple surahs on this page */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-emerald-200/80 mr-1 hidden sm:inline">
              Page {currentPage} Surah{surahsOnCurrentPage.length > 1 ? 's' : ''}:
            </span>
            {surahsOnCurrentPage.map(surah => {
              const isSelected = currentSurahId === surah.id;
              const isSurahPlay = isSelected && isPlaying;
              const hasAudioForReciter = isSurahAvailableForReciter(currentReciter, surah.id);

              return (
                <button
                  key={surah.id}
                  onClick={() => {
                    if (currentSurahId !== surah.id) {
                      onSelectSurah(surah.id);
                      if (!isPlaying) onTogglePlay();
                    } else {
                      onTogglePlay();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border border-emerald-400 shadow-xs ring-2 ring-amber-400/30'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-800/80'
                  }`}
                >
                  {isSurahPlay ? (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-amber-300 rounded-full animate-pulse" />
                      <span className="w-1 h-2 bg-amber-300 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-3 bg-amber-300 rounded-full animate-pulse delay-150" />
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-75 font-mono">{surah.id}.</span>
                  )}
                  <span>{surah.nameEnglish}</span>
                  <span className="font-arabic text-amber-300 text-xs">({surah.nameArabic})</span>
                  {!hasAudioForReciter && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40">
                      Partial
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Reciter Badge & Diagnostic Audio Check Button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200">
            <span className="truncate max-w-[170px] sm:max-w-xs font-medium">
              🎙️ {currentReciter.countryCode === 'NG' ? `🇳🇬 ${currentReciter.name}` : currentReciter.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800/80 border border-emerald-700/80 text-amber-300 font-mono hidden sm:inline">
              {currentReciter.riwayah}
            </span>
          </div>

          <button
            onClick={() => setIsAudioHealthOpen(true)}
            className="px-2 py-1 rounded-md bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0"
            title="Inspect Audio Health & Stream Status"
          >
            <Activity className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">Audio Health</span>
          </button>
        </div>
      </div>

      {/* Reciter Availability Warning Banner if active surah is not in partial Riwayah */}
      {!isCurrentSurahAvailable && (
        <div className="p-3 rounded-xl mb-3 border border-amber-500/50 bg-amber-950/80 text-amber-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Surah {activeDisplaySurah.nameEnglish}</strong> is not recorded in {currentReciter.riwayah} by {currentReciter.name} (only {currentReciter.availableSurahs?.length || 0} surahs in this canonical archive).
            </span>
          </div>
          {onSelectReciter && (
            <button
              onClick={() => {
                const fullReciter = RECITERS.find(r => r.id === 'mahmoud-khalil-al-husary') || RECITERS[0];
                onSelectReciter(fullReciter);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shrink-0 transition-colors"
            >
              Switch to Complete Reciter (Al-Husary)
            </button>
          )}
        </div>
      )}

      {/* ── Page Content Display Area ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[600px] overflow-hidden select-none">
        
        {/* Rapid Slider Bar */}
        <div className="w-full max-w-2xl px-4 py-1.5 flex items-center gap-3 text-xs mb-2">
          <span className="text-slate-400 font-medium">Page 1</span>
          <input
            type="range"
            min={1}
            max={604}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <span className="text-slate-400 font-medium">Page 604</span>
        </div>

        {/* ── Mode 1: High-Definition Scanned Madinah Mushaf Facsimile ── */}
        {displayMode === 'facsimile' && (
          <div className="w-full flex items-center justify-center py-2 px-1 overflow-x-auto">
            
            {spreadMode === 'double' && currentPage < 604 ? (
              /* Two-Page Book Spread */
              <div className="flex items-center shadow-2xl rounded-xl border border-amber-900/30 overflow-hidden bg-stone-900/40 p-2 sm:p-4 backdrop-blur-xs relative max-w-6xl w-full justify-center">
                
                {/* Center Book Spine Divider Shadow */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-black/25 via-black/40 to-black/25 pointer-events-none z-20" />

                {/* Left Page (Odd Page in Quran Spread) */}
                <div className="flex-1 flex flex-col items-center justify-center p-1 sm:p-2 relative group">
                  <div className={`rounded-lg p-1.5 sm:p-3 border shadow-md transition-all ${getThemeClasses()}`}>
                    <img
                      src={getPageImageUrl(currentPage + 1)}
                      alt={`Madinah Mushaf Page ${currentPage + 1}`}
                      className="max-h-[76vh] w-auto object-contain mx-auto rounded shadow-inner"
                      loading="eager"
                      style={{
                        filter: isDark ? 'invert(0.9) hue-rotate(180deg) brightness(0.9) contrast(1.1)' : 'none'
                      }}
                    />
                    <div className="mt-2 text-center text-xs font-semibold text-slate-500 flex justify-between px-4">
                      <span>Juz {getJuzForPage(currentPage + 1).number}</span>
                      <span>Page {currentPage + 1} ({toArabicNumerals(currentPage + 1)})</span>
                    </div>
                  </div>
                </div>

                {/* Right Page (Even Page in Quran Spread) */}
                <div className="flex-1 flex flex-col items-center justify-center p-1 sm:p-2 relative group">
                  <div className={`rounded-lg p-1.5 sm:p-3 border shadow-md transition-all ${getThemeClasses()}`}>
                    <img
                      src={getPageImageUrl(currentPage)}
                      alt={`Madinah Mushaf Page ${currentPage}`}
                      className="max-h-[76vh] w-auto object-contain mx-auto rounded shadow-inner"
                      loading="eager"
                      style={{
                        filter: isDark ? 'invert(0.9) hue-rotate(180deg) brightness(0.9) contrast(1.1)' : 'none'
                      }}
                    />
                    <div className="mt-2 text-center text-xs font-semibold text-slate-500 flex justify-between px-4">
                      <span>Page {currentPage} ({toArabicNumerals(currentPage)})</span>
                      <span>Juz {getJuzForPage(currentPage).number}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Single Page View */
              <div className="flex flex-col items-center relative group max-w-3xl w-full">
                
                <div className={`rounded-2xl p-2 sm:p-5 border-2 shadow-2xl transition-all relative overflow-hidden ${getThemeClasses()}`}>
                  
                  {/* Subtle Quranic Decorative Top Edge */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-3 border-b border-amber-900/10 pb-1.5">
                    <span className="font-arabic text-sm text-emerald-800 dark:text-emerald-400">
                      الجزء {toArabicNumerals(currentJuz.number)} ({currentJuz.nameArabic})
                    </span>
                    <span className="font-bold">
                      Page {currentPage} of 604
                    </span>
                    <span className="font-arabic text-sm text-emerald-800 dark:text-emerald-400">
                      سُورَةُ {getSurahById(currentSurahId)?.nameArabic}
                    </span>
                  </div>

                  {/* Scanned Facsimile Page Image */}
                  <img
                    src={getPageImageUrl(currentPage)}
                    alt={`Holy Quran Madinah Mushaf Page ${currentPage}`}
                    className="max-h-[78vh] w-auto object-contain mx-auto rounded shadow-inner"
                    loading="eager"
                    style={{
                      filter: isDark ? 'invert(0.9) hue-rotate(180deg) brightness(0.9) contrast(1.1)' : 'none'
                    }}
                  />

                  {/* Page Footer */}
                  <div className="mt-2.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 pt-1 border-t border-amber-900/10 font-arabic">
                    — {toArabicNumerals(currentPage)} —
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ── Mode 2: Interactive Digital Printed Page Layout ── */}
        {displayMode === 'digital_page' && (
          <div className="w-full flex items-center justify-center py-2 px-1">
            
            {isLoadingPage || !pageContent ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Loading Mushaf Page {currentPage}...
                </p>
              </div>
            ) : (
              <div className={`w-full max-w-3xl rounded-2xl p-4 sm:p-8 border-4 shadow-2xl transition-all relative overflow-hidden ${getThemeClasses()}`}>
                
                {/* Traditional Ornamental Islamic Border Frame */}
                <div className="border border-amber-600/40 rounded-xl p-4 sm:p-6 relative">
                  
                  {/* Decorative Arabesque Corner Accents */}
                  <div className="absolute top-1 left-1 text-amber-600/60 font-arabic text-xl select-none">۞</div>
                  <div className="absolute top-1 right-1 text-amber-600/60 font-arabic text-xl select-none">۞</div>
                  <div className="absolute bottom-1 left-1 text-amber-600/60 font-arabic text-xl select-none">۞</div>
                  <div className="absolute bottom-1 right-1 text-amber-600/60 font-arabic text-xl select-none">۞</div>

                  {/* Page Header (ترويسة الصفحة) */}
                  <div className="flex items-center justify-between text-xs font-bold border-b-2 border-amber-600/30 pb-2.5 mb-6 text-slate-700 dark:text-slate-300">
                    <div className="font-arabic text-sm text-emerald-800 dark:text-emerald-400">
                      سُورَةُ {pageContent.primarySurahNameArabic}
                    </div>
                    <div className="font-arabic text-sm text-amber-800 dark:text-amber-400 font-bold">
                      الجزء {toArabicNumerals(pageContent.juzNumber)} · الحزب {toArabicNumerals(Math.ceil(pageContent.juzNumber * 2))}
                    </div>
                    <div className="font-arabic text-base font-bold">
                      صفحة {toArabicNumerals(pageContent.pageNumber)}
                    </div>
                  </div>

                  {/* Flowing Page Text Container */}
                  <div className="space-y-6">
                    
                    {/* Render Surahs appearing on this page */}
                    {pageContent.surahsOnPage.map((surah) => {
                      const surahAyahs = pageContent.ayahs.filter(a => a.surahNumber === surah.number);
                      if (surahAyahs.length === 0) return null;

                      return (
                        <div key={surah.number} className="space-y-4">
                          
                          {/* Traditional Surah Title Cartouche (if Surah starts on this page) */}
                          {surah.startsOnThisPage && (
                            <div className="my-6">
                              
                              {/* Ornate Gold Banner */}
                              <div className="border-2 border-amber-600/60 bg-gradient-to-r from-amber-700/10 via-amber-600/20 to-amber-700/10 rounded-xl p-3 text-center shadow-xs relative overflow-hidden">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-600 font-arabic text-sm">۩</div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 font-arabic text-sm">۩</div>
                                
                                <h3 className="font-arabic text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-300 tracking-wide">
                                  سُورَةُ {surah.nameArabic}
                                </h3>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-arabic">
                                  {surah.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'} · آيَاتُهَا {toArabicNumerals(surah.versesCount)}
                                </p>
                              </div>

                              {/* Bismillah Calligraphy Banner (except for Surah 9 At-Tawbah) */}
                              {surah.number !== 9 && (
                                <div className="text-center py-4 font-arabic text-2xl sm:text-3xl text-slate-800 dark:text-amber-200 select-none tracking-wide">
                                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                </div>
                              )}

                            </div>
                          )}

                          {/* Continuous Flowing Quranic Text */}
                          <div 
                            className={`font-arabic text-right leading-[2.6] sm:leading-[2.8] text-justify select-text ${
                              fontSize === 'large' ? 'text-2xl sm:text-3xl' : fontSize === 'xlarge' ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
                            }`}
                            dir="rtl"
                          >
                            {surahAyahs.map((ayah) => {
                              const isSelected = selectedAyah?.number === ayah.number;
                              // Clean leading basmalah if rendered separately in header
                              let verseText = ayah.textArabic;
                              if (ayah.numberInSurah === 1 && ayah.surahNumber !== 1 && ayah.surahNumber !== 9) {
                                verseText = verseText.replace(/^﻿?بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
                              }

                              return (
                                <span
                                  key={ayah.number}
                                  onClick={() => handleAyahClick(ayah)}
                                  className={`cursor-pointer transition-colors duration-150 rounded px-1 py-0.5 inline ${
                                    isSelected 
                                      ? 'bg-amber-300 dark:bg-amber-800/60 text-amber-950 dark:text-amber-100 shadow-xs' 
                                      : 'hover:bg-amber-100 dark:hover:bg-amber-950/40'
                                  }`}
                                  title={`Click to inspect Verse ${ayah.numberInSurah} of Surah ${ayah.surahNameEnglish}`}
                                >
                                  <span>{verseText} </span>
                                  {/* Authentic Ornate Ayah End Glyphs */}
                                  <span className="inline-flex items-center justify-center font-arabic text-amber-700 dark:text-amber-400 font-bold mx-1 select-none text-[0.8em]">
                                    ﴿{toArabicNumerals(ayah.numberInSurah)}﴾
                                  </span>
                                </span>
                              );
                            })}
                          </div>

                        </div>
                      );
                    })}

                  </div>

                  {/* Traditional Page Footer */}
                  <div className="mt-8 pt-3 border-t-2 border-amber-600/30 text-center font-arabic font-bold text-amber-800 dark:text-amber-400">
                    — {toArabicNumerals(pageContent.pageNumber)} —
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ── Interactive Floating Ayah Action Drawer ── */}
      {selectedAyah && (
        <div className={`mt-4 p-4 rounded-xl border shadow-xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
          isDark ? 'bg-slate-950 border-amber-600/40 text-white' : 'bg-white border-amber-600/30 text-slate-900'
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-xs">
                {selectedAyah.numberInSurah}
              </span>
              <h4 className="font-bold text-sm">
                Surah {selectedAyah.surahNameEnglish} · Ayah {selectedAyah.numberInSurah}
              </h4>
              <span className="font-arabic text-emerald-700 dark:text-emerald-400 text-sm">
                ({selectedAyah.surahNameArabic})
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {selectedAyah.page} · Juz {selectedAyah.juz}
              </span>
            </div>

            <button
              onClick={() => setSelectedAyah(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Full Arabic text of selected Ayah */}
          <div className="font-arabic text-xl sm:text-2xl text-right leading-relaxed text-amber-900 dark:text-amber-200 p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40" dir="rtl">
            {selectedAyah.textArabic}
          </div>

          {/* English Translation */}
          {selectedAyah.translation && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 italic">
              "{selectedAyah.translation}"
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAyahAudio(selectedAyah)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                {isPreviewingAyah ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPreviewingAyah ? 'Playing Surah' : `Recite by ${currentReciter.name}`}</span>
              </button>

              <button
                onClick={() => handleCopyAyah(selectedAyah)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
              >
                {copiedAyah ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAyah ? 'Copied' : 'Copy Verse'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400">
              Click any word or verse on the page to inspect
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Page Info Bar ── */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Madinah Mushaf Standard (King Fahd Glorious Quran Printing Complex) · 604 Pages</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Use Left/Right keyboard arrows to turn pages</span>
          <span>·</span>
          <span>{bookmarks.length} Bookmarks saved</span>
        </div>
      </div>

      {/* ── Audio Stream Health & Reciter Diagnostic Modal ── */}
      <AudioHealthCheckerModal
        isOpen={isAudioHealthOpen}
        onClose={() => setIsAudioHealthOpen(false)}
        currentReciter={currentReciter}
        onSelectReciter={(r) => {
          if (onSelectReciter) onSelectReciter(r);
        }}
        onSelectSurah={(sId) => {
          onSelectSurah(sId);
          goToPage(getSurahById(sId)?.pageStart || 1);
        }}
      />

    </div>
  );
};

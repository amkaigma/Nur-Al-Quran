import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Mic, 
  Volume2, 
  Sparkles,
  Download,
  BookOpen,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SurahMeta, Reciter, Ayah } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { fetchSurahVerses } from '../services/quranApi';
import { markSurahCompleted, updateLastStopped } from '../services/storage';
import { getSurahAudioUrl } from '../data/reciters';
import { TraditionalMushafReader } from './TraditionalMushafReader';

interface QuranReaderProps {
  currentSurahId: number;
  onSelectSurah: (surahId: number) => void;
  currentReciter: Reciter;
  isPlaying: boolean;
  onTogglePlay: () => void;
  completedSurahIds: number[];
  onProgressUpdate: () => void;
  onOpenTajweedTarget: (surahId: number, ayahNumber: number) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  currentSurahId,
  onSelectSurah,
  currentReciter,
  isPlaying,
  onTogglePlay,
  completedSurahIds,
  onProgressUpdate,
  onOpenTajweedTarget
}) => {
  const [readerMode, setReaderMode] = useState<'mushaf_pages' | 'verse_list'>('mushaf_pages');
  const [surahSearch, setSurahSearch] = useState('');
  const [quickJumpInput, setQuickJumpInput] = useState('');
  const [isJumpDropdownOpen, setIsJumpDropdownOpen] = useState(false);
  const [jumpFeedback, setJumpFeedback] = useState<string | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);
  const [showTajweedHints, setShowTajweedHints] = useState<boolean>(true);

  const currentSurah = getSurahById(currentSurahId) || SURAHS[0];
  const isCompleted = completedSurahIds.includes(currentSurahId);

  // Quick jump suggestions
  const jumpSuggestions = React.useMemo(() => {
    const q = quickJumpInput.toLowerCase().trim();
    if (!q) return [];
    return SURAHS.filter(s => 
      s.id.toString() === q ||
      s.id.toString().startsWith(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.transliteration.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [quickJumpInput]);

  const handleQuickJumpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = quickJumpInput.trim();
    if (!query) return;

    // Check if direct number (1-114)
    const num = parseInt(query, 10);
    if (!isNaN(num) && num >= 1 && num <= 114) {
      onSelectSurah(num);
      setQuickJumpInput('');
      setIsJumpDropdownOpen(false);
      setJumpFeedback(`Jumped to Surah ${num}: ${getSurahById(num)?.nameEnglish}`);
      setTimeout(() => setJumpFeedback(null), 3000);
      return;
    }

    // Check if matches a name
    const match = SURAHS.find(s => 
      s.nameEnglish.toLowerCase() === query.toLowerCase() ||
      s.nameEnglish.toLowerCase().includes(query.toLowerCase()) ||
      s.transliteration.toLowerCase().includes(query.toLowerCase()) ||
      s.nameArabic.includes(query)
    );

    if (match) {
      onSelectSurah(match.id);
      setQuickJumpInput('');
      setIsJumpDropdownOpen(false);
      setJumpFeedback(`Jumped to Surah ${match.id}: ${match.nameEnglish}`);
      setTimeout(() => setJumpFeedback(null), 3000);
    } else {
      setJumpFeedback(`Could not find "${query}". Please enter a Surah name or number from 1 to 114.`);
      setTimeout(() => setJumpFeedback(null), 4000);
    }
  };

  const handleSelectJumpSuggestion = (surahId: number) => {
    onSelectSurah(surahId);
    setQuickJumpInput('');
    setIsJumpDropdownOpen(false);
    setJumpFeedback(`Jumped to Surah ${surahId}: ${getSurahById(surahId)?.nameEnglish}`);
    setTimeout(() => setJumpFeedback(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoadingAyahs(true);

    fetchSurahVerses(currentSurahId).then((fetched) => {
      if (isMounted) {
        setAyahs(fetched);
        setIsLoadingAyahs(false);
      }
    });

    updateLastStopped(currentSurahId, 1, currentReciter.id);
    onProgressUpdate();

    return () => {
      isMounted = false;
    };
  }, [currentSurahId, currentReciter.id]);

  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    markSurahCompleted(currentSurahId, nextState);
    onProgressUpdate();

    if (nextState) {
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleDownloadSurah = () => {
    const url = getSurahAudioUrl(currentReciter, currentSurahId);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${currentReciter.name.replace(/[^a-zA-Z0-9]/g, '_')}_Surah_${currentSurahId.toString().padStart(3, '0')}_${currentSurah.transliteration}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSurahs = SURAHS.filter(s => {
    const q = surahSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.id.toString() === q ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.transliteration.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* ── Quran Reader Mode Switcher Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        
        {/* Mode Selector Segmented Controls */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setReaderMode('mushaf_pages')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              readerMode === 'mushaf_pages'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Traditional Printed Mushaf (Pages 1-604)</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400 text-amber-950">
              Mushaf
            </span>
          </button>

          <button
            onClick={() => setReaderMode('verse_list')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              readerMode === 'verse_list'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Verse Study View</span>
          </button>
        </div>

        {/* Current Surah Context Meta */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pr-2">
          <span>Current:</span>
          <strong className="text-slate-900 dark:text-white font-bold">Surah {currentSurah.id}. {currentSurah.nameEnglish}</strong>
          <span className="font-arabic text-emerald-700 dark:text-emerald-400 font-bold">({currentSurah.nameArabic})</span>
          <span>·</span>
          <span>Page {currentSurah.pageStart}</span>
          <span>·</span>
          <span>Juz {currentSurah.juzStart}</span>
        </div>

      </div>

      {/* ── Mode 1: Traditional Printed Mushaf (Default & Complete Pages) ── */}
      {readerMode === 'mushaf_pages' ? (
        <TraditionalMushafReader
          initialPage={currentSurah.pageStart}
          currentSurahId={currentSurahId}
          onSelectSurah={onSelectSurah}
          currentReciter={currentReciter}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onSwitchToStudyView={() => setReaderMode('verse_list')}
        />
      ) : (
        /* ── Mode 2: Detailed Verse-by-Verse List & Study Layout ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: 114 Surahs Navigation List */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[750px] transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Index of 114 Surahs
                </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{completedSurahIds.length}</span>
              <span aria-hidden="true"> / </span>
              <span>114 Completed</span>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={surahSearch}
              onChange={(e) => setSurahSearch(e.target.value)}
              placeholder="Search surah (e.g. Fatiha, Ali Imran, 36)..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-1">
          {filteredSurahs.map((surah) => {
            const isSelected = surah.id === currentSurahId;
            const surahDone = completedSurahIds.includes(surah.id);

            return (
              <button
                key={surah.id}
                onClick={() => onSelectSurah(surah.id)}
                className={`w-full text-left px-3.5 py-3 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-700 text-white font-medium shadow-sm'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold tabular-nums shrink-0 ${
                    isSelected 
                      ? 'bg-emerald-800 text-amber-300' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {surah.id}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate">
                      {surah.nameEnglish}
                    </div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {surah.versesCount} Ayahs · {surah.revelationType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-arabic text-base ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {surah.nameArabic}
                  </span>
                  {surahDone && (
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Surah Text & Recitation View */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Quick Jump to Specific Surah by Name or Number Input Field */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3 relative transition-colors">
          <div className="flex items-center justify-between">
            <label htmlFor="quick-surah-jump" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Quick Jump to Surah (1-114)</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Enter number (e.g. 3, 36, 114) or name (e.g. Ali Imran, Fatiha)
            </span>
          </div>

          <form onSubmit={handleQuickJumpSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="quick-surah-jump"
                type="text"
                value={quickJumpInput}
                onChange={(e) => {
                  setQuickJumpInput(e.target.value);
                  setIsJumpDropdownOpen(true);
                }}
                onFocus={() => setIsJumpDropdownOpen(true)}
                placeholder="Jump to Surah by name or number (e.g. 1, 3, 36, 67, Ali Imran, Yasin)..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors shrink-0"
            >
              Jump to Surah
            </button>
          </form>

          {/* Quick Jump Suggestions Dropdown */}
          {isJumpDropdownOpen && jumpSuggestions.length > 0 && (
            <div className="absolute left-4 right-4 sm:left-5 sm:right-5 top-[95px] z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex justify-between items-center">
                <span>Matching Surahs</span>
                <button
                  type="button"
                  onClick={() => setIsJumpDropdownOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  Close
                </button>
              </div>
              {jumpSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectJumpSuggestion(s.id)}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center tabular-nums">
                      {s.id}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
                        {s.nameEnglish}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">
                        ({s.meaning})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {s.versesCount} verses
                    </span>
                    <span className="font-arabic text-base text-emerald-900 dark:text-emerald-300 font-semibold" dir="rtl">
                      {s.nameArabic}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Jump Feedback Banner */}
          {jumpFeedback && (
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-1.5 animate-in fade-in duration-150">
              {jumpFeedback}
            </div>
          )}

          {/* Quick Surah Jump Shortcut Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">Popular:</span>
            {[
              { id: 1, name: 'Al-Fatihah' },
              { id: 2, name: 'Al-Baqarah' },
              { id: 3, name: "Ali 'Imran" },
              { id: 18, name: 'Al-Kahf' },
              { id: 36, name: 'Ya-Sin' },
              { id: 55, name: 'Ar-Rahman' },
              { id: 67, name: 'Al-Mulk' },
              { id: 112, name: 'Al-Ikhlas' },
              { id: 114, name: 'An-Nas' }
            ].map((quick) => (
              <button
                key={quick.id}
                type="button"
                onClick={() => onSelectSurah(quick.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  currentSurahId === quick.id
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                #{quick.id} {quick.name}
              </button>
            ))}
          </div>
        </div>

        {/* Surah Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm transition-colors">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Surah {currentSurah.id} of 114</span>
                <span aria-hidden="true">·</span>
                <span>Juz {currentSurah.juzStart}</span>
                <span aria-hidden="true">·</span>
                <span>{currentSurah.revelationType}</span>
                <span aria-hidden="true">·</span>
                <span>{currentSurah.versesCount} Verses</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span>{currentSurah.nameEnglish}</span>
                <span className="font-arabic text-2xl text-emerald-800 dark:text-emerald-400">
                  {currentSurah.nameArabic}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Meaning: "{currentSurah.meaning}" · Transliteration: {currentSurah.transliteration}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Recite Surah'}</span>
              </button>

              <button
                onClick={handleToggleComplete}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isCompleted 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-700 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40' : 'text-slate-400'}`} />
                <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
              </button>

              <button
                onClick={handleDownloadSurah}
                title={`Download MP3 of Surah ${currentSurah.nameEnglish} by ${currentReciter.name}`}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Download MP3</span>
              </button>
            </div>
          </div>

          {/* Reciter Context Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Current Reciter:</span>
              <strong className="text-slate-900 dark:text-white">{currentReciter.name}</strong>
              {currentReciter.countryCode === 'NG' && (
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                  🇳🇬 Nigeria {currentReciter.city ? `(${currentReciter.city})` : ''}
                </span>
              )}
              <span className="text-slate-400 dark:text-slate-500 font-arabic">({currentReciter.arabicName})</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTajweedHints(!showTajweedHints)}
                className={`text-xs font-medium hover:underline flex items-center gap-1 ${
                  showTajweedHints ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{showTajweedHints ? 'Tajweed Guidance: Active' : 'Show Tajweed Guidance'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bismillah Header (Except Surah At-Tawbah 9) */}
        {currentSurah.id !== 9 && (
          <div className="text-center py-6 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100/70 dark:border-emerald-900/40 transition-colors">
            <div className="font-arabic text-2xl sm:text-3xl text-emerald-950 dark:text-emerald-200 font-bold select-none tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1">
              In the name of Allah, the Entirely Merciful, the Especially Merciful.
            </div>
          </div>
        )}

        {/* Verses Container */}
        {isLoadingAyahs ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading Holy Quranic verses...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ayahs.map((ayah) => (
              <div
                key={ayah.numberInSurah}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-center text-xs tabular-nums">
                      {ayah.numberInSurah}
                    </span>
                    <span>Ayah {ayah.numberInSurah}</span>
                  </div>

                  <button
                    onClick={() => onOpenTajweedTarget(currentSurahId, ayah.numberInSurah)}
                    className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Practice Tajweed for this Ayah</span>
                  </button>
                </div>

                <div 
                  className="font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 leading-[2.2] text-right font-medium" 
                  dir="rtl"
                >
                  {ayah.textArabic}
                  <span className="inline-flex items-center justify-center mx-2 font-sans text-xs text-emerald-800 dark:text-emerald-400 border border-emerald-600/40 dark:border-emerald-500/40 rounded-full w-7 h-7 align-middle select-none">
                    {ayah.numberInSurah}
                  </span>
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                  {ayah.translation}
                </div>

                {showTajweedHints && ayah.tajweedNotes && ayah.tajweedNotes.length > 0 && (
                  <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">Tajweed Rules:</span>
                    {ayah.tajweedNotes.map((note, nIdx) => (
                      <span key={nIdx} className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Surah Pagination / Navigation */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <button
            onClick={() => onSelectSurah(currentSurahId > 1 ? currentSurahId - 1 : 114)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Surah</span>
          </button>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Surah {currentSurahId} / 114
          </span>

          <button
            onClick={() => onSelectSurah(currentSurahId < 114 ? currentSurahId + 1 : 1)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <span>Next Surah</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )}

</div>
);
};

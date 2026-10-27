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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SurahMeta, Reciter, Ayah } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { fetchSurahVerses } from '../services/quranApi';
import { markSurahCompleted, updateLastStopped } from '../services/storage';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Sidebar: 114 Surahs Navigation List */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-slate-900">
              Index of 114 Surahs
            </h2>
            <div className="text-xs text-slate-500 font-medium">
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
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
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
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold tabular-nums shrink-0 ${
                    isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {surah.id}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate">
                      {surah.nameEnglish}
                    </div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {surah.versesCount} Ayahs · {surah.revelationType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-arabic text-base ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {surah.nameArabic}
                  </span>
                  {surahDone && (
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
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
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 relative">
          <div className="flex items-center justify-between">
            <label htmlFor="quick-surah-jump" className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick Jump to Surah (1-114)</span>
            </label>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Enter number (e.g. 3, 36, 114) or name (e.g. Ali Imran, Fatiha)
            </span>
          </div>

          <form onSubmit={handleQuickJumpSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors shrink-0"
            >
              Jump to Surah
            </button>
          </form>

          {/* Quick Jump Suggestions Dropdown */}
          {isJumpDropdownOpen && jumpSuggestions.length > 0 && (
            <div className="absolute left-4 right-4 sm:left-5 sm:right-5 top-[95px] z-30 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-semibold text-slate-500 flex justify-between items-center">
                <span>Matching Surahs</span>
                <button
                  type="button"
                  onClick={() => setIsJumpDropdownOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Close
                </button>
              </div>
              {jumpSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectJumpSuggestion(s.id)}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center tabular-nums">
                      {s.id}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        {s.nameEnglish}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        ({s.meaning})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      {s.versesCount} verses
                    </span>
                    <span className="font-arabic text-base text-emerald-900 font-semibold" dir="rtl">
                      {s.nameArabic}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Jump Feedback Banner */}
          {jumpFeedback && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 animate-in fade-in duration-150">
              {jumpFeedback}
            </div>
          )}

          {/* Quick Surah Jump Shortcut Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Popular:</span>
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
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                #{quick.id} {quick.name}
              </button>
            ))}
          </div>
        </div>

        {/* Surah Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Surah {currentSurah.id} of 114</span>
                <span aria-hidden="true">·</span>
                <span>Juz {currentSurah.juzStart}</span>
                <span aria-hidden="true">·</span>
                <span>{currentSurah.revelationType}</span>
                <span aria-hidden="true">·</span>
                <span>{currentSurah.versesCount} Verses</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span>{currentSurah.nameEnglish}</span>
                <span className="font-arabic text-2xl text-emerald-800">
                  {currentSurah.nameArabic}
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Meaning: "{currentSurah.meaning}" · Transliteration: {currentSurah.transliteration}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Recite Surah'}</span>
              </button>

              <button
                onClick={handleToggleComplete}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isCompleted 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-700 fill-emerald-100' : 'text-slate-400'}`} />
                <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>
          </div>

          {/* Reciter Context Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Current Reciter:</span>
              <strong className="text-slate-900">{currentReciter.name}</strong>
              <span className="text-slate-400 font-arabic">({currentReciter.arabicName})</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTajweedHints(!showTajweedHints)}
                className={`text-xs font-medium hover:underline flex items-center gap-1 ${
                  showTajweedHints ? 'text-emerald-700' : 'text-slate-500'
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
          <div className="text-center py-6 bg-emerald-50/50 rounded-xl border border-emerald-100/70">
            <div className="font-arabic text-2xl sm:text-3xl text-emerald-950 font-bold select-none tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-xs text-emerald-800/80 mt-1">
              In the name of Allah, the Entirely Merciful, the Especially Merciful.
            </div>
          </div>
        )}

        {/* Verses Container */}
        {isLoadingAyahs ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500">Loading Holy Quranic verses...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ayahs.map((ayah) => (
              <div
                key={ayah.numberInSurah}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100/70 text-emerald-800 font-semibold flex items-center justify-center text-xs tabular-nums">
                      {ayah.numberInSurah}
                    </span>
                    <span>Ayah {ayah.numberInSurah}</span>
                  </div>

                  <button
                    onClick={() => onOpenTajweedTarget(currentSurahId, ayah.numberInSurah)}
                    className="text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-emerald-50 transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Practice Tajweed for this Ayah</span>
                  </button>
                </div>

                <div 
                  className="font-arabic text-2xl sm:text-3xl text-slate-900 leading-[2.2] text-right font-medium" 
                  dir="rtl"
                >
                  {ayah.textArabic}
                  <span className="inline-flex items-center justify-center mx-2 font-sans text-xs text-emerald-800 border border-emerald-600/40 rounded-full w-7 h-7 align-middle select-none">
                    {ayah.numberInSurah}
                  </span>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                  {ayah.translation}
                </div>

                {showTajweedHints && ayah.tajweedNotes && ayah.tajweedNotes.length > 0 && (
                  <div className="pt-2 text-xs text-slate-600 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-emerald-800">Tajweed Rules:</span>
                    {ayah.tajweedNotes.map((note, nIdx) => (
                      <span key={nIdx} className="bg-slate-50 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
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
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Surah</span>
          </button>

          <span className="text-xs font-medium text-slate-500">
            Surah {currentSurahId} / 114
          </span>

          <button
            onClick={() => onSelectSurah(currentSurahId < 114 ? currentSurahId + 1 : 1)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <span>Next Surah</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

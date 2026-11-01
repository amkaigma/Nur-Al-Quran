import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Home, 
  Building2, 
  Utensils, 
  Compass, 
  HeartHandshake, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  Info, 
  Share2,
  ChevronRight,
  Filter,
  CheckCheck
} from 'lucide-react';
import { 
  HISNUL_SECTIONS, 
  HISNUL_DUAS, 
  HisnulDuaItem, 
  HisnulSection, 
  getHisnulDuasBySection, 
  searchHisnulDuas 
} from '../data/hisnulMuslimData';

export const HisnulMuslimExperience: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('morning_evening');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [languageMode, setLanguageMode] = useState<'all' | 'en_ar' | 'ha_ar' | 'arabic'>('all');
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  // Repetition counters: Map of duaId -> current count
  const [counters, setCounters] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_hisnul_counters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_hisnul_bookmarks');
      return saved ? JSON.parse(saved) : ['me-1', 'me-3'];
    } catch {
      return ['me-1', 'me-3'];
    }
  });

  const incrementCount = (id: string, targetCount: number) => {
    setCounters(prev => {
      const current = prev[id] || 0;
      const next = current + 1;
      const updated = { ...prev, [id]: next };
      try {
        localStorage.setItem('nur_quran_hisnul_counters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetCount = (id: string) => {
    setCounters(prev => {
      const updated = { ...prev, [id]: 0 };
      try {
        localStorage.setItem('nur_quran_hisnul_counters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetAllInSection = () => {
    const sectionDuas = getHisnulDuasBySection(selectedSectionId);
    setCounters(prev => {
      const updated = { ...prev };
      sectionDuas.forEach(d => {
        updated[d.id] = 0;
      });
      try {
        localStorage.setItem('nur_quran_hisnul_counters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('nur_quran_hisnul_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCopy = (dua: HisnulDuaItem) => {
    const text = `${dua.title} (${dua.arabicTitle})\n\n${dua.arabic}\n\nTransliteration:\n${dua.transliteration}\n\nEnglish:\n${dua.english}\n\nHausa:\n${dua.hausa}\n\nReference: ${dua.reference}\n— Fortress of the Muslim (Hisnul Muslim)`;
    navigator.clipboard.writeText(text);
    setCopiedDuaId(dua.id);
    setTimeout(() => setCopiedDuaId(null), 2500);
  };

  // Filtered duas
  const displayedDuas = useMemo(() => {
    if (searchQuery.trim()) {
      return searchHisnulDuas(searchQuery);
    }
    return getHisnulDuasBySection(selectedSectionId);
  }, [searchQuery, selectedSectionId]);

  // Section icon resolver
  const renderSectionIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Sun': return <Sun className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      default: return <ShieldCheck className={className} />;
    }
  };

  const activeSection = HISNUL_SECTIONS.find(s => s.id === selectedSectionId) || HISNUL_SECTIONS[0];

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-600/30 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 font-arabic text-8xl text-white/5 select-none pointer-events-none">
          حصن المسلم
        </div>

        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Experience · حصن المسلم من أذكار الكتاب والسنة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hisnul Muslim (Fortress of the Muslim)
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Authentic prophetic supplications compiled by Shaykh Sa'id ibn Wahf al-Qahtani across 10 structured life situations. Features authentic Arabic, English, Hausa meanings, Hadith references, and interactive repetition counters.
          </p>

          {/* Quick Search */}
          <div className="pt-2 relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Hisnul Muslim duas in Arabic, English or Hausa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white placeholder-slate-400 text-xs shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Language Display Filters & Global Section Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Languages:
          </span>
          <button
            onClick={() => setLanguageMode('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              languageMode === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All (Ar + En + Ha)
          </button>
          <button
            onClick={() => setLanguageMode('en_ar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              languageMode === 'en_ar'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Arabic & English
          </button>
          <button
            onClick={() => setLanguageMode('ha_ar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              languageMode === 'ha_ar'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Arabic & Hausa
          </button>
          <button
            onClick={() => setLanguageMode('arabic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              languageMode === 'arabic'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Arabic Only
          </button>
        </div>

        {!searchQuery && (
          <button
            onClick={resetAllInSection}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Section Counters</span>
          </button>
        )}
      </div>

      {/* 10 Organized Category Tabs */}
      {!searchQuery && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {HISNUL_SECTIONS.map((sec, idx) => {
            const isSelected = selectedSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`flex flex-col items-start text-left p-3 rounded-2xl border transition-all text-xs relative ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-700 text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400'}`}>
                    {renderSectionIcon(sec.icon, 'w-3.5 h-3.5')}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {idx + 1} / 10
                  </span>
                </div>

                <div className="font-bold line-clamp-1 text-xs">
                  {sec.title}
                </div>
                <div className={`font-arabic text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {sec.arabicTitle}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Section Description Bar (When not searching) */}
      {!searchQuery && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
              {renderSectionIcon(activeSection.icon, 'w-5 h-5')}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {activeSection.title} · <span className="font-arabic font-normal text-emerald-700 dark:text-emerald-400">{activeSection.arabicTitle}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                {activeSection.description}
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 shrink-0 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
            {displayedDuas.length} Authentic Supplications
          </div>
        </div>
      )}

      {/* Duas List */}
      <div className="space-y-4">
        {displayedDuas.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No supplications found for "{searchQuery}"</h4>
            <p className="text-xs text-slate-500 mt-1">Try another keyword in English, Arabic, or Hausa.</p>
          </div>
        ) : (
          displayedDuas.map((dua, index) => {
            const currentCount = counters[dua.id] || 0;
            const isCompleted = currentCount >= dua.targetCount;
            const isBookmarked = bookmarkedIds.includes(dua.id);

            return (
              <div 
                key={dua.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all shadow-xs ${
                  isCompleted 
                    ? 'border-emerald-500/60 dark:border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Dua Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {dua.title}
                      </h4>
                    </div>
                    <div className="font-arabic text-xs text-slate-400 mt-0.5 ml-8">
                      {dua.arabicTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(dua)}
                      title="Copy dua"
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                    >
                      {copiedDuaId === dua.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleBookmark(dua.id)}
                      title="Bookmark dua"
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500 hover:border-amber-300 transition-colors"
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Arabic Text (Pristine, bold Amiri typography) */}
                <div className="py-4 text-right">
                  <p className="font-arabic font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-50 leading-[2.2] tracking-wide select-text">
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                {(languageMode === 'all' || languageMode === 'en_ar') && (
                  <div className="text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-3 select-text">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1 not-italic">Pronunciation:</span>
                    {dua.transliteration}
                  </div>
                )}

                {/* English Translation */}
                {(languageMode === 'all' || languageMode === 'en_ar') && (
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 select-text">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 mr-1">English:</span>
                    {dua.english}
                  </div>
                )}

                {/* Hausa Translation */}
                {(languageMode === 'all' || languageMode === 'ha_ar') && (
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/40 dark:bg-amber-950/10 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 mb-3 select-text">
                    <span className="font-bold text-amber-800 dark:text-amber-400 mr-1">Hausa (Ma'ana):</span>
                    {dua.hausa}
                  </div>
                )}

                {/* Virtue & Benefit */}
                {dua.virtue && (
                  <div className="text-xs text-emerald-900 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 flex items-start gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="font-bold">Virtue:</strong> {dua.virtue}</span>
                  </div>
                )}

                {/* Footer Controls & Repetition Counter */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <span className="font-sans font-bold text-slate-500">Source:</span>
                    <span>{dua.reference}</span>
                  </div>

                  {/* Interactive Tap Repetition Counter */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => incrementCount(dua.id, dua.targetCount)}
                      className={`flex-1 sm:flex-initial px-4 py-2 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-white" />
                          <span>Target Met: {currentCount} / {dua.targetCount} ✓</span>
                        </>
                      ) : (
                        <>
                          <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs flex items-center justify-center font-bold">
                            +1
                          </span>
                          <span>Tap to Count ({currentCount} / {dua.targetCount})</span>
                        </>
                      )}
                    </button>

                    {currentCount > 0 && (
                      <button
                        onClick={() => resetCount(dua.id)}
                        title="Reset counter"
                        className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

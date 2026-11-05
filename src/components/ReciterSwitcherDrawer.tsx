import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Check, 
  Volume2, 
  Radio, 
  Globe, 
  Sparkles, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Reciter } from '../types/quran';
import { RECITERS, getSurahAudioUrl, isSurahAvailableForReciter } from '../data/reciters';
import { RIWAYAT } from '../data/riwayat';
import { SURAHS, getSurahById } from '../data/surahs';

interface ReciterSwitcherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentReciter: Reciter;
  currentSurahId: number;
  onSelectReciter: (newReciter: Reciter, resumePlay?: boolean) => void;
}

export const ReciterSwitcherDrawer: React.FC<ReciterSwitcherDrawerProps> = ({
  isOpen,
  onClose,
  currentReciter,
  currentSurahId,
  onSelectReciter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiwayahFilter, setSelectedRiwayahFilter] = useState<string>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  
  // Voice preview state
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [previewingReciterId, setPreviewingReciterId] = useState<string | null>(null);

  const currentSurah = getSurahById(currentSurahId) || SURAHS[0];

  // Distinct countries/regions for filter
  const regions = useMemo(() => {
    const list = Array.from(new Set(RECITERS.map(r => r.country)));
    return ['all', 'Nigeria', ...list.filter(c => c !== 'Nigeria')];
  }, []);

  // Filtered reciters
  const filteredReciters = useMemo(() => {
    return RECITERS.filter(r => {
      // Riwayah filter
      if (selectedRiwayahFilter !== 'all' && r.riwayahId !== selectedRiwayahFilter) {
        return false;
      }
      // Region filter
      if (selectedRegionFilter !== 'all') {
        if (selectedRegionFilter === 'Nigeria' && r.countryCode !== 'NG') {
          return false;
        } else if (selectedRegionFilter !== 'Nigeria' && r.country !== selectedRegionFilter) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = r.name.toLowerCase().includes(q);
        const matchArabic = r.arabicName?.includes(q);
        const matchRiwayah = r.riwayah.toLowerCase().includes(q);
        const matchCountry = r.country.toLowerCase().includes(q);
        const matchAlts = r.alternativeSpellings?.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchArabic && !matchRiwayah && !matchCountry && !matchAlts) {
          return false;
        }
      }
      return true;
    });
  }, [selectedRiwayahFilter, selectedRegionFilter, searchQuery]);

  // Voice preview handler
  const handleTogglePreview = (reciter: Reciter, e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewingReciterId === reciter.id) {
      if (previewAudio) {
        previewAudio.pause();
      }
      setPreviewAudio(null);
      setPreviewingReciterId(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    // Play preview of current surah or first available surah
    const surahToTest = isSurahAvailableForReciter(reciter, currentSurahId) 
      ? currentSurahId 
      : (reciter.availableSurahs?.[0] || 1);
    const url = getSurahAudioUrl(reciter, surahToTest);
    const audio = new Audio(url);
    
    audio.play().then(() => {
      setPreviewAudio(audio);
      setPreviewingReciterId(reciter.id);
    }).catch(err => {
      console.warn('Voice preview error:', err);
      setPreviewAudio(null);
      setPreviewingReciterId(null);
    });

    audio.onended = () => {
      setPreviewAudio(null);
      setPreviewingReciterId(null);
    };
  };

  const handleSelectAndClose = (reciter: Reciter) => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setPreviewingReciterId(null);
    }
    onSelectReciter(reciter, true);
    onClose();
  };

  const handleClose = () => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setPreviewingReciterId(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[88vh] sm:max-h-[82vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
      >
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Change Reciter Voice</span>
                <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">
                  (Surah {currentSurah.id}. {currentSurah.nameEnglish})
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Continue listening seamlessly with a new verified Sheikh
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/40">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by reciter name (e.g. Ahmad Sulaiman, Al-Husary, Alafasy)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills / Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Region Select */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Country:</span>
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">🌍 All Regions</option>
                <option value="Nigeria">🇳🇬 Nigeria Masters</option>
                <option value="Egypt">🇪🇬 Egypt</option>
                <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                <option value="Kuwait">🇰🇼 Kuwait</option>
                <option value="Sudan & West Africa">🇸🇩 Sudan & West Africa</option>
                <option value="Somalia">🇸🇴 Somalia</option>
                <option value="Algeria">🇩🇿 Algeria</option>
                <option value="Libya">🇱🇾 Libya</option>
                <option value="Yemen">🇾🇪 Yemen</option>
              </select>
            </div>

            {/* Riwayah Select */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Riwayah:</span>
              <select
                value={selectedRiwayahFilter}
                onChange={(e) => setSelectedRiwayahFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">📖 All 20 Riwayat</option>
                <option value="hafs">Hafs 'an 'Asim (حفص عن عاصم)</option>
                <option value="warsh">Warsh 'an Nafi' (ورش عن نافع)</option>
                <option value="qalun">Qalun 'an Nafi' (قالون عن نافع)</option>
                <option value="ad_duri_abu_amr">Ad-Duri from Abu Amr (الدوري عن أبي عمرو)</option>
                <option value="as_susi">As-Susi (السوسي)</option>
                <option value="shubah">Shu'bah (شعبة)</option>
                <option value="khalaf_hamzah">Khalaf from Hamzah (خلف عن حمزة)</option>
                <option value="ad_duri_kisai">Ad-Duri from Al-Kisa'i (الدوري عن الكسائي)</option>
                <option value="ruways">Ruways (رويس)</option>
                <option value="hisham">Hisham (هشام)</option>
                <option value="ibn_dhakwan">Ibn Dhakwan (ابن ذكوان)</option>
                <option value="ibn_jammaz">Ibn Jammaz (ابن جماز)</option>
              </select>
            </div>

            <div className="ml-auto text-[11px] text-slate-400">
              {filteredReciters.length} available
            </div>
          </div>

        </div>

        {/* Reciters List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredReciters.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No reciters match your search filters. Try clearing the filters.
            </div>
          ) : (
            filteredReciters.map((reciter) => {
              const isSelected = currentReciter.id === reciter.id;
              const isPreviewing = previewingReciterId === reciter.id;
              const hasSurah = isSurahAvailableForReciter(reciter, currentSurahId);

              return (
                <div
                  key={reciter.id}
                  onClick={() => handleSelectAndClose(reciter)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  
                  {/* Left: Reciter Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      reciter.countryCode === 'NG'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {reciter.countryCode === 'NG' ? '🇳🇬' : reciter.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {reciter.name}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-bold">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          {reciter.riwayah}
                        </span>
                        <span>·</span>
                        <span>{reciter.country}</span>
                        <span>·</span>
                        <span className="font-mono text-[10px]">{reciter.style}</span>
                      </div>

                      {!hasSurah && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                          ⚠️ Surah {currentSurah.nameEnglish} not in catalog ({reciter.availableSurahs?.length} surahs recorded)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Preview button & Select Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    
                    {/* Preview Voice button */}
                    <button
                      onClick={(e) => handleTogglePreview(reciter, e)}
                      title={isPreviewing ? "Stop Preview" : "Preview Reciter Voice"}
                      className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                        isPreviewing
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isPreviewing ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[10px] hidden sm:inline">Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[10px] hidden sm:inline">Preview</span>
                        </>
                      )}
                    </button>

                    {/* Select indicator */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndClose(reciter);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-emerald-700 dark:hover:bg-emerald-500 dark:hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Select'}
                    </button>

                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Genuine Voice Match Guarantee</span>
          </div>
          <button
            onClick={handleClose}
            className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

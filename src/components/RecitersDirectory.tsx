import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Mic, 
  Star, 
  Globe, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Info,
  ListMusic,
  ArrowUpDown,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Reciter, Riwayah, RecitationStyle } from '../types/quran';
import { RECITERS, getSurahAudioUrl } from '../data/reciters';
import { RIWAYAT } from '../data/riwayat';
import { NIGERIAN_SCHOLARS_REGISTRY } from '../data/nigerianScholars';
import { toggleFavoriteReciter, getFavoriteReciters } from '../services/storage';
import { SurahListModal } from './SurahListModal';

interface RecitersDirectoryProps {
  currentReciter: Reciter;
  onSelectReciter: (reciter: Reciter, startPlay?: boolean) => void;
  onOpenTajweedWithReciter: (reciter: Reciter) => void;
  isPlaying: boolean;
  currentSurahId: number;
  onNavigateToRiwayah?: (riwayahId?: string) => void;
  onSelectSurahAndPlay?: (reciter: Reciter, surahId: number) => void;
  onOpenReaderWithSurah?: (reciter: Reciter, surahId: number) => void;
}

export const RecitersDirectory: React.FC<RecitersDirectoryProps> = ({
  currentReciter,
  onSelectReciter,
  onOpenTajweedWithReciter,
  isPlaying,
  currentSurahId,
  onNavigateToRiwayah,
  onSelectSurahAndPlay,
  onOpenReaderWithSurah
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiwayah, setSelectedRiwayah] = useState<string>('all');
  const [selectedQiraah, setSelectedQiraah] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedAudioAvailability, setSelectedAudioAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'country_asc'>('name_asc');
  const [selectedNigerianState, setSelectedNigerianState] = useState<string>('all');
  const [nigeriaViewMode, setNigeriaViewMode] = useState<'reciters' | 'registry'>('reciters');
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteReciters());
  const [previewReciterId, setPreviewReciterId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [surahModalReciter, setSurahModalReciter] = useState<Reciter | null>(null);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = toggleFavoriteReciter(id);
    setFavorites(updated);
  };

  const handlePreviewSample = (e: React.MouseEvent, reciter: Reciter) => {
    e.stopPropagation();
    if (previewReciterId === reciter.id && previewAudio) {
      previewAudio.pause();
      setPreviewReciterId(null);
      setPreviewAudio(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    const sampleUrl = getSurahAudioUrl(reciter, 1);
    const audio = new Audio(sampleUrl);
    audio.play().then(() => {
      setPreviewReciterId(reciter.id);
      setPreviewAudio(audio);
    }).catch(err => {
      console.warn('Preview failed:', err);
      if (reciter.backupServerUrl) {
        const backupUrl = `${reciter.backupServerUrl.endsWith('/') ? reciter.backupServerUrl : reciter.backupServerUrl + '/'}001.mp3`;
        const backupAudio = new Audio(backupUrl);
        backupAudio.play().then(() => {
          setPreviewReciterId(reciter.id);
          setPreviewAudio(backupAudio);
        }).catch(() => {
          setPreviewReciterId(null);
        });
      } else {
        setPreviewReciterId(null);
      }
    });

    audio.onended = () => {
      setPreviewReciterId(null);
      setPreviewAudio(null);
    };
  };

  const filteredReciters = useMemo(() => {
    const list = RECITERS.filter((reciter) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        reciter.name.toLowerCase().includes(q) ||
        reciter.arabicName.includes(q) ||
        (reciter.alternativeSpellings && reciter.alternativeSpellings.some(alt => alt.toLowerCase().includes(q))) ||
        reciter.country.toLowerCase().includes(q) ||
        (reciter.city && reciter.city.toLowerCase().includes(q)) ||
        (reciter.state && reciter.state.toLowerCase().includes(q)) ||
        reciter.bio.toLowerCase().includes(q) ||
        reciter.riwayah.toLowerCase().includes(q);

      const matchesRiwayah = 
        selectedRiwayah === 'all' || 
        reciter.riwayahId === selectedRiwayah;

      const matchesQiraah = 
        selectedQiraah === 'all' || 
        reciter.qiraahId === selectedQiraah;

      const matchesStyle = 
        selectedStyle === 'all' || 
        reciter.style.toLowerCase().includes(selectedStyle.toLowerCase());

      const matchesCountry = 
        selectedCountry === 'all' ||
        (selectedCountry === 'nigeria' && (reciter.countryCode === 'NG' || reciter.country.toLowerCase().includes('nigeria'))) ||
        (selectedCountry === 'egypt' && reciter.countryCode === 'EG') ||
        (selectedCountry === 'saudi' && reciter.countryCode === 'SA') ||
        (selectedCountry === 'sudan' && reciter.countryCode === 'SD') ||
        (selectedCountry === 'algeria' && reciter.countryCode === 'DZ') ||
        (selectedCountry === 'morocco' && reciter.countryCode === 'MA') ||
        (selectedCountry === 'libya' && reciter.countryCode === 'LY') ||
        (selectedCountry === 'kuwait' && reciter.countryCode === 'KW') ||
        (selectedCountry === 'somalia' && reciter.countryCode === 'SO') ||
        (selectedCountry === 'yemen' && reciter.countryCode === 'YE') ||
        (selectedCountry === 'iraq' && reciter.countryCode === 'IQ') ||
        (selectedCountry === 'syria' && reciter.countryCode === 'SY') ||
        (selectedCountry === 'lebanon' && reciter.countryCode === 'LB');

      const matchesNigerianState =
        selectedCountry !== 'nigeria' ||
        selectedNigerianState === 'all' ||
        (reciter.state && reciter.state.toLowerCase().includes(selectedNigerianState.toLowerCase())) ||
        (reciter.city && reciter.city.toLowerCase().includes(selectedNigerianState.toLowerCase()));

      const matchesAudioAvailability =
        selectedAudioAvailability === 'all' ||
        (selectedAudioAvailability === 'full' && reciter.availableSurahs.length === 114) ||
        (selectedAudioAvailability === 'available' && reciter.hasAudio);

      return matchesSearch && matchesRiwayah && matchesQiraah && matchesStyle && matchesCountry && matchesNigerianState && matchesAudioAvailability;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'country_asc') return a.country.localeCompare(b.country);
      return 0;
    });
  }, [searchQuery, selectedRiwayah, selectedQiraah, selectedStyle, selectedCountry, selectedNigerianState, selectedAudioAvailability, sortBy]);

  const filteredRegistry = useMemo(() => {
    return NIGERIAN_SCHOLARS_REGISTRY.filter((entry) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.arabicName.includes(q) ||
        entry.city.toLowerCase().includes(q) ||
        entry.state.toLowerCase().includes(q) ||
        entry.tradition.toLowerCase().includes(q) ||
        entry.bio.toLowerCase().includes(q);

      const matchesState =
        selectedNigerianState === 'all' ||
        entry.state.toLowerCase().includes(selectedNigerianState.toLowerCase()) ||
        entry.city.toLowerCase().includes(selectedNigerianState.toLowerCase());

      return matchesSearch && matchesState;
    });
  }, [searchQuery, selectedNigerianState]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Surah List Modal */}
      <SurahListModal
        reciter={surahModalReciter}
        isOpen={Boolean(surahModalReciter)}
        onClose={() => setSurahModalReciter(null)}
        currentSurahId={currentSurahId}
        isPlaying={isPlaying}
        onSelectSurahAndPlay={(rec, sId) => {
          if (onSelectSurahAndPlay) onSelectSurahAndPlay(rec, sId);
          else onSelectReciter(rec, true);
        }}
        onOpenReaderWithSurah={(rec, sId) => {
          if (onOpenReaderWithSurah) onOpenReaderWithSurah(rec, sId);
          else onSelectReciter(rec, true);
        }}
      />
      
      {/* Header & Hero Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-emerald-800/40 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-amber-300 mb-2 font-medium">
            <span>Global Reciters Directory</span>
            <span aria-hidden="true">·</span>
            <span>All 20 Canonical Riwayat</span>
            <span aria-hidden="true">·</span>
            <span>100% Genuine Voice Match Guarantee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            World Quran Reciters & Scholars Directory
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Browse verified Quranic recitations across Africa, the Middle East, and worldwide. Filter by Riwayah, Qira’ah, country, or recitation style, and listen to complete Surahs from verified audio sources with zero voice substitution.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{RECITERS.length} Verified Sheiks & Scholars</span>
            </span>
            <button
              onClick={() => onNavigateToRiwayah && onNavigateToRiwayah()}
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 rounded-md border border-amber-400/40 backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore 20 Canonical Riwayat Page →</span>
            </button>
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Zero Surrogate Voice Policy</span>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-emerald-900/30 font-arabic text-8xl select-none pointer-events-none hidden sm:block">
          اقْرَأْ
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reciter by name, alternative spellings, country, city, or Riwayah..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="name_asc">Sort: Name (A to Z)</option>
              <option value="name_desc">Sort: Name (Z to A)</option>
              <option value="country_asc">Sort: Country (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Multi-Filter Rows */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          
          {/* Row 1: Country Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Country:</span>
            </span>
            <button
              onClick={() => { setSelectedCountry('all'); setSelectedNigerianState('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCountry === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Countries
            </button>
            <button
              onClick={() => {
                setSelectedCountry('nigeria');
                setSelectedNigerianState('all');
                setNigeriaViewMode('reciters');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'nigeria'
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/40'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span>🇳🇬</span>
              <span>Nigeria</span>
            </button>
            <button
              onClick={() => setSelectedCountry('egypt')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'egypt'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇪🇬</span>
              <span>Egypt</span>
            </button>
            <button
              onClick={() => setSelectedCountry('saudi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'saudi'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇸🇦</span>
              <span>Saudi Arabia</span>
            </button>
            <button
              onClick={() => setSelectedCountry('sudan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'sudan'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇸🇩</span>
              <span>Sudan</span>
            </button>
            <button
              onClick={() => setSelectedCountry('morocco')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'morocco'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇲🇦</span>
              <span>Morocco</span>
            </button>
            <button
              onClick={() => setSelectedCountry('algeria')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'algeria'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇩🇿</span>
              <span>Algeria</span>
            </button>
            <button
              onClick={() => setSelectedCountry('libya')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'libya'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇱🇾</span>
              <span>Libya</span>
            </button>
            <button
              onClick={() => setSelectedCountry('somalia')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'somalia'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇸🇴</span>
              <span>Somalia</span>
            </button>
            <button
              onClick={() => setSelectedCountry('kuwait')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'kuwait'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇰🇼</span>
              <span>Kuwait</span>
            </button>
            <button
              onClick={() => setSelectedCountry('yemen')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'yemen'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇾🇪</span>
              <span>Yemen</span>
            </button>
            <button
              onClick={() => setSelectedCountry('iraq')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCountry === 'iraq'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇮🇶</span>
              <span>Iraq</span>
            </button>
          </div>

          {/* Nigeria View Mode & State Tabs when Nigeria selected */}
          {selectedCountry === 'nigeria' && (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                  <span>🇳🇬 Nigerian Scholars View Mode:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNigeriaViewMode('reciters')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      nigeriaViewMode === 'reciters'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Voice-Verified Reciters (Live Live Streams)
                  </button>
                  <button
                    onClick={() => setNigeriaViewMode('registry')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      nigeriaViewMode === 'registry'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    National Qaris Registry (34 Investigated)
                  </button>
                </div>
              </div>

              {/* State Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-emerald-200/50 dark:border-emerald-800/50">
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">State:</span>
                {[
                  { id: 'all', label: 'All Nigerian States' },
                  { id: 'kano', label: 'Kano' },
                  { id: 'sokoto', label: 'Sokoto' },
                  { id: 'kaduna', label: 'Kaduna / Zaria' },
                  { id: 'bauchi', label: 'Bauchi' },
                  { id: 'kebbi', label: 'Kebbi' },
                  { id: 'borno', label: 'Borno / Maiduguri' },
                  { id: 'gombe', label: 'Gombe' }
                ].map(stateTab => (
                  <button
                    key={stateTab.id}
                    onClick={() => setSelectedNigerianState(stateTab.id)}
                    className={`px-2 py-0.5 text-[11px] rounded whitespace-nowrap transition-colors ${
                      selectedNigerianState === stateTab.id
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {stateTab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Riwayah & Qiraah Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Riwayah Filter Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Filter by Riwayah (20 Canonical):
              </label>
              <select
                value={selectedRiwayah}
                onChange={(e) => setSelectedRiwayah(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">All Riwayat (All 20 Canonical Transmissions)</option>
                {RIWAYAT.map(r => (
                  <option key={r.id} value={r.id}>
                    #{r.orderNumber} {r.nameEnglish} ({r.nameArabic}) — {r.transliteration}
                  </option>
                ))}
              </select>
            </div>

            {/* Qira'ah Filter Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Filter by Associated Qira'ah:
              </label>
              <select
                value={selectedQiraah}
                onChange={(e) => setSelectedQiraah(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">All 10 Mutawatir Qira'at</option>
                <option value="nafi">Nafi' al-Madani (نافع المدني)</option>
                <option value="ibn_kathir">Ibn Kathir al-Makki (ابن كثير المكي)</option>
                <option value="abu_amr">Abu 'Amr al-Basri (أبو عمرو البصري)</option>
                <option value="ibn_amir">Ibn 'Amir ash-Shami (ابن عامر الشامي)</option>
                <option value="asim">'Asim al-Kufi (عاصم الكوفي)</option>
                <option value="hamzah">Hamzah al-Kufi (حمزة الكوفي)</option>
                <option value="kisai">Al-Kisa'i al-Kufi (الكسائي الكوفي)</option>
                <option value="abu_jafar">Abu Ja'far al-Madani (أبو جعفر المدني)</option>
                <option value="yaqub">Ya'qub al-Hadrami (يعقوب الحضرمي)</option>
                <option value="khalaf_tenth">Khalaf the Tenth (خلف العاشر)</option>
              </select>
            </div>

            {/* Audio Availability Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Audio Availability:
              </label>
              <select
                value={selectedAudioAvailability}
                onChange={(e) => setSelectedAudioAvailability(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">All Available Audio</option>
                <option value="full">Complete 114 Surahs (Full Moshaf)</option>
                <option value="available">Verified Audio Live</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* Main Grid View */}
      {selectedCountry === 'nigeria' && nigeriaViewMode === 'registry' ? (
        /* Nigerian 34 Investigated Figures Registry View */
        <div className="space-y-5">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3 text-xs">
            <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-950 dark:text-emerald-100">
                Nigerian National Qaris & Scholars Registry (All 34 Investigated Figures)
              </h4>
              <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                To guarantee <strong>100% voice fidelity</strong> and eliminate voice mismatching, only reciters with verified, complete studio albums are playable in the audio bar. Scholars whose recitations exist in competition video archives or live lecture intros are honored below with their full biographies and regional origins.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRegistry.map((scholar) => {
              const matchedReciter = scholar.reciterId ? RECITERS.find(r => r.id === scholar.reciterId) : null;
              const isSelected = matchedReciter && currentReciter.id === matchedReciter.id;

              return (
                <div
                  key={scholar.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-all flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-700 shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-arabic text-xl font-bold text-slate-900 dark:text-white truncate" dir="rtl">
                          {scholar.arabicName}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {scholar.name}
                        </h3>
                      </div>
                      <span className="shrink-0 text-lg">🇳🇬</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <span>{scholar.city}, {scholar.state}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">{scholar.tradition}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {scholar.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    {scholar.verificationStatus === 'playable' && matchedReciter ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>100% Verified Individual Studio Album</span>
                        </div>
                        <button
                          onClick={() => onSelectReciter(matchedReciter, true)}
                          className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-white flex items-center justify-center gap-1.5 transition-colors ${
                            isSelected && isPlaying
                              ? 'bg-amber-600 hover:bg-amber-700'
                              : 'bg-emerald-700 hover:bg-emerald-800'
                          }`}
                        >
                          {isSelected && isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Now Reciting Surah {currentSurahId}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Listen Genuine Voice in Player</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                          <Award className="w-3.5 h-3.5 shrink-0" />
                          <span>National Musabaqah & Archive Record</span>
                        </div>
                        <p className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          Preserved in the Nigerian National Qaris Registry. Audio substitution strictly prohibited to guarantee 100% genuine voice fidelity.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Standard Live Audio Reciters Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReciters.map((reciter) => {
            const isSelected = currentReciter.id === reciter.id;
            const isFav = favorites.includes(reciter.id);
            const isPreviewing = previewReciterId === reciter.id;
            const isNigerian = reciter.countryCode === 'NG' || reciter.country.toLowerCase().includes('nigeria');

            return (
              <div
                key={reciter.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/20 bg-emerald-50/20 dark:bg-emerald-950/20' 
                    : isNigerian
                    ? 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Header row with Arabic calligraphy name & favorite */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-arabic text-xl font-bold text-slate-900 dark:text-white truncate" dir="rtl">
                        {reciter.arabicName}
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {reciter.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => handleToggleFavorite(e, reciter.id)}
                      aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav 
                          ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40' 
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Badges row with country & riwayah */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {isNigerian ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                        <span>🇳🇬</span>
                        <span>Nigeria {reciter.city ? `(${reciter.city})` : reciter.state ? `(${reciter.state})` : ''}</span>
                      </span>
                    ) : (
                      <span>{reciter.country}</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">{reciter.riwayah}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600 dark:text-slate-400">{reciter.style}</span>
                  </div>

                  {/* Scholarly biography */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {reciter.bio}
                  </p>

                  {/* Audio Source Verification Badge */}
                  <div className="mb-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Audio: {reciter.verifiedAudioSource}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    
                    {/* Select & Play button */}
                    <button
                      onClick={() => onSelectReciter(reciter, true)}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        isSelected && isPlaying
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : isSelected
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isSelected && isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Now Reciting Surah {currentSurahId}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isSelected ? 'Resume Recitation' : 'Listen Full Recitation'}</span>
                        </>
                      )}
                    </button>

                    {/* Sample Audio preview button */}
                    <button
                      onClick={(e) => handlePreviewSample(e, reciter)}
                      title="Sample Al-Fatiha voice preview"
                      className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                        isPreviewing 
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Complete Surahs Modal & Tajweed */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSurahModalReciter(reciter)}
                      className="flex-1 py-1.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ListMusic className="w-3.5 h-3.5" />
                      <span>Complete Surahs ({reciter.availableSurahs.length})</span>
                    </button>

                    <button
                      onClick={() => onOpenTajweedWithReciter(reciter)}
                      title="Practice Tajweed"
                      className="py-1.5 px-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Empty State when no reciters found */}
      {filteredReciters.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">No reciter matching your search and filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRiwayah('all');
              setSelectedQiraah('all');
              setSelectedCountry('all');
              setSelectedAudioAvailability('all');
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};

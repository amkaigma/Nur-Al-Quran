import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Mic, Star, Globe, Sparkles, Volume2, ShieldCheck, BookOpen, Award, CheckCircle2, Info } from 'lucide-react';
import { Reciter, Riwayah, RecitationStyle } from '../types/quran';
import { RECITERS, getSurahAudioUrl } from '../data/reciters';
import { NIGERIAN_SCHOLARS_REGISTRY } from '../data/nigerianScholars';
import { toggleFavoriteReciter, getFavoriteReciters } from '../services/storage';

interface RecitersDirectoryProps {
  currentReciter: Reciter;
  onSelectReciter: (reciter: Reciter, startPlay?: boolean) => void;
  onOpenTajweedWithReciter: (reciter: Reciter) => void;
  isPlaying: boolean;
  currentSurahId: number;
}

export const RecitersDirectory: React.FC<RecitersDirectoryProps> = ({
  currentReciter,
  onSelectReciter,
  onOpenTajweedWithReciter,
  isPlaying,
  currentSurahId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiwayah, setSelectedRiwayah] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedNigerianState, setSelectedNigerianState] = useState<string>('all');
  const [nigeriaViewMode, setNigeriaViewMode] = useState<'reciters' | 'registry'>('reciters');
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteReciters());
  const [previewReciterId, setPreviewReciterId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

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

    // Play Al-Fatiha (001.mp3) snippet using verified audio URL helper
    const sampleUrl = getSurahAudioUrl(reciter, 1);
    const audio = new Audio(sampleUrl);
    audio.play().then(() => {
      setPreviewReciterId(reciter.id);
      setPreviewAudio(audio);
    }).catch(err => {
      console.warn('Preview failed, attempting backup:', err);
      if (reciter.backupServerUrl) {
        const backupUrl = `${reciter.backupServerUrl.endsWith('/') ? reciter.backupServerUrl : reciter.backupServerUrl + '/'}001.mp3`;
        const backupAudio = new Audio(backupUrl);
        backupAudio.play().then(() => {
          setPreviewReciterId(reciter.id);
          setPreviewAudio(backupAudio);
        }).catch(err2 => {
          console.warn('Backup preview failed:', err2);
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
    return RECITERS.filter((reciter) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        reciter.name.toLowerCase().includes(q) ||
        reciter.arabicName.includes(q) ||
        reciter.country.toLowerCase().includes(q) ||
        (reciter.city && reciter.city.toLowerCase().includes(q)) ||
        (reciter.state && reciter.state.toLowerCase().includes(q)) ||
        reciter.bio.toLowerCase().includes(q) ||
        reciter.riwayah.toLowerCase().includes(q);

      const matchesRiwayah = 
        selectedRiwayah === 'all' || 
        reciter.riwayah.toLowerCase().includes(selectedRiwayah.toLowerCase());

      const matchesStyle = 
        selectedStyle === 'all' || 
        reciter.style.toLowerCase().includes(selectedStyle.toLowerCase());

      const matchesRegion = 
        selectedRegion === 'all' ||
        (selectedRegion === 'nigeria' && (reciter.countryCode === 'NG' || reciter.country.toLowerCase().includes('nigeria'))) ||
        (selectedRegion === 'egypt' && reciter.countryCode === 'EG') ||
        (selectedRegion === 'saudi' && reciter.countryCode === 'SA') ||
        (selectedRegion === 'sudan' && reciter.countryCode === 'SD');

      const matchesNigerianState =
        selectedRegion !== 'nigeria' ||
        selectedNigerianState === 'all' ||
        (reciter.state && reciter.state.toLowerCase().includes(selectedNigerianState.toLowerCase())) ||
        (reciter.city && reciter.city.toLowerCase().includes(selectedNigerianState.toLowerCase()));

      return matchesSearch && matchesRiwayah && matchesStyle && matchesRegion && matchesNigerianState;
    });
  }, [searchQuery, selectedRiwayah, selectedStyle, selectedRegion, selectedNigerianState]);

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
    <div className="space-y-8">
      
      {/* Header & Hero Intro */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-emerald-800/40 shadow-sm">
        {/* Subtle photo background with measured contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_quran_sanctuary_1793095241993.jpg"
            alt="Holy Quran on rehal stand in sacred mosque"
            className="w-full h-full object-cover object-center opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-950/70" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-amber-300 mb-2">
            <span>Global Scholars Catalog</span>
            <span aria-hidden="true">·</span>
            <span>Surah Al-Fatiha to Surah An-Nas (1-114)</span>
            <span aria-hidden="true">·</span>
            <span>Verified Audio Feeds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-sans">
            World Quran Reciters & Scholars
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Explore authentic recitations across the Islamic world. Select any Sheikh to listen to his complete Quran recitation from Surah Al-Fatiha to Surah An-Nas, track your progress, or benchmark your Tajweed alignment.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{RECITERS.length} Verified Sheiks & Scholars</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hafs, Warsh, Al-Duri Riwayahs</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Murattal & Mujawwad & Mu'allim Styles</span>
            </span>
          </div>
        </div>

        {/* Ambient subtle decorative calligraphy element */}
        <div className="absolute right-4 -bottom-6 text-emerald-900/30 font-arabic text-8xl select-none pointer-events-none hidden sm:block">
          اقْرَأْ
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Sheikh by name (e.g. Al-Husary, Alafasy, Minshawi), country, or Riwayah..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Interactive Segmented Filters (Functional Buttons) */}
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Row 1: Region / Country filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Region:</span>
            </span>
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Regions
            </button>
            <button
              onClick={() => {
                setSelectedRegion('nigeria');
                setSelectedNigerianState('all');
                setNigeriaViewMode('reciters');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedRegion === 'nigeria'
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/40'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span>🇳🇬</span>
              <span>Nigeria & West Africa</span>
            </button>
            <button
              onClick={() => {
                setSelectedRegion('egypt');
                setSelectedNigerianState('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === 'egypt'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Egypt (Golden Age)
            </button>
            <button
              onClick={() => {
                setSelectedRegion('saudi');
                setSelectedNigerianState('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === 'saudi'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Haramain & Gulf
            </button>
            <button
              onClick={() => {
                setSelectedRegion('sudan');
                setSelectedNigerianState('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === 'sudan'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sudan & Maghreb
            </button>
          </div>

          {/* Nigerian Section Options */}
          {selectedRegion === 'nigeria' && (
            <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/60 space-y-2">
              {/* View Mode Toggle: Verified Audio vs National Registry */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 p-1 bg-emerald-100/60 dark:bg-emerald-950/80 rounded-lg">
                  <button
                    onClick={() => setNigeriaViewMode('reciters')}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                      nigeriaViewMode === 'reciters'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voice-Verified Reciters (12 Live)</span>
                  </button>
                  <button
                    onClick={() => setNigeriaViewMode('registry')}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                      nigeriaViewMode === 'registry'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>National Qaris Registry (34 Investigated)</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Genuine Voice Match Guarantee</span>
                </div>
              </div>

              {/* State Hub Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0 mr-1 flex items-center gap-1">
                  <span>Hub / State:</span>
                </span>
                {[
                  { id: 'all', label: 'All Nigerian States' },
                  { id: 'Kano', label: 'Kano' },
                  { id: 'Sokoto', label: 'Sokoto' },
                  { id: 'Kaduna', label: 'Kaduna / Zaria' },
                  { id: 'Borno', label: 'Borno / Maiduguri' },
                  { id: 'Bauchi', label: 'Bauchi' },
                  { id: 'Kebbi', label: 'Kebbi' },
                  { id: 'Gombe', label: 'Gombe' },
                  { id: 'Katsina', label: 'Katsina / Daura' },
                  { id: 'Oyo', label: 'Oyo / Ibadan' },
                  { id: 'Kogi', label: 'Kogi' },
                  { id: 'Yobe', label: 'Yobe' },
                  { id: 'Adamawa', label: 'Adamawa' }
                ].map(stateTab => (
                  <button
                    key={stateTab.id}
                    onClick={() => setSelectedNigerianState(stateTab.id)}
                    className={`px-2.5 py-1 text-[11px] rounded whitespace-nowrap transition-colors ${
                      selectedNigerianState === stateTab.id
                        ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/60 font-medium'
                    }`}
                  >
                    {stateTab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Riwayah & Style filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            
            {/* Riwayah filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 mr-1">Riwayah:</span>
              <button
                onClick={() => setSelectedRiwayah('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedRiwayah === 'all'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRiwayah('hafs')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedRiwayah === 'hafs'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hafs 'an 'Asim
              </button>
              <button
                onClick={() => setSelectedRiwayah('warsh')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedRiwayah === 'warsh'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Warsh 'an Nafi'
              </button>
              <button
                onClick={() => setSelectedRiwayah('duri')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedRiwayah === 'duri'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Al-Duri
              </button>
            </div>

            {/* Style filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 mr-1">Style:</span>
              <button
                onClick={() => setSelectedStyle('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStyle === 'all'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStyle('murattal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStyle === 'murattal'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Murattal
              </button>
              <button
                onClick={() => setSelectedStyle('mujawwad')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStyle === 'mujawwad'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mujawwad
              </button>
              <button
                onClick={() => setSelectedStyle("mu'allim")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStyle.includes("mu'allim") || selectedStyle.includes("study")
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mu'allim
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Content Section: Either Nigerian National Registry OR Verified Audio Grid */}
      {selectedRegion === 'nigeria' && nigeriaViewMode === 'registry' ? (
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
                          Preserved in the Nigerian National Qaris Registry. Excluded from audio player substitution to strictly guarantee 100% voice fidelity.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRegistry.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">No scholar found in registry matching your search.</p>
            </div>
          )}
        </div>
      ) : (
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {reciter.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(e, reciter.id)}
                    aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFav 
                        ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                  <span>{reciter.riwayah}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-emerald-800 dark:text-emerald-400">{reciter.style}</span>
                </div>

                {/* Scholarly biography */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {reciter.bio}
                </p>

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
                        ? 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
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
                        <span>{isSelected ? 'Resume Recitation' : 'Listen Full Quran'}</span>
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

                {/* Tajweed practice button */}
                <button
                  onClick={() => onOpenTajweedWithReciter(reciter)}
                  className="w-full py-1.5 px-3 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Practice Tajweed with {reciter.name.split(' ')[0]}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
      )}

      {selectedRegion !== 'nigeria' || nigeriaViewMode === 'reciters' ? (
        filteredReciters.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">No reciter matching your search criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRiwayah('all'); setSelectedStyle('all'); setSelectedRegion('all'); }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )
      ) : null}

    </div>
  );
};

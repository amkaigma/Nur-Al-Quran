import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Users, 
  Search, 
  Play, 
  Pause, 
  ArrowLeft, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  ListMusic, 
  ExternalLink,
  ChevronRight,
  Info,
  Mic,
  Star
} from 'lucide-react';
import { RiwayahMeta, Reciter } from '../types/quran';
import { RIWAYAT, getRiwayahById } from '../data/riwayat';
import { RECITERS, getVerifiedReciterCountForRiwayah, getRecitersByRiwayah, getSurahAudioUrl } from '../data/reciters';
import { SurahListModal } from './SurahListModal';
import { toggleFavoriteReciter, getFavoriteReciters } from '../services/storage';

interface RiwayahSelectionProps {
  currentReciter: Reciter;
  currentSurahId: number;
  isPlaying: boolean;
  onSelectReciter: (reciter: Reciter, startPlay?: boolean) => void;
  onSelectSurahAndPlay: (reciter: Reciter, surahId: number) => void;
  onOpenReaderWithSurah: (reciter: Reciter, surahId: number) => void;
  onOpenTajweedWithReciter: (reciter: Reciter) => void;
  initialSelectedRiwayahId?: string | null;
}

export const RiwayahSelection: React.FC<RiwayahSelectionProps> = ({
  currentReciter,
  currentSurahId,
  isPlaying,
  onSelectReciter,
  onSelectSurahAndPlay,
  onOpenReaderWithSurah,
  onOpenTajweedWithReciter,
  initialSelectedRiwayahId = null
}) => {
  const [selectedRiwayahId, setSelectedRiwayahId] = useState<string | null>(initialSelectedRiwayahId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('all');
  const [selectedSurahModalReciter, setSelectedSurahModalReciter] = useState<Reciter | null>(null);
  const [previewReciterId, setPreviewReciterId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteReciters());

  const selectedRiwayah = selectedRiwayahId ? getRiwayahById(selectedRiwayahId) : null;

  // Calculate dynamic reciter counts for all 20 Riwayat directly from RECITERS database
  const riwayatCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of RIWAYAT) {
      counts[r.id] = getVerifiedReciterCountForRiwayah(r.id);
    }
    return counts;
  }, []);

  const totalVerifiedInApp = useMemo(() => {
    return RECITERS.filter(r => r.verificationStatus === 'verified' && r.hasAudio).length;
  }, []);

  // Filter reciters within dedicated Riwayah view
  const recitersForSelectedRiwayah = useMemo(() => {
    if (!selectedRiwayahId) return [];
    const list = getRecitersByRiwayah(selectedRiwayahId);
    return list.filter(reciter => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        reciter.name.toLowerCase().includes(q) ||
        reciter.arabicName.includes(q) ||
        (reciter.alternativeSpellings && reciter.alternativeSpellings.some(alt => alt.toLowerCase().includes(q))) ||
        reciter.country.toLowerCase().includes(q) ||
        (reciter.city && reciter.city.toLowerCase().includes(q)) ||
        (reciter.state && reciter.state.toLowerCase().includes(q));

      const matchesCountry = 
        selectedCountryFilter === 'all' ||
        (selectedCountryFilter === 'nigeria' && (reciter.countryCode === 'NG' || reciter.country.toLowerCase().includes('nigeria'))) ||
        (selectedCountryFilter === 'egypt' && reciter.countryCode === 'EG') ||
        (selectedCountryFilter === 'saudi' && reciter.countryCode === 'SA') ||
        (selectedCountryFilter === 'sudan' && reciter.countryCode === 'SD') ||
        (selectedCountryFilter === 'morocco' && reciter.countryCode === 'MA') ||
        (selectedCountryFilter === 'algeria' && reciter.countryCode === 'DZ') ||
        (selectedCountryFilter === 'libya' && reciter.countryCode === 'LY') ||
        (selectedCountryFilter === 'kuwait' && reciter.countryCode === 'KW') ||
        (selectedCountryFilter === 'somalia' && reciter.countryCode === 'SO');

      return matchesSearch && matchesCountry;
    });
  }, [selectedRiwayahId, searchQuery, selectedCountryFilter]);

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
      setPreviewReciterId(null);
    });

    audio.onended = () => {
      setPreviewReciterId(null);
      setPreviewAudio(null);
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Surah List Modal */}
      <SurahListModal
        reciter={selectedSurahModalReciter}
        isOpen={Boolean(selectedSurahModalReciter)}
        onClose={() => setSelectedSurahModalReciter(null)}
        currentSurahId={currentSurahId}
        isPlaying={isPlaying}
        onSelectSurahAndPlay={onSelectSurahAndPlay}
        onOpenReaderWithSurah={onOpenReaderWithSurah}
      />

      {/* VIEW 1: THE 20 CANONICAL RIWAYAT SELECTION GRID */}
      {!selectedRiwayah ? (
        <div className="space-y-8">
          
          {/* Header & Hero Intro */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-emerald-800/40 shadow-sm">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-amber-300 mb-2 font-medium">
                <span>The Ten Mutawatir Qira'at</span>
                <span aria-hidden="true">·</span>
                <span>20 Canonical Riwayat of the Holy Qur'an</span>
                <span aria-hidden="true">·</span>
                <span>Verified Audio Streams</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Select Riwayah (روايات القرآن الكريم العشرين)
              </h1>
              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Explore the authentic transmission chains of the Noble Qur'an. Each of the Ten Imams had two primary narrators (Ruwat), forming the twenty canonical Riwayat. Choose any Riwayah below to view its verified reciters, geographic traditions, and listen to authentic studio recordings.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-emerald-200">
                <span className="flex items-center gap-1.5 bg-emerald-900/80 px-3 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>20 Canonical Riwayat Registered</span>
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-900/80 px-3 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{totalVerifiedInApp} Verified Reciter Moshafs Live</span>
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-900/80 px-3 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>100% Genuine Voice Match Guarantee</span>
                </span>
              </div>
            </div>

            {/* Ambient subtle calligraphy */}
            <div className="absolute right-4 -bottom-6 text-emerald-900/30 font-arabic text-8xl select-none pointer-events-none hidden sm:block">
              رِوَايَات
            </div>
          </div>

          {/* Quick Notice on Ad-Duri */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Scholarly Note on Dual Narrations:</strong> Imam Hafs ibn 'Umar al-Duri transmitted from two distinct Imams: 
              <span className="font-semibold text-emerald-900 dark:text-emerald-300"> Ad-Duri from Abu 'Amr al-Basri (Entry #5)</span> and 
              <span className="font-semibold text-emerald-900 dark:text-emerald-300"> Ad-Duri from Al-Kisa'i al-Kufi (Entry #14)</span>. Both appear as separate canonical entries with their own distinct phonetic and grammatical rules.
            </p>
          </div>

          {/* 20 Riwayat Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {RIWAYAT.map((riwayah) => {
              const count = riwayatCounts[riwayah.id] || 0;
              const hasReciters = count > 0;

              return (
                <div
                  key={riwayah.id}
                  className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all flex flex-col justify-between hover:shadow-md ${
                    hasReciters 
                      ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500' 
                      : 'border-slate-200/60 dark:border-slate-800/60 opacity-90'
                  }`}
                >
                  <div>
                    {/* Card Header: Number & Arabic Name */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-200 dark:border-emerald-800">
                        #{riwayah.orderNumber}
                      </span>

                      <div className="font-arabic text-2xl font-bold text-slate-900 dark:text-white" dir="rtl">
                        {riwayah.nameArabic}
                      </div>
                    </div>

                    {/* English Transliteration & Qira'ah */}
                    <div className="space-y-1 mb-3">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {riwayah.nameEnglish}
                      </h3>
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {riwayah.transliteration}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Associated Qira’ah: <span className="text-slate-700 dark:text-slate-300">{riwayah.qiraahNameEnglish}</span>
                      </div>
                    </div>

                    {/* Historical Region Badge */}
                    <div className="mb-3">
                      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        📍 {riwayah.historicalRegion}
                      </span>
                    </div>

                    {/* Brief description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {riwayah.description}
                    </p>
                  </div>

                  {/* Card Bottom: Dynamic Reciter Count & "View Reciters" Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Reciters: </span>
                      <strong className={`font-semibold ${hasReciters ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {count} verified
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRiwayahId(riwayah.id);
                        setSearchQuery('');
                        setSelectedCountryFilter('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                        hasReciters
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>View Reciters</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* VIEW 2: DEDICATED RIWAYAH PAGE */
        <div className="space-y-6">
          
          {/* Back button */}
          <div>
            <button
              onClick={() => setSelectedRiwayahId(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Riwayah Selection (All 20 Riwayat)</span>
            </button>
          </div>

          {/* Dedicated Riwayah Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  <span>Canonical Riwayah #{selectedRiwayah.orderNumber}</span>
                  <span>·</span>
                  <span>{selectedRiwayah.historicalRegion}</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Riwayah: {selectedRiwayah.transliteration}
                  </h1>
                  <span className="font-arabic text-3xl font-bold text-emerald-800 dark:text-emerald-400" dir="rtl">
                    ({selectedRiwayah.nameArabic})
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Associated Qira’ah: <span className="text-emerald-700 dark:text-emerald-400">{selectedRiwayah.qiraahNameEnglish}</span> 
                  <span className="font-arabic ml-2 text-slate-600 dark:text-slate-400">({selectedRiwayah.qiraahNameArabic})</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 max-w-3xl">
                  {selectedRiwayah.description}
                </p>
              </div>

              {/* Dynamic Available Reciters Count Pill */}
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 sm:p-5 text-center shrink-0 min-w-[200px]">
                <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1">
                  Available Reciters
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800 dark:text-emerald-400 tabular-nums">
                  {riwayatCounts[selectedRiwayah.id] || 0}
                </div>
                <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 font-medium">
                  Verified Audio Feeds
                </div>
              </div>

            </div>

            {/* Filter toolbar inside dedicated Riwayah */}
            <div className="pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search reciter in ${selectedRiwayah.nameEnglish}...`}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Country Filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Country:</span>
                <button
                  onClick={() => setSelectedCountryFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCountryFilter === 'all'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCountryFilter('nigeria')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedCountryFilter === 'nigeria'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  <span>🇳🇬 Nigeria</span>
                </button>
                <button
                  onClick={() => setSelectedCountryFilter('egypt')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCountryFilter === 'egypt'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🇪🇬 Egypt
                </button>
                <button
                  onClick={() => setSelectedCountryFilter('saudi')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCountryFilter === 'saudi'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🇸🇦 Saudi
                </button>
                <button
                  onClick={() => setSelectedCountryFilter('sudan')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCountryFilter === 'sudan'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🇸🇩 Sudan
                </button>
                <button
                  onClick={() => setSelectedCountryFilter('morocco')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCountryFilter === 'morocco'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🇲🇦 Morocco
                </button>
              </div>

            </div>
          </div>

          {/* Reciters List for this Riwayah */}
          {recitersForSelectedRiwayah.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recitersForSelectedRiwayah.map((reciter) => {
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
                      {/* Arabic Name & Favorite */}
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

                      {/* Country & Badges */}
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

                      {/* Bio */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                        {reciter.bio}
                      </p>

                      {/* Audio Verification Source info */}
                      <div className="mb-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Source: {reciter.verifiedAudioSource}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Play / Pause button */}
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

                        {/* Sample preview button */}
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

                      {/* Browse complete surahs modal trigger */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSurahModalReciter(reciter)}
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
          ) : (
            /* Empty state when 0 reciters exist for this Riwayah */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/60">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No verified studio recordings currently indexed for this Riwayah
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The Riwayah of <strong>{selectedRiwayah.nameEnglish}</strong> ({selectedRiwayah.nameArabic}) is canonically documented and preserved in our Ten Qira'at registry. Studio-recorded complete albums meeting our 100% voice fidelity criteria are currently being cataloged.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedRiwayahId(null)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  ← Browse Other Riwayat with Live Recordings
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Mic, Star, Globe, Sparkles, Volume2 } from 'lucide-react';
import { Reciter, Riwayah, RecitationStyle } from '../types/quran';
import { RECITERS } from '../data/reciters';
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

    // Play Al-Fatiha (001.mp3) snippet for quick vocal sample
    const sampleUrl = `${reciter.serverUrl.endsWith('/') ? reciter.serverUrl : reciter.serverUrl + '/'}001.mp3`;
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

  const filteredReciters = useMemo(() => {
    return RECITERS.filter((reciter) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        reciter.name.toLowerCase().includes(q) ||
        reciter.arabicName.includes(q) ||
        reciter.country.toLowerCase().includes(q) ||
        reciter.riwayah.toLowerCase().includes(q);

      const matchesRiwayah = 
        selectedRiwayah === 'all' || 
        reciter.riwayah.toLowerCase().includes(selectedRiwayah.toLowerCase());

      const matchesStyle = 
        selectedStyle === 'all' || 
        reciter.style.toLowerCase().includes(selectedStyle.toLowerCase());

      return matchesSearch && matchesRiwayah && matchesStyle;
    });
  }, [searchQuery, selectedRiwayah, selectedStyle]);

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
      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Sheikh by name (e.g. Al-Husary, Alafasy, Minshawi), country, or Riwayah..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
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

        {/* Interactive Segmented Filters (Functional Buttons) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          
          {/* Riwayah filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">Riwayah:</span>
            <button
              onClick={() => setSelectedRiwayah('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRiwayah === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Riwayahs
            </button>
            <button
              onClick={() => setSelectedRiwayah('hafs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRiwayah === 'hafs'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Hafs 'an 'Asim
            </button>
            <button
              onClick={() => setSelectedRiwayah('warsh')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRiwayah === 'warsh'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Warsh 'an Nafi'
            </button>
            <button
              onClick={() => setSelectedRiwayah('duri')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRiwayah === 'duri'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Al-Duri
            </button>
          </div>

          {/* Style filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">Style:</span>
            <button
              onClick={() => setSelectedStyle('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStyle === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Styles
            </button>
            <button
              onClick={() => setSelectedStyle('murattal')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStyle === 'murattal'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Murattal
            </button>
            <button
              onClick={() => setSelectedStyle('mujawwad')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStyle === 'mujawwad'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Mujawwad
            </button>
            <button
              onClick={() => setSelectedStyle("mu'allim")}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStyle.includes("mu'allim") || selectedStyle.includes("study")
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Mu'allim (Tajweed)
            </button>
          </div>

        </div>

      </div>

      {/* Reciters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReciters.map((reciter) => {
          const isSelected = currentReciter.id === reciter.id;
          const isFav = favorites.includes(reciter.id);
          const isPreviewing = previewReciterId === reciter.id;

          return (
            <div
              key={reciter.id}
              className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                
                {/* Header row with Arabic calligraphy name & favorite */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-arabic text-xl font-bold text-slate-900 truncate" dir="rtl">
                      {reciter.arabicName}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 truncate">
                      {reciter.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(e, reciter.id)}
                    aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFav 
                        ? 'text-amber-500 hover:text-amber-600 bg-amber-50' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Clean unboxed metadata with subtle typographic separators */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <span>{reciter.country}</span>
                  <span aria-hidden="true">·</span>
                  <span>{reciter.riwayah}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-emerald-800">{reciter.style}</span>
                </div>

                {/* Scholarly biography */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {reciter.bio}
                </p>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  
                  {/* Select & Play button */}
                  <button
                    onClick={() => onSelectReciter(reciter, true)}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      isSelected && isPlaying
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : isSelected
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
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
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Tajweed practice button */}
                <button
                  onClick={() => onOpenTajweedWithReciter(reciter)}
                  className="w-full py-1.5 px-3 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Practice Tajweed with {reciter.name.split(' ')[0]}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredReciters.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600">No reciter matching your search criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedRiwayah('all'); setSelectedStyle('all'); }}
            className="mt-3 px-4 py-2 text-xs font-medium text-emerald-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

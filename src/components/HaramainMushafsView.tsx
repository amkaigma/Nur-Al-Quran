import React, { useState } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  ListMusic, 
  BookOpen, 
  Mic, 
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { HARAMAIN_IMAMS, HaramainImam } from '../data/haramain';
import { Reciter } from '../types/quran';
import { RECITERS } from '../data/reciters';
import { SurahListModal } from './SurahListModal';

interface HaramainMushafsViewProps {
  currentReciter: Reciter;
  currentSurahId: number;
  isPlaying: boolean;
  onSelectReciter: (reciter: Reciter, startPlay?: boolean) => void;
  onSelectSurahAndPlay: (reciter: Reciter, surahId: number) => void;
  onOpenReaderWithSurah: (reciter: Reciter, surahId: number) => void;
  onOpenTajweedWithReciter: (reciter: Reciter) => void;
}

export const HaramainMushafsView: React.FC<HaramainMushafsViewProps> = ({
  currentReciter,
  currentSurahId,
  isPlaying,
  onSelectReciter,
  onSelectSurahAndPlay,
  onOpenReaderWithSurah,
  onOpenTajweedWithReciter
}) => {
  const [selectedSanctuary, setSelectedSanctuary] = useState<'all' | 'makkah' | 'madinah'>('all');
  const [activeRadioId, setActiveRadioId] = useState<string | null>(null);
  const [radioAudio, setRadioAudio] = useState<HTMLAudioElement | null>(null);
  const [modalReciter, setModalReciter] = useState<Reciter | null>(null);

  const filteredImams = HARAMAIN_IMAMS.filter(imam => {
    if (selectedSanctuary === 'all') return true;
    return imam.sanctuary === selectedSanctuary;
  });

  const handleToggleRadio = (imam: HaramainImam) => {
    if (!imam.radioUrl) return;

    if (activeRadioId === imam.id && radioAudio) {
      radioAudio.pause();
      setActiveRadioId(null);
      setRadioAudio(null);
      return;
    }

    if (radioAudio) {
      radioAudio.pause();
    }

    const audio = new Audio(imam.radioUrl);
    audio.play().then(() => {
      setActiveRadioId(imam.id);
      setRadioAudio(audio);
    }).catch(err => {
      console.warn('Radio stream error:', err);
      setActiveRadioId(null);
    });

    audio.onended = () => {
      setActiveRadioId(null);
      setRadioAudio(null);
    };
  };

  const handleOpenSurahsForImam = (imam: HaramainImam) => {
    const matched = imam.reciterId ? RECITERS.find(r => r.id === imam.reciterId) : null;
    if (matched) {
      setModalReciter(matched);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Surah List Modal */}
      <SurahListModal
        reciter={modalReciter}
        isOpen={Boolean(modalReciter)}
        onClose={() => setModalReciter(null)}
        currentSurahId={currentSurahId}
        isPlaying={isPlaying}
        onSelectSurahAndPlay={onSelectSurahAndPlay}
        onOpenReaderWithSurah={onOpenReaderWithSurah}
      />

      {/* Hero Header */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-emerald-800/40 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-amber-300 mb-2 font-medium">
            <span>The Two Holy Mosques Audio Archive</span>
            <span aria-hidden="true">·</span>
            <span>24/7 Dedicated Live Radio Feeds</span>
            <span aria-hidden="true">·</span>
            <span>Makkah & Madinah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Haramain Mushafs (المصاحف الحرمين الشريفين)
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Experience the soulful atmosphere of the Two Holy Sanctuaries: Masjid Al-Haram in Makkah and Masjid An-Nabawi in Madinah. Listen to continuous 24/7 broadcast feeds or play full studio and Taraweeh albums from the revered Imams.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Masjid Al-Haram (Makkah) & Masjid An-Nabawi (Madinah)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>10 Dedicated 24/7 Streaming Stations</span>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-emerald-900/30 font-arabic text-8xl select-none pointer-events-none hidden sm:block">
          الحَرَمَيْن
        </div>
      </div>

      {/* Sanctuary Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedSanctuary('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedSanctuary === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Haramain Imams ({HARAMAIN_IMAMS.length})
          </button>

          <button
            onClick={() => setSelectedSanctuary('makkah')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedSanctuary === 'makkah'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>🕋 Masjid Al-Haram (Makkah)</span>
          </button>

          <button
            onClick={() => setSelectedSanctuary('madinah')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedSanctuary === 'madinah'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>🕌 Masjid An-Nabawi (Madinah)</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Authentic Sacred Sanctuaries Recordings
        </div>
      </div>

      {/* Imams Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredImams.map((imam) => {
          const matchedReciter = imam.reciterId ? RECITERS.find(r => r.id === imam.reciterId) : null;
          const isSelectedInPlayer = matchedReciter && currentReciter.id === matchedReciter.id;
          const isRadioActive = activeRadioId === imam.id;

          return (
            <div
              key={imam.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all flex flex-col justify-between shadow-xs ${
                isRadioActive 
                  ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 dark:bg-amber-950/20' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <div>
                
                {/* Header: Sanctuary Badge & Arabic Name */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-arabic text-xl font-bold text-slate-900 dark:text-white truncate" dir="rtl">
                      {imam.arabicName}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                      {imam.name}
                    </h3>
                  </div>

                  <span className="text-xl shrink-0">
                    {imam.sanctuary === 'makkah' ? '🕋' : '🕌'}
                  </span>
                </div>

                {/* Sanctuary & Imamate Years */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    imam.sanctuary === 'makkah'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300/60 dark:border-amber-800/60'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60'
                  }`}>
                    <span>{imam.sanctuaryName}</span>
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                    {imam.yearsOfImamate}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {imam.bio}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {imam.audioFeatures.map((feat, idx) => (
                    <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {feat}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                
                {/* 24/7 Live Stream Radio Button */}
                <button
                  onClick={() => handleToggleRadio(imam)}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isRadioActive
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${isRadioActive ? 'animate-pulse text-amber-200' : ''}`} />
                  <span>{isRadioActive ? 'Listening to 24/7 Live Radio' : 'Tune in to 24/7 Haramain Radio'}</span>
                </button>

                {/* Complete Surahs & Player actions if matched in catalog */}
                {matchedReciter && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectReciter(matchedReciter, true)}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play in Bar</span>
                    </button>

                    <button
                      onClick={() => handleOpenSurahsForImam(imam)}
                      className="py-1.5 px-3 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <ListMusic className="w-3.5 h-3.5" />
                      <span>Surahs (114)</span>
                    </button>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

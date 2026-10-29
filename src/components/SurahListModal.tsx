import React, { useState, useMemo } from 'react';
import { X, Search, Play, Pause, BookOpen, Volume2, CheckCircle2, ChevronRight, Globe, Award, Download } from 'lucide-react';
import { Reciter, SurahMeta } from '../types/quran';
import { SURAHS } from '../data/surahs';
import { getSurahAudioUrl } from '../data/reciters';

interface SurahListModalProps {
  reciter: Reciter | null;
  isOpen: boolean;
  onClose: () => void;
  currentSurahId: number;
  isPlaying: boolean;
  onSelectSurahAndPlay: (reciter: Reciter, surahId: number) => void;
  onOpenReaderWithSurah: (reciter: Reciter, surahId: number) => void;
}

export const SurahListModal: React.FC<SurahListModalProps> = ({
  reciter,
  isOpen,
  onClose,
  currentSurahId,
  isPlaying,
  onSelectSurahAndPlay,
  onOpenReaderWithSurah
}) => {
  const [search, setSearch] = useState('');
  const [previewSurahId, setPreviewSurahId] = useState<number | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  if (!isOpen || !reciter) return null;

  const isCurrentReciterPlaying = (surahId: number) => {
    return isPlaying && currentSurahId === surahId;
  };

  const filteredSurahs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return SURAHS.filter(s => {
      const isAvailable = reciter.availableSurahs.includes(s.id);
      if (!isAvailable) return false;
      if (!q) return true;
      return (
        s.id.toString() === q ||
        s.nameEnglish.toLowerCase().includes(q) ||
        s.nameArabic.includes(q) ||
        s.transliteration.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q)
      );
    });
  }, [search, reciter]);

  const handleQuickPreview = (e: React.MouseEvent, surahId: number) => {
    e.stopPropagation();
    if (previewSurahId === surahId && previewAudio) {
      previewAudio.pause();
      setPreviewSurahId(null);
      setPreviewAudio(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    const url = getSurahAudioUrl(reciter, surahId);
    const audio = new Audio(url);
    audio.play().then(() => {
      setPreviewSurahId(surahId);
      setPreviewAudio(audio);
    }).catch(err => {
      console.warn('Preview error:', err);
      setPreviewSurahId(null);
    });

    audio.onended = () => {
      setPreviewSurahId(null);
      setPreviewAudio(null);
    };
  };

  const handleClose = () => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
    }
    setPreviewSurahId(null);
    setSearch('');
    onClose();
  };

  const handleDownloadAudio = (e: React.MouseEvent, surah: SurahMeta) => {
    e.stopPropagation();
    const url = getSurahAudioUrl(reciter, surah.id);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${reciter.name.replace(/[^a-zA-Z0-9]/g, '_')}_Surah_${surah.id.toString().padStart(3, '0')}_${surah.transliteration}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-xl shrink-0 shadow-sm font-arabic">
              {reciter.countryCode === 'NG' ? '🇳🇬' : '📖'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-arabic text-lg font-bold text-slate-900 dark:text-white" dir="rtl">
                  {reciter.arabicName}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60">
                  {reciter.riwayah}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {reciter.style}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {reciter.name}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>{reciter.country} {reciter.city ? `(${reciter.city})` : ''}</span>
                <span>·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{reciter.availableSurahs.length} Surahs Available ({reciter.availableSurahs.length === 114 ? 'Complete Quran' : 'Selected Surahs'})</span>
                </span>
              </p>
            </div>
          </div>

          {/* Search bar inside modal */}
          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter surahs by name or number (e.g. 1, 36, Yasin, Al-Mulk)..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Surahs List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 sm:p-4">
          {filteredSurahs.map((surah) => {
            const isPlayingThis = isCurrentReciterPlaying(surah.id);
            const isPreviewingThis = previewSurahId === surah.id;

            return (
              <div
                key={surah.id}
                className={`p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                  isPlayingThis 
                    ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                
                {/* Surah Number & Names */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isPlayingThis
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}>
                    {surah.id}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {surah.nameEnglish}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {surah.versesCount} Ayahs
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {surah.revelationType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      "{surah.meaning}" · {surah.transliteration}
                    </div>
                  </div>
                </div>

                {/* Arabic Calligraphy Name */}
                <div className="font-arabic text-lg font-bold text-slate-800 dark:text-slate-200 text-right shrink-0 px-2" dir="rtl">
                  {surah.nameArabic}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {/* Quick sample audio preview */}
                  <button
                    onClick={(e) => handleQuickPreview(e, surah.id)}
                    title="Quick audio preview"
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      isPreviewingThis
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isPreviewingThis ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Play Complete Surah in Main Player */}
                  <button
                    onClick={() => {
                      onSelectSurahAndPlay(reciter, surah.id);
                      handleClose();
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      isPlayingThis
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Surah</span>
                      </>
                    )}
                  </button>

                  {/* Open in Quran Reader */}
                  <button
                    onClick={() => {
                      onOpenReaderWithSurah(reciter, surah.id);
                      handleClose();
                    }}
                    title="Open full text in Quran Reader"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                  {/* Download Surah MP3 */}
                  <button
                    onClick={(e) => handleDownloadAudio(e, surah)}
                    title={`Download MP3: Surah ${surah.nameEnglish} by ${reciter.name}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}

          {filteredSurahs.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
              No surah found matching "{search}".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audio Source: {reciter.verifiedAudioSource}</span>
          </div>

          <button
            onClick={handleClose}
            className="px-4 py-1.5 font-medium rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

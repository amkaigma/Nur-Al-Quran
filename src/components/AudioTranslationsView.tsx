import React, { useState } from 'react';
import { 
  Globe2, 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  CheckCircle2, 
  Languages, 
  BookOpen, 
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { AUDIO_TRANSLATIONS, AudioTranslation } from '../data/audioTranslations';
import { SURAHS } from '../data/surahs';

export const AudioTranslationsView: React.FC = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('english_walk');
  const [activeStreamingRadioId, setActiveStreamingRadioId] = useState<string | null>(null);
  const [radioAudio, setRadioAudio] = useState<HTMLAudioElement | null>(null);
  const [surahSearch, setSurahSearch] = useState('');

  const activeTranslation = AUDIO_TRANSLATIONS.find(t => t.id === selectedLanguageId) || AUDIO_TRANSLATIONS[0];

  const handleToggleRadio = (item: AudioTranslation) => {
    if (activeStreamingRadioId === item.id && radioAudio) {
      radioAudio.pause();
      setActiveStreamingRadioId(null);
      setRadioAudio(null);
      return;
    }

    if (radioAudio) {
      radioAudio.pause();
    }

    const audio = new Audio(item.radioUrl);
    audio.play().then(() => {
      setActiveStreamingRadioId(item.id);
      setRadioAudio(audio);
    }).catch(err => {
      console.warn('Translation radio error:', err);
      setActiveStreamingRadioId(null);
    });

    audio.onended = () => {
      setActiveStreamingRadioId(null);
      setRadioAudio(null);
    };
  };

  const filteredSurahs = SURAHS.filter(s => {
    const q = surahSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.id.toString() === q ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.transliteration.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-emerald-800/40 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-amber-300 mb-2 font-medium">
            <span>Global Multi-Lingual Audio Library</span>
            <span aria-hidden="true">·</span>
            <span>Spoken Translations of the Holy Qur'an</span>
            <span aria-hidden="true">·</span>
            <span>24/7 Continuous Streams</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Audio Translations of the Qur’an (ترجمات معاني القرآن)
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Listen to spoken translations of the meanings of the Holy Qur'an in major world languages including English, Hausa (for Nigeria & West Africa), French, Urdu, Spanish, German, Turkish, and more. Tune in to 24/7 radio broadcasts or browse individual Surahs.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span>{AUDIO_TRANSLATIONS.length} Major Languages Available</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>24/7 Live Broadcast Radios</span>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-emerald-900/30 font-arabic text-8xl select-none pointer-events-none hidden sm:block">
          تَرْجَمَة
        </div>
      </div>

      {/* Language Selection Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Select Spoken Translation Language</h2>
          </div>
          <span className="text-xs text-slate-500">Pick any language to stream</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {AUDIO_TRANSLATIONS.map((t) => {
            const isSelected = selectedLanguageId === t.id;
            const isPlayingThis = activeStreamingRadioId === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setSelectedLanguageId(t.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/40 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{t.flag}</span>
                    {isPlayingThis && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {t.language}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t.nativeName}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span>{isSelected ? 'Active' : 'Choose'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Language Showcase & Continuous Radio Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeTranslation.flag}</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTranslation.language} Audio Translation ({activeTranslation.nativeName})
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {activeTranslation.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Translator:</span>
              <span>{activeTranslation.translator}</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Voice:</span>
              <span>{activeTranslation.reciterVoice}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Prevalent in:</span>
              {activeTranslation.popularRegions.map((reg, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {reg}
                </span>
              ))}
            </div>
          </div>

          {/* 24/7 Continuous Radio Station Button */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 text-center shrink-0 min-w-[260px] flex flex-col justify-between">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center justify-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>24/7 Continuous Spoken Radio</span>
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              Live broadcast streaming full Qur’an with {activeTranslation.language} translation
            </p>

            <button
              onClick={() => handleToggleRadio(activeTranslation)}
              className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                activeStreamingRadioId === activeTranslation.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              {activeStreamingRadioId === activeTranslation.id ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Stop 24/7 Broadcast</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start 24/7 {activeTranslation.language} Radio</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Informational Guidance */}
        <div className="pt-5 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The 24/7 spoken translation streams broadcast continuously from reliable Islamic international audio servers without interruption. You can keep the stream playing in the background while studying or working.
          </p>
        </div>
      </div>

    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Check, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Info, 
  Sparkles,
  Sliders,
  Radio,
  Building2,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle2,
  Calendar,
  Layers,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { MUEZZIN_VOICES, MuezzinVoice } from '../data/muezzins';
import { 
  getAdhanSettings, 
  saveAdhanSettings, 
  resetAdhanSettingsToDefault,
  playAdhanVoice, 
  stopAdhanAudio, 
  AdhanSettings 
} from '../services/adhanService';

export const WorldwideAdhanVoices: React.FC = () => {
  const [settings, setSettings] = useState<AdhanSettings>(() => getAdhanSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'nigeria' | 'haramain' | 'alaqsa' | 'egypt' | 'gulf' | 'maghreb' | 'asia'>('all');
  const [selectedNigerianState, setSelectedNigerianState] = useState<string>('all');
  const [fajrOnlyFilter, setFajrOnlyFilter] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [previewIsFajr, setPreviewIsFajr] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [assignModalVoice, setAssignModalVoice] = useState<MuezzinVoice | null>(null);

  // Stop preview audio when leaving component
  useEffect(() => {
    return () => {
      stopAdhanAudio();
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, [previewAudio]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all Adhan and prayer caller settings to defaults (Sheikh Ali Ahmad Mulla for all prayers)?')) {
      const def = resetAdhanSettingsToDefault();
      setSettings(def);
      showToast('All Adhan settings restored to defaults.');
    }
  };

  const handleChangeVolume = (vol: number) => {
    const updated: AdhanSettings = {
      ...settings,
      volume: vol
    };
    setSettings(updated);
    saveAdhanSettings(updated);
    if (previewAudio) {
      previewAudio.volume = vol;
    }
  };

  const handleSelectDefaultVoice = (voiceId: string) => {
    const updated: AdhanSettings = {
      ...settings,
      selectedVoice: voiceId
    };
    setSettings(updated);
    saveAdhanSettings(updated);
    const m = MUEZZIN_VOICES.find(v => v.id === voiceId);
    showToast(`Selected "${m?.name}" as default Adhan caller for all prayers.`);
  };

  const handleSelectFajrVoice = (voiceId: string) => {
    const updated: AdhanSettings = {
      ...settings,
      fajrVoice: voiceId
    };
    setSettings(updated);
    saveAdhanSettings(updated);
    const m = MUEZZIN_VOICES.find(v => v.id === voiceId);
    showToast(`Set "${m?.name}" as dedicated Fajr caller (with Tathweeb).`);
  };

  const handleAssignToSpecificPrayer = (prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', voiceId: string) => {
    const currentPerPrayer = settings.perPrayerVoices || {
      fajr: settings.fajrVoice || settings.selectedVoice,
      dhuhr: settings.selectedVoice,
      asr: settings.selectedVoice,
      maghrib: settings.selectedVoice,
      isha: settings.selectedVoice
    };

    const updated: AdhanSettings = {
      ...settings,
      perPrayerVoices: {
        ...currentPerPrayer,
        [prayerKey]: voiceId
      }
    };
    if (prayerKey === 'fajr') {
      updated.fajrVoice = voiceId;
    }
    setSettings(updated);
    saveAdhanSettings(updated);
    const m = MUEZZIN_VOICES.find(v => v.id === voiceId);
    const prayerNames: Record<string, string> = {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    };
    showToast(`Assigned "${m?.name}" to call ${prayerNames[prayerKey]} prayer.`);
    setAssignModalVoice(null);
  };

  const handleToggleFavorite = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const favs = settings.favoriteVoices || [];
    const nextFavs = favs.includes(voiceId)
      ? favs.filter(id => id !== voiceId)
      : [...favs, voiceId];
    const updated: AdhanSettings = {
      ...settings,
      favoriteVoices: nextFavs
    };
    setSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleTogglePreview = (voiceId: string, isFajr: boolean = false) => {
    if (activePreviewId === voiceId && previewIsFajr === isFajr) {
      stopAdhanAudio();
      setActivePreviewId(null);
      setPlaybackError(null);
      return;
    }

    stopAdhanAudio();
    setActivePreviewId(voiceId);
    setPreviewIsFajr(isFajr);
    setPlaybackError(null);

    const audio = playAdhanVoice(
      voiceId, 
      settings.volume, 
      isFajr, 
      () => {
        setActivePreviewId(null);
      },
      (errMsg) => {
        setPlaybackError(errMsg);
        setActivePreviewId(null);
      }
    );
    setPreviewAudio(audio);
  };

  const filteredMuezzins = useMemo(() => {
    let list = MUEZZIN_VOICES;

    // Region filter
    if (selectedRegion === 'nigeria') {
      list = list.filter(m => m.isNigerian);
      if (selectedNigerianState !== 'all') {
        list = list.filter(m => m.stateOrProvince?.toLowerCase().includes(selectedNigerianState.toLowerCase()));
      }
    } else if (selectedRegion === 'haramain') {
      list = list.filter(m => m.country === 'Saudi Arabia');
    } else if (selectedRegion === 'alaqsa') {
      list = list.filter(m => m.country === 'Palestine');
    } else if (selectedRegion === 'egypt') {
      list = list.filter(m => m.country === 'Egypt');
    } else if (selectedRegion === 'gulf') {
      list = list.filter(m => ['Kuwait', 'Qatar', 'United Arab Emirates'].includes(m.country));
    } else if (selectedRegion === 'maghreb') {
      list = list.filter(m => ['Morocco', 'Tunisia', 'Algeria'].includes(m.country));
    } else if (selectedRegion === 'asia') {
      list = list.filter(m => ['Pakistan', 'India', 'Indonesia', 'Malaysia', 'Bangladesh', 'Turkey'].includes(m.country));
    }

    // Fajr-specific filter
    if (fajrOnlyFilter) {
      list = list.filter(m => m.hasFajrVersion);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.arabicName.includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        (m.stateOrProvince && m.stateOrProvince.toLowerCase().includes(q)) ||
        m.mosque.toLowerCase().includes(q) ||
        m.maqamOrStyle.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedRegion, selectedNigerianState, fajrOnlyFilter, searchQuery]);

  const activeDefaultMuezzin = MUEZZIN_VOICES.find(m => m.id === settings.selectedVoice) || MUEZZIN_VOICES[0];
  const activeFajrMuezzin = MUEZZIN_VOICES.find(m => m.id === (settings.fajrVoice || settings.selectedVoice)) || activeDefaultMuezzin;

  const nigerianStatesList = [
    { id: 'all', name: 'All States (16)' },
    { id: 'abuja', name: 'Abuja (FCT)' },
    { id: 'kano', name: 'Kano' },
    { id: 'kaduna', name: 'Kaduna' },
    { id: 'sokoto', name: 'Sokoto' },
    { id: 'lagos', name: 'Lagos' },
    { id: 'borno', name: 'Borno (Maiduguri)' },
    { id: 'yobe', name: 'Yobe (Damaturu)' },
    { id: 'bauchi', name: 'Bauchi' },
    { id: 'plateau', name: 'Plateau (Jos)' },
    { id: 'taraba', name: 'Taraba (Jalingo)' },
    { id: 'zamfara', name: 'Zamfara (Gusau)' },
    { id: 'gombe', name: 'Gombe' },
    { id: 'kwara', name: 'Kwara (Ilorin)' },
    { id: 'oyo', name: 'Oyo (Ibadan)' },
    { id: 'katsina', name: 'Katsina' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/80 flex items-center gap-2 text-xs font-semibold animate-pulse">
          <Check className="w-4 h-4 text-amber-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 font-arabic text-9xl pointer-events-none select-none">
          أذان
        </div>

        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-amber-300 text-xs font-semibold">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Worldwide Authentic Adhan Voice Library · مكتبة الأذان العالمية</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Worldwide Authentic Muezzin Directory
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Authentic, verified call to prayer recordings from recognized Muezzins of Masjid al-Haram in Makkah, Masjid an-Nabawi in Madinah, Al-Aqsa Mosque in Jerusalem, and authentic Nigerian mosque callers across Nigerian states. Every recording is an actual Adhan broadcast, strictly separate from Quran recitation.
          </p>
        </div>

        {/* Current Active Voices Summary Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-700/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs relative z-10">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-amber-300">Default Adhan Caller</div>
                <div className="font-bold text-white text-xs truncate">{activeDefaultMuezzin.name}</div>
                <div className="text-[10px] text-emerald-200 truncate">{activeDefaultMuezzin.mosque}</div>
              </div>
            </div>
            <button
              onClick={() => handleTogglePreview(activeDefaultMuezzin.id)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0"
              title="Preview Active Adhan"
            >
              {activePreviewId === activeDefaultMuezzin.id && !previewIsFajr ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-teal-400 text-emerald-950 flex items-center justify-center font-bold shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-teal-300">Dedicated Fajr Caller</div>
                <div className="font-bold text-white text-xs truncate">{activeFajrMuezzin.name}</div>
                <div className="text-[10px] text-teal-200 truncate">{activeFajrMuezzin.mosque}</div>
              </div>
            </div>
            <button
              onClick={() => handleTogglePreview(activeFajrMuezzin.id, true)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0"
              title="Preview Fajr Adhan"
            >
              {activePreviewId === activeFajrMuezzin.id && previewIsFajr ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 sm:col-span-2 lg:col-span-1 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Adhan Volume & Schedule</span>
              </div>
              <button
                onClick={handleResetDefaults}
                className="px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] font-bold text-amber-200 flex items-center gap-1 transition-colors"
                title="Restore Default Muezzin & Settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-white text-[11px]">
              <Volume2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={settings.volume}
                onChange={(e) => handleChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                title="Adjust Adhan volume"
              />
              <span className="font-mono text-[10px] text-amber-300 w-8 text-right shrink-0">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Playback Error Alert if any stream encounters network interruption */}
        {playbackError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs flex items-center justify-between gap-2 shadow-sm animate-fade-in relative z-10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{playbackError}</span>
            </div>
            <button
              onClick={() => {
                setPlaybackError(null);
                if (activeDefaultMuezzin) handleTogglePreview(activeDefaultMuezzin.id);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Muezzin by name, mosque, city, or Nigerian state (e.g., Ali Mulla, Abuja, Kano, Sokoto, Borno)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Regions:
          </span>
          {[
            { id: 'all', label: `All Voices (${MUEZZIN_VOICES.length})` },
            { id: 'nigeria', label: `Nigeria (16 Verified Mosques)` },
            { id: 'haramain', label: 'Makkah & Madinah' },
            { id: 'alaqsa', label: 'Al-Aqsa (Al-Quds)' },
            { id: 'egypt', label: 'Egypt (Cairo / Azhar)' },
            { id: 'gulf', label: 'Kuwait, Qatar, UAE' },
            { id: 'maghreb', label: 'North Africa' },
            { id: 'asia', label: 'Asia (Pakistan/Indonesia/Turkey)' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRegion(r.id as any);
                if (r.id !== 'nigeria') setSelectedNigerianState('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedRegion === r.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}

          <button
            onClick={() => setFajrOnlyFilter(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              fajrOnlyFilter
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Fajr With Tathweeb</span>
          </button>
        </div>

        {/* Dedicated Nigerian State Pills when Nigeria region is selected */}
        {selectedRegion === 'nigeria' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Nigerian States:
            </span>
            {nigerianStatesList.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedNigerianState(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedNigerianState === st.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMuezzins.map((muezzin) => {
          const isDefault = settings.selectedVoice === muezzin.id;
          const isFajr = settings.fajrVoice === muezzin.id;
          const isFav = settings.favoriteVoices?.includes(muezzin.id);
          const isPreviewingStandard = activePreviewId === muezzin.id && !previewIsFajr;
          const isPreviewingFajr = activePreviewId === muezzin.id && previewIsFajr;

          return (
            <div
              key={muezzin.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between relative group ${
                isDefault
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                
                {/* Card Top: Country & Favorite */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      {muezzin.country}
                    </span>
                    {muezzin.stateOrProvince && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200">
                        {muezzin.stateOrProvince}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {muezzin.maqamOrStyle}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(muezzin.id, e)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                    title="Bookmark Voice"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Muezzin Name & Mosque */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {muezzin.name}
                  </h3>
                  <div className="font-arabic text-xs text-slate-400 mt-0.5">
                    {muezzin.arabicName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1 mt-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{muezzin.mosque}</span>
                  </div>
                </div>

                {/* Brief Bio / Attribution */}
                {muezzin.biography && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {muezzin.biography}
                  </p>
                )}

                {/* Verification Badge */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Adhan Audio</span>
                  </span>
                  <span className="truncate max-w-[120px]">{muezzin.licensing}</span>
                </div>
              </div>

              {/* Action Buttons: Preview & Set As Active */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {/* Audio Previews */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePreview(muezzin.id, false)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      isPreviewingStandard
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {isPreviewingStandard ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPreviewingStandard ? 'Playing Adhan...' : 'Play Adhan'}</span>
                  </button>

                  {muezzin.hasFajrVersion && (
                    <button
                      onClick={() => handleTogglePreview(muezzin.id, true)}
                      title="Play Fajr Adhan with Tathweeb"
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isPreviewingFajr
                          ? 'bg-teal-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Fajr</span>
                    </button>
                  )}
                </div>

                {/* Selection Controls */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleSelectDefaultVoice(muezzin.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isDefault
                        ? 'bg-emerald-700 text-white cursor-default'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600'
                    }`}
                  >
                    {isDefault && <Check className="w-3.5 h-3.5" />}
                    <span>{isDefault ? 'Default Voice' : 'Set as Default'}</span>
                  </button>

                  <button
                    onClick={() => handleSelectFajrVoice(muezzin.id)}
                    title="Set this caller for Fajr prayer"
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                      isFajr
                        ? 'bg-teal-700 text-white border-teal-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-600'
                    }`}
                  >
                    {isFajr ? 'Active Fajr' : 'Set Fajr'}
                  </button>

                  <button
                    onClick={() => setAssignModalVoice(muezzin)}
                    title="Assign to specific prayer (Dhuhr, Asr, Maghrib, Isha)"
                    className="py-1.5 px-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:border-amber-400 transition-all"
                  >
                    Assign...
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Assign Voice to Specific Prayer */}
      {assignModalVoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Assign Adhan Voice</h3>
              </div>
              <button
                onClick={() => setAssignModalVoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Assign <strong className="text-emerald-700 dark:text-emerald-400">{assignModalVoice.name}</strong> ({assignModalVoice.mosque}) to announce a specific prayer time:
            </p>

            <div className="space-y-2 pt-2">
              {[
                { key: 'fajr', label: 'Fajr (Dawn)', desc: assignModalVoice.hasFajrVersion ? 'With authentic Tathweeb phrase' : 'Standard Adhan' },
                { key: 'dhuhr', label: 'Dhuhr (Noon)', desc: 'Midday prayer call' },
                { key: 'asr', label: 'Asr (Afternoon)', desc: 'Late afternoon prayer call' },
                { key: 'maghrib', label: 'Maghrib (Sunset)', desc: 'Sunset prayer call' },
                { key: 'isha', label: 'Isha (Night)', desc: 'Night prayer call' }
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => handleAssignToSpecificPrayer(p.key as any, assignModalVoice.id)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left flex items-center justify-between transition-all group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {p.label}
                    </div>
                    <div className="text-[10px] text-slate-400">{p.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setAssignModalVoice(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

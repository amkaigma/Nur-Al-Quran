import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Bell, 
  Play, 
  Pause, 
  Check, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  Layers, 
  Sun, 
  Moon, 
  RotateCcw, 
  Trash2,
  Radio,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  getIqamaSettings, 
  saveIqamaSettings, 
  resetIqamaSettingsToDefault,
  requestIqamaPermissions, 
  playIqamaAudio, 
  stopIqamaAudio,
  IqamaSettings,
  IQAMA_VOICES,
  PrayerKey 
} from '../services/iqamaService';
import { AdhanControlPanel } from './AdhanControlPanel';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearProgress?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onClearProgress
}) => {
  const [iqamaSettings, setIqamaSettings] = useState<IqamaSettings>(() => getIqamaSettings());
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [permissionFeedback, setPermissionFeedback] = useState<string | null>(null);

  // Default reader preferences
  const [defaultMushafMode, setDefaultMushafMode] = useState<'facsimile' | 'digital_page'>(() => {
    return (localStorage.getItem('nur_quran_default_mushaf_mode') as 'facsimile' | 'digital_page') || 'facsimile';
  });

  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(() => {
    return localStorage.getItem('nur_quran_autoplay_next') !== 'false';
  });

  const handleUpdateIqama = (updates: Partial<IqamaSettings>) => {
    const next = { ...iqamaSettings, ...updates };
    setIqamaSettings(next);
    saveIqamaSettings(next);
  };

  const handleRequestPermissions = async () => {
    const { audioAllowed, notificationsAllowed } = await requestIqamaPermissions();
    handleUpdateIqama({ permissionGranted: audioAllowed || notificationsAllowed });
    if (audioAllowed || notificationsAllowed) {
      setPermissionFeedback('✓ Audio and background notification permissions successfully enabled!');
    } else {
      setPermissionFeedback('⚠️ Please interact with your browser to enable automatic audio playback.');
    }
    setTimeout(() => setPermissionFeedback(null), 4000);
  };

  const handleToggleVoicePreview = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      stopIqamaAudio();
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      playIqamaAudio(voiceId, iqamaSettings.volume, () => {
        setPlayingVoiceId(null);
      });
    }
  };

  const handleToggleTestIqama = () => {
    handleToggleVoicePreview(iqamaSettings.selectedVoice);
  };

  const handleResetIqamaDefaults = () => {
    const res = resetIqamaSettingsToDefault();
    setIqamaSettings(res);
    setPermissionFeedback('✓ Reset all Iqamah settings to standard Sunnah defaults.');
    setTimeout(() => setPermissionFeedback(null), 3500);
  };

  useEffect(() => {
    return () => {
      stopIqamaAudio();
    };
  }, []);

  const handleSetMushafMode = (mode: 'facsimile' | 'digital_page') => {
    setDefaultMushafMode(mode);
    localStorage.setItem('nur_quran_default_mushaf_mode', mode);
  };

  const handleToggleAutoPlayNext = () => {
    const next = !autoPlayNext;
    setAutoPlayNext(next);
    localStorage.setItem('nur_quran_autoplay_next', next.toString());
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <SettingsIcon className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Settings & Preferences</span>
              <span className="font-arabic text-emerald-700 dark:text-emerald-400 text-lg">
                (الإعدادات)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Customize automatic prayer Iqama, recitation defaults, reading modes, and theme
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 0: Automatic Adhan Settings & Simulation Mode ── */}
      <AdhanControlPanel />

      {/* ── Section 1: Automatic Iqama Recitation (Highlighted Feature) ── */}
      <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-700/50 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Decorative badge */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Automatic Iqama Recitation at Prayer Times</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  New Feature
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatically plays authentic Iqama audio when the time for Salah arrives
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <button
            onClick={() => handleUpdateIqama({ enabled: !iqamaSettings.enabled })}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
              iqamaSettings.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div 
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                iqamaSettings.enabled ? 'translate-x-6' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>

        {/* Permission Request Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Browser Playback & Notification Permissions</span>
            </div>
            <p className="text-emerald-800/80 dark:text-emerald-300/80">
              {iqamaSettings.permissionGranted 
                ? 'Permissions granted. Browser is ready to play Iqama automatically.' 
                : 'Browsers require a user permission gesture to allow automated audio playback and prayer alerts.'}
            </p>
            {permissionFeedback && (
              <p className="font-bold text-emerald-700 dark:text-emerald-300 animate-fade-in">
                {permissionFeedback}
              </p>
            )}
          </div>

          <button
            onClick={handleRequestPermissions}
            className="px-3.5 py-1.5 rounded-xl font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs shrink-0"
          >
            {iqamaSettings.permissionGranted ? 'Re-verify Permissions' : 'Grant Permissions Now'}
          </button>
        </div>

        {/* Sub-controls when enabled */}
        {iqamaSettings.enabled && (
          <div className="space-y-6 pt-2 animate-fade-in">
            
            {/* Header Actions: Reset Defaults */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  1. Automatic Iqamah for All Five Prayers
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Configure independent schedule and delays for Fajr, Dhuhr, Asr, Maghrib, and Isha
                </p>
              </div>

              <button
                onClick={handleResetIqamaDefaults}
                className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Restore traditional Sunnah timing gaps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default Schedule</span>
              </button>
            </div>

            {/* Individual Prayer Configuration Cards (All 5 Prayers) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {([
                { key: 'fajr', name: 'Fajr', arabic: 'الفجر', defaultDelay: 20, desc: 'Dawn Prayer' },
                { key: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', defaultDelay: 15, desc: 'Midday Prayer' },
                { key: 'asr', name: 'Asr', arabic: 'العصر', defaultDelay: 15, desc: 'Afternoon Prayer' },
                { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب', defaultDelay: 10, desc: 'Sunset Prayer' },
                { key: 'isha', name: 'Isha', arabic: 'العشاء', defaultDelay: 15, desc: 'Night Prayer' },
              ] as const).map((p) => {
                const isEnabled = iqamaSettings.enabledPrayers[p.key];
                const currentDelay = iqamaSettings.prayerDelays[p.key] ?? p.defaultDelay;

                return (
                  <div
                    key={p.key}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isEnabled
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Top Header & Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>{p.name}</span>
                            <span className="font-arabic text-[11px] text-emerald-700 dark:text-emerald-400">({p.arabic})</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{p.desc}</div>
                        </div>

                        {/* Prayer On/Off Switch */}
                        <button
                          onClick={() => handleUpdateIqama({
                            enabledPrayers: {
                              ...iqamaSettings.enabledPrayers,
                              [p.key]: !isEnabled
                            }
                          })}
                          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                            isEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          aria-label={`Toggle Iqamah for ${p.name}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Status indicator */}
                      <div className="mt-2 text-[10px] font-semibold">
                        {isEnabled ? (
                          <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Auto-plays {currentDelay === 0 ? 'at Adhan' : `${currentDelay}m after Adhan`}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Disabled for {p.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Delay Select Dropdown */}
                    <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                        Timing Gap:
                      </label>
                      <select
                        value={currentDelay}
                        disabled={!isEnabled}
                        onChange={(e) => handleUpdateIqama({
                          prayerDelays: {
                            ...iqamaSettings.prayerDelays,
                            [p.key]: parseInt(e.target.value, 10)
                          }
                        })}
                        className="w-full py-1 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-white disabled:opacity-50"
                      >
                        <option value={0}>0 min (At Adhan)</option>
                        <option value={5}>5 min after Adhan</option>
                        <option value={10}>10 min after Adhan</option>
                        <option value={15}>15 min after Adhan</option>
                        <option value={20}>20 min after Adhan</option>
                        <option value={25}>25 min after Adhan</option>
                        <option value={30}>30 min after Adhan</option>
                      </select>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* 2. Authentic Iqamah Voices Library */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Authentic Holy Mosque & Muezzin Iqamah Library</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Strictly genuine Iqamah call recordings (never Quran recitation, Adhan, or lectures)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(IQAMA_VOICES).map((voice) => {
                  const isSelected = iqamaSettings.selectedVoice === voice.id;
                  const isPreviewPlaying = playingVoiceId === voice.id;

                  return (
                    <div
                      key={voice.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {voice.name}
                            </div>
                            <div className="font-arabic text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                              {voice.arabicName}
                            </div>
                          </div>

                          <button
                            onClick={() => handleUpdateIqama({ selectedVoice: voice.id })}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">
                          {voice.description}
                        </p>
                      </div>

                      {/* Card Footer: Duration & Preview Button */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">
                          ⏱ {voice.durationSeconds}s duration
                        </span>

                        <button
                          onClick={() => handleToggleVoicePreview(voice.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            isPreviewPlaying
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {isPreviewPlaying ? (
                            <>
                              <Pause className="w-3 h-3 fill-current" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Volume & Active Test */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              
              {/* Volume Slider */}
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                  Iqamah Volume: {Math.round(iqamaSettings.volume * 100)}%
                </span>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={iqamaSettings.volume}
                  onChange={(e) => handleUpdateIqama({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Master Test Button */}
              <button
                onClick={handleToggleTestIqama}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 ${
                  playingVoiceId 
                    ? 'bg-amber-500 text-slate-950 animate-pulse' 
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {playingVoiceId ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Iqamah Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Test Selected Iqamah Audio</span>
                  </>
                )}
              </button>

            </div>

          </div>
        )}


      </div>

      {/* ── Section 2: Reader & Mushaf Display Preferences ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Quran Reader & Mushaf Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          
          {/* Default Mushaf Mode */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Default Quran Experience
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSetMushafMode('facsimile')}
                className={`p-2 rounded-lg text-center font-bold transition-all ${
                  defaultMushafMode === 'facsimile'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Printed 604p Scan
              </button>
              <button
                onClick={() => handleSetMushafMode('digital_page')}
                className={`p-2 rounded-lg text-center font-bold transition-all ${
                  defaultMushafMode === 'digital_page'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Interactive Page
              </button>
            </div>
          </div>

          {/* Auto-Play Next Surah */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Continuous Playback
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically proceed to the next Surah upon completion
              </p>
            </div>
            <button
              onClick={handleToggleAutoPlayNext}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                autoPlayNext 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {autoPlayNext ? 'Enabled' : 'Disabled'}
            </button>
          </div>

        </div>
      </div>

      {/* ── Section 3: Theme & Display ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Appearance & Theme</span>
        </h2>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Reading Theme
            </div>
            <div className="text-[11px] text-slate-500">
              {isDarkMode ? 'Dark theme active for comfortable night recitation' : 'Light crisp daytime mode'}
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDarkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>
      </div>

      {/* ── Section 4: Data & Reset ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-slate-500" />
          <span>Storage & Offline Data</span>
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          All your bookmarks, khatma goals, completed surahs, and last reading position are stored locally on your device with complete privacy.
        </p>

        {onClearProgress && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset reading progress? Your bookmarks will be kept.')) {
                onClearProgress();
              }
            }}
            className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            Reset Reading Progress
          </button>
        )}
      </div>

    </div>
  );
};

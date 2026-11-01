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
  requestIqamaPermissions, 
  playIqamaAudio, 
  stopIqamaAudio,
  IqamaSettings,
  IQAMA_AUDIO_SOURCES 
} from '../services/iqamaService';

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
  const [isPlayingTestIqama, setIsPlayingTestIqama] = useState(false);
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
    handleUpdateIqama({ permissionGranted: audioAllowed });
    if (audioAllowed) {
      setPermissionFeedback('✓ Audio and background permissions successfully enabled!');
    } else {
      setPermissionFeedback('⚠️ Please interact with your browser to enable audio playback.');
    }
    setTimeout(() => setPermissionFeedback(null), 4000);
  };

  const handleToggleTestIqama = () => {
    if (isPlayingTestIqama) {
      stopIqamaAudio();
      setIsPlayingTestIqama(false);
    } else {
      setIsPlayingTestIqama(true);
      playIqamaAudio(iqamaSettings.reciter, iqamaSettings.volume, () => {
        setIsPlayingTestIqama(false);
      });
    }
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
          <div className="space-y-5 pt-2 animate-fade-in">
            
            {/* Reciter Voice Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Iqama Reciter / Holy Mosque Voice
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.entries(IQAMA_AUDIO_SOURCES).map(([key, item]) => {
                  const isSelected = iqamaSettings.reciter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleUpdateIqama({ reciter: key as 'makkah' | 'madinah' | 'sheikh' })}
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-200 shadow-xs'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                      }`}
                    >
                      <div className="font-bold">{item.name}</div>
                      <div className="font-arabic text-[11px] text-slate-500 mt-0.5">{item.arabicName}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delay Timing After Adhan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Playback Timing (Interval between Adhan and Iqama)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { val: 0, label: 'Immediately (At Adhan)' },
                  { val: 5, label: '5 Minutes After Adhan' },
                  { val: 10, label: '10 Minutes (Sunnah Gap)' },
                  { val: 15, label: '15 Minutes After Adhan' }
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => handleUpdateIqama({ delayMinutes: item.val })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      iqamaSettings.delayMinutes === item.val
                        ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume & Test Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              
              {/* Volume Slider */}
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                  Iqama Volume: {Math.round(iqamaSettings.volume * 100)}%
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

              {/* Test Audio Button */}
              <button
                onClick={handleToggleTestIqama}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 ${
                  isPlayingTestIqama 
                    ? 'bg-amber-500 text-slate-950 animate-pulse' 
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isPlayingTestIqama ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Test Play Iqama</span>
                  </>
                )}
              </button>

            </div>

            {/* Prayers Selection Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Enable Iqama for Specific Prayers
              </label>
              <div className="flex flex-wrap gap-2">
                {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => {
                  const isChecked = iqamaSettings.selectedPrayers[p];
                  return (
                    <button
                      key={p}
                      onClick={() => handleUpdateIqama({
                        selectedPrayers: {
                          ...iqamaSettings.selectedPrayers,
                          [p]: !isChecked
                        }
                      })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        isChecked
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
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

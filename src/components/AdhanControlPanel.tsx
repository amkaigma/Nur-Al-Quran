import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Volume2,
  Play,
  Pause,
  ShieldCheck,
  Clock,
  Check,
  AlertTriangle,
  Sliders,
  Trash2,
  RotateCcw,
  Timer,
  Smartphone,
  Activity
} from 'lucide-react';
import {
  AdhanSettings,
  AdhanDiagnosticEvent,
  SimulatedAdhanTask,
  ADHAN_VOICE_SOURCES,
  ADHAN_SETTINGS_UPDATED_EVENT,
  ADHAN_DIAGNOSTICS_UPDATED_EVENT,
  ADHAN_SIMULATION_UPDATED_EVENT,
  getAdhanSettings,
  saveAdhanSettings,
  resetAdhanSettingsToDefault,
  requestAdhanPermissions,
  playAdhanVoice,
  stopAdhanAudio,
  verifyMuezzinAudio,
  getAdhanDiagnostics,
  clearAdhanDiagnostics,
  getSimulatedAdhan,
  scheduleSimulatedAdhan,
  cancelSimulatedAdhan,
  triggerImmediateAdhanTest,
  hasAdhanTriggeredForDatePrayer,
  isAdhanAudioUnlocked,
  resolveVoiceIdForPrayer
} from '../services/adhanService';
import {
  DailyPrayerKey,
  PrayerTimesResult,
  PRAYER_CONFIG_UPDATED_EVENT,
  calculatePrayerTimes,
  getActiveLocationMeta
} from '../services/prayerTimes';
import {
  getPlatformCapabilities,
  PlatformCapabilityReport
} from '../services/nativeAdhanBridge';
import { MUEZZIN_VOICES } from '../data/muezzins';

interface AdhanControlPanelProps {
  prayerTimesOverride?: PrayerTimesResult;
  cityNameOverride?: string;
  compact?: boolean;
}

const PRAYER_META: Array<{ key: DailyPrayerKey; label: string; arabic: string }> = [
  { key: 'fajr', label: 'Fajr', arabic: 'الفجر' },
  { key: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر' },
  { key: 'asr', label: 'Asr', arabic: 'العصر' },
  { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب' },
  { key: 'isha', label: 'Isha', arabic: 'العشاء' }
];

export const AdhanControlPanel: React.FC<AdhanControlPanelProps> = ({
  prayerTimesOverride,
  cityNameOverride,
  compact = false
}) => {
  const [settings, setSettings] = useState<AdhanSettings>(() => getAdhanSettings());
  const [diagnostics, setDiagnostics] = useState<AdhanDiagnosticEvent[]>(() => getAdhanDiagnostics());
  const [simTask, setSimTask] = useState<SimulatedAdhanTask | null>(() => getSimulatedAdhan());
  const [simPrayer, setSimPrayer] = useState<DailyPrayerKey>('fajr');
  const [simDelaySec, setSimDelaySec] = useState<number>(15);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [permissionMsg, setPermissionMsg] = useState<string | null>(null);
  const [audioVerifyStatus, setAudioVerifyStatus] = useState<string | null>(null);
  const [isVerifyingAudio, setIsVerifyingAudio] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [capabilities, setCapabilities] = useState<PlatformCapabilityReport | null>(null);
  const [configVersion, setConfigVersion] = useState(0);

  // Sync external updates across tabs/components
  useEffect(() => {
    const onSettings = () => setSettings(getAdhanSettings());
    const onDiag = () => setDiagnostics(getAdhanDiagnostics());
    const onSim = () => setSimTask(getSimulatedAdhan());
    const onLoc = () => setConfigVersion((v) => v + 1);

    window.addEventListener(ADHAN_SETTINGS_UPDATED_EVENT, onSettings);
    window.addEventListener(ADHAN_DIAGNOSTICS_UPDATED_EVENT, onDiag);
    window.addEventListener(ADHAN_SIMULATION_UPDATED_EVENT, onSim);
    window.addEventListener(PRAYER_CONFIG_UPDATED_EVENT, onLoc);
    return () => {
      window.removeEventListener(ADHAN_SETTINGS_UPDATED_EVENT, onSettings);
      window.removeEventListener(ADHAN_DIAGNOSTICS_UPDATED_EVENT, onDiag);
      window.removeEventListener(ADHAN_SIMULATION_UPDATED_EVENT, onSim);
      window.removeEventListener(PRAYER_CONFIG_UPDATED_EVENT, onLoc);
    };
  }, []);

  // Tick every second while simulation countdown is active (or every 15s otherwise)
  useEffect(() => {
    const ms = simTask && simTask.status === 'pending' ? 500 : 15000;
    const id = setInterval(() => setNowMs(Date.now()), ms);
    return () => clearInterval(id);
  }, [simTask]);

  useEffect(() => {
    getPlatformCapabilities().then(setCapabilities).catch(() => undefined);
  }, [settings.permissionGranted]);

  const activeLocation = useMemo(() => {
    return getActiveLocationMeta(new Date(nowMs));
  }, [nowMs, configVersion]);

  const activePrayerTimes = useMemo(() => {
    if (prayerTimesOverride) return prayerTimesOverride;
    return calculatePrayerTimes(
      new Date(nowMs),
      activeLocation.lat,
      activeLocation.lng,
      activeLocation.timezone,
      activeLocation.method,
      activeLocation.asrJuristic,
      activeLocation.adjustments
    );
  }, [prayerTimesOverride, nowMs, activeLocation]);

  const activeCityName = cityNameOverride || activeLocation.name;

  const updateSettings = (updates: Partial<AdhanSettings>) => {
    const next: AdhanSettings = {
      ...settings,
      ...updates,
      enabledPrayers: updates.enabledPrayers
        ? { ...settings.enabledPrayers, ...updates.enabledPrayers }
        : settings.enabledPrayers
    };
    setSettings(next);
    saveAdhanSettings(next);
  };

  const handleRequestPermissions = async () => {
    const { audioAllowed, notificationsAllowed } = await requestAdhanPermissions();
    const caps = await getPlatformCapabilities();
    setCapabilities(caps);
    if (audioAllowed && notificationsAllowed) {
      setPermissionMsg('Audio unlocked and system notifications granted.');
    } else if (audioAllowed) {
      setPermissionMsg('Audio unlocked for this session. Enable browser notifications if you want lock-screen/banner alerts.');
    } else {
      setPermissionMsg('Tap anywhere or allow Notifications in browser settings for alerts.');
    }
    setTimeout(() => setPermissionMsg(null), 5000);
  };

  const handleTogglePreview = () => {
    setPreviewError(null);
    if (isPreviewPlaying) {
      stopAdhanAudio();
      setIsPreviewPlaying(false);
      return;
    }
    setIsPreviewPlaying(true);
    playAdhanVoice(
      settings.selectedVoice,
      settings.volume,
      false,
      () => setIsPreviewPlaying(false),
      (err) => {
        setIsPreviewPlaying(false);
        setPreviewError(err);
      }
    );
  };

  const handleVerifySelectedAudio = async () => {
    setIsVerifyingAudio(true);
    setAudioVerifyStatus(null);
    const res = await verifyMuezzinAudio(settings.selectedVoice);
    setIsVerifyingAudio(false);
    if (res.ok) {
      setAudioVerifyStatus(
        `Verified (${res.status === 'working' ? 'local/primary stream ready' : 'fallback stream ready'}${res.duration ? `, ${res.duration}s` : ''})`
      );
    } else {
      setAudioVerifyStatus(`Audio check failed: ${res.error || 'unreachable'}`);
    }
  };

  const handleScheduleSimulation = (delaySec: number) => {
    setPreviewError(null);
    // Also unlock audio using this click gesture so countdown triggers cleanly
    void requestAdhanPermissions();
    const task = scheduleSimulatedAdhan(simPrayer, delaySec, activeCityName);
    setSimTask(task);
    setNowMs(Date.now());
  };

  const handleTriggerImmediate = () => {
    setPreviewError(null);
    triggerImmediateAdhanTest(simPrayer, activeCityName, {
      onAdhanError: (_p, _v, msg) => setPreviewError(msg),
      onAdhanBlocked: (_p, _v, msg) => setPreviewError(msg)
    });
  };

  const simRemainingSec =
    simTask && simTask.status === 'pending'
      ? Math.max(0, Math.ceil((simTask.triggerAtMs - nowMs) / 1000))
      : 0;

  const audioUnlocked = isAdhanAudioUnlocked();
  const notifPerm = capabilities?.notificationPermission || 'default';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header + Master Auto-Adhan Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Automatic Adhan Scheduler & Audio System
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automatically announces Fajr, Dhuhr, Asr, Maghrib, and Isha for <strong>{activeCityName}</strong> ({activeLocation.method.toUpperCase()}).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleTogglePreview}
            className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {isPreviewPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPreviewPlaying ? 'Stop Adhan' : 'Preview Adhan'}</span>
          </button>

          <button
            onClick={handleRequestPermissions}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              notifPerm === 'granted' && audioUnlocked
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
            }`}
            title="Unlock audio playback & grant notification permission"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notifPerm === 'granted' && audioUnlocked ? 'Audio & Alerts Ready' : 'Enable Audio & Alerts'}</span>
          </button>

          <button
            onClick={() => updateSettings({ enabled: !settings.enabled })}
            aria-label="Toggle Automatic Adhan"
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
              settings.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                settings.enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Feedback / Errors */}
      {permissionMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
          {permissionMsg}
        </div>
      )}

      {previewError && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{previewError}</span>
        </div>
      )}

      {/* Platform & Permission Status Summary */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Runtime:{' '}
              {capabilities?.platform === 'capacitor_android'
                ? 'Android APK (Native Alarms Supported)'
                : capabilities?.platform === 'pwa_installed'
                ? 'Installed PWA'
                : 'Web Browser'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className={audioUnlocked ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400 font-semibold'}>
              Audio: {audioUnlocked ? 'Unlocked' : 'Needs Click/Gesture'}
            </span>
            <span className={notifPerm === 'granted' ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400 font-semibold'}>
              Notifications: {notifPerm}
            </span>
          </div>
        </div>
        {capabilities && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {capabilities.honestSummary}
          </p>
        )}
      </div>

      {settings.enabled && (
        <>
          {/* 5 Daily Prayers Enable/Disable & Live Scheduled Times */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Daily Adhan Schedule ({activePrayerTimes.dateKey})
              </span>
              <button
                onClick={() => {
                  const def = resetAdhanSettingsToDefault();
                  setSettings(def);
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRAYER_META.map((p) => {
                const slot = activePrayerTimes.schedule[p.key];
                const isOn = settings.enabledPrayers[p.key];
                const triggeredToday = hasAdhanTriggeredForDatePrayer(activePrayerTimes.dateKey, p.key);
                const resolvedVoice = MUEZZIN_VOICES.find(
                  (m) => m.id === resolveVoiceIdForPrayer(settings, p.key)
                );

                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        enabledPrayers: {
                          ...settings.enabledPrayers,
                          [p.key]: !isOn
                        }
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isOn
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.label}
                      </span>
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isOn
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="text-sm font-black font-mono text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {slot.formatted}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {triggeredToday ? 'Called today' : isOn ? resolvedVoice?.name || 'Auto-Adhan On' : 'Disabled'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice, Fajr Voice, Mode & Volume Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Default Muadhin Voice:
              </label>
              <select
                value={settings.selectedVoice}
                onChange={(e) => updateSettings({ selectedVoice: e.target.value })}
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                {Object.entries(ADHAN_VOICE_SOURCES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Fajr Muadhin (with Tathweeb):
              </label>
              <select
                value={settings.fajrVoice || settings.selectedVoice}
                onChange={(e) =>
                  updateSettings({
                    fajrVoice: e.target.value,
                    perPrayerVoices: {
                      ...settings.perPrayerVoices,
                      fajr: e.target.value
                    }
                  })
                }
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                {Object.entries(ADHAN_VOICE_SOURCES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Notification Mode:
              </label>
              <select
                value={settings.mode}
                onChange={(e) =>
                  updateSettings({ mode: e.target.value as AdhanSettings['mode'] })
                }
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                <option value="adhan_and_notification">Adhan Audio + System Notification</option>
                <option value="notification_only">System Notification Only (No Audio)</option>
                <option value="silent">Silent In-App Alert Only</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Adhan Volume ({Math.round(settings.volume * 100)}%):
              </label>
              <div className="flex items-center gap-2 pt-1">
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <input
                  type="range"
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* 5-Prayer Test & Simulation Mode */}
          {!compact && (
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/70 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-amber-600" />
                    <span>Adhan Test & Next-Minute Simulation Mode</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80">
                    Test automatic scheduling, notification, and audio playback for any of the 5 prayers without waiting until real prayer time.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleVerifySelectedAudio}
                    disabled={isVerifyingAudio}
                    className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 transition-colors"
                  >
                    {isVerifyingAudio ? 'Checking Audio...' : 'Verify Audio Stream'}
                  </button>
                  <button
                    onClick={() => setShowDiagnostics((v) => !v)}
                    className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1"
                  >
                    <Activity className="w-3 h-3" />
                    <span>{showDiagnostics ? 'Hide Log' : `Diagnostics (${diagnostics.length})`}</span>
                  </button>
                </div>
              </div>

              {audioVerifyStatus && (
                <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-slate-900/70 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {audioVerifyStatus}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <select
                  value={simPrayer}
                  onChange={(e) => setSimPrayer(e.target.value as DailyPrayerKey)}
                  className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-800 dark:text-white"
                >
                  {PRAYER_META.map((p) => (
                    <option key={p.key} value={p.key}>
                      Test {p.label} ({p.arabic})
                    </option>
                  ))}
                </select>

                <select
                  value={simDelaySec}
                  onChange={(e) => setSimDelaySec(parseInt(e.target.value, 10))}
                  className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  <option value={5}>Arrive in 5 seconds</option>
                  <option value={15}>Arrive in 15 seconds</option>
                  <option value={30}>Arrive in 30 seconds</option>
                  <option value={60}>Arrive in 60 seconds (next minute)</option>
                </select>

                <button
                  onClick={() => handleScheduleSimulation(simDelaySec)}
                  className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Schedule Simulated Prayer
                </button>

                <button
                  onClick={handleTriggerImmediate}
                  className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Trigger Now
                </button>
              </div>

              {simTask && simTask.status === 'pending' && (
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Simulated <span className="uppercase text-emerald-700 dark:text-emerald-400">{simTask.prayerKey}</span> Adhan will fire in{' '}
                    <span className="font-mono font-black text-amber-700 dark:text-amber-400">{simRemainingSec}s</span>
                  </div>
                  <button
                    onClick={() => {
                      cancelSimulatedAdhan();
                      setSimTask(null);
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {showDiagnostics && (
                <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="font-bold text-emerald-400">Adhan Scheduler Event Log</span>
                    <button
                      onClick={() => {
                        clearAdhanDiagnostics();
                        setDiagnostics([]);
                      }}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  {diagnostics.length === 0 ? (
                    <div className="text-slate-500">No scheduler events recorded yet.</div>
                  ) : (
                    diagnostics.map((ev) => (
                      <div key={ev.id} className="leading-snug border-b border-slate-900 pb-1 last:border-b-0">
                        <span className="text-slate-400">
                          [{new Date(ev.timestampMs).toLocaleTimeString()}]
                        </span>{' '}
                        <span className="text-amber-300 font-bold">[{ev.type}]</span>{' '}
                        <span>{ev.message}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

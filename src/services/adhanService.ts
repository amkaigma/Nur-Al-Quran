/**
 * Worldwide Adhan Notification and Playback Service
 * Dedicated to announcing the entry of prayer times for all 5 daily prayers.
 * Strictly separated from Quran recitation & Iqamah.
 */

import { MUEZZIN_VOICES, MuezzinVoice, getMuezzinById } from '../data/muezzins';
import type { DailyPrayerKey, PrayerTimesResult } from './prayerTimes';

export interface AdhanSettings {
  enabled: boolean;
  selectedVoice: string; // Muezzin ID, default 'makkah_ali_mulla'
  fajrVoice?: string;    // Dedicated Muezzin for Fajr
  perPrayerVoices?: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  favoriteVoices: string[];
  volume: number; // 0.05 to 1.0
  mode: 'adhan_and_notification' | 'notification_only' | 'silent';
  prePrayerReminderMinutes: number; // 0 = off, 5, 10, 15 min before
  permissionGranted: boolean;
  enabledPrayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

export interface AdhanDiagnosticEvent {
  id: string;
  timestampMs: number;
  type:
    | 'triggered'
    | 'audio_started'
    | 'fallback_used'
    | 'autoplay_blocked'
    | 'audio_error'
    | 'missed_skipped'
    | 'simulated'
    | 'permission';
  prayerKey?: DailyPrayerKey;
  voiceId?: string;
  message: string;
}

export interface SimulatedAdhanTask {
  id: string;
  prayerKey: DailyPrayerKey;
  triggerAtMs: number;
  scheduledAtMs: number;
  cityName: string;
  voiceId: string;
  status: 'pending' | 'triggered';
}

export const DEFAULT_ADHAN_SETTINGS: AdhanSettings = {
  enabled: true,
  selectedVoice: 'makkah_ali_mulla',
  fajrVoice: 'makkah_ali_mulla',
  perPrayerVoices: {
    fajr: 'makkah_ali_mulla',
    dhuhr: 'makkah_ali_mulla',
    asr: 'makkah_ali_mulla',
    maghrib: 'makkah_ali_mulla',
    isha: 'makkah_ali_mulla'
  },
  favoriteVoices: ['makkah_ali_mulla', 'madinah_surayhi', 'nigeria_abuja_national', 'nigeria_kano_central'],
  volume: 0.9,
  mode: 'adhan_and_notification',
  prePrayerReminderMinutes: 0,
  permissionGranted: false,
  enabledPrayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  }
};

export const ADHAN_VOICE_SOURCES: Record<string, { name: string; url: string; fallbackUrl?: string }> = {
  ...MUEZZIN_VOICES.reduce((acc, m) => {
    acc[m.id] = {
      name: `${m.name} (${m.mosque || m.city})`,
      url: m.audioUrl,
      fallbackUrl: m.fallbackAudioUrl
    };
    return acc;
  }, {} as Record<string, { name: string; url: string; fallbackUrl?: string }>)
};

export const ADHAN_SETTINGS_UPDATED_EVENT = 'nur_adhan_settings_updated';
export const ADHAN_DIAGNOSTICS_UPDATED_EVENT = 'nur_adhan_diagnostics_updated';
export const ADHAN_SIMULATION_UPDATED_EVENT = 'nur_adhan_simulation_updated';

const ADHAN_STORAGE_KEY = 'nur_quran_adhan_settings';
const LAST_PLAYED_ADHAN_KEY = 'nur_quran_last_played_adhan';
const TRIGGERED_MAP_KEY = 'nur_quran_adhan_triggered_map';
const DIAGNOSTICS_KEY = 'nur_quran_adhan_diagnostics';
const SIMULATION_KEY = 'nur_quran_adhan_sim_test';

const TRIGGER_WINDOW_MS = 90_000; // 90 seconds exact arrival window; missed prayers older than 90s do not cascade

const PRAYER_DISPLAY_NAMES: Record<DailyPrayerKey, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha'
};

// ============================================================================
// SETTINGS STORAGE
// ============================================================================

function emitEvent(name: string, detail?: unknown): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

export function getAdhanSettings(): AdhanSettings {
  try {
    const saved = localStorage.getItem(ADHAN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      let selectedVoice = parsed.selectedVoice || 'makkah_ali_mulla';
      if (selectedVoice === 'makkah') selectedVoice = 'makkah_ali_mulla';
      if (selectedVoice === 'madinah') selectedVoice = 'madinah_surayhi';
      if (selectedVoice === 'alaqsa') selectedVoice = 'alaqsa_naji_qazzaz';
      if (selectedVoice === 'cairo') selectedVoice = 'egypt_muhammad_rifat';
      if (selectedVoice === 'nigerian') selectedVoice = 'nigeria_abuja_national';
      if (selectedVoice === 'alafasy') selectedVoice = 'makkah_ali_mulla';

      return {
        ...DEFAULT_ADHAN_SETTINGS,
        ...parsed,
        selectedVoice,
        enabledPrayers: {
          ...DEFAULT_ADHAN_SETTINGS.enabledPrayers,
          ...(parsed.enabledPrayers || {})
        },
        favoriteVoices: parsed.favoriteVoices || DEFAULT_ADHAN_SETTINGS.favoriteVoices,
        perPrayerVoices: {
          ...DEFAULT_ADHAN_SETTINGS.perPrayerVoices,
          ...(parsed.perPrayerVoices || {})
        }
      };
    }
  } catch (e) {
    console.warn('Failed to load Adhan settings:', e);
  }
  return { ...DEFAULT_ADHAN_SETTINGS };
}

export function saveAdhanSettings(settings: AdhanSettings): void {
  try {
    localStorage.setItem(ADHAN_STORAGE_KEY, JSON.stringify(settings));
    emitEvent(ADHAN_SETTINGS_UPDATED_EVENT, settings);
  } catch (e) {
    console.warn('Failed to save Adhan settings:', e);
  }
}

export function resetAdhanSettingsToDefault(): AdhanSettings {
  const def = { ...DEFAULT_ADHAN_SETTINGS };
  saveAdhanSettings(def);
  return def;
}

// ============================================================================
// DIAGNOSTICS LOG
// ============================================================================

export function getAdhanDiagnostics(): AdhanDiagnosticEvent[] {
  try {
    const raw = localStorage.getItem(DIAGNOSTICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logAdhanDiagnostic(
  entry: Omit<AdhanDiagnosticEvent, 'id' | 'timestampMs'>
): AdhanDiagnosticEvent {
  const full: AdhanDiagnosticEvent = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestampMs: Date.now(),
    ...entry
  };
  try {
    const existing = getAdhanDiagnostics();
    const updated = [full, ...existing].slice(0, 30);
    localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(updated));
    emitEvent(ADHAN_DIAGNOSTICS_UPDATED_EVENT, updated);
  } catch {
    // Ignore storage quota issues
  }
  return full;
}

export function clearAdhanDiagnostics(): void {
  try {
    localStorage.removeItem(DIAGNOSTICS_KEY);
    emitEvent(ADHAN_DIAGNOSTICS_UPDATED_EVENT, []);
  } catch {
    // Ignored
  }
}

// ============================================================================
// AUDIO SESSION UNLOCK & SINGLETON PLAYER ENGINE
// ============================================================================

let activeAdhanAudio: HTMLAudioElement | null = null;
let sharedAudioElement: HTMLAudioElement | null = null;
let sharedAudioContext: AudioContext | null = null;
let audioSessionUnlocked = false;
let gestureListenersAttached = false;

export function isAdhanAudioUnlocked(): boolean {
  return audioSessionUnlocked;
}

function getOrCreateSharedAudioElement(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null;
  if (!sharedAudioElement) {
    sharedAudioElement = new Audio();
    sharedAudioElement.preload = 'auto';
  }
  return sharedAudioElement;
}

export async function unlockAdhanAudioSession(silentGesture: boolean = true): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  let unlocked = false;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      if (!sharedAudioContext) {
        sharedAudioContext = new AudioCtx();
      }
      if (sharedAudioContext.state === 'suspended') {
        await sharedAudioContext.resume();
      }
      unlocked = sharedAudioContext.state === 'running';
    }
  } catch {
    // Fallback to audio element unlock below
  }

  try {
    const el = getOrCreateSharedAudioElement();
    if (el && el.paused && !el.src) {
      el.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      el.volume = 0.01;
      await el.play();
      el.pause();
      el.currentTime = 0;
      el.removeAttribute('src');
      el.load();
      unlocked = true;
    } else if (el) {
      unlocked = true;
    }
  } catch {
    // Will retry on next user gesture
  }

  if (unlocked) {
    audioSessionUnlocked = true;
    if (!silentGesture) {
      logAdhanDiagnostic({
        type: 'permission',
        message: 'Audio session unlocked for automatic Adhan playback.'
      });
    }
  }

  return unlocked;
}

/**
 * Attaches passive one-time unlock listeners so any user click/tap in the app
 * unlocks browser audio autoplay for scheduled prayer times during the session.
 */
export function attachGlobalAdhanAudioUnlock(): void {
  if (typeof window === 'undefined' || gestureListenersAttached) return;
  gestureListenersAttached = true;

  const onUserGesture = () => {
    if (audioSessionUnlocked) return;
    unlockAdhanAudioSession(true).then((ok) => {
      if (ok) {
        emitEvent(ADHAN_DIAGNOSTICS_UPDATED_EVENT, getAdhanDiagnostics());
      }
    });
  };

  window.addEventListener('pointerdown', onUserGesture, { passive: true });
  window.addEventListener('keydown', onUserGesture, { passive: true });
  window.addEventListener('touchstart', onUserGesture, { passive: true });
}

export async function requestAdhanPermissions(): Promise<{ audioAllowed: boolean; notificationsAllowed: boolean }> {
  const audioAllowed = await unlockAdhanAudioSession(false);
  let notificationsAllowed = false;

  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const perm = await Notification.requestPermission();
      notificationsAllowed = perm === 'granted';
    } catch {
      notificationsAllowed = false;
    }
  }

  const current = getAdhanSettings();
  saveAdhanSettings({
    ...current,
    permissionGranted: audioAllowed || notificationsAllowed
  });

  logAdhanDiagnostic({
    type: 'permission',
    message: `Permissions verified — Audio unlocked: ${audioAllowed ? 'Yes' : 'Needs gesture'}, Notifications: ${notificationsAllowed ? 'Granted' : 'Not granted'}.`
  });

  return { audioAllowed, notificationsAllowed };
}

/**
 * Returns audio source for a given voice and prayer type.
 */
export function getAdhanAudioUrl(voiceId: string, isFajr: boolean = false): { primary: string; fallback: string } {
  const muezzin = getMuezzinById(voiceId) || MUEZZIN_VOICES[0];
  if (isFajr && muezzin.fajrAudioUrl) {
    return {
      primary: muezzin.fajrAudioUrl,
      fallback: muezzin.fallbackAudioUrl
    };
  }
  return {
    primary: muezzin.audioUrl,
    fallback: muezzin.fallbackAudioUrl
  };
}

/**
 * Stops any currently playing Adhan.
 */
export function stopAdhanAudio(): void {
  if (activeAdhanAudio) {
    try {
      activeAdhanAudio.onended = null;
      activeAdhanAudio.onerror = null;
      activeAdhanAudio.pause();
      activeAdhanAudio.currentTime = 0;
      activeAdhanAudio.removeAttribute('src');
      activeAdhanAudio.load();
    } catch {
      // Ignored
    }
    activeAdhanAudio = null;
  }
}

/**
 * Plays the authentic Adhan recording for a Muezzin using the unlocked audio element.
 */
export function playAdhanVoice(
  voiceId: string,
  volume: number = 0.9,
  isFajr: boolean = false,
  onEnd?: () => void,
  onError?: (errMessage: string, info?: { blockedByAutoplay?: boolean }) => void
): HTMLAudioElement {
  stopAdhanAudio();

  const { primary, fallback } = getAdhanAudioUrl(voiceId, isFajr);
  const audio = getOrCreateSharedAudioElement() || new Audio();
  audio.volume = Math.max(0.05, Math.min(1.0, volume));
  audio.src = primary;
  audio.load();

  let hasAttemptedFallback = false;

  const isAutoplayBlocked = (err: unknown): boolean => {
    if (!err || typeof err !== 'object') return false;
    const name = (err as { name?: string }).name || '';
    const msg = (err as { message?: string }).message || '';
    return name === 'NotAllowedError' || msg.toLowerCase().includes('user didn\'t interact') || msg.toLowerCase().includes('autoplay');
  };

  audio.onended = () => {
    activeAdhanAudio = null;
    if (onEnd) onEnd();
  };

  audio.onerror = () => {
    if (!hasAttemptedFallback && fallback && fallback !== primary) {
      hasAttemptedFallback = true;
      logAdhanDiagnostic({
        type: 'fallback_used',
        voiceId,
        message: `Primary Adhan source failed (${primary}); switching to verified fallback (${fallback}).`
      });
      audio.src = fallback;
      audio.load();
      audio.play().catch((e) => {
        const blocked = isAutoplayBlocked(e);
        const msg = blocked
          ? 'Adhan playback was blocked by browser autoplay policy. Click "Play Adhan" to listen.'
          : 'Audio playback failed on both primary and backup sources.';
        logAdhanDiagnostic({
          type: blocked ? 'autoplay_blocked' : 'audio_error',
          voiceId,
          message: msg
        });
        if (onError) onError(msg, { blockedByAutoplay: blocked });
      });
    } else {
      const msg = `Unable to load Adhan recording (${primary}). Check audio file or network.`;
      logAdhanDiagnostic({
        type: 'audio_error',
        voiceId,
        message: msg
      });
      if (onError) onError(msg, { blockedByAutoplay: false });
    }
  };

  audio.play().then(() => {
    audioSessionUnlocked = true;
    logAdhanDiagnostic({
      type: 'audio_started',
      voiceId,
      message: `Playing ${isFajr ? 'Fajr ' : ''}Adhan (${voiceId}) from ${primary}.`
    });
  }).catch((err) => {
    if (isAutoplayBlocked(err)) {
      const msg = 'Browser paused automatic audio because the tab has not been interacted with yet. Tap Play Adhan on the alert banner.';
      logAdhanDiagnostic({
        type: 'autoplay_blocked',
        voiceId,
        message: msg
      });
      if (onError) onError(msg, { blockedByAutoplay: true });
      return;
    }

    if (!hasAttemptedFallback && fallback && fallback !== primary) {
      hasAttemptedFallback = true;
      logAdhanDiagnostic({
        type: 'fallback_used',
        voiceId,
        message: `Primary playback failed (${err?.message || 'error'}); trying fallback source.`
      });
      audio.src = fallback;
      audio.load();
      audio.play().then(() => {
        logAdhanDiagnostic({
          type: 'audio_started',
          voiceId,
          message: `Playing Adhan from fallback (${fallback}).`
        });
      }).catch((fallbackErr) => {
        const blocked = isAutoplayBlocked(fallbackErr);
        const msg = blocked
          ? 'Browser blocked automatic audio until user click.'
          : 'Audio playback failed on both primary and backup sources.';
        logAdhanDiagnostic({
          type: blocked ? 'autoplay_blocked' : 'audio_error',
          voiceId,
          message: msg
        });
        if (onError) onError(msg, { blockedByAutoplay: blocked });
      });
    } else {
      const msg = 'Adhan playback failed due to network or media decode error.';
      logAdhanDiagnostic({
        type: 'audio_error',
        voiceId,
        message: msg
      });
      if (onError) onError(msg, { blockedByAutoplay: false });
    }
  });

  activeAdhanAudio = audio;
  return audio;
}

/**
 * Compatibility alias
 */
export function playAdhanAudio(
  voiceKey: string,
  volume: number = 0.9,
  onEnd?: () => void,
  onError?: (errMessage: string, info?: { blockedByAutoplay?: boolean }) => void
): HTMLAudioElement {
  return playAdhanVoice(voiceKey, volume, false, onEnd, onError);
}

// ============================================================================
// PER-DATE PER-PRAYER DEDUPLICATION & NOTIFICATIONS
// ============================================================================

function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTriggeredMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(TRIGGERED_MAP_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveTriggeredMap(map: Record<string, number>): void {
  try {
    // Prune entries older than 7 days
    const cutoff = Date.now() - 7 * 86400000;
    const pruned: Record<string, number> = {};
    for (const [k, ts] of Object.entries(map)) {
      if (typeof ts === 'number' && ts >= cutoff) {
        pruned[k] = ts;
      }
    }
    localStorage.setItem(TRIGGERED_MAP_KEY, JSON.stringify(pruned));
  } catch {
    // Ignored
  }
}

export function hasAdhanTriggeredForDatePrayer(dateKey: string, prayerKey: DailyPrayerKey): boolean {
  const map = getTriggeredMap();
  return Boolean(map[`${dateKey}_adhan_${prayerKey}`]);
}

export function markAdhanTriggeredForDatePrayer(dateKey: string, prayerKey: DailyPrayerKey, ts: number = Date.now()): void {
  const map = getTriggeredMap();
  const playKey = `${dateKey}_adhan_${prayerKey}`;
  map[playKey] = ts;
  saveTriggeredMap(map);
  try {
    localStorage.setItem(LAST_PLAYED_ADHAN_KEY, playKey);
  } catch {
    // Ignored
  }
}

export function clearAdhanTriggerHistoryForDate(dateKey: string): void {
  const map = getTriggeredMap();
  for (const key of Object.keys(map)) {
    if (key.startsWith(`${dateKey}_adhan_`)) {
      delete map[key];
    }
  }
  saveTriggeredMap(map);
}

export function resolveVoiceIdForPrayer(
  settings: AdhanSettings,
  prayerKey: DailyPrayerKey
): string {
  let voiceId = settings.selectedVoice;
  if (settings.perPrayerVoices && settings.perPrayerVoices[prayerKey]) {
    voiceId = settings.perPrayerVoices[prayerKey]!;
  } else if (prayerKey === 'fajr' && settings.fajrVoice) {
    voiceId = settings.fajrVoice;
  }
  return voiceId;
}

export function getPrayerAdhanVoice(prayerKey: DailyPrayerKey): MuezzinVoice {
  const settings = getAdhanSettings();
  const voiceId = resolveVoiceIdForPrayer(settings, prayerKey);
  return getMuezzinById(voiceId) || MUEZZIN_VOICES[0];
}

async function dispatchSystemNotification(params: {
  title: string;
  body: string;
  prayerKey: DailyPrayerKey;
  voiceId: string;
  triggerAudio: boolean;
}): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  // Prefer ServiceWorkerRegistration notification (reliable on Android Chrome/PWA)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration('/');
      if (reg && typeof reg.showNotification === 'function') {
        await reg.showNotification(params.title, {
          body: params.body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: `nur-adhan-${params.prayerKey}`,
          requireInteraction: true,
          data: {
            prayerKey: params.prayerKey,
            voiceId: params.voiceId,
            triggerAudio: params.triggerAudio
          }
        });
        return;
      }
    } catch {
      // Fallback below
    }
  }

  try {
    const notif = new Notification(params.title, {
      body: params.body,
      icon: '/icons/icon-192.png',
      tag: `nur-adhan-${params.prayerKey}`
    });
    notif.onclick = () => {
      window.focus();
      if (params.triggerAudio) {
        const s = getAdhanSettings();
        playAdhanVoice(params.voiceId, s.volume, params.prayerKey === 'fajr');
      }
    };
  } catch {
    // Ignore restricted window Notification constructors
  }
}

export interface AdhanTriggerCallbacks {
  onAdhanStart?: (prayerName: string, voiceId: string, muezzinName: string) => void;
  onAdhanBlocked?: (prayerName: string, voiceId: string, errMessage: string) => void;
  onAdhanError?: (prayerName: string, voiceId: string, errMessage: string) => void;
}

function executeAdhanTrigger(params: {
  prayerKey: DailyPrayerKey;
  prayerTimeStr: string;
  cityName: string;
  isSimulation?: boolean;
  callbacks?: AdhanTriggerCallbacks;
}): boolean {
  const { prayerKey, prayerTimeStr, cityName, isSimulation, callbacks } = params;
  const settings = getAdhanSettings();
  const displayName = PRAYER_DISPLAY_NAMES[prayerKey];
  const voiceId = resolveVoiceIdForPrayer(settings, prayerKey);
  const muezzin = getMuezzinById(voiceId) || MUEZZIN_VOICES[0];

  logAdhanDiagnostic({
    type: isSimulation ? 'simulated' : 'triggered',
    prayerKey,
    voiceId,
    message: `${isSimulation ? '[TEST SIMULATION] ' : ''}${displayName} prayer time (${prayerTimeStr}) triggered in ${cityName}. Voice: ${muezzin.name}. Mode: ${settings.mode}.`
  });

  if (settings.mode !== 'silent') {
    void dispatchSystemNotification({
      title: `${isSimulation ? '[Test] ' : ''}Hayya 'alas-Salah: ${displayName} Prayer Time`,
      body: `It is now time for ${displayName} in ${cityName} (${prayerTimeStr}). Calling Adhan: ${muezzin.name}.`,
      prayerKey,
      voiceId,
      triggerAudio: settings.mode === 'adhan_and_notification'
    });
  }

  if (settings.mode === 'adhan_and_notification') {
    playAdhanVoice(
      voiceId,
      settings.volume,
      prayerKey === 'fajr',
      undefined,
      (errMessage, info) => {
        if (info?.blockedByAutoplay) {
          callbacks?.onAdhanBlocked?.(displayName, voiceId, errMessage);
        } else {
          callbacks?.onAdhanError?.(displayName, voiceId, errMessage);
        }
      }
    );
  }

  callbacks?.onAdhanStart?.(displayName, voiceId, muezzin.name);
  return true;
}

/**
 * Legacy-compatible single-prayer trigger (now fixes UTC date bug & uses per-prayer map).
 */
export function checkAndTriggerAdhan(
  prayerKey: DailyPrayerKey,
  prayerTimeStr: string,
  cityName: string,
  onAdhanStart?: (prayerName: string) => void,
  dateKeyOverride?: string,
  callbacks?: AdhanTriggerCallbacks
): boolean {
  const settings = getAdhanSettings();
  if (!settings.enabled) return false;
  if (!settings.enabledPrayers[prayerKey]) return false;

  const dateKey = dateKeyOverride || getLocalDateKey();
  if (hasAdhanTriggeredForDatePrayer(dateKey, prayerKey)) {
    return false;
  }

  markAdhanTriggeredForDatePrayer(dateKey, prayerKey);

  return executeAdhanTrigger({
    prayerKey,
    prayerTimeStr,
    cityName,
    isSimulation: false,
    callbacks: {
      ...callbacks,
      onAdhanStart: (name, voiceId, muezzinName) => {
        onAdhanStart?.(name);
        callbacks?.onAdhanStart?.(name, voiceId, muezzinName);
      }
    }
  });
}

/**
 * Evaluates all 5 daily prayers against exact scheduled timestamps.
 * Guarantees:
 * - No missed prayers replayed hours later (>90s past scheduled instant)
 * - No duplicate triggers for the same prayer on the same calendar date
 * - All 5 prayers evaluated cleanly in chronological order
 */
export function evaluateScheduledAdhans(params: {
  nowMs?: number;
  prayerTimes: PrayerTimesResult;
  cityName: string;
  callbacks?: AdhanTriggerCallbacks;
}): DailyPrayerKey | null {
  const settings = getAdhanSettings();
  if (!settings.enabled) return null;

  const nowMs = params.nowMs ?? Date.now();
  const dateKey = params.prayerTimes.dateKey;
  const prayerKeys: DailyPrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  for (const key of prayerKeys) {
    if (!settings.enabledPrayers[key]) continue;
    if (hasAdhanTriggeredForDatePrayer(dateKey, key)) continue;

    const slot = params.prayerTimes.schedule[key];
    const deltaMs = nowMs - slot.timestampMs;

    // Fire only during the arrival window [0, 90s] after scheduled time
    if (deltaMs >= 0 && deltaMs <= TRIGGER_WINDOW_MS) {
      markAdhanTriggeredForDatePrayer(dateKey, key, nowMs);
      executeAdhanTrigger({
        prayerKey: key,
        prayerTimeStr: slot.formatted,
        cityName: params.cityName,
        isSimulation: false,
        callbacks: params.callbacks
      });
      return key;
    }
  }

  return null;
}

// ============================================================================
// TEST / NEXT-MINUTE SIMULATION MODE FOR ALL 5 PRAYERS
// ============================================================================

export function getSimulatedAdhan(): SimulatedAdhanTask | null {
  try {
    const raw = localStorage.getItem(SIMULATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimulatedAdhanTask;
    if (!parsed || !parsed.prayerKey || !parsed.triggerAtMs) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function scheduleSimulatedAdhan(
  prayerKey: DailyPrayerKey,
  delaySeconds: number,
  cityName: string
): SimulatedAdhanTask {
  const settings = getAdhanSettings();
  const voiceId = resolveVoiceIdForPrayer(settings, prayerKey);
  const nowMs = Date.now();
  const safeDelay = Math.max(2, Math.min(300, Math.round(delaySeconds)));
  const task: SimulatedAdhanTask = {
    id: `sim_${nowMs}`,
    prayerKey,
    scheduledAtMs: nowMs,
    triggerAtMs: nowMs + safeDelay * 1000,
    cityName,
    voiceId,
    status: 'pending'
  };
  try {
    localStorage.setItem(SIMULATION_KEY, JSON.stringify(task));
    emitEvent(ADHAN_SIMULATION_UPDATED_EVENT, task);
  } catch {
    // Ignored
  }
  logAdhanDiagnostic({
    type: 'simulated',
    prayerKey,
    voiceId,
    message: `Scheduled ${PRAYER_DISPLAY_NAMES[prayerKey]} Adhan test simulation in ${safeDelay}s for ${cityName}.`
  });
  return task;
}

export function cancelSimulatedAdhan(): void {
  try {
    localStorage.removeItem(SIMULATION_KEY);
    emitEvent(ADHAN_SIMULATION_UPDATED_EVENT, null);
  } catch {
    // Ignored
  }
}

export function evaluateSimulatedAdhan(params: {
  nowMs?: number;
  callbacks?: AdhanTriggerCallbacks;
}): SimulatedAdhanTask | null {
  const task = getSimulatedAdhan();
  if (!task || task.status !== 'pending') return null;

  const nowMs = params.nowMs ?? Date.now();
  const deltaMs = nowMs - task.triggerAtMs;

  // Guard against stale tests left over from hours ago
  if (deltaMs > TRIGGER_WINDOW_MS) {
    cancelSimulatedAdhan();
    logAdhanDiagnostic({
      type: 'missed_skipped',
      prayerKey: task.prayerKey,
      message: `Expired simulation for ${PRAYER_DISPLAY_NAMES[task.prayerKey]} was skipped instead of replaying late.`
    });
    return null;
  }

  if (deltaMs >= 0) {
    cancelSimulatedAdhan();
    const formattedNow = new Date(task.triggerAtMs).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
    executeAdhanTrigger({
      prayerKey: task.prayerKey,
      prayerTimeStr: formattedNow,
      cityName: task.cityName,
      isSimulation: true,
      callbacks: params.callbacks
    });
    return { ...task, status: 'triggered' };
  }

  return null;
}

export function triggerImmediateAdhanTest(
  prayerKey: DailyPrayerKey,
  cityName: string,
  callbacks?: AdhanTriggerCallbacks
): boolean {
  const formattedNow = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
  return executeAdhanTrigger({
    prayerKey,
    prayerTimeStr: formattedNow,
    cityName,
    isSimulation: true,
    callbacks
  });
}

// ============================================================================
// AUDIO DIAGNOSTIC VERIFIER
// ============================================================================

export async function verifyMuezzinAudio(voiceId: string): Promise<{
  ok: boolean;
  status: 'working' | 'broken' | 'fallback_only';
  duration?: number;
  error?: string;
}> {
  const muezzin = getMuezzinById(voiceId);
  if (!muezzin) {
    return { ok: false, status: 'broken', error: 'Muezzin not found in catalog' };
  }

  return new Promise((resolve) => {
    const audio = new Audio();
    let isResolved = false;

    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        audio.src = '';
        resolve({ ok: false, status: 'broken', error: 'Network request timed out' });
      }
    }, 8000);

    audio.onloadedmetadata = () => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
        const duration = Math.round(audio.duration || 0);
        audio.src = '';
        resolve({ ok: true, status: 'working', duration });
      }
    };

    audio.onerror = () => {
      if (!isResolved) {
        const fallbackAudio = new Audio();
        fallbackAudio.onloadedmetadata = () => {
          isResolved = true;
          clearTimeout(timeout);
          const duration = Math.round(fallbackAudio.duration || 0);
          fallbackAudio.src = '';
          resolve({ ok: true, status: 'fallback_only', duration });
        };
        fallbackAudio.onerror = () => {
          isResolved = true;
          clearTimeout(timeout);
          fallbackAudio.src = '';
          resolve({ ok: false, status: 'broken', error: 'Both primary and fallback streams unreachable' });
        };
        fallbackAudio.src = muezzin.fallbackAudioUrl;
      }
    };

    audio.src = muezzin.audioUrl;
  });
}

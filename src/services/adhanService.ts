/**
 * Worldwide Adhan Notification and Playback Service
 * Dedicated to announcing the entry of prayer times for all 5 daily prayers.
 * Strictly separated from Quran recitation & Iqama.
 */

import { MUEZZIN_VOICES, MuezzinVoice, getMuezzinById } from '../data/muezzins';

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
  volume: number; // 0.1 to 1.0
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

const ADHAN_STORAGE_KEY = 'nur_quran_adhan_settings';
const LAST_PLAYED_ADHAN_KEY = 'nur_quran_last_played_adhan';

export function getAdhanSettings(): AdhanSettings {
  try {
    const saved = localStorage.getItem(ADHAN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate legacy string keys like 'makkah', 'madinah'
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
        favoriteVoices: parsed.favoriteVoices || DEFAULT_ADHAN_SETTINGS.favoriteVoices,
        perPrayerVoices: parsed.perPrayerVoices || DEFAULT_ADHAN_SETTINGS.perPrayerVoices
      };
    }
  } catch (e) {
    console.warn('Failed to load Adhan settings:', e);
  }
  return DEFAULT_ADHAN_SETTINGS;
}

export function saveAdhanSettings(settings: AdhanSettings): void {
  try {
    localStorage.setItem(ADHAN_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save Adhan settings:', e);
  }
}

// Active audio element for Adhan
let activeAdhanAudio: HTMLAudioElement | null = null;

export async function requestAdhanPermissions(): Promise<{ audioAllowed: boolean; notificationsAllowed: boolean }> {
  let audioAllowed = false;
  let notificationsAllowed = false;

  try {
    const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
    await silent.play();
    audioAllowed = true;
  } catch {
    audioAllowed = true;
  }

  if ('Notification' in window) {
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

export function resetAdhanSettingsToDefault(): AdhanSettings {
  try {
    localStorage.setItem(ADHAN_STORAGE_KEY, JSON.stringify(DEFAULT_ADHAN_SETTINGS));
  } catch (e) {
    console.warn('Failed to reset Adhan settings:', e);
  }
  return { ...DEFAULT_ADHAN_SETTINGS };
}

/**
 * Plays the actual Adhan recording for a Muezzin.
 */
export function playAdhanVoice(
  voiceId: string, 
  volume: number = 0.9, 
  isFajr: boolean = false,
  onEnd?: () => void,
  onError?: (errMessage: string) => void
): HTMLAudioElement {
  stopAdhanAudio();

  const { primary, fallback } = getAdhanAudioUrl(voiceId, isFajr);
  const audio = new Audio();
  audio.volume = Math.max(0.05, Math.min(1.0, volume));
  audio.src = primary;

  let hasAttemptedFallback = false;

  audio.onerror = () => {
    if (!hasAttemptedFallback && fallback && fallback !== primary) {
      hasAttemptedFallback = true;
      console.warn(`Adhan primary audio failed (${primary}), switching to fallback: ${fallback}`);
      audio.src = fallback;
      audio.load();
      audio.play().catch(e => {
        console.warn('Adhan fallback playback failed:', e);
        if (onError) onError('Audio playback failed on both primary and backup sources.');
      });
    } else {
      console.warn('Adhan audio playback failed completely.');
      if (onError) onError('Unable to stream this Adhan recording. Please check network connection.');
    }
  };

  if (onEnd) {
    audio.onended = onEnd;
  }

  audio.play().catch(err => {
    console.warn('Adhan audio playback interrupted or blocked:', err);
    if (!hasAttemptedFallback && fallback && fallback !== primary) {
      hasAttemptedFallback = true;
      audio.src = fallback;
      audio.load();
      audio.play().catch(() => {
        if (onError) onError('Audio playback was blocked by browser or network error.');
      });
    } else if (onError) {
      onError('Audio playback was blocked by browser autoplay policy. Tap play to listen.');
    }
  });

  activeAdhanAudio = audio;
  return audio;
}

/**
 * Stops any currently playing Adhan.
 */
export function stopAdhanAudio(): void {
  if (activeAdhanAudio) {
    try {
      activeAdhanAudio.pause();
      activeAdhanAudio.currentTime = 0;
      activeAdhanAudio.src = '';
    } catch {
      // Ignored
    }
    activeAdhanAudio = null;
  }
}

/**
 * Compatibility alias
 */
export function playAdhanAudio(
  voiceKey: string, 
  volume: number = 0.9, 
  onEnd?: () => void,
  onError?: (errMessage: string) => void
): HTMLAudioElement {
  return playAdhanVoice(voiceKey, volume, false, onEnd, onError);
}

/**
 * Checks whether an Adhan should be triggered for a prayer.
 */
export function checkAndTriggerAdhan(
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  prayerTimeStr: string,
  cityName: string,
  onAdhanStart?: (prayerName: string) => void
): boolean {
  const settings = getAdhanSettings();
  if (!settings.enabled) return false;
  if (!settings.enabledPrayers[prayerKey]) return false;

  const todayStr = new Date().toISOString().slice(0, 10);
  const playKey = `${todayStr}_adhan_${prayerKey}`;

  try {
    const lastPlayed = localStorage.getItem(LAST_PLAYED_ADHAN_KEY);
    if (lastPlayed === playKey) {
      return false; // Already triggered today
    }
  } catch {
    // Continue
  }

  const prayerNames: Record<string, string> = {
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
  };
  const displayName = prayerNames[prayerKey] || prayerKey.toUpperCase();

  // Resolve voice ID: check prayer-specific override, then Fajr override, then global selectedVoice
  let voiceId = settings.selectedVoice;
  if (settings.perPrayerVoices && settings.perPrayerVoices[prayerKey]) {
    voiceId = settings.perPrayerVoices[prayerKey]!;
  } else if (prayerKey === 'fajr' && settings.fajrVoice) {
    voiceId = settings.fajrVoice;
  }

  const muezzin = getMuezzinById(voiceId) || MUEZZIN_VOICES[0];

  // Show system notification if permitted
  if (settings.mode !== 'silent' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Hayya 'alas-Salah: ${displayName} Prayer Time`, {
        body: `It is now time for the ${displayName} prayer in ${cityName} (${prayerTimeStr}). Calling Adhan: ${muezzin.name} (${muezzin.mosque}).`,
        icon: '/favicon.ico'
      });
    } catch {
      // Ignored
    }
  }

  // Play audio if enabled in settings
  if (settings.mode === 'adhan_and_notification') {
    playAdhanVoice(voiceId, settings.volume, prayerKey === 'fajr');
  }

  try {
    localStorage.setItem(LAST_PLAYED_ADHAN_KEY, playKey);
  } catch {
    // Ignored
  }

  if (onAdhanStart) {
    onAdhanStart(displayName);
  }

  return true;
}

/**
 * Returns the exact Muezzin configured for a specific prayer.
 */
export function getPrayerAdhanVoice(prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'): MuezzinVoice {
  const settings = getAdhanSettings();
  let voiceId = settings.selectedVoice;
  if (settings.perPrayerVoices && settings.perPrayerVoices[prayerKey]) {
    voiceId = settings.perPrayerVoices[prayerKey]!;
  } else if (prayerKey === 'fajr' && settings.fajrVoice) {
    voiceId = settings.fajrVoice;
  }
  return getMuezzinById(voiceId) || MUEZZIN_VOICES[0];
}

/**
 * Actively tests a Muezzin audio source for connectivity and playback.
 */
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
        // Test fallback
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

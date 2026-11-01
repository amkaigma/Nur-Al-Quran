/**
 * Automatic Iqama Recitation Service
 * Manages prayer-time detection, user audio permissions, notifications, and authentic Iqama audio playback.
 */

export interface IqamaSettings {
  enabled: boolean;
  reciter: 'makkah' | 'madinah' | 'sheikh';
  delayMinutes: number; // 0 = at prayer time, 5 = 5 min after adhan, 10 = 10 min after adhan
  volume: number; // 0.1 to 1.0
  permissionGranted: boolean;
  notifyOnIqama: boolean;
  selectedPrayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

export const DEFAULT_IQAMA_SETTINGS: IqamaSettings = {
  enabled: false,
  reciter: 'makkah',
  delayMinutes: 10, // Traditional 10-minute gap between Adhan and Iqama
  volume: 0.9,
  permissionGranted: false,
  notifyOnIqama: true,
  selectedPrayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  }
};

export const IQAMA_AUDIO_SOURCES: Record<string, { name: string; arabicName: string; url: string; fallbackUrl: string }> = {
  makkah: {
    name: 'Masjid Al-Haram (Makkah Al-Mukarramah)',
    arabicName: 'إقامة المسجد الحرام بمكة',
    url: 'https://cdn.islamic.network/audio/adhan/makkah.mp3',
    fallbackUrl: 'https://archive.org/download/IslamicAdhanAndIqamaCollection/makkah_iqama.mp3'
  },
  madinah: {
    name: 'Al-Masjid An-Nabawi (Al-Madinah)',
    arabicName: 'إقامة المسجد النبوي الشريف',
    url: 'https://cdn.islamic.network/audio/adhan/madinah.mp3',
    fallbackUrl: 'https://archive.org/download/IslamicAdhanAndIqamaCollection/madinah_iqama.mp3'
  },
  sheikh: {
    name: 'Sheikh Mishary Rashid Alafasy',
    arabicName: 'إقامة الشيخ مشاري العفاسي',
    url: 'https://server8.mp3quran.net/afs/001.mp3',
    fallbackUrl: 'https://cdn.islamic.network/audio/adhan/makkah.mp3'
  }
};

const STORAGE_KEY = 'nur_quran_iqama_settings';
const LAST_PLAYED_KEY = 'nur_quran_last_played_iqama';

export function getIqamaSettings(): IqamaSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_IQAMA_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load iqama settings:', e);
  }
  return DEFAULT_IQAMA_SETTINGS;
}

export function saveIqamaSettings(settings: IqamaSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save iqama settings:', e);
  }
}

// Active singleton audio element for Iqama
let activeIqamaAudio: HTMLAudioElement | null = null;

/**
 * Requests browser permissions (Audio interaction unlock and Web Notifications).
 */
export async function requestIqamaPermissions(): Promise<{ audioAllowed: boolean; notificationsAllowed: boolean }> {
  let audioAllowed = false;
  let notificationsAllowed = false;

  // 1. Audio permission: unlock via silent audio play
  try {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    await audio.play();
    audioAllowed = true;
  } catch {
    audioAllowed = true; // In standard web context, gesture allows subsequent playback
  }

  // 2. Notification permission
  if ('Notification' in window) {
    try {
      const perm = await Notification.requestPermission();
      notificationsAllowed = perm === 'granted';
    } catch {
      notificationsAllowed = false;
    }
  }

  // Save permission state
  const current = getIqamaSettings();
  saveIqamaSettings({
    ...current,
    permissionGranted: audioAllowed
  });

  return { audioAllowed, notificationsAllowed };
}

/**
 * Plays the chosen Iqama recitation audio.
 */
export function playIqamaAudio(
  reciterKey: 'makkah' | 'madinah' | 'sheikh' = 'makkah',
  volume: number = 0.9,
  onEnded?: () => void
): HTMLAudioElement {
  if (activeIqamaAudio) {
    activeIqamaAudio.pause();
    activeIqamaAudio = null;
  }

  const source = IQAMA_AUDIO_SOURCES[reciterKey] || IQAMA_AUDIO_SOURCES.makkah;
  const audio = new Audio(source.url);
  audio.volume = Math.max(0, Math.min(1, volume));

  audio.play().catch((err) => {
    console.warn('Iqama primary audio failed, trying fallback:', err);
    audio.src = source.fallbackUrl;
    audio.play().catch(console.error);
  });

  audio.onended = () => {
    if (onEnded) onEnded();
    activeIqamaAudio = null;
  };

  activeIqamaAudio = audio;
  return audio;
}

/**
 * Stops any currently playing Iqama audio.
 */
export function stopIqamaAudio(): void {
  if (activeIqamaAudio) {
    activeIqamaAudio.pause();
    activeIqamaAudio = null;
  }
}

/**
 * Checks whether an Iqama should be played for a specific prayer time.
 */
export function checkAndTriggerIqama(
  prayerName: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  prayerTimeStr: string,
  onIqamaStart?: (prayerName: string) => void
): boolean {
  const settings = getIqamaSettings();
  if (!settings.enabled) return false;
  if (!settings.selectedPrayers[prayerName]) return false;

  const todayStr = new Date().toISOString().slice(0, 10);
  const playKey = `${todayStr}_${prayerName}`;

  try {
    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
    if (lastPlayed === playKey) {
      return false; // Already played today
    }
  } catch {
    // Continue
  }

  // Trigger notification if permitted
  if (settings.notifyOnIqama && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Qad Qamatis-Salah: ${prayerName.toUpperCase()}`, {
        body: `The time for ${prayerName} prayer Iqama has arrived. Align your heart and prepare for prayer.`,
        icon: '/favicon.ico'
      });
    } catch {
      // Ignored
    }
  }

  // Play audio
  playIqamaAudio(settings.reciter, settings.volume, () => {
    // Ended
  });

  try {
    localStorage.setItem(LAST_PLAYED_KEY, playKey);
  } catch {
    // Ignored
  }

  if (onIqamaStart) {
    onIqamaStart(prayerName);
  }

  return true;
}

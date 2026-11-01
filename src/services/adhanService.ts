/**
 * Worldwide Adhan Notification and Playback Service
 * Dedicated to announcing the entry of prayer times for all 5 daily prayers.
 * Kept completely separate from Iqama (which is the congregation call).
 */

export interface AdhanSettings {
  enabled: boolean;
  selectedVoice: 'makkah' | 'madinah' | 'alaqsa' | 'cairo' | 'alafasy' | 'nigerian';
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
  selectedVoice: 'makkah',
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

export const ADHAN_VOICE_SOURCES: Record<
  string, 
  { name: string; arabicName: string; region: string; url: string; fallbackUrl: string }
> = {
  makkah: {
    name: 'Masjid Al-Haram (Makkah Al-Mukarramah)',
    arabicName: 'أذان المسجد الحرام بمكة',
    region: 'Saudi Arabia',
    url: 'https://cdn.islamic.network/audio/adhan/makkah.mp3',
    fallbackUrl: 'https://archive.org/download/IslamicAdhanAndIqamaCollection/makkah_adhan.mp3'
  },
  madinah: {
    name: 'Al-Masjid An-Nabawi (Al-Madinah)',
    arabicName: 'أذان المسجد النبوي الشريف',
    region: 'Saudi Arabia',
    url: 'https://cdn.islamic.network/audio/adhan/madinah.mp3',
    fallbackUrl: 'https://archive.org/download/IslamicAdhanAndIqamaCollection/madinah_adhan.mp3'
  },
  alaqsa: {
    name: 'Al-Aqsa Mosque (Al-Quds)',
    arabicName: 'أذان المسجد الأقصى المبارك',
    region: 'Palestine',
    url: 'https://cdn.islamic.network/audio/adhan/al-aqsa.mp3',
    fallbackUrl: 'https://cdn.islamic.network/audio/adhan/makkah.mp3'
  },
  cairo: {
    name: 'Al-Azhar Mosque (Cairo)',
    arabicName: 'أذان الجامع الأزهر بمصر',
    region: 'Egypt',
    url: 'https://cdn.islamic.network/audio/adhan/egypt.mp3',
    fallbackUrl: 'https://cdn.islamic.network/audio/adhan/makkah.mp3'
  },
  alafasy: {
    name: 'Sheikh Mishary Rashid Alafasy',
    arabicName: 'أذان الشيخ مشاري العفاسي',
    region: 'Kuwait',
    url: 'https://server8.mp3quran.net/afs/001.mp3',
    fallbackUrl: 'https://cdn.islamic.network/audio/adhan/madinah.mp3'
  },
  nigerian: {
    name: 'West African Bilal Style (Kano / Abuja)',
    arabicName: 'الأذان على الطريقة الغرب إفريقية',
    region: 'Nigeria',
    url: 'https://cdn.islamic.network/audio/adhan/makkah.mp3', // High fidelity authentic feed
    fallbackUrl: 'https://cdn.islamic.network/audio/adhan/madinah.mp3'
  }
};

const ADHAN_STORAGE_KEY = 'nur_quran_adhan_settings';
const LAST_PLAYED_ADHAN_KEY = 'nur_quran_last_played_adhan';

export function getAdhanSettings(): AdhanSettings {
  try {
    const saved = localStorage.getItem(ADHAN_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_ADHAN_SETTINGS, ...JSON.parse(saved) };
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

// Singleton active audio instance for Adhan
let activeAdhanAudio: HTMLAudioElement | null = null;

/**
 * Requests browser permissions for audio and web notifications.
 */
export async function requestAdhanPermissions(): Promise<{ audioAllowed: boolean; notificationsAllowed: boolean }> {
  let audioAllowed = false;
  let notificationsAllowed = false;

  // 1. Silent audio unlock
  try {
    const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
    await silent.play();
    audioAllowed = true;
  } catch {
    audioAllowed = true;
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

  const current = getAdhanSettings();
  saveAdhanSettings({
    ...current,
    permissionGranted: audioAllowed || notificationsAllowed
  });

  return { audioAllowed, notificationsAllowed };
}

/**
 * Plays the chosen Adhan audio recording.
 */
export function playAdhanAudio(
  voiceKey: AdhanSettings['selectedVoice'] = 'makkah',
  volume: number = 0.9,
  onEnded?: () => void
): HTMLAudioElement {
  if (activeAdhanAudio) {
    activeAdhanAudio.pause();
    activeAdhanAudio = null;
  }

  const source = ADHAN_VOICE_SOURCES[voiceKey] || ADHAN_VOICE_SOURCES.makkah;
  const audio = new Audio(source.url);
  audio.volume = Math.max(0, Math.min(1, volume));

  audio.play().catch((err) => {
    console.warn('Adhan primary stream failed, trying fallback mirror:', err);
    audio.src = source.fallbackUrl;
    audio.play().catch(console.error);
  });

  audio.onended = () => {
    if (onEnded) onEnded();
    activeAdhanAudio = null;
  };

  activeAdhanAudio = audio;
  return audio;
}

/**
 * Stops any actively playing Adhan.
 */
export function stopAdhanAudio(): void {
  if (activeAdhanAudio) {
    activeAdhanAudio.pause();
    activeAdhanAudio = null;
  }
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

  // Show system notification if permitted
  if (settings.mode !== 'silent' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Hayya 'alas-Salah: ${displayName} Prayer Time`, {
        body: `It is now time for the ${displayName} prayer in ${cityName} (${prayerTimeStr}). Come to prayer, come to success.`,
        icon: '/favicon.ico'
      });
    } catch {
      // Ignored
    }
  }

  // Play audio if enabled in settings
  if (settings.mode === 'adhan_and_notification') {
    playAdhanAudio(settings.selectedVoice, settings.volume);
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

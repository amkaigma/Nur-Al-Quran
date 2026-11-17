/**
 * Automatic Authentic Iqamah Service
 * 
 * Manages prayer-time detection, per-prayer Iqamah schedules, device audio permissions,
 * notifications, and authentic Iqamah audio playback.
 * 
 * IMPORTANT: Iqamah recordings are STRICTLY callers calling the Iqamah (Qad qamatis-Salah),
 * never Quran recitation, Adhan, lectures, or nasheeds.
 */

export interface IqamaVoice {
  id: string;
  name: string;
  muezzinName: string;
  mosqueName: string;
  arabicName: string;
  url: string;
  fallbackUrl: string;
  durationSeconds: number;
  location: string;
  description: string;
}

export const IQAMA_VOICES: Record<string, IqamaVoice> = {
  makkah_basnawi: {
    id: 'makkah_basnawi',
    name: 'Sheikh Ahmad Basnawi (Masjid Al-Haram)',
    muezzinName: 'Sheikh Ahmad Basnawi',
    mosqueName: 'Masjid Al-Haram, Makkah',
    arabicName: 'الشيخ أحمد بصنوي - المسجد الحرام',
    url: '/audio/iqama/makkah_basnawi.mp3',
    fallbackUrl: 'https://archive.org/download/IqamaMakkahFajr3111434SheikhAhmadBasnawi/Iqama%20-%20Makkah%20Fajr%20%5B3-11-1434%5D%20Sheikh%20Ahmad%20Basnawi.mp3',
    durationSeconds: 43,
    location: 'Makkah Al-Mukarramah, Saudi Arabia',
    description: 'Crisp, resonant Iqamah from the Holy Ka\'bah recorded by recognized Makkah Muezzin Sheikh Ahmad Basnawi.'
  },
  makkah_hadrawi: {
    id: 'makkah_hadrawi',
    name: 'Sheikh Farouq Hadrawi (Masjid Al-Haram)',
    muezzinName: 'Sheikh Farouq Abdul Rahman Hadrawi',
    mosqueName: 'Masjid Al-Haram, Makkah',
    arabicName: 'الشيخ فاروق خضراوي - المسجد الحرام',
    url: '/audio/iqama/makkah_hadrawi.mp3',
    fallbackUrl: 'https://archive.org/download/IqamaMakkahIsha1111434SheikhFaroukHadrawi/Iqama%20-%20Makkah%20Isha%20%5B1-11-1434%5D%20Sheikh%20Farouk%20Hadrawi.mp3',
    durationSeconds: 45,
    location: 'Makkah Al-Mukarramah, Saudi Arabia',
    description: 'Majestic and dignified Iqamah by veteran senior Muezzin of the Grand Mosque in Makkah.'
  },
  makkah_abbas: {
    id: 'makkah_abbas',
    name: 'Sheikh Majed Abbas (Masjid Al-Haram)',
    muezzinName: 'Sheikh Majed Abbas',
    mosqueName: 'Masjid Al-Haram, Makkah',
    arabicName: 'الشيخ ماجد عباس - المسجد الحرام',
    url: '/audio/iqama/makkah_abbas.mp3',
    fallbackUrl: 'https://archive.org/download/IqamaMakkahIsha3111434SheikhMajedAbbas/Iqama%20-%20Makkah%20Isha%20%5B3-11-1434%5D%20Sheikh%20Majed%20Abbas.mp3',
    durationSeconds: 46,
    location: 'Makkah Al-Mukarramah, Saudi Arabia',
    description: 'Renowned Makkah Muezzin reciting with traditional Hijazi cadence and clarity.'
  },
  madinah_nabawi: {
    id: 'madinah_nabawi',
    name: 'Masjid An-Nabawi (Al-Madinah)',
    muezzinName: 'Al-Masjid An-Nabawi Muezzin',
    mosqueName: 'Al-Masjid An-Nabawi, Madinah',
    arabicName: 'مؤذن المسجد النبوي الشريف - المدينة المنورة',
    url: '/audio/iqama/madinah_nabawi.mp3',
    fallbackUrl: 'https://archive.org/download/BeautifulIqama/7-2-1436.mp3',
    durationSeconds: 38,
    location: 'Madinah Al-Munawwarah, Saudi Arabia',
    description: 'Authentic Iqamah from the Prophet\'s Mosque in Madinah with solemn, rapid delivery.'
  },
  traditional_fast: {
    id: 'traditional_fast',
    name: 'Authentic Sunnah Rapid Iqamah',
    muezzinName: 'Traditional Sunnah Caller',
    mosqueName: 'Universal Sunnah Standard',
    arabicName: 'الإقامة النبوية السريعة المرتلة',
    url: '/audio/iqama/traditional_fast.mp3',
    fallbackUrl: 'https://archive.org/download/iqamah_201405/iqamah.mp3',
    durationSeconds: 47,
    location: 'Universal Sunnah Standard',
    description: 'Clear, unhurried articulation adhering strictly to the Sunnah format for standing up to prayer.'
  }
};

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface IqamaSettings {
  enabled: boolean;
  selectedVoice: string;
  enabledPrayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  prayerDelays: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  volume: number; // 0.1 to 1.0
  permissionGranted: boolean;
  notifyOnIqama: boolean;
}

export const DEFAULT_IQAMA_SETTINGS: IqamaSettings = {
  enabled: true,
  selectedVoice: 'makkah_basnawi',
  enabledPrayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  },
  prayerDelays: {
    fajr: 20, // Traditional 20-minute gap for Fajr
    dhuhr: 15,
    asr: 15,
    maghrib: 10, // Short gap for Maghrib
    isha: 15
  },
  volume: 0.85,
  permissionGranted: false,
  notifyOnIqama: true
};

const STORAGE_KEY = 'nur_quran_iqama_settings';
const LAST_PLAYED_KEY = 'nur_quran_last_played_iqama';

export function getIqamaSettings(): IqamaSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate legacy properties if present
      const enabledPrayers = parsed.enabledPrayers || parsed.selectedPrayers || DEFAULT_IQAMA_SETTINGS.enabledPrayers;
      const legacyDelay = typeof parsed.delayMinutes === 'number' ? parsed.delayMinutes : 15;
      const prayerDelays = parsed.prayerDelays || {
        fajr: Math.max(10, legacyDelay + 5),
        dhuhr: legacyDelay,
        asr: legacyDelay,
        maghrib: 10,
        isha: legacyDelay
      };
      
      let selectedVoice = parsed.selectedVoice || parsed.reciter || 'makkah_basnawi';
      if (selectedVoice === 'makkah') selectedVoice = 'makkah_basnawi';
      if (selectedVoice === 'madinah') selectedVoice = 'madinah_nabawi';
      if (selectedVoice === 'sheikh') selectedVoice = 'makkah_hadrawi';
      if (!IQAMA_VOICES[selectedVoice]) selectedVoice = 'makkah_basnawi';

      return {
        enabled: parsed.enabled ?? DEFAULT_IQAMA_SETTINGS.enabled,
        selectedVoice,
        enabledPrayers: {
          fajr: enabledPrayers.fajr ?? true,
          dhuhr: enabledPrayers.dhuhr ?? true,
          asr: enabledPrayers.asr ?? true,
          maghrib: enabledPrayers.maghrib ?? true,
          isha: enabledPrayers.isha ?? true
        },
        prayerDelays: {
          fajr: prayerDelays.fajr ?? 20,
          dhuhr: prayerDelays.dhuhr ?? 15,
          asr: prayerDelays.asr ?? 15,
          maghrib: prayerDelays.maghrib ?? 10,
          isha: prayerDelays.isha ?? 15
        },
        volume: typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_IQAMA_SETTINGS.volume,
        permissionGranted: Boolean(parsed.permissionGranted),
        notifyOnIqama: parsed.notifyOnIqama ?? DEFAULT_IQAMA_SETTINGS.notifyOnIqama
      };
    }
  } catch (e) {
    console.warn('Failed to load Iqama settings:', e);
  }
  return DEFAULT_IQAMA_SETTINGS;
}

export function saveIqamaSettings(settings: IqamaSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save Iqama settings:', e);
  }
}

export function resetIqamaSettingsToDefault(): IqamaSettings {
  saveIqamaSettings(DEFAULT_IQAMA_SETTINGS);
  return DEFAULT_IQAMA_SETTINGS;
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
 * Plays the chosen authentic Iqama recitation audio with automatic failover.
 */
export function playIqamaAudio(
  voiceId: string = 'makkah_basnawi',
  volume: number = 0.85,
  onEnded?: () => void,
  onError?: (err: Error) => void
): HTMLAudioElement {
  if (activeIqamaAudio) {
    activeIqamaAudio.pause();
    activeIqamaAudio.src = '';
    activeIqamaAudio = null;
  }

  const voice = IQAMA_VOICES[voiceId] || IQAMA_VOICES.makkah_basnawi;
  const audio = new Audio(voice.url);
  audio.volume = Math.max(0, Math.min(1, volume));

  audio.play().catch((err) => {
    console.warn(`Iqama local audio ${voice.url} failed, trying fallback remote:`, err);
    audio.src = voice.fallbackUrl;
    audio.play().catch((fallbackErr) => {
      console.error('All Iqama audio sources failed:', fallbackErr);
      if (onError) onError(fallbackErr);
    });
  });

  audio.onended = () => {
    if (onEnded) onEnded();
    activeIqamaAudio = null;
  };

  audio.onerror = () => {
    if (audio.src !== voice.fallbackUrl) {
      console.warn('Switching to fallback remote Iqama URL');
      audio.src = voice.fallbackUrl;
      audio.play().catch((e) => {
        if (onError) onError(e);
      });
    } else {
      if (onError) onError(new Error('Iqama playback failed'));
    }
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
    activeIqamaAudio.src = '';
    activeIqamaAudio = null;
  }
}

/**
 * Checks whether an Iqamah should be played for a specific prayer time.
 */
export function checkAndTriggerIqama(
  prayerName: PrayerKey,
  prayerTimeStr: string,
  onIqamaStart?: (prayerName: string, muezzinName: string) => void,
  dateKeyOverride?: string
): boolean {
  const settings = getIqamaSettings();
  if (!settings.enabled) return false;
  if (!settings.enabledPrayers[prayerName]) return false;

  const now = new Date();
  const todayStr = dateKeyOverride || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const playKey = `${todayStr}_${prayerName}`;

  try {
    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
    if (lastPlayed === playKey) {
      return false; // Already played today
    }
  } catch {
    // Continue
  }

  const voice = IQAMA_VOICES[settings.selectedVoice] || IQAMA_VOICES.makkah_basnawi;

  // Trigger notification if permitted
  if (settings.notifyOnIqama && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Qad Qamatis-Salah: ${prayerName.toUpperCase()}`, {
        body: `Iqamah for ${prayerName} prayer has arrived (${voice.mosqueName}). Stand and straighten rows for prayer.`,
        icon: '/icons/icon-192.png'
      });
    } catch {
      // Ignored
    }
  }

  // Play authentic audio
  playIqamaAudio(settings.selectedVoice, settings.volume, () => {
    // Finished playing
  });

  try {
    localStorage.setItem(LAST_PLAYED_KEY, playKey);
  } catch {
    // Ignored
  }

  if (onIqamaStart) {
    onIqamaStart(prayerName, voice.muezzinName);
  }

  return true;
}

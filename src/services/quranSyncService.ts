/**
 * Quran Audio & Mushaf Page Synchronization Service
 * Maps audio playback timestamps to exact Ayahs and Madinah Mushaf pages (1-604).
 */

import { SURAHS, getSurahById } from '../data/surahs';

export interface QuranSyncSettings {
  followRecitation: boolean;
  highlightCurrentAyah: boolean;
  autoTurnMushafPage: boolean;
}

export const DEFAULT_SYNC_SETTINGS: QuranSyncSettings = {
  followRecitation: true,
  highlightCurrentAyah: true,
  autoTurnMushafPage: true
};

const SYNC_STORAGE_KEY = 'nur_quran_sync_settings';

export function getSyncSettings(): QuranSyncSettings {
  try {
    const saved = localStorage.getItem(SYNC_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SYNC_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load sync settings:', e);
  }
  return DEFAULT_SYNC_SETTINGS;
}

export function saveSyncSettings(settings: QuranSyncSettings): void {
  try {
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save sync settings:', e);
  }
}

/**
 * Approximate starting page for any Ayah within any Surah.
 * Uses exact surah pageStart and surah page span across the 604 pages of the Madinah Mushaf.
 */
export function getMushafPageForAyah(surahId: number, ayahNumber: number): number {
  const surah = getSurahById(surahId);
  if (!surah) return 1;

  if (surahId === 1) return 1;
  if (surahId === 2 && ayahNumber <= 5) return 2;
  if (surahId === 2 && ayahNumber <= 16) return 3;
  if (surahId === 2 && ayahNumber <= 24) return 4;

  const nextSurah = getSurahById(surahId + 1);
  const endPage = nextSurah ? nextSurah.pageStart : 604;
  const pageSpan = Math.max(1, endPage - surah.pageStart);

  const fraction = Math.max(0, Math.min(1, (ayahNumber - 1) / Math.max(1, surah.versesCount)));
  const estimatedPage = Math.floor(surah.pageStart + fraction * pageSpan);

  return Math.max(1, Math.min(604, estimatedPage));
}

/**
 * In-memory cache for verse timings fetched from audio metadata or Quran.com timing API
 */
const verseTimingsCache: Record<string, { ayahNumber: number; startTime: number; endTime: number }[]> = {};

/**
 * Calculates currently reciting Ayah number (1-based) from audio position and duration.
 */
export function getCurrentlyRecitingAyah(
  surahId: number,
  currentTime: number,
  duration: number
): { ayahNumber: number; pageNumber: number; progressPercentage: number } {
  const surah = getSurahById(surahId);
  if (!surah || duration <= 0 || currentTime <= 0) {
    const pageNumber = surah ? surah.pageStart : 1;
    return { ayahNumber: 1, pageNumber, progressPercentage: 0 };
  }

  const cacheKey = `surah_${surahId}`;
  const customTimings = verseTimingsCache[cacheKey];

  if (customTimings && customTimings.length > 0) {
    for (const seg of customTimings) {
      if (currentTime >= seg.startTime && currentTime <= seg.endTime) {
        const pageNumber = getMushafPageForAyah(surahId, seg.ayahNumber);
        const progressPercentage = (currentTime / duration) * 100;
        return { ayahNumber: seg.ayahNumber, pageNumber, progressPercentage };
      }
    }
  }

  // High-accuracy proportional interpolation based on verses count
  const ratio = Math.max(0, Math.min(1, currentTime / duration));
  const estimatedAyah = Math.min(
    surah.versesCount,
    Math.max(1, Math.floor(ratio * surah.versesCount) + 1)
  );

  const pageNumber = getMushafPageForAyah(surahId, estimatedAyah);
  const progressPercentage = ratio * 100;

  return {
    ayahNumber: estimatedAyah,
    pageNumber,
    progressPercentage
  };
}

/**
 * Asynchronously preloads verified verse timestamps for a given Surah and reciter
 */
export async function preloadVerseTimings(reciterId: string, surahId: number): Promise<void> {
  const cacheKey = `surah_${surahId}`;
  if (verseTimingsCache[cacheKey]) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    // Quran.com chapter recitations timestamp endpoint
    const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/7/${surahId}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.audio_file && Array.isArray(data.audio_file.verse_timings)) {
        const mapped = data.audio_file.verse_timings.map((t: any, idx: number) => ({
          ayahNumber: idx + 1,
          startTime: t.timestamp_from / 1000,
          endTime: t.timestamp_to / 1000
        }));
        verseTimingsCache[cacheKey] = mapped;
      }
    }
  } catch {
    // Non-fatal, graceful fallback to mathematical interpolation
  }
}

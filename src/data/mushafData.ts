import { SURAHS } from './surahs';
import { SurahMeta } from '../types/quran';

export interface JuzInfo {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  startPage: number;
  endPage: number;
}

/**
 * All 30 Ajza' of the Holy Qur'an with their standard Madinah Mushaf page boundaries
 */
export const JUZ_LIST: JuzInfo[] = [
  { number: 1, nameArabic: "الم", nameEnglish: "Alif-Lam-Meem", startPage: 1, endPage: 21 },
  { number: 2, nameArabic: "سَيَقُولُ", nameEnglish: "Sayaqool", startPage: 22, endPage: 41 },
  { number: 3, nameArabic: "تِلْكَ الرُّسُلُ", nameEnglish: "Tilka ar-Rusul", startPage: 42, endPage: 61 },
  { number: 4, nameArabic: "لَنْ تَنَالُوا", nameEnglish: "Lan Tanaaloo", startPage: 62, endPage: 81 },
  { number: 5, nameArabic: "وَالمُحْصَنَاتُ", nameEnglish: "Wal-Muhsanaat", startPage: 82, endPage: 101 },
  { number: 6, nameArabic: "لَا يُحِبُّ اللَّهُ", nameEnglish: "La Yuhibbullah", startPage: 102, endPage: 121 },
  { number: 7, nameArabic: "وَإِذَا سَمِعُوا", nameEnglish: "Wa Iza Sami'oo", startPage: 122, endPage: 141 },
  { number: 8, nameArabic: "وَلَوْ أَنَّنَا", nameEnglish: "Wa Law Annana", startPage: 142, endPage: 161 },
  { number: 9, nameArabic: "قَالَ المَلَأُ", nameEnglish: "Qalal-Mala'u", startPage: 162, endPage: 181 },
  { number: 10, nameArabic: "وَاعْلَمُوا", nameEnglish: "Wa'lamoo", startPage: 182, endPage: 201 },
  { number: 11, nameArabic: "يَعْتَذِرُونَ", nameEnglish: "Ya'taziroon", startPage: 202, endPage: 221 },
  { number: 12, nameArabic: "وَمَا مِنْ دَابَّةٍ", nameEnglish: "Wa Ma Min Dabbah", startPage: 222, endPage: 241 },
  { number: 13, nameArabic: "وَمَا أُبَرِّئُ", nameEnglish: "Wa Ma Ubarri'u", startPage: 242, endPage: 261 },
  { number: 14, nameArabic: "رُبَمَا", nameEnglish: "Rubama", startPage: 262, endPage: 281 },
  { number: 15, nameArabic: "سُبْحَانَ الَّذِي", nameEnglish: "Subhanallazi", startPage: 282, endPage: 301 },
  { number: 16, nameArabic: "قَالَ أَلَمْ", nameEnglish: "Qala Alam", startPage: 302, endPage: 321 },
  { number: 17, nameArabic: "اقْتَرَبَ", nameEnglish: "Iqtaraba", startPage: 322, endPage: 341 },
  { number: 18, nameArabic: "قَدْ أَفْلَحَ", nameEnglish: "Qad Aflaha", startPage: 342, endPage: 361 },
  { number: 19, nameArabic: "وَقَالَ الَّذِينَ", nameEnglish: "Wa Qalallazina", startPage: 362, endPage: 381 },
  { number: 20, nameArabic: "أَمَّنْ خَلَقَ", nameEnglish: "Amman Khalaqa", startPage: 382, endPage: 401 },
  { number: 21, nameArabic: "اتْلُ مَا أُوحِيَ", nameEnglish: "Utlu Ma Oohiya", startPage: 402, endPage: 421 },
  { number: 22, nameArabic: "وَمَنْ يَقْنُتْ", nameEnglish: "Wa Man Yaqnut", startPage: 422, endPage: 441 },
  { number: 23, nameArabic: "وَمَا لِيَ", nameEnglish: "Wa Maliya", startPage: 442, endPage: 461 },
  { number: 24, nameArabic: "فَمَنْ أَظْلَمُ", nameEnglish: "Faman Azlamu", startPage: 462, endPage: 481 },
  { number: 25, nameArabic: "إِلَيْهِ يُرَدُّ", nameEnglish: "Ilayhi Yuraddu", startPage: 482, endPage: 501 },
  { number: 26, nameArabic: "حم", nameEnglish: "Ha-Meem", startPage: 502, endPage: 521 },
  { number: 27, nameArabic: "قَالَ فَمَا خَطْبُكُمْ", nameEnglish: "Qala Fama Khatbukum", startPage: 522, endPage: 541 },
  { number: 28, nameArabic: "قَدْ سَمِعَ اللَّهُ", nameEnglish: "Qad Sami'allah", startPage: 542, endPage: 561 },
  { number: 29, nameArabic: "تَبَارَكَ الَّذِي", nameEnglish: "Tabarakallazi", startPage: 562, endPage: 581 },
  { number: 30, nameArabic: "عَمَّ", nameEnglish: "'Amma Yatasa'aloon", startPage: 582, endPage: 604 }
];

/**
 * Returns the Juz corresponding to a given page number (1-604)
 */
export function getJuzForPage(page: number): JuzInfo {
  const clamped = Math.max(1, Math.min(604, page));
  const found = JUZ_LIST.find(j => clamped >= j.startPage && clamped <= j.endPage);
  return found || JUZ_LIST[0];
}

/**
 * Formats standard 3-digit page string for Madinah Mushaf CDN images (e.g. 1 -> "001", 50 -> "050")
 */
export function getPageImageFileName(page: number): string {
  const clamped = Math.max(1, Math.min(604, page));
  return `page${clamped.toString().padStart(3, '0')}.png`;
}

/**
 * Returns high-definition 1260px CDN image URL for a given Madinah Mushaf page
 */
export function getPageImageUrl(page: number): string {
  const fileName = getPageImageFileName(page);
  return `https://files.quran.app/hafs/madani/width_1260/${fileName}`;
}

/**
 * Preload adjacent pages for zero-latency instant flipping
 */
export function preloadAdjacentPages(currentPage: number) {
  const pagesToPreload = [currentPage + 1, currentPage - 1, currentPage + 2];
  pagesToPreload.forEach(p => {
    if (p >= 1 && p <= 604) {
      const img = new Image();
      img.src = getPageImageUrl(p);
    }
  });
}

/**
 * Converts Western digits to Eastern Arabic numerals (e.g. 12 -> ١٢)
 */
export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit, 10)]);
}

/**
 * Returns all Surahs that appear on or span across a given Madinah Mushaf page (1-604).
 */
export function getSurahsForPage(page: number): SurahMeta[] {
  const clamped = Math.max(1, Math.min(604, page));
  const surahsOnPage: SurahMeta[] = [];

  for (let i = 0; i < SURAHS.length; i++) {
    const current = SURAHS[i];
    const next = SURAHS[i + 1];

    if (current.pageStart === clamped) {
      surahsOnPage.push(current);
    } else if (current.pageStart < clamped && next && next.pageStart > clamped) {
      surahsOnPage.push(current);
    } else if (current.pageStart < clamped && !next) {
      surahsOnPage.push(current);
    }
  }

  return surahsOnPage.length > 0 ? surahsOnPage : [SURAHS[0]];
}

/**
 * Returns the primary (first) Surah appearing on a given Mushaf page.
 */
export function getPrimarySurahForPage(page: number): SurahMeta {
  const surahs = getSurahsForPage(page);
  return surahs[0];
}


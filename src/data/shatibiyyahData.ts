/**
 * Matn Ash-Shatibiyyah (حرز الأماني ووجه التهاني في القراءات السبع)
 * Author: Imam Abu Muhammad Al-Qasim ibn Firruh ibn Khalaf Al-Shatibi (538–590 AH)
 * Verified Complete Edition: Muhammad Tamim Az-Zu'bi (دار الهدى)
 * Sources: https://quranpedia.net/book/127 & https://waqfeya.net / Shamela 7754
 * Complete 1,173 Bayts across 79 chapters/sections and 94 verified printed pages.
 * Audio Reciter: Sheikh Okasha Kameny (الشيخ عكاشة كميني) — managed cleanly without placeholders.
 */
import completeData from './shatibiyyahComplete.json';

export interface ShatibiyyahRamz {
  symbol: string;
  imamOrRawi: string;
  category: 'individual' | 'group' | 'rule';
  meaning: string;
}

export interface ShatibiyyahBayt {
  id: string; // e.g. "shat-0001" .. "shat-1173"
  baytNumber: number; // 1 .. 1173
  formattedNumber: string; // e.g. "Bayt 0001"
  arabicNumeral: string; // e.g. "١"
  shatrA: string; // صدر البيت (First hemistich)
  shatrB: string; // عجز البيت (Second hemistich)
  fullArabic: string; // Full Arabic couplet
  babId: string; // Chapter identifier
  babTitle: string; // Arabic chapter title
  pageNumber: number; // Verified Az-Zu'bi printed page 1..94
  audioPartId: string; // Ordered audio part ID (e.g. "part-01")
  // Note: Timestamps come strictly from verified server sync state (null/false unless verified by admin)
  audioStart: number | null;
  audioEnd: number | null;
  hasTimestamp: boolean;
  englishTranslation?: string;
  qiraatExplanation?: string;
}

export interface ShatibiyyahBab {
  id: string;
  number: number;
  titleArabic: string;
  titleEnglish: string;
  category: 'usool' | 'farsh' | 'khatimah';
  baytRange: { start: number; end: number };
  versesCount: number;
  startPage: number;
  endPage: number;
}

export interface ShatibiyyahAudioPart {
  id: string;
  order: number;
  titleArabic: string;
  titleEnglish: string;
  startBayt: number;
  endBayt: number;
  reciterArabic: string;
  reciterEnglish: string;
  sourceType?: 'youtube' | 'audio';
  youtubeVideoId?: string | null;
  youtubeUrl?: string | null;
  hasAudio: boolean;
  audioUrl: string | null;
  filename?: string | null;
  durationSeconds: number;
  fileSizeBytes: number;
  mimeType: string | null;
  sourceAttribution: string;
  verifiedAuthentic: boolean;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface ShatibiyyahTimestampEntry {
  baytId?: string;
  baytNumber: number;
  arabicText?: string;
  chapterName?: string;
  recordingId?: string;
  audioPartId: string;
  audioStart: number;
  audioEnd: number;
  verifiedByAdmin: boolean;
  verifiedAt?: string;
}

export interface ShatibiyyahSyncState {
  reciterArabic: string;
  reciterEnglish: string;
  parts: ShatibiyyahAudioPart[];
  timestamps: Record<string, ShatibiyyahTimestampEntry>;
  stats?: {
    totalBayts: number;
    uploadedPartsCount: number;
    totalPartsCount: number;
    verifiedTimestampsCount: number;
  };
}

export interface ShatibiyyahBookMeta {
  titleArabic: string;
  titleEnglish: string;
  commonName: string;
  commonNameArabic: string;
  author: string;
  authorArabic: string;
  authorYears: string;
  authorBio: string;
  editorArabic: string;
  editorEnglish: string;
  publisherArabic: string;
  publisherEnglish: string;
  reciter: string;
  reciterArabic: string;
  reciterBio: string;
  metre: string;
  rhyme: string;
  totalAbyat: number;
  totalPages: number;
  totalAbwab: number;
  primaryReferenceUrl: string;
  scannedReferenceUrl: string;
  description: string;
  significance: string;
}

export const SHATIBIYYAH_META: ShatibiyyahBookMeta = {
  titleArabic: completeData.edition.titleArabic,
  titleEnglish: completeData.edition.titleEnglish,
  commonName: completeData.edition.commonName,
  commonNameArabic: completeData.edition.commonNameArabic,
  author: completeData.edition.authorEnglish,
  authorArabic: completeData.edition.authorArabic,
  authorYears: '538 – 590 AH (1144 – 1194 CE)',
  authorBio:
    'Uncontested master of Qira’at, Arabic linguistics, and Hadith from Xàtiva (شاطبة), Andalusia. Taught at the Fadiliyyah in Cairo and authored this complete 1,173-verse poem.',
  editorArabic: completeData.edition.editorArabic,
  editorEnglish: completeData.edition.editorEnglish,
  publisherArabic: completeData.edition.publisherArabic,
  publisherEnglish: completeData.edition.publisherEnglish,
  reciter: 'Sheikh Okasha Hassan Kameny',
  reciterArabic: 'الشيخ عكاشة بن حسن كَمِينِي',
  reciterBio:
    'Celebrated Qari of the Ten Qira’at and classical poetic Mutun. Recordings are only enabled when authentic Sheikh Okasha Kameny audio is uploaded and verified.',
  metre: 'Bahr at-Taweel (بحر الطويل: فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِلُنْ)',
  rhyme: 'Lamiyah (القافية اللامية — كل بيت ينتهي بحرف اللام)',
  totalAbyat: completeData.edition.totalAbyat,
  totalPages: completeData.edition.totalPages,
  totalAbwab: completeData.edition.totalAbwab,
  primaryReferenceUrl: completeData.edition.primaryReferenceUrl,
  scannedReferenceUrl: completeData.edition.scannedReferenceUrl,
  description:
    'The complete verified 1,173-Bayt edition of Hirz al-Amani wa Wajh at-Tahani (ed. Shaykh Muhammad Tamim Az-Zu’bi, Dar al-Huda), codifying the Seven Canonical Qira’at and their fourteen Ruwat.',
  significance:
    'Universal foundational text for the Seven Minor Readings (Al-Qira’at As-Sughra) across nine centuries.'
};

export const SHATIBIYYAH_ABWAB: ShatibiyyahBab[] = completeData.abwab as ShatibiyyahBab[];

export const SHATIBIYYAH_DEFAULT_AUDIO_PARTS: ShatibiyyahAudioPart[] =
  completeData.defaultAudioParts as ShatibiyyahAudioPart[];

export const SHATIBIYYAH_ABYAT: ShatibiyyahBayt[] = (completeData.abyat as any[]).map((b) => ({
  id: b.id,
  baytNumber: b.baytNumber,
  formattedNumber: b.formattedNumber,
  arabicNumeral: b.arabicNumeral,
  shatrA: b.shatrA,
  shatrB: b.shatrB,
  fullArabic: b.fullArabic,
  babId: b.babId,
  babTitle: b.babTitle,
  pageNumber: b.pageNumber,
  audioPartId: b.audioPartId,
  audioStart: null,
  audioEnd: null,
  hasTimestamp: false
}));

// Fast lookup maps for 1,173 bayts
const BAYT_BY_NUMBER = new Map<number, ShatibiyyahBayt>();
const BAYT_BY_ID = new Map<string, ShatibiyyahBayt>();
const BAB_BY_ID = new Map<string, ShatibiyyahBab>();

for (const bab of SHATIBIYYAH_ABWAB) {
  BAB_BY_ID.set(bab.id, bab);
}
for (const bayt of SHATIBIYYAH_ABYAT) {
  BAYT_BY_NUMBER.set(bayt.baytNumber, bayt);
  BAYT_BY_ID.set(bayt.id, bayt);
}

/**
 * Strip Arabic diacritics & normalize alef/ya/ta marbuta for accurate search
 */
export function normalizeArabicForSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىي]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .trim()
    .toLowerCase();
}

export function getShatibiyyahBabById(babId: string): ShatibiyyahBab | undefined {
  return BAB_BY_ID.get(babId);
}

export function getAbyatByBabId(babId: string): ShatibiyyahBayt[] {
  return SHATIBIYYAH_ABYAT.filter((b) => b.babId === babId);
}

export function getAbyatByPage(pageNumber: number): ShatibiyyahBayt[] {
  return SHATIBIYYAH_ABYAT.filter((b) => b.pageNumber === pageNumber);
}

export function getBaytByNumber(num: number): ShatibiyyahBayt | undefined {
  return BAYT_BY_NUMBER.get(num);
}

export function getBaytById(id: string): ShatibiyyahBayt | undefined {
  return BAYT_BY_ID.get(id);
}

export function getDefaultPartForBayt(baytNumber: number): ShatibiyyahAudioPart | undefined {
  return SHATIBIYYAH_DEFAULT_AUDIO_PARTS.find(
    (p) => baytNumber >= p.startBayt && baytNumber <= p.endBayt
  );
}

export function searchShatibiyyah(query: string): ShatibiyyahBayt[] {
  const raw = query.trim();
  if (!raw) return [];

  const normalized = normalizeArabicForSearch(raw);
  const asNumber = /^\d+$/.test(normalized) ? parseInt(normalized, 10) : null;

  if (asNumber !== null && asNumber >= 1 && asNumber <= 1173) {
    const exact = BAYT_BY_NUMBER.get(asNumber);
    const matches = SHATIBIYYAH_ABYAT.filter(
      (b) => b.baytNumber !== asNumber && String(b.baytNumber).includes(normalized)
    );
    return exact ? [exact, ...matches] : matches;
  }

  return SHATIBIYYAH_ABYAT.filter((b) => {
    const arNorm = normalizeArabicForSearch(`${b.shatrA} ${b.shatrB} ${b.babTitle}`);
    return (
      arNorm.includes(normalized) ||
      b.formattedNumber.toLowerCase().includes(normalized) ||
      String(b.baytNumber).includes(normalized)
    );
  });
}

/**
 * Migrate legacy bookmark IDs (e.g. "shat-001", "shat-1", "shat-100", "shat-1170")
 * to canonical 4-digit IDs ("shat-0001" .. "shat-1173").
 */
export function normalizeShatibiyyahBookmarks(ids: string[]): string[] {
  const seen = new Set<string>();
  for (const id of ids) {
    if (typeof id !== 'string') continue;
    const match = id.match(/^shat-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 1173) {
        seen.add(`shat-${String(num).padStart(4, '0')}`);
      }
    }
  }
  return Array.from(seen);
}

/**
 * Core Quran & Tajweed application type definitions
 */

export type RiwayahId =
  | 'qalun'
  | 'warsh'
  | 'al_bazzi'
  | 'qunbul'
  | 'ad_duri_abu_amr'
  | 'as_susi'
  | 'hisham'
  | 'ibn_dhakwan'
  | 'shubah'
  | 'hafs'
  | 'khalaf_hamzah'
  | 'khallad'
  | 'abu_al_harith'
  | 'ad_duri_kisai'
  | 'ibn_wardan'
  | 'ibn_jammaz'
  | 'ruways'
  | 'rawh'
  | 'ishaq_al_warraq'
  | 'idris_al_haddad';

export type QiraahId =
  | 'nafi'
  | 'ibn_kathir'
  | 'abu_amr'
  | 'ibn_amir'
  | 'asim'
  | 'hamzah'
  | 'kisai'
  | 'abu_jafar'
  | 'yaqub'
  | 'khalaf_tenth';

export interface RiwayahMeta {
  id: RiwayahId;
  orderNumber: number;
  nameEnglish: string;
  nameArabic: string;
  transliteration: string;
  qiraahId: QiraahId;
  qiraahNameEnglish: string;
  qiraahNameArabic: string;
  description: string;
  historicalRegion: string;
}

export type Riwayah = 
  | "Hafs 'an 'Asim"
  | "Warsh 'an Nafi'"
  | "Qalun 'an Nafi'"
  | "Al-Duri 'an Abi 'Amr"
  | "Al-Duri 'an Al-Kisa'i"
  | "Shu'bah 'an 'Asim"
  | "Al-Sousi 'an Abi 'Amr"
  | "Al-Bazzi 'an Ibn Kathir"
  | "Qunbul 'an Ibn Kathir"
  | "Hisham 'an Ibn 'Amir"
  | "Ibn Dhakwan 'an Ibn 'Amir"
  | "Khalaf 'an Hamzah"
  | "Khallad 'an Hamzah"
  | "Abu al-Harith 'an Al-Kisa'i"
  | "Ibn Wardan 'an Abi Ja'far"
  | "Ibn Jammaz 'an Abi Ja'far"
  | "Ruways 'an Ya'qub"
  | "Rawh 'an Ya'qub"
  | "Ishaq al-Warraq 'an Khalaf"
  | "Idris al-Haddad 'an Khalaf"
  | string;

export type RecitationStyle = 
  | "Murattal"
  | "Mujawwad"
  | "Mu'allim (Tajweed Study)"
  | "Taraweeh / Live";

export interface Reciter {
  id: string;
  name: string;
  alternativeSpellings?: string[];
  arabicName: string;
  country: string;
  countryCode: string;
  city?: string;
  state?: string;
  qiraahId: QiraahId;
  riwayahId: RiwayahId;
  riwayah: Riwayah;
  style: RecitationStyle;
  serverUrl: string; // Base URL where {001..114}.mp3 is served
  backupServerUrl?: string; // High-availability fallback mirror
  customUrlMap?: Record<number, string>;
  availableSurahs: number[]; // e.g. 1 to 114
  photoUrl?: string;
  bio: string;
  featured?: boolean;
  verificationStatus: 'verified' | 'pending';
  verifiedAudioSource: string; // e.g. "mp3quran.net CDN", "Internet Archive Authentic Feed"
  hasAudio: boolean;
}

export interface NigerianScholarEntry {
  id: string;
  name: string;
  arabicName: string;
  city: string;
  state: string;
  tradition: string;
  bio: string;
  verificationStatus: 'playable' | 'competition_archive' | 'lecture_tafsir_intro';
  reciterId?: string;
}

export interface SurahMeta {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  transliteration: string;
  meaning: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  juzStart: number;
  pageStart: number;
}

export interface TajweedRuleTag {
  rule: 'ghunnah' | 'idgham' | 'ikhfa' | 'iqlab' | 'qalqalah' | 'madd_wajib' | 'madd_jaiz' | 'madd_lazim' | 'tarqeeq' | 'tafkheem';
  name: string;
  arabicName: string;
  colorClass: string;
  description: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  textArabic: string;
  textUthmaniTajweed?: string; // HTML annotated or tokenized
  translation: string;
  transliteration: string;
  tajweedNotes?: string[];
  audioUrl?: string;
}

export interface ReadingProgress {
  lastStoppedSurahId: number;
  lastStoppedAyahId: number;
  lastReciterId: string;
  lastUpdatedTimestamp: number;
  completedSurahIds: number[]; // array of completed surah IDs
  khatmaGoalDate?: string;
  dailyStreak: number;
  totalListeningMinutes: number;
  practiceRecordingsCount: number;
  dailyGoal?: DailyGoalStatus;
}

export interface DailyGoalStatus {
  lastActiveDate: string; // YYYY-MM-DD
  consecutiveDays: number;
  longestStreak: number;
  listeningMinutesToday: number;
  listeningGoalMinutes: number; // default 15
  readSurahToday: boolean;
  practicedTajweedToday: boolean;
  claimedRewardIds: string[];
}

export interface StreakRewardBadge {
  id: string;
  daysRequired: number;
  title: string;
  arabicTitle: string;
  description: string;
  hadithBlessing: string;
  unlocked: boolean;
  isClaimed: boolean;
}

export interface TajweedPracticeRecord {
  id: string;
  timestamp: number;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  reciterId: string;
  reciterName: string;
  riwayah: Riwayah;
  userAudioUrl?: string;
  audioDurationSeconds: number;
  alignmentScore: number; // 0-100%
  breakdown: {
    pacingMatch: number;      // 0-100%
    maddElongation: number;   // 0-100%
    ghunnahTiming: number;    // 0-100%
    waqfStopTiming: number;   // 0-100%
    rhymeHarmony: number;     // 0-100%
  };
  notes: string;
  selfRating: number; // 1 to 5 stars
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  surahId: number;
  reciterId: string;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  loopMode: 'off' | 'surah' | 'all';
  isLoading: boolean;
}

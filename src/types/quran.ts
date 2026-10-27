/**
 * Core Quran & Tajweed application type definitions
 */

export type Riwayah = 
  | "Hafs 'an 'Asim"
  | "Warsh 'an Nafi'"
  | "Qalun 'an Nafi'"
  | "Al-Duri 'an Abi 'Amr"
  | "Shu'bah 'an 'Asim"
  | "Al-Sousi 'an Abi 'Amr";

export type RecitationStyle = 
  | "Murattal"
  | "Mujawwad"
  | "Mu'allim (Tajweed Study)"
  | "Taraweeh / Live";

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  countryCode: string;
  riwayah: Riwayah;
  style: RecitationStyle;
  serverUrl: string; // Base URL where {001..114}.mp3 is served
  availableSurahs: number[]; // e.g. 1 to 114
  photoUrl?: string;
  bio: string;
  featured?: boolean;
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

import { ReadingProgress, TajweedPracticeRecord } from '../types/quran';

const PROGRESS_KEY = 'nur_quran_reading_progress';
const TAJWEED_HISTORY_KEY = 'nur_quran_tajweed_history';
const FAVORITES_KEY = 'nur_quran_favorite_reciters';
const DAILY_GOAL_KEY = 'nur_quran_daily_goal';

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const DEFAULT_DAILY_GOAL = {
  lastActiveDate: getTodayDateStr(),
  consecutiveDays: 3, // Initial rewarding streak
  longestStreak: 5,
  listeningMinutesToday: 12,
  listeningGoalMinutes: 15,
  readSurahToday: true,
  practicedTajweedToday: true,
  claimedRewardIds: ['reward-1'] // 1-day badge claimed
};

const DEFAULT_PROGRESS: ReadingProgress = {
  lastStoppedSurahId: 1, // Started at Al-Fatihah
  lastStoppedAyahId: 1,
  lastReciterId: 'mahmoud-khalil-al-husary',
  lastUpdatedTimestamp: Date.now(),
  completedSurahIds: [1], // Al-Fatihah initially completed
  dailyStreak: 3,
  totalListeningMinutes: 45,
  practiceRecordingsCount: 1,
  dailyGoal: DEFAULT_DAILY_GOAL
};

export function getStoredProgress(): ReadingProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: Partial<ReadingProgress>): ReadingProgress {
  try {
    const current = getStoredProgress();
    const updated: ReadingProgress = {
      ...current,
      ...progress,
      lastUpdatedTimestamp: Date.now()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save progress to storage', err);
    return DEFAULT_PROGRESS;
  }
}

export function markSurahCompleted(surahId: number, isCompleted: boolean = true): ReadingProgress {
  const current = getStoredProgress();
  const set = new Set(current.completedSurahIds);
  if (isCompleted) {
    set.add(surahId);
  } else {
    set.delete(surahId);
  }
  return saveStoredProgress({
    completedSurahIds: Array.from(set).sort((a, b) => a - b)
  });
}

export function updateLastStopped(surahId: number, ayahId: number = 1, reciterId?: string): ReadingProgress {
  const updatePayload: Partial<ReadingProgress> = {
    lastStoppedSurahId: surahId,
    lastStoppedAyahId: ayahId
  };
  if (reciterId) {
    updatePayload.lastReciterId = reciterId;
  }
  return saveStoredProgress(updatePayload);
}

export function getTajweedHistory(): TajweedPracticeRecord[] {
  try {
    const raw = localStorage.getItem(TAJWEED_HISTORY_KEY);
    if (!raw) {
      return [
        {
          id: 'sample-record-1',
          timestamp: Date.now() - 86400000,
          surahId: 1,
          surahName: 'Al-Fatihah',
          ayahNumber: 1,
          reciterId: 'mahmoud-khalil-al-husary',
          reciterName: 'Mahmoud Khalil Al-Husary',
          riwayah: "Hafs 'an 'Asim",
          audioDurationSeconds: 4.8,
          alignmentScore: 92,
          breakdown: {
            pacingMatch: 94,
            maddElongation: 90,
            ghunnahTiming: 95,
            waqfStopTiming: 91,
            rhymeHarmony: 90
          },
          notes: 'Great match on "Ar-Rahmanir-Raheem" 4-harakat Madd Arid stop with Sheikh Al-Husary.',
          selfRating: 5
        }
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTajweedRecord(record: TajweedPracticeRecord): TajweedPracticeRecord[] {
  try {
    const history = getTajweedHistory();
    const updated = [record, ...history].slice(0, 50);
    localStorage.setItem(TAJWEED_HISTORY_KEY, JSON.stringify(updated));
    
    const currentProgress = getStoredProgress();
    saveStoredProgress({
      practiceRecordingsCount: (currentProgress.practiceRecordingsCount || 0) + 1
    });

    return updated;
  } catch (err) {
    console.error('Failed to save tajweed record', err);
    return [];
  }
}

export function getFavoriteReciters(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['mishary-alafasy', 'mahmoud-khalil-al-husary', 'abdul-basit-murattal'];
  } catch {
    return ['mishary-alafasy', 'mahmoud-khalil-al-husary'];
  }
}

export function toggleFavoriteReciter(reciterId: string): string[] {
  try {
    const current = getFavoriteReciters();
    let updated: string[];
    if (current.includes(reciterId)) {
      updated = current.filter(id => id !== reciterId);
    } else {
      updated = [...current, reciterId];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getDailyGoalStatus() {
  try {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    const today = getTodayDateStr();
    if (!raw) {
      localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(DEFAULT_DAILY_GOAL));
      return DEFAULT_DAILY_GOAL;
    }
    const parsed = JSON.parse(raw);
    
    // Check if new calendar day
    if (parsed.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = parsed.lastActiveDate === yesterday;
      const nextConsecutive = isConsecutive ? parsed.consecutiveDays + 1 : 1;
      const updated = {
        ...parsed,
        lastActiveDate: today,
        consecutiveDays: nextConsecutive,
        longestStreak: Math.max(parsed.longestStreak || 0, nextConsecutive),
        listeningMinutesToday: 0,
        readSurahToday: false,
        practicedTajweedToday: false
      };
      localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(updated));
      return updated;
    }
    return { ...DEFAULT_DAILY_GOAL, ...parsed };
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function saveDailyGoalStatus(status: any) {
  try {
    localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(status));
    return status;
  } catch {
    return status;
  }
}

export function recordDailyListening(addedMinutes: number = 5) {
  const current = getDailyGoalStatus();
  const updated = {
    ...current,
    listeningMinutesToday: Math.min(60, current.listeningMinutesToday + addedMinutes)
  };
  saveDailyGoalStatus(updated);

  const prog = getStoredProgress();
  saveStoredProgress({
    totalListeningMinutes: (prog.totalListeningMinutes || 0) + addedMinutes,
    dailyStreak: updated.consecutiveDays
  });
  return updated;
}

export function recordDailySurahRead() {
  const current = getDailyGoalStatus();
  const updated = {
    ...current,
    readSurahToday: true
  };
  saveDailyGoalStatus(updated);
  return updated;
}

export function recordDailyTajweedPracticed() {
  const current = getDailyGoalStatus();
  const updated = {
    ...current,
    practicedTajweedToday: true
  };
  saveDailyGoalStatus(updated);
  return updated;
}

export function claimStreakReward(rewardId: string) {
  const current = getDailyGoalStatus();
  const set = new Set(current.claimedRewardIds || []);
  set.add(rewardId);
  const updated = {
    ...current,
    claimedRewardIds: Array.from(set)
  };
  saveDailyGoalStatus(updated);
  return updated;
}


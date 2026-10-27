import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Circle, 
  Headphones, 
  BookOpen, 
  Mic, 
  Sparkles, 
  Gift, 
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getDailyGoalStatus, 
  recordDailyListening, 
  recordDailySurahRead, 
  recordDailyTajweedPracticed, 
  claimStreakReward 
} from '../services/storage';

interface DailyQuranGoalProps {
  onNavigateToReader: () => void;
  onNavigateToTajweed: () => void;
  onGoalCompleted: () => void;
}

interface StreakBadge {
  id: string;
  daysRequired: number;
  title: string;
  arabicTitle: string;
  description: string;
  hadithBlessing: string;
}

const STREAK_BADGES: StreakBadge[] = [
  {
    id: 'reward-1',
    daysRequired: 1,
    title: 'The First Dawn (Bidayah)',
    arabicTitle: 'البداية المباركة',
    description: 'Began the daily Quran journey of listening and recitation.',
    hadithBlessing: '"Whoever recites a letter from the Book of Allah will receive one Hasanah, and each Hasanah is multiplied tenfold." (At-Tirmidhi)'
  },
  {
    id: 'reward-3',
    daysRequired: 3,
    title: 'Consistent Seeker (Istiqamah)',
    arabicTitle: 'الاستقامة',
    description: 'Maintained 3 consecutive days of listening and Tajweed alignment.',
    hadithBlessing: '"The most beloved of deeds to Allah are those that are most consistent, even if they are small." (Sahih Muslim)'
  },
  {
    id: 'reward-7',
    daysRequired: 7,
    title: 'Tajweed Devotee (Al-Murattil)',
    arabicTitle: 'المُرَتِّل',
    description: '7 consecutive days honing pronunciation and rhythm with scholars.',
    hadithBlessing: '"The one who is skilled in the recitation of the Quran will be in the company of the noble righteous scribes." (Sahih al-Bukhari)'
  },
  {
    id: 'reward-14',
    daysRequired: 14,
    title: 'Khatma Voyager (Hafidh Track)',
    arabicTitle: 'طالب القرآن',
    description: 'Two full weeks of unbroken Quran dedication and study.',
    hadithBlessing: '"Read the Quran, for it will come as an intercessor for its companions on the Day of Resurrection." (Sahih Muslim)'
  },
  {
    id: 'reward-30',
    daysRequired: 30,
    title: 'Crown of Light (Nur Al-Khatma)',
    arabicTitle: 'تاج النور',
    description: '30 consecutive days of mastery, reflection, and harmonious recitation.',
    hadithBlessing: '"It will be said to the companion of the Quran: Recite and ascend! For your status will be at the last verse you recite." (Abu Dawud)'
  }
];

export const DailyQuranGoal: React.FC<DailyQuranGoalProps> = ({
  onNavigateToReader,
  onNavigateToTajweed,
  onGoalCompleted
}) => {
  const [goalStatus, setGoalStatus] = useState(() => getDailyGoalStatus());
  const [activeRewardModal, setActiveRewardModal] = useState<StreakBadge | null>(null);

  const streak = goalStatus.consecutiveDays || 1;
  const listeningMins = goalStatus.listeningMinutesToday || 0;
  const listeningGoal = goalStatus.listeningGoalMinutes || 15;
  const listeningDone = listeningMins >= listeningGoal;
  const readingDone = goalStatus.readSurahToday;
  const tajweedDone = goalStatus.practicedTajweedToday;

  const completedGoalsCount = (listeningDone ? 1 : 0) + (readingDone ? 1 : 0) + (tajweedDone ? 1 : 0);
  const allGoalsMet = completedGoalsCount === 3;

  const handleAddListeningMinutes = (mins: number) => {
    const updated = recordDailyListening(mins);
    setGoalStatus(updated);
    onGoalCompleted();
    if (updated.listeningMinutesToday >= listeningGoal && !listeningDone) {
      triggerConfetti();
    }
  };

  const handleToggleReading = () => {
    const updated = recordDailySurahRead();
    setGoalStatus(updated);
    onGoalCompleted();
    triggerConfetti();
  };

  const handleToggleTajweed = () => {
    const updated = recordDailyTajweedPracticed();
    setGoalStatus(updated);
    onGoalCompleted();
    triggerConfetti();
  };

  const handleClaimReward = (badge: StreakBadge) => {
    const updated = claimStreakReward(badge.id);
    setGoalStatus(updated);
    setActiveRewardModal(badge);
    onGoalCompleted();
    triggerConfetti();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
      
      {/* Top Header: Streak & Daily Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Daily Quran Habit & Rewards</span>
            <span aria-hidden="true">·</span>
            <span>Consistency Rewards</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Daily Quran Goal</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{streak} Day{streak > 1 ? 's' : ''} Streak</span>
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reward consecutive days of listening to scholars and practicing Tajweed alignment.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {completedGoalsCount} of 3 Completed
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {allGoalsMet ? 'All daily goals achieved!' : 'Keep your daily streak alive'}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
            allGoalsMet 
              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
          }`}>
            {allGoalsMet ? '100%' : `${Math.round((completedGoalsCount / 3) * 100)}%`}
          </div>
        </div>
      </div>

      {/* 3 Core Daily Action Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Goal 1: Listening Goal (15 Mins) */}
        <div className={`p-4 rounded-xl border transition-all ${
          listeningDone 
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                listeningDone 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Quran Listening</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{listeningGoal} mins daily target</p>
              </div>
            </div>

            {listeningDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
          </div>

          <div className="space-y-1.5 my-3">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{listeningMins} of {listeningGoal} mins</span>
              <span className="tabular-nums text-emerald-800 dark:text-emerald-400">
                {Math.min(100, Math.round((listeningMins / listeningGoal) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, (listeningMins / listeningGoal) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleAddListeningMinutes(5)}
              className="flex-1 py-1.5 px-2 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 rounded-md transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Log +5 mins</span>
            </button>
            <button
              onClick={onNavigateToReader}
              className="py-1.5 px-2.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Listen
            </button>
          </div>
        </div>

        {/* Goal 2: Daily Surah Reading */}
        <div className={`p-4 rounded-xl border transition-all ${
          readingDone 
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                readingDone 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Read a Surah</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Read at least 1 chapter</p>
              </div>
            </div>

            {readingDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-3">
            {readingDone 
              ? 'Completed today! Surah recitation recorded.' 
              : 'Read today’s selected Surah in Arabic or translation.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onNavigateToReader}
              className="flex-1 py-1.5 px-2 text-[11px] font-semibold text-white bg-slate-900 hover:bg-black dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-md transition-colors flex items-center justify-center gap-1"
            >
              <span>Open Reader</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            {!readingDone && (
              <button
                onClick={handleToggleReading}
                className="py-1.5 px-2 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 rounded-md transition-colors"
              >
                Mark Read
              </button>
            )}
          </div>
        </div>

        {/* Goal 3: Daily Tajweed Practice */}
        <div className={`p-4 rounded-xl border transition-all ${
          tajweedDone 
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tajweedDone 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Tajweed Practice</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Recite & match a Sheikh</p>
              </div>
            </div>

            {tajweedDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-3">
            {tajweedDone 
              ? 'Completed today! Voice rhymed with Sheikh.' 
              : 'Test your breath pacing, Madd, and Ghunnah.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onNavigateToTajweed}
              className="flex-1 py-1.5 px-2 text-[11px] font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-md transition-colors flex items-center justify-center gap-1"
            >
              <Mic className="w-3 h-3" />
              <span>Practice in Studio</span>
            </button>
            {!tajweedDone && (
              <button
                onClick={handleToggleTajweed}
                className="py-1.5 px-2 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                Mark Done
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Consecutive Days Streak Rewards Bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Consecutive Streak Milestones & Blessings</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rewards unlock as you maintain consecutive days of listening or Tajweed study.
            </p>
          </div>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
            Next Milestone: {STREAK_BADGES.find(b => b.daysRequired > streak)?.daysRequired || 30} Days
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {STREAK_BADGES.map((badge) => {
            const isUnlocked = streak >= badge.daysRequired;
            const isClaimed = (goalStatus.claimedRewardIds || []).includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'border-amber-300 dark:border-amber-500/50 bg-amber-50/40 dark:bg-amber-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {badge.daysRequired} Day{badge.daysRequired > 1 ? 's' : ''}
                    </span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      isUnlocked 
                        ? 'bg-amber-400 text-emerald-950 font-bold' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                      {isUnlocked ? '✓' : '🔒'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {badge.title}
                  </h4>
                  <div className="font-arabic text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1" dir="rtl">
                    {badge.arabicTitle}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  {isUnlocked && !isClaimed ? (
                    <button
                      onClick={() => handleClaimReward(badge)}
                      className="w-full py-1 px-2 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Gift className="w-3 h-3" />
                      <span>Claim Blessing</span>
                    </button>
                  ) : isUnlocked && isClaimed ? (
                    <button
                      onClick={() => setActiveRewardModal(badge)}
                      className="w-full py-1 px-2 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 rounded-md transition-colors text-center"
                    >
                      View Blessing
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-medium">
                      {badge.daysRequired - streak} day{badge.daysRequired - streak > 1 ? 's' : ''} to unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hadith / Blessing Modal */}
      {activeRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeRewardModal.title}
                  </h3>
                  <div className="font-arabic text-sm text-emerald-800 dark:text-emerald-400 font-bold" dir="rtl">
                    {activeRewardModal.arabicTitle}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveRewardModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/60 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 space-y-2">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                Prophetic Hadith on Consistency
              </span>
              <p className="text-xs sm:text-sm italic leading-relaxed">
                {activeRewardModal.hadithBlessing}
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              May Allah bless your recitation, elevate your Tajweed, and grant you constancy in listening to and reflecting upon His noble speech.
            </p>

            <button
              onClick={() => setActiveRewardModal(null)}
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
            >
              Continue My Quran Journey
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

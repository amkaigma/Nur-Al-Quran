import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Book, 
  Users, 
  Layers, 
  Sparkles, 
  Languages, 
  Clock, 
  Compass, 
  Mic, 
  CheckCircle2, 
  Settings, 
  Play, 
  Pause, 
  Flame, 
  ArrowRight, 
  Volume2, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  ChevronRight,
  Sun,
  Moon,
  Radio,
  BookMarked,
  ShieldCheck,
  Bookmark,
  MapPin
} from 'lucide-react';
import { Reciter, SurahMeta } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { RECITERS } from '../data/reciters';
import { calculatePrayerTimes, WORLD_CITIES, getHijriDateString } from '../services/prayerTimes';
import { getStoredProgress, getDailyGoalStatus } from '../services/storage';
import { AppTab } from './Navbar';

interface HomeDashboardProps {
  currentReciter: Reciter;
  currentSurah: SurahMeta;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNavigate: (tab: AppTab) => void;
  onOpenReciterSwitcher: () => void;
  onOpenMushafAtPage?: (page: number) => void;
  onResumeLastSurah: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentReciter,
  currentSurah,
  isPlaying,
  onTogglePlay,
  onNavigate,
  onOpenReciterSwitcher,
  onOpenMushafAtPage,
  onResumeLastSurah
}) => {
  const [progress, setProgress] = useState(() => getStoredProgress());
  const [dailyGoal, setDailyGoal] = useState(() => getDailyGoalStatus());
  const [copiedHadith, setCopiedHadith] = useState(false);

  // Prayer times state
  const [prayerData, setPrayerData] = useState(() => {
    const city = WORLD_CITIES[0]; // Makkah default
    return calculatePrayerTimes(new Date(), city.lat, city.lng, city.timezone, city.method);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const city = WORLD_CITIES[0];
      setPrayerData(calculatePrayerTimes(new Date(), city.lat, city.lng, city.timezone, city.method));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setProgress(getStoredProgress());
    setDailyGoal(getDailyGoalStatus());
  }, []);

  const lastSurah = getSurahById(progress.lastStoppedSurahId) || SURAHS[0];
  const lastMushafPage = progress.lastStoppedPage || lastSurah.pageStart || 1;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const hijriFormatted = getHijriDateString(new Date());

  const featuredAyah = {
    arabic: 'إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ',
    english: 'Indeed, this Qur\'an guides to that which is most upright and gives good tidings to the believers.',
    hausa: 'Lallai wannan Alƙur\'ani yana shiryarwa ga hanyar da take mafi daidaita.',
    surah: 'Surah Al-Isra (17:9)'
  };

  const featuredHadith = {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Qur\'an and teach it to others.',
    hausa: 'Mafi alherin ku shi ne wanda ya koyi Alƙur\'ani kuma ya karantar da shi.',
    source: 'Sahih Al-Bukhari (5027)'
  };

  const handleCopyHadith = () => {
    const text = `${featuredHadith.arabic}\n\n"${featuredHadith.english}"\n\n— ${featuredHadith.source}`;
    navigator.clipboard.writeText(text);
    setCopiedHadith(true);
    setTimeout(() => setCopiedHadith(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-4">
      
      {/* 1. Sleek Compact Header & Next Prayer Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-4 sm:p-5 shadow-md border border-emerald-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Greeting, Date, Hijri */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-emerald-200/90 font-medium mb-1">
              <span>{todayFormatted}</span>
              <span>·</span>
              <span className="text-amber-300 font-arabic">{hijriFormatted}</span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Assalamu Alaikum</span>
              <span className="text-xs font-normal text-emerald-200">· Nur Al-Quran</span>
            </h1>

            <p className="text-xs text-emerald-100/80 truncate max-w-md hidden sm:block mt-0.5">
              20 Canonical Riwayat, Traditional 604-page Mushaf & authentic Islamic library.
            </p>
          </div>

          {/* Right: Next Prayer Countdown Badge */}
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/15 shrink-0">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Next: {prayerData.nextPrayer.name}</span>
                <span className="font-arabic text-[11px]">({prayerData.nextPrayer.arabicName})</span>
              </div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white font-mono leading-none mt-0.5">
                {prayerData.nextPrayer.time}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-white/15">
              <button
                onClick={() => onNavigate('prayer_times')}
                className="py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors shadow-sm"
              >
                Prayers
              </button>
              <button
                onClick={() => onNavigate('qibla')}
                className="p-1 px-2 rounded bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Qibla Compass"
              >
                <Compass className="w-3 h-3 text-amber-300" />
                <span className="hidden xs:inline">Qibla</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Fast-Action Quick Continue Cards (2 cols mobile, 4 cols desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        
        {/* Card 1: Resume Quran */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Quran</span>
              </span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                #{lastSurah.id}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {lastSurah.nameEnglish}
            </h3>
            <p className="font-arabic text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {lastSurah.nameArabic} · {lastSurah.versesCount} Ayahs
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <button
              onClick={onResumeLastSurah}
              className="flex-1 py-1 px-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Resume</span>
            </button>
            <button
              onClick={() => onNavigate('reader')}
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 text-xs"
              title="Open Reader"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Traditional Mushaf */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-amber-500 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Book className="w-3 h-3" />
                <span>Mushaf</span>
              </span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                p.{lastMushafPage}/604
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              Madinah Mushaf
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Full facsimile pages
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('mushaf')}
              className="w-full py-1 px-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Book className="w-3 h-3" />
              <span>Page {lastMushafPage}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Active Reciter */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-500 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Voice</span>
              </span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {currentReciter.countryCode === 'NG' ? '🇳🇬 NG' : currentReciter.countryCode}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentReciter.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentReciter.style}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenReciterSwitcher}
              className="w-full py-1 px-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Users className="w-3 h-3" />
              <span>Switch Voice</span>
            </button>
          </div>
        </div>

        {/* Card 4: Daily Quran Goal */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-orange-500 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 fill-orange-500" />
                <span>Goal</span>
              </span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                {dailyGoal.streakDays}d Streak
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {dailyGoal.completed ? 'Completed Today!' : `${Math.round(dailyGoal.percentage)}% Done`}
            </h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, dailyGoal.percentage)}%` }}
              />
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('goals')}
              className="w-full py-1 px-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>View Badges</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Compact Ayah of Divine Guidance */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Ayah of the Day
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {featuredAyah.surah}
          </span>
        </div>

        <p className="font-arabic text-base sm:text-lg text-right leading-relaxed text-slate-900 dark:text-slate-100 my-1" dir="rtl">
          {featuredAyah.arabic}
        </p>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-normal line-clamp-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Meaning: </span>
          "{featuredAyah.english}"
        </p>
      </div>

      {/* 4. Complete App Destination Hub (Compact High-Density Grid) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            All Dedicated Tools & Portals
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
          
          {/* Quran Reader */}
          <button
            onClick={() => onNavigate('reader')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                Quran Reader
              </div>
              <div className="text-[10px] text-slate-400 truncate">114 Surahs & Tafsir</div>
            </div>
          </button>

          {/* Traditional Mushaf */}
          <button
            onClick={() => onNavigate('mushaf')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Book className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600">
                Mushaf (604)
              </div>
              <div className="text-[10px] text-slate-400 truncate">Facsimile Spread</div>
            </div>
          </button>

          {/* Reciters Directory */}
          <button
            onClick={() => onNavigate('reciters')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                Reciters Directory
              </div>
              <div className="text-[10px] text-slate-400 truncate">50+ Masters & NG</div>
            </div>
          </button>

          {/* 20 Riwayat */}
          <button
            onClick={() => onNavigate('riwayah')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                20 Riwayat
              </div>
              <div className="text-[10px] text-slate-400 truncate">Hafs, Warsh & all</div>
            </div>
          </button>

          {/* Islamic Library */}
          <button
            onClick={() => onNavigate('library')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0">
              <BookMarked className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600">
                Islamic Library
              </div>
              <div className="text-[10px] text-slate-400 truncate">60+ Classical Books</div>
            </div>
          </button>

          {/* Prayer Times */}
          <button
            onClick={() => onNavigate('prayer_times')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600">
                Prayer Times
              </div>
              <div className="text-[10px] text-slate-400 truncate">Worldwide & 36 States</div>
            </div>
          </button>

          {/* Qibla Direction */}
          <button
            onClick={() => onNavigate('qibla')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                Qibla Compass
              </div>
              <div className="text-[10px] text-slate-400 truncate">Rotating sensor</div>
            </div>
          </button>

          {/* Haramain Live */}
          <button
            onClick={() => onNavigate('haramain')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600">
                Haramain Live
              </div>
              <div className="text-[10px] text-slate-400 truncate">Makkah & Madinah</div>
            </div>
          </button>

          {/* Audio Translations */}
          <button
            onClick={() => onNavigate('translations')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Languages className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                Translations
              </div>
              <div className="text-[10px] text-slate-400 truncate">Hausa, Yoruba & 12</div>
            </div>
          </button>

          {/* Tajweed Studio */}
          <button
            onClick={() => onNavigate('tajweed')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600">
                Tajweed Studio
              </div>
              <div className="text-[10px] text-slate-400 truncate">Voice recorder</div>
            </div>
          </button>

          {/* Daily Goals */}
          <button
            onClick={() => onNavigate('goals')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600">
                Daily Goals
              </div>
              <div className="text-[10px] text-slate-400 truncate">Streaks & Badges</div>
            </div>
          </button>

          {/* Settings & Adhan */}
          <button
            onClick={() => onNavigate('settings')}
            className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-500 text-left flex items-center gap-2.5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-200">
                Settings & Adhan
              </div>
              <div className="text-[10px] text-slate-400 truncate">Adhan, Iqama & theme</div>
            </div>
          </button>

        </div>
      </div>

      {/* 5. Compact Hadith & Hisnul Muslim Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Hadith */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Hadith of the Day
              </span>
              <button
                onClick={handleCopyHadith}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Copy Hadith"
              >
                {copiedHadith ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <p className="font-arabic text-sm sm:text-base text-right leading-relaxed text-slate-900 dark:text-white" dir="rtl">
              {featuredHadith.arabic}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-normal">
              "{featuredHadith.english}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 text-[11px]">
            <span className="text-slate-400 font-mono text-[10px]">{featuredHadith.source}</span>
            <button
              onClick={() => onNavigate('library')}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Library</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Hisnul Muslim Daily Adhkar */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-3.5 sm:p-4 border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                Hisnul Muslim
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                Daily Adhkar
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Morning & Evening Remembrances
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
              Authentic fortress supplications with interactive repetition counters and Hausa meanings.
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-100 dark:border-emerald-800/60 mt-2">
            <button
              onClick={() => onNavigate('library')}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Open Hisnul Muslim Adhkar</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

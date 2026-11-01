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
  Bookmark
} from 'lucide-react';
import { Reciter, SurahMeta } from '../types/quran';
import { SURAHS, getSurahById } from '../data/surahs';
import { RECITERS } from '../data/reciters';
import { calculatePrayerTimes, WORLD_CITIES } from '../services/prayerTimes';
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

  // Prayer times state for Makkah / default city
  const [prayerData, setPrayerData] = useState(() => {
    const city = WORLD_CITIES[0]; // Makkah
    return calculatePrayerTimes(new Date(), city.lat, city.lng, city.timezone, city.method);
  });

  // Real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const city = WORLD_CITIES[0];
      setPrayerData(calculatePrayerTimes(new Date(), city.lat, city.lng, city.timezone, city.method));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update daily goal / progress on focus
  useEffect(() => {
    setProgress(getStoredProgress());
    setDailyGoal(getDailyGoalStatus());
  }, []);

  const lastSurah = getSurahById(progress.lastStoppedSurahId) || SURAHS[0];
  const lastMushafPage = progress.lastStoppedPage || 1;

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const featuredAyah = {
    arabic: 'إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا',
    english: 'Indeed, this Qur\'an guides to that which is most suitable and gives good tidings to the believers who work righteous deeds that they will have a great reward.',
    hausa: 'Lalle ne wannan Alƙur\'ani yana shiryarwa ga hanyar da take mafi daidaita, kuma yana bayar da bushara ga muminai waɗanda suke aikata ayyukan ƙwarai cewa suna da sakamako mai girma.',
    surah: 'Surah Al-Isra (17:9)'
  };

  const featuredHadith = {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Qur\'an and teach it to others.',
    hausa: 'Mafi alherin ku shi ne wanda ya koyi Alƙur\'ani kuma ya karantar da shi.',
    source: 'Sahih Al-Bukhari (5027)'
  };

  const handleCopyHadith = () => {
    const text = `${featuredHadith.arabic}\n\n"${featuredHadith.english}"\n\nHausa: "${featuredHadith.hausa}"\n\n— ${featuredHadith.source}`;
    navigator.clipboard.writeText(text);
    setCopiedHadith(true);
    setTimeout(() => setCopiedHadith(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. Header Greeting & Date Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-700/80 text-emerald-200 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {todayFormatted}
              </span>
              <span className="text-xs text-emerald-200/80">·</span>
              <span className="text-xs text-amber-300 font-arabic font-medium">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
              Assalamu Alaikum
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              Welcome to <span className="font-semibold text-amber-300">Nur Al-Quran</span>. Listen to 20 canonical Riwayat, immerse in the traditional Mushaf, discover verified reciters, and delve into classical Islamic books.
            </p>
          </div>

          {/* Next Prayer Countdown Card */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 min-w-[240px] flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Next Prayer ({prayerData.nextPrayer.name})</span>
              </div>
              <span className="font-arabic text-amber-300 text-sm font-bold">
                {prayerData.nextPrayer.arabicName}
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                {prayerData.nextPrayer.time}
              </span>
              <span className="text-xs text-emerald-200 font-mono">
                in {Math.floor(prayerData.nextPrayer.remainingMinutes / 60)}h {prayerData.nextPrayer.remainingMinutes % 60}m {prayerData.nextPrayer.remainingSeconds}s
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('prayer_times')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center transition-colors shadow-sm"
              >
                Prayer Times
              </button>
              <button
                onClick={() => onNavigate('qibla')}
                className="py-1.5 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                title="Qibla Direction"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Qibla</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary 4 Continue / Fast-Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card A: Continue Quran Audio */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <span>Continue Recitation</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Surah #{lastSurah.id}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">
              {lastSurah.nameEnglish}
            </h3>
            <p className="font-arabic text-sm text-slate-500 dark:text-slate-400 truncate mb-3">
              {lastSurah.nameArabic} · {lastSurah.versesCount} Ayahs
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onResumeLastSurah}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Audio</span>
            </button>
            <button
              onClick={() => onNavigate('reader')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Open in Reader"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card B: Traditional Mushaf Jump */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Book className="w-4 h-4" />
                <span>Traditional Mushaf</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Page {lastMushafPage} / 604
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">
              Madinah Page Spread
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Authentic complete facsimile pages, high-res calligraphy & digital modes.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('mushaf')}
              className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Book className="w-3.5 h-3.5" />
              <span>Open Mushaf Page {lastMushafPage}</span>
            </button>
          </div>
        </div>

        {/* Card C: Active Reciter & Voice Switcher */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Volume2 className="w-4 h-4" />
                <span>Active Reciter</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {currentReciter.countryCode === 'NG' ? '🇳🇬 Nigeria' : currentReciter.country}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">
              {currentReciter.name}
            </h3>
            <p className="font-arabic text-xs text-slate-500 dark:text-slate-400 truncate mb-3">
              {currentReciter.arabicName || currentReciter.style} · {currentReciter.style}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenReciterSwitcher}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Change Reciter Voice</span>
            </button>
          </div>
        </div>

        {/* Card D: Daily Quran Goal */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Daily Quran Goal</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                {dailyGoal.streakDays} Day Streak
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">
              {dailyGoal.completed ? 'Goal Completed!' : `${Math.round(dailyGoal.percentage)}% Completed Today`}
            </h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, dailyGoal.percentage)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('goals')}
              className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>View Daily Goals & Badges</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Featured Ayah of Guidance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ayah of Divine Light
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {featuredAyah.surah}
          </span>
        </div>

        <p className="font-arabic text-xl sm:text-2xl text-center leading-loose text-slate-900 dark:text-slate-100 my-4 px-2" dir="rtl">
          {featuredAyah.arabic}
        </p>

        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p><span className="font-semibold text-slate-900 dark:text-white">English: </span>{featuredAyah.english}</p>
          <p><span className="font-semibold text-emerald-700 dark:text-emerald-400">Hausa: </span>{featuredAyah.hausa}</p>
        </div>
      </div>

      {/* 4. Complete App Destination Hub (Clean Responsive Grid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Explore All Features & Destinations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dedicated, responsive tools engineered for seamless Quran study on phone, tablet, and desktop
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Tile 1: Quran Reader */}
          <button
            onClick={() => onNavigate('reader')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Quran Reader
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                114 Surahs with ayah-by-ayah audio, English & Hausa translations, Tafsir & bookmarks.
              </p>
            </div>
          </button>

          {/* Tile 2: Traditional Mushaf */}
          <button
            onClick={() => onNavigate('mushaf')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Traditional Mushaf
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                604 complete pages, authentic Madinah facsimile, double-page tablet & desktop layout.
              </p>
            </div>
          </button>

          {/* Tile 3: Reciters Directory */}
          <button
            onClick={() => onNavigate('reciters')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Reciters Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Over 50 verified international, African & Nigerian masters with verified recordings.
              </p>
            </div>
          </button>

          {/* Tile 4: 20 Canonical Riwayat */}
          <button
            onClick={() => onNavigate('riwayah')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                20 Riwayat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Explore Hafs, Warsh, Qalun, Ad-Duri and all 20 canonical recitation chains.
              </p>
            </div>
          </button>

          {/* Tile 5: Islamic Library */}
          <button
            onClick={() => onNavigate('library')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Islamic Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                6 categories: Hadith, Adhkar, Aqidah, Seerah, Fiqh & Tajweed with interactive counters.
              </p>
            </div>
          </button>

          {/* Tile 6: Prayer Times */}
          <button
            onClick={() => onNavigate('prayer_times')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Prayer Times
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Astronomical times for cities worldwide, GPS location support, and Iqama reminders.
              </p>
            </div>
          </button>

          {/* Tile 7: Qibla Direction */}
          <button
            onClick={() => onNavigate('qibla')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Qibla Direction
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Live rotating compass needle, real Kaaba distance, and phone sensor alignment.
              </p>
            </div>
          </button>

          {/* Tile 8: Haramain Live 24/7 */}
          <button
            onClick={() => onNavigate('haramain')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Haramain Live
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Makkah & Madinah live broadcasts, Taraweeh recordings & historical recordings.
              </p>
            </div>
          </button>

          {/* Tile 9: Audio Translations */}
          <button
            onClick={() => onNavigate('translations')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Audio Translations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                12 world languages: Hausa, Yoruba, English, French, Urdu, Somali, Turkish & more.
              </p>
            </div>
          </button>

          {/* Tile 10: Tajweed Studio */}
          <button
            onClick={() => onNavigate('tajweed')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Tajweed Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Listen, repeat, and record your voice to compare your recitation with master reciters.
              </p>
            </div>
          </button>

          {/* Tile 11: Progress Tracker */}
          <button
            onClick={() => onNavigate('progress')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Progress Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Khatm completion gauge, memorization milestones, and recitation history logs.
              </p>
            </div>
          </button>

          {/* Tile 12: Settings & Iqama */}
          <button
            onClick={() => onNavigate('settings')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                Settings & Iqama
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                Configure automatic Iqama recitation, prayer permissions, themes, and audio defaults.
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* 5. Featured Hadith & Daily Adhkar Shortcut Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Hadith of the Day */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Hadith of the Day
              </span>
              <button
                onClick={handleCopyHadith}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy Hadith"
              >
                {copiedHadith ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="font-arabic text-lg sm:text-xl text-right leading-relaxed text-slate-900 dark:text-white mb-3" dir="rtl">
              {featuredHadith.arabic}
            </p>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">
              "{featuredHadith.english}"
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Hausa: </span>
              "{featuredHadith.hausa}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">{featuredHadith.source}</span>
            <button
              onClick={() => onNavigate('library')}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explore Sahih Al-Bukhari</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Adhkar Shortcut Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl p-5 sm:p-6 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Fortress of the Muslim (Hisnul Muslim)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                Daily Adhkar
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Morning & Evening Remembrances
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Recite authentic invocations with interactive repetition counters, full Arabic texts, English explanations, and Hausa translations.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-800 text-center">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Morning Adhkar</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">أذكار الصباح</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-800 text-center">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Evening Adhkar</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">أذكار المساء</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <BookMarked className="w-4 h-4" />
            <span>Open Adhkar in Islamic Library</span>
          </button>
        </div>

      </div>

    </div>
  );
};

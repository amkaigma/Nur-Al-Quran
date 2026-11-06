/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { RiwayahSelection } from './components/RiwayahSelection';
import { RecitersDirectory } from './components/RecitersDirectory';
import { QuranReader } from './components/QuranReader';
import { TraditionalMushafReader } from './components/TraditionalMushafReader';
import { IslamicLibraryView } from './components/IslamicLibraryView';
import { PrayerTimesView } from './components/PrayerTimesView';
import { QiblaView } from './components/QiblaView';
import { HaramainMushafsView } from './components/HaramainMushafsView';
import { AudioTranslationsView } from './components/AudioTranslationsView';
import { TajweedStudio } from './components/TajweedStudio';
import { ProgressTracker } from './components/ProgressTracker';
import { DailyQuranGoal } from './components/DailyQuranGoal';
import { SettingsView } from './components/SettingsView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { MobileCompactAudioPlayer } from './components/MobileCompactAudioPlayer';
import { ReciterSwitcherDrawer } from './components/ReciterSwitcherDrawer';
import { FridayKahfBanner } from './components/FridayKahfBanner';
import { AudioHealthCheckerModal } from './components/AudioHealthCheckerModal';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { WorldwideAdhanVoices } from './components/WorldwideAdhanVoices';
import { UserFeedbackModal } from './components/UserFeedbackModal';
import { emitClientPresence } from './services/adminService';
import { Reciter, SurahMeta } from './types/quran';
import { RECITERS, getReciterById } from './data/reciters';
import { SURAHS, getSurahById } from './data/surahs';
import { getStoredProgress, updateLastStopped } from './services/storage';
import { useQuranAudio } from './hooks/useQuranAudio';
import { checkAndTriggerIqama, getIqamaSettings } from './services/iqamaService';
import { checkAndTriggerAdhan, getAdhanSettings } from './services/adhanService';
import { calculatePrayerTimes, WORLD_CITIES, NIGERIAN_STATES } from './services/prayerTimes';
import { Bell, Volume2, X, ShieldCheck, MessageSquare } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState(() => getStoredProgress());
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [targetRiwayahId, setTargetRiwayahId] = useState<string | null>(null);
  const [isAudioHealthOpen, setIsAudioHealthOpen] = useState<boolean>(false);
  const [isReciterSwitcherOpen, setIsReciterSwitcherOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  
  // Super Admin Route detection (/admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  });

  // Keep admin route in sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAdmin = useCallback(() => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExitAdmin = useCallback(() => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Notification toast for automatic Iqama and Adhan
  const [iqamaToast, setIqamaToast] = useState<{ prayer: string; message: string } | null>(null);
  const [adhanToast, setAdhanToast] = useState<{ prayer: string; message: string } | null>(null);

  // Dark mode theme preference persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nur_quran_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('nur_quran_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('nur_quran_theme', 'light');
      }
    } catch (err) {
      console.warn('Failed to update theme classes:', err);
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Universal scroll restoration: Every new tab or major section change scrolls to the top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const [currentReciter, setCurrentReciter] = useState<Reciter>(() => {
    return getReciterById(progress.lastReciterId) || RECITERS[0];
  });

  const [currentSurahId, setCurrentSurahId] = useState<number>(() => {
    return progress.lastStoppedSurahId || 1;
  });

  const [tajweedPreselect, setTajweedPreselect] = useState<{ surahId: number; ayahNumber: number } | null>(null);

  const refreshProgress = useCallback(() => {
    setProgress(getStoredProgress());
  }, []);

  const handleSurahChange = useCallback((newSurahId: number) => {
    setCurrentSurahId(newSurahId);
    updateLastStopped(newSurahId, 1, currentReciter.id);
    refreshProgress();
  }, [currentReciter.id, refreshProgress]);

  // Quran Audio Player Hook with Live Recitation & Mushaf Synchronization
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    loopMode,
    isLoading,
    hasError,
    togglePlay,
    seek,
    changePlaybackRate,
    changeVolume,
    toggleMute,
    setLoopMode,
    nextSurah,
    prevSurah,
    activeAyahNumber,
    activeMushafPage,
    syncSettings,
    updateSyncSettings,
    seekToAyah,
    sameRiwayahAltReciter,
    switchToSameRiwayahAlternative
  } = useQuranAudio({
    currentReciter,
    currentSurahId,
    onSurahChange: handleSurahChange,
    onReciterChange: setCurrentReciter
  });

  const currentSurahMeta: SurahMeta = getSurahById(currentSurahId) || SURAHS[0];
  const lastStoppedSurah: SurahMeta = getSurahById(progress.lastStoppedSurahId) || SURAHS[0];

  const handleSelectReciter = (reciter: Reciter, startPlay: boolean = true) => {
    setCurrentReciter(reciter);
    updateLastStopped(currentSurahId, 1, reciter.id);
    refreshProgress();
    if (startPlay && !isPlaying) {
      setTimeout(() => togglePlay(), 100);
    }
  };

  const handleOpenTajweedWithReciter = (reciter: Reciter) => {
    setCurrentReciter(reciter);
    setActiveTab('tajweed');
    setTajweedPreselect({ surahId: currentSurahId, ayahNumber: 1 });
  };

  const handleOpenTajweedTarget = (surahId: number, ayahNumber: number) => {
    setTajweedPreselect({ surahId, ayahNumber });
    setActiveTab('tajweed');
  };

  const handleResumeLastStopped = () => {
    setCurrentSurahId(progress.lastStoppedSurahId || 1);
    setActiveTab('reader');
    if (!isPlaying) {
      togglePlay();
    }
  };

  const handleOpenKahfReader = () => {
    setCurrentSurahId(18);
    updateLastStopped(18, 1, currentReciter.id);
    refreshProgress();
    setActiveTab('reader');
  };

  const handlePlayKahfAudio = () => {
    setCurrentSurahId(18);
    updateLastStopped(18, 1, currentReciter.id);
    refreshProgress();
    if (!isPlaying) {
      setTimeout(() => togglePlay(), 100);
    }
  };

  // Background Automatic Adhan & Iqama Monitor
  useEffect(() => {
    const checkPrayerEvents = () => {
      const now = new Date();
      // Default to Abuja / FCT or user's chosen location
      const defaultCity = NIGERIAN_STATES.find(s => s.id === 'ng_fct') || WORLD_CITIES[0];
      const prayerTimes = calculatePrayerTimes(now, defaultCity.lat, defaultCity.lng, defaultCity.timezone, defaultCity.method);

      const prayers: Array<{ key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; time: string; name: string }> = [
        { key: 'fajr', time: prayerTimes.fajr, name: 'Fajr' },
        { key: 'dhuhr', time: prayerTimes.dhuhr, name: 'Dhuhr' },
        { key: 'asr', time: prayerTimes.asr, name: 'Asr' },
        { key: 'maghrib', time: prayerTimes.maghrib, name: 'Maghrib' },
        { key: 'isha', time: prayerTimes.isha, name: 'Isha' },
      ];

      // 1. Check Adhan (entry of prayer)
      const adhanSettings = getAdhanSettings();
      if (adhanSettings.enabled) {
        for (const p of prayers) {
          if (!adhanSettings.enabledPrayers[p.key]) continue;
          const [hours, minutes] = p.time.split(':').map(Number);
          const adhanDate = new Date();
          adhanDate.setHours(hours, minutes, 0, 0);

          const diffMs = Math.abs(now.getTime() - adhanDate.getTime());
          if (diffMs < 45000) {
            const triggered = checkAndTriggerAdhan(p.key, p.time, defaultCity.name, (name) => {
              setAdhanToast({
                prayer: name.toUpperCase(),
                message: `Allahu Akbar! Adhan for ${name} prayer is now calling. Hayya 'alas-Salah.`
              });
              setTimeout(() => setAdhanToast(null), 14000);
            });
            if (triggered) break;
          }
        }
      }

      // 2. Check Iqama (congregation announcement)
      const iqamaSettings = getIqamaSettings();
      if (iqamaSettings.enabled) {
        for (const p of prayers) {
          if (!iqamaSettings.selectedPrayers[p.key]) continue;
          const [hours, minutes] = p.time.split(':').map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);

          const iqamaTime = new Date(prayerDate.getTime() + iqamaSettings.delayMinutes * 60000);
          const diffMs = Math.abs(now.getTime() - iqamaTime.getTime());
          if (diffMs < 45000) {
            const triggered = checkAndTriggerIqama(p.key, p.time, (name) => {
              setIqamaToast({
                prayer: name.toUpperCase(),
                message: `Automatic Iqama recitation commenced for ${name}. Qad qamatis-Salah.`
              });
              setTimeout(() => setIqamaToast(null), 10000);
            });
            if (triggered) break;
          }
        }
      }
    };

    // Run every 30 seconds
    const interval = setInterval(checkPrayerEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  // Live Client Presence & Session Heartbeat (Feeds live DAU/online count to Super Admin)
  useEffect(() => {
    const sendHeartbeat = () => {
      let mode: 'reading' | 'listening' | 'tajweed' | 'library' | 'general' = 'general';
      if (isPlaying) {
        mode = 'listening';
      } else if (activeTab === 'reader' || activeTab === 'mushaf') {
        mode = 'reading';
      } else if (activeTab === 'tajweed') {
        mode = 'tajweed';
      } else if (activeTab === 'library') {
        mode = 'library';
      }
      emitClientPresence(mode);
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, [activeTab, isPlaying]);

  // Private Super Admin Dashboard View (/admin)
  if (isAdminRoute) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <SuperAdminDashboard onExitAdmin={handleExitAdmin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans pb-36 md:pb-28 transition-colors duration-200">
      
      {/* Responsive Header & Navigation (Mobile, Tablet & Desktop) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastStoppedSurah={lastStoppedSurah}
        onResume={handleResumeLastStopped}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAudioHealth={() => setIsAudioHealthOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenReportIssue={() => setIsFeedbackModalOpen(true)}
      />

      {/* Iqama Toast Notification */}
      {iqamaToast && (
        <aside aria-label="Iqama notifications" className="fixed top-16 right-4 z-50 bg-emerald-800 text-white p-4 rounded-2xl shadow-2xl border border-emerald-600 flex items-center gap-3 max-w-sm animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {iqamaToast.prayer} Iqama
            </div>
            <div className="text-xs text-white/90">
              {iqamaToast.message}
            </div>
          </div>
          <button 
            onClick={() => setIqamaToast(null)}
            className="p-1 rounded text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Adhan Toast Notification */}
      {adhanToast && (
        <aside aria-label="Adhan notifications" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3.5 max-w-md animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold shadow-md">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {adhanToast.prayer} Adhan Calling
            </div>
            <div className="text-xs text-white/90">
              {adhanToast.message}
            </div>
          </div>
          <button 
            onClick={() => setAdhanToast(null)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* eTilawa Sunnah: Friday Surah Al-Kahf Prompt */}
        <FridayKahfBanner
          currentReciter={currentReciter}
          onOpenKahfReader={handleOpenKahfReader}
          onPlayKahfAudio={handlePlayKahfAudio}
        />
        
        {/* 1. HOME DASHBOARD */}
        {activeTab === 'home' && (
          <HomeDashboard
            currentReciter={currentReciter}
            currentSurah={currentSurahMeta}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReciterSwitcher={() => setIsReciterSwitcherOpen(true)}
            onOpenMushafAtPage={(page) => {
              setActiveTab('mushaf');
            }}
            onResumeLastSurah={handleResumeLastStopped}
          />
        )}

        {/* 2. QURAN READER (114 Surahs with Ayah playback, tafsir & translations) */}
        {activeTab === 'reader' && (
          <QuranReader
            currentSurahId={currentSurahId}
            onSelectSurah={handleSurahChange}
            currentReciter={currentReciter}
            onSelectReciter={handleSelectReciter}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            completedSurahIds={progress.completedSurahIds}
            onProgressUpdate={refreshProgress}
            onOpenTajweedTarget={handleOpenTajweedTarget}
            activeAyahNumber={activeAyahNumber}
            activeMushafPage={activeMushafPage}
            syncSettings={syncSettings}
            onUpdateSyncSettings={updateSyncSettings}
            onSeekToAyah={seekToAyah}
          />
        )}

        {/* 3. TRADITIONAL MUSHAF (604 Complete Pages with Facsimile & Digital Page modes) */}
        {activeTab === 'mushaf' && (
          <TraditionalMushafReader
            initialPage={progress.lastStoppedPage || 1}
            currentSurahId={currentSurahId}
            onSelectSurah={handleSurahChange}
            currentReciter={currentReciter}
            onSelectReciter={handleSelectReciter}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onSwitchToStudyView={() => setActiveTab('reader')}
            activeAyahNumber={activeAyahNumber}
            activeMushafPage={activeMushafPage}
            syncSettings={syncSettings}
            onUpdateSyncSettings={updateSyncSettings}
            onSeekToAyah={seekToAyah}
          />
        )}

        {/* 4. RECITERS DIRECTORY (Over 50 international, African & Nigerian masters) */}
        {activeTab === 'reciters' && (
          <RecitersDirectory
            currentReciter={currentReciter}
            onSelectReciter={handleSelectReciter}
            onOpenTajweedWithReciter={handleOpenTajweedWithReciter}
            isPlaying={isPlaying}
            currentSurahId={currentSurahId}
            onNavigateToRiwayah={(rId) => {
              setTargetRiwayahId(rId || null);
              setActiveTab('riwayah');
            }}
            onSelectSurahAndPlay={(rec, sId) => {
              setCurrentReciter(rec);
              setCurrentSurahId(sId);
              updateLastStopped(sId, 1, rec.id);
              refreshProgress();
              if (!isPlaying) {
                setTimeout(() => togglePlay(), 100);
              }
            }}
            onOpenReaderWithSurah={(rec, sId) => {
              setCurrentReciter(rec);
              setCurrentSurahId(sId);
              updateLastStopped(sId, 1, rec.id);
              refreshProgress();
              setActiveTab('reader');
            }}
          />
        )}

        {/* 5. 20 CANONICAL RIWAYAT */}
        {activeTab === 'riwayah' && (
          <RiwayahSelection
            currentReciter={currentReciter}
            currentSurahId={currentSurahId}
            isPlaying={isPlaying}
            onSelectReciter={handleSelectReciter}
            onSelectSurahAndPlay={(rec, sId) => {
              setCurrentReciter(rec);
              setCurrentSurahId(sId);
              updateLastStopped(sId, 1, rec.id);
              refreshProgress();
              if (!isPlaying) {
                setTimeout(() => togglePlay(), 100);
              }
            }}
            onOpenReaderWithSurah={(rec, sId) => {
              setCurrentReciter(rec);
              setCurrentSurahId(sId);
              updateLastStopped(sId, 1, rec.id);
              refreshProgress();
              setActiveTab('reader');
            }}
            onOpenTajweedWithReciter={handleOpenTajweedWithReciter}
            initialSelectedRiwayahId={targetRiwayahId}
          />
        )}

        {/* 6. ISLAMIC BOOK LIBRARY (Hadith, Adhkar, Aqidah, Seerah, Fiqh, Tajweed) */}
        {activeTab === 'library' && (
          <IslamicLibraryView />
        )}

        {/* 7. PRAYER TIMES */}
        {activeTab === 'prayer_times' && (
          <PrayerTimesView />
        )}

        {/* 7B. WORLDWIDE AUTHENTIC ADHAN VOICES */}
        {activeTab === 'adhan_voices' && (
          <WorldwideAdhanVoices />
        )}

        {/* 8. QIBLA DIRECTION COMPASS */}
        {activeTab === 'qibla' && (
          <QiblaView />
        )}

        {/* 9. HARAMAIN IMAMS LIVE PORTAL */}
        {activeTab === 'haramain' && (
          <HaramainMushafsView
            currentReciter={currentReciter}
            currentSurahId={currentSurahId}
            isPlaying={isPlaying}
            onSelectReciter={handleSelectReciter}
            onSelectSurahAndPlay={(rec, sId) => {
              setCurrentReciter(rec);
              setCurrentSurahId(sId);
              updateLastStopped(sId, 1, rec.id);
              refreshProgress();
              if (!isPlaying) {
                setTimeout(() => togglePlay(), 100);
              }
            }}
            onOpenReaderWithSurah={(rec, sId) => {
              setCurrentReciter(rec);
              setCurrentSurahId(sId);
              updateLastStopped(sId, 1, rec.id);
              refreshProgress();
              setActiveTab('reader');
            }}
            onOpenTajweedWithReciter={handleOpenTajweedWithReciter}
          />
        )}

        {/* 10. AUDIO TRANSLATIONS (12 World Languages) */}
        {activeTab === 'translations' && (
          <AudioTranslationsView />
        )}

        {/* 11. TAJWEED STUDIO (Practice, record and compare) */}
        {activeTab === 'tajweed' && (
          <TajweedStudio
            currentReciter={currentReciter}
            onSelectReciter={handleSelectReciter}
            preselectedTarget={tajweedPreselect}
            onProgressUpdate={refreshProgress}
          />
        )}

        {/* 12. PROGRESS TRACKER */}
        {activeTab === 'progress' && (
          <ProgressTracker
            progress={progress}
            onNavigateToSurah={(surahId) => {
              setCurrentSurahId(surahId);
              setActiveTab('reader');
            }}
            onNavigateToTajweed={() => setActiveTab('tajweed')}
            onRefresh={refreshProgress}
          />
        )}

        {/* 13. DAILY QURAN GOALS & STREAKS */}
        {activeTab === 'goals' && (
          <DailyQuranGoal
            onNavigateToReader={() => setActiveTab('reader')}
            onNavigateToTajweed={() => setActiveTab('tajweed')}
            onGoalCompleted={refreshProgress}
          />
        )}

        {/* 14. SETTINGS & AUTOMATIC IQAMA RECITER */}
        {activeTab === 'settings' && (
          <SettingsView
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onClearProgress={refreshProgress}
          />
        )}

      </main>

      {/* Footer (Desktop & Tablet) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-arabic font-bold text-emerald-800 dark:text-emerald-400 text-sm">نور القرآن</span>
            <span>·</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Nur Al-Quran</span>
            <span>—</span>
            <span>Mobile, Tablet & Desktop Edition</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 flex-wrap justify-center">
            <span>20 Canonical Riwayat</span>
            <span>·</span>
            <span>Traditional Mushaf (604 Pages)</span>
            <span>·</span>
            <span>Islamic Library (6 Sections)</span>
            <span>·</span>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors underline decoration-dotted"
            >
              Report Issue
            </button>
            <span>·</span>
            <button
              onClick={handleOpenAdmin}
              className="text-amber-700 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Docked Compact Audio Player (Docked above bottom nav bar) */}
      <MobileCompactAudioPlayer
        currentReciter={currentReciter}
        currentSurah={currentSurahMeta}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        volume={volume}
        isMuted={isMuted}
        loopMode={loopMode}
        isLoading={isLoading}
        hasError={hasError}
        sameRiwayahAltReciter={sameRiwayahAltReciter}
        onSwitchToSameRiwayahAlt={switchToSameRiwayahAlternative}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onChangeRate={changePlaybackRate}
        onChangeVolume={changeVolume}
        onToggleMute={toggleMute}
        onToggleLoop={setLoopMode}
        onNext={nextSurah}
        onPrev={prevSurah}
        onOpenReader={() => {
          setActiveTab('reader');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMushaf={() => {
          setActiveTab('mushaf');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTajweed={() => {
          setActiveTab('tajweed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReciterSwitcher={() => setIsReciterSwitcherOpen(true)}
        activeAyahNumber={activeAyahNumber}
      />

      {/* Desktop & Tablet Persistent Bottom Audio Player Bar */}
      <AudioPlayerBar
        currentReciter={currentReciter}
        currentSurah={currentSurahMeta}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        volume={volume}
        isMuted={isMuted}
        loopMode={loopMode}
        isLoading={isLoading}
        hasError={hasError}
        sameRiwayahAltReciter={sameRiwayahAltReciter}
        onSwitchToSameRiwayahAlt={switchToSameRiwayahAlternative}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onChangeRate={changePlaybackRate}
        onChangeVolume={changeVolume}
        onToggleMute={toggleMute}
        onToggleLoop={setLoopMode}
        onNext={nextSurah}
        onPrev={prevSurah}
        onOpenReader={() => {
          setActiveTab('reader');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMushaf={() => {
          setActiveTab('mushaf');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTajweed={() => {
          setActiveTab('tajweed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReciterSwitcher={() => setIsReciterSwitcherOpen(true)}
        activeAyahNumber={activeAyahNumber}
      />

      {/* Seamless In-Page Reciter Switcher Drawer (Without leaving page or losing surah) */}
      <ReciterSwitcherDrawer
        isOpen={isReciterSwitcherOpen}
        onClose={() => setIsReciterSwitcherOpen(false)}
        currentReciter={currentReciter}
        currentSurahId={currentSurahId}
        onSelectReciter={(newReciter) => {
          handleSelectReciter(newReciter, true);
        }}
      />

      {/* Global Audio Health Diagnostics Modal */}
      <AudioHealthCheckerModal
        isOpen={isAudioHealthOpen}
        onClose={() => setIsAudioHealthOpen(false)}
        currentReciter={currentReciter}
        onSelectReciter={handleSelectReciter}
        onSelectSurah={(sId) => {
          handleSurahChange(sId);
          setActiveTab('reader');
        }}
      />

      {/* User Feedback & Bug Reporting Modal */}
      <UserFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

    </div>
  );
}

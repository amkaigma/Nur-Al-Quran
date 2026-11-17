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
import {
  attachGlobalAdhanAudioUnlock,
  evaluateScheduledAdhans,
  evaluateSimulatedAdhan,
  getAdhanSettings,
  getSimulatedAdhan,
  playAdhanVoice,
  resolveVoiceIdForPrayer,
  stopAdhanAudio,
  ADHAN_SETTINGS_UPDATED_EVENT,
  ADHAN_SIMULATION_UPDATED_EVENT
} from './services/adhanService';
import {
  calculatePrayerTimes,
  DailyPrayerKey,
  getActiveLocationMeta,
  PRAYER_CONFIG_UPDATED_EVENT
} from './services/prayerTimes';
import { syncNativeAdhanAlarms } from './services/nativeAdhanBridge';
import { Bell, Volume2, X, ShieldCheck, MessageSquare, Play } from 'lucide-react';

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
  const [adhanToast, setAdhanToast] = useState<{
    prayer: string;
    message: string;
    voiceId?: string;
    isFajr?: boolean;
    needsManualPlay?: boolean;
  } | null>(null);

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

  // Unlock audio session on first user gesture + handle notification click wakeup
  useEffect(() => {
    attachGlobalAdhanAudioUnlock();

    const triggerFromNotification = (prayerKey?: string, voiceId?: string) => {
      const validKeys: DailyPrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const key: DailyPrayerKey = validKeys.includes(prayerKey as DailyPrayerKey)
        ? (prayerKey as DailyPrayerKey)
        : 'fajr';
      const settings = getAdhanSettings();
      const resolvedVoice = voiceId || resolveVoiceIdForPrayer(settings, key);
      playAdhanVoice(resolvedVoice, settings.volume, key === 'fajr');
      setAdhanToast({
        prayer: key.toUpperCase(),
        message: `Playing ${key} Adhan from notification alert.`,
        voiceId: resolvedVoice,
        isFajr: key === 'fajr',
        needsManualPlay: false
      });
    };

    const params = new URLSearchParams(window.location.search);
    const notifPrayer = params.get('adhanPrayer');
    if (notifPrayer && params.get('play') === '1') {
      triggerFromNotification(notifPrayer);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const onSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TRIGGER_ADHAN_FROM_NOTIFICATION') {
        triggerFromNotification(event.data.prayerKey, event.data.voiceId);
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', onSwMessage);
      return () => navigator.serviceWorker.removeEventListener('message', onSwMessage);
    }
  }, []);

  // Background Automatic Adhan & Iqama Monitor (timezone-safe & simulation-aware)
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const adhanCallbacks = {
      onAdhanStart: (name: string, voiceId: string, muezzinName: string) => {
        setAdhanToast({
          prayer: name.toUpperCase(),
          message: `Allahu Akbar! Adhan for ${name} prayer is calling (${muezzinName}).`,
          voiceId,
          isFajr: name.toLowerCase() === 'fajr',
          needsManualPlay: false
        });
      },
      onAdhanBlocked: (name: string, voiceId: string, errMessage: string) => {
        setAdhanToast({
          prayer: name.toUpperCase(),
          message: errMessage,
          voiceId,
          isFajr: name.toLowerCase() === 'fajr',
          needsManualPlay: true
        });
      },
      onAdhanError: (name: string, voiceId: string, errMessage: string) => {
        setAdhanToast({
          prayer: name.toUpperCase(),
          message: errMessage,
          voiceId,
          isFajr: name.toLowerCase() === 'fajr',
          needsManualPlay: true
        });
      }
    };

    const syncNativeAlarmsIfPresent = () => {
      const now = new Date();
      const activeLoc = getActiveLocationMeta(now);
      const prayerTimes = calculatePrayerTimes(
        now,
        activeLoc.lat,
        activeLoc.lng,
        activeLoc.timezone,
        activeLoc.method,
        activeLoc.asrJuristic,
        activeLoc.adjustments
      );
      const adhanSettings = getAdhanSettings();
      void syncNativeAlarms(activeLoc, prayerTimes, adhanSettings);
    };

    async function syncNativeAlarms(
      activeLoc: ReturnType<typeof getActiveLocationMeta>,
      prayerTimes: ReturnType<typeof calculatePrayerTimes>,
      adhanSettings: ReturnType<typeof getAdhanSettings>
    ) {
      await syncNativeAdhanAlarms({
        enabled: adhanSettings.enabled,
        enabledPrayers: adhanSettings.enabledPrayers,
        prayerTimes,
        cityName: activeLoc.name,
        muezzinName: adhanSettings.selectedVoice
      });
    }

    const checkPrayerEvents = () => {
      const now = new Date();
      const nowMs = now.getTime();
      const activeLoc = getActiveLocationMeta(now);
      const prayerTimes = calculatePrayerTimes(
        now,
        activeLoc.lat,
        activeLoc.lng,
        activeLoc.timezone,
        activeLoc.method,
        activeLoc.asrJuristic,
        activeLoc.adjustments
      );

      // 1A. Check any scheduled simulation test prayer
      evaluateSimulatedAdhan({ nowMs, callbacks: adhanCallbacks });

      // 1B. Check all 5 daily prayers for Adhan using exact epoch timestamps
      evaluateScheduledAdhans({
        nowMs,
        prayerTimes,
        cityName: activeLoc.name,
        callbacks: adhanCallbacks
      });

      // 2. Check Iqama (congregation announcement after prayer entry)
      const iqamaSettings = getIqamaSettings();
      if (iqamaSettings.enabled) {
        const prayerKeys: DailyPrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        for (const key of prayerKeys) {
          if (!iqamaSettings.enabledPrayers[key]) continue;
          const slot = prayerTimes.schedule[key];
          const delayMinutes = iqamaSettings.prayerDelays[key] ?? 15;
          const iqamaMs = slot.timestampMs + delayMinutes * 60000;
          const deltaMs = nowMs - iqamaMs;
          if (deltaMs >= 0 && deltaMs <= 90_000) {
            const triggered = checkAndTriggerIqama(
              key,
              slot.formatted,
              (name, muezzin) => {
                setIqamaToast({
                  prayer: name.toUpperCase(),
                  message: `Qad qamatis-Salah! Authentic Iqamah for ${name} prayer is now calling (${muezzin}).`
                });
                setTimeout(() => setIqamaToast(null), 12000);
              },
              prayerTimes.dateKey
            );
            if (triggered) break;
          }
        }
      }
    };

    const rescheduleTimer = () => {
      if (intervalId) clearInterval(intervalId);
      const pendingSim = getSimulatedAdhan();
      const tickMs = pendingSim && pendingSim.status === 'pending' ? 2000 : 10000;
      intervalId = setInterval(checkPrayerEvents, tickMs);
    };

    const onConfigOrSettingsChange = () => {
      syncNativeAlarmsIfPresent();
      rescheduleTimer();
      checkPrayerEvents();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkPrayerEvents();
      }
    };

    syncNativeAlarmsIfPresent();
    checkPrayerEvents();
    rescheduleTimer();

    window.addEventListener(PRAYER_CONFIG_UPDATED_EVENT, onConfigOrSettingsChange);
    window.addEventListener(ADHAN_SETTINGS_UPDATED_EVENT, onConfigOrSettingsChange);
    window.addEventListener(ADHAN_SIMULATION_UPDATED_EVENT, onConfigOrSettingsChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener(PRAYER_CONFIG_UPDATED_EVENT, onConfigOrSettingsChange);
      window.removeEventListener(ADHAN_SETTINGS_UPDATED_EVENT, onConfigOrSettingsChange);
      window.removeEventListener(ADHAN_SIMULATION_UPDATED_EVENT, onConfigOrSettingsChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
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

      {/* Adhan Toast Notification (with tap-to-play recovery if browser paused autoplay) */}
      {adhanToast && (
        <aside aria-label="Adhan notifications" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3.5 max-w-lg w-[92vw] sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold shadow-md">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {adhanToast.prayer} Adhan
            </div>
            <div className="text-xs text-white/95 leading-snug">
              {adhanToast.message}
            </div>
            {adhanToast.needsManualPlay && adhanToast.voiceId && (
              <button
                onClick={() => {
                  const s = getAdhanSettings();
                  playAdhanVoice(adhanToast.voiceId!, s.volume, Boolean(adhanToast.isFajr));
                  setAdhanToast((prev) =>
                    prev
                      ? {
                          ...prev,
                          needsManualPlay: false,
                          message: `Playing ${prev.prayer} Adhan now.`
                        }
                      : null
                  );
                }}
                className="mt-2 py-1 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tap to Play Adhan Audio</span>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              stopAdhanAudio();
              setAdhanToast(null);
            }}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-emerald-800 shrink-0"
            aria-label="Stop and dismiss Adhan notification"
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

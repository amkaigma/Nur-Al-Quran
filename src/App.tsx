/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RecitersDirectory } from './components/RecitersDirectory';
import { QuranReader } from './components/QuranReader';
import { TajweedStudio } from './components/TajweedStudio';
import { ProgressTracker } from './components/ProgressTracker';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Reciter, SurahMeta } from './types/quran';
import { RECITERS, getReciterById } from './data/reciters';
import { SURAHS, getSurahById } from './data/surahs';
import { getStoredProgress, updateLastStopped } from './services/storage';
import { useQuranAudio } from './hooks/useQuranAudio';

export default function App() {
  const [progress, setProgress] = useState(() => getStoredProgress());
  const [activeTab, setActiveTab] = useState<'reciters' | 'reader' | 'tajweed' | 'progress'>('reciters');
  
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

  // Quran Audio Player Hook
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    loopMode,
    isLoading,
    togglePlay,
    seek,
    changePlaybackRate,
    changeVolume,
    toggleMute,
    setLoopMode,
    nextSurah,
    prevSurah
  } = useQuranAudio({
    currentReciter,
    currentSurahId,
    onSurahChange: handleSurahChange
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-28">
      
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastStoppedSurah={lastStoppedSurah}
        onResume={handleResumeLastStopped}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {activeTab === 'reciters' && (
          <RecitersDirectory
            currentReciter={currentReciter}
            onSelectReciter={handleSelectReciter}
            onOpenTajweedWithReciter={handleOpenTajweedWithReciter}
            isPlaying={isPlaying}
            currentSurahId={currentSurahId}
          />
        )}

        {activeTab === 'reader' && (
          <QuranReader
            currentSurahId={currentSurahId}
            onSelectSurah={handleSurahChange}
            currentReciter={currentReciter}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            completedSurahIds={progress.completedSurahIds}
            onProgressUpdate={refreshProgress}
            onOpenTajweedTarget={handleOpenTajweedTarget}
          />
        )}

        {activeTab === 'tajweed' && (
          <TajweedStudio
            currentReciter={currentReciter}
            onSelectReciter={handleSelectReciter}
            preselectedTarget={tajweedPreselect}
            onProgressUpdate={refreshProgress}
          />
        )}

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

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-arabic font-bold text-emerald-800 text-sm">نور القرآن</span>
            <span>·</span>
            <span>Nur Al-Quran — Reciters Worldwide & Tajweed Alignment</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>114 Surahs Synchronized</span>
            <span>·</span>
            <span>Hafs, Warsh, Al-Duri</span>
            <span>·</span>
            <span>Tajweed Waveform Studio</span>
          </div>
        </div>
      </footer>

      {/* Global Bottom Audio Player Bar */}
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
        onTogglePlay={togglePlay}
        onSeek={seek}
        onChangeRate={changePlaybackRate}
        onChangeVolume={changeVolume}
        onToggleMute={toggleMute}
        onToggleLoop={setLoopMode}
        onNext={nextSurah}
        onPrev={prevSurah}
        onOpenReader={() => setActiveTab('reader')}
        onOpenTajweed={() => setActiveTab('tajweed')}
      />

    </div>
  );
}

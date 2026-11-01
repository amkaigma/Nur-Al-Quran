import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Compass, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Check, 
  Sliders, 
  Navigation,
  Globe,
  Bell,
  Sparkles,
  Info,
  Calendar,
  Printer,
  ChevronDown,
  X,
  ShieldCheck
} from 'lucide-react';
import { 
  calculatePrayerTimes, 
  calculateQiblaDirection, 
  calculateDistanceToKaabaKm,
  WORLD_CITIES, 
  NIGERIAN_STATES,
  INTERNATIONAL_CITIES,
  CALCULATION_METHODS, 
  CalculationMethodId, 
  CityPreset,
  PrayerTimesResult,
  generateMonthlyPrayerTimes,
  getHijriDateString
} from '../services/prayerTimes';
import {
  getAdhanSettings,
  saveAdhanSettings,
  requestAdhanPermissions,
  playAdhanAudio,
  stopAdhanAudio,
  AdhanSettings,
  ADHAN_VOICE_SOURCES
} from '../services/adhanService';

export const PrayerTimesView: React.FC = () => {
  const [regionTab, setRegionTab] = useState<'nigeria' | 'international'>('nigeria');
  const [selectedCityId, setSelectedCityId] = useState<string>('ng_fct'); // Default Abuja
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Calculation Settings
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethodId>('egyptian');
  const [asrJuristic, setAsrJuristic] = useState<'standard' | 'hanafi'>('standard');
  const [minuteAdjustments, setMinuteAdjustments] = useState({
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  });
  const [hijriOffset, setHijriOffset] = useState<number>(0);

  // View mode: 'daily' | 'monthly' | 'settings'
  const [viewMode, setViewMode] = useState<'daily' | 'monthly' | 'settings'>('daily');

  // Adhan Settings State
  const [adhanSettings, setAdhanSettings] = useState<AdhanSettings>(() => getAdhanSettings());
  const [isPlayingTestAdhan, setIsPlayingTestAdhan] = useState(false);
  const [permissionMsg, setPermissionMsg] = useState<string | null>(null);

  const [now, setNow] = useState<Date>(new Date());

  // Clock interval for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine active coordinates
  const activeLocation = useMemo(() => {
    if (customCoords) {
      return {
        lat: customCoords.lat,
        lng: customCoords.lng,
        name: customCoords.name,
        country: 'Current Location',
        method: calculationMethod,
        timezone: -now.getTimezoneOffset() / 60
      };
    }
    const found = WORLD_CITIES.find(c => c.id === selectedCityId) || NIGERIAN_STATES[0];
    return {
      lat: found.lat,
      lng: found.lng,
      name: found.name,
      country: found.country,
      method: calculationMethod,
      timezone: found.timezone
    };
  }, [customCoords, selectedCityId, calculationMethod, now]);

  // Compute daily prayer times
  const prayerTimes: PrayerTimesResult = useMemo(() => {
    return calculatePrayerTimes(
      now,
      activeLocation.lat,
      activeLocation.lng,
      activeLocation.timezone,
      calculationMethod,
      asrJuristic,
      minuteAdjustments
    );
  }, [now, activeLocation, calculationMethod, asrJuristic, minuteAdjustments]);

  // Generate monthly timetable
  const monthlyTimetable = useMemo(() => {
    return generateMonthlyPrayerTimes(
      now.getFullYear(),
      now.getMonth(),
      activeLocation.lat,
      activeLocation.lng,
      activeLocation.timezone,
      calculationMethod,
      asrJuristic,
      minuteAdjustments
    );
  }, [now, activeLocation, calculationMethod, asrJuristic, minuteAdjustments]);

  // Distance to Kaaba & Qibla direction
  const qiblaHeading = useMemo(() => {
    return Math.round(calculateQiblaDirection(activeLocation.lat, activeLocation.lng));
  }, [activeLocation]);

  const distanceToKaaba = useMemo(() => {
    return calculateDistanceToKaabaKm(activeLocation.lat, activeLocation.lng);
  }, [activeLocation]);

  // Geolocation detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your device or browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCustomCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: 'My GPS Location'
        });
      },
      (err) => {
        setIsLocating(false);
        setLocationError(`Location request failed (${err.message}). Please select your city manually below.`);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleUpdateAdhanSettings = (updates: Partial<AdhanSettings>) => {
    const next = { ...adhanSettings, ...updates };
    setAdhanSettings(next);
    saveAdhanSettings(next);
  };

  const handleRequestPermissions = async () => {
    const { audioAllowed, notificationsAllowed } = await requestAdhanPermissions();
    handleUpdateAdhanSettings({ permissionGranted: audioAllowed || notificationsAllowed });
    if (audioAllowed || notificationsAllowed) {
      setPermissionMsg('✓ Adhan audio & notifications permitted!');
    } else {
      setPermissionMsg('⚠️ Permissions required by your browser for auto-playback.');
    }
    setTimeout(() => setPermissionMsg(null), 3500);
  };

  const handleToggleTestAdhan = () => {
    if (isPlayingTestAdhan) {
      stopAdhanAudio();
      setIsPlayingTestAdhan(false);
    } else {
      setIsPlayingTestAdhan(true);
      playAdhanAudio(adhanSettings.selectedVoice, adhanSettings.volume, () => {
        setIsPlayingTestAdhan(false);
      });
    }
  };

  useEffect(() => {
    return () => {
      stopAdhanAudio();
    };
  }, []);

  const hijriDate = getHijriDateString(now, hijriOffset);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-6">
      
      {/* 1. Header & Location Selector Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {activeLocation.name}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activeLocation.country}
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Worldwide Prayer Times & Adhan</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accurate astronomical calculations with complete Nigerian state coverage and live Adhan.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Detect GPS Location'}</span>
            </button>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'daily'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setViewMode('settings')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'settings'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Location Error alert */}
        {locationError && (
          <div className="mt-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
            {locationError}
          </div>
        )}

        {/* Region & City Selector Controls */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Region Tabs */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 text-xs font-semibold">
            <button
              onClick={() => {
                setRegionTab('nigeria');
                setCustomCoords(null);
                setSelectedCityId('ng_fct');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                regionTab === 'nigeria'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🇳🇬 Nigeria (36 States + FCT)
            </button>
            <button
              onClick={() => {
                setRegionTab('international');
                setCustomCoords(null);
                setSelectedCityId('makkah');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                regionTab === 'international'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🌍 International Cities
            </button>
          </div>

          {/* City Dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedCityId}
              onChange={(e) => {
                setSelectedCityId(e.target.value);
                setCustomCoords(null);
              }}
              className="w-full py-1.5 pl-3 pr-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {regionTab === 'nigeria' ? (
                NIGERIAN_STATES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))
              ) : (
                INTERNATIONAL_CITIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.country})
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. MODE: DAILY PRAYER VIEW */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          
          {/* Next Prayer Feature Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Next Prayer: {prayerTimes.nextPrayer.name}</span>
                <span className="font-arabic">({prayerTimes.nextPrayer.arabicName})</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                {prayerTimes.nextPrayer.time}
              </div>
              <div className="text-xs text-emerald-200 font-mono mt-0.5">
                Countdown: {Math.floor(prayerTimes.nextPrayer.remainingMinutes / 60)}h {prayerTimes.nextPrayer.remainingMinutes % 60}m {prayerTimes.nextPrayer.remainingSeconds}s remaining
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 border border-white/15 text-xs space-y-1 text-emerald-100">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Hijri Date:</span>
                <span className="font-arabic font-bold text-amber-300">{hijriDate}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Qibla Heading:</span>
                <span className="font-bold">{qiblaHeading}° ({distanceToKaaba} km)</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Method:</span>
                <span className="font-semibold text-emerald-200">{CALCULATION_METHODS[calculationMethod].id.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Compact 6-Prayer Grid (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            
            {/* Fajr */}
            <div className={`p-3 rounded-xl border text-center transition-all ${
              prayerTimes.nextPrayer.name === 'Fajr'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Fajr · الفجر
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                {prayerTimes.fajr}
              </div>
              <div className="text-[10px] text-slate-400">Dawn prayer</div>
            </div>

            {/* Sunrise */}
            <div className="p-3 rounded-xl border text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Sunrise · الشروق
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                {prayerTimes.sunrise}
              </div>
              <div className="text-[10px] text-slate-400">Solar zenith start</div>
            </div>

            {/* Dhuhr */}
            <div className={`p-3 rounded-xl border text-center transition-all ${
              prayerTimes.nextPrayer.name === 'Dhuhr'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Dhuhr · الظهر
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                {prayerTimes.dhuhr}
              </div>
              <div className="text-[10px] text-slate-400">Midday prayer</div>
            </div>

            {/* Asr */}
            <div className={`p-3 rounded-xl border text-center transition-all ${
              prayerTimes.nextPrayer.name === 'Asr'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Asr · العصر
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                {prayerTimes.asr}
              </div>
              <div className="text-[10px] text-slate-400">Afternoon prayer</div>
            </div>

            {/* Maghrib */}
            <div className={`p-3 rounded-xl border text-center transition-all ${
              prayerTimes.nextPrayer.name === 'Maghrib'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Maghrib · المغرب
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                {prayerTimes.maghrib}
              </div>
              <div className="text-[10px] text-slate-400">Sunset prayer</div>
            </div>

            {/* Isha */}
            <div className={`p-3 rounded-xl border text-center transition-all ${
              prayerTimes.nextPrayer.name === 'Isha'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Isha · العشاء
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white my-1">
                {prayerTimes.isha}
              </div>
              <div className="text-[10px] text-slate-400">Night prayer</div>
            </div>

          </div>

          {/* Dedicated Adhan & Notification Card (Separate from Iqama) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Adhan Calling System (Entry of Prayer Time)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Announces the start of each of the 5 daily prayers with authentic Muadhin voices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleTestAdhan}
                  className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isPlayingTestAdhan ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingTestAdhan ? 'Stop Adhan' : 'Preview Adhan'}</span>
                </button>

                <button
                  onClick={handleRequestPermissions}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {permissionMsg && (
              <div className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg">
                {permissionMsg}
              </div>
            )}

            {/* Adhan Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Selected Muadhin Voice:
                </label>
                <select
                  value={adhanSettings.selectedVoice}
                  onChange={(e) => handleUpdateAdhanSettings({ selectedVoice: e.target.value as any })}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  {Object.entries(ADHAN_VOICE_SOURCES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Adhan Notification Mode:
                </label>
                <select
                  value={adhanSettings.mode}
                  onChange={(e) => handleUpdateAdhanSettings({ mode: e.target.value as any })}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  <option value="adhan_and_notification">Adhan Audio + System Notification</option>
                  <option value="notification_only">System Notification Only</option>
                  <option value="silent">Silent Reminder</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Adhan Volume ({Math.round(adhanSettings.volume * 100)}%):
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={adhanSettings.volume}
                  onChange={(e) => handleUpdateAdhanSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2"
                />
              </div>
            </div>

            {/* Individual Prayer Toggles */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Enable Adhan for:
              </span>
              {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                <label key={p} className="flex items-center gap-1.5 cursor-pointer capitalize font-semibold">
                  <input
                    type="checkbox"
                    checked={adhanSettings.enabledPrayers[p]}
                    onChange={(e) => {
                      handleUpdateAdhanSettings({
                        enabledPrayers: {
                          ...adhanSettings.enabledPrayers,
                          [p]: e.target.checked
                        }
                      });
                    }}
                    className="accent-emerald-600 w-3.5 h-3.5 rounded"
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. MODE: MONTHLY PRAYER TIMETABLE */}
      {viewMode === 'monthly' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Monthly Prayer Timetable ({now.toLocaleString('default', { month: 'long', year: 'numeric' })})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated for {activeLocation.name}, {activeLocation.country}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="py-1 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Timetable</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Hijri</th>
                  <th className="py-2 px-3">Fajr</th>
                  <th className="py-2 px-3">Sunrise</th>
                  <th className="py-2 px-3">Dhuhr</th>
                  <th className="py-2 px-3">Asr</th>
                  <th className="py-2 px-3">Maghrib</th>
                  <th className="py-2 px-3">Isha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {monthlyTimetable.map((row) => {
                  const isToday = row.day === now.getDate();
                  return (
                    <tr 
                      key={row.day} 
                      className={isToday ? 'bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-900 dark:text-emerald-200' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'}
                    >
                      <td className="py-1.5 px-3 whitespace-nowrap">{row.dateString}</td>
                      <td className="py-1.5 px-3 font-arabic text-[11px] whitespace-nowrap">{row.hijriString}</td>
                      <td className="py-1.5 px-3 font-mono">{row.fajr}</td>
                      <td className="py-1.5 px-3 font-mono text-slate-400">{row.sunrise}</td>
                      <td className="py-1.5 px-3 font-mono">{row.dhuhr}</td>
                      <td className="py-1.5 px-3 font-mono">{row.asr}</td>
                      <td className="py-1.5 px-3 font-mono">{row.maghrib}</td>
                      <td className="py-1.5 px-3 font-mono">{row.isha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODE: CALCULATION SETTINGS */}
      {viewMode === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Prayer Calculation & Community Conventions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize calculation methods, jurisprudence, manual minute offsets, and Hijri moon sighting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Calculation Method */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Calculation Authority:
              </label>
              <select
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(e.target.value as CalculationMethodId)}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                {Object.entries(CALCULATION_METHODS).map(([k, m]) => (
                  <option key={k} value={k}>
                    {m.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Egyptian General Authority is the standard recognized standard throughout Nigeria and West Africa.
              </p>
            </div>

            {/* Asr Juristic Method */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Asr School of Jurisprudence:
              </label>
              <select
                value={asrJuristic}
                onChange={(e) => setAsrJuristic(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                <option value="standard">Standard (Shafi'i, Maliki, Hanbali — Shadow Ratio 1:1)</option>
                <option value="hanafi">Hanafi (Shadow Ratio 2:1)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Standard Maliki/Shafi'i/Hanbali is predominantly practiced across Nigeria.
              </p>
            </div>

            {/* Hijri Adjustment */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Hijri Calendar Moon Adjustment:
              </label>
              <select
                value={hijriOffset}
                onChange={(e) => setHijriOffset(parseInt(e.target.value, 10))}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                <option value="-2">-2 Days (Moon sighting delay)</option>
                <option value="-1">-1 Day</option>
                <option value="0">Standard (0 Days / Umm Al-Qura)</option>
                <option value="1">+1 Day</option>
                <option value="2">+2 Days</option>
              </select>
            </div>

          </div>

          {/* Manual Minute Adjustments */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Manual Minute Adjustments (+/- Minutes for Local Mosque Calibration):
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                <div key={p} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    {p}
                  </span>
                  <input
                    type="number"
                    min={-60}
                    max={60}
                    value={minuteAdjustments[p]}
                    onChange={(e) => {
                      setMinuteAdjustments({
                        ...minuteAdjustments,
                        [p]: parseInt(e.target.value, 10) || 0
                      });
                    }}
                    className="w-full p-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-mono font-bold text-center"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

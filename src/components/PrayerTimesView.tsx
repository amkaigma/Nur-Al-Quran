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
  Info
} from 'lucide-react';
import { 
  calculatePrayerTimes, 
  calculateQiblaDirection, 
  calculateDistanceToKaabaKm,
  WORLD_CITIES, 
  CALCULATION_METHODS, 
  CalculationMethodId, 
  CityPreset,
  ADHAN_AUDIO_URLS,
  PrayerTimesResult
} from '../services/prayerTimes';

export const PrayerTimesView: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('makkah');
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethodId>('umm_al_qura');
  const [asrJuristic, setAsrJuristic] = useState<'standard' | 'hanafi'>('standard');
  const [now, setNow] = useState<Date>(new Date());
  
  // Adhan Audio State
  const [activeAdhan, setActiveAdhan] = useState<'makkah' | 'madinah' | null>(null);
  const [adhanAudio, setAdhanAudio] = useState<HTMLAudioElement | null>(null);

  // Update clock every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine current active coordinates
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
    const found = WORLD_CITIES.find(c => c.id === selectedCityId) || WORLD_CITIES[0];
    return {
      lat: found.lat,
      lng: found.lng,
      name: found.name,
      country: found.country,
      method: calculationMethod,
      timezone: found.timezone
    };
  }, [customCoords, selectedCityId, calculationMethod, now]);

  // Compute prayer times
  const prayerTimes: PrayerTimesResult = useMemo(() => {
    return calculatePrayerTimes(
      now,
      activeLocation.lat,
      activeLocation.lng,
      activeLocation.timezone,
      calculationMethod,
      asrJuristic
    );
  }, [now, activeLocation, calculationMethod, asrJuristic]);

  // Compute Qibla
  const qiblaHeading = useMemo(() => {
    return Math.round(calculateQiblaDirection(activeLocation.lat, activeLocation.lng));
  }, [activeLocation]);

  const distanceToKaaba = useMemo(() => {
    return calculateDistanceToKaabaKm(activeLocation.lat, activeLocation.lng);
  }, [activeLocation]);

  // Handle browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
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
        setLocationError(`Location request failed: ${err.message}. Please pick a city from the list.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Adhan playback
  const handleToggleAdhan = (type: 'makkah' | 'madinah') => {
    if (activeAdhan === type && adhanAudio) {
      adhanAudio.pause();
      setActiveAdhan(null);
      setAdhanAudio(null);
      return;
    }

    if (adhanAudio) {
      adhanAudio.pause();
    }

    const audio = new Audio(ADHAN_AUDIO_URLS[type]);
    audio.play().then(() => {
      setActiveAdhan(type);
      setAdhanAudio(audio);
    }).catch(err => {
      console.warn('Adhan playback error, using fallback:', err);
      const fallbackAudio = new Audio(ADHAN_AUDIO_URLS.alafasy);
      fallbackAudio.play().then(() => {
        setActiveAdhan(type);
        setAdhanAudio(fallbackAudio);
      }).catch(() => setActiveAdhan(null));
    });

    audio.onended = () => {
      setActiveAdhan(null);
      setAdhanAudio(null);
    };
  };

  useEffect(() => {
    return () => {
      if (adhanAudio) {
        adhanAudio.pause();
      }
    };
  }, [adhanAudio]);

  const prayerCards = [
    { name: 'Fajr', arabic: 'الفجر', time: prayerTimes.fajr, icon: Moon, description: 'Dawn to sunrise' },
    { name: 'Sunrise', arabic: 'الشروق', time: prayerTimes.sunrise, icon: Sunrise, description: 'Sun appearance (Ishraq)' },
    { name: 'Dhuhr', arabic: 'الظهر', time: prayerTimes.dhuhr, icon: Sun, description: 'Post-meridian midday' },
    { name: 'Asr', arabic: 'العصر', time: prayerTimes.asr, icon: Sun, description: 'Late afternoon' },
    { name: 'Maghrib', arabic: 'المغرب', time: prayerTimes.maghrib, icon: Sunset, description: 'Just after sunset' },
    { name: 'Isha', arabic: 'العشاء', time: prayerTimes.isha, icon: Moon, description: 'Night prayer' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-emerald-800/40 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-amber-300 mb-2 font-medium">
            <span>Astronomical Prayer Times & Qibla Compass</span>
            <span aria-hidden="true">·</span>
            <span>Umm Al-Qura & International Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Islamic Prayer Times (أوقات الصلاة واتجاه القبلة)
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Accurate daily Salah schedules calculated from solar coordinates for any location worldwide. Monitor the real-time countdown to the next prayer, discover the precise Qibla heading toward the Ka'bah, and listen to the Adhan from Makkah and Madinah.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeLocation.name}, {activeLocation.country}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50 backdrop-blur-sm">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Qibla: {qiblaHeading}° ({distanceToKaaba.toLocaleString()} km to Makkah)</span>
            </span>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-emerald-900/30 font-arabic text-8xl select-none pointer-events-none hidden sm:block">
          صَلَاة
        </div>
      </div>

      {/* Countdown Card & Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Next Prayer Countdown Widget */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Next Prayer: <span className="text-emerald-700 dark:text-emerald-400">{prayerTimes.nextPrayer.name}</span>
                </h2>
                <span className="font-arabic text-lg text-emerald-800 dark:text-emerald-300 ml-1">
                  ({prayerTimes.nextPrayer.arabicName})
                </span>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                At {prayerTimes.nextPrayer.time}
              </span>
            </div>

            {/* Countdown Numbers */}
            <div className="text-center py-6 sm:py-8 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40 mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Time Remaining Until {prayerTimes.nextPrayer.name}
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-900 dark:text-emerald-100 tracking-tight font-mono">
                {Math.floor(prayerTimes.nextPrayer.remainingMinutes / 60).toString().padStart(2, '0')}:
                {(prayerTimes.nextPrayer.remainingMinutes % 60).toString().padStart(2, '0')}:
                {prayerTimes.nextPrayer.remainingSeconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Hours : Minutes : Seconds
              </div>
            </div>
          </div>

          {/* Adhan Audio Previews */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Adhan Call to Prayer:</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleAdhan('makkah')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  activeAdhan === 'makkah'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {activeAdhan === 'makkah' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>Makkah Adhan</span>
              </button>

              <button
                onClick={() => handleToggleAdhan('madinah')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  activeAdhan === 'madinah'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {activeAdhan === 'madinah' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>Madinah Adhan</span>
              </button>
            </div>
          </div>

        </div>

        {/* Qibla Direction Compass Widget */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Qibla Direction (القبلة)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {qiblaHeading}° from North
              </span>
            </div>

            {/* Visual Compass Needle */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto my-2 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center bg-radial from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-inner">
              
              {/* Compass Cardinal Points */}
              <span className="absolute top-1 text-[11px] font-bold text-slate-400">N</span>
              <span className="absolute right-2 text-[11px] font-bold text-slate-400">E</span>
              <span className="absolute bottom-1 text-[11px] font-bold text-slate-400">S</span>
              <span className="absolute left-2 text-[11px] font-bold text-slate-400">W</span>

              {/* Ka'bah Indicator Needle */}
              <div 
                className="absolute w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${qiblaHeading}deg)` }}
              >
                <div className="relative w-1 h-32 flex flex-col items-center justify-between">
                  {/* North pointer pointing to Ka'bah */}
                  <div className="w-0 h-0 border-x-6 border-x-transparent border-b-16 border-b-emerald-600 dark:border-b-emerald-400 filter drop-shadow-sm flex items-center justify-center">
                    <span className="absolute -top-6 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                      🕋 Ka'bah
                    </span>
                  </div>
                  {/* Tail pointer */}
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-12 border-t-slate-300 dark:border-t-slate-600"></div>
                </div>
              </div>

              {/* Center Pivot */}
              <div className="w-4 h-4 rounded-full bg-emerald-700 border-2 border-white dark:border-slate-900 z-10 shadow-xs"></div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Direct Distance to Ka'bah: </span>
            <strong className="text-slate-900 dark:text-white font-semibold">{distanceToKaaba.toLocaleString()} km</strong>
          </div>
        </div>

      </div>

      {/* Daily 6 Times Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {prayerCards.map((p) => {
          const isNext = prayerTimes.nextPrayer.name === p.name;
          const Icon = p.icon;

          return (
            <div
              key={p.name}
              className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isNext 
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30' 
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isNext ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span className={`font-arabic text-sm ${isNext ? 'text-amber-200' : 'text-slate-400'}`} dir="rtl">
                    {p.arabic}
                  </span>
                </div>

                <div className={`text-xs font-semibold ${isNext ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {p.name}
                </div>

                <div className={`text-lg sm:text-xl font-bold mt-1 tracking-tight ${isNext ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {p.time}
                </div>
              </div>

              <div className={`text-[10px] mt-3 pt-2 border-t ${
                isNext 
                  ? 'border-emerald-600/70 text-emerald-100' 
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}>
                {p.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Location & Calculation Settings Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Location & Calculation Method Preferences</h3>
          </div>
          <span className="text-xs text-slate-500">Stored locally in browser</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* City Preset Selector */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Select City / Region:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={customCoords ? 'custom' : selectedCityId}
                onChange={(e) => {
                  if (e.target.value === 'custom') return;
                  setCustomCoords(null);
                  setSelectedCityId(e.target.value);
                  const city = WORLD_CITIES.find(c => c.id === e.target.value);
                  if (city) {
                    setCalculationMethod(city.method);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {customCoords && <option value="custom">📍 GPS Detected Location</option>}
                <optgroup label="Nigeria (West Africa)">
                  {WORLD_CITIES.filter(c => c.countryCode === 'NG').map(c => (
                    <option key={c.id} value={c.id}>🇳🇬 {c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="The Holy Sanctuaries & Middle East">
                  {WORLD_CITIES.filter(c => ['SA', 'PS', 'EG', 'TR', 'AE'].includes(c.countryCode)).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                  ))}
                </optgroup>
                <optgroup label="International & Diaspora">
                  {WORLD_CITIES.filter(c => !['NG', 'SA', 'PS', 'EG', 'TR', 'AE'].includes(c.countryCode)).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                  ))}
                </optgroup>
              </select>

              <button
                onClick={handleDetectLocation}
                disabled={isLocating}
                title="Detect my current location via GPS"
                className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 shrink-0 transition-colors"
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {locationError && (
              <p className="text-[11px] text-rose-500 mt-1">{locationError}</p>
            )}
          </div>

          {/* Calculation Convention */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Calculation Convention:
            </label>
            <select
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value as CalculationMethodId)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {Object.values(CALCULATION_METHODS).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Juristic Method */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Asr Juristic Method:
            </label>
            <select
              value={asrJuristic}
              onChange={(e) => setAsrJuristic(e.target.value as 'standard' | 'hanafi')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="standard">Standard (Shafi'i, Maliki, Hanbali — Shadow Factor 1x)</option>
              <option value="hanafi">Hanafi (Shadow Factor 2x)</option>
            </select>
          </div>

        </div>
      </div>

    </div>
  );
};

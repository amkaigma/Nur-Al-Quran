import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  Info, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowUp,
  Radio
} from 'lucide-react';
import { 
  calculateQiblaDirection, 
  calculateDistanceToKaabaKm,
  WORLD_CITIES,
  CityPreset,
  KAABA_LAT,
  KAABA_LNG
} from '../services/prayerTimes';

export const QiblaView: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('makkah');
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Phone compass sensor heading
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [sensorSupported, setSensorSupported] = useState<boolean>(false);
  const [sensorPermissionRequested, setSensorPermissionRequested] = useState<boolean>(false);

  // Active location coordinates
  const activeLocation = useMemo(() => {
    if (customCoords) {
      return {
        lat: customCoords.lat,
        lng: customCoords.lng,
        name: customCoords.name,
        country: 'Current GPS Location'
      };
    }
    const found = WORLD_CITIES.find(c => c.id === selectedCityId) || WORLD_CITIES[0];
    return {
      lat: found.lat,
      lng: found.lng,
      name: found.name,
      country: found.country
    };
  }, [customCoords, selectedCityId]);

  // Qibla calculation
  const qiblaBearing = useMemo(() => {
    return Math.round(calculateQiblaDirection(activeLocation.lat, activeLocation.lng));
  }, [activeLocation]);

  const distanceKm = useMemo(() => {
    return calculateDistanceToKaabaKm(activeLocation.lat, activeLocation.lng);
  }, [activeLocation]);

  const distanceMiles = useMemo(() => {
    return Math.round(distanceKm * 0.621371);
  }, [distanceKm]);

  // Handle GPS detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported on this browser.');
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
        setLocationError(`Location detection failed: ${err.message}. Choose a city preset.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Device orientation compass support
  const requestCompassPermission = () => {
    setSensorPermissionRequested(true);
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === 'function') {
      (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
        .then((resp) => {
          if (resp === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.warn);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    // webkitCompassHeading for iOS, alpha for Android
    let heading: number | null = null;
    const anyEvent = e as unknown as { webkitCompassHeading?: number };
    if (typeof anyEvent.webkitCompassHeading !== 'undefined') {
      heading = anyEvent.webkitCompassHeading;
    } else if (e.alpha !== null) {
      heading = 360 - e.alpha;
    }

    if (heading !== null) {
      setCompassHeading(Math.round(heading));
      setSensorSupported(true);
    }
  };

  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Needle angle relative to current phone heading or static north
  const relativeNeedleRotation = compassHeading !== null 
    ? (qiblaBearing - compassHeading + 360) % 360 
    : qiblaBearing;

  const isAlignedWithQibla = compassHeading !== null && Math.abs(relativeNeedleRotation) < 5;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Qibla Direction</span>
              <span className="font-arabic text-emerald-700 dark:text-emerald-400 text-lg">
                (اتجاه القبلة)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              High-precision astronomical calculation of the Great Circle bearing towards the Holy Ka'bah in Makkah
            </p>
          </div>
        </div>

        {/* Location selector */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
          </button>

          <select
            value={customCoords ? 'custom' : selectedCityId}
            onChange={(e) => {
              if (e.target.value !== 'custom') {
                setSelectedCityId(e.target.value);
                setCustomCoords(null);
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {customCoords && <option value="custom">📍 My GPS Coordinates</option>}
            {WORLD_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.countryCode === 'NG' ? '🇳🇬 ' : ''}{c.name}, {c.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {locationError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300">
          {locationError}
        </div>
      )}

      {/* Main Qibla Compass Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Compass Visualizer (Center Left) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Compass Alignment Badge */}
          <div className="mb-4">
            {isAlignedWithQibla ? (
              <div className="px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md animate-pulse">
                <Check className="w-4 h-4" />
                <span>Aligned with the Ka'bah!</span>
              </div>
            ) : (
              <div className="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bearing: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{qiblaBearing}°</strong> from True North</span>
              </div>
            )}
          </div>

          {/* Dial Graphic */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 shadow-inner flex items-center justify-center">
            
            {/* North Indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="font-extrabold text-sm text-red-600 tracking-wider">N</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-0.5" />
            </div>

            {/* East Indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              E
            </div>

            {/* South Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">
              S
            </div>

            {/* West Indicator */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              W
            </div>

            {/* Degree Ticks */}
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 dark:border-slate-700/60 pointer-events-none" />

            {/* Center Dial Hub */}
            <div className="w-14 h-14 rounded-full bg-emerald-800 text-amber-300 shadow-lg z-20 flex items-center justify-center font-bold text-xs font-arabic border-2 border-amber-400">
              الكعبة
            </div>

            {/* Rotating Qibla Pointer Needle */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out z-10 pointer-events-none"
              style={{ transform: `rotate(${relativeNeedleRotation}deg)` }}
            >
              {/* Pointer Arrow */}
              <div className="relative w-full h-full flex flex-col items-center justify-start">
                
                {/* Ka'bah Icon at top of needle */}
                <div className="absolute top-8 flex flex-col items-center animate-bounce">
                  <div className="w-7 h-7 rounded-md bg-stone-900 border-2 border-amber-400 flex items-center justify-center shadow-lg">
                    <span className="text-[10px] text-amber-300 font-bold">🕋</span>
                  </div>
                  <div className="w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-amber-400 mt-0.5" />
                </div>

                {/* Needle Spine */}
                <div className="w-1 h-36 bg-gradient-to-t from-emerald-600 via-amber-400 to-amber-500 rounded-full shadow" />
              </div>
            </div>

          </div>

          {/* Sensor button for mobile compass calibration */}
          {!sensorSupported && !sensorPermissionRequested && (
            <button
              onClick={requestCompassPermission}
              className="mt-6 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              Enable Live Phone Compass Sensor
            </button>
          )}

          {sensorSupported && (
            <p className="mt-4 text-[11px] text-slate-400 text-center">
              🧭 Real-time device sensor active ({compassHeading}° phone heading)
            </p>
          )}

        </div>

        {/* Details & Information (Center Right) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card: Bearing & Distance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Calculation Parameters
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Qibla Bearing</span>
                <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  {qiblaBearing}°
                </div>
                <span className="text-[10px] text-slate-500">Clockwise from North</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Distance to Ka'bah</span>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {distanceKm.toLocaleString()} km
                </div>
                <span className="text-[10px] text-slate-500">{distanceMiles.toLocaleString()} miles</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Target:</span>
                <span className="font-semibold">Ka'bah Al-Musharrafah, Makkah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ka'bah Coordinates:</span>
                <span className="font-mono text-[11px]">21.4225° N, 39.8262° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Origin:</span>
                <span className="font-semibold truncate max-w-[170px]">{activeLocation.name}</span>
              </div>
            </div>
          </div>

          {/* How to Align Prayer Mat */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-md border border-emerald-900 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>How to Align for Salah</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Place your phone flat on the floor away from large metallic objects or electronic chargers. Turn until the Ka'bah icon aligns with the top arrow, and position your prayer mat facing this direction.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

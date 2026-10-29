/**
 * High-precision mathematical astronomical calculation of Islamic Prayer Times and Qibla Direction
 * Based on solar coordinates, equation of time, and standard international conventions.
 */

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: {
    name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
    time: string;
    arabicName: string;
    remainingMinutes: number;
    remainingSeconds: number;
  };
}

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
  method: CalculationMethodId;
}

export type CalculationMethodId = 'umm_al_qura' | 'mwl' | 'egyptian' | 'isna' | 'karachi';

export interface CalculationMethodMeta {
  id: CalculationMethodId;
  name: string;
  fajrAngle: number;
  ishaAngle: number; // or fixed minutes in Umm Al-Qura
  isIshaFixedMinutes?: boolean;
  ishaMinutesAfterMaghrib?: number;
}

export const CALCULATION_METHODS: Record<CalculationMethodId, CalculationMethodMeta> = {
  umm_al_qura: {
    id: 'umm_al_qura',
    name: 'Umm Al-Qura University, Makkah',
    fajrAngle: 18.5,
    ishaAngle: 0,
    isIshaFixedMinutes: true,
    ishaMinutesAfterMaghrib: 90 // 90 min (120 in Ramadan)
  },
  mwl: {
    id: 'mwl',
    name: 'Muslim World League (MWL)',
    fajrAngle: 18,
    ishaAngle: 17
  },
  egyptian: {
    id: 'egyptian',
    name: 'Egyptian General Authority of Survey (Africa / North Africa)',
    fajrAngle: 19.5,
    ishaAngle: 17.5
  },
  isna: {
    id: 'isna',
    name: 'Islamic Society of North America (ISNA)',
    fajrAngle: 15,
    ishaAngle: 15
  },
  karachi: {
    id: 'karachi',
    name: 'University of Islamic Sciences, Karachi',
    fajrAngle: 18,
    ishaAngle: 18
  }
};

export const WORLD_CITIES: CityPreset[] = [
  { id: 'makkah', name: 'Makkah Al-Mukarramah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.4225, lng: 39.8262, timezone: 3, method: 'umm_al_qura' },
  { id: 'madinah', name: 'Al-Madinah Al-Munawwarah', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.4672, lng: 39.6111, timezone: 3, method: 'umm_al_qura' },
  { id: 'jerusalem', name: 'Al-Quds (Jerusalem)', country: 'Palestine', countryCode: 'PS', lat: 31.7683, lng: 35.2137, timezone: 3, method: 'mwl' },
  { id: 'kano', name: 'Kano', country: 'Nigeria', countryCode: 'NG', lat: 12.0022, lng: 8.5920, timezone: 1, method: 'egyptian' },
  { id: 'abuja', name: 'Abuja', country: 'Nigeria', countryCode: 'NG', lat: 9.0765, lng: 7.3986, timezone: 1, method: 'egyptian' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', countryCode: 'NG', lat: 6.5244, lng: 3.3792, timezone: 1, method: 'egyptian' },
  { id: 'sokoto', name: 'Sokoto', country: 'Nigeria', countryCode: 'NG', lat: 13.0609, lng: 5.2339, timezone: 1, method: 'egyptian' },
  { id: 'maiduguri', name: 'Maiduguri', country: 'Nigeria', countryCode: 'NG', lat: 11.8333, lng: 13.1500, timezone: 1, method: 'egyptian' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, timezone: 2, method: 'egyptian' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 41.0082, lng: 28.9784, timezone: 3, method: 'mwl' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lng: 55.2708, timezone: 4, method: 'umm_al_qura' },
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, timezone: 0, method: 'mwl' },
  { id: 'new_york', name: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060, timezone: -4, method: 'isna' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, timezone: 2, method: 'mwl' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', lat: -6.2088, lng: 106.8456, timezone: 7, method: 'mwl' },
  { id: 'kuala_lumpur', name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', lat: 3.1390, lng: 101.6869, timezone: 8, method: 'mwl' }
];

// Ka'bah location in Makkah
export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

export const ADHAN_AUDIO_URLS = {
  makkah: 'https://cdn.islamic.network/audio/adhan/makkah.mp3',
  madinah: 'https://cdn.islamic.network/audio/adhan/madinah.mp3',
  alafasy: 'https://server8.mp3quran.net/afs/001.mp3' // high availability fallback
};

// Math helpers in degrees
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(x));
const acosD = (x: number) => r2d(Math.acos(x));
const atan2D = (y: number, x: number) => r2d(Math.atan2(y, x));

/**
 * Calculates Qibla direction in degrees clockwise from True North (0° = North, 90° = East).
 */
export function calculateQiblaDirection(lat: number, lng: number): number {
  const phiK = d2r(KAABA_LAT);
  const lambdaK = d2r(KAABA_LNG);
  const phi = d2r(lat);
  const lambda = d2r(lng);

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
  let qibla = r2d(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

/**
 * Calculates Great Circle distance to Ka'bah in kilometers.
 */
export function calculateDistanceToKaabaKm(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = d2r(KAABA_LAT - lat);
  const dLng = d2r(KAABA_LNG - lng);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(d2r(lat)) * Math.cos(d2r(KAABA_LAT)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates astronomical prayer times for a given date, coordinates, and method.
 */
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezoneOffsetHours?: number,
  methodId: CalculationMethodId = 'umm_al_qura',
  asrJuristic: 'standard' | 'hanafi' = 'standard'
): PrayerTimesResult {
  const method = CALCULATION_METHODS[methodId] || CALCULATION_METHODS.umm_al_qura;
  
  // If timezoneOffset not provided, derive from date
  const tz = timezoneOffsetHours !== undefined ? timezoneOffsetHours : -date.getTimezoneOffset() / 60;

  // Day of year calculation
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Fractional year in radians
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (12 - tz) / 24);

  // Equation of time in minutes
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination in degrees
  const decl = r2d(
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma)
  );

  // Solar noon in hours (Dhuhr)
  const solarNoonMinutes = 720 - (4 * lng) - eqtime + (tz * 60);
  const dhuhrHours = (solarNoonMinutes + 2) / 60; // 2 min buffer past zenith

  // Hour angle helper for a given altitude angle (alpha)
  const getHourAngleHours = (alpha: number): number => {
    const cosHA = (sinD(alpha) - sinD(lat) * sinD(decl)) / (cosD(lat) * cosD(decl));
    if (cosHA > 1) return 0; // sun never rises that high
    if (cosHA < -1) return 12; // sun never sets that low
    return acosD(cosHA) / 15.0;
  };

  // Sunrise and Sunset (approx -0.833° altitude for refraction & disc radius)
  const sunAltitude = -0.833;
  const sunRiseSetHA = getHourAngleHours(sunAltitude);
  const sunriseHours = dhuhrHours - sunRiseSetHA;
  const maghribHours = dhuhrHours + sunRiseSetHA;

  // Fajr: based on method.fajrAngle below horizon (-fajrAngle)
  const fajrHA = getHourAngleHours(-method.fajrAngle);
  const fajrHours = dhuhrHours - fajrHA;

  // Asr: shadow length factor = 1 (standard) or 2 (Hanafi)
  const shadowFactor = asrJuristic === 'hanafi' ? 2 : 1;
  const asrAltitude = acosD(sinD(atan2D(1, shadowFactor + Math.tan(d2r(Math.abs(lat - decl))))));
  const asrHA = getHourAngleHours(90 - asrAltitude);
  const asrHours = dhuhrHours + asrHA;

  // Isha
  let ishaHours: number;
  if (method.isIshaFixedMinutes) {
    ishaHours = maghribHours + (method.ishaMinutesAfterMaghrib || 90) / 60;
  } else {
    const ishaHA = getHourAngleHours(-method.ishaAngle);
    ishaHours = dhuhrHours + ishaHA;
  }

  const formatTime = (hours: number): string => {
    let h = (hours % 24 + 24) % 24;
    const hour = Math.floor(h);
    const minute = Math.floor((h - hour) * 60);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const toMinutes = (hours: number): number => {
    let h = (hours % 24 + 24) % 24;
    return Math.floor(h * 60);
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  const prayers = [
    { name: 'Fajr' as const, arabicName: 'الفجر', minutes: toMinutes(fajrHours), formatted: formatTime(fajrHours) },
    { name: 'Sunrise' as const, arabicName: 'الشروق', minutes: toMinutes(sunriseHours), formatted: formatTime(sunriseHours) },
    { name: 'Dhuhr' as const, arabicName: 'الظهر', minutes: toMinutes(dhuhrHours), formatted: formatTime(dhuhrHours) },
    { name: 'Asr' as const, arabicName: 'العصر', minutes: toMinutes(asrHours), formatted: formatTime(asrHours) },
    { name: 'Maghrib' as const, arabicName: 'المغرب', minutes: toMinutes(maghribHours), formatted: formatTime(maghribHours) },
    { name: 'Isha' as const, arabicName: 'العشاء', minutes: toMinutes(ishaHours), formatted: formatTime(ishaHours) }
  ];

  let next = prayers.find(p => p.minutes > currentMinutes);
  let remainingMinutes = 0;
  let remainingSeconds = 60 - currentSeconds;

  if (next) {
    remainingMinutes = next.minutes - currentMinutes - 1;
  } else {
    // Tomorrow Fajr
    next = prayers[0];
    remainingMinutes = (24 * 60 - currentMinutes) + prayers[0].minutes - 1;
  }

  return {
    fajr: formatTime(fajrHours),
    sunrise: formatTime(sunriseHours),
    dhuhr: formatTime(dhuhrHours),
    asr: formatTime(asrHours),
    maghrib: formatTime(maghribHours),
    isha: formatTime(ishaHours),
    nextPrayer: {
      name: next.name,
      arabicName: next.arabicName,
      time: next.formatted,
      remainingMinutes: Math.max(0, remainingMinutes),
      remainingSeconds: Math.max(0, remainingSeconds)
    }
  };
}

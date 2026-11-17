/**
 * High-precision mathematical astronomical calculation of Islamic Prayer Times and Qibla Direction
 * Based on solar coordinates, equation of time, and standard international conventions.
 * Features complete coverage for all 36 Nigerian States + FCT, and global cities.
 */

export type DailyPrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface ScheduledPrayerSlot {
  formatted: string;
  time24: string;
  hour24: number;
  minute: number;
  minutesFromMidnight: number;
  timestampMs: number;
}

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  dateKey: string;
  timezoneOffsetHours: number;
  schedule: {
    fajr: ScheduledPrayerSlot;
    sunrise: ScheduledPrayerSlot;
    dhuhr: ScheduledPrayerSlot;
    asr: ScheduledPrayerSlot;
    maghrib: ScheduledPrayerSlot;
    isha: ScheduledPrayerSlot;
  };
  nextPrayer: {
    name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
    time: string;
    arabicName: string;
    remainingMinutes: number;
    remainingSeconds: number;
    timestampMs: number;
  };
}

export interface PrayerLocationConfig {
  regionTab: 'nigeria' | 'international';
  selectedCityId: string;
  customCoords: { lat: number; lng: number; name: string } | null;
  calculationMethod: CalculationMethodId;
  asrJuristic: 'standard' | 'hanafi';
  minuteAdjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  hijriOffset: number;
}

export interface CityPreset {
  id: string;
  name: string;
  state?: string;
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
  ishaAngle: number;
  isIshaFixedMinutes?: boolean;
  ishaMinutesAfterMaghrib?: number;
}

export const CALCULATION_METHODS: Record<CalculationMethodId, CalculationMethodMeta> = {
  egyptian: {
    id: 'egyptian',
    name: 'Egyptian General Authority of Survey (Africa & Nigeria Standard)',
    fajrAngle: 19.5,
    ishaAngle: 17.5
  },
  umm_al_qura: {
    id: 'umm_al_qura',
    name: 'Umm Al-Qura University, Makkah',
    fajrAngle: 18.5,
    ishaAngle: 0,
    isIshaFixedMinutes: true,
    ishaMinutesAfterMaghrib: 90
  },
  mwl: {
    id: 'mwl',
    name: 'Muslim World League (MWL)',
    fajrAngle: 18,
    ishaAngle: 17
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

/**
 * Complete geographical coverage for Nigeria: ALL 36 States + FCT Abuja
 */
export const NIGERIAN_STATES: CityPreset[] = [
  { id: 'ng_fct', name: 'Abuja (FCT)', state: 'Federal Capital Territory', country: 'Nigeria', countryCode: 'NG', lat: 9.0765, lng: 7.3986, timezone: 1, method: 'egyptian' },
  { id: 'ng_kano', name: 'Kano', state: 'Kano State', country: 'Nigeria', countryCode: 'NG', lat: 12.0022, lng: 8.5920, timezone: 1, method: 'egyptian' },
  { id: 'ng_lagos', name: 'Lagos (Ikeja)', state: 'Lagos State', country: 'Nigeria', countryCode: 'NG', lat: 6.5244, lng: 3.3792, timezone: 1, method: 'egyptian' },
  { id: 'ng_kaduna', name: 'Kaduna', state: 'Kaduna State', country: 'Nigeria', countryCode: 'NG', lat: 10.5105, lng: 7.4165, timezone: 1, method: 'egyptian' },
  { id: 'ng_sokoto', name: 'Sokoto', state: 'Sokoto State', country: 'Nigeria', countryCode: 'NG', lat: 13.0609, lng: 5.2339, timezone: 1, method: 'egyptian' },
  { id: 'ng_adamawa', name: 'Yola', state: 'Adamawa State', country: 'Nigeria', countryCode: 'NG', lat: 9.2004, lng: 12.4836, timezone: 1, method: 'egyptian' },
  { id: 'ng_gombe', name: 'Gombe', state: 'Gombe State', country: 'Nigeria', countryCode: 'NG', lat: 10.2897, lng: 11.1673, timezone: 1, method: 'egyptian' },
  { id: 'ng_zamfara', name: 'Gusau', state: 'Zamfara State', country: 'Nigeria', countryCode: 'NG', lat: 12.1628, lng: 6.6614, timezone: 1, method: 'egyptian' },
  { id: 'ng_borno', name: 'Maiduguri', state: 'Borno State', country: 'Nigeria', countryCode: 'NG', lat: 11.8333, lng: 13.1500, timezone: 1, method: 'egyptian' },
  { id: 'ng_yobe', name: 'Damaturu', state: 'Yobe State', country: 'Nigeria', countryCode: 'NG', lat: 11.7470, lng: 11.9608, timezone: 1, method: 'egyptian' },
  { id: 'ng_bauchi', name: 'Bauchi', state: 'Bauchi State', country: 'Nigeria', countryCode: 'NG', lat: 10.3158, lng: 9.8442, timezone: 1, method: 'egyptian' },
  { id: 'ng_plateau', name: 'Jos', state: 'Plateau State', country: 'Nigeria', countryCode: 'NG', lat: 9.8965, lng: 8.8583, timezone: 1, method: 'egyptian' },
  { id: 'ng_taraba', name: 'Jalingo', state: 'Taraba State', country: 'Nigeria', countryCode: 'NG', lat: 8.8937, lng: 11.3596, timezone: 1, method: 'egyptian' },
  { id: 'ng_jigawa', name: 'Dutse', state: 'Jigawa State', country: 'Nigeria', countryCode: 'NG', lat: 11.7562, lng: 9.3390, timezone: 1, method: 'egyptian' },
  { id: 'ng_katsina', name: 'Katsina', state: 'Katsina State', country: 'Nigeria', countryCode: 'NG', lat: 12.9908, lng: 7.6018, timezone: 1, method: 'egyptian' },
  { id: 'ng_kebbi', name: 'Birnin Kebbi', state: 'Kebbi State', country: 'Nigeria', countryCode: 'NG', lat: 12.4539, lng: 4.1975, timezone: 1, method: 'egyptian' },
  { id: 'ng_niger', name: 'Minna', state: 'Niger State', country: 'Nigeria', countryCode: 'NG', lat: 9.6139, lng: 6.5569, timezone: 1, method: 'egyptian' },
  { id: 'ng_kwara', name: 'Ilorin', state: 'Kwara State', country: 'Nigeria', countryCode: 'NG', lat: 8.4799, lng: 4.5418, timezone: 1, method: 'egyptian' },
  { id: 'ng_oyo', name: 'Ibadan', state: 'Oyo State', country: 'Nigeria', countryCode: 'NG', lat: 7.3775, lng: 3.9470, timezone: 1, method: 'egyptian' },
  { id: 'ng_osun', name: 'Osogbo', state: 'Osun State', country: 'Nigeria', countryCode: 'NG', lat: 7.7827, lng: 4.5418, timezone: 1, method: 'egyptian' },
  { id: 'ng_ogun', name: 'Abeokuta', state: 'Ogun State', country: 'Nigeria', countryCode: 'NG', lat: 7.1475, lng: 3.3619, timezone: 1, method: 'egyptian' },
  { id: 'ng_ondo', name: 'Akure', state: 'Ondo State', country: 'Nigeria', countryCode: 'NG', lat: 7.2571, lng: 5.2058, timezone: 1, method: 'egyptian' },
  { id: 'ng_ekiti', name: 'Ado-Ekiti', state: 'Ekiti State', country: 'Nigeria', countryCode: 'NG', lat: 7.6211, lng: 5.2214, timezone: 1, method: 'egyptian' },
  { id: 'ng_edo', name: 'Benin City', state: 'Edo State', country: 'Nigeria', countryCode: 'NG', lat: 6.3350, lng: 5.6037, timezone: 1, method: 'egyptian' },
  { id: 'ng_delta', name: 'Asaba', state: 'Delta State', country: 'Nigeria', countryCode: 'NG', lat: 6.1983, lng: 6.7322, timezone: 1, method: 'egyptian' },
  { id: 'ng_rivers', name: 'Port Harcourt', state: 'Rivers State', country: 'Nigeria', countryCode: 'NG', lat: 4.8156, lng: 7.0498, timezone: 1, method: 'egyptian' },
  { id: 'ng_bayelsa', name: 'Yenagoa', state: 'Bayelsa State', country: 'Nigeria', countryCode: 'NG', lat: 4.9267, lng: 6.2676, timezone: 1, method: 'egyptian' },
  { id: 'ng_imo', name: 'Owerri', state: 'Imo State', country: 'Nigeria', countryCode: 'NG', lat: 5.4891, lng: 7.0176, timezone: 1, method: 'egyptian' },
  { id: 'ng_abia', name: 'Umuahia', state: 'Abia State', country: 'Nigeria', countryCode: 'NG', lat: 5.5249, lng: 7.4943, timezone: 1, method: 'egyptian' },
  { id: 'ng_anambra', name: 'Awka', state: 'Anambra State', country: 'Nigeria', countryCode: 'NG', lat: 6.2106, lng: 7.0683, timezone: 1, method: 'egyptian' },
  { id: 'ng_enugu', name: 'Enugu', state: 'Enugu State', country: 'Nigeria', countryCode: 'NG', lat: 6.4584, lng: 7.5464, timezone: 1, method: 'egyptian' },
  { id: 'ng_ebonyi', name: 'Abakaliki', state: 'Ebonyi State', country: 'Nigeria', countryCode: 'NG', lat: 6.3249, lng: 8.1137, timezone: 1, method: 'egyptian' },
  { id: 'ng_benue', name: 'Makurdi', state: 'Benue State', country: 'Nigeria', countryCode: 'NG', lat: 7.7322, lng: 8.5214, timezone: 1, method: 'egyptian' },
  { id: 'ng_kogi', name: 'Lokoja', state: 'Kogi State', country: 'Nigeria', countryCode: 'NG', lat: 7.8023, lng: 6.7430, timezone: 1, method: 'egyptian' },
  { id: 'ng_nasarawa', name: 'Lafia', state: 'Nasarawa State', country: 'Nigeria', countryCode: 'NG', lat: 8.4932, lng: 8.5153, timezone: 1, method: 'egyptian' },
  { id: 'ng_crossriver', name: 'Calabar', state: 'Cross River State', country: 'Nigeria', countryCode: 'NG', lat: 4.9757, lng: 8.3417, timezone: 1, method: 'egyptian' },
  { id: 'ng_akwaibom', name: 'Uyo', state: 'Akwa Ibom State', country: 'Nigeria', countryCode: 'NG', lat: 5.0377, lng: 7.9128, timezone: 1, method: 'egyptian' }
];

export const INTERNATIONAL_CITIES: CityPreset[] = [
  { id: 'makkah', name: 'Makkah Al-Mukarramah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.4225, lng: 39.8262, timezone: 3, method: 'umm_al_qura' },
  { id: 'madinah', name: 'Al-Madinah Al-Munawwarah', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.4672, lng: 39.6111, timezone: 3, method: 'umm_al_qura' },
  { id: 'jerusalem', name: 'Al-Quds (Jerusalem)', country: 'Palestine', countryCode: 'PS', lat: 31.7683, lng: 35.2137, timezone: 3, method: 'mwl' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, timezone: 2, method: 'egyptian' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 41.0082, lng: 28.9784, timezone: 3, method: 'mwl' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lng: 55.2708, timezone: 4, method: 'umm_al_qura' },
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, timezone: 0, method: 'mwl' },
  { id: 'new_york', name: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060, timezone: -4, method: 'isna' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, timezone: 2, method: 'mwl' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', lat: -6.2088, lng: 106.8456, timezone: 7, method: 'mwl' },
  { id: 'kuala_lumpur', name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', lat: 3.1390, lng: 101.6869, timezone: 8, method: 'mwl' },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', countryCode: 'PK', lat: 24.8607, lng: 67.0011, timezone: 5, method: 'karachi' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', lat: 23.8103, lng: 90.4125, timezone: 6, method: 'karachi' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryCode: 'CA', lat: 43.6532, lng: -79.3832, timezone: -4, method: 'isna' }
];

export const WORLD_CITIES: CityPreset[] = [
  ...NIGERIAN_STATES,
  ...INTERNATIONAL_CITIES
];

// Ka'bah location in Makkah
export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

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
 * Calculates Qibla direction in degrees clockwise from True North.
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
 * Parses either 12-hour ("5:12 AM", "12:34 PM") or 24-hour ("17:12") strings safely without NaN.
 */
export function parsePrayerTime12hOr24h(timeStr: string): { hour24: number; minute: number } | null {
  if (!timeStr) return null;
  const trimmed = timeStr.trim();
  const match12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const minute = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    if (period === 'AM') {
      if (hour === 12) hour = 0;
    } else {
      if (hour !== 12) hour += 12;
    }
    return { hour24: hour % 24, minute: minute % 60 };
  }
  const match24 = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (match24) {
    const hour = parseInt(match24[1], 10);
    const minute = parseInt(match24[2], 10);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    return { hour24: hour % 24, minute: minute % 60 };
  }
  return null;
}

/**
 * Calculates astronomical prayer times for a given date, coordinates, method, and adjustments.
 */
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezoneOffsetHours?: number,
  methodId: CalculationMethodId = 'egyptian',
  asrJuristic: 'standard' | 'hanafi' = 'standard',
  adjustments?: { fajr?: number; sunrise?: number; dhuhr?: number; asr?: number; maghrib?: number; isha?: number }
): PrayerTimesResult {
  const method = CALCULATION_METHODS[methodId] || CALCULATION_METHODS.egyptian;

  const tz = timezoneOffsetHours !== undefined ? timezoneOffsetHours : -date.getTimezoneOffset() / 60;

  // Compute wall-clock date/time in the target location's timezone
  const wallNow = new Date(date.getTime() + tz * 3600000);
  const year = wallNow.getUTCFullYear();
  const month = wallNow.getUTCMonth();
  const day = wallNow.getUTCDate();
  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Day of year calculation in target timezone
  const startOfYearUtc = Date.UTC(year, 0, 1);
  const todayMidnightUtc = Date.UTC(year, month, day);
  const dayOfYear = Math.floor((todayMidnightUtc - startOfYearUtc) / 86400000) + 1;

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
  const dhuhrHours = (solarNoonMinutes + 2) / 60;

  // Hour angle helper for altitude angle (alpha)
  const getHourAngleHours = (alpha: number): number => {
    const cosHA = (sinD(alpha) - sinD(lat) * sinD(decl)) / (cosD(lat) * cosD(decl));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 12;
    return acosD(cosHA) / 15.0;
  };

  // Sunrise and Sunset
  const sunAltitude = -0.833;
  const sunRiseSetHA = getHourAngleHours(sunAltitude);
  const sunriseHours = dhuhrHours - sunRiseSetHA;
  const maghribHours = dhuhrHours + sunRiseSetHA;

  // Fajr
  const fajrHA = getHourAngleHours(-method.fajrAngle);
  const fajrHours = dhuhrHours - fajrHA;

  // Asr
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

  // Apply minute adjustments
  const adj = adjustments || {};
  const applyAdj = (hours: number, minutesOffset: number = 0) => hours + (minutesOffset / 60);

  const finalFajr = applyAdj(fajrHours, adj.fajr);
  const finalSunrise = applyAdj(sunriseHours, adj.sunrise);
  const finalDhuhr = applyAdj(dhuhrHours, adj.dhuhr);
  const finalAsr = applyAdj(asrHours, adj.asr);
  const finalMaghrib = applyAdj(maghribHours, adj.maghrib);
  const finalIsha = applyAdj(ishaHours, adj.isha);

  const buildSlot = (hours: number): ScheduledPrayerSlot => {
    const normalized = ((hours % 24) + 24) % 24;
    const totalMinutes = Math.round(normalized * 60) % 1440;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    const formatted = `${displayHour}:${displayMinute} ${period}`;
    const time24 = `${hour24.toString().padStart(2, '0')}:${displayMinute}`;
    const timestampMs = Date.UTC(year, month, day, hour24, minute, 0, 0) - tz * 3600000;
    return {
      formatted,
      time24,
      hour24,
      minute,
      minutesFromMidnight: totalMinutes,
      timestampMs
    };
  };

  const schedule = {
    fajr: buildSlot(finalFajr),
    sunrise: buildSlot(finalSunrise),
    dhuhr: buildSlot(finalDhuhr),
    asr: buildSlot(finalAsr),
    maghrib: buildSlot(finalMaghrib),
    isha: buildSlot(finalIsha)
  };

  const nowMs = date.getTime();
  const prayers = [
    { name: 'Fajr' as const, arabicName: 'الفجر', slot: schedule.fajr },
    { name: 'Sunrise' as const, arabicName: 'الشروق', slot: schedule.sunrise },
    { name: 'Dhuhr' as const, arabicName: 'الظهر', slot: schedule.dhuhr },
    { name: 'Asr' as const, arabicName: 'العصر', slot: schedule.asr },
    { name: 'Maghrib' as const, arabicName: 'المغرب', slot: schedule.maghrib },
    { name: 'Isha' as const, arabicName: 'العشاء', slot: schedule.isha }
  ];

  let next = prayers.find(p => p.slot.timestampMs > nowMs);
  let targetMs: number;
  if (next) {
    targetMs = next.slot.timestampMs;
  } else {
    next = prayers[0];
    targetMs = next.slot.timestampMs + 86400000;
  }

  const diffTotalSeconds = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
  const remainingMinutes = Math.floor(diffTotalSeconds / 60);
  const remainingSeconds = diffTotalSeconds % 60;

  return {
    fajr: schedule.fajr.formatted,
    sunrise: schedule.sunrise.formatted,
    dhuhr: schedule.dhuhr.formatted,
    asr: schedule.asr.formatted,
    maghrib: schedule.maghrib.formatted,
    isha: schedule.isha.formatted,
    dateKey,
    timezoneOffsetHours: tz,
    schedule,
    nextPrayer: {
      name: next.name,
      arabicName: next.arabicName,
      time: next.slot.formatted,
      remainingMinutes,
      remainingSeconds,
      timestampMs: targetMs
    }
  };
}

/**
 * Calculates a complete monthly prayer timetable for a given year and month.
 */
export function generateMonthlyPrayerTimes(
  year: number,
  month: number, // 0-indexed (0 = Jan, 11 = Dec)
  lat: number,
  lng: number,
  timezone: number,
  methodId: CalculationMethodId = 'egyptian',
  asrJuristic: 'standard' | 'hanafi' = 'standard',
  adjustments?: { fajr?: number; sunrise?: number; dhuhr?: number; asr?: number; maghrib?: number; isha?: number }
): Array<PrayerTimesResult & { day: number; dateString: string; hijriString: string }> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const timetable = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // Anchor at 12:00 PM in target city's timezone
    const d = new Date(Date.UTC(year, month, day, 12, 0, 0) - timezone * 3600000);
    const displayDate = new Date(year, month, day, 12, 0, 0);
    const times = calculatePrayerTimes(d, lat, lng, timezone, methodId, asrJuristic, adjustments);
    const hijriString = getHijriDateString(displayDate);
    const dateString = `${day} ${displayDate.toLocaleString('default', { month: 'short' })}`;

    timetable.push({
      day,
      dateString,
      hijriString,
      ...times
    });
  }

  return timetable;
}

/**
 * Approximates Hijri Date String from Gregorian date with optional offset
 */
export function getHijriDateString(date: Date, offsetDays: number = 0): string {
  try {
    const adjustedDate = new Date(date.getTime() + offsetDays * 86400000);
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(adjustedDate);
  } catch {
    return '15 Shawwal 1447 AH';
  }
}

// ============================================================================
// PERSISTENT USER PRAYER LOCATION & CALCULATION CONFIG (SINGLE SOURCE OF TRUTH)
// ============================================================================

export const PRAYER_CONFIG_STORAGE_KEY = 'nur_quran_prayer_location_config';
export const PRAYER_CONFIG_UPDATED_EVENT = 'nur_prayer_config_updated';

export const DEFAULT_PRAYER_LOCATION_CONFIG: PrayerLocationConfig = {
  regionTab: 'nigeria',
  selectedCityId: 'ng_fct',
  customCoords: null,
  calculationMethod: 'egyptian',
  asrJuristic: 'standard',
  minuteAdjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  hijriOffset: 0
};

export function getPrayerLocationConfig(): PrayerLocationConfig {
  try {
    const saved = localStorage.getItem(PRAYER_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PRAYER_LOCATION_CONFIG,
        ...parsed,
        minuteAdjustments: {
          ...DEFAULT_PRAYER_LOCATION_CONFIG.minuteAdjustments,
          ...(parsed.minuteAdjustments || {})
        }
      };
    }
  } catch (e) {
    console.warn('Failed to load prayer location config:', e);
  }
  return DEFAULT_PRAYER_LOCATION_CONFIG;
}

export function savePrayerLocationConfig(config: PrayerLocationConfig): void {
  try {
    localStorage.setItem(PRAYER_CONFIG_STORAGE_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PRAYER_CONFIG_UPDATED_EVENT, { detail: config }));
    }
  } catch (e) {
    console.warn('Failed to save prayer location config:', e);
  }
}

export function getActiveLocationMeta(
  now: Date = new Date(),
  config: PrayerLocationConfig = getPrayerLocationConfig()
): {
  lat: number;
  lng: number;
  name: string;
  country: string;
  timezone: number;
  method: CalculationMethodId;
  asrJuristic: 'standard' | 'hanafi';
  adjustments: PrayerLocationConfig['minuteAdjustments'];
  hijriOffset: number;
  isGps: boolean;
} {
  if (config.customCoords) {
    return {
      lat: config.customCoords.lat,
      lng: config.customCoords.lng,
      name: config.customCoords.name || 'My GPS Location',
      country: 'Device Local Timezone',
      timezone: -now.getTimezoneOffset() / 60,
      method: config.calculationMethod,
      asrJuristic: config.asrJuristic,
      adjustments: config.minuteAdjustments,
      hijriOffset: config.hijriOffset,
      isGps: true
    };
  }

  const city = WORLD_CITIES.find(c => c.id === config.selectedCityId) || NIGERIAN_STATES[0];
  return {
    lat: city.lat,
    lng: city.lng,
    name: city.name,
    country: city.country,
    timezone: city.timezone,
    method: config.calculationMethod || city.method,
    asrJuristic: config.asrJuristic,
    adjustments: config.minuteAdjustments,
    hijriOffset: config.hijriOffset,
    isGps: false
  };
}


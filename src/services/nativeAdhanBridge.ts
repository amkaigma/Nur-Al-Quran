/**
 * Platform Capability & Native Android Capacitor Bridge for Automatic Adhan
 *
 * Provides:
 * 1. Honest runtime detection (Web Browser vs Installed PWA vs Capacitor Android/iOS).
 * 2. Capacitor LocalNotifications scheduling hook when packaged inside an Android APK.
 * 3. Background execution capability reporting without overclaiming OS-restricted browser modes.
 */

import type { DailyPrayerKey, PrayerTimesResult } from './prayerTimes';

export type RuntimePlatform = 'capacitor_android' | 'capacitor_ios' | 'pwa_installed' | 'web';

export interface PlatformCapabilityReport {
  platform: RuntimePlatform;
  notificationPermission: 'granted' | 'denied' | 'default' | 'unsupported';
  serviceWorkerReady: boolean;
  isStandalonePwa: boolean;
  supportsOpenTabAutoAudio: boolean;
  supportsBackgroundTabNotifications: boolean;
  supportsClosedAppBackgroundAudio: boolean;
  honestSummary: string;
}

interface CapacitorLocalNotificationsPlugin {
  requestPermissions?: () => Promise<{ display?: string }>;
  createChannel?: (opts: {
    id: string;
    name: string;
    description?: string;
    importance?: number;
    sound?: string;
    vibration?: boolean;
  }) => Promise<void>;
  cancel?: (opts: { notifications: Array<{ id: number }> }) => Promise<void>;
  schedule?: (opts: {
    notifications: Array<{
      id: number;
      title: string;
      body: string;
      schedule: { at: Date; allowWhileIdle?: boolean };
      channelId?: string;
      sound?: string;
      smallIcon?: string;
    }>;
  }) => Promise<void>;
}

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      Plugins?: {
        LocalNotifications?: CapacitorLocalNotificationsPlugin;
      };
    };
  }
}

export function detectRuntimePlatform(): RuntimePlatform {
  if (typeof window === 'undefined') return 'web';
  const cap = window.Capacitor;
  if (cap?.isNativePlatform?.()) {
    const p = cap.getPlatform?.();
    if (p === 'android') return 'capacitor_android';
    if (p === 'ios') return 'capacitor_ios';
  }

  const isStandalone =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    Boolean((window.navigator as { standalone?: boolean }).standalone);

  return isStandalone ? 'pwa_installed' : 'web';
}

export async function getPlatformCapabilities(): Promise<PlatformCapabilityReport> {
  const platform = detectRuntimePlatform();
  const isStandalonePwa = platform === 'pwa_installed';

  let notificationPermission: PlatformCapabilityReport['notificationPermission'] = 'unsupported';
  if (typeof window !== 'undefined' && 'Notification' in window) {
    notificationPermission = Notification.permission;
  }

  let serviceWorkerReady = false;
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration('/');
      serviceWorkerReady = Boolean(reg && (reg.active || reg.waiting || reg.installing));
    } catch {
      serviceWorkerReady = false;
    }
  }

  if (platform === 'capacitor_android') {
    return {
      platform,
      notificationPermission,
      serviceWorkerReady,
      isStandalonePwa: false,
      supportsOpenTabAutoAudio: true,
      supportsBackgroundTabNotifications: true,
      supportsClosedAppBackgroundAudio: true,
      honestSummary:
        'Running in Android native container: Capacitor LocalNotifications can fire exact Doze-aware alarms with custom Adhan sound even when minimized or locked.'
    };
  }

  if (platform === 'capacitor_ios') {
    return {
      platform,
      notificationPermission,
      serviceWorkerReady,
      isStandalonePwa: false,
      supportsOpenTabAutoAudio: true,
      supportsBackgroundTabNotifications: true,
      supportsClosedAppBackgroundAudio: false,
      honestSummary:
        'Running in iOS native container: System notifications play short bundled chimes when locked; full-length Adhan plays when foregrounded or tapped.'
    };
  }

  return {
    platform,
    notificationPermission,
    serviceWorkerReady,
    isStandalonePwa,
    supportsOpenTabAutoAudio: true,
    supportsBackgroundTabNotifications: notificationPermission === 'granted',
    supportsClosedAppBackgroundAudio: false,
    honestSummary:
      'Running as Web / PWA: Automatic full Adhan audio plays reliably while this tab is open (after audio unlock). When the browser is completely closed or mobile screen sleeps long-term, web security policies prevent unprompted background audio — keep tab open or package as Android APK (Capacitor) for closed-app alarms.'
  };
}

const PRAYER_NOTIFICATION_IDS: Record<DailyPrayerKey, number> = {
  fajr: 9101,
  dhuhr: 9102,
  asr: 9103,
  maghrib: 9104,
  isha: 9105
};

/**
 * If running inside a Capacitor Android APK with @capacitor/local-notifications,
 * schedules exact OS-level daily alarms for the enabled prayers.
 * On standard web/PWA browsers, returns gracefully without throwing.
 */
export async function syncNativeAdhanAlarms(params: {
  enabled: boolean;
  enabledPrayers: Record<DailyPrayerKey, boolean>;
  prayerTimes: PrayerTimesResult;
  cityName: string;
  muezzinName: string;
}): Promise<{ synced: boolean; scheduledCount: number; reason?: string }> {
  if (typeof window === 'undefined') {
    return { synced: false, scheduledCount: 0, reason: 'SSR environment' };
  }

  const plugin = window.Capacitor?.Plugins?.LocalNotifications;
  if (!plugin || !window.Capacitor?.isNativePlatform?.()) {
    return {
      synced: false,
      scheduledCount: 0,
      reason: 'Web/PWA runtime (native Android LocalNotifications plugin not attached)'
    };
  }

  try {
    await plugin.requestPermissions?.();
    await plugin.createChannel?.({
      id: 'adhan_channel',
      name: 'Prayer Time Adhan Alerts',
      description: 'Automatic daily Adhan notifications for the 5 prayers',
      importance: 5,
      sound: 'adhan_makkah.mp3',
      vibration: true
    });

    const idsToCancel = Object.values(PRAYER_NOTIFICATION_IDS).map((id) => ({ id }));
    await plugin.cancel?.({ notifications: idsToCancel });

    if (!params.enabled) {
      return { synced: true, scheduledCount: 0 };
    }

    const nowMs = Date.now();
    const notifications: Array<{
      id: number;
      title: string;
      body: string;
      schedule: { at: Date; allowWhileIdle?: boolean };
      channelId?: string;
      sound?: string;
    }> = [];

    const labels: Record<DailyPrayerKey, string> = {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    };

    (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).forEach((key) => {
      if (!params.enabledPrayers[key]) return;
      const slot = params.prayerTimes.schedule[key];
      let targetMs = slot.timestampMs;
      if (targetMs <= nowMs) {
        // Schedule for next day if today's time already passed
        targetMs += 86400000;
      }
      notifications.push({
        id: PRAYER_NOTIFICATION_IDS[key],
        title: `${labels[key]} Prayer Time — ${params.cityName}`,
        body: `Hayya 'alas-Salah (${slot.formatted}) · ${params.muezzinName}`,
        schedule: { at: new Date(targetMs), allowWhileIdle: true },
        channelId: 'adhan_channel',
        sound: 'adhan_makkah.mp3'
      });
    });

    if (notifications.length > 0) {
      await plugin.schedule?.({ notifications });
    }

    return { synced: true, scheduledCount: notifications.length };
  } catch (err) {
    return {
      synced: false,
      scheduledCount: 0,
      reason: err instanceof Error ? err.message : 'Native alarm sync failed'
    };
  }
}

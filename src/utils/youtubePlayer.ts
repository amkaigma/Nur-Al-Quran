/**
 * Official YouTube IFrame Player API helper for Matn Ash-Shatibiyyah
 * Audio/Video source: Sheikh Okasha Kameny (https://www.youtube.com/watch?v=Cx76SdfINxU)
 */

export const SHATIBIYYAH_YOUTUBE_VIDEO_ID = 'Cx76SdfINxU';
export const SHATIBIYYAH_YOUTUBE_URL = 'https://www.youtube.com/watch?v=Cx76SdfINxU';

export const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
} as const;

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  getAvailablePlaybackRates: () => number[];
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
  getVideoData?: () => { video_id?: string; title?: string; author?: string };
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { target: YTPlayerInstance; data: number }) => void;
            onPlaybackRateChange?: (event: { target: YTPlayerInstance; data: number }) => void;
            onError?: (event: { target: YTPlayerInstance; data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: typeof YT_PLAYER_STATE;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<NonNullable<Window['YT']>> | null = null;

export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace(/^\//, '').split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    const vParam = parsed.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;
    const embedMatch = parsed.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
  } catch {
    return null;
  }
  return null;
}

export function describeYouTubeError(code: number): { en: string; ar: string } {
  switch (code) {
    case 2:
      return {
        en: 'Invalid YouTube video ID parameter.',
        ar: 'معرّف فيديو يوتيوب غير صالح.'
      };
    case 5:
      return {
        en: 'YouTube HTML5 player encountered a playback error.',
        ar: 'حدث خطأ في مشغل يوتيوب داخل المتصفح.'
      };
    case 100:
      return {
        en: 'YouTube video was not found or has been removed/made private.',
        ar: 'الفيديو غير موجود على يوتيوب أو تم تعيينه كخاص.'
      };
    case 101:
    case 150:
      return {
        en: 'The video owner disabled embedded playback on external websites (Error 101/150).',
        ar: 'منع ناشر الفيديو تضمينه خارج يوتيوب (خطأ 101/150) — يمكنك الفتح في يوتيوب أو رفع الملف المصرّح به.'
      };
    default:
      return {
        en: `YouTube player reported error code ${code}.`,
        ar: `تعذر تشغيل فيديو يوتيوب (رمز الخطأ ${code}).`
      };
  }
}

/**
 * Loads the official YouTube IFrame Player API script once and resolves when window.YT.Player is ready.
 */
export function loadYouTubeIframeAPI(): Promise<NonNullable<Window['YT']>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser environment.'));
  }

  if (window.YT && typeof window.YT.Player === 'function') {
    return Promise.resolve(window.YT);
  }

  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  apiLoadPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      apiLoadPromise = null;
      reject(new Error('Timed out loading YouTube IFrame Player API (https://www.youtube.com/iframe_api).'));
    }, 12000);

    const finish = () => {
      window.clearTimeout(timeout);
      if (window.YT && typeof window.YT.Player === 'function') {
        resolve(window.YT);
      } else {
        apiLoadPromise = null;
        reject(new Error('YouTube IFrame API loaded without window.YT.Player.'));
      }
    };

    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try {
        if (typeof existingCallback === 'function') existingCallback();
      } finally {
        finish();
      }
    };

    // Poll briefly in case API was already initialized by another component
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeout);
        apiLoadPromise = null;
        reject(new Error('Failed to load https://www.youtube.com/iframe_api — check internet connection or ad blocker.'));
      };
      document.head.appendChild(script);
    } else {
      const interval = window.setInterval(() => {
        if (window.YT && typeof window.YT.Player === 'function') {
          window.clearInterval(interval);
          finish();
        }
      }, 150);
    }
  });

  return apiLoadPromise;
}

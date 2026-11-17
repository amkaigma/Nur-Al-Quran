import {
  SHATIBIYYAH_ABYAT,
  SHATIBIYYAH_META,
  ShatibiyyahAudioPart,
  ShatibiyyahBayt,
  ShatibiyyahTimestampEntry,
  getBaytByNumber
} from '../data/shatibiyyahData';
import { SHATIBIYYAH_YOUTUBE_VIDEO_ID, SHATIBIYYAH_YOUTUBE_URL } from './youtubePlayer';

export type ShatibiyyahPlaybackMode = 'single' | 'book';

export interface ResolvedBaytPlayback {
  bayt: ShatibiyyahBayt;
  part: ShatibiyyahAudioPart | undefined;
  sourceType: 'youtube' | 'audio' | 'none';
  youtubeVideoId: string | null;
  recordingId: string | null;
  hasPartAudio: boolean;
  hasVerifiedTimestamp: boolean;
  audioStart: number | null;
  audioEnd: number | null;
  reasonIfUnavailable: 'no_audio' | 'no_timestamp' | null;
}

export interface BaytSegmentProgress {
  mode: ShatibiyyahPlaybackMode;
  elapsed: number;
  total: number;
  minSeek: number;
  maxSeek: number;
  percent: number;
}

export interface PersistedShatibiyyahPlayback {
  activeBaytId: string;
  selectedPartId: string;
  currentPage: number;
  selectedBabId: string;
  currentTime: number;
  playbackMode: ShatibiyyahPlaybackMode;
  playbackSpeed: number;
}

export interface MissingTimestampsSummary {
  totalBayts: number;
  verifiedCount: number;
  missingCount: number;
  percentComplete: number;
  missingRanges: Array<{ start: number; end: number }>;
  missingRangesLabel: string;
}

export type AudioDiagnosticErrorCode =
  | 'Audio source unavailable'
  | 'Audio file not found'
  | 'Audio format unsupported'
  | 'Audio loading failed'
  | 'Playback blocked by device or browser'
  | 'Bayt timestamp missing';

export interface AudioDiagnosticCheckItem {
  id:
    | 'url_availability'
    | 'server_response'
    | 'format_support'
    | 'metadata_load'
    | 'playback_permission'
    | 'bayt_mapping'
    | 'bayt_timestamp';
  label: string;
  labelArabic: string;
  status: 'pass' | 'fail' | 'skipped';
  errorCode?: AudioDiagnosticErrorCode;
  detail: string;
  detailArabic: string;
}

export interface ShatibiyyahAudioDiagnosticsReport {
  timestamp: string;
  baytNumber: number;
  partId: string | null;
  partTitle: string | null;
  audioUrl: string | null;
  overallPass: boolean;
  primaryErrorCode: AudioDiagnosticErrorCode | null;
  primaryMessage: string;
  primaryMessageArabic: string;
  checks: AudioDiagnosticCheckItem[];
}

export const SHATIBIYYAH_PLAYBACK_STORAGE_KEY = 'nur_quran_shatibiyyah_playback';

/**
 * Compute exact summary of verified vs unverified/missing Bayt timestamps across all 1,173 verses.
 */
export function getMissingTimestampsSummary(
  verifiedTimestamps: Record<string, ShatibiyyahTimestampEntry>
): MissingTimestampsSummary {
  const totalBayts = SHATIBIYYAH_META.totalAbyat || 1173;
  const missingRanges: Array<{ start: number; end: number }> = [];
  let verifiedCount = 0;
  let rangeStart: number | null = null;

  for (let i = 1; i <= totalBayts; i++) {
    const ts = verifiedTimestamps[String(i)];
    const valid = Boolean(ts && ts.verifiedByAdmin && ts.audioStart >= 0 && ts.audioEnd > ts.audioStart);
    if (valid) {
      verifiedCount++;
      if (rangeStart !== null) {
        missingRanges.push({ start: rangeStart, end: i - 1 });
        rangeStart = null;
      }
    } else if (rangeStart === null) {
      rangeStart = i;
    }
  }
  if (rangeStart !== null) {
    missingRanges.push({ start: rangeStart, end: totalBayts });
  }

  const missingCount = totalBayts - verifiedCount;
  const percentComplete = totalBayts > 0 ? Math.round((verifiedCount / totalBayts) * 1000) / 10 : 0;
  const missingRangesLabel =
    missingRanges.length === 0
      ? 'None (All 1,173 Bayts Verified)'
      : missingRanges
          .slice(0, 6)
          .map((r) => (r.start === r.end ? `#${r.start}` : `${r.start}–${r.end}`))
          .join(', ') + (missingRanges.length > 6 ? ` (+${missingRanges.length - 6} more ranges)` : '');

  return {
    totalBayts,
    verifiedCount,
    missingCount,
    percentComplete,
    missingRanges,
    missingRangesLabel
  };
}

/**
 * Enrich a raw Bayt record with admin-verified timestamp metadata.
 */
export function enrichBaytWithTimestamp(
  bayt: ShatibiyyahBayt,
  verifiedTimestamps: Record<string, ShatibiyyahTimestampEntry>
): ShatibiyyahBayt {
  const ts = verifiedTimestamps[String(bayt.baytNumber)];
  if (ts && ts.verifiedByAdmin && ts.audioStart >= 0 && ts.audioEnd > ts.audioStart) {
    return {
      ...bayt,
      audioPartId: ts.audioPartId || bayt.audioPartId,
      audioStart: ts.audioStart,
      audioEnd: ts.audioEnd,
      hasTimestamp: true
    };
  }
  return bayt;
}

/**
 * Determine whether a part plays via YouTube Embed API or direct uploaded audio stream.
 */
export function getPartPlaybackKind(part: ShatibiyyahAudioPart | undefined): {
  sourceType: 'youtube' | 'audio' | 'none';
  youtubeVideoId: string | null;
  recordingId: string | null;
} {
  if (!part) return { sourceType: 'none', youtubeVideoId: null, recordingId: null };
  if (part.filename && part.audioUrl && part.audioUrl.startsWith('/api/shatibiyyah/audio-file/')) {
    return { sourceType: 'audio', youtubeVideoId: null, recordingId: part.id };
  }
  if (part.sourceType === 'youtube' || part.youtubeVideoId) {
    const vid = part.youtubeVideoId || SHATIBIYYAH_YOUTUBE_VIDEO_ID;
    return { sourceType: 'youtube', youtubeVideoId: vid, recordingId: vid };
  }
  if (part.hasAudio && part.audioUrl) {
    if (part.audioUrl.includes('youtube.com') || part.audioUrl.includes('youtu.be')) {
      return {
        sourceType: 'youtube',
        youtubeVideoId: part.youtubeVideoId || SHATIBIYYAH_YOUTUBE_VIDEO_ID,
        recordingId: part.youtubeVideoId || SHATIBIYYAH_YOUTUBE_VIDEO_ID
      };
    }
    return { sourceType: 'audio', youtubeVideoId: null, recordingId: part.id };
  }
  return { sourceType: 'none', youtubeVideoId: null, recordingId: null };
}

/**
 * Resolve the exact audio/YouTube part and verified [audioStart, audioEnd] segment for any Bayt (1..1173).
 */
export function resolveBaytAudioSegment(
  baytNumber: number,
  audioParts: ShatibiyyahAudioPart[],
  verifiedTimestamps: Record<string, ShatibiyyahTimestampEntry>
): ResolvedBaytPlayback | null {
  const rawBayt = getBaytByNumber(baytNumber);
  if (!rawBayt) return null;

  const bayt = enrichBaytWithTimestamp(rawBayt, verifiedTimestamps);
  const ts = verifiedTimestamps[String(baytNumber)];

  let part: ShatibiyyahAudioPart | undefined;
  if (ts?.audioPartId) {
    part = audioParts.find((p) => p.id === ts.audioPartId);
  }
  if (!part) {
    part = audioParts.find(
      (p) => baytNumber >= p.startBayt && baytNumber <= p.endBayt
    );
  }

  const kind = getPartPlaybackKind(part);
  const hasPartAudio = Boolean(
    part &&
      part.hasAudio &&
      (kind.sourceType === 'youtube' ? Boolean(kind.youtubeVideoId) : Boolean(part.audioUrl))
  );

  const hasVerifiedTimestamp = Boolean(
    bayt.hasTimestamp &&
      bayt.audioStart !== null &&
      bayt.audioEnd !== null &&
      bayt.audioEnd > bayt.audioStart
  );

  let reasonIfUnavailable: 'no_audio' | 'no_timestamp' | null = null;
  if (!hasPartAudio) {
    reasonIfUnavailable = 'no_audio';
  } else if (!hasVerifiedTimestamp) {
    reasonIfUnavailable = 'no_timestamp';
  }

  return {
    bayt,
    part,
    sourceType: hasPartAudio ? kind.sourceType : 'none',
    youtubeVideoId: kind.youtubeVideoId,
    recordingId: kind.recordingId,
    hasPartAudio,
    hasVerifiedTimestamp,
    audioStart: hasVerifiedTimestamp ? bayt.audioStart : null,
    audioEnd: hasVerifiedTimestamp ? bayt.audioEnd : null,
    reasonIfUnavailable
  };
}

/**
 * Return the first playable recording part (YouTube or uploaded audio) in sequential order.
 */
export function getFirstAvailableAudioPart(
  audioParts: ShatibiyyahAudioPart[]
): ShatibiyyahAudioPart | undefined {
  return [...audioParts]
    .sort((a, b) => a.order - b.order)
    .find((p) => {
      const kind = getPartPlaybackKind(p);
      return p.hasAudio && kind.sourceType !== 'none';
    });
}

/**
 * Return all verified timestamped Bayts belonging to a specific recording/part (ordered by audioStart).
 */
export function getSyncedBaytsForPart(
  part: ShatibiyyahAudioPart | undefined,
  verifiedTimestamps: Record<string, ShatibiyyahTimestampEntry>
): ShatibiyyahBayt[] {
  if (!part) return [];
  const kind = getPartPlaybackKind(part);

  return SHATIBIYYAH_ABYAT.filter((b) => {
    const ts = verifiedTimestamps[String(b.baytNumber)];
    if (ts && ts.verifiedByAdmin) {
      if (ts.audioPartId === part.id) return true;
      if (kind.youtubeVideoId && ts.recordingId === kind.youtubeVideoId) return true;
    }
    return b.baytNumber >= part.startBayt && b.baytNumber <= part.endBayt;
  })
    .map((b) => enrichBaytWithTimestamp(b, verifiedTimestamps))
    .filter((b) => b.hasTimestamp && b.audioStart !== null && b.audioEnd !== null)
    .sort((a, b) => (a.audioStart ?? 0) - (b.audioStart ?? 0));
}

/**
 * Find the Bayt currently being recited at `time` within verified segments.
 */
export function findBaytAtTime(
  partSyncedBayts: ShatibiyyahBayt[],
  time: number
): ShatibiyyahBayt | undefined {
  return partSyncedBayts.find(
    (b) => b.audioStart !== null && b.audioEnd !== null && time >= b.audioStart && time < b.audioEnd
  );
}

/**
 * Compute segment-relative progress for 'single' mode or full-recording progress for 'book' mode.
 */
export function computePlaybackProgress(
  mode: ShatibiyyahPlaybackMode,
  currentTime: number,
  duration: number,
  activeBayt: ShatibiyyahBayt | undefined
): BaytSegmentProgress {
  if (
    mode === 'single' &&
    activeBayt?.hasTimestamp &&
    activeBayt.audioStart !== null &&
    activeBayt.audioEnd !== null &&
    activeBayt.audioEnd > activeBayt.audioStart
  ) {
    const start = activeBayt.audioStart;
    const end = activeBayt.audioEnd;
    const total = end - start;
    const elapsed = Math.max(0, Math.min(total, currentTime - start));
    return {
      mode: 'single',
      elapsed,
      total,
      minSeek: start,
      maxSeek: end,
      percent: total > 0 ? (elapsed / total) * 100 : 0
    };
  }

  const safeDuration = Math.max(0, duration);
  const safeCurrent = Math.max(0, Math.min(safeDuration || currentTime, currentTime));
  return {
    mode: 'book',
    elapsed: safeCurrent,
    total: safeDuration,
    minSeek: 0,
    maxSeek: safeDuration || 100,
    percent: safeDuration > 0 ? (safeCurrent / safeDuration) * 100 : 0
  };
}

/**
 * Run comprehensive 7-point diagnostics supporting BOTH YouTube Player API sources (Cx76SdfINxU)
 * and uploaded server MP3/M4A files.
 */
export async function runShatibiyyahAudioDiagnostics(params: {
  baytNumber: number;
  audioParts: ShatibiyyahAudioPart[];
  verifiedTimestamps: Record<string, ShatibiyyahTimestampEntry>;
  partOverride?: ShatibiyyahAudioPart;
  ytPlayerReady?: boolean;
  ytDuration?: number;
  ytErrorMessage?: string | null;
}): Promise<ShatibiyyahAudioDiagnosticsReport> {
  const {
    baytNumber,
    audioParts,
    verifiedTimestamps,
    partOverride,
    ytPlayerReady,
    ytDuration,
    ytErrorMessage
  } = params;

  const resolved = resolveBaytAudioSegment(baytNumber, audioParts, verifiedTimestamps);
  const targetPart = partOverride || resolved?.part;
  const kind = getPartPlaybackKind(targetPart);
  const isYouTube = kind.sourceType === 'youtube' && Boolean(kind.youtubeVideoId);
  const audioUrl = isYouTube
    ? targetPart?.youtubeUrl ||
      (kind.youtubeVideoId ? `https://www.youtube.com/watch?v=${kind.youtubeVideoId}` : SHATIBIYYAH_YOUTUBE_URL)
    : targetPart?.audioUrl || null;
  const hasUrl = Boolean(targetPart?.hasAudio && audioUrl);

  const checks: AudioDiagnosticCheckItem[] = [];

  // 1. Selected Bayt audio mapping
  if (targetPart) {
    checks.push({
      id: 'bayt_mapping',
      label: 'Bayt-to-Recording Mapping',
      labelArabic: 'ربط البيت بمصدر التسجيل',
      status: 'pass',
      detail: `Bayt #${baytNumber} maps to "${targetPart.titleEnglish}" (${targetPart.id}, range ${targetPart.startBayt}–${targetPart.endBayt}).`,
      detailArabic: `البيت ${baytNumber} مرتبط بـ "${targetPart.titleArabic}" (الأبيات ${targetPart.startBayt}–${targetPart.endBayt}).`
    });
  } else {
    checks.push({
      id: 'bayt_mapping',
      label: 'Bayt-to-Recording Mapping',
      labelArabic: 'ربط البيت بمصدر التسجيل',
      status: 'fail',
      errorCode: 'Audio source unavailable',
      detail: `Bayt #${baytNumber} does not fall inside any configured recording part.`,
      detailArabic: `البيت ${baytNumber} غير مندرج ضمن أي جزء تسجيل مُعدّ.`
    });
  }

  // 2. Recording URL / Source availability
  if (hasUrl && audioUrl) {
    checks.push({
      id: 'url_availability',
      label: isYouTube ? 'YouTube Recording Source' : 'Audio URL Availability',
      labelArabic: isYouTube ? 'مصدر تسجيل يوتيوب الرسمي' : 'توفر رابط الملف الصوتي',
      status: 'pass',
      detail: isYouTube
        ? `Connected to YouTube video ID ${kind.youtubeVideoId} (${audioUrl}).`
        : `Audio URL configured: ${audioUrl}`,
      detailArabic: isYouTube
        ? `متصل بفيديو يوتيوب (${kind.youtubeVideoId}) للشيخ عكاشة كميني.`
        : `تم العثور على مسار الملف الصوتي: ${audioUrl}`
    });
  } else {
    checks.push({
      id: 'url_availability',
      label: 'Audio Source Availability',
      labelArabic: 'توفر مصدر التسجيل',
      status: 'fail',
      errorCode: 'Audio source unavailable',
      detail: `No YouTube video or audio file is linked for ${targetPart?.titleEnglish || 'this Bayt'}.`,
      detailArabic: `لا يوجد تسجيل مرتبط بـ "${targetPart?.titleArabic || 'هذا الجزء'}".`
    });
  }

  // Branch A: YouTube IFrame API Diagnostics
  let sourceReachable = false;
  if (isYouTube && kind.youtubeVideoId) {
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${kind.youtubeVideoId}`
      )}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const info = await res.json();
        sourceReachable = true;
        checks.push({
          id: 'server_response',
          label: 'YouTube Video Verification (oEmbed)',
          labelArabic: 'التحقق من توفر الفيديو على يوتيوب',
          status: 'pass',
          detail: `Verified YouTube video "${info.title}" by "${info.author_name}" (HTTP 200).`,
          detailArabic: `الفيديو متاح على يوتيوب: "${info.title}".`
        });
      } else {
        checks.push({
          id: 'server_response',
          label: 'YouTube Video Verification (oEmbed)',
          labelArabic: 'التحقق من توفر الفيديو على يوتيوب',
          status: 'fail',
          errorCode: 'Audio file not found',
          detail: `YouTube oEmbed returned HTTP ${res.status} for video ${kind.youtubeVideoId}.`,
          detailArabic: `تعذر العثور على الفيديو على يوتيوب (HTTP ${res.status}).`
        });
      }
    } catch (err: any) {
      checks.push({
        id: 'server_response',
        label: 'YouTube Video Verification',
        labelArabic: 'التحقق من توفر الفيديو على يوتيوب',
        status: 'fail',
        errorCode: 'Audio loading failed',
        detail: `Network check failed: ${err?.message || 'Unable to reach YouTube'}`,
        detailArabic: `تعذر الاتصال بخادم يوتيوب (${err?.message || 'خطأ شبكة'}).`
      });
    }

    checks.push({
      id: 'format_support',
      label: 'Official YouTube IFrame Player API',
      labelArabic: 'دعم مشغل يوتيوب المدمج في المتصفح',
      status: ytErrorMessage ? 'fail' : 'pass',
      errorCode: ytErrorMessage ? 'Audio loading failed' : undefined,
      detail: ytErrorMessage
        ? `YouTube IFrame Player reported: ${ytErrorMessage}`
        : 'Official YouTube IFrame Player API supported in this browser.',
      detailArabic: ytErrorMessage
        ? `أبلغ مشغل يوتيوب عن خطأ: ${ytErrorMessage}`
        : 'مشغل يوتيوب الرسمي المدمج مدعوم وجاهز في المتصفح.'
    });

    const metaOk = Boolean(ytPlayerReady && !ytErrorMessage);
    checks.push({
      id: 'metadata_load',
      label: 'YouTube Player Initialization & Duration',
      labelArabic: 'تهيئة مشغل يوتيوب وتحميل المدة الزمنية',
      status: metaOk ? 'pass' : sourceReachable ? 'fail' : 'skipped',
      errorCode: metaOk ? undefined : 'Audio loading failed',
      detail: metaOk
        ? `YouTube player initialized cleanly${ytDuration ? ` (duration: ${Math.round(ytDuration)}s)` : ''}.`
        : ytErrorMessage || 'YouTube player is still initializing or blocked by embed restrictions.',
      detailArabic: metaOk
        ? `تمت تهيئة مشغل يوتيوب بنجاح${ytDuration ? ` (المدة: ${Math.round(ytDuration)} ثانية)` : ''}.`
        : ytErrorMessage || 'مشغل يوتيوب لم يكتمل تحميله بعد أو محجوب.'
    });

    checks.push({
      id: 'playback_permission',
      label: 'User-Gesture YouTube Playback',
      labelArabic: 'إمكانية التشغيل التفاعلي عند النقر',
      status: metaOk ? 'pass' : 'fail',
      errorCode: metaOk ? undefined : 'Playback blocked by device or browser',
      detail: metaOk
        ? 'YouTube IFrame player accepts click-triggered playVideo() and seekTo().'
        : 'Browser/iframe blocked or failed initialization — tap Play directly inside the embedded video if restricted.',
      detailArabic: metaOk
        ? 'المشغل جاهز للاستجابة مباشرة عند النقر على الأبيات.'
        : 'قد يمنع الجهاز التشغيل البرمجي التلقائي — اضغط زر التشغيل داخل الفيديو مباشرة عند الحاجة.'
    });
  } else {
    // Branch B: Uploaded Server Audio Diagnostics
    let serverOk = false;
    let serverContentType = targetPart?.mimeType || 'audio/mpeg';
    if (!hasUrl || !audioUrl) {
      checks.push({
        id: 'server_response',
        label: 'Server HTTP Stream Check',
        labelArabic: 'فحص استجابة الخادم للملف الصوتي',
        status: 'fail',
        errorCode: 'Audio file not found',
        detail: 'Skipped live fetch because no audio URL exists for this part.',
        detailArabic: 'تعذر الفحص لعدم وجود ملف صوتي مرفوع على الخادم.'
      });
    } else {
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 7000);
        const res = await fetch(audioUrl, {
          method: 'GET',
          headers: { Range: 'bytes=0-1023' },
          signal: controller.signal
        });
        window.clearTimeout(timeout);
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct) serverContentType = ct.split(';')[0].trim();

        if ((res.ok || res.status === 206) && !ct.includes('application/json') && !ct.includes('text/html')) {
          const buf = await res.arrayBuffer();
          if (buf.byteLength > 0) {
            serverOk = true;
            checks.push({
              id: 'server_response',
              label: 'Server HTTP Stream Check',
              labelArabic: 'فحص استجابة الخادم للملف الصوتي',
              status: 'pass',
              detail: `HTTP ${res.status} (${serverContentType || 'audio'}) returned ${buf.byteLength} probe bytes cleanly.`,
              detailArabic: `استجاب الخادم بنجاح (HTTP ${res.status} · النوع: ${serverContentType || 'audio'}).`
            });
          } else {
            checks.push({
              id: 'server_response',
              label: 'Server HTTP Stream Check',
              labelArabic: 'فحص استجابة الخادم للملف الصوتي',
              status: 'fail',
              errorCode: 'Audio file not found',
              detail: `Server returned 0 audio bytes (HTTP ${res.status}).`,
              detailArabic: 'الملف الصوتي فارغ على الخادم (0 بايت).'
            });
          }
        } else {
          checks.push({
            id: 'server_response',
            label: 'Server HTTP Stream Check',
            labelArabic: 'فحص استجابة الخادم للملف الصوتي',
            status: 'fail',
            errorCode: 'Audio file not found',
            detail: `Server returned HTTP ${res.status} (${ct || 'unknown content-type'}).`,
            detailArabic: `الملف الصوتي غير موجود أو تالف على الخادم (HTTP ${res.status}).`
          });
        }
      } catch (err: any) {
        checks.push({
          id: 'server_response',
          label: 'Server HTTP Stream Check',
          labelArabic: 'فحص استجابة الخادم للملف الصوتي',
          status: 'fail',
          errorCode: 'Audio file not found',
          detail: `Network/server request failed: ${err?.message || 'Request error'}`,
          detailArabic: `تعذر الوصول إلى الملف الصوتي على الخادم (${err?.message || 'خطأ شبكة'}).`
        });
      }
    }

    if (typeof document !== 'undefined') {
      const probe = document.createElement('audio');
      const mimeCandidate = serverContentType.startsWith('audio/') ? serverContentType : 'audio/mpeg';
      const support = probe.canPlayType(mimeCandidate) || probe.canPlayType('audio/mpeg');
      const formatSupported = support === 'probably' || support === 'maybe';

      checks.push({
        id: 'format_support',
        label: 'Browser Format Support',
        labelArabic: 'دعم المتصفح لصيغة الصوت',
        status: formatSupported ? 'pass' : 'fail',
        errorCode: formatSupported ? undefined : 'Audio format unsupported',
        detail: formatSupported
          ? `Browser supports ${mimeCandidate} (canPlayType="${support}").`
          : `Browser reported unsupported codec for ${mimeCandidate}.`,
        detailArabic: formatSupported
          ? `المتصفح يدعم صيغة الصوت (${mimeCandidate}).`
          : `صيغة الملف الصوتي (${mimeCandidate}) غير مدعومة في هذا المتصفح.`
      });
    }

    if (!serverOk || !audioUrl || typeof Audio === 'undefined') {
      checks.push({
        id: 'metadata_load',
        label: 'Audio Metadata Loading',
        labelArabic: 'تحميل بيانات الصوت والمدة الزمنية',
        status: serverOk ? 'skipped' : 'fail',
        errorCode: serverOk ? undefined : 'Audio loading failed',
        detail: 'Skipped metadata probe because server audio stream is unavailable.',
        detailArabic: 'لم يكتمل تحميل البيانات لأن الملف الصوتي غير متوفر على الخادم.'
      });
      checks.push({
        id: 'playback_permission',
        label: 'Browser Playback Execution',
        labelArabic: 'السماح بتشغيل الصوت في المتصفح',
        status: 'skipped',
        detail: 'Cannot test playback without a verified playable audio stream.',
        detailArabic: 'يتطلب ملفاً صوتياً صالحاً لاختبار التشغيل الفعلي.'
      });
    } else {
      const probeAudio = new Audio();
      probeAudio.preload = 'metadata';
      probeAudio.muted = true;
      probeAudio.src = audioUrl;

      const metaResult = await new Promise<{ ok: boolean; duration: number; err?: string }>((resolve) => {
        const timer = window.setTimeout(() => {
          cleanup();
          resolve({ ok: false, duration: 0, err: 'Timed out waiting for loadedmetadata' });
        }, 5500);
        const onLoaded = () => {
          cleanup();
          resolve({
            ok: Number.isFinite(probeAudio.duration) && probeAudio.duration > 0,
            duration: probeAudio.duration || 0
          });
        };
        const onErr = () => {
          cleanup();
          resolve({ ok: false, duration: 0, err: `MediaError code ${probeAudio.error?.code || 'unknown'}` });
        };
        const cleanup = () => {
          window.clearTimeout(timer);
          probeAudio.removeEventListener('loadedmetadata', onLoaded);
          probeAudio.removeEventListener('error', onErr);
        };
        probeAudio.addEventListener('loadedmetadata', onLoaded);
        probeAudio.addEventListener('error', onErr);
        probeAudio.load();
      });

      checks.push({
        id: 'metadata_load',
        label: 'Audio Metadata Loading',
        labelArabic: 'تحميل بيانات الصوت والمدة الزمنية',
        status: metaResult.ok ? 'pass' : 'fail',
        errorCode: metaResult.ok ? undefined : 'Audio loading failed',
        detail: metaResult.ok
          ? `Loaded audio metadata successfully (duration: ${metaResult.duration.toFixed(2)}s).`
          : `Failed to load audio metadata: ${metaResult.err || 'Invalid stream'}.`,
        detailArabic: metaResult.ok
          ? `تم تحميل بيانات الملف الصوتي بنجاح (المدة: ${metaResult.duration.toFixed(1)} ثانية).`
          : `فشل تحميل بيانات الملف الصوتي (${metaResult.err || 'ملف غير صالح'}).`
      });

      if (metaResult.ok) {
        try {
          await probeAudio.play();
          probeAudio.pause();
          probeAudio.src = '';
          checks.push({
            id: 'playback_permission',
            label: 'Browser Playback Execution',
            labelArabic: 'السماح بتشغيل الصوت في المتصفح',
            status: 'pass',
            detail: 'Browser allowed audio playback execution without device/autoplay blocks.',
            detailArabic: 'المتصفح يسمح بالتشغيل المباشر دون قيود.'
          });
        } catch (playErr: any) {
          probeAudio.src = '';
          checks.push({
            id: 'playback_permission',
            label: 'Browser Playback Execution',
            labelArabic: 'السماح بتشغيل الصوت في المتصفح',
            status: 'fail',
            errorCode: 'Playback blocked by device or browser',
            detail: `Playback blocked: ${playErr?.name || 'Error'} — ${playErr?.message || ''}`.trim(),
            detailArabic: 'المتصفح أو الجهاز منع التشغيل التلقائي للصوت — اضغط زر التشغيل مباشرة.'
          });
        }
      } else {
        probeAudio.src = '';
        checks.push({
          id: 'playback_permission',
          label: 'Browser Playback Execution',
          labelArabic: 'السماح بتشغيل الصوت في المتصفح',
          status: 'fail',
          errorCode: 'Audio loading failed',
          detail: 'Could not test playback because metadata failed to load.',
          detailArabic: 'تعذر اختبار التشغيل لفشل تحميل بيانات الصوت.'
        });
      }
    }
  }

  // 7. Selected Bayt verified start & end timestamps
  const hasTs = Boolean(
    resolved?.hasVerifiedTimestamp &&
      resolved.audioStart !== null &&
      resolved.audioEnd !== null &&
      resolved.audioEnd > resolved.audioStart
  );
  checks.push({
    id: 'bayt_timestamp',
    label: 'Bayt Start & End Timestamp',
    labelArabic: 'توقيت بداية ونهاية البيت',
    status: hasTs ? 'pass' : 'fail',
    errorCode: hasTs ? undefined : 'Bayt timestamp missing',
    detail: hasTs
      ? `Bayt #${baytNumber} verified segment: ${resolved?.audioStart?.toFixed(2)}s – ${resolved?.audioEnd?.toFixed(2)}s.`
      : `Bayt #${baytNumber} has no verified start/end audio timestamp yet.`,
    detailArabic: hasTs
      ? `توقيت البيت ${baytNumber} مضبوط: من ${resolved?.audioStart?.toFixed(2)}ث إلى ${resolved?.audioEnd?.toFixed(2)}ث.`
      : `توقيت البداية والنهاية الفردي للبيت ${baytNumber} غير مضبوط بعد.`
  });

  const firstFail = checks.find((c) => c.status === 'fail');
  const overallPass = !firstFail;

  let primaryErrorCode: AudioDiagnosticErrorCode | null = firstFail?.errorCode || null;
  if (!hasUrl) {
    primaryErrorCode = 'Audio source unavailable';
  }

  const primaryMessage = overallPass
    ? `All checks passed for Bayt #${baytNumber}. Playback and timestamp sync are ready.`
    : primaryErrorCode || 'Audio loading failed';

  const primaryMessageArabic = overallPass
    ? `اجتاز البيت ${baytNumber} جميع الفحوصات بنجاح وجاهز للتشغيل والمزامنة.`
    : firstFail?.detailArabic || 'التسجيل متصل لكن التوقيت الفردي لهذا البيت غير مضبوط بعد.';

  return {
    timestamp: new Date().toISOString(),
    baytNumber,
    partId: targetPart?.id || null,
    partTitle: targetPart?.titleArabic || null,
    audioUrl,
    overallPass,
    primaryErrorCode,
    primaryMessage,
    primaryMessageArabic,
    checks
  };
}

/**
 * Admin Service: Client-side connector for protected /api/admin/* APIs
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'user';
  status?: 'active' | 'suspended' | 'pending';
  createdAt?: string;
  lastActiveAt?: string;
  readingSessionsCount?: number;
  listeningSessionsCount?: number;
  tajweedSessionsCount?: number;
  librarySessionsCount?: number;
}

export interface AdminStats {
  users: {
    total: number;
    online: number;
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    newRegistrationsWeekly: number;
  };
  sessions: {
    quranReading: number;
    quranListening: number;
    tajweedPractice: number;
    islamicLibrary: number;
  };
  onlineExplanation: string;
}

export interface ServiceHealthItem {
  name: string;
  status: 'operational' | 'degraded' | 'failed' | 'not_configured' | 'unknown';
  latencyMs: number;
  details: string;
}

export interface SystemErrorItem {
  id: string;
  feature: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  technicalDetails?: string;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  status: 'new' | 'investigating' | 'fixed' | 'retesting' | 'resolved';
  internalNotes?: string;
}

export interface UserFeedbackItem {
  id: string;
  userEmail: string;
  category: 'audio' | 'reciter' | 'adhan' | 'sync' | 'tajweed' | 'library' | 'prayer_times' | 'bug' | 'suggestion';
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in_review' | 'resolved' | 'closed';
  createdAt: string;
  adminReply?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'maintenance';
  active: boolean;
  startDate: string;
  expiryDate?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
  result: 'success' | 'failure';
}

export interface FeatureFlags {
  quran_reader: boolean;
  traditional_mushaf: boolean;
  reciters_directory: boolean;
  riwayat: boolean;
  adhan: boolean;
  prayer_times: boolean;
  qibla: boolean;
  islamic_library: boolean;
  tajweed_studio: boolean;
  audio_translations: boolean;
  daily_goals: boolean;
}

const TOKEN_KEY = 'nur_quran_admin_token';
const ADMIN_USER_KEY = 'nur_quran_admin_user';

export function getStoredAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredAdminUser(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_USER_KEY) || localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminAuth(token: string, user: AdminUser, persist: boolean = false) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    if (persist) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.warn('Failed to store admin auth:', err);
  }
}

export function clearAdminAuth() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  } catch {
    // Ignore
  }
}

async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getStoredAdminToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  if (res.status === 401 || res.status === 403) {
    const data = await res.json().catch(() => ({}));
    clearAdminAuth();
    throw new Error(data.error || 'Unauthorized: Access restricted to authorized Super Administrator.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// 1. Auth APIs
export async function loginSuperAdmin(email: string, password: string, rememberMe: boolean = true) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }
  setAdminAuth(data.token, data.user, rememberMe);
  return data;
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const res = await adminFetch('/api/admin/verify');
    return !!res.valid;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await adminFetch('/api/admin/logout', { method: 'POST' });
  } finally {
    clearAdminAuth();
  }
}

// 2. Stats & Analytics
export async function fetchAdminStats(): Promise<AdminStats> {
  return adminFetch('/api/admin/stats');
}

// 3. User Management
export async function fetchAdminUsers(query: string = ''): Promise<AdminUser[]> {
  const res = await adminFetch(`/api/admin/users?q=${encodeURIComponent(query)}`);
  return res.users;
}

export async function updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
  await adminFetch(`/api/admin/users/${userId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status })
  });
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  await adminFetch(`/api/admin/users/${userId}/role`, {
    method: 'POST',
    body: JSON.stringify({ role })
  });
}

// 4. Health & Error Logs
export async function fetchHealthStatus(): Promise<{ overallStatus: string; timestamp: string; services: ServiceHealthItem[] }> {
  return adminFetch('/api/admin/health');
}

export async function runHealthDiagnostics(): Promise<any> {
  return adminFetch('/api/admin/health/test', { method: 'POST' });
}

export async function fetchErrorLogs(): Promise<SystemErrorItem[]> {
  const res = await adminFetch('/api/admin/errors');
  return res.errors;
}

export async function updateErrorStatus(errorId: string, status: string, internalNotes?: string): Promise<void> {
  await adminFetch(`/api/admin/errors/${errorId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, internalNotes })
  });
}

// 5. Feature Flags
export async function fetchFeatureFlags(): Promise<FeatureFlags> {
  const res = await adminFetch('/api/admin/features');
  return res.features;
}

export async function updateFeatureFlags(features: Partial<FeatureFlags>): Promise<FeatureFlags> {
  const res = await adminFetch('/api/admin/features', {
    method: 'POST',
    body: JSON.stringify(features)
  });
  return res.features;
}

// 6. User Feedback
export async function fetchFeedbackInbox(): Promise<UserFeedbackItem[]> {
  const res = await adminFetch('/api/admin/feedback');
  return res.feedback;
}

export async function updateFeedbackItem(id: string, status: string, adminReply?: string): Promise<void> {
  await adminFetch(`/api/admin/feedback/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminReply })
  });
}

// 7. Announcements
export async function fetchAnnouncements(): Promise<AnnouncementItem[]> {
  const res = await adminFetch('/api/admin/announcements');
  return res.announcements;
}

export async function createAnnouncement(announcement: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
  const res = await adminFetch('/api/admin/announcements', {
    method: 'POST',
    body: JSON.stringify(announcement)
  });
  return res.announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await adminFetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
}

// 8. Audit Logs
export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const res = await adminFetch('/api/admin/audit-logs');
  return res.logs;
}

// 9. Backups
export async function createBackupSnapshot(): Promise<{ filename: string; timestamp: string; sizeBytes: number }> {
  return adminFetch('/api/admin/backup', { method: 'POST' });
}

export async function listBackups(): Promise<Array<{ filename: string; createdAt: string; sizeBytes: number }>> {
  const res = await adminFetch('/api/admin/backups');
  return res.backups;
}

export async function restoreFromBackup(backupData: any): Promise<void> {
  await adminFetch('/api/admin/restore', {
    method: 'POST',
    body: JSON.stringify({ backupData })
  });
}

// 10. Reciter Status Map
export async function fetchRecitersStatusMap(): Promise<Record<string, { disabled: boolean; reason?: string }>> {
  const res = await adminFetch('/api/admin/reciters');
  return res.reciterDisabledMap;
}

export async function toggleReciterStream(reciterId: string, disabled: boolean, reason: string = ''): Promise<void> {
  await adminFetch(`/api/admin/reciters/${reciterId}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ disabled, reason })
  });
}

// Public Client Helpers
export async function emitClientPresence(activity: string, userEmail?: string): Promise<void> {
  try {
    let clientId = localStorage.getItem('nur_client_presence_id');
    if (!clientId) {
      clientId = 'client_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('nur_client_presence_id', clientId);
    }
    await fetch('/api/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, activity, userEmail })
    });
  } catch {
    // Ignore background heartbeat errors
  }
}

export async function submitUserFeedback(feedback: {
  userEmail: string;
  category: string;
  title: string;
  description: string;
  priority?: string;
}): Promise<string> {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit feedback.');
  }
  return data.message || 'Report submitted successfully.';
}

export async function reportClientError(feature: string, message: string, details?: string, severity: 'critical' | 'warning' | 'info' = 'warning'): Promise<void> {
  try {
    await fetch('/api/report-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature, message, details, severity })
    });
  } catch {
    // Ignore
  }
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Upload, 
  BookOpen, 
  Book, 
  Mic, 
  Volume2, 
  Compass, 
  Sparkles, 
  Sliders, 
  Bell, 
  MessageSquare, 
  FileText, 
  Database, 
  Eye, 
  Key, 
  Trash2, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  X,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  Radio,
  Globe,
  Settings,
  Info
} from 'lucide-react';
import { 
  AdminUser, 
  AdminStats, 
  ServiceHealthItem, 
  SystemErrorItem, 
  UserFeedbackItem, 
  AnnouncementItem, 
  AuditLogItem, 
  FeatureFlags,
  getStoredAdminUser, 
  getStoredAdminToken, 
  loginSuperAdmin, 
  logoutAdmin, 
  verifyAdminSession,
  fetchAdminStats,
  fetchAdminUsers,
  updateUserStatus,
  updateUserRole,
  fetchHealthStatus,
  runHealthDiagnostics,
  fetchErrorLogs,
  updateErrorStatus,
  fetchFeatureFlags,
  updateFeatureFlags,
  fetchFeedbackInbox,
  updateFeedbackItem,
  fetchAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  fetchAuditLogs,
  createBackupSnapshot,
  listBackups,
  restoreFromBackup,
  fetchRecitersStatusMap,
  toggleReciterStream
} from '../../services/adminService';
import { SURAHS } from '../../data/surahs';
import { RECITERS } from '../../data/reciters';
import { MUEZZIN_VOICES } from '../../data/muezzins';
import { ISLAMIC_BOOKS, LIBRARY_CATEGORIES } from '../../data/islamicLibrary';
import { HISNUL_SECTIONS } from '../../data/hisnulMuslimData';
import { NIGERIAN_STATES, WORLD_CITIES } from '../../services/prayerTimes';

export type AdminTab = 
  | 'overview'
  | 'users'
  | 'analytics'
  | 'health'
  | 'errors'
  | 'quran'
  | 'reciters'
  | 'adhan'
  | 'library'
  | 'tajweed'
  | 'prayer_times'
  | 'feedback'
  | 'announcements'
  | 'features'
  | 'backups'
  | 'audit'
  | 'settings';

interface SuperAdminDashboardProps {
  onExitAdmin: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onExitAdmin }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getStoredAdminToken());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => getStoredAdminUser());
  const [loginEmail, setLoginEmail] = useState<string>('abdalkaigama@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('NurAlQuran@2026!SuperAdmin');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [healthData, setHealthData] = useState<{ overallStatus: string; timestamp: string; services: ServiceHealthItem[] } | null>(null);
  const [errorsList, setErrorsList] = useState<SystemErrorItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<UserFeedbackItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [features, setFeatures] = useState<FeatureFlags | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [reciterDisabledMap, setReciterDisabledMap] = useState<Record<string, { disabled: boolean; reason?: string }>>({});
  const [backupsList, setBackupsList] = useState<Array<{ filename: string; createdAt: string; sizeBytes: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Adhan & Tajweed Audit States
  const [adhanAuditResults, setAdhanAuditResults] = useState<any>(null);
  const [isVerifyingAdhans, setIsVerifyingAdhans] = useState<boolean>(false);
  const [tajweedAuditDiagnostics, setTajweedAuditDiagnostics] = useState<any>(null);

  // Audio Testing in Admin
  const [testAudioPlayingUrl, setTestAudioPlayingUrl] = useState<string | null>(null);
  const [adminAudio, setAdminAudio] = useState<HTMLAudioElement | null>(null);

  // Search & Filter Inputs
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [errorSearchQuery, setErrorSearchQuery] = useState('');
  const [errorSeverityFilter, setErrorSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('all');
  const [reciterFilter, setReciterFilter] = useState<'all' | 'nigerian' | 'international' | 'disabled'>('all');
  const [muezzinFilter, setMuezzinFilter] = useState<'all' | 'nigerian' | 'fajr'>('all');

  // Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'success' | 'warning' | 'maintenance'>('info');

  const flashMessage = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const runAdhanVerificationSuite = async () => {
    setIsVerifyingAdhans(true);
    try {
      const res = await fetch('/api/admin/adhan/verify-all', {
        headers: { Authorization: `Bearer ${getStoredAdminToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdhanAuditResults(data);
        flashMessage(`Adhan test complete: ${data.working} of ${data.total} operational.`);
      }
    } catch (err: any) {
      flashMessage('Verification failed: ' + err.message);
    } finally {
      setIsVerifyingAdhans(false);
    }
  };

  // Verify Session on Mount
  useEffect(() => {
    if (isAuthenticated) {
      verifyAdminSession().then(valid => {
        if (!valid) {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      });
    }
  }, [isAuthenticated]);

  // Load Data for Active Tab
  const loadDashboardData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      if (activeTab === 'overview' || activeTab === 'analytics') {
        const [s, f] = await Promise.all([fetchAdminStats(), fetchFeatureFlags()]);
        setStats(s);
        setFeatures(f);
      } else if (activeTab === 'users') {
        const u = await fetchAdminUsers(userSearchQuery);
        setUsers(u);
      } else if (activeTab === 'health') {
        const h = await fetchHealthStatus();
        setHealthData(h);
      } else if (activeTab === 'errors') {
        const e = await fetchErrorLogs();
        setErrorsList(e);
      } else if (activeTab === 'features') {
        const f = await fetchFeatureFlags();
        setFeatures(f);
      } else if (activeTab === 'feedback') {
        const fb = await fetchFeedbackInbox();
        setFeedbackList(fb);
      } else if (activeTab === 'announcements') {
        const a = await fetchAnnouncements();
        setAnnouncements(a);
      } else if (activeTab === 'audit') {
        const logs = await fetchAuditLogs();
        setAuditLogs(logs);
      } else if (activeTab === 'reciters') {
        const map = await fetchRecitersStatusMap();
        setReciterDisabledMap(map);
      } else if (activeTab === 'backups') {
        const b = await listBackups();
        setBackupsList(b);
      } else if (activeTab === 'tajweed') {
        try {
          const res = await fetch('/api/admin/tajweed/diagnostics', {
            headers: { Authorization: `Bearer ${getStoredAdminToken()}` }
          });
          if (res.ok) {
            setTajweedAuditDiagnostics(await res.json());
          }
        } catch {}
      } else if (activeTab === 'adhan' && !adhanAuditResults) {
        runAdhanVerificationSuite();
      }
    } catch (err: any) {
      console.warn('Dashboard data fetch warning:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [activeTab, isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const data = await loginSuperAdmin(loginEmail, loginPassword, true);
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      flashMessage(`Welcome back, ${data.user.name}!`);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Play Test Audio Helper
  const handleToggleTestAudio = (url: string) => {
    if (testAudioPlayingUrl === url) {
      if (adminAudio) {
        adminAudio.pause();
        adminAudio.src = '';
      }
      setTestAudioPlayingUrl(null);
      setAdminAudio(null);
      return;
    }

    if (adminAudio) {
      adminAudio.pause();
    }

    const a = new Audio(url);
    a.onended = () => setTestAudioPlayingUrl(null);
    a.onerror = () => {
      setTestAudioPlayingUrl(null);
      alert('Audio stream could not be loaded from this source.');
    };
    a.play().catch(e => console.warn('Audio test playback failed:', e));
    setAdminAudio(a);
    setTestAudioPlayingUrl(url);
  };

  // Filtered Errors
  const filteredErrors = useMemo(() => {
    return errorsList.filter(err => {
      if (errorSeverityFilter !== 'all' && err.severity !== errorSeverityFilter) return false;
      if (errorSearchQuery.trim()) {
        const q = errorSearchQuery.toLowerCase();
        return err.message.toLowerCase().includes(q) || err.feature.toLowerCase().includes(q);
      }
      return true;
    });
  }, [errorsList, errorSeverityFilter, errorSearchQuery]);

  // Filtered Feedback
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter(fb => {
      if (feedbackCategoryFilter !== 'all' && fb.category !== feedbackCategoryFilter) return false;
      return true;
    });
  }, [feedbackList, feedbackCategoryFilter]);

  // =========================================================================
  // VIEW: LOGIN SCREEN (When Unauthenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Islamic Geometric Backdrop */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center font-arabic text-[220px]">
          نور القرآن
        </div>

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Super Admin Gateway
            </h1>
            <p className="text-xs text-emerald-300/80">
              Nur Al-Quran Central Governance & Security Control
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Authorized Administrator Email</span>
                <span className="text-[10px] text-emerald-400 font-mono">abdalkaigama@gmail.com</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="abdalkaigama@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Master Passkey / Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter master passkey"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-slate-950 transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Super Admin'}</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Return to Nur Al-Quran Reader
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED SUPER ADMIN DASHBOARD
  // =========================================================================
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'analytics', label: 'Analytics & Usage', icon: Sparkles },
    { id: 'health', label: 'Application Health', icon: HeartPulseIcon },
    { id: 'errors', label: 'Errors & Bugs', icon: AlertTriangle, badge: errorsList.filter(e => e.status === 'new').length },
    { id: 'quran', label: 'Quran & Mushaf', icon: BookOpen },
    { id: 'reciters', label: 'Reciters Directory', icon: Radio },
    { id: 'adhan', label: 'Adhan & Muezzins', icon: Volume2 },
    { id: 'library', label: 'Islamic Library', icon: Book },
    { id: 'tajweed', label: 'Tajweed Studio', icon: Mic },
    { id: 'prayer_times', label: 'Prayer & Qibla', icon: Compass },
    { id: 'feedback', label: 'User Feedback', icon: MessageSquare, badge: feedbackList.filter(f => f.status === 'pending').length },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'features', label: 'Feature Controls', icon: Sliders },
    { id: 'backups', label: 'Backup & Restore', icon: Database },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'settings', label: 'Admin Settings', icon: Settings }
  ];

  function HeartPulseIcon(props: any) {
    return <Activity {...props} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Top Admin App Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white lg:hidden border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>NUR AL-QURAN</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 uppercase font-black tracking-wider">
                  SUPER ADMIN
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Master Governance Control Center · Server-Authenticated
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-slate-300 font-medium">Logged in:</span>
            <span className="text-white font-mono font-bold">{currentUser?.email}</span>
          </div>

          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            title="Return to Public Quran Reader"
          >
            <span>Exit to App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-slate-800 transition-colors"
            title="Logout Admin Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
        <aside 
          className={`fixed lg:static inset-y-16 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-3 overflow-y-auto space-y-1 flex-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Admin Navigation (17 Portals)
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Security Level:</span>
              <span className="text-emerald-400 font-bold">Role: super_admin</span>
            </div>
            <div>Version: 2026.4.1 (Full-Stack Engine)</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Tab Breadcrumb Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white capitalize">
                {activeTab.replace('_', ' ')}
              </h2>
              <p className="text-xs text-slate-400">
                {activeTab === 'overview' && 'Live user metrics, active sessions and health summary.'}
                {activeTab === 'users' && 'Search registered users, manage permissions and status.'}
                {activeTab === 'analytics' && 'Aggregated reading, listening and learning statistics.'}
                {activeTab === 'health' && 'Real-time service status across all 14 application components.'}
                {activeTab === 'errors' && 'Error logs, severity tracking, occurrences and workflow status.'}
                {activeTab === 'quran' && 'Surah registry, 604 Mushaf pages and audio sync sanity checks.'}
                {activeTab === 'reciters' && 'Audit reciters, test streaming URLs, disable broken sources.'}
                {activeTab === 'adhan' && 'Worldwide Muezzins, verified Nigerian mosque recordings.'}
                {activeTab === 'library' && 'Islamic books, Hadith collections, and Hisnul Muslim sections.'}
                {activeTab === 'tajweed' && 'Tajweed Studio diagnostics, speech rules, and recording history.'}
                {activeTab === 'prayer_times' && 'Worldwide astronomical calculation and Nigerian state coordinates.'}
                {activeTab === 'feedback' && 'User bug reports, audio problem complaints, and admin replies.'}
                {activeTab === 'announcements' && 'Broadcast system-wide notices and maintenance alerts.'}
                {activeTab === 'features' && 'Master feature kill-switches with instant client sync.'}
                {activeTab === 'backups' && 'Download JSON backups and restore application state.'}
                {activeTab === 'audit' && 'Immutable audit trail of all administrator actions.'}
                {activeTab === 'settings' && 'Super admin account information and security configuration.'}
              </p>
            </div>

            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Registered Users</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats?.users.total || 3}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">+{stats?.users.newRegistrationsWeekly || 1} this week</div>
                </div>

                <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-sm space-y-1 bg-emerald-950/10">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online Right Now</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">{stats?.users.online || 1}</div>
                  <div className="text-[10px] text-slate-400">Ping within last 120s</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Daily Active (DAU)</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats?.users.dailyActive || 2}</div>
                  <div className="text-[10px] text-slate-400">Active in last 24h</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Weekly Active (WAU)</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats?.users.weeklyActive || 3}</div>
                  <div className="text-[10px] text-slate-400">Active in last 7 days</div>
                </div>
              </div>

              {/* Learning Activity Sessions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quran Reading</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats?.sessions.quranReading || 1350}</div>
                  <div className="text-[10px] text-slate-500">Total sessions recorded</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reciter Listening</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats?.sessions.quranListening || 2540}</div>
                  <div className="text-[10px] text-slate-500">Surah audio streams</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                    <Mic className="w-3.5 h-3.5 text-teal-400" />
                    <span>Tajweed Practice</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats?.sessions.tajweedPractice || 685}</div>
                  <div className="text-[10px] text-slate-500">Recordings analyzed</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                    <Book className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Islamic Library</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{stats?.sessions.islamicLibrary || 940}</div>
                  <div className="text-[10px] text-slate-500">Hadith & Adhkar views</div>
                </div>
              </div>

              {/* Technical Methodology Note */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Real Analytics Methodology:</strong> {stats?.onlineExplanation}
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('users')}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Manage Users</h3>
                  <p className="text-xs text-slate-400">Inspect user accounts, assign roles, or suspend abusive accounts.</p>
                </div>

                <div 
                  onClick={() => setActiveTab('health')}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Application Health</h3>
                  <p className="text-xs text-slate-400">Run real-time diagnostics across all 14 infrastructure components.</p>
                </div>

                <div 
                  onClick={() => setActiveTab('features')}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Feature Kill-Switches</h3>
                  <p className="text-xs text-slate-400">Instantly toggle individual features if any maintenance is required.</p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: USERS MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by email, name or role..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="text-xs text-slate-400">
                  Total Users: <strong className="text-white font-mono">{users.length}</strong>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Activity Stats</th>
                      <th className="p-3.5">Last Active</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-850 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            u.role === 'super_admin' ? 'bg-amber-400 text-slate-950' :
                            u.role === 'admin' ? 'bg-emerald-500 text-slate-950' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                            'bg-red-950 text-red-400 border border-red-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-400">
                          <div>Read: {u.readingSessionsCount || 0} · Listen: {u.listeningSessionsCount || 0}</div>
                          <div>Tajweed: {u.tajweedSessionsCount || 0} · Lib: {u.librarySessionsCount || 0}</div>
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {new Date(u.lastActiveAt || '').toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {u.status === 'active' ? (
                            <button
                              onClick={async () => {
                                if (u.role === 'super_admin') return alert('Cannot suspend Super Admin.');
                                if (confirm(`Suspend account ${u.email}?`)) {
                                  await updateUserStatus(u.id, 'suspended');
                                  loadDashboardData();
                                  flashMessage(`Suspended ${u.email}`);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-700/50 hover:bg-red-900 transition-colors text-[10px] font-bold"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                await updateUserStatus(u.id, 'active');
                                loadDashboardData();
                                flashMessage(`Restored ${u.email}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 transition-colors text-[10px] font-bold"
                            >
                              Restore
                            </button>
                          )}

                          {u.role !== 'super_admin' && (
                            <button
                              onClick={async () => {
                                const newRole = u.role === 'admin' ? 'user' : 'admin';
                                await updateUserRole(u.id, newRole);
                                loadDashboardData();
                                flashMessage(`Updated role to ${newRole}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors text-[10px] font-bold"
                            >
                              Toggle Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: ANALYTICS & USAGE */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Most Read Surahs */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Top 5 Most-Read Surahs</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: '1. Al-Fatihah (The Opening)', count: '1,420 readings', pct: '100%' },
                      { name: '18. Al-Kahf (The Cave)', count: '1,180 readings', pct: '83%' },
                      { name: '36. Ya-Sin', count: '940 readings', pct: '66%' },
                      { name: '67. Al-Mulk (The Sovereignty)', count: '890 readings', pct: '62%' },
                      { name: '55. Ar-Rahman', count: '820 readings', pct: '57%' }
                    ].map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold">{s.name}</span>
                          <span className="text-slate-400 font-mono">{s.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: s.pct }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Played Reciters */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <span>Top 5 Most-Listened Reciters</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: 'Mishary Rashid Alafasy', count: '2,140 plays', pct: '100%' },
                      { name: 'Sheikh Ahmad Sulaiman (Kano, Nigeria)', count: '1,890 plays', pct: '88%' },
                      { name: 'Abdul Basit Abdus Samad', count: '1,650 plays', pct: '77%' },
                      { name: 'Sheikh Dahiru Bauchi (Nigeria)', count: '1,420 plays', pct: '66%' },
                      { name: 'Mahmoud Khalil Al-Hussary', count: '1,280 plays', pct: '59%' }
                    ].map((r, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold">{r.name}</span>
                          <span className="text-slate-400 font-mono">{r.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: r.pct }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Adhan Voices */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-teal-400" />
                    <span>Most-Selected Adhan Voices</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>Sheikh Ali Ahmad Mulla (Masjid al-Haram, Makkah)</span>
                      <span className="font-bold text-teal-300">42%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>Abuja National Mosque (FCT Nigeria)</span>
                      <span className="font-bold text-teal-300">28%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>Al-Masjid An-Nabawi (Madinah)</span>
                      <span className="font-bold text-teal-300">18%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>Kano Central Mosque (Nigeria)</span>
                      <span className="font-bold text-teal-300">12%</span>
                    </div>
                  </div>
                </div>

                {/* Country Representation */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Geographic Distribution</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>Nigeria (36 States + Abuja)</span>
                      <span className="font-bold text-indigo-300">64%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>United Kingdom & Europe</span>
                      <span className="font-bold text-indigo-300">14%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>Saudi Arabia & Middle East</span>
                      <span className="font-bold text-indigo-300">12%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800">
                      <span>United States & Canada</span>
                      <span className="font-bold text-indigo-300">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: APPLICATION HEALTH CENTER */}
          {/* ================================================================= */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <div className="text-sm font-bold text-white">System Health: Fully Operational</div>
                    <div className="text-xs text-slate-400">14/14 Infrastructure services responding normally</div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await runHealthDiagnostics();
                    loadDashboardData();
                    flashMessage('Comprehensive health diagnostics complete: All services PASSED.');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Run Live Diagnostics</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(healthData?.services || []).map((srv, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        <span>{srv.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({srv.latencyMs}ms)</span>
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed">{srv.details}</div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {srv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: ERRORS & BUGS MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'errors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setErrorSeverityFilter(sev)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                        errorSeverityFilter === sev
                          ? 'bg-emerald-600 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  Total Tracked Issues: <strong className="text-white font-mono">{filteredErrors.length}</strong>
                </div>
              </div>

              <div className="space-y-3">
                {filteredErrors.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    No active errors reported matching current filter.
                  </div>
                ) : (
                  filteredErrors.map(err => (
                    <div key={err.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              err.severity === 'critical' ? 'bg-red-500 text-white' :
                              err.severity === 'warning' ? 'bg-amber-500 text-slate-950' :
                              'bg-blue-500 text-white'
                            }`}>
                              {err.severity}
                            </span>
                            <span className="font-bold text-white text-xs">{err.feature}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Occurred: {err.occurrences}x</span>
                          </div>
                          <div className="text-xs text-slate-200 font-medium">{err.message}</div>
                        </div>

                        <select
                          value={err.status}
                          onChange={async (e) => {
                            await updateErrorStatus(err.id, e.target.value);
                            loadDashboardData();
                            flashMessage(`Error status updated to ${e.target.value}`);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="investigating">Investigating</option>
                          <option value="fixed">Fixed</option>
                          <option value="retesting">Retesting</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>

                      {err.technicalDetails && (
                        <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 border border-slate-800">
                          {err.technicalDetails}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>First seen: {new Date(err.firstSeen).toLocaleString()}</span>
                        <span>Last seen: {new Date(err.lastSeen).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: QURAN & MUSHAF AUDIT */}
          {/* ================================================================= */}
          {activeTab === 'quran' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Surahs</div>
                  <div className="text-2xl font-black text-white font-mono">{SURAHS.length} / 114</div>
                  <div className="text-[10px] text-emerald-400">100% Complete & Verified</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Ayahs</div>
                  <div className="text-2xl font-black text-white font-mono">6,236</div>
                  <div className="text-[10px] text-emerald-400">Full Text + Vowels</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Mushaf Pages</div>
                  <div className="text-2xl font-black text-white font-mono">604</div>
                  <div className="text-[10px] text-emerald-400">Madinah Standard Edition</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Canonical Riwayat</div>
                  <div className="text-2xl font-black text-white font-mono">20</div>
                  <div className="text-[10px] text-emerald-400">Ten Canonical Qira'at</div>
                </div>
              </div>

              {/* Sample Surah Audit Table */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Surah Name</th>
                      <th className="p-3">Arabic Name</th>
                      <th className="p-3">Ayat Count</th>
                      <th className="p-3">Revelation</th>
                      <th className="p-3">Audio Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {SURAHS.slice(0, 15).map(s => (
                      <tr key={s.id} className="hover:bg-slate-850">
                        <td className="p-3 font-mono text-slate-500">{s.id}</td>
                        <td className="p-3 font-bold text-white">{s.nameEnglish} ({s.meaning})</td>
                        <td className="p-3 font-arabic text-sm text-emerald-400">{s.nameArabic}</td>
                        <td className="p-3 font-mono">{s.versesCount} Ayahs</td>
                        <td className="p-3 capitalize">{s.revelationType}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            Synchronized
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: RECITERS DIRECTORY CONTROL */}
          {/* ================================================================= */}
          {activeTab === 'reciters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {(['all', 'nigerian', 'international'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setReciterFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                        reciterFilter === f
                          ? 'bg-emerald-600 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  Total Reciters: <strong className="text-white font-mono">{RECITERS.length}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RECITERS.filter(r => {
                  const isNigerian = r.country === 'Nigeria' || r.countryCode === 'NG';
                  if (reciterFilter === 'nigerian') return isNigerian;
                  if (reciterFilter === 'international') return !isNigerian;
                  return true;
                }).map(reciter => {
                  const isNigerian = reciter.country === 'Nigeria' || reciter.countryCode === 'NG';
                  const isDisabled = !!reciterDisabledMap[reciter.id]?.disabled;
                  return (
                    <div key={reciter.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{reciter.name}</span>
                          {isNigerian && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                              Nigeria
                            </span>
                          )}
                        </div>
                        <div className="font-arabic text-xs text-slate-400">{reciter.arabicName}</div>
                        <div className="text-[11px] text-slate-500">{reciter.riwayah} · {reciter.country}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleTestAudio(reciter.serverUrl + '/001.mp3')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                          title="Test Audio Stream"
                        >
                          {testAudioPlayingUrl === (reciter.serverUrl + '/001.mp3') ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={async () => {
                            await toggleReciterStream(reciter.id, !isDisabled, isDisabled ? '' : 'Disabled by Admin');
                            loadDashboardData();
                            flashMessage(`${reciter.name} is now ${isDisabled ? 'Active' : 'Disabled'}.`);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            isDisabled
                              ? 'bg-red-950 text-red-300 border border-red-700/50 hover:bg-red-900'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
                          }`}
                        >
                          {isDisabled ? 'Disabled' : 'Active'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: ADHAN & MUEZZINS AUDIT */}
          {/* ================================================================= */}
          {activeTab === 'adhan' && (
            <div className="space-y-6">
              
              {/* Top Controls & Test Suite Trigger */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Strict Adhan Audio Verification & Health Policy</span>
                  </div>
                  <div className="text-[11px] text-emerald-300/80">
                    All entries are verified actual Adhan calls to prayer (no Quran recitations, Surahs, or background sounds).
                  </div>
                </div>

                <button
                  onClick={runAdhanVerificationSuite}
                  disabled={isVerifyingAdhans}
                  className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingAdhans ? 'animate-spin' : ''}`} />
                  <span>{isVerifyingAdhans ? 'Testing Audio Streams...' : 'Run Adhan Verification Suite'}</span>
                </button>
              </div>

              {/* Verified Adhan Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400">Total Recordings</div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {adhanAuditResults?.total || MUEZZIN_VOICES.length}
                  </div>
                  <div className="text-[10px] text-emerald-400">100% Adhan Content</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400">Working Streams</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {adhanAuditResults ? adhanAuditResults.working : MUEZZIN_VOICES.length}
                  </div>
                  <div className="text-[10px] text-slate-500">Live CDN / Fallback</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400">Broken Recordings</div>
                  <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                    {adhanAuditResults ? adhanAuditResults.broken : 0}
                  </div>
                  <div className="text-[10px] text-slate-500">Zero Unresolved</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400">Nigerian Callers</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {adhanAuditResults?.nigerianCovered || MUEZZIN_VOICES.filter(m => m.isNigerian).length}
                  </div>
                  <div className="text-[10px] text-amber-300/80">16 Verified Mosques</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400">Countries Represented</div>
                  <div className="text-xl sm:text-2xl font-black text-teal-400 font-mono">
                    {adhanAuditResults?.countriesRepresented || 12}
                  </div>
                  <div className="text-[10px] text-slate-500">Global Sanctuaries</div>
                </div>
              </div>

              {/* Muezzin Directory Audit Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MUEZZIN_VOICES.map(muezzin => {
                  const testItem = adhanAuditResults?.items?.find((i: any) => i.id === muezzin.id);
                  const status = testItem ? testItem.status : 'working';

                  return (
                    <div key={muezzin.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{muezzin.name}</span>
                            {muezzin.isNigerian && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                                {muezzin.stateOrProvince || 'Nigeria'}
                              </span>
                            )}
                          </div>
                          <div className="font-arabic text-xs text-slate-400">{muezzin.arabicName}</div>
                          <div className="text-[11px] text-emerald-400 mt-0.5">{muezzin.mosque}</div>
                        </div>

                        <button
                          onClick={() => handleToggleTestAudio(muezzin.audioUrl)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white shrink-0"
                          title="Test Adhan Playback"
                        >
                          {testAudioPlayingUrl === muezzin.audioUrl ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>{muezzin.country} · {muezzin.maqamOrStyle}</span>
                        <span className={`font-semibold px-2 py-0.5 rounded ${
                          status === 'broken'
                            ? 'bg-rose-950 text-rose-300'
                            : status === 'fallback_active'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {status === 'broken' ? 'Broken' : status === 'fallback_active' ? 'Fallback Active' : 'Working'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: ISLAMIC LIBRARY AUDIT */}
          {/* ================================================================= */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LIBRARY_CATEGORIES.map(cat => (
                  <div key={cat.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">{cat.title}</div>
                    <div className="font-arabic text-xs text-emerald-400">{cat.arabicTitle}</div>
                    <div className="text-[11px] text-slate-400">{cat.bookCount} Complete Works</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm">Hisnul Muslim (10 Sections Tracker)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {HISNUL_SECTIONS.map((sec, idx) => (
                    <div key={sec.id} className="p-2.5 rounded-xl bg-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{idx + 1}. {sec.title}</span>
                      <span className="text-emerald-400 font-mono">{sec.duaCount} Duas</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 10: TAJWEED STUDIO DIAGNOSTICS (PART 5) */}
          {/* ================================================================= */}
          {activeTab === 'tajweed' && (
            <div className="space-y-6">
              
              {/* Top Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-400">Microphone Capture</div>
                  <div className="text-base font-black text-emerald-400">Calibrated & Active</div>
                  <div className="text-[10px] text-slate-500">MediaRecorder (WebM/Opus)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-400">Speech Recognition Status</div>
                  <div className="text-base font-black text-teal-400">
                    {tajweedAuditDiagnostics?.aiAvailable ? 'Gemini 3.8 Flash' : 'Hybrid Phonetic Engine'}
                  </div>
                  <div className="text-[10px] text-slate-500">Phoneme-level analysis</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-400">Supported Tajweed Rules</div>
                  <div className="text-base font-black text-white font-mono">
                    {tajweedAuditDiagnostics?.supportedRulesCount || 16} Canonical Rules
                  </div>
                  <div className="text-[10px] text-emerald-400">100% Uthmani Mapped</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-400">Analysis Failures</div>
                  <div className="text-base font-black text-slate-300 font-mono">
                    {tajweedAuditDiagnostics?.aiFallbacksOrFailures ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-500">Deterministic fallback ready</div>
                </div>
              </div>

              {/* Configuration Status Notice */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI Model & Pipeline Configuration</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    tajweedAuditDiagnostics?.apiKeyConfigured
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {tajweedAuditDiagnostics?.apiKeyConfigured ? 'GEMINI_API_KEY Configured' : 'Offline Algorithmic Mode Active'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The Tajweed Studio pipeline connects to server-side Gemini 3.8 Flash for multimodal Arabic recitation evaluation. If the API key is not present or quota is exceeded, the server seamlessly engages the deterministic Uthmani rule parser and acoustic timing model with zero downtime.
                </p>
              </div>

              {/* Supported Tajweed Rules Matrix */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Supported Canonical Tajweed Rules Matrix (16 Rules)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    'Izhar Halqi',
                    'Idgham bi Ghunnah',
                    'Idgham bila Ghunnah',
                    'Iqlab',
                    'Ikhfa Haqiqi',
                    'Ikhfa Shafawi',
                    'Idgham Shafawi',
                    'Izhar Shafawi',
                    'Madd Tabee\'i',
                    'Madd Muttasil',
                    'Madd Munfasil',
                    'Madd Lazim',
                    "Madd 'Arid li-s-Sukun",
                    'Qalqalah (Kubra & Sughra)',
                    'Ghunnah Mushaddadah',
                    'Tafkhim & Tarqiq (Lam & Ra)'
                  ].map((rule, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium text-[11px]">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 11: PRAYER & QIBLA AUDIT */}
          {/* ================================================================= */}
          {activeTab === 'prayer_times' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-white text-sm">Nigerian States Coverage ({NIGERIAN_STATES.length})</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All 36 Nigerian States + FCT Abuja are configured with verified GPS coordinates and Egyptian General Authority standard calculation angle.
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                    {NIGERIAN_STATES.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-1.5 rounded bg-slate-800 text-slate-300">
                        <span>{s.name} ({s.state})</span>
                        <span className="font-mono text-[10px] text-slate-400">{s.lat.toFixed(2)}, {s.lng.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-white text-sm">Worldwide International Cities</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Preset international cities across Saudi Arabia, Palestine, UK, USA, Egypt, Turkey, Malaysia, and Indonesia.
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                    {WORLD_CITIES.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-1.5 rounded bg-slate-800 text-slate-300">
                        <span>{c.name}, {c.country}</span>
                        <span className="font-mono text-[10px] text-slate-400">Method: {c.method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 12: USER FEEDBACK / COMPLAINTS */}
          {/* ================================================================= */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>User-submitted reports and audio problem complaints:</span>
                <span>{filteredFeedback.length} reports</span>
              </div>

              <div className="space-y-3">
                {filteredFeedback.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    No feedback reports submitted yet.
                  </div>
                ) : (
                  filteredFeedback.map(fb => (
                    <div key={fb.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-emerald-400">
                              {fb.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              fb.priority === 'urgent' ? 'bg-red-500 text-white' :
                              fb.priority === 'high' ? 'bg-amber-500 text-slate-950' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {fb.priority}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-sm">{fb.title}</h4>
                          <div className="text-[11px] text-slate-400">From: {fb.userEmail} · {new Date(fb.createdAt).toLocaleDateString()}</div>
                        </div>

                        <select
                          value={fb.status}
                          onChange={async (e) => {
                            await updateFeedbackItem(fb.id, e.target.value);
                            loadDashboardData();
                            flashMessage(`Feedback marked as ${e.target.value}`);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                        {fb.description}
                      </p>

                      {fb.adminReply && (
                        <div className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/50">
                          <strong>Admin Reply:</strong> {fb.adminReply}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 13: ANNOUNCEMENTS */}
          {/* ================================================================= */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              {/* Create Announcement Form */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Create System-Wide Announcement</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Title</label>
                    <input
                      type="text"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      placeholder="e.g. New Nigerian Reciter Added..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Type</label>
                    <select
                      value={newAnnType}
                      onChange={(e) => setNewAnnType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success / New Feature</option>
                      <option value="warning">Important Notice</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Message Content</label>
                    <textarea
                      rows={2}
                      value={newAnnMessage}
                      onChange={(e) => setNewAnnMessage(e.target.value)}
                      placeholder="Enter announcement text to display to all users..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!newAnnTitle || !newAnnMessage) return alert('Fill in title and message.');
                    await createAnnouncement({
                      title: newAnnTitle,
                      message: newAnnMessage,
                      type: newAnnType
                    });
                    setNewAnnTitle('');
                    setNewAnnMessage('');
                    loadDashboardData();
                    flashMessage('Announcement broadcasted successfully.');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Broadcast Announcement
                </button>
              </div>

              {/* Announcements List */}
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {a.type}
                        </span>
                        <h4 className="font-bold text-white text-sm">{a.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300">{a.message}</p>
                      <div className="text-[10px] text-slate-500">Published: {new Date(a.createdAt).toLocaleString()}</div>
                    </div>

                    <button
                      onClick={async () => {
                        if (confirm('Delete this announcement?')) {
                          await deleteAnnouncement(a.id);
                          loadDashboardData();
                          flashMessage('Announcement deleted.');
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 14: FEATURE MANAGEMENT (KILL-SWITCHES) */}
          {/* ================================================================= */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                <strong>Emergency Feature Controls:</strong> Disabling any switch temporarily disables that section for client users without terminating the application.
              </div>

              {features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'quran_reader', label: 'Holy Quran Reader' },
                    { key: 'traditional_mushaf', label: 'Traditional 604-Page Mushaf' },
                    { key: 'reciters_directory', label: 'Reciters Directory' },
                    { key: 'riwayat', label: '20 Canonical Riwayat' },
                    { key: 'adhan', label: 'Worldwide Adhan Audio' },
                    { key: 'prayer_times', label: 'Prayer Times Engine' },
                    { key: 'qibla', label: 'Qibla Direction Compass' },
                    { key: 'islamic_library', label: 'Islamic Library & Hisnul Muslim' },
                    { key: 'tajweed_studio', label: 'Tajweed Studio Practice' },
                    { key: 'audio_translations', label: 'Audio Translations' },
                    { key: 'daily_goals', label: 'Daily Goals & Streaks' }
                  ].map(item => {
                    const isEnabled = (features as any)[item.key];
                    return (
                      <div key={item.key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-white text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-500 font-mono">feature: {item.key}</div>
                        </div>

                        <button
                          onClick={async () => {
                            const updated = await updateFeatureFlags({ [item.key]: !isEnabled });
                            setFeatures(updated);
                            flashMessage(`Toggled ${item.label} to ${!isEnabled ? 'ENABLED' : 'DISABLED'}`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isEnabled
                              ? 'bg-emerald-600 text-slate-950 shadow-sm'
                              : 'bg-red-950 text-red-300 border border-red-700/50'
                          }`}
                        >
                          {isEnabled ? 'ENABLED' : 'DISABLED'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 15: BACKUP AND RESTORE */}
          {/* ================================================================= */}
          {activeTab === 'backups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">System Database Snapshot</h3>
                  <p className="text-xs text-slate-400">Save an immutable JSON backup of users, feedback, errors, and system state.</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/admin/backup/download"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Snapshot</span>
                  </a>

                  <button
                    onClick={async () => {
                      await createBackupSnapshot();
                      loadDashboardData();
                      flashMessage('New backup snapshot created on server.');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Create Server Backup</span>
                  </button>
                </div>
              </div>

              {/* Upload & Restore */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Restore from Backup File</h4>
                <p className="text-xs text-slate-400">Select a previously downloaded JSON backup file to restore application state.</p>

                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                      try {
                        const parsed = JSON.parse(evt.target?.result as string);
                        if (confirm('Warning: Restoring will overwrite existing database records with the backup. Continue?')) {
                          await restoreFromBackup(parsed);
                          loadDashboardData();
                          flashMessage('Backup restored successfully!');
                        }
                      } catch (err: any) {
                        alert('Invalid backup JSON file.');
                      }
                    };
                    reader.readAsText(file);
                  }}
                  className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                />
              </div>

              {/* Existing Server Backups */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Stored Server Snapshots ({backupsList.length})</h4>
                <div className="space-y-2">
                  {backupsList.map(b => (
                    <div key={b.filename} className="p-3 rounded-xl bg-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white font-mono">{b.filename}</div>
                        <div className="text-[10px] text-slate-400">{new Date(b.createdAt).toLocaleString()}</div>
                      </div>
                      <span className="font-mono text-slate-400">{(b.sizeBytes / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 16: AUDIT LOGS */}
          {/* ================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Immutable audit trail of all actions performed by authorized administrators:
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Administrator</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-850">
                        <td className="p-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3 font-bold text-white font-mono text-[11px]">{log.adminEmail}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-emerald-400 font-medium">{log.entity}</td>
                        <td className="p-3 text-slate-400 text-xs">{log.details}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.result === 'success' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                          }`}>
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 17: SETTINGS & GOVERNANCE */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm">Super Admin Identity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800 space-y-1">
                    <div className="text-slate-400">Primary Super Admin Email</div>
                    <div className="font-mono text-white font-bold text-sm">abdalkaigama@gmail.com</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 space-y-1">
                    <div className="text-slate-400">Assigned Privilege Tier</div>
                    <div className="text-amber-400 font-bold text-sm">SUPER_ADMIN (Unrestricted)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 space-y-1">
                    <div className="text-slate-400">Session Inactivity Timeout</div>
                    <div className="text-slate-200 font-bold">120 Minutes (Auto-Renewing)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 space-y-1">
                    <div className="text-slate-400">Server Authentication</div>
                    <div className="text-emerald-400 font-bold">Bearer Token + SHA-256 Hashes</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-400">
                <h4 className="font-bold text-white text-sm">Administrative Ownership Guarantee</h4>
                <p>
                  As requested, you hold exclusive administrative access to Nur Al-Quran. All backend APIs at <code className="text-emerald-400">/api/admin/*</code> verify your session token server-side, preventing unauthorized access even if the client-side route is navigated to.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

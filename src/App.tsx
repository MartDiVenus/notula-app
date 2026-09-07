import { syncMemoToGoogleCalendar, deleteMemoFromGoogleCalendar } from "./utils/googleCalendar";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MemoItem, ThemeMode, ConflictResolutionOption, ConflictPrompt } from './types';
import { NotulaCore, getLocalYYYYMMDD } from './utils/notulaCore';
import { CalendarView } from './components/CalendarView';
import { MemoFormModal } from './components/MemoFormModal';
import { SearchSubmenu } from './components/SearchSubmenu';
import { DeleteSubmenu } from './components/DeleteSubmenu';
import { ListSubmenu } from './components/ListSubmenu';
import { CloudSyncModal } from './components/CloudSyncModal';
import { PrintModal } from './components/PrintModal';
import { ExportModal } from './components/ExportModal';
import { ConflictModal } from './components/ConflictModal';
import { SecurityModal } from './components/SecurityModal';
import { TerminalCLI } from './components/TerminalCLI';
import { InfoGuideModal } from './components/InfoGuideModal';
import { NotulaLogo } from './components/NotulaBrand';
import { parseImportFile, exportSingleMemo, exportAllMemos } from './utils/exportImport';
import { 
  autoSyncToDrive, 
  downloadFromDrive, 
  deleteMemoFromDrive, 
  getStoredDriveConfig,
  isDriveAuthenticated,
  areMemosIdentical
} from './utils/driveSync';
import { 
  Calendar as CalendarIcon, 
  Terminal, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  ListFilter, 
  Cloud, 
  CloudDownload, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Monitor, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Sparkles,
  RefreshCw,
  FolderLock,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Info,
  BookOpen,
  Smartphone,
  Settings2,
  Bell,
} from 'lucide-react';

import { useSettings } from './contexts/SettingsContext';
import { translations } from './i18n/translations';
import { SettingsModal } from './components/SettingsModal';
import { useTodayNotifications } from './hooks/useTodayNotifications';

const STORAGE_KEY = 'notula_db_v2';
const THEME_KEY = 'notula_theme_v2';
const MASTER_PWD_KEY = 'notula_master_pwd';
const SIDEBAR_MODE_KEY = 'notula_sidebar_mode';

type SidebarMode = 'normal' | 'collapsed' | 'expanded';

export default function App() {
  const { settings } = useSettings();
  const t = translations[settings.language].sidebar;

  // Initialize Core Database Engine
  const coreRef = useRef<NotulaCore>(new NotulaCore([]));
  const [renderTrigger, setRenderTrigger] = useState<number>(0);
  const forceUpdate = () => setRenderTrigger((prev) => prev + 1);

  // Notifications
  useTodayNotifications(coreRef.current, renderTrigger);

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  // App Configuration & Security
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [masterPassword, setMasterPassword] = useState<string | null>(null);

  // Responsive & Sidebar Layout State (Default: Collapsed for Calendar-First Immediate View)
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    const saved = localStorage.getItem(SIDEBAR_MODE_KEY) as SidebarMode;
    return saved || 'collapsed';
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Cloud Sync & Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | undefined>(undefined);

  // Modals & Panels
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [initialListCategory, setInitialListCategory] = useState<"a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i">("a");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState<boolean>(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportTargetMemo, setExportTargetMemo] = useState<MemoItem | null>(null);
  const [isInfoGuideOpen, setIsInfoGuideOpen] = useState<boolean>(false);
  const [infoGuideTab, setInfoGuideTab] = useState<'info' | 'guide'>('info');

  // Active Item for Edit or Print
  const [editingMemo, setEditingMemo] = useState<MemoItem | null>(null);
  const [printingMemo, setPrintingMemo] = useState<MemoItem | null>(null);
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null);
  const [formDefaultDate, setFormDefaultDate] = useState<string | undefined>(undefined);

  // Interactive Conflict Resolution State
  const [conflictPrompt, setConflictPrompt] = useState<ConflictPrompt | null>(null);
  const conflictResolverRef = useRef<((option: ConflictResolutionOption) => void) | null>(null);

  // File Input Ref for Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. INITIAL LOAD & PERSISTENCE ---
  useEffect(() => {
    // Load Theme
    const savedTheme = (localStorage.getItem(THEME_KEY) as ThemeMode) || 'dark';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);

    // Load Master Password (in-session or local)
    const savedPwd = sessionStorage.getItem(MASTER_PWD_KEY) || localStorage.getItem(MASTER_PWD_KEY);
    if (savedPwd) setMasterPassword(savedPwd);

    // Load Memos
    const savedDB = localStorage.getItem(STORAGE_KEY);
    if (savedDB) {
      try {
        const parsed = JSON.parse(savedDB);
        coreRef.current.setMemos(parsed);
      } catch (e) {
        console.error("Errore nel parsing del database locale:", e);
      }
    } else {
      // Seed starter memos if empty
      const todayIso = getLocalYYYYMMDD(today);
      const starterMemos: MemoItem[] = [
        {
          id: 'n_1724000001-01',
          title: settings.language === 'en' ? 'Welcome to Notula (One-time Memo)' : 'Benvenuto in Notula (Memo Puntuale)',
          description: settings.language === 'en' ? 'This is a one-time (non-recurring) memo. In the calendar, one-time memos are highlighted with colored borders: red if expired, orange if today, magenta if future.' : 'Questo è un memo puntuale (non ricorrente). Nel calendario i memo puntuali sono evidenziati con bordi colorati: rosso se scaduto, arancio se oggi, magenta se futuro.',
          expirationDate: todayIso,
          year: String(today.getFullYear()),
          month: String(today.getMonth() + 1).padStart(2, '0'),
          day: String(today.getDate()).padStart(2, '0'),
          repeatType: 'none',
          obfuscation: 'none',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'n_1724000002-02',
          title: settings.language === 'en' ? 'Notula Automatic Backup (Recurring Memo)' : 'Notula Backup Automatico (Memo Ricorrente)',
          description: 'Questo è un memo ricorrente. Nel calendario i memo ricorrenti sono evidenziati con pallini colorati.',
          expirationDate: todayIso,
          year: String(today.getFullYear()),
          month: String(today.getMonth() + 1).padStart(2, '0'),
          day: String(today.getDate()).padStart(2, '0'),
          repeatType: 'yearly',
          obfuscation: 'partial',
          createdAt: new Date().toISOString(),
        }
      ];
      coreRef.current.setMemos(starterMemos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starterMemos));
    }
    forceUpdate();

    // Setup Online/Offline Network Listeners
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatusMsg((settings.language === "en" ? "Connection restored: starting Google™ Drive sync..." : "Connessione ripristinata: avvio sincronizzazione Google™ Drive..."));
      triggerDriveSyncOnConnect();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatusMsg("Offline: utilizzo cache locale");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Immediate Drive-First Startup Sync (if online)
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      setTimeout(() => {
        triggerDriveSyncOnConnect();
      }, 800);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Drive Connection / Startup Sync Trigger (Silent, non-intrusive)
  const triggerDriveSyncOnConnect = async () => {
    const driveCfg = getStoredDriveConfig();
    if (!driveCfg.clientId) return;

    // Only auto-sync silently if already authenticated (prevents OAuth popups on page load)
    if (driveCfg.autoSync && isDriveAuthenticated()) {
      try {
        setIsSyncing(true);
        const { memos } = await downloadFromDrive(masterPassword, false);
        if (memos && memos.length > 0) {
          await mergeMemosWithConflictCheck(memos, false);
          setSyncStatusMsg((settings.language === "en" ? "Background Google™ Drive synchronization completed" : "Sincronizzazione Google™ Drive in background completata"));
        } else {
          await autoSyncToDrive(coreRef.current.getMemos(), masterPassword, false);
          setSyncStatusMsg((settings.language === "en" ? "Local memos synchronized to Google™ Drive" : "Memo locali sincronizzati su Google™ Drive"));
        }
      } catch (err: any) {
        console.log("Drive background sync:", err.message || err);
      } finally {
        setIsSyncing(false);
      }
    } else {
      setSyncStatusMsg((settings.language === "en" ? "Google™ Drive ready" : "Google™ Drive pronto"));
    }
  };

  // Sync to LocalStorage & Drive on Memo Changes (Drive-First)
  const persistMemos = (memos: MemoItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    forceUpdate();

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      const driveCfg = getStoredDriveConfig();
      if (driveCfg.autoSync && driveCfg.clientId) {
        setIsSyncing(true);
        autoSyncToDrive(memos, masterPassword).then((res) => {
          if (res.success) {
            setSyncStatusMsg((settings.language === "en" ? "Synchronized to Google™ Drive with high priority" : "Sincronizzato su Google™ Drive con massima priorità"));
          }
        }).catch((err) => {
          console.warn("Drive auto-sync error:", err);
        }).finally(() => {
          setIsSyncing(false);
        });
      }
    }
  };

  // --- 2. THEME MANAGEMENT ---
  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    } else {
      root.setAttribute('data-theme', mode);
      if (mode === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const next: ThemeMode = themeMode === 'system' ? 'light' : themeMode === 'light' ? 'dark' : 'system';
    setThemeMode(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  const setThemeExplicit = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  };

  // --- 3. SIDEBAR LAYOUT RESIZING & TOGGLE ---
  const cycleSidebarMode = () => {
    let next: SidebarMode = 'normal';
    if (sidebarMode === 'normal') next = 'collapsed';
    else if (sidebarMode === 'collapsed') next = 'expanded';
    else if (sidebarMode === 'expanded') next = 'normal';

    setSidebarMode(next);
    localStorage.setItem(SIDEBAR_MODE_KEY, next);
  };

  const setSidebarModeExplicit = (mode: SidebarMode) => {
    setSidebarMode(mode);
    localStorage.setItem(SIDEBAR_MODE_KEY, mode);
  };

  // --- 4. MASTER PASSWORD (E2E LAYER 3) ---
  const handleToggleMasterPassword = () => {
    if (masterPassword) {
      if (confirm("Disattivare la Master Password E2E per questa sessione?")) {
        setMasterPassword(null);
        sessionStorage.removeItem(MASTER_PWD_KEY);
        localStorage.removeItem(MASTER_PWD_KEY);
      }
    } else {
      const pwd = prompt("🔒 Inserisci la Master Password per la cifratura E2E (PBKDF2 + AES-256-GCM):");
      if (pwd && pwd.trim()) {
        const trimmed = pwd.trim();
        setMasterPassword(trimmed);
        sessionStorage.setItem(MASTER_PWD_KEY, trimmed);
      }
    }
  };

  // --- 5. MEMO CREATION & UPDATES ---
  const handleSaveMemoForm = async (data: {
    title: string;
    description: string;
    expirationDate: string;
    time?: string;
    repeatType: any;
    obfuscation: any;
    isEncrypted?: boolean;
    updateEntireGroup?: boolean;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
    untilDate?: string;
  }) => {
    let savedMemo: MemoItem | null = null;
    if (editingMemo) {
      const updated = coreRef.current.updateMemo({
        id: editingMemo.id,
        title: data.title,
        description: data.description,
        expirationDate: data.expirationDate,
        time: data.time,
        repeatType: data.repeatType,
        obfuscation: data.obfuscation,
        isEncrypted: data.isEncrypted,
        updateEntireGroup: data.updateEntireGroup,
        gCalSync: data.gCalSync,
        alertDaysBefore: data.alertDaysBefore,
        alertTime: data.alertTime,
        untilDate: data.untilDate
      });
      savedMemo = updated;
    } else {
      savedMemo = coreRef.current.createMemo({
        ...data,
      });
    }

    if (savedMemo) {
      if (data.gCalSync) {
        try {
          const eventId = await syncMemoToGoogleCalendar(savedMemo);
          if (eventId) {
            coreRef.current.updateMemo({
              id: savedMemo.id,
              gCalEventId: eventId
            });
          }
        } catch (e) {
          console.error("Failed to sync to GCal", e);
        }
      }
    }

    persistMemos(coreRef.current.getMemos());
    setEditingMemo(null);
  };

  const handleDeleteSingleMemo = (id: string) => {
    setMemoToDelete(id);
  };

  const confirmDeleteMemo = () => {
    if (memoToDelete) {
      const memoObj = coreRef.current.getMemos().find(m => m.id === memoToDelete);
      if (memoObj && memoObj.gCalEventId) {
         deleteMemoFromGoogleCalendar(memoObj.gCalEventId);
      }
      coreRef.current.removeByIds([memoToDelete]);
      persistMemos(coreRef.current.getMemos());
      // Also delete single memo file on Google Drive in background
      deleteMemoFromDrive(memoToDelete);
      setMemoToDelete(null);
    }
  };

  // --- 6. INTERACTIVE IMPORT & CONFLICT RESOLUTION (Y/A/I/M) ---
  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedMemos = await parseImportFile(file, masterPassword);
      if (importedMemos.length === 0) {
        alert((settings.language === "en" ? "No valid memos found in the file." : (settings.language === "en" ? "No valid memos found in the file." : (settings.language === "en" ? "No valid memos found in the file." : "Nessun memo valido trovato nel file."))));
        return;
      }

      await mergeMemosWithConflictCheck(importedMemos);
    } catch (err: any) {
      alert("Errore importazione: " + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Google™ Drive Download Handler with True Smart Sync
  const handleDownloadFromDrive = async () => {
    setIsSyncing(true);
    setSyncStatusMsg((settings.language === "en" ? "Connecting and downloading from Google™ Drive..." : "Connessione e download in corso da Google™ Drive..."));
    try {
      const { memos } = await downloadFromDrive(masterPassword, true);
      if (memos.length === 0) {
        setSyncStatusMsg((settings.language === "en" ? "No memos found in Google™ Drive backup." : (settings.language === "en" ? "No memos found in Google™ Drive backup." : (settings.language === "en" ? "No memos found in Google™ Drive backup." : "Nessun memo trovato nel backup Google™ Drive."))));
        return;
      }
      await mergeMemosWithConflictCheck(memos, true);
      setSyncStatusMsg(`Sincronizzazione completata con successo (${memos.length} memo elaborati)`);
    } catch (err: any) {
      setSyncStatusMsg("Errore: " + err.message);
      alert((settings.language === "en" ? "Google™ Drive synchronization error: " : "Errore sincronizzazione Google™ Drive: ") + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * True Two-Way Synchronization & Smart Merge:
   * - Identical memos are preserved with zero prompt interruptions
   * - New memos are added automatically
   * - Differing memos with timestamp precedence are synchronized automatically
   * - Only ambiguous / conflicting changes prompt the clean resolution modal
   */
  const mergeMemosWithConflictCheck = async (incomingList: MemoItem[], isInteractive: boolean = false) => {
    const currentMemos = coreRef.current.getMemos();
    const existingMap = new Map<string, MemoItem>(currentMemos.map(m => [m.id, m]));
    let autoAcceptAll = false;

    for (let i = 0; i < incomingList.length; i++) {
      const incoming = incomingList[i];
      const existing = existingMap.get(incoming.id);

      if (!existing) {
        // New memo -> add directly
        existingMap.set(incoming.id, incoming);
      } else if (areMemosIdentical(existing, incoming)) {
        // Identical contents -> No conflict, preserve latest timestamp
        const latestUpdate = incoming.updatedAt && (!existing.updatedAt || new Date(incoming.updatedAt) > new Date(existing.updatedAt))
          ? incoming.updatedAt
          : existing.updatedAt;
        existingMap.set(existing.id, { ...existing, updatedAt: latestUpdate });
      } else {
        // Contents actually differ
        if (autoAcceptAll) {
          existingMap.set(incoming.id, incoming);
        } else if (!isInteractive && incoming.updatedAt && existing.updatedAt) {
          // Automatic resolution based on timestamp in background sync
          if (new Date(incoming.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
            existingMap.set(incoming.id, incoming);
          } else {
            // Local is newer, keep existing local version
          }
        } else {
          // Interactive conflict prompt for genuinely diverging data
          const choice = await new Promise<ConflictResolutionOption>((resolve) => {
            conflictResolverRef.current = resolve;
            setConflictPrompt({
              incomingMemo: incoming,
              existingMemo: existing,
              remainingCount: incomingList.length - i,
            });
          });

          setConflictPrompt(null);
          conflictResolverRef.current = null;

          if (choice === 'all') {
            autoAcceptAll = true;
            existingMap.set(incoming.id, incoming);
          } else if (choice === 'yes') {
            existingMap.set(incoming.id, incoming);
          } else if (choice === 'ignore') {
            // Keep existing, ignore incoming
          } else if (choice === 'merge') {
            const copy: MemoItem = {
              ...incoming,
              id: `n_${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              title: `${incoming.title} (Copia)`,
            };
            existingMap.set(copy.id, copy);
          }
        }
      }
    }

    const updatedList = Array.from(existingMap.values());
    coreRef.current.setMemos(updatedList);
    persistMemos(updatedList);

    // GCal background sync per i memo importati che lo richiedono
    (async () => {
      let gCalChanged = false;
      for (const memo of updatedList) {
        if (memo.gCalSync) {
          try {
            // syncMemoToGoogleCalendar restituisce null o ID. Non far fallire tutto per uno.
            const eventId = await syncMemoToGoogleCalendar(memo, true);
            if (eventId && memo.gCalEventId !== eventId) {
              memo.gCalEventId = eventId;
              gCalChanged = true;
            }
          } catch (e) {
            console.warn(`Silenced GCal sync error for memo ${memo.id}`, e);
          }
        }
      }
      if (gCalChanged) {
         coreRef.current.setMemos(updatedList);
         persistMemos(updatedList);
      }
    })();
  };

  // --- 7. EXPORT HELPERS (JSON, XML, MD, ICS, PDF, TXT) ---
  const handleExportSingle = (memo: MemoItem) => {
    setExportTargetMemo(memo);
    setIsExportOpen(true);
  };

  const handleExportBatch = (memos: MemoItem[]) => {
    setExportTargetMemo(null);
    setIsExportOpen(true);
  };

  // --- 8. KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        cycleSidebarMode();
      }
      if (e.key === 'Escape') {
        setIsTerminalOpen(false);
        setIsSearchOpen(false);
        setIsDeleteOpen(false);
        setIsListOpen(false);
        setIsFormOpen(false);
        setIsCloudSyncOpen(false);
        setIsPrintOpen(false);
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarMode]);

  const totalMemosCount = coreRef.current.getMemos().length;
  const recurringCount = coreRef.current.getMemos().filter(m => m.repeatType !== 'none').length;
  const expiredCount = coreRef.current.listExpiredNonEternal().length;

  // Sidebar dynamic classes based on mode
  const sidebarWidthClass = 
    sidebarMode === 'collapsed' 
      ? 'hidden' 
      : sidebarMode === 'expanded' 
        ? 'w-full md:w-84 lg:w-96' 
        : 'w-full md:w-64';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ======================================================== */}
      {/* 1. COMPACT SLEEK TOP HEADER */}
      {/* ======================================================== */}
      <header className="flex items-center justify-between px-2 sm:px-5 lg:px-6 py-2 bg-[var(--bg-header)] border-b border-[var(--border-color)] shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar Layout Toggle */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileDrawerOpen(true);
              } else {
                setSidebarMode(prev => (prev === 'collapsed' ? 'normal' : 'collapsed'));
                localStorage.setItem(SIDEBAR_MODE_KEY, sidebarMode === 'collapsed' ? 'normal' : 'collapsed');
              }
            }}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-blue-500/50 transition flex items-center gap-1"
            title={settings.language === 'en' ? `Sidebar: ${sidebarMode === 'collapsed' ? 'Show Bar' : 'Hide Bar'} (Ctrl+B)` : `Menu Laterale: ${sidebarMode === 'collapsed' ? 'Mostra Barra' : 'Nascondi Barra'} (Ctrl+B)`}
          >
            <span className="md:hidden">
              <Menu className="w-4 h-4" />
            </span>
            <span className="hidden md:inline">
              {sidebarMode === 'collapsed' ? (
                <PanelLeftOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </span>
          </button>

          <NotulaLogo size="md" showText={true} />
        </div>

        {/* Status Center & Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Quick "+ Nuovo" Action directly accessible in Header */}
          <button
            onClick={() => {
              setEditingMemo(null);
              setFormDefaultDate(undefined);
              setIsFormOpen(true);
            }}
            className="py-1.5 px-2.5 sm:px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1"
            title={settings.language === "en" ? "Create New Memo (or select a day from the calendar)" : "Crea Nuovo Memo (o seleziona un giorno dal calendario)"}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">{settings.language === "en" ? "New" : "Nuovo"}</span>
          </button>

          {/* Cloud Sync Active Indicator (Streamlined, no CLOUD-FIRST clutter) */}
          <div 
            onClick={() => setIsCloudSyncOpen(true)}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border cursor-pointer transition text-xs font-mono font-semibold ${
              isSyncing 
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' 
                : isOnline 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:border-amber-500'
            }`}
            title={isOnline ? (settings.language === "en" ? 'Google™ Drive Sync Active. Click to manage backup and synchronization.' : 'Google™ Drive Sync Attivo. Clicca per gestire backup e sincronizzazione.') : (settings.language === 'en' ? 'Offline: Local saving active.' : 'Offline: Salvataggio locale attivo.')}
          >
            <div className={`w-2 h-2 rounded-full ${
              isSyncing 
                ? 'bg-blue-400 animate-spin' 
                : isOnline 
                  ? 'bg-emerald-500 animate-pulse' 
                  : 'bg-amber-500'
            }`}></div>
            <span className="hidden sm:inline text-[11px]">
              {isSyncing ? 'SYNC...' : 'Cloud'}
            </span>
          </div>

          {/* E2E Security Badge */}
          <button
            onClick={() => setIsSecurityOpen(true)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono transition ${
              masterPassword
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-purple-500/40'
            }`}
            title={masterPassword ? (settings.language === 'en' ? 'AES-256 Encryption Active (Click to manage Master Password)' : 'Cifratura AES-256 Attiva (Clicca per gestire Master Password)') : (settings.language === "en" ? 'Set Strong AES-256 Encryption (Click to configure)' : 'Imposta Cifratura Forte AES-256 (Clicca per configurare)')}
          >
            {masterPassword ? <Lock className="w-3.5 h-3.5 text-purple-500" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">AES-256</span>
          </button>

          {/* Privacy Mode Toggle */}
          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className={`p-1.5 sm:p-2 rounded-lg border transition ${
              privacyMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title={privacyMode ? (settings.language === 'en' ? 'Deactivate Privacy Mode (Show protected descriptions)' : 'Disattiva Privacy Mode (Mostra descrizioni protette)') : (settings.language === "en" ? 'Activate Privacy Mode (Blur and mask content)' : 'Attiva Privacy Mode (Sfoca e maschera contenuti)')}
          >
            {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-blue-500/50 transition flex items-center"
            title={settings.language === 'en' ? `Theme: ${themeMode} (Click to change)` : `Tema: ${themeMode} (Clicca per cambiare)`}
          >
            {themeMode === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : themeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
          </button>

          {/* Info & Guide Modal Trigger ('i' button) */}
          <button
            onClick={() => {
              setInfoGuideTab('info');
              setIsInfoGuideOpen(true);
            }}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-blue-500 hover:border-blue-500/50 transition flex items-center justify-center"
            title={settings.language === "en" ? "Author Information (Ing. Mario Fantini), Copyright & Notula Guide" : "Informazioni Autore (Ing. Mario Fantini), Copyright & Guida Notula"}
          >
            <Info className="w-4 h-4" />
          </button>

          {/* CLI Terminal Toggle */}
          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className={`px-2 py-1 sm:py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 transition ${
              isTerminalOpen
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                : 'bg-[#161b22] border-[#30363d] text-emerald-400 hover:border-emerald-500/50'
            }`}
            title={settings.language === "en" ? "Open CLI Terminal (Ctrl+Shift+P)" : "Apri Terminale CLI (Ctrl+Shift+P)"}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CLI</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN APPLICATION WORKSPACE */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sleek Desktop Resizable Navigation Sidebar */}
        <aside className={`${sidebarWidthClass} bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] p-4 flex flex-col gap-4 shrink-0 transition-all duration-300 overflow-y-auto`}>
          {/* Quick Create CTA & Layout Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingMemo(null);
                setFormDefaultDate(undefined);
                setIsFormOpen(true);
              }}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{settings.language === 'en' ? 'New Memo' : 'Nuovo Memo'}</span>
            </button>

            {/* Sidebar Width Quick Switcher */}
            <button
              onClick={() => {
                const nextMode = sidebarMode === 'expanded' ? 'normal' : 'expanded';
                setSidebarMode(nextMode);
                localStorage.setItem(SIDEBAR_MODE_KEY, nextMode);
              }}
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              title={sidebarMode === 'expanded' ? (settings.language === 'en' ? 'Reduce column width (Standard)' : 'Riduci larghezza colonna (Standard)') : (settings.language === 'en' ? 'Extend column width (Expanded)' : 'Estendi larghezza colonna (Espansa)')}
            >
              {sidebarMode === 'expanded' ? <Minimize2 className="w-4 h-4 text-blue-500" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setSidebarMode('collapsed');
                localStorage.setItem(SIDEBAR_MODE_KEY, 'collapsed');
              }}
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              title={settings.language === "en" ? "Hide column and center full-screen calendar" : "Nascondi colonna e centra il calendario a tutto schermo"}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-2">
              {settings.language === "en" ? "Organization" : "Organizzazione"}
            </div>

            <button
              onClick={() => { setInitialListCategory('a'); setIsListOpen(true); }}
              className="w-full flex items-center justify-between px-3 py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-600/20 text-xs font-semibold hover:bg-blue-600/20 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>{settings.language === 'en' ? 'All Memos' : (settings.language === 'en' ? 'All Memos' : 'Tutti i Memo')}</span>
              </div>
              <span className="font-mono text-[11px] bg-blue-500/20 px-1.5 py-0.5 rounded font-bold">
                {totalMemosCount}
              </span>
            </button>

            <button
              onClick={() => { setInitialListCategory('e'); setIsListOpen(true); }}
              className="w-full flex items-center justify-between px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-xs font-semibold text-left"
            >
              <div className="flex items-center gap-2.5">
                <FolderLock className="w-4 h-4 text-emerald-500" />
                <span>{settings.language === 'en' ? 'Recurring Memos' : (settings.language === 'en' ? 'Recurring Memos' : 'Memo Ricorrenti')}</span>
              </div>
              <span className="font-mono text-[11px]">
                {recurringCount}
              </span>
            </button>

            <button
              onClick={() => { setInitialListCategory('i'); setIsListOpen(true); }}
              className="w-full flex items-center justify-between px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-xs font-semibold text-left"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>{settings.language === 'en' ? 'Expired Memos' : (settings.language === 'en' ? 'Expired Memos' : 'Memo Scaduti')}</span>
              </div>
              <span className="font-mono text-[11px] text-red-500">
                {expiredCount}
              </span>
            </button>
          </div>

          {/* GEM Operations Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-2">{settings.language === 'en' ? 'GEM Notula Functions' : (settings.language === "en" ? "Notula GEM Functions" : "Funzioni GEM Notula")}</div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-left"
            >
              <Search className="w-4 h-4 text-blue-500" />
              <span>{settings.language === 'en' ? 'Search (Date/Title/ID)' : (settings.language === 'en' ? 'Search (Date/Title/ID)' : 'Cerca (Data/Titolo/ID)')}</span>
            </button>

            <button
              onClick={() => setIsListOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-left"
            >
              <ListFilter className="w-4 h-4 text-purple-500" />
              <span>{settings.language === 'en' ? 'Memo List (a-g)' : (settings.language === 'en' ? 'Memo List (a-g)' : 'Elenco Memo (a-g)')}</span>
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-red-500 rounded-lg transition text-left"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>{settings.language === 'en' ? 'Delete Memo (1-9)' : (settings.language === 'en' ? 'Delete Memo (1-9)' : 'Elimina Memo (1-9)')}</span>
            </button>
          </div>

          {/* Backup & Cloud Actions */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-2">
              {settings.language === 'en' ? 'Cloud & Archive' : 'Cloud & Archivio'}
            </div>

            <button
              onClick={() => setIsCloudSyncOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-left"
            >
              <CloudDownload className="w-4 h-4 text-cyan-500" />
              <span>{settings.language === 'en' ? 'Download from Google™ Drive' : (settings.language === 'en' ? 'Download from Google™ Drive' : 'Scarica da Google™ Drive')}</span>
            </button>

            <button
              onClick={handleTriggerImport}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-left"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>{settings.language === 'en' ? 'Import File (JSON / XML)' : (settings.language === 'en' ? 'Import File (JSON / XML)' : 'Importa File (JSON / XML)')}</span>
            </button>

            <button
              onClick={() => {
                setExportTargetMemo(null);
                setIsExportOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-left"
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>{settings.language === 'en' ? 'Export (XML, MD, ICS, JSON, PDF)' : (settings.language === 'en' ? 'Export (XML, MD, ICS, JSON, PDF)' : 'Esporta (XML, MD, ICS, JSON, PDF)')}</span>
            </button>
          </div>

          {/* About & Guide Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-2">
              {t.infoSupport}
            </div>
            <button
              onClick={() => {
                setInfoGuideTab('info');
                setIsInfoGuideOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-blue-500 rounded-lg transition text-left"
            >
              <Info className="w-4 h-4 text-blue-500" />
              <span>{t.author}</span>
            </button>

            <button
              onClick={() => {
                setInfoGuideTab('install');
                setIsInfoGuideOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-blue-500 rounded-lg transition text-left"
            >
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span>{t.install}</span>
            </button>

            <button
              onClick={() => {
                setInfoGuideTab('guide');
                setIsInfoGuideOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-purple-500 rounded-lg transition text-left"
            >
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>{t.guide}</span>
            </button>
          </div>

          {/* Settings Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-2">
              {t.settings}
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-indigo-500 rounded-lg transition text-left"
            >
              <Settings2 className="w-4 h-4 text-indigo-500" />
              <span>{t.settings}</span>
            </button>
          </div>

          {/* Storage & Encryption Mini Widget */}
          <div className="mt-auto p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] text-xs">
            <div className="flex items-center justify-between font-semibold mb-1">
              <span className="text-[var(--text-main)]">
                <span className="hidden sm:inline">{settings.language === 'en' ? 'Google™ Drive Folder' : 'Cartella Google™ Drive'}</span>
                <span className="sm:hidden">{settings.language === 'en' ? 'Cloud Folder' : 'Cartella Cloud'}</span>
              </span>
              <span className="text-blue-500 font-mono text-[10px]">v1.1</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] space-y-0.5">
              <div>{settings.language === 'en' ? 'Total Memos:' : (settings.language === "en" ? "Total Memos:" : "Memo Totali:")}<strong>{totalMemosCount}</strong></div>
              <div>{settings.language === 'en' ? 'Encryption:' : (settings.language === "en" ? "Encryption:" : "Cifratura:")}<span className="font-mono text-blue-400">{masterPassword ? 'AES-256 E2E' : 'Standard'}</span></div>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer Backdrop */}
        {isMobileDrawerOpen && (
          <div 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          />
        )}

        {/* Mobile Slide-over Drawer */}
        <aside className={`fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] p-5 z-50 flex flex-col gap-4 md:hidden shadow-2xl transition-transform duration-300 ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
            <div className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <NotulaLogo size="sm" showText={false} />
              <span>Notula</span>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              setEditingMemo(null);
              setFormDefaultDate(undefined);
              setIsFormOpen(true);
            }}
            className="w-full py-3 px-4 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{settings.language === 'en' ? 'New Memo' : 'Nuovo Memo'}</span>
          </button>

          <div className="space-y-1 overflow-y-auto flex-1">
            <button
              onClick={() => { setIsMobileDrawerOpen(false); setIsListOpen(true); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left"
            >
              <div className="flex items-center gap-2.5"><Layers className="w-4 h-4 text-blue-500" /><span>{settings.language === 'en' ? 'All Memos' : (settings.language === 'en' ? 'All Memos' : 'Tutti i Memo')}</span></div>
              <span className="font-mono text-[11px] bg-blue-500/20 px-1.5 py-0.5 rounded">{totalMemosCount}</span>
            </button>

            <button
              onClick={() => { setIsMobileDrawerOpen(false); setIsSearchOpen(true); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left"
            >
              <Search className="w-4 h-4 text-blue-500" /><span>{settings.language === 'en' ? 'Search Memos' : (settings.language === 'en' ? 'Search Memos' : 'Cerca nei Memo')}</span>
            </button>

            <button
              onClick={() => { setIsMobileDrawerOpen(false); setIsDeleteOpen(true); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left text-red-500"
            >
              <Trash2 className="w-4 h-4" /><span>{settings.language === 'en' ? 'Delete Memo (1-9)' : (settings.language === 'en' ? 'Delete Memo (1-9)' : 'Elimina Memo (1-9)')}</span>
            </button>

            <button
              onClick={() => { setIsMobileDrawerOpen(false); setIsCloudSyncOpen(true); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left"
            >
              <CloudDownload className="w-4 h-4 text-cyan-500" /><span>Google™ Drive Sync</span>
            </button>

            <button
              onClick={() => { setIsMobileDrawerOpen(false); handleTriggerImport(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left"
            >
              <Upload className="w-4 h-4 text-emerald-500" /><span>{settings.language === 'en' ? 'Import File (JSON / XML)' : (settings.language === 'en' ? 'Import File (JSON / XML)' : 'Importa File (JSON / XML)')}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                setExportTargetMemo(null);
                setIsExportOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left text-amber-500"
            >
              <span>{settings.language === 'en' ? 'Export (XML, MD, ICS, JSON, PDF)' : (settings.language === 'en' ? 'Export (XML, MD, ICS, JSON, PDF)' : 'Esporta (XML, MD, ICS, JSON, PDF)')}</span>
            </button>
          </div>


            <div className="pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setInfoGuideTab('info');
                  setIsInfoGuideOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left text-blue-500"
              >
                <Info className="w-4 h-4" /><span>{t.author}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setInfoGuideTab('install');
                  setIsInfoGuideOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left text-blue-500"
              >
                <Smartphone className="w-4 h-4" /><span>{t.install}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setInfoGuideTab('guide');
                  setIsInfoGuideOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left text-purple-500"
              >
                <BookOpen className="w-4 h-4" /><span>{t.guide}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-card)] text-left text-indigo-500"
              >
                <Settings2 className="w-4 h-4" /><span>{t.settings}</span>
              </button>
            </div>
        </aside>

        {/* Main Content Area: Calendar View centered and responsive */}
        <main className="flex-1 p-1 sm:p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full transition-all duration-300">
          {/* Quick Floating Restore Bar if Sidebar is Collapsed on Desktop */}
          {sidebarMode === 'collapsed' && (
            <div className="hidden md:flex items-center justify-between mb-3 p-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] text-xs shadow-xs">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text-main)]">{settings.language === "en" ? "Notula™ Calendar (Main View)" : "Calendario Notula™ (Vista Principale)"}</span>
                <span>•</span>
                <span>{totalMemosCount} promemoria</span>
              </div>

              <button
                onClick={() => {
                  setSidebarMode('normal');
                  localStorage.setItem(SIDEBAR_MODE_KEY, 'normal');
                }}
                className="px-3 py-1 bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-xs flex items-center gap-1.5 transition text-[var(--text-main)]"
              >
                <PanelLeftOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>{settings.language === 'en' ? 'Show Sidebar' : (settings.language === 'en' ? 'Show Sidebar' : 'Mostra Menu Laterale')}</span>
              </button>
            </div>
          )}

          <CalendarView
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDay={selectedDay}
            onSelectDay={(day) => setSelectedDay(day)}
            onChangeMonth={(delta) => {
              let newM = currentMonth + delta;
              let newY = currentYear;
              if (newM < 0) {
                newM = 11;
                newY--;
              } else if (newM > 11) {
                newM = 0;
                newY++;
              }
              setCurrentMonth(newM);
              setCurrentYear(newY);
              setSelectedDay(1);
            }}
            onSetMonthYear={(year, month) => {
              setCurrentYear(year);
              setCurrentMonth(month);
              setSelectedDay(today.getDate());
            }}
            core={coreRef.current}
            privacyMode={privacyMode}
            onNewMemo={(dateStr) => {
              setEditingMemo(null);
              setFormDefaultDate(dateStr);
              setIsFormOpen(true);
            }}
            onEditMemo={(memo) => {
              setEditingMemo(memo);
              setIsFormOpen(true);
            }}
            onDeleteMemo={handleDeleteSingleMemo}
            onExportMemo={handleExportSingle}
            onPrintMemo={(memo) => {
              setPrintingMemo(memo);
              setIsPrintOpen(true);
            }}
          />
        </main>
      </div>

      {/* Hidden File Input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.xml"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* ======================================================== */}
      {/* 3. MODALS & SUBMENUS */}
      {/* ======================================================== */}

      {/* Search Submenu Modal */}
      <SearchSubmenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        memos={coreRef.current.getMemos()}
        privacyMode={privacyMode}
        onSelectDate={(dateStr) => {
          const [y, m, d] = dateStr.split('-');
          setCurrentYear(Number(y));
          setCurrentMonth(Number(m) - 1);
          setSelectedDay(Number(d));
        }}
        onEditMemo={(memo) => {
          setEditingMemo(memo);
          setIsFormOpen(true);
        }}
        onDeleteMemo={handleDeleteSingleMemo}
        onExportMemo={handleExportSingle}
        onPrintMemo={(memo) => {
          setPrintingMemo(memo);
          setIsPrintOpen(true);
        }}
      />

      {/* Delete Submenu Modal (9 GEM Modes) */}
      <DeleteSubmenu
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        core={coreRef.current}
        onMemosChanged={() => persistMemos(coreRef.current.getMemos())}
      />

      {/* List Submenu Modal (a-g GEM Modes) */}
      <ListSubmenu
        isOpen={isListOpen}
        initialCategory={initialListCategory}
        onClose={() => setIsListOpen(false)}
        core={coreRef.current}
        privacyMode={privacyMode}
        onSelectDate={(dateStr) => {
          const [y, m, d] = dateStr.split('-');
          setCurrentYear(Number(y));
          setCurrentMonth(Number(m) - 1);
          setSelectedDay(Number(d));
        }}
        onEditMemo={(memo) => {
          setEditingMemo(memo);
          setIsFormOpen(true);
        }}
        onDeleteMemo={handleDeleteSingleMemo}
        onExportMemo={handleExportSingle}
        onPrintMemo={(memo) => {
          setPrintingMemo(memo);
          setIsPrintOpen(true);
        }}
        onExportBatch={handleExportBatch}
      />

      {/* Memo Creation & Edit Form Modal */}
      <MemoFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMemo(null);
        }}
        onSave={handleSaveMemoForm}
        initialMemo={editingMemo}
        defaultDate={formDefaultDate}
        hasMasterPassword={!!masterPassword}
      />

      {/* Security & AES-256 Modal */}
      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        masterPassword={masterPassword}
        onSetMasterPassword={(pwd) => {
          setMasterPassword(pwd);
          if (pwd) {
            sessionStorage.setItem(MASTER_PWD_KEY, pwd);
          } else {
            sessionStorage.removeItem(MASTER_PWD_KEY);
            localStorage.removeItem(MASTER_PWD_KEY);
          }
        }}
        privacyMode={privacyMode}
        onTogglePrivacy={(val) => setPrivacyMode(val !== undefined ? val : !privacyMode)}
      />

      {/* Cloud Sync & Google Drive Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        masterPassword={masterPassword}
        onDownloadDrive={handleDownloadFromDrive}
        isSyncing={isSyncing}
        syncStatusMsg={syncStatusMsg}
        totalMemos={totalMemosCount}
      />

      {/* Print & Diagnostics Modal */}
      <PrintModal
        isOpen={isPrintOpen}
        onClose={() => {
          setIsPrintOpen(false);
          setPrintingMemo(null);
        }}
        memo={printingMemo}
      />

      {/* Multiformat Export Modal (JSON, XML, MD, ICS, PDF, TXT) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => {
          setIsExportOpen(false);
          setExportTargetMemo(null);
        }}
        memos={coreRef.current.getMemos()}
        singleMemo={exportTargetMemo}
        masterPassword={masterPassword}
      />

      {/* Interactive Conflict Resolution Modal (Y/A/I/M) */}
      {conflictPrompt && conflictResolverRef.current && (
        <ConflictModal
          incomingMemo={conflictPrompt.incomingMemo}
          existingMemo={conflictPrompt.existingMemo}
          remainingConflicts={conflictPrompt.remainingCount}
          onResolve={(option) => {
            if (conflictResolverRef.current) {
              conflictResolverRef.current(option);
            }
          }}
        />
      )}

      {/* Terminal CLI Modal (Full GEM Interpreter with Fullscreen capability) */}
      <TerminalCLI
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        core={coreRef.current}
        onMemosChanged={() => persistMemos(coreRef.current.getMemos())}
        privacyMode={privacyMode}
        onTogglePrivacy={(val) => setPrivacyMode(val !== undefined ? val : !privacyMode)}
        masterPassword={masterPassword}
        onSetMasterPassword={(pwd) => {
          setMasterPassword(pwd);
          if (pwd) {
            sessionStorage.setItem(MASTER_PWD_KEY, pwd);
          } else {
            sessionStorage.removeItem(MASTER_PWD_KEY);
            localStorage.removeItem(MASTER_PWD_KEY);
          }
        }}
        onTriggerImport={handleTriggerImport}
        onDownloadDrive={handleDownloadFromDrive}
        onChangeTheme={setThemeExplicit}
      />

      {/* Delete Confirmation Modal */}
      {memoToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">{settings.language === "en" ? "Delete Memo" : "Elimina Memo"}</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Sei sicuro di voler eliminare definitivamente questo promemoria? Questa azione non può essere annullata.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setMemoToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition"
              >{settings.language === "en" ? "Cancel" : (settings.language === "en" ? "Cancel" : (settings.language === "en" ? "Cancel" : "Annulla"))}</button>
              <button
                onClick={confirmDeleteMemo}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition"
              >
                Sì, Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info, Copyright & Complete Functions Guide Modal */}
      <InfoGuideModal
        isOpen={isInfoGuideOpen}
        onClose={() => setIsInfoGuideOpen(false)}
        initialTab={infoGuideTab}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={themeMode}
        setTheme={(newTheme) => {
          setThemeMode(newTheme);
          applyTheme(newTheme);
        }}
      />
    </div>
  );
}

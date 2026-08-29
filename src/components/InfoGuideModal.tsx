/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  Award,
  BookOpen,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Copyright,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode,
  FileText,
  Globe,
  Check,
  HardDrive,
  Info,
  KeyRound,
  Layers, ListFilter,
  Lock,
  RefreshCw,
  Repeat,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Trash2,
  X
} from 'lucide-react';
import { NotulaLogo } from './NotulaBrand';
import { CliManualModal } from './CliManualModal';

interface InfoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'info' | 'install' | 'guide';
  onOpenCliManual?: () => void;
}

export const InfoGuideModal: React.FC<InfoGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'info',
  onOpenCliManual,
}) => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'info' | 'guide'>(initialTab);
  const [isCliManualOpen, setIsCliManualOpen] = useState<boolean>(false);
  const [guideSection, setGuideSection] = useState<
    'all' | 'intro' | 'features' | 'legend' | 'security' | 'exports' | 'sync' | 'calendar' | 'daily' | 'gem' | 'cli'
  >('all');

  // Ensure activeTab matches initialTab whenever modal opens or tab prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <NotulaLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[var(--text-main)]">
                  Notula™ • {settings.language === "en" ? "Information Center \& User Guide" : "Centro Informazioni \& Guida Utente"}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  v2.2 Enterprise
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {settings.language === "en" ? "Conception, Development \& Intellectual Property" : "Ideazione, Sviluppo \& Proprietà Intellettuale"} • <strong>Ing. Mario Fantini</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition cursor-pointer"
            title={settings.language === "en" ? "Close (Esc)" : "Chiudi (Esc)"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 shrink-0 overflow-x-auto hide-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center whitespace-nowrap gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Copyright className="w-4 h-4" />
            <span>{settings.language === 'en' ? 'Author, Contacts, Copyright' : 'Autore, Contatti, Copyright'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex items-center whitespace-nowrap gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'install'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{settings.language === 'en' ? 'Installation, Emblem' : 'Installazione, Emblema'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center whitespace-nowrap gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'guide'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{settings.language === 'en' ? 'Functional Guide, Manual' : "Guida Funzionale, Manuale d'Uso"}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-[var(--text-main)] leading-relaxed">
          
          {/* ========================================================================= */}
          {/* TAB 1: AUTORE, CONTATTI, COPYRIGHT */}
          {/* ========================================================================= */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              
              {/* Author & Creator Card */}
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <NotulaLogo size="lg" showText={false} />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      Ideatore, Sviluppatore & Titolare Unico
                    </div>
                    <div className="text-lg font-extrabold text-[var(--text-main)]">
                      Ing. Mario Fantini
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {settings.language === "en" ? "Software Engineering • E2E Hardware Encryption • Google™ Drive-First Synchronization Algorithms" : "Ingegneria del Software • Crittografia Hardware E2E • Algoritmi di Sincronizzazione Google™ Drive-First"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://mariofantini.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-500/50 text-[var(--text-main)] font-bold text-xs transition"
                  >
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>mariofantini.eu</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </a>
                </div>
              </div>

              {/* Proprietary License & Rights Reservation Notice */}
              <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>{settings.language === "en" ? "Full Rights Reservation Notice & Intellectual Property Protection" : "Avviso di Riserva Integrale dei Diritti & Tutela Proprietà Intellettuale"}</span>
                </div>
                
                <div className="font-mono text-[11px] bg-black/10 dark:bg-black/40 p-3 rounded-lg border border-[var(--border-color)] text-[var(--text-main)] space-y-1">
                  <div><strong>{settings.language === "en" ? "Copyright &copy; 2026 Ing. Mario Fantini. All rights reserved." : "Copyright &copy; 2026 Ing. Mario Fantini. Tutti i diritti riservati."}</strong></div>
                  <div><strong>All Rights Reserved • Proprietary & Confidential Software.</strong></div>
                </div>

                <div className="text-xs text-[var(--text-muted)] space-y-2 text-justify">
                  <p>
                    {settings.language === 'en' ? <>The <strong>Notula™</strong> application, including its software architecture, command-line interface (CLI), Google™ Drive-First bidirectional synchronization engine, multi-level obfuscation system, and hardware AES-256 GCM encryption, is protected by current laws on copyright and intellectual property.</> : <>L'applicazione <strong>Notula™</strong>, comprensiva della sua architettura software, dell'interfaccia a riga di comando (CLI), del motore di sincronizzazione bidirezionale Google™ Drive-First, del sistema di offuscamento multilivello e della crittografia hardware AES-256 GCM, è protetta dalle leggi vigenti in materia di diritto d'autore e proprietà intellettuale (Legge 22 aprile 1941 n. 633 e successive modifiche, nonché convenzioni WIPO/OMPI).</>}
                  </p>
                  <p>
                    <strong>Intellectual Property Notice</strong>{settings.language === "en" ? ": Please refer to the file " : ": Si rimanda al file "}<code className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 rounded">README.md</code> {settings.language === "en" ? ' for further details regarding intellectual property ("Intellectual Property Notice"), which states that the software architecture, parsing logic, and source code are the proprietary work of the author. Expressions of interest for the complete acquisition of commercial rights can be evaluated, subject to prior economic agreement and safeguarding historical and moral authorship (Contact: marfant7@gmail.com).' : ' per approfondimenti riguardo la proprietà intellettuale ("Intellectual Property Notice"), in cui si esplicita che l\'architettura software, la logica di parsing e il codice sorgente sono opera proprietaria dell\'autore. Manifestazioni di interesse per l\'acquisizione completa dei diritti commerciali sono valutabili, previa intesa economica e salvaguardando la paternità storica e morale (Contatto: marfant7@gmail.com).'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: INSTALLAZIONE ED EMBLEMA */}
          {/* ========================================================================= */}
          {activeTab === 'install' && (
            <div className="space-y-6">

              {/* Installazione Web App */}
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      {settings.language === "en" ? "Progressive Web App (PWA)" : "Progressive Web App (PWA)"}
                    </div>
                    <div className="text-lg font-extrabold text-[var(--text-main)]">
                      {settings.language === "en" ? "Official Installation" : "Installazione Ufficiale"}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {settings.language === "en" ? "Install Notula™ directly on your device for a native and offline experience." : "Installa Notula™ direttamente sul tuo dispositivo per un'esperienza nativa e offline."}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://martdivenus.github.io/notula-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition"
                    title={settings.language === "en" ? "Official URL for Web App (PWA) installation" : "URL ufficiale per l'installazione della Web App (PWA)"}
                  >
                    <Download className="w-4 h-4" />
                    <span>{settings.language === "en" ? "Install Web App" : "Installa Web App"}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              </div>

              {/* EMBLEMA UFFICIALE INGRANDITO & SPIEGAZIONE SIMBOLICA */}
              <div className="p-6 rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  
                  {/* Logo Ingrandito in Evidenza */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="p-3 bg-[var(--bg-card)] rounded-2xl border border-indigo-500/30 shadow-xl">
                      <NotulaLogo size="2xl" showText={false} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-indigo-500 tracking-wider">
                      EMBLEMA NOTULA™
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
                      <Sparkles className="w-5 h-5 shrink-0 text-amber-500" />
                      <span>{settings.language === "en" ? "The Notula™ Emblem: Historical Roots, Bird of Apollo & Astronomy" : "L'Emblema Notula™: Radici Storiche, Volatile di Apollo & Astronomia"}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {settings.language === 'en' ? "The Notula™ visual emblem was designed and conceived by <strong>Ing. Mario Fantini</strong> to combine engineering rigor, temporal orientation and historical memory. It contains no references to commercial logos, but has its roots in the classic archetype of the Roman calendar and communication:" : "L'emblema visivo di Notula™ è stato disegnato e concepito dall'<strong>Ing. Mario Fantini</strong> per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:"}
                    </p>
                  </div>
                </div>

                {/* Scomposizione dei 3 Elementi Simbolici */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                    <div className="font-bold text-xs text-blue-500 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-bold border border-blue-500/20">1</span>
                      <span>{settings.language === "en" ? "Tablet of the Roman Fasti" : "Tavola dei Fasti Romani"}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      {settings.language === "en" ? "Represents the " : "Rappresenta la "}<em>{settings.language === "en" ? "Tabula" : "Tabula"}</em> {settings.language === "en" ? "in engraved stone of the calendar in Ancient Rome, on which legal deadlines, holidays and days were carved" : "in pietra incisa del calendario nell'Antica Roma, su cui venivano scolpite le scadenze legali, le festività e i giorni"} <em>{settings.language === "en" ? "Fasti" : "Fasti"}</em>{settings.language === "en" ? " and " : " e "}<em>{settings.language === "en" ? "Nefasti" : "Nefasti"}</em>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                    <div className="font-bold text-xs text-indigo-500 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold border border-indigo-500/20">2</span>
                      <span>{settings.language === "en" ? "The Messenger Bird of Apollo" : "L'Uccello Messaggero di Apollo"}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      {settings.language === 'en' ? 'Noble bird of prey, with a sharp golden beak and a fan-shaped tail. Heraldic symbol of timeliness and custody of memories over time.' : 'Nobile volatile rapace, con becco dorato acuminato e coda a ventaglio. Simbolo araldico di tempestività e custodia delle memorie nel tempo.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                    <div className="font-bold text-xs text-amber-500 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] font-bold border border-amber-500/20">3</span>
                      <span>{settings.language === "en" ? "Guiding Stars" : "Stelle di Orientamento"}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      {settings.language === 'en' ? 'The cardinal points, the North Star and the constellations that guided the ancient Romans in astronomical observation, navigation and the cyclical scanning of the seasons.' : 'I punti cardinali, la stella polare e le costellazioni che guidavano gli antichi romani nell\'osservazione astronomica, nella navigazione e nella scansione ciclica delle stagioni.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GUIDA UTENTE STRUTTURATA (NORMAL USERS PRIMA, CLI ALLA FINE) */}
          {/* ========================================================================= */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              
              {/* Quick Index Pills */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setGuideSection('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "All Sections" : "Tutte le Sezioni"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('intro')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'intro' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "1. What Notula™ Does" : "1. Cosa fa Notula™"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('features')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'features' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "2. Core Strengths" : "2. Punti di Forza"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('legend')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'legend' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "3. Legend & Recurrences" : "3. Legenda & Ricorrenze (groupID)"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('security')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'security' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "4. Security & Passphrase" : "4. Sicurezza & Passphrase"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('exports')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'exports' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "5. Exports & PDF" : "5. Esportazioni & PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('sync')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'sync' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "6. Google™ Drive" : "6. Google™ Drive"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('calendar')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'calendar' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "7. Native Calendar" : "7. Calendario Nativo"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('daily')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'daily' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "8. Daily Features" : "8. Funzioni Quotidiane"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('cli')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'cli' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {settings.language === "en" ? "9. CLI Terminal (edit/export/import)" : "9. Terminale CLI (edit/export/import)"}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 1. COSA FA NOTULA */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'intro') && (
                <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <BookOpen className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "1. What Notula™ Does: The Universal Engineering Filing System" : "1. Cosa Fa Notula™: Lo Schedario Ingegneristico Universale"}</span>
                  </div>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    <strong>Notula™</strong> {settings.language === "en" ? "is an advanced platform for the time management of reminders, critical deadlines, legal/tax compliances, professional projects and protected personal notes." : "è una piattaforma avanzata per la gestione temporale di promemoria, scadenze critiche, adempimenti legali/fiscali, progetti professionali e note personali protette."}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-blue-500 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{settings.language === "en" ? "One-time Deadlines" : "Scadenze Puntuali"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Commitments with an exact date, marked by temporal chromatic states (expired, today, future)." : "Impegni con una data esatta, contrassegnati da stati cromatici temporali (scaduto, oggi, futuro)."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-emerald-500 text-xs flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>{settings.language === "en" ? "Perpetual Recurrences" : "Ricorrenze Perpetue"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Fees, invoices, renewals, birthdays or coupons with daily, weekly, monthly or yearly repetition." : "Canoni, fatture, rinnovi, compleanni o tagliandi con ripetizione giornaliera, settimanale, mensile o annuale."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-purple-500 text-xs flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>{settings.language === "en" ? "Multi-Layer Protection" : "Protezione Multi-Strato"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Offuscamento visivo per sguardi indiscreti e cifratura hardware di livello militare AES-256.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 2. PECULIARITÀ E PUNTI DI FORZA DI NOTULA */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'features') && (
                <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <Sparkles className="w-5 h-5 shrink-0 text-amber-500" />
                    <span>{settings.language === "en" ? "2. Unique Features and Strengths of Notula™" : "2. Peculiarità e Punti di Forza Unici di Notula™"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Absolute Data Sovereignty (Zero Third-Party Cloud)" : "Sovranità Assoluta sui Dati (Zero Cloud Terzo)"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Unlike common commercial SaaS apps, Notula™ does not store anything on proprietary servers or remote databases. The data belongs solely to the user." : "A differenza delle comuni app SaaS commerciali, Notula™ non archivia nulla su server proprietari o database remoti. I dati appartengono solo all'utente."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Offline-First & Immediate Architecture" : "Architettura Offline-First & Immediata"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Works always, even in total absence of Internet connection. Instantly loads the local archive on startup." : "Funziona sempre, anche in assenza totale di connessione Internet. All'avvio carica istantaneamente l'archivio locale."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Automatic Recurrence Update (groupID)" : "Aggiornamento Automatico Ricorrenze (groupID)"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "By modifying a recurring memo linked to a series, all other memos of the series linked by groupID are automatically synchronized." : "Modificando un memo ricorrente legato a una serie, tutti gli altri memo della serie collegati da groupID vengono sincronizzati in automatico."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Dual Interface: GUI • CLI" : "Doppia Interfaccia: GUI • CLI"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "High reactivity graphical interface with interactive calendar combined with a powerful engineering command line terminal." : "Interfaccia grafica ad alta reattività con calendario interattivo unita a un potente terminale a riga di comando ingegneristico."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Optional Native OS Notifications" : "Notifiche OS Native Opzionali"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Follows a conscious consultation philosophy (Calendar-First), but allows enabling push notifications fully integrated with your operating system (Windows, macOS, Linux, Android)." : "Adotta una filosofia a consultazione consapevole (Calendar-First), ma permette di attivare notifiche push perfettamente integrate con il sistema operativo (Windows, macOS, Linux, Android)."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 3. LEGENDA COLORI E GESTIONE RICORRENZE (groupID) */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'legend') && (
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <Layers className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "3. Calendar Visual Legend & Recurrence Management with groupID" : "3. Legenda Visiva del Calendario & Gestione Ricorrenze con groupID"}</span>
                  </div>

                  <p className="text-xs text-[var(--text-main)]">
                    {settings.language === 'en' ? "The Notula™ calendar adopts a rigorous color semantics to distinguish at a glance the nature and urgency of each event:" : "Il calendario Notula™ adotta una semantica cromatica rigorosa per distinguere al colpo d'occhio la natura e l'urgenza di ciascun evento:"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border-2 border-red-500 bg-transparent shrink-0"></span>
                        <span>{settings.language === "en" ? "One-time Memos (Rectangular Color Border)" : "Memo Puntuali (Bordo Cromatico Rettangolare)"}</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-[var(--text-muted)] pl-1">
                        <li className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded border-2 border-red-500 bg-transparent shrink-0"></span>
                          <span><strong className="text-red-500">{settings.language === "en" ? "Red Border:" : "Bordo Rosso:"}</strong> {settings.language === "en" ? "Expired (the date has already passed)." : "Scaduto (la data è già passata)."}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded border-2 border-amber-500 bg-transparent shrink-0"></span>
                          <span><strong className="text-amber-500">{settings.language === "en" ? "Orange Border:" : "Bordo Arancione:"}</strong> {settings.language === "en" ? "Expiring Today." : "In scadenza Oggi."}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded border-2 border-fuchsia-500 bg-transparent shrink-0"></span>
                          <span><strong className="text-pink-500">{settings.language === "en" ? "Magenta/Purple Border:" : "Bordo Magenta/Viola:"}</strong> {settings.language === "en" ? "Future expiration in the month." : "Scadenza futura nel mese."}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span>{settings.language === "en" ? "Recurring Memos (Solid Dot •)" : "Memo Ricorrenti (Pallino Pieno •)"}</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-[var(--text-muted)] pl-2">
                        <li><strong className="text-emerald-500">{settings.language === "en" ? "• Green:" : "• Verde:"}</strong> {settings.language === "en" ? "Yearly / Monthly Recurring." : "Ricorrente Annuale / Mensile."}</li>
                        <li><strong className="text-blue-500">{settings.language === "en" ? "• Blue:" : "• Blu:"}</strong> {settings.language === "en" ? "Weekly / Daily Recurring." : "Ricorrente Settimanale / Giornaliero."}</li>
                        <li><strong className="text-purple-500">{settings.language === "en" ? "• Purple:" : "• Viola:"}</strong> {settings.language === "en" ? "With AES-256 Encryption active." : "Con Cifratura AES-256 attiva."}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-blue-500/30 text-[11px] text-[var(--text-muted)] space-y-1">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {settings.language === 'en' ? "How automatic update with groupID works:" : "Come funziona l'aggiornamento automatico con groupID:"}
                    </div>
                    <p>{settings.language === "en" ? "When you create or clone a recurring memo (e.g., for 15 days or 12 months), Notula™ assigns the same " : "Quando crei o cloni un memo ricorrente (es. per 15 giorni o 12 mesi), Notula™ assegna a tutti i memo della serie lo stesso "}<code>groupID</code>{settings.language === "en" ? ". If you modify today's memo (title, notes, or security level), changes are " : ". Se modifichi il memo di oggi (titolo, note o livello di sicurezza), le modifiche vengono propagate "}<strong>{settings.language === "en" ? "automatically to all linked memos" : "automaticamente a tutti i memo collegati"}</strong>{settings.language === "en" ? ", preserving their respective calendar dates!" : ", preservando le rispettive date del calendario!"}</p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 4. SICUREZZA, OFFUSCAMENTO & PASSPHRASE */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'security') && (
                <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-4">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <Shield className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "4. The 3 Security Layers of Notula™ & Passphrase Management" : "4. I 3 Strati di Sicurezza Notula™ & Gestione Passphrase"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                      <div className="font-bold text-xs text-amber-500 flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4" />
                        <span>{settings.language === "en" ? "Layer 1: Partial" : "Strato 1: Parziale"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? <>Masks the central characters with dots (e.g. <code>IB•••401</code>), allowing recognition at a glance.</> : <>Maschera i caratteri centrali con puntini (es. <code>IB•••401</code>), consentendo il riconoscimento a colpo d'occhio.</>}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                      <div className="font-bold text-xs text-orange-500 flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>{settings.language === "en" ? "Layer 2: Total" : "Strato 2: Totale"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? <>Complete solid censorship (<code>••••••••</code>). The text remains hidden until the Privacy or Reveal button is pressed.</> : <>Censura solida completa (<code>••••••••</code>). Il testo rimane occultato finché non si preme il tasto Privacy o Svela.</>}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                      <div className="font-bold text-xs text-purple-500 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4" />
                        <span>{settings.language === "en" ? "Layer 3: AES-256 E2E" : "Strato 3: AES-256 E2E"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Web Crypto API hardware encryption with 100,000 PBKDF2 iterations and AES-GCM 256-bit. The data is mathematically unbreakable." : "Cifratura hardware Web Crypto API con 100.000 iterazioni PBKDF2 e AES-GCM 256-bit. I dati sono matematicamente inviolabili."}
                      </p>
                    </div>
                  </div>

                  {/* SPIEGAZIONE ESPLICITA SUL CAMBIO PASSPHRASE */}
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                    <div className="font-bold text-xs text-purple-600 dark:text-purple-300 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      <span>{settings.language === "en" ? "How and When to Change the Master Passphrase" : "Come e Quando Cambiare la Master Passphrase"}</span>
                    </div>
                    <p className="text-xs text-[var(--text-main)]">
                      <strong>{settings.language === "en" ? "The Master Passphrase can be changed freely at any time:" : "La Master Passphrase può essere modificata liberamente in qualsiasi momento:"}</strong>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                      <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                        <strong>{settings.language === "en" ? "From the Graphical Interface:" : "Dall'Interfaccia Grafica:"}</strong>{settings.language === "en" ? " Click the button " : " Clicca sul pulsante "}<em>"AES-256"</em>{settings.language === "en" ? " in the top bar → in the box " : " nella barra in alto → nel riquadro "}<em>{settings.language === "en" ? "Edit / Change Passphrase" : "Modifica / Cambia Passphrase"}</em>{settings.language === "en" ? " enter the new keyword → click " : " inserisci la nuova parola chiave → clicca "}<em>{settings.language === "en" ? "Update Passphrase" : "Aggiorna Passphrase"}</em>.
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                        <strong>{settings.language === "en" ? "From CLI Terminal:" : "Da Terminale CLI:"}</strong>{settings.language === "en" ? " Open the terminal (" : " Apri il terminale ("}<kbd className="font-mono bg-[var(--bg-subtle)] px-1 rounded">Ctrl+Shift+P</kbd>{settings.language === "en" ? ") and type: " : ") e digita: "}<code>passwd MiaNuovaPassword2026!</code>.
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] pt-1">
                      <em>{settings.language === "en" ? "Effect:" : "Effetto:"}</em> Notula™ ricalcola all'istante la chiave crittografica hardware; da quel momento tutti i nuovi memo cifrati, le modifiche e i file di sincronizzazione su Google™ Drive useranno la nuova Master Passphrase.
                    </p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 5. ESPORTAZIONI & GENERAZIONE PDF */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'exports') && (
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <Download className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "5. Multiformat Exports (JSON, XML, MD, ICS, PDF, TXT)" : "5. Esportazioni Multiformato (JSON, XML, MD, ICS, PDF, TXT)"}</span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)]">
                    Notula™ garantisce la totale libertà di esportazione senza vincoli proprietari. Clicca su <em>"Esporta Archivio"</em> {settings.language === "en" ? "in the sidebar or in the List submenu to choose between:" : "nella barra laterale o nel sottomenu Elenco per scegliere tra:"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-blue-500 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON (.json)</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Database completo strutturato. Ideale per backup integrali e ripristini crittografati AES-256.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-indigo-500 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>XML (.xml)</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        {settings.language === "en" ? "Universal hierarchical structure" : "Struttura universale gerarchica"} <code>&lt;notula&gt;&lt;memo&gt;</code> {settings.language === "en" ? "compliant for document software and corporate archives." : "conforme per software documentali e archivi aziendali."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-purple-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Markdown (.md)</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        File formattato per Obsidian, Notion, GitHub o editor Markdown.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-emerald-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>iCalendar (.ics)</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Eventi e scadenze importabili direttamente in Google™ Calendar,
  CalendarPlus,
  Download, Apple Calendar e Microsoft Outlook.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-amber-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>PDF Ink-Friendly A4</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        {settings.language === "en" ? "Official Notula™ card typeset for paper printing or zero-ink PDF archiving." : "Scheda ufficiale Notula™ impaginata per la stampa su carta o archiviazione PDF a zero consumo d'inchiostro."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Testo Piano (.txt)</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        {settings.language === "en" ? "Pure textual card readable from any device without additional software." : "Scheda testuale pura leggibile da qualsiasi dispositivo senza software aggiuntivo."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 6. SINCRONIZZAZIONE GOOGLE™ DRIVE PER LA PORTABILITÀ */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'sync') && (
                <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                    <Cloud className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "6. Google™ Drive Sync: Total Device Independence" : "6. Sincronizzazione Google™ Drive: Indipendenza Totale dal Dispositivo"}</span>
                  </div>

                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    <strong>{settings.language === "en" ? "You are free and independent from any device or operating system!" : "Sei libero e indipendente da qualsiasi dispositivo o sistema operativo!"}</strong>
                  </p>

                  <div className="space-y-2 text-xs text-[var(--text-muted)]">
                    <p>
                      Grazie all'architettura <strong>Google™ Drive-First</strong>{settings.language === "en" ? ", Notula™ archives the filing system in the reserved folder " : ", Notula™ archivia lo schedario nella cartella riservata "}<code>Notula/</code> {settings.language === "en" ? "of your Google™ account. This means that:" : "del tuo account Google™. Questo significa che:"}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] pl-2">
                      <li>{settings.language === "en" ? "You can use Notula™ on " : "Puoi usare Notula™ su "}<strong>{settings.language === "en" ? "Windows PC, Mac, Linux, Tablet or Smartphone" : "PC Windows, Mac, Linux, Tablet o Smartphone"}</strong>{settings.language === "en" ? ": open the app, click " : ": aprendo l'app e cliccando su "}<em>{settings.language === "en" ? "Download from Google™ Drive" : "Scarica da Google™ Drive"}</em>{settings.language === "en" ? " and find all your synchronized memos." : " ritrovi tutti i tuoi memo sincronizzati."}</li>
                      <li>{settings.language === "en" ? "If you change computers or format the device, " : "Se cambi computer o formatti il dispositivo, "}<strong>{settings.language === "en" ? "you don\'t lose anything" : "non perdi nulla"}</strong>{settings.language === "en" ? ": simply reconnect your Google™ Drive account and enter your Master Passphrase." : ": basta ricollegare il tuo account Google™ Drive e inserire la tua Master Passphrase."}</li>
                      <li><strong>{settings.language === "en" ? "Intelligent Conflict Management:" : "Gestione Conflitti Intelligente:"}</strong>{settings.language === "en" ? " In case of divergence between local memory and Google™ Drive, Notula™ allows you to easily resolve the conflict (Replace [Y], Ignore [I], Duplicate both [M] or Apply to all [A])." : " In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità (Sostituisci [Y], Ignora [I], Duplica entrambi [M] o Applica a tutti [A])."}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
                            {/* ------------------------------------------------------------- */}
              {/* 7. CALENDARIO NATIVO / NOTIFICHE */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'calendar') && (
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "7. Native Calendar Sync & Notifications" : "7. Sincronizzazione Calendario Nativo e Notifiche"}</span>
                  </div>
                  
                  <div className="space-y-3 text-xs text-[var(--text-muted)]">
                    <p>
                      {settings.language === "en" 
                        ? "To guarantee infallible notifications even when Notula™ is completely closed (especially on mobile devices without background processes), the app directly integrates with " 
                        : "Per garantire l'infallibilità delle notifiche anche quando Notula™ è completamente chiusa (specialmente sui dispositivi mobile privi di processi in background), l'app si integra direttamente con "}
                      <strong>Google Calendar</strong>. 
                      {settings.language === "en"
                        ? " You can automatically sync any memo with a single click, completely bypassing the manual download of .ics files. "
                        : " Puoi sincronizzare in automatico qualsiasi memo con un solo clic, bypassando completamente lo scaricamento manuale dei file .ics. "}
                    </p>
                    <p className="mt-2 p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 rounded-lg">
                      {settings.language === "en"
                        ? "Important: To receive offline notifications on your smartphone, you must have the Google Calendar app installed and avoid clearing its cache. When you use Notula's 'Cloud' sync button to restore backups from Google Drive on a new device, Notula will automatically repopulate your Google Calendar with all your active memos!"
                        : "Importante: per ricevere le notifiche offline sullo smartphone, devi avere l'app Google Calendar installata e non svuotarne la cache. Quando usi il pulsante di sincronizzazione 'Cloud' per ripristinare il backup da Google Drive su un nuovo dispositivo, Notula ripopolerà automaticamente anche il tuo Google Calendar in un colpo solo!"}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <h4 className="font-bold text-[#4285F4] flex items-center gap-1.5 mb-2">
                          <CalendarPlus className="w-4 h-4" />
                          {settings.language === "en" ? "Automated Sync & Notifications" : "Notifiche e Sincronizzazione Automatica"}
                        </h4>
                        <p className="text-[11px] leading-relaxed mb-2">
                          {settings.language === "en" 
                            ? "While creating or editing a memo, simply activate the 'Notifications & Sync with Google Calendar' switch. Notula™ will let you choose exactly how many days before you want to be alerted and at what time. Once saved, Notula™ will beam the data directly to your calendar, and Google will reliably wake up your phone or send you an email at the exact minute."
                            : "Durante la creazione o modifica di un memo, attiva semplicemente l'interruttore 'Notifiche e Sync con Google Calendar'. Notula™ ti permetterà di scegliere quanti giorni prima essere avvisato e a che ora. Al salvataggio, Notula™ invierà i dati direttamente al calendario e l'infrastruttura Google si occuperà in totale sicurezza di farti suonare il telefono al minuto esatto."}
                        </p>
                        
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                          <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 text-[11px]">
                            <CalendarPlus className="w-3.5 h-3.5 text-emerald-500" />
                            {settings.language === "en" ? "Desktop OS Notifications (Windows, Mac, Linux)" : "Notifiche su Desktop (Windows, Mac, Linux)"}
                          </h4>
                          <p className="text-[10px] leading-relaxed mb-2">
                            {settings.language === "en"
                              ? "To receive Google Calendar notifications on a Desktop PC without keeping the browser open, you must link your Google Account directly in your Operating System settings:"
                              : "Per ricevere le notifiche di Google Calendar su PC Desktop senza tenere il browser aperto, devi collegare il tuo Account Google direttamente nelle impostazioni del tuo Sistema Operativo:"}
                          </p>
                          <ul className="list-disc pl-4 text-[10px] text-[var(--text-muted)] space-y-1 mb-2">
                            <li><strong>Windows:</strong> {settings.language === "en" ? "Settings > Accounts > Email & accounts > Add Google account. (Notifications appear via Windows Calendar)." : "Impostazioni > Account > E-mail e account > Aggiungi account Google. (Le notifiche appariranno tramite il Calendario di Windows)."}</li>
                            <li><strong>macOS:</strong> {settings.language === "en" ? "System Settings > Internet Accounts > Google." : "Impostazioni di Sistema > Account Internet > Google."}</li>
                            <li><strong>Linux (Debian/Ubuntu):</strong> {settings.language === "en" ? "Settings > Online Accounts > Google. (GNOME will handle notifications natively)." : "Impostazioni > Account Online > Google. (GNOME gestirà le notifiche nativamente)."}</li>
                          </ul>
                          <p className="text-[10px] leading-relaxed mb-2">
                            {settings.language === "en"
                              ? "Fallback: Notula also programs Google Calendar to send an Email reminder. If you have an email client (like Thunderbird) open, you will receive the alert there!"
                              : "Fallback: Notula programma Google Calendar per inviare anche un promemoria via Email. Se hai un client di posta (es. Thunderbird) aperto, riceverai l'avviso lì!"}
                          </p>
                          <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 text-[11px] mt-3">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            {settings.language === "en" ? "What about .ics export and native executables?" : "E l'esportazione .ics e i vecchi eseguibili?"}
                          </h4>
                          <p className="text-[10px] leading-relaxed">
                            {settings.language === "en"
                              ? "The manual .ics download is still available (green icon) as a fallback for offline systems. Also, since Notula functions perfectly as a web cache with Cloud sync, native executables (.exe, .deb) have been permanently removed to keep the code clean."
                              : "Lo scaricamento manuale .ics è ancora disponibile (icona verde) come fallback per i sistemi offline. Inoltre, poiché Notula funziona perfettamente tramite cache web e sync Cloud, i vecchi eseguibili nativi (.exe, .deb) sono stati rimossi in via definitiva per mantenere l'app pulita e leggera."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. ALTRE FUNZIONALITÀ UTILI PER UTENTI NORMALI */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'daily') && (
                <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <Layers className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "8. Daily Features & Practical Shortcuts" : "8. Funzionalità Quotidiane & Scorciatoie Pratiche"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-500" />
                        <span>{settings.language === "en" ? "Multi-Criteria Global Search" : "Ricerca Globale Multi-Criterio"}</span>
                      </div>
                      <p className="text-[var(--text-muted)]">{settings.language === "en" ? "Press the " : "Premi il pulsante "}<em>"Cerca"</em>{settings.language === "en" ? " button to filter by text, exact date, memo ID, or category (only one-time, only recurring, only expired)." : " per filtrare per testo, per data esatta, per ID memo o per categoria (solo puntuali, solo ricorrenti, solo scaduti)."}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>{settings.language === "en" ? "Instant Privacy Mode" : "Modalità Privacy Istantanea"}</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        {settings.language === 'en' ? "By clicking the eye icon in the top bar, you can instantly mask all on-screen content if someone approaches." : "Cliccando sull'icona dell'occhio nella barra superiore, puoi mascherare all'istante tutti i contenuti sullo schermo se qualcuno si avvicina."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>{settings.language === "en" ? "Targeted Deletion and Cleanup" : "Eliminazione Mirata e Pulizia"}</span>
                      </div>
                      <p className="text-[var(--text-muted)]">{settings.language === "en" ? "In the " : "Nel sottomenu "}<em>"Elimina"</em>{settings.language === "en" ? " submenu, you can delete memos by single ID, whole year, month, date, recurrence, or just expired ones." : " puoi cancellare memo per singolo ID, per intero anno, per mese, per data, per ricorrenza o solo quelli già scaduti."}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>{settings.language === "en" ? "Quick Navigation • Key (Today)" : "Navigazione Rapida • Tasto (Oggi)"}</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        In qualunque mese o anno tu sia nel calendario, con un solo clic sul pulsante <em>(Oggi)</em> ritorni istantaneamente alla data corrente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 8. MOTORE DI RICERCA GEM E CATEGORIE */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'gem') && (
                <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <ListFilter className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "8. GEM Architecture & List Categories" : "8. Architettura GEM & Categorie di Ricerca"}</span>
                  </div>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    {settings.language === "en" 
                      ? "The application uses a specialized logic for categorizing standard (punctual) events vs recurring events." 
                      : "L'applicazione utilizza una logica specializzata per categorizzare gli eventi standard (puntuali) rispetto a quelli ricorrenti."}
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    {/* Puntuali */}
                    <div>
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{settings.language === "en" ? "Punctual Memos (Non-recurring)" : "Memo Puntuali (Non ricorrenti)"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">b. {settings.language === "en" ? "Year" : "Anno"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Filter by year only (e.g. 2026)." : "Filtra per il solo anno (es. 2026)."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">c. {settings.language === "en" ? "Y/M" : "A/M"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Filter by year and month." : "Filtra per anno e mese (es. Agosto 2026)."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">d. {settings.language === "en" ? "Y/M/D" : "A/M/G"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Filter by exact date." : "Filtra per data esatta (es. 15 Agosto 2026)."}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ricorrenti */}
                    <div>
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mb-2">
                        <Repeat className="w-4 h-4 text-emerald-500" />
                        <span>{settings.language === "en" ? "Recurring Memos (Eternal)" : "Memo Ricorrenti (Eterni)"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">e. {settings.language === "en" ? "All Recurring" : "Tutti i Ricorrenti"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows all repeating memos." : "Mostra tutti gli eventi con ricorrenza."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">f. {settings.language === "en" ? "Month (Yearly)" : "Mese (Annuali)"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows yearly recurrences falling in a specific month." : "Mostra le ricorrenze annuali (es. compleanni) in uno specifico mese."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">g. {settings.language === "en" ? "Day (Monthly)" : "Giorno (Mensili)"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows monthly recurrences falling on a specific day." : "Mostra le ricorrenze mensili che cadono in un dato giorno."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">h. {settings.language === "en" ? "Weekly/Daily" : "Sett./Giorn."}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows high-frequency recurring memos." : "Mostra gli eventi ad altissima frequenza."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 9. TERMINALE CLI (RIGOROSAMENTE ALLA FINE PER UTENTI AVANZATI) */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'cli') && (
                <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <Terminal className="w-5 h-5 shrink-0" />
                      <span>{settings.language === "en" ? "8. CLI Terminal for Advanced & Power Users" : "8. Terminale CLI per Utenti Avanzati & Power Users"}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 font-bold">
                        {settings.language === "en" ? "Shortcut: Ctrl+Shift+P" : "Scorciatoia: Ctrl+Shift+P"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenCliManual) {
                            onOpenCliManual();
                          } else {
                            setIsCliManualOpen(true);
                          }
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{settings.language === "en" ? "Open Official CLI Manual" : "Apri Manuale Ufficiale CLI"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Banner di accesso diretto al Manuale Ufficiale della CLI */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                        <Code2 className="w-4 h-4 text-emerald-500" />
                        <span>{settings.language === "en" ? "Official NOTULA™ CLI v2.2 Manual (Engineering Edition)" : "Manuale Ufficiale NOTULA™ CLI v2.2 (Edizione Ingegneristica)"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Documentazione completa dei 17 comandi con sintassi POSIX, opzioni, esempi reali, architettura <code className="font-mono text-emerald-500">groupID</code>{settings.language === "en" ? " and source " : " e sorgente "}<span className="font-mono font-semibold">LaTeX (.tex)</span> accademico.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenCliManual) {
                          onOpenCliManual();
                        } else {
                          setIsCliManualOpen(true);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{settings.language === "en" ? "Consult Full Manual" : "Consulta Manuale Completo"}</span>
                    </button>
                  </div>

                  <p className="text-xs text-[var(--text-muted)]">
                    {settings.language === "en" ? "For engineers, sysadmins, and keyboard lovers, Notula™ includes a full interactive shell with support for commands for creation," : "Per ingegneri, amministratori di sistema e amanti della tastiera, Notula™ include una shell interattiva completa con supporto a comandi per creazione,"} <strong>{settings.language === "en" ? "edit (`edit`)" : "modifica (`edit`)"}</strong>{settings.language === "en" ? " with automatic group synchronization (`groupID`), " : " con sincronizzazione automatica dei gruppi (`groupID`), "}<strong>{settings.language === "en" ? "multiformat export (`export` / `pdf`)" : "esportazione multiformato (`export` / `pdf`)"}</strong>{settings.language === "en" ? " and " : " e "}<strong>{settings.language === "en" ? "import (`import`)" : "importazione (`import`)"}</strong>.
                  </p>

                  {/* Tabella Comandi Principali CLI */}
                  <div className="bg-[#0d1117] text-gray-200 font-mono text-[11px] p-4 rounded-xl border border-[#30363d] space-y-3 overflow-x-auto">
                    
                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">{settings.language === "en" ? "1. CREATE & EDIT MEMOS (add • edit)" : "1. CREAZIONE & MODIFICA MEMO (add • edit)"}</div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-cyan-300">add --title "Udienza" --date 2026-09-20</span> <span className="text-gray-400 text-[10px]">• Singola scadenza</span></div>
                        <div><span className="text-cyan-300">add --title "Server" --date 2026-09-01 --repeat monthly --desc "Fattura 88" --encrypt</span> <span className="text-gray-400 text-[10px]">• Ricorrente cifrato AES-256</span></div>
                        <div><span className="text-cyan-300">edit --id n_12345 --title "Udienza Rinviata" --date 2026-10-15</span> <span className="text-gray-400 text-[10px]">• Modifica memo (aggiorna in automatico tutti i memo con lo stesso groupID)</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        2. ESPORTAZIONI MULTIFORMATO & GENERAZIONE PDF (export • pdf)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-amber-300">export --id n_12345 --format json|xml|md|ics|pdf|txt</span> <span className="text-gray-400 text-[10px]">• Esporta singolo memo nel formato indicato</span></div>
                        <div><span className="text-amber-300">export --all --format json|xml|md|ics|txt</span> <span className="text-gray-400 text-[10px]">• Esporta l'intero archivio</span></div>
                        <div><span className="text-amber-300">export --year 2026 --format ics</span> <span className="text-gray-400 text-[10px]">• Esporta scadenze dell'anno in iCalendar (.ics)</span></div>
                        <div><span className="text-amber-300">pdf --id n_12345</span> <span className="text-gray-400 text-[10px]">• Genera e scarica all'istante il PDF A4 Ink-Friendly</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        3. IMPORTAZIONE DATI (import)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-purple-300">import --json '[&#123;"title":"...","expirationDate":"2026-09-01"&#125;]'</span> <span className="text-gray-400 text-[10px]">• Importa array JSON da testo</span></div>
                        <div><span className="text-purple-300">import --xml '&lt;notula&gt;&lt;memos&gt;...&lt;/memos&gt;&lt;/notula&gt;'</span> <span className="text-gray-400 text-[10px]">• Importa XML da testo</span></div>
                        <div><span className="text-purple-300">import</span> <span className="text-gray-400 text-[10px]">• Apre la finestra di dialogo grafica per selezionare file .json o .xml</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">{settings.language === "en" ? "4. VIEW AND LIST MEMOS (ls • list)" : "4. VISUALIZZAZIONE ED ELENCO MEMO (ls • list)"}</div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-yellow-300">ls</span> <span className="text-gray-400 text-[10px]">• Mostra tutti i memo presenti</span></div>
                        <div><span className="text-yellow-300">ls --year 2026</span> <span className="text-gray-400 text-[10px]">• Filtra per anno (solo puntuali)</span></div>
                        <div><span className="text-yellow-300">ls --group grp_12345</span> <span className="text-gray-400 text-[10px]">• Mostra tutti i memo della serie collegata</span></div>
                        <div><span className="text-yellow-300">ls --expired</span> <span className="text-gray-400 text-[10px]">• Mostra esclusivamente i memo scaduti</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        5. LE 9 MODALITÀ DI ELIMINAZIONE MIRATA (rm / remove)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-red-400">rm --id n_12345</span> <span className="text-gray-400 text-[10px]">• 1. Elimina singolo memo per ID</span></div>
                        <div><span className="text-red-400">rm --group grp_12345</span> <span className="text-gray-400 text-[10px]">• Elimina l'intera serie ricorrente legata da groupID</span></div>
                        <div><span className="text-red-400">rm --title "Udienza"</span> <span className="text-gray-400 text-[10px]">• Elimina per corrispondenza del titolo</span></div>
                        <div><span className="text-red-400">rm --expired</span> <span className="text-gray-400 text-[10px]">• Elimina tutti i memo scaduti</span></div>
                        <div><span className="text-red-400">rm --all</span> <span className="text-gray-400 text-[10px]">• Elimina TUTTI i memo (pulizia totale)</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        6. UTILITY, SICUREZZA & GOOGLE™ DRIVE
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-blue-300">passwd NuovaPassword2026!</span> <span className="text-gray-400 text-[10px]">• Modifica/imposta Master Passphrase AES-256</span></div>
                        <div><span className="text-blue-300">find --title "progetto"</span> <span className="text-gray-400 text-[10px]">• Ricerca testuale rapida</span></div>
                        <div><span className="text-blue-300">info n_12345</span> <span className="text-gray-400 text-[10px]">• Scheda diagnostica completa con groupID</span></div>
                        <div><span className="text-blue-300">sync</span> <span className="text-gray-400 text-[10px]">• Avvia sincronizzazione da Google™ Drive</span></div>
                        <div><span className="text-blue-300">cloud-test</span> <span className="text-gray-400 text-[10px]">• Diagnostica di connessione Google™ Drive</span></div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
            <span>&copy; 2026 Ing. Mario Fantini</span>
            <span>•</span>
            <a href="https://mariofantini.eu" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              mariofantini.eu
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {settings.language === "en" ? "Close Guide" : "Chiudi Guida"}
          </button>
        </div>

      </div>

      {/* Official CLI Manual Viewer */}
      <CliManualModal
        isOpen={isCliManualOpen}
        onClose={() => setIsCliManualOpen(false)}
      />
    </div>
  );
};

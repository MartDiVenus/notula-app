/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState, useEffect } from 'react';
import { 
  Info, 
  X, 
  ShieldCheck, 
  Lock, 
  Cloud, 
  Terminal, 
  Calendar, 
  FileText, 
  Globe, 
  ExternalLink, 
  Copyright, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Eye, 
  EyeOff,
  HardDrive,
  RefreshCw,
  Award,
  KeyRound,
  Download,
  HelpCircle,
  Hash,
  Filter,
  Trash2,
  Search,
  Repeat,
  Smartphone,
  Laptop,
  Check,
  Shield,
  Palette,
  Clock,
  ArrowRight,
  Code2,
  FileCode
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
  const [activeTab, setActiveTab] = useState<'info' | 'guide'>(initialTab);
  const [isCliManualOpen, setIsCliManualOpen] = useState<boolean>(false);
  const [guideSection, setGuideSection] = useState<
    'all' | 'intro' | 'features' | 'legend' | 'security' | 'exports' | 'sync' | 'daily' | 'cli'
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
                  Notula™ &bull; Centro Informazioni &amp; Guida Utente
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  v2.2 Enterprise
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Ideazione, Sviluppo &amp; Proprietà Intellettuale &bull; <strong>Ing. Mario Fantini</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition cursor-pointer"
            title="Chiudi (Esc)"
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
            <span>Autore, Contatti, Copyright</span>
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
            <span>Installazione, Emblema</span>
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
            <span>Guida Funzionale, Manuale d'Uso</span>
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
                      Ideatore, Sviluppatore &amp; Titolare Unico
                    </div>
                    <div className="text-lg font-extrabold text-[var(--text-main)]">
                      Ing. Mario Fantini
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      Ingegneria del Software &bull; Crittografia Hardware E2E &bull; Algoritmi di Sincronizzazione Google™ Drive-First
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
                  <span>Avviso di Riserva Integrale dei Diritti &amp; Tutela Proprietà Intellettuale</span>
                </div>
                
                <div className="font-mono text-[11px] bg-black/10 dark:bg-black/40 p-3 rounded-lg border border-[var(--border-color)] text-[var(--text-main)] space-y-1">
                  <div><strong>Copyright &copy; 2026 Ing. Mario Fantini. Tutti i diritti riservati.</strong></div>
                  <div><strong>All Rights Reserved &bull; Proprietary &amp; Confidential Software.</strong></div>
                </div>

                <div className="text-xs text-[var(--text-muted)] space-y-2 text-justify">
                  <p>
                    L'applicazione <strong>Notula™</strong>, comprensiva della sua architettura software, dell'interfaccia a riga di comando (CLI), del motore di sincronizzazione bidirezionale Google™ Drive-First, del sistema di offuscamento multilivello e della crittografia hardware AES-256 GCM, è protetta dalle leggi vigenti in materia di diritto d'autore e proprietà intellettuale (Legge 22 aprile 1941 n. 633 e successive modifiche, nonché convenzioni WIPO/OMPI).
                  </p>
                  <p>
                    <strong>Intellectual Property Notice</strong>: Si rimanda al file <code className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 rounded">README.md</code> per approfondimenti riguardo la proprietà intellettuale ("Intellectual Property Notice"), in cui si esplicita che l'architettura software, la logica di parsing e il codice sorgente sono opera proprietaria dell'autore. Manifestazioni di interesse per l'acquisizione completa dei diritti commerciali sono valutabili, previa intesa economica e salvaguardando la paternità storica e morale (Contatto: marfant7@gmail.com).
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
                      Progressive Web App (PWA)
                    </div>
                    <div className="text-lg font-extrabold text-[var(--text-main)]">
                      Installazione Ufficiale
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      Installa Notula™ direttamente sul tuo dispositivo per un'esperienza nativa e offline.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://martdivenus.github.io/notula-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition"
                    title="URL ufficiale per l'installazione della Web App (PWA)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installa Web App</span>
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
                      <span>L'Emblema Notula™: Radici Storiche, Volatile di Apollo &amp; Astronomia</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      L'emblema visivo di Notula™ è stato disegnato e concepito dall'<strong>Ing. Mario Fantini</strong> per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:
                    </p>
                  </div>
                </div>

                {/* Scomposizione dei 3 Elementi Simbolici */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                    <div className="font-bold text-xs text-blue-500 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-bold border border-blue-500/20">1</span>
                      <span>Tavoletta dei Fasti Romani</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Rappresenta la <em>Tabula</em> in pietra incisa del calendario nell'Antica Roma, su cui venivano scolpite le scadenze legali, le festività e i giorni <em>Fasti</em> e <em>Nefasti</em>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                    <div className="font-bold text-xs text-indigo-500 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold border border-indigo-500/20">2</span>
                      <span>L'Uccello Messaggero di Apollo</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Nobile volatile rapace, con becco dorato acuminato e coda a ventaglio. Simbolo araldico di tempestività e custodia delle memorie nel tempo.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                    <div className="font-bold text-xs text-amber-500 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] font-bold border border-amber-500/20">3</span>
                      <span>Stelle di Orientamento</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      I punti cardinali, la stella polare e le costellazioni che guidavano gli antichi romani nell'osservazione astronomica, nella navigazione e nella scansione ciclica delle stagioni.
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
                  Tutte le Sezioni
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('intro')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'intro' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  1. Cosa fa Notula™
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('features')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'features' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  2. Punti di Forza
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('legend')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'legend' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  3. Legenda &amp; Ricorrenze (groupID)
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('security')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'security' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  4. Sicurezza &amp; Passphrase
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('exports')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'exports' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  5. Esportazioni &amp; PDF
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('sync')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'sync' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  6. Google™ Drive
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('daily')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'daily' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  7. Funzioni Quotidiane
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('cli')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'cli' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  8. Terminale CLI (edit/export/import)
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 1. COSA FA NOTULA */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'intro') && (
                <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <BookOpen className="w-5 h-5 shrink-0" />
                    <span>1. Cosa Fa Notula™: Lo Schedario Ingegneristico Universale</span>
                  </div>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    <strong>Notula™</strong> è una piattaforma avanzata per la gestione temporale di promemoria, scadenze critiche, adempimenti legali/fiscali, progetti professionali e note personali protette.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-blue-500 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Scadenze Puntuali</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Impegni con una data esatta, contrassegnati da stati cromatici temporali (scaduto, oggi, futuro).
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-emerald-500 text-xs flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Ricorrenze Perpetue</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Canoni, fatture, rinnovi, compleanni o tagliandi con ripetizione giornaliera, settimanale, mensile o annuale.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-purple-500 text-xs flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Protezione Multi-Strato</span>
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
                    <span>2. Peculiarità e Punti di Forza Unici di Notula™</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Sovranità Assoluta sui Dati (Zero Cloud Terzo)</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        A differenza delle comuni app SaaS commerciali, Notula™ non archivia nulla su server proprietari o database remoti. I dati appartengono solo all'utente.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Architettura Offline-First &amp; Immediata</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Funziona sempre, anche in assenza totale di connessione Internet. All'avvio carica istantaneamente l'archivio locale.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Aggiornamento Automatico Ricorrenze (groupID)</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Modificando un memo ricorrente legato a una serie, tutti gli altri memo della serie collegati da groupID vengono sincronizzati in automatico.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Doppia Interfaccia: GUI &bull; CLI</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Interfaccia grafica ad alta reattività con calendario interattivo unita a un potente terminale a riga di comando ingegneristico.
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
                    <span>3. Legenda Visiva del Calendario &amp; Gestione Ricorrenze con groupID</span>
                  </div>

                  <p className="text-xs text-[var(--text-main)]">
                    Il calendario Notula™ adotta una semantica cromatica rigorosa per distinguere al colpo d'occhio la natura e l'urgenza di ciascun evento:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border-2 border-red-500 bg-transparent shrink-0"></span>
                        <span>Memo Puntuali (Bordo Cromatico Rettangolare)</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-[var(--text-muted)] pl-1">
                        <li className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded border-2 border-red-500 bg-transparent shrink-0"></span>
                          <span><strong className="text-red-500">Bordo Rosso:</strong> Scaduto (la data è già passata).</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded border-2 border-amber-500 bg-transparent shrink-0"></span>
                          <span><strong className="text-amber-500">Bordo Arancione:</strong> In scadenza Oggi.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded border-2 border-fuchsia-500 bg-transparent shrink-0"></span>
                          <span><strong className="text-pink-500">Bordo Magenta/Viola:</strong> Scadenza futura nel mese.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span>Memo Ricorrenti (Pallino Pieno &bull;)</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-[var(--text-muted)] pl-2">
                        <li><strong className="text-emerald-500">&bull; Verde:</strong> Ricorrente Annuale / Mensile.</li>
                        <li><strong className="text-blue-500">&bull; Blu:</strong> Ricorrente Settimanale / Giornaliero.</li>
                        <li><strong className="text-purple-500">&bull; Viola:</strong> Con Cifratura AES-256 attiva.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-blue-500/30 text-[11px] text-[var(--text-muted)] space-y-1">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      Come funziona l'aggiornamento automatico con groupID:
                    </div>
                    <p>
                      Quando crei o cloni un memo ricorrente (es. per 15 giorni o 12 mesi), Notula™ assegna a tutti i memo della serie lo stesso <code>groupID</code>. Se modifichi il memo di oggi (titolo, note o livello di sicurezza), le modifiche vengono propagate <strong>automaticamente a tutti i memo collegati</strong>, preservando le rispettive date del calendario!
                    </p>
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
                    <span>4. I 3 Strati di Sicurezza Notula™ &amp; Gestione Passphrase</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                      <div className="font-bold text-xs text-amber-500 flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4" />
                        <span>Strato 1: Parziale</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Maschera i caratteri centrali con puntini (es. <code>IB•••401</code>), consentendo il riconoscimento a colpo d'occhio.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                      <div className="font-bold text-xs text-orange-500 flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>Strato 2: Totale</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Censura solida completa (<code>••••••••</code>). Il testo rimane occultato finché non si preme il tasto Privacy o Svela.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                      <div className="font-bold text-xs text-purple-500 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4" />
                        <span>Strato 3: AES-256 E2E</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Cifratura hardware Web Crypto API con 100.000 iterazioni PBKDF2 e AES-GCM 256-bit. I dati sono matematicamente inviolabili.
                      </p>
                    </div>
                  </div>

                  {/* SPIEGAZIONE ESPLICITA SUL CAMBIO PASSPHRASE */}
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                    <div className="font-bold text-xs text-purple-600 dark:text-purple-300 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      <span>Come e Quando Cambiare la Master Passphrase</span>
                    </div>
                    <p className="text-xs text-[var(--text-main)]">
                      <strong>La Master Passphrase può essere modificata liberamente in qualsiasi momento:</strong>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                      <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                        <strong>Dall'Interfaccia Grafica:</strong> Clicca sul pulsante <em>"AES-256"</em> nella barra in alto &rarr; nel riquadro <em>"Modifica / Cambia Passphrase"</em> inserisci la nuova parola chiave &rarr; clicca <em>"Aggiorna Passphrase"</em>.
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                        <strong>Da Terminale CLI:</strong> Apri il terminale (<kbd className="font-mono bg-[var(--bg-subtle)] px-1 rounded">Ctrl+Shift+P</kbd>) e digita: <code>passwd MiaNuovaPassword2026!</code>.
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] pt-1">
                      <em>Effetto:</em> Notula™ ricalcola all'istante la chiave crittografica hardware; da quel momento tutti i nuovi memo cifrati, le modifiche e i file di sincronizzazione su Google™ Drive useranno la nuova Master Passphrase.
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
                    <span>5. Esportazioni Multiformato (JSON, XML, MD, ICS, PDF, TXT)</span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)]">
                    Notula™ garantisce la totale libertà di esportazione senza vincoli proprietari. Clicca su <em>"Esporta Archivio"</em> nella barra laterale o nel sottomenu Elenco per scegliere tra:
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
                        Struttura universale gerarchica <code>&lt;notula&gt;&lt;memo&gt;</code> conforme per software documentali e archivi aziendali.
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
                        Eventi e scadenze importabili direttamente in Google™ Calendar, Apple Calendar e Microsoft Outlook.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-amber-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>PDF Ink-Friendly A4</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Scheda ufficiale Notula™ impaginata per la stampa su carta o archiviazione PDF a zero consumo d'inchiostro.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Testo Piano (.txt)</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Scheda testuale pura leggibile da qualsiasi dispositivo senza software aggiuntivo.
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
                    <span>6. Sincronizzazione Google™ Drive: Indipendenza Totale dal Dispositivo</span>
                  </div>

                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    <strong>Sei libero e indipendente da qualsiasi dispositivo o sistema operativo!</strong>
                  </p>

                  <div className="space-y-2 text-xs text-[var(--text-muted)]">
                    <p>
                      Grazie all'architettura <strong>Google™ Drive-First</strong>, Notula™ archivia lo schedario nella cartella riservata <code>Notula/</code> del tuo account Google™. Questo significa che:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] pl-2">
                      <li>Puoi usare Notula™ su <strong>PC Windows, Mac, Linux, Tablet o Smartphone</strong>: aprendo l'app e cliccando su <em>"Scarica da Google™ Drive"</em> ritrovi tutti i tuoi memo sincronizzati.</li>
                      <li>Se cambi computer o formatti il dispositivo, <strong>non perdi nulla</strong>: basta ricollegare il tuo account Google™ Drive e inserire la tua Master Passphrase.</li>
                      <li><strong>Gestione Conflitti Intelligente:</strong> In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità (Sostituisci [Y], Ignora [I], Duplica entrambi [M] o Applica a tutti [A]).</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 7. ALTRE FUNZIONALITÀ UTILI PER UTENTI NORMALI */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'daily') && (
                <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <Layers className="w-5 h-5 shrink-0" />
                    <span>7. Funzionalità Quotidiane &amp; Scorciatoie Pratiche</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-500" />
                        <span>Ricerca Globale Multi-Criterio</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Premi il pulsante <em>"Cerca"</em> per filtrare per testo, per data esatta, per ID memo o per categoria (solo puntuali, solo ricorrenti, solo scaduti).
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>Modalità Privacy Istantanea</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Cliccando sull'icona dell'occhio nella barra superiore, puoi mascherare all'istante tutti i contenuti sullo schermo se qualcuno si avvicina.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Eliminazione Mirata e Pulizia</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        Nel sottomenu <em>"Elimina"</em> puoi cancellare memo per singolo ID, per intero anno, per mese, per data, per ricorrenza o solo quelli già scaduti.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                      <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>Navigazione Rapida &bull; Tasto "Oggi"</span>
                      </div>
                      <p className="text-[var(--text-muted)]">
                        In qualunque mese o anno tu sia nel calendario, con un solo clic sul pulsante <em>"Oggi"</em> ritorni istantaneamente alla data corrente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 8. TERMINALE CLI (RIGOROSAMENTE ALLA FINE PER UTENTI AVANZATI) */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'cli') && (
                <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <Terminal className="w-5 h-5 shrink-0" />
                      <span>8. Terminale CLI per Utenti Avanzati &amp; Power Users</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 font-bold">
                        Scorciatoia: Ctrl+Shift+P
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
                        <span>Apri Manuale Ufficiale CLI</span>
                      </button>
                    </div>
                  </div>

                  {/* Banner di accesso diretto al Manuale Ufficiale della CLI */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                        <Code2 className="w-4 h-4 text-emerald-500" />
                        <span>Manuale Ufficiale NOTULA™ CLI v2.2 (Edizione Ingegneristica)</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Documentazione completa dei 17 comandi con sintassi POSIX, opzioni, esempi reali, architettura <code className="font-mono text-emerald-500">groupID</code> e sorgente <span className="font-mono font-semibold">LaTeX (.tex)</span> accademico.
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
                      <span>Consulta Manuale Completo</span>
                    </button>
                  </div>

                  <p className="text-xs text-[var(--text-muted)]">
                    Per ingegneri, amministratori di sistema e amanti della tastiera, Notula™ include una shell interattiva completa con supporto a comandi per creazione, <strong>modifica (`edit`)</strong> con sincronizzazione automatica dei gruppi (`groupID`), <strong>esportazione multiformato (`export` / `pdf`)</strong> e <strong>importazione (`import`)</strong>.
                  </p>

                  {/* Tabella Comandi Principali CLI */}
                  <div className="bg-[#0d1117] text-gray-200 font-mono text-[11px] p-4 rounded-xl border border-[#30363d] space-y-3 overflow-x-auto">
                    
                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        1. CREAZIONE &amp; MODIFICA MEMO (add &bull; edit)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-cyan-300">add --title "Udienza" --date 2026-09-20</span> <span className="text-gray-400 text-[10px]">&bull; Singola scadenza</span></div>
                        <div><span className="text-cyan-300">add --title "Server" --date 2026-09-01 --repeat monthly --desc "Fattura 88" --encrypt</span> <span className="text-gray-400 text-[10px]">&bull; Ricorrente cifrato AES-256</span></div>
                        <div><span className="text-cyan-300">edit --id n_12345 --title "Udienza Rinviata" --date 2026-10-15</span> <span className="text-gray-400 text-[10px]">&bull; Modifica memo (aggiorna in automatico tutti i memo con lo stesso groupID)</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        2. ESPORTAZIONI MULTIFORMATO &amp; GENERAZIONE PDF (export &bull; pdf)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-amber-300">export --id n_12345 --format json|xml|md|ics|pdf|txt</span> <span className="text-gray-400 text-[10px]">&bull; Esporta singolo memo nel formato indicato</span></div>
                        <div><span className="text-amber-300">export --all --format json|xml|md|ics|txt</span> <span className="text-gray-400 text-[10px]">&bull; Esporta l'intero archivio</span></div>
                        <div><span className="text-amber-300">export --year 2026 --format ics</span> <span className="text-gray-400 text-[10px]">&bull; Esporta scadenze dell'anno in iCalendar (.ics)</span></div>
                        <div><span className="text-amber-300">pdf --id n_12345</span> <span className="text-gray-400 text-[10px]">&bull; Genera e scarica all'istante il PDF A4 Ink-Friendly</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        3. IMPORTAZIONE DATI (import)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-purple-300">import --json '[&#123;"title":"...","expirationDate":"2026-09-01"&#125;]'</span> <span className="text-gray-400 text-[10px]">&bull; Importa array JSON da testo</span></div>
                        <div><span className="text-purple-300">import --xml '&lt;notula&gt;&lt;memos&gt;...&lt;/memos&gt;&lt;/notula&gt;'</span> <span className="text-gray-400 text-[10px]">&bull; Importa XML da testo</span></div>
                        <div><span className="text-purple-300">import</span> <span className="text-gray-400 text-[10px]">&bull; Apre la finestra di dialogo grafica per selezionare file .json o .xml</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        4. VISUALIZZAZIONE ED ELENCO MEMO (ls &bull; list)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-yellow-300">ls</span> <span className="text-gray-400 text-[10px]">&bull; Mostra tutti i memo presenti</span></div>
                        <div><span className="text-yellow-300">ls --year 2026</span> <span className="text-gray-400 text-[10px]">&bull; Filtra per anno (solo puntuali)</span></div>
                        <div><span className="text-yellow-300">ls --group grp_12345</span> <span className="text-gray-400 text-[10px]">&bull; Mostra tutti i memo della serie collegata</span></div>
                        <div><span className="text-yellow-300">ls --expired</span> <span className="text-gray-400 text-[10px]">&bull; Mostra esclusivamente i memo scaduti</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        5. LE 9 MODALITÀ DI ELIMINAZIONE MIRATA (rm / remove)
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-red-400">rm --id n_12345</span> <span className="text-gray-400 text-[10px]">&bull; 1. Elimina singolo memo per ID</span></div>
                        <div><span className="text-red-400">rm --group grp_12345</span> <span className="text-gray-400 text-[10px]">&bull; Elimina l'intera serie ricorrente legata da groupID</span></div>
                        <div><span className="text-red-400">rm --title "Udienza"</span> <span className="text-gray-400 text-[10px]">&bull; Elimina per corrispondenza del titolo</span></div>
                        <div><span className="text-red-400">rm --expired</span> <span className="text-gray-400 text-[10px]">&bull; Elimina tutti i memo scaduti</span></div>
                        <div><span className="text-red-400">rm --all</span> <span className="text-gray-400 text-[10px]">&bull; Elimina TUTTI i memo (pulizia totale)</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-emerald-400 font-bold pb-1 border-b border-gray-700">
                        6. UTILITY, SICUREZZA &amp; GOOGLE™ DRIVE
                      </div>
                      <div className="mt-1 space-y-1">
                        <div><span className="text-blue-300">passwd NuovaPassword2026!</span> <span className="text-gray-400 text-[10px]">&bull; Modifica/imposta Master Passphrase AES-256</span></div>
                        <div><span className="text-blue-300">find --title "progetto"</span> <span className="text-gray-400 text-[10px]">&bull; Ricerca testuale rapida</span></div>
                        <div><span className="text-blue-300">info n_12345</span> <span className="text-gray-400 text-[10px]">&bull; Scheda diagnostica completa con groupID</span></div>
                        <div><span className="text-blue-300">sync</span> <span className="text-gray-400 text-[10px]">&bull; Avvia sincronizzazione da Google™ Drive</span></div>
                        <div><span className="text-blue-300">cloud-test</span> <span className="text-gray-400 text-[10px]">&bull; Diagnostica di connessione Google™ Drive</span></div>
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
            <span>&bull;</span>
            <a href="https://mariofantini.eu" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              mariofantini.eu
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Chiudi Guida
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

/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState, useEffect, useRef } from 'react';
import { NotulaCore } from '../utils/notulaCore';
import { MemoItem, RepeatType, ObfuscationLevel } from '../types';
import { exportSingleMemo, exportAllMemos, parseJSONMemos, parseXMLMemos, generateMemoPDF } from '../utils/exportImport';
import { testDriveDiagnostics } from '../utils/driveSync';
import { Terminal, Maximize2, Minimize2, X, CornerDownLeft, Sparkles, Shield, Trash2, HelpCircle, KeyRound, BookOpen, Download, Upload, FileText, Edit3, FileCode } from 'lucide-react';
import { CliManualModal } from './CliManualModal';

interface TerminalCLIProps {
  isOpen: boolean;
  onClose: () => void;
  core: NotulaCore;
  onMemosChanged: () => void;
  privacyMode: boolean;
  onTogglePrivacy: (val?: boolean) => void;
  masterPassword: string | null;
  onSetMasterPassword: (pwd: string | null) => void;
  onTriggerImport: () => void;
  onDownloadDrive: () => void;
  onChangeTheme: (theme: 'system' | 'light' | 'dark') => void;
}

export const TerminalCLI: React.FC<TerminalCLIProps> = ({
  isOpen,
  onClose,
  core,
  onMemosChanged,
  privacyMode,
  onTogglePrivacy,
  masterPassword,
  onSetMasterPassword,
  onTriggerImport,
  onDownloadDrive,
  onChangeTheme,
}) => {
  const [windowState, setWindowState] = useState<'docked' | 'fullscreen' | 'half'>('docked');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [inputVal, setInputVal] = useState<string>('');
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [outputLines, setOutputLines] = useState<string[]>([
    "══════════════════════════════════════════════════════════════════════════════",
    "  NOTULA™ CLI v2.2 • INTERPRETE COMANDI INGEGNERISTICO",
    "  Ideazione & Sviluppo: Ing. Mario Fantini • https://mariofantini.eu",
    "══════════════════════════════════════════════════════════════════════════════",
    "💡 Digita 'help' per consultare la guida o 'man' per aprire il Manuale Ufficiale.",
    "   Comandi: add, edit, export (json/xml/md/ics/pdf/txt), import, pdf, ls, rm, man.",
  ]);

  const outputContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (outputContainerRef.current) {
          outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [isOpen, outputLines]);

  if (!isOpen) return null;

  const log = (msg: string) => {
    setOutputLines((prev) => [...prev, msg]);
  };

  const parseArgs = (cmdStr: string): string[] => {
    const matches = cmdStr.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    return matches.map((arg) => {
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        return arg.substring(1, arg.length - 1);
      }
      return arg;
    });
  };

  const getFlag = (args: string[], flag: string): string | null => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    log(`notula> ${rawCmd}`);
    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIdx(-1);
    setInputVal('');

    const rawArgs = parseArgs(rawCmd);
    const hasNotulaPrefix = rawArgs[0]?.toLowerCase() === 'notula';
    const args = hasNotulaPrefix ? rawArgs.slice(1) : rawArgs;
    const action = args[0]?.toLowerCase();

    if (!action) {
      log("Digita 'help' per visualizzare tutti i comandi disponibili.");
      return;
    }

    if (action === 'clear' || action === 'cls') {
      setOutputLines([]);
      return;
    }

    if (action === 'exit' || action === 'quit') {
      onClose();
      return;
    }

    if (action === 'fullscreen' || action === 'max') {
      setWindowState('fullscreen');
      log("Terminale impostato a schermo intero.");
      return;
    }

    if (action === 'restore' || action === 'dock' || action === 'min') {
      setWindowState('docked');
      log("Terminale ripristinato in finestra standard.");
      return;
    }

    if (action === 'man' || action === 'manual' || action === 'doc') {
      setIsManualOpen(true);
      log("📖 Apertura del Manuale Ufficiale NOTULA™ CLI v2.2 (Edizione Ingegneristica)...");
      return;
    }

    if (action === 'help' || action === '--help' || action === '-h') {
      log("─────────────────────────────────────────────────────────────────────────");
      log("  GUIDA COMPLETA COMANDI NOTULA™ CLI (Ing. Mario Fantini)");
      log("─────────────────────────────────────────────────────────────────────────");
      log("1. CREAZIONE MEMO:");
      log("   add --title \"<titolo>\" --date YYYY-MM-DD [--desc \"...\"] [--repeat <giorni>] [--obfuscate none|partial|full] [--encrypt]");
      log("   • Default (memo puntuale singolo): add --title \"Revisione\" --date 2026-09-01");
      log("   • Ricorrente (ripetizione per N giorni): add --title \"Revisione\" --date 2026-09-01 --repeat 10");
      log("   • Esempio cifrato: add --title \"Udienza Tribunale\" --date 2026-09-15 --desc \"Fascicolo 401\" --encrypt");
      log("");
      log("2. MODIFICA & AGGIORNAMENTO (edit):");
      log("   edit --id <id> [--title \"...\"] [--date YYYY-MM-DD] [--desc \"...\"] [--repeat ...] [--obfuscate ...] [--encrypt / --no-encrypt]");
      log("   Esempio: edit --id n_123 --title \"Udienza Rinviata\" --date 2026-10-02");
      log("   (Nota: la modifica sincronizza AUTOMATICAMENTE tutti i memo collegati dallo stesso groupID!)");
      log("");
      log("3. ESPORTAZIONE MULTIFORMATO (export):");
      log("   export --id <id> --format json|xml|md|ics|pdf|txt   -> Esporta singolo memo nel formato indicato");
      log("   export --all --format json|xml|md|ics|txt           -> Esporta l'intero archivio nel formato indicato");
      log("   export --year YYYY --format ics                     -> Esporta il calendario per Google™ Calendar / Outlook");
      log("   pdf --id <id>                                       -> Scorciatoia per generare e scaricare subito il PDF A4");
      log("");
      log("4. IMPORTAZIONE DATI (import):");
      log("   import --json '[{\"title\":\"...\", \"expirationDate\":\"2026-09-01\"}]' -> Importa JSON da testo");
      log("   import --xml '<notula><memos>...</memos></notula>'  -> Importa XML da testo");
      log("   import                                             -> Apre il selettore file grafico per importare .json o .xml");
      log("");
      log("5. ELENCO & FILTRO MEMO (ls):");
      log("   ls                                                  -> Mostra tutti i memo");
      log("   ls --year YYYY                                      -> Filtra per Anno (puntuali)");
      log("   ls --year YYYY --month MM                           -> Filtra per Anno e Mese (puntuali)");
      log("   ls --month MM --recurring                           -> Filtra per Mese (ricorrenti)");
      log("   ls --group <groupID>                                -> Mostra tutti i memo della medesima serie");
      log("   ls --expired                                        -> Mostra solo memo scaduti");
      log("");
      log("6. RICERCA & DIAGNOSTICA:");
      log("   find --title \"<testo>\"                              -> Cerca per titolo o descrizione");
      log("   find --date YYYY-MM-DD                              -> Cerca per data esatta");
      log("   find --id <id>                                      -> Cerca per ID univoco");
      log("   info <id>                                           -> Scheda diagnostica completa con groupID e dettagli AES-256");
      log("");
      log("7. ELIMINAZIONE MEMO (rm):");
      log("   rm --id <id>                                        -> Rimuovi singolo memo per ID");
      log("   rm --group <groupID>                                -> Rimuovi l'intera serie ricorrente collegata");
      log("   rm --title \"<titolo>\"                                -> Rimuovi per titolo");
      log("   rm --year YYYY [--month MM] [--day DD]              -> Rimuovi memo puntuali");
      log("   rm --month MM [--day DD] --recurring                -> Rimuovi memo ricorrenti");
      log("   rm --expired                                        -> Rimuovi tutti i memo scaduti");
      log("   rm --all                                            -> Rimuovi TUTTI i memo");
      log("");
      log("8. SICUREZZA, PASSPHRASE & PRIVACY:");
      log("   passwd <nuova_passphrase>                           -> Imposta o cambia la Master Passphrase AES-256");
      log("   passwd clear                                        -> Rimuove la Master Passphrase (opera in chiaro)");
      log("   privacy on|off                                      -> Attiva/disattiva offuscamento a video");
      log("");
      log("9. GOOGLE™ DRIVE, TEMA & UTILITÀ:");
      log("   sync                                                -> Avvia sincronizzazione da Google™ Drive");
      log("   cloud-test                                          -> Esegue test diagnostico cartella Google™ Drive /Notula/");
      log("   theme dark|light|system                             -> Cambia tema visivo");
      log("   clear                                               -> Pulisce la schermata del terminale");
      log("   exit                                                -> Chiude il terminale CLI");
      log("─────────────────────────────────────────────────────────────────────────");
      return;
    }

    try {
      switch (action) {
        // ==========================================
        // 1. ADD / CREATE
        // ==========================================
        case 'add':
        case 'create': {
          const title = getFlag(args, '--title');
          const date = getFlag(args, '--date');
          const desc = getFlag(args, '--desc') || '';
          const repeatRaw = getFlag(args, '--repeat');
          const obfuscate = (getFlag(args, '--obfuscate') as ObfuscationLevel) || 'none';
          const isEncrypted = args.includes('--encrypt');
          const groupId = getFlag(args, '--group');

          if (!title || !date) {
            throw new Error("Parametri obbligatori mancanti: usa --title \"...\" e --date YYYY-MM-DD");
          }

          // Se repeatRaw è un numero (es. "10"), creiamo una serie di N giorni
          const repeatNumber = repeatRaw ? parseInt(repeatRaw, 10) : NaN;

          if (!isNaN(repeatNumber) && repeatNumber > 1) {
            const series = core.createRecurringSeries({
              title,
              description: desc,
              startDate: date,
              count: repeatNumber,
              stepDays: 1,
              repeatType: 'daily',
              obfuscation: obfuscate,
              isEncrypted,
            });

            onMemosChanged();
            log(`✅ Serie ricorrente di ${series.length} memo creata con successo! GroupID: [${series[0].groupId}]`);
            log(`   Titolo: "${title}" | Data inizio: ${date} | Ripetizione per ${repeatNumber} giorni consecutivi`);
            break;
          }

          const repeatType: RepeatType = (
            repeatRaw === 'daily' || repeatRaw === 'weekly' || repeatRaw === 'monthly' || repeatRaw === 'yearly'
              ? repeatRaw
              : 'none'
          );

          const created = core.createMemo({
            title,
            description: desc,
            expirationDate: date,
            repeatType: repeatType,
            obfuscation: obfuscate,
            isEncrypted,
            groupId: groupId || undefined,
          });

          onMemosChanged();
          log(`✅ Memo creato con successo! ID: [${created.id}]`);
          log(`   Titolo: "${created.title}" | Data: ${created.expirationDate} | Ricorrenza: ${created.repeatType}${created.groupId ? ` | GroupID: ${created.groupId}` : ''}`);
          break;
        }

        // ==========================================
        // 2. EDIT (con aggiornamento automatico groupID)
        // ==========================================
        case 'edit':
        case 'update':
        case 'upgrade': {
          const id = getFlag(args, '--id') || args[1];
          if (!id || id.startsWith('--')) {
            throw new Error("Specifica l'ID del memo da modificare: edit --id <id> [--title \"...\"] [--date YYYY-MM-DD] [--desc \"...\"]");
          }

          const targetMemo = core.getMemoInfo(id);
          if (!targetMemo) {
            throw new Error(`Memo con ID '${id}' non trovato nell'archivio.`);
          }

          const title = getFlag(args, '--title');
          const date = getFlag(args, '--date');
          const desc = getFlag(args, '--desc');
          const repeat = getFlag(args, '--repeat') as RepeatType | undefined;
          const obfuscate = getFlag(args, '--obfuscate') as ObfuscationLevel | undefined;
          
          let isEncrypted: boolean | undefined = undefined;
          if (args.includes('--encrypt')) isEncrypted = true;
          if (args.includes('--no-encrypt')) isEncrypted = false;

          const updated = core.updateMemo({
            id: targetMemo.id,
            title: title || undefined,
            date: date || undefined,
            description: desc || undefined,
            repeatType: repeat || undefined,
            obfuscation: obfuscate || undefined,
            isEncrypted: isEncrypted,
            updateEntireGroup: true, // Aggiornamento automatico e trasparente di tutta la serie
          });

          if (!updated) {
            throw new Error(`Impossibile aggiornare il memo [${id}].`);
          }

          onMemosChanged();
          log(`✅ Memo [${updated.id}] modificato con successo!`);
          if (updated.groupId) {
            log(`   🔄 Aggiornamento propagato automaticamente a tutti i memo della serie (GroupID: ${updated.groupId})`);
          }
          log(`   Titolo: "${updated.title}" | Data: ${updated.expirationDate} | Ricorrenza: ${updated.repeatType}`);
          break;
        }

        // ==========================================
        // 3. EXPORT (JSON, XML, MD, ICS, PDF, TXT)
        // ==========================================
        case 'export': {
          const id = getFlag(args, '--id');
          const format = ((getFlag(args, '--format') || 'json').toLowerCase()) as any;
          const isAll = args.includes('--all');
          const year = getFlag(args, '--year');

          if (id) {
            const memo = core.getMemoInfo(id);
            if (!memo) throw new Error(`Memo con ID '${id}' non trovato.`);
            await exportSingleMemo(memo, format, masterPassword);
            log(`📥 Esportazione memo [${id}] in formato .${format.toUpperCase()} completata con successo!`);
          } else if (isAll || (!id && !year)) {
            const all = core.listAll();
            if (all.length === 0) throw new Error("Nessun memo presente nell'archivio da esportare.");
            await exportAllMemos(all, format, true, masterPassword);
            log(`📥 Esportazione archivio completo (${all.length} memo) in formato .${format.toUpperCase()} completata!`);
          } else if (year) {
            const filtered = core.listByYearNonEternal(year);
            if (filtered.length === 0) throw new Error(`Nessun memo trovato per l'anno ${year}.`);
            await exportAllMemos(filtered, format, true, masterPassword);
            log(`📥 Esportazione memo anno ${year} (${filtered.length} memo) in formato .${format.toUpperCase()} completata!`);
          }
          break;
        }

        // ==========================================
        // 4. PDF (Comando Rapido)
        // ==========================================
        case 'pdf': {
          const id = getFlag(args, '--id') || args[1];
          if (!id || id.startsWith('--')) {
            throw new Error("Specifica l'ID del memo per generare il PDF. Esempio: pdf --id n_12345");
          }
          const memo = core.getMemoInfo(id);
          if (!memo) throw new Error(`Memo con ID '${id}' non trovato.`);
          
          await exportSingleMemo(memo, 'pdf');
          log(`📄 Generazione documento PDF Ink-Friendly A4 per il memo [${id}] completata!`);
          break;
        }

        // ==========================================
        // 5. IMPORT (JSON/XML)
        // ==========================================
        case 'import': {
          const jsonStr = getFlag(args, '--json');
          const xmlStr = getFlag(args, '--xml');

          if (jsonStr) {
            const items = parseJSONMemos(jsonStr);
            if (items.length === 0) throw new Error("Nessun elemento valido trovato nella stringa JSON fornita.");
            
            const currentMemos = core.getMemos();
            core.setMemos([...items, ...currentMemos]);
            onMemosChanged();
            log(`✅ Importati con successo ${items.length} memo dalla stringa JSON!`);
          } else if (xmlStr) {
            const items = parseXMLMemos(xmlStr);
            if (items.length === 0) throw new Error("Nessun elemento valido trovato nella stringa XML fornita.");
            
            const currentMemos = core.getMemos();
            core.setMemos([...items, ...currentMemos]);
            onMemosChanged();
            log(`✅ Importati con successo ${items.length} memo dalla stringa XML!`);
          } else {
            onTriggerImport();
            log("📂 Apertura selettore file grafico per importare documenti JSON o XML...");
          }
          break;
        }

        // ==========================================
        // 6. RM / DELETE
        // ==========================================
        case 'rm':
        case 'remove':
        case 'delete': {
          const id = getFlag(args, '--id');
          const group = getFlag(args, '--group');
          const title = getFlag(args, '--title');
          const year = getFlag(args, '--year');
          const month = getFlag(args, '--month');
          const day = getFlag(args, '--day');
          const isRecurring = args.includes('--recurring');
          const isExpired = args.includes('--expired');
          const isAll = args.includes('--all');

          let deleted = 0;

          if (isAll) {
            deleted = core.removeAll();
          } else if (group) {
            deleted = core.removeByGroupId(group);
          } else if (isExpired) {
            deleted = core.removeExpiredNonEternal();
          } else if (id) {
            deleted = core.removeByIds([id]);
          } else if (title) {
            deleted = core.removeByTitle(title);
          } else if (isRecurring) {
            if (month && day) deleted = core.removeByMonthAndDayEternal(month, day);
            else if (month) deleted = core.removeByMonthEternal(month);
            else throw new Error("Specifica --month MM per rimuovere i ricorrenti.");
          } else if (year) {
            if (month && day) deleted = core.removeByYearMonthDayNonEternal(year, month, day);
            else if (month) deleted = core.removeByYearAndMonthNonEternal(year, month);
            else deleted = core.removeByYearNonEternal(year);
          } else if (args[1] && !args[1].startsWith('--')) {
            deleted = core.removeByIds([args[1]]);
          } else {
            throw new Error("Sintassi non valida per rm. Usa 'help' per la lista dei parametri.");
          }

          onMemosChanged();
          log(`🗑️ Eliminazione completata. Memo rimossi: ${deleted}`);
          break;
        }

        // ==========================================
        // 7. LS / LIST
        // ==========================================
        case 'ls':
        case 'list': {
          const year = getFlag(args, '--year');
          const month = getFlag(args, '--month');
          const day = getFlag(args, '--day');
          const group = getFlag(args, '--group');
          const isRecurring = args.includes('--recurring');
          const isExpired = args.includes('--expired');

          let results: MemoItem[] = [];

          if (group) {
            results = core.getGroupMemos(group);
          } else if (isExpired) {
            results = core.listExpiredNonEternal();
          } else if (isRecurring) {
            if (month && day) results = core.listByMonthAndDayEternal(month, day);
            else if (month) results = core.listByMonthEternal(month);
            else results = core.getMemos().filter(m => m.repeatType !== 'none');
          } else if (year) {
            if (month && day) results = core.listByExactDateNonEternal(year, month, day);
            else if (month) results = core.listByYearAndMonthNonEternal(year, month);
            else results = core.listByYearNonEternal(year);
          } else {
            results = core.listAll();
          }

          log(`📋 Trovati ${results.length} memo:`);
          if (results.length === 0) {
            log("   (Nessun memo corrispondente ai criteri indicati)");
          } else {
            results.forEach((m) => {
              const enc = m.isEncrypted ? '🔒[AES-256]' : ' ';
              const rep = m.repeatType !== 'none' ? `[Ricorr: ${m.repeatType}]` : '[Puntuale]';
              const grp = m.groupId ? ` [Grp: ${m.groupId}]` : '';
              log(`   • [${m.id}] ${m.expirationDate} ${rep}${grp} ${enc} "${m.title}"`);
            });
          }
          break;
        }

        // ==========================================
        // 8. FIND / SEARCH
        // ==========================================
        case 'find':
        case 'search': {
          const title = getFlag(args, '--title');
          const date = getFlag(args, '--date');
          const id = getFlag(args, '--id');

          let results: MemoItem[] = [];
          if (id) {
            const item = core.getMemoInfo(id);
            if (item) results = [item];
          } else if (date) {
            results = core.findByDate(date);
          } else if (title) {
            results = core.findByText(title);
          } else if (args[1] && !args[1].startsWith('--')) {
            results = core.findByText(args.slice(1).join(' '));
          } else {
            throw new Error("Specifica --title, --date o --id per la ricerca.");
          }

          log(`🔍 Risultati ricerca (${results.length} trovati):`);
          results.forEach((m) => {
            log(`   • [${m.id}] ${m.expirationDate} "${m.title}" (Ricorrenza: ${m.repeatType})`);
          });
          break;
        }

        // ==========================================
        // 9. INFO
        // ==========================================
        case 'info': {
          const id = args[1] || getFlag(args, '--id');
          if (!id) throw new Error("Specifica l'ID del memo. Esempio: info n_123");
          const m = core.getMemoInfo(id);
          if (!m) throw new Error(`Memo con ID '${id}' non trovato.`);

          log(`ℹ️ DETTAGLI MEMO [${m.id}]:`);
          log(`   Titolo: ${m.title}`);
          log(`   Data Scadenza: ${m.expirationDate}`);
          if (m.groupId) log(`   GroupID (Serie): ${m.groupId}`);
          log(`   Tipologia Ricorrenza: ${m.repeatType}`);
          log(`   Livello Offuscamento: ${m.obfuscation}`);
          log(`   Crittografia AES-256: ${m.isEncrypted ? 'Attiva (E2E PBKDF2)' : 'In chiaro'}`);
          log(`   Data Creazione: ${new Date(m.createdAt).toLocaleString('it-IT')}`);
          log(`   Descrizione: ${m.description || '(nessuna nota)'}`);
          break;
        }

        // ==========================================
        // 10. PASSWD / PASSWORD
        // ==========================================
        case 'passwd':
        case 'password': {
          const pwd = args[1];
          if (!pwd) {
            log(`Stato attuale Master Passphrase: ${masterPassword ? '🔒 Impostata e attiva' : '🔓 Non impostata (In chiaro)'}`);
            log("Per impostarla/cambiarla: passwd <nuova_password>");
            log("Per rimuoverla: passwd clear");
          } else if (pwd.toLowerCase() === 'clear' || pwd.toLowerCase() === 'remove') {
            onSetMasterPassword(null);
            log("🔓 Master Passphrase rimossa. I dati saranno gestiti in chiaro.");
          } else {
            onSetMasterPassword(pwd);
            log(`🔒 Master Passphrase aggiornata con successo! La nuova chiave protegge la sessione e i backup.`);
          }
          break;
        }

        // ==========================================
        // 11. PRIVACY
        // ==========================================
        case 'privacy': {
          const state = args[1]?.toLowerCase();
          if (state === 'on' || state === 'true' || state === '1') {
            onTogglePrivacy(true);
            log("🕶️ Modalità Privacy attivata (testi offuscati a schermo).");
          } else if (state === 'off' || state === 'false' || state === '0') {
            onTogglePrivacy(false);
            log("👁️ Modalità Privacy disattivata (testi visibili a schermo).");
          } else {
            onTogglePrivacy();
            log(`Modalità Privacy invertita. Stato: ${!privacyMode ? 'ATTIVA' : 'DISATTIVATA'}`);
          }
          break;
        }

        // ==========================================
        // 12. DRIVE & SYNC (Google™ Drive)
        // ==========================================
        case 'sync':
        case 'drive': {
          log("☁️ Avvio sincronizzazione da Google™ Drive...");
          onDownloadDrive();
          log("Richiesta di download inoltrata al modulo Google™ Drive.");
          break;
        }

        case 'cloud-test':
        case 'test-drive': {
          log("☁️ Esecuzione test diagnostico su Google™ Drive /Notula/ in corso...");
          try {
            const diag = await testDriveDiagnostics();
            if (diag.ok) {
              log(`✅ ${diag.message}`);
              log(`   Cartella: ${diag.folderName} (ID: ${diag.folderId}) | File trovati: ${diag.filesCount}`);
            } else {
              log(`❌ ${diag.message}`);
            }
          } catch (err: any) {
            log(`❌ Errore test Google™ Drive: ${err.message || err}`);
          }
          break;
        }

        // ==========================================
        // 13. THEME
        // ==========================================
        case 'theme': {
          const val = args[1]?.toLowerCase();
          if (val === 'dark' || val === 'light' || val === 'system') {
            onChangeTheme(val);
            log(`🎨 Tema impostato su: '${val}'`);
          } else {
            log("Specifica il tema desiderato: theme dark | theme light | theme system");
          }
          break;
        }

        default: {
          log(`Comando non riconosciuto: '${action}'. Digita 'help' per l'elenco dei comandi.`);
        }
      }
    } catch (err: any) {
      log(`❌ Errore: ${err.message || err}`);
    }
  };

  return (
    <div className={`fixed z-50 transition-all duration-200 ${
      windowState === 'fullscreen' 
        ? 'inset-0 p-0' 
        : 'bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[740px] h-[540px] p-2 sm:p-0'
    }`}>
      <div className={`w-full h-full bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] shadow-2xl flex flex-col font-mono text-xs overflow-hidden ${
        windowState === 'fullscreen' ? 'rounded-none' : 'rounded-2xl'
      }`}>
        
        {/* Terminal Header */}
        <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <div className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-wide">
              Notula™ CLI &bull; Ing. Mario Fantini
            </span>
            <span className="text-[10px] text-gray-400 hidden sm:inline">
              (Ctrl+Shift+P per toggle)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsManualOpen(true)}
              className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 transition flex items-center gap-1 cursor-pointer"
              title="Apri Manuale Ufficiale CLI (LaTeX / Reference)"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Manuale CLI</span>
            </button>

            <button
              type="button"
              onClick={() => setWindowState(windowState === 'fullscreen' ? 'docked' : 'fullscreen')}
              className="p-1 rounded hover:bg-[#30363d] text-gray-400 hover:text-white transition cursor-pointer"
              title={windowState === 'fullscreen' ? "Ripristina finestra" : "Schermo intero"}
            >
              {windowState === 'fullscreen' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition cursor-pointer"
              title="Chiudi terminale (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div
          ref={outputContainerRef}
          className="flex-1 p-4 overflow-y-auto space-y-1 select-text bg-[#0d1117] text-gray-200"
        >
          {outputLines.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {line.startsWith('notula>') ? (
                <span className="text-emerald-400 font-bold">{line}</span>
              ) : line.startsWith('✅') ? (
                <span className="text-emerald-300">{line}</span>
              ) : line.startsWith('❌') ? (
                <span className="text-red-400">{line}</span>
              ) : line.startsWith('📋') || line.startsWith('🔍') || line.startsWith('ℹ️') ? (
                <span className="text-cyan-400 font-bold">{line}</span>
              ) : line.startsWith('═') || line.startsWith('─') ? (
                <span className="text-gray-500">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </div>

        {/* Terminal Input Form */}
        <form onSubmit={handleCommand} className="bg-[#161b22] border-t border-[#30363d] p-2.5 flex items-center gap-2">
          <span className="text-emerald-400 font-bold pl-2 text-xs select-none">notula&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digita comando (es. 'help', 'man', 'edit --id ...', 'export --all --format xml', 'pdf --id ...')..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-gray-600 focus:ring-0"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 hover:text-white text-[11px] transition flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>Invio</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>

      </div>

      {/* Official CLI Manual Viewer */}
      <CliManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />
    </div>
  );
};

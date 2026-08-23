/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { MemoItem, ConflictResolutionOption, REPEAT_LABELS_IT, REPEAT_LABELS_EN } from '../types';
import { AlertTriangle, Check, RefreshCw, X, Copy, Shield, Lock, Calendar, FileText } from 'lucide-react';

interface ConflictModalProps {
  incomingMemo: MemoItem;
  existingMemo: MemoItem;
  remainingConflicts: number;
  onResolve: (option: ConflictResolutionOption) => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  incomingMemo,
  existingMemo,
  remainingConflicts,
  onResolve,
}) => {
  const { settings } = useSettings();
  // Keyboard shortcut listener for fast resolution (Y/A/I/M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'y') {
        e.preventDefault();
        onResolve('yes');
      } else if (key === 'a') {
        e.preventDefault();
        onResolve('all');
      } else if (key === 'i' || key === 'escape') {
        e.preventDefault();
        onResolve('ignore');
      } else if (key === 'm') {
        e.preventDefault();
        onResolve('merge');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResolve]);

  const isTitleDiff = incomingMemo.title !== existingMemo.title;
  const isDateDiff = incomingMemo.expirationDate !== existingMemo.expirationDate;
  const isDescDiff = (incomingMemo.description || '') !== (existingMemo.description || '');
  const isRepeatDiff = incomingMemo.repeatType !== existingMemo.repeatType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--bg-card)] border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 sm:px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[var(--text-main)] flex items-center gap-2">
                <span>{settings.language === "en" ? "Synchronization Conflict Resolution" : "Risoluzione Conflitto di Sincronizzazione"}</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Conflicting Memo ID:" : "ID Memo in conflitto:"}<code className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-bold text-[var(--text-main)]">{incomingMemo.id}</code>
              </p>
            </div>
          </div>

          {remainingConflicts > 1 && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
              +{remainingConflicts - 1} altri conflitti
            </span>
          )}
        </div>

        {/* Content Comparison Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-[var(--text-muted)] leading-relaxed">
            È stata rilevata una discrepanza tra la versione attualmente presente nel database locale e quella in arrivo. Seleziona come procedere:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Version 1: Local / Existing */}
            <div className="flex flex-col rounded-xl border border-blue-500/40 bg-blue-500/5 overflow-hidden">
              <div className="px-4 py-2.5 bg-blue-500/10 border-b border-blue-500/20 flex items-center justify-between">
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Versione Locale (Attuale)
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {existingMemo.updatedAt ? new Date(existingMemo.updatedAt).toLocaleTimeString('it-IT') : 'Locale'}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                    Titolo:
                  </div>
                  <div className={`font-bold text-sm text-[var(--text-main)] ${isTitleDiff ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {existingMemo.title}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]/60 text-[11px]">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">{settings.language === "en" ? "Expiration Date:" : "Data Scadenza:"}</span>
                    <span className={`font-mono font-bold ${isDateDiff ? 'text-amber-500' : 'text-[var(--text-main)]'}`}>
                      {existingMemo.expirationDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">{settings.language === "en" ? "Recurrence:" : "Ricorrenza:"}</span>
                    <span className="font-semibold text-[var(--text-main)]">
                      {existingMemo.repeatType === 'none' ? 'Puntuale' : settings.language === 'en' ? REPEAT_LABELS_EN[existingMemo.repeatType] : REPEAT_LABELS_IT[existingMemo.repeatType] || existingMemo.repeatType}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)]/60">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                    <span>{settings.language === "en" ? "Description:" : "Descrizione:"}</span>
                    <div className="flex items-center gap-1">
                      {existingMemo.isEncrypted && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-[9px] font-bold">
                          AES-256
                        </span>
                      )}
                      {existingMemo.obfuscation !== 'none' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[9px]">
                          {existingMemo.obfuscation}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] whitespace-pre-wrap max-h-28 overflow-y-auto font-sans">
                    {existingMemo.description || <span className="italic text-[var(--text-muted)]">{settings.language === 'en' ? 'No description' : 'Nessuna descrizione'}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Version 2: Incoming / Drive / Import */}
            <div className="flex flex-col rounded-xl border border-amber-500/50 bg-amber-500/5 overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Versione in Arrivo (Google™ Drive / File)
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {incomingMemo.updatedAt ? new Date(incomingMemo.updatedAt).toLocaleTimeString('it-IT') : 'In arrivo'}
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                    Titolo:
                  </div>
                  <div className={`font-bold text-sm text-[var(--text-main)] ${isTitleDiff ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''}`}>
                    {incomingMemo.title}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]/60 text-[11px]">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">{settings.language === "en" ? "Expiration Date:" : "Data Scadenza:"}</span>
                    <span className={`font-mono font-bold ${isDateDiff ? 'text-amber-500 underline' : 'text-[var(--text-main)]'}`}>
                      {incomingMemo.expirationDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">{settings.language === "en" ? "Recurrence:" : "Ricorrenza:"}</span>
                    <span className="font-semibold text-[var(--text-main)]">
                      {incomingMemo.repeatType === 'none' ? 'Puntuale' : settings.language === 'en' ? REPEAT_LABELS_EN[incomingMemo.repeatType] : REPEAT_LABELS_IT[incomingMemo.repeatType] || incomingMemo.repeatType}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)]/60">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                    <span>{settings.language === "en" ? "Description:" : "Descrizione:"}</span>
                    <div className="flex items-center gap-1">
                      {incomingMemo.isEncrypted && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-mono text-[9px] font-bold">
                          AES-256
                        </span>
                      )}
                      {incomingMemo.obfuscation !== 'none' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[9px]">
                          {incomingMemo.obfuscation}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-[var(--bg-card)] border ${isDescDiff ? 'border-amber-500/40 bg-amber-500/5' : 'border-[var(--border-color)]'} text-xs text-[var(--text-main)] whitespace-pre-wrap max-h-28 overflow-y-auto font-sans`}>
                    {incomingMemo.description || <span className="italic text-[var(--text-muted)]">{settings.language === 'en' ? 'No description' : 'Nessuna descrizione'}</span>}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] p-4 sm:p-5 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            
            {/* 1. Sostituisci (Y) */}
            <button
              type="button"
              onClick={() => onResolve('yes')}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md transition"
              title={settings.language === "en" ? "Overwrite local version with this incoming version [Key Y]" : "Sovrascrive la versione locale con questa versione in arrivo [Tasto Y]"}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "(Y) Replace" : "(Y) Sostituisci"}</span>
            </button>

            {/* 2. Sostituisci Tutti (A) */}
            <button
              type="button"
              onClick={() => onResolve('all')}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-md transition"
              title={settings.language === "en" ? "Accept all incoming changes for all conflicts [Key A]" : "Accetta tutte le modifiche in arrivo per tutti i conflitti [Tasto A]"}
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "(A) Replace All" : "(A) Sostituisci Tutti"}</span>
            </button>

            {/* 3. Ignora / Mantieni Locale (I) */}
            <button
              type="button"
              onClick={() => onResolve('ignore')}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-color)] active:scale-95 transition"
              title={settings.language === "en" ? "Keep local version and ignore this incoming one [Key I / Esc]" : "Conserva la versione locale e ignora questa in arrivo [Tasto I / Esc]"}
            >
              <X className="w-4 h-4 text-red-500 shrink-0" />
              <span>{settings.language === "en" ? "(I) Ignore" : "(I) Ignora"}</span>
            </button>

            {/* 4. Tieni Entrambi (M) */}
            <button
              type="button"
              onClick={() => onResolve('merge')}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md transition"
              title={settings.language === "en" ? "Keep local version and import the new one as a copy with new ID [Key M]" : "Conserva la versione locale e importa la nuova come copia con nuovo ID [Tasto M]"}
            >
              <Copy className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "(M) Keep Both" : "(M) Tieni Entrambi"}</span>
            </button>

          </div>

          <div className="mt-3 text-[11px] text-center text-[var(--text-muted)] font-mono">
            Scorciatoie da tastiera: <strong className="text-blue-500">Y</strong> (Sostituisci) &bull; <strong className="text-amber-500">A</strong> (Tutti) &bull; <strong className="text-red-500">I</strong> (Ignora) &bull; <strong className="text-emerald-500">M</strong> (Copia)
          </div>
        </div>

      </div>
    </div>
  );
};

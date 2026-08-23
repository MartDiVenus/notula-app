/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { MemoItem } from '../types';
import { exportSingleMemo, exportAllMemos } from '../utils/exportImport';
import { Download, FileText, Code2, Calendar, FileCode, X, Check, Sparkles, Layers, Shield } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  memos: MemoItem[];
  singleMemo?: MemoItem | null;
  masterPassword?: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  memos,
  singleMemo,
  masterPassword = null,
}) => {
  const { settings } = useSettings();
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'xml' | 'md' | 'ics' | 'pdf' | 'txt'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetMemos = singleMemo ? [singleMemo] : memos;
  const isSingle = !!singleMemo;

  const formats = [
    {
      id: 'json' as const,
      label: 'JSON (.json)',
      badge: (settings.language === "en" ? 'Complete Backup' : 'Backup Completo'),
      desc: (settings.language === "en" ? 'Complete native data format. Ideal for backup, restore or AES-256 encrypted migration.' : 'Formato dati nativo completo. Ideale per backup, ripristino o migrazione crittografata AES-256.'),
      icon: <Code2 className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10',
    },
    {
      id: 'xml' as const,
      label: 'XML (.xml)',
      badge: 'Standard Notula™',
      desc: (settings.language === "en" ? 'Hierarchical tree structure with <notula> and <memo> tags, compatible with legacy databases and archives.' : 'Struttura ad albero gerarchica con tag <notula> e <memo>, compatibile con database e archivi legacy.'),
      icon: <FileCode className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10',
    },
    {
      id: 'md' as const,
      label: 'Markdown (.md)',
      badge: 'Editor & Note',
      desc: (settings.language === "en" ? 'Formatted text with headers and metadata for Obsidian, Notion, GitHub or Markdown editors.' : 'Testo formattato con intestazioni e metadati per Obsidian, Notion, GitHub o editor Markdown.'),
      icon: <FileText className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10',
    },
    {
      id: 'ics' as const,
      label: 'iCalendar (.ics)',
      badge: 'Google™ Calendar & Outlook',
      desc: (settings.language === "en" ? 'Events and deadlines compliant with the RFC 5545 standard, importable into Google™ Calendar, Apple and Outlook.' : 'Eventi e scadenze conformi allo standard RFC 5545, importabili in Google™ Calendar, Apple e Outlook.'),
      icon: <Calendar className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10',
    },
    ...(isSingle ? [{
      id: 'pdf' as const,
      label: 'Documento PDF (.pdf)',
      badge: 'Ink-Friendly A4',
      desc: 'Scheda ufficiale Notula™ impaginata per la stampa A4 a zero spreco di inchiostro.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10',
    }] : []),
    {
      id: 'txt' as const,
      label: 'Testo Piano (.txt)',
      badge: 'Universale',
      desc: 'Scheda testuale leggibile da qualsiasi dispositivo e blocco note senza software aggiuntivo.',
      icon: <FileText className="w-5 h-5 text-gray-400" />,
      color: 'border-gray-500/40 bg-gray-500/5 hover:bg-gray-500/10',
    },
  ];

  const handleExecuteExport = async () => {
    setIsExporting(true);
    setDoneMsg(null);
    try {
      if (isSingle && singleMemo) {
        await exportSingleMemo(singleMemo, selectedFormat, masterPassword);
      } else {
        await exportAllMemos(memos, selectedFormat as any, true, masterPassword);
      }
      setDoneMsg(`Esportazione in formato .${selectedFormat} completata con successo!`);
      setTimeout(() => {
        setDoneMsg(null);
        onClose();
      }, 1400);
    } catch (err: any) {
      alert("Errore esportazione: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[var(--text-main)]">
                {settings.language === "en" ? "Export Notula™ Data" : "Esporta Dati Notula™"}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {isSingle 
                  ? `Esportazione memo ID: [${singleMemo?.id}]` 
                  : `Esportazione archivio (${memos.length} memo)`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {doneMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{doneMsg}</span>
            </div>
          )}

          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Seleziona il formato di esportazione:
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {formats.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/15 shadow-sm ring-1 ring-blue-500' 
                      : `${fmt.color} border-[var(--border-color)]`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-[var(--bg-card)] shrink-0 mt-0.5">
                      {fmt.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[var(--text-main)]">{fmt.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[var(--text-muted)]">
                          {fmt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                        {fmt.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                    isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-400'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Encryption Note */}
          {masterPassword && (selectedFormat === 'json' || selectedFormat === 'xml') && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Master Password attiva: il file verrà cifrato con AES-256-GCM.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-6 py-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
          >{settings.language === "en" ? "Cancel" : "Annulla"}</button>
          <button
            type="button"
            onClick={handleExecuteExport}
            disabled={isExporting}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Esportazione in corso...' : `Scarica .${selectedFormat.toUpperCase()}`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

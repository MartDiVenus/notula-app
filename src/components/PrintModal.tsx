/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState } from 'react';
import { MemoItem, REPEAT_LABELS_IT } from '../types';
import { memoToPlainText, generateMemoPDF } from '../utils/exportImport';
import { FileText, Download, X, Copy, Check, Sparkles, Shield, Repeat, Layers } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  memo: MemoItem | null;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  memo,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen || !memo) return null;

  const recurrenceLabel = memo.repeatType === 'none' 
    ? 'Puntuale (Singola Scadenza)' 
    : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`;

  const obfuscationLabel = memo.obfuscation === 'full' 
    ? 'Strato 2: Totale (Maschera Solida)' 
    : memo.obfuscation === 'partial' 
    ? 'Strato 1: Parziale' 
    : 'Nessuno (Visibile)';

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = generateMemoPDF(memo);
      const safeTitle = memo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
      const fileName = `Notula_${memo.id}_${safeTitle}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("Errore generazione PDF:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyText = () => {
    const text = memoToPlainText(memo);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modale */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[var(--text-main)]">
                Esportazione Documento PDF Ink-Friendly
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Scheda di dettaglio per memo ID: <code className="font-mono font-bold text-blue-500">{memo.id}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anteprima Documento */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-6 rounded-2xl border-2 border-blue-600/60 bg-[var(--bg-card)] shadow-xs space-y-4">
            
            {/* Intestazione Documento Ink-Friendly */}
            <div className="border-b border-blue-500/30 pb-3 flex justify-between items-start gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NOTULA MEMORANDUM &bull; SCHEDA UFFICIALE</span>
                </div>
                <h3 className="font-extrabold text-lg text-[var(--text-main)] mt-0.5">
                  {memo.title}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Ideazione &amp; Sviluppo Ing. Mario Fantini &bull; <span className="font-mono">https://mariofantini.eu</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  {memo.id}
                </span>
                {memo.groupId && (
                  <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                    Grp: {memo.groupId}
                  </div>
                )}
              </div>
            </div>

            {/* Griglia Metadati */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Data Scadenza</span>
                <span className="font-mono font-bold text-[var(--text-main)] text-sm">{memo.expirationDate}</span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Tipologia</span>
                <span className="font-medium text-[var(--text-main)]">{recurrenceLabel}</span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Offuscamento</span>
                <span className="font-medium text-[var(--text-main)]">{obfuscationLabel}</span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Crittografia Hardware</span>
                <span className="font-mono font-medium text-purple-600 dark:text-purple-400">
                  {memo.isEncrypted ? 'AES-256-GCM Attiva' : 'In chiaro'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Data Creazione</span>
                <span className="text-[var(--text-muted)]">{new Date(memo.createdAt).toLocaleDateString('it-IT')}</span>
              </div>

              {memo.groupId && (
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Gruppo Correlato</span>
                  <span className="font-mono text-blue-500 text-[11px] truncate block">{memo.groupId}</span>
                </div>
              )}
            </div>

            {/* Note & Descrizione */}
            <div>
              <span className="text-xs font-bold text-[var(--text-main)] block mb-1.5 uppercase tracking-wide">
                Descrizione &amp; Contenuto:
              </span>
              <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)] whitespace-pre-wrap leading-relaxed min-h-[70px]">
                {memo.description || '(Nessuna nota descrittiva inserita)'}
              </div>
            </div>

            {/* Footer Anteprima (Senza sovrapposizione) */}
            <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] text-[var(--text-muted)]">
              <div>
                <span>Documento generato da Notula™ Memo Engine &bull; Ing. Mario Fantini</span>
                <div className="text-blue-500 font-mono">https://mariofantini.eu</div>
              </div>
              <div className="text-right sm:self-end">
                <span>Copyright &copy; 2026 Tutti i Diritti Riservati</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Azioni */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-blue-500" />}
            <span>{copied ? 'Copiato!' : 'Copia Testo Strutturato'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            >
              Chiudi
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generazione...' : 'Scarica PDF A4'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

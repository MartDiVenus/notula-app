/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MemoItem, REPEAT_LABELS_IT } from '../types';
import { NotulaCore, getLocalYYYYMMDD } from '../utils/notulaCore';
import { getObfuscatedDisplay } from '../utils/obfuscation';
import { ListFilter, Calendar, Download, FileText, Printer, Edit3, Trash2, X, ArrowRight, Repeat, Lock, Shield, Eye, EyeOff } from 'lucide-react';

interface ListSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  core: NotulaCore;
  privacyMode: boolean;
  onSelectDate: (dateStr: string) => void;
  onEditMemo: (memo: MemoItem) => void;
  onDeleteMemo: (id: string) => void;
  onExportMemo: (memo: MemoItem) => void;
  onPrintMemo: (memo: MemoItem) => void;
  onExportBatch: (memos: MemoItem[]) => void;
}

export const ListSubmenu: React.FC<ListSubmenuProps> = ({
  isOpen,
  onClose,
  core,
  privacyMode,
  onSelectDate,
  onEditMemo,
  onDeleteMemo,
  onExportMemo,
  onPrintMemo,
  onExportBatch,
}) => {
  const [listCategory, setListCategory] = useState<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'>('a');
  const [revealedMemoIds, setRevealedMemoIds] = useState<Set<string>>(new Set());

  const toggleRevealMemo = (id: string) => {
    setRevealedMemoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [yearVal, setYearVal] = useState<string>(String(new Date().getFullYear()));
  const [monthVal, setMonthVal] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [dayVal, setDayVal] = useState<string>(String(new Date().getDate()).padStart(2, '0'));

  const items = useMemo(() => {
    switch (listCategory) {
      case 'a':
        return core.listAll();
      case 'b':
        return core.listByYearNonEternal(yearVal);
      case 'c':
        return core.listByYearAndMonthNonEternal(yearVal, monthVal);
      case 'd':
        return core.listByMonthEternal(monthVal);
      case 'e':
        return core.listByYearMonthDayNonEternal(yearVal, monthVal, dayVal);
      case 'f':
        return core.listByMonthAndDayEternal(monthVal, dayVal);
      case 'g':
        return core.listExpiredNonEternal();
      default:
        return core.listAll();
    }
  }, [core, listCategory, yearVal, monthVal, dayVal, core.getMemos()]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--text-main)]">Elenco Memo (GEM a-g)</h2>
              <p className="text-xs text-[var(--text-muted)]">Visualizza e filtra i memo per categoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector for categories a-g */}
        <div className="p-6 pb-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 bg-[var(--bg-subtle)] p-1.5 rounded-xl border border-[var(--border-color)] text-xs">
            <button
              onClick={() => setListCategory('a')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'a'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              a. Tutti
            </button>

            <button
              onClick={() => setListCategory('b')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'b'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              b. Anno (Puntuali)
            </button>

            <button
              onClick={() => setListCategory('c')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'c'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              c. Anno &amp; Mese
            </button>

            <button
              onClick={() => setListCategory('d')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'd'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              d. Mese (Ricorrenti)
            </button>

            <button
              onClick={() => setListCategory('e')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'e'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              e. A/M/G (Puntuali)
            </button>

            <button
              onClick={() => setListCategory('f')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'f'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              f. M/G (Ricorrenti)
            </button>

            <button
              onClick={() => setListCategory('g')}
              className={`p-2 rounded-lg font-semibold transition text-center ${
                listCategory === 'g'
                  ? 'bg-[var(--bg-card)] text-red-600 dark:text-red-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              g. Scaduti
            </button>
          </div>

          {/* Conditional Filters depending on category */}
          {['b', 'c', 'd', 'e', 'f'].includes(listCategory) && (
            <div className="flex flex-wrap gap-3 items-center bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-color)] text-xs">
              <span className="font-semibold text-[var(--text-muted)]">Filtri Parametrici:</span>

              {['b', 'c', 'e'].includes(listCategory) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-muted)]">Anno:</span>
                  <input
                    type="number"
                    value={yearVal}
                    onChange={(e) => setYearVal(e.target.value)}
                    className="w-20 px-2 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg font-mono"
                  />
                </div>
              )}

              {['c', 'd', 'e', 'f'].includes(listCategory) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-muted)]">Mese:</span>
                  <select
                    value={monthVal}
                    onChange={(e) => setMonthVal(e.target.value)}
                    className="px-2 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const mStr = String(i + 1).padStart(2, '0');
                      return (
                        <option key={mStr} value={mStr}>
                          {mStr} - {new Date(2026, i, 1).toLocaleString('it-IT', { month: 'short' })}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {['e', 'f'].includes(listCategory) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-muted)]">Giorno:</span>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dayVal}
                    onChange={(e) => setDayVal(e.target.value.padStart(2, '0'))}
                    className="w-16 px-2 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg font-mono"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-[var(--text-muted)]">
              Risultati filtrati: <strong>{items.length}</strong> memo
            </span>

            {items.length > 0 && (
              <button
                onClick={() => onExportBatch(items)}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition border border-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Esporta questi {items.length} memo</span>
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)]">
              <p className="text-sm font-medium">Nessun memo presente per la categoria selezionata.</p>
            </div>
          ) : (
            items.map((memo) => {
              const isPunctual = memo.repeatType === 'none';
              const todayStr = getLocalYYYYMMDD();
              const isExpired = isPunctual && memo.expirationDate < todayStr;

              return (
                <div
                  key={memo.id}
                  className={`p-4 rounded-xl border transition-all bg-[var(--bg-card)] ${
                    isExpired
                      ? 'border-red-500/50 bg-red-500/5'
                      : 'border-[var(--border-color)] hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                          {memo.id}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isPunctual
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {!isPunctual && <Repeat className="w-3 h-3" />}
                          {isPunctual ? 'Puntuale' : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          📅 {memo.expirationDate}
                        </span>
                        {/* Layer 1 */}
                        {memo.obfuscation === 'partial' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>Strato 1: Parziale</span>
                          </span>
                        )}
                        {/* Layer 2 */}
                        {memo.obfuscation === 'full' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>Strato 2: Totale</span>
                          </span>
                        )}
                        {/* Layer 3 */}
                        {memo.isEncrypted && (
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Strato 3: AES-256</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-[var(--text-main)] mb-1">
                        {memo.title}
                      </h4>

                      {memo.description && (() => {
                        const isRevealed = revealedMemoIds.has(memo.id);
                        const obfInfo = getObfuscatedDisplay(
                          memo.description,
                          memo.obfuscation,
                          privacyMode,
                          isRevealed
                        );

                        if (obfInfo.isMasked) {
                          return (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/70 select-none shadow-xs mt-1">
                              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                                <span className="tracking-widest opacity-80 select-none">████████████</span>
                                <span className="text-[10px] font-sans font-medium text-slate-500 italic hidden sm:inline">
                                  ({obfInfo.levelLabel})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRevealMemo(memo.id);
                                }}
                                className="px-2 py-0.5 rounded bg-slate-300/80 dark:bg-slate-700 hover:bg-slate-400/50 text-slate-800 dark:text-slate-200 transition text-[10px] flex items-center gap-1 shadow-xs font-sans font-semibold shrink-0 cursor-pointer"
                                title="Svela"
                              >
                                <Eye className="w-3 h-3 text-blue-500" />
                                <span>Svela</span>
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div className="flex items-start justify-between gap-2 mt-1">
                            <div className="text-xs text-[var(--text-muted)] whitespace-pre-wrap">
                              {obfInfo.displayText}
                            </div>
                            {(memo.obfuscation !== 'none' || privacyMode) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRevealMemo(memo.id);
                                }}
                                className="p-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition shrink-0"
                                title="Offusca"
                              >
                                <EyeOff className="w-3 h-3 text-amber-500" />
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          onSelectDate(memo.expirationDate);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition flex items-center gap-1 text-xs"
                        title="Visualizza nel calendario"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onExportMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                        title="Esporta singolo memo"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onPrintMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title="Genera & Esporta Scheda PDF"
                      >
                        <FileText className="w-4 h-4 text-blue-500" />
                      </button>

                      <button
                        onClick={() => onEditMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title="Modifica"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteMemo(memo.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

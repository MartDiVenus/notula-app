/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useSettings } from '../contexts/SettingsContext';
import { MemoItem, RepeatType, ObfuscationLevel, REPEAT_LABELS_IT, REPEAT_LABELS_EN } from '../types';
import { getLocalYYYYMMDD } from '../utils/notulaCore';
import { getObfuscatedDisplay } from '../utils/obfuscation';
import { Search, Calendar, Tag, Hash, X, Filter, Download, FileText, Trash2, Edit3, Printer, ArrowRight, Repeat, Lock, Shield, Eye, EyeOff } from 'lucide-react';

interface SearchSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  memos: MemoItem[];
  privacyMode: boolean;
  onSelectDate: (dateStr: string) => void;
  onEditMemo: (memo: MemoItem) => void;
  onDeleteMemo: (id: string) => void;
  onExportMemo: (memo: MemoItem) => void;
  onPrintMemo: (memo: MemoItem) => void;
}

export const SearchSubmenu: React.FC<SearchSubmenuProps> = ({
  isOpen,
  onClose,
  memos,
  privacyMode,
  onSelectDate,
  onEditMemo,
  onDeleteMemo,
  onExportMemo,
  onPrintMemo,
}) => {
  const { settings } = useSettings();
  const [searchMode, setSearchMode] = useState<'text' | 'date' | 'id'>('text');
  const [textQuery, setTextQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [idQuery, setIdQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'punctual' | 'recurring' | 'expired'>('all');
  const [revealedMemoIds, setRevealedMemoIds] = useState<Set<string>>(new Set());
  const [exactMatch, setExactMatch] = useState<boolean>(false);

  const toggleRevealMemo = (id: string) => {
    setRevealedMemoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const todayStr = useMemo(() => getLocalYYYYMMDD(), []);

  const results = useMemo(() => {
    let list = [...memos];

    // Filter by mode
    if (searchMode === 'text' && textQuery.trim()) {
      if (exactMatch) {
        const q = textQuery.toLowerCase().trim();
        list = list.filter(m => m.title.toLowerCase() === q);
      } else {
        const fuse = new Fuse(list, {
          keys: ['title', 'description'],
          threshold: 0.4,
          ignoreLocation: true,
        });
        const fuseResults = fuse.search(textQuery.trim());
        list = fuseResults.map(result => result.item);
      }
    } else if (searchMode === 'date' && dateQuery.trim()) {
      const target = dateQuery.trim();
      list = list.filter(m => {
        if (m.repeatType === 'none') return m.expirationDate === target;
        const [, tm, td] = target.split('-');
        if (m.repeatType === 'yearly') return m.month === tm && m.day === td;
        if (m.repeatType === 'monthly') return m.day === td;
        if (m.repeatType === 'weekly') {
          const diff = (new Date(target).getTime() - new Date(m.expirationDate).getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff % 7 === 0;
        }
        if (m.repeatType === 'daily') return target >= m.expirationDate;
        return false;
      });
    } else if (searchMode === 'id' && idQuery.trim()) {
      const q = idQuery.toLowerCase().trim();
      list = list.filter(m => m.id.toLowerCase().includes(q));
    }

    // Secondary status filter
    if (filterType === 'punctual') {
      list = list.filter(m => m.repeatType === 'none');
    } else if (filterType === 'recurring') {
      list = list.filter(m => m.repeatType !== 'none');
    } else if (filterType === 'expired') {
      list = list.filter(m => m.repeatType === 'none' && m.expirationDate < todayStr);
    }

    return list;
  }, [memos, searchMode, textQuery, dateQuery, idQuery, filterType, todayStr, exactMatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--text-main)]">{settings.language === 'en' ? 'Search Memos (Notula Search)' : 'Cerca nei Memo (Notula Search)'}</h2>
              <p className="text-xs text-[var(--text-muted)]">{settings.language === "en" ? "Search memos by title, text, exact date, or ID" : "Cerca memo per titolo, testo, data esatta o ID"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Mode Tabs */}
        <div className="p-6 pb-2 space-y-4">
          <div className="grid grid-cols-3 gap-2 bg-[var(--bg-subtle)] p-1.5 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setSearchMode('text')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                searchMode === 'text'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{settings.language === "en" ? "1. By Title / Text" : "1. Per Titolo / Testo"}</span>
            </button>

            <button
              onClick={() => setSearchMode('date')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                searchMode === 'date'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{settings.language === "en" ? "2. By Date" : "2. Per Data"}</span>
            </button>

            <button
              onClick={() => setSearchMode('id')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                searchMode === 'id'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>{settings.language === "en" ? "3. By IDs" : "3. Per IDs"}</span>
            </button>
          </div>

          {/* Active Search Input Field */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              {searchMode === 'text' && (
                <input
                  type="text"
                  placeholder={settings.language === "en" ? "Type title or content keywords..." : "Digita parole chiave del titolo o contenuto..."}
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-sans"
                />
              )}

              {searchMode === 'date' && (
                <input
                  type="date"
                  value={dateQuery}
                  onChange={(e) => setDateQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                />
              )}

              {searchMode === 'id' && (
                <input
                  type="text"
                  placeholder={settings.language === "en" ? "E.g. n_1724000000-12" : "Es. n_1724000000-12"}
                  value={idQuery}
                  onChange={(e) => setIdQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                />
              )}

              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />

              {(textQuery || dateQuery || idQuery) && (
                <button
                  onClick={() => {
                    setTextQuery('');
                    setDateQuery('');
                    setIdQuery('');
                  }}
                  className="absolute right-3 top-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Category Filter */}
            <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)]">
              <Filter className="w-3.5 h-3.5 ml-2 text-[var(--text-muted)]" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-transparent text-xs text-[var(--text-main)] font-semibold py-1.5 px-2 focus:outline-none cursor-pointer"
              >
                <option value="all">Tutti ({memos.length})</option>
                <option value="punctual">{settings.language === "en" ? "Only One-time (Non-recurring)" : "Solo Puntuali (Non ricorrenti)"}</option>
                <option value="recurring">{settings.language === "en" ? "Only Recurring" : "Solo Ricorrenti"}</option>
                <option value="expired">{settings.language === "en" ? "Only Expired" : "Solo Scaduti"}</option>
              </select>
            </div>
          </div>

          {searchMode === 'text' && (
            <div className="flex items-center gap-2 mt-2 px-1">
              <input
                type="checkbox"
                id="exactMatch"
                checked={exactMatch}
                onChange={(e) => setExactMatch(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[var(--border-color)] text-blue-600 focus:ring-blue-500 bg-[var(--bg-card)] cursor-pointer"
              />
              <label htmlFor="exactMatch" className="text-xs text-[var(--text-muted)] cursor-pointer select-none">
                {settings.language === 'en' ? 'Exact title/text match (disable fuzzy search)' : 'Titolo esatto (disabilita ricerca fuzzy)'}
              </label>
            </div>
          )}

          <div className="text-xs text-[var(--text-muted)] flex justify-between items-center px-1 mt-4">
            <span>{settings.language === "en" ? "Found " : "Trovati "}<strong>{results.length}</strong>{settings.language === "en" ? " matching memos" : " memo corrispondenti"}</span>
            {(textQuery || dateQuery || idQuery || filterType !== 'all') && (
              <button
                onClick={() => {
                  setTextQuery('');
                  setDateQuery('');
                  setIdQuery('');
                  setFilterType('all');
                }}
                className="text-blue-500 hover:underline text-xs"
              >
                Reimposta filtri
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-3">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)] space-y-2">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">{settings.language === "en" ? "No memos match the specified criteria." : "Nessun memo corrisponde ai criteri specificati."}</p>
              <p className="text-xs">{settings.language === "en" ? "Try changing the query or selecting another search mode." : "Prova a cambiare query o selezionare un'altra modalità di ricerca."}</p>
            </div>
          ) : (
            results.map((memo) => {
              const isPunctual = memo.repeatType === 'none';
              const isExpired = isPunctual && memo.expirationDate < todayStr;
              const isToday = memo.expirationDate === todayStr;

              return (
                <div
                  key={memo.id}
                  className={`p-4 rounded-xl border transition-all bg-[var(--bg-card)] ${
                    isExpired
                      ? 'border-red-500/50 bg-red-500/5'
                      : isToday
                      ? 'border-amber-500/60 bg-amber-500/5'
                      : 'border-[var(--border-color)] hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                          ID: {memo.id}
                        </span>

                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isPunctual
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {!isPunctual && <Repeat className="w-3 h-3" />}
                          {isPunctual ? (settings.language === 'en' ? 'One-time' : 'Puntuale') : (settings.language === 'en' ? `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})` : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`)}
                        </span>

                        <span className="text-xs text-[var(--text-muted)]">
                          📅 {memo.expirationDate}
                        </span>

                        {/* Layer 1 */}
                        {memo.obfuscation === 'partial' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>{settings.language === "en" ? "Layer 1: Partial" : "Strato 1: Parziale"}</span>
                          </span>
                        )}

                        {/* Layer 2 */}
                        {memo.obfuscation === 'full' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>{settings.language === "en" ? "Layer 2: Total" : "Strato 2: Totale"}</span>
                          </span>
                        )}

                        {/* Layer 3 */}
                        {memo.isEncrypted && (
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>{settings.language === "en" ? "Layer 3: AES-256" : "Strato 3: AES-256"}</span>
                          </span>
                        )}

                        {isExpired && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white">
                            SCADUTO
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
                                title={settings.language === "en" ? "Reveal" : "Svela"}
                              >
                                <Eye className="w-3 h-3 text-blue-500" />
                                <span>{settings.language === "en" ? "Reveal" : "Svela"}</span>
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
                                title={settings.language === "en" ? "Obfuscate" : "Offusca"}
                              >
                                <EyeOff className="w-3 h-3 text-amber-500" />
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          onSelectDate(memo.expirationDate);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition flex items-center gap-1 text-xs"
                        title={settings.language === "en" ? "Show in calendar" : "Mostra nel calendario"}
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span className="hidden sm:inline">{settings.language === "en" ? "Calendar" : "Calendario"}</span>
                      </button>

                      <button
                        onClick={() => onExportMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                        title={settings.language === "en" ? "Export single memo (JSON/XML/MD/TXT)" : "Esporta singolo memo (JSON/XML/MD/TXT)"}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onPrintMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title={settings.language === "en" ? "Generate & Export PDF Card" : "Genera & Esporta Scheda PDF"}
                      >
                        <FileText className="w-4 h-4 text-blue-500" />
                      </button>

                      <button
                        onClick={() => onEditMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title={settings.language === "en" ? "Edit" : "Modifica"}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteMemo(memo.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition"
                        title={settings.language === "en" ? "Delete" : "Elimina"}
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

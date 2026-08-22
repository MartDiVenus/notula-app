/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MemoItem, DayAnalysis, REPEAT_LABELS_IT } from '../types';
import { NotulaCore } from '../utils/notulaCore';
import { getObfuscatedDisplay } from '../utils/obfuscation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Download, 
  FileText,
  Printer, 
  Edit3, 
  Trash2, 
  Plus, 
  Clock, 
  Repeat, 
  ChevronDown, 
  ChevronUp, 
  Info,
  RotateCcw,
  Shield,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface CalendarViewProps {
  currentYear: number;
  currentMonth: number; // 0-indexed
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onChangeMonth: (delta: number) => void;
  onSetMonthYear: (year: number, month: number) => void;
  core: NotulaCore;
  privacyMode: boolean;
  onNewMemo: (dateStr?: string) => void;
  onEditMemo: (memo: MemoItem) => void;
  onDeleteMemo: (id: string) => void;
  onExportMemo: (memo: MemoItem) => void;
  onPrintMemo: (memo: MemoItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentYear,
  currentMonth,
  selectedDay,
  onSelectDay,
  onChangeMonth,
  onSetMonthYear,
  core,
  privacyMode,
  onNewMemo,
  onEditMemo,
  onDeleteMemo,
  onExportMemo,
  onPrintMemo,
}) => {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [expandedMemoIds, setExpandedMemoIds] = useState<Set<string>>(new Set());
  const [revealedMemoIds, setRevealedMemoIds] = useState<Set<string>>(new Set());

  const toggleExpandMemo = (id: string) => {
    setExpandedMemoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleRevealMemo = (id: string) => {
    setRevealedMemoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
  // Adjusted for Monday start (0 = Mon, 6 = Sun)
  const startOffset = (firstDayOfWeek + 6) % 7;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDayMemos = core.getMemosForDay(currentYear, currentMonth, selectedDay);

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const weekDayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  // Handle fine-grained Month change
  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    onSetMonthYear(currentYear, newMonth);
  };

  // Handle fine-grained Year change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1900 && val <= 2200) {
      onSetMonthYear(val, currentMonth);
    }
  };

  const isCurrentMonthToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  return (
    <div className="space-y-4 w-full">
      {/* Calendar Header & Fine-grained Navigation */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-2 sm:p-5 shadow-xs w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          {/* Title & Fine Date Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="flex items-center gap-1.5 flex-nowrap">
              {/* Fine Month Selector */}
              <select
                value={currentMonth}
                onChange={handleMonthSelect}
                className="bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-black text-sm sm:text-base px-2 sm:px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs shrink-0"
                title="Seleziona Mese"
              >
                {monthNames.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Fine Year Selector */}
              <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-1.5 py-1 shadow-2xs shrink-0">
                <input
                  type="number"
                  min="1970"
                  max="2100"
                  value={currentYear}
                  onChange={handleYearChange}
                  className="w-14 sm:w-16 bg-transparent text-[var(--text-main)] font-black text-sm sm:text-base font-mono focus:outline-none text-center"
                  title="Digita o cambia Anno"
                />
              </div>
            </div>
          </div>

          {/* Steppers & Separate "Torna a Oggi" Action */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            {/* Previous & Next Month Navigation Buttons */}
            <div className="flex items-center bg-[var(--bg-subtle)] p-0.5 sm:p-1 rounded-xl border border-[var(--border-color)]">
              <button
                onClick={() => onChangeMonth(-1)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-main)] transition"
                title="Mese precedente"
                aria-label="Mese precedente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-3.5 bg-[var(--border-color)] mx-0.5" />

              <button
                onClick={() => onChangeMonth(1)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-main)] transition"
                title="Mese successivo"
                aria-label="Mese successivo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Separate Dedicated "Torna a Oggi" Action Button */}
            <button
              onClick={() => {
                onSetMonthYear(today.getFullYear(), today.getMonth());
                onSelectDay(today.getDate());
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition shadow-2xs shrink-0 whitespace-nowrap ${
                isCurrentMonthToday
                  ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
              title="Vai alla data di oggi (Mese e Giorno corrente)"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Oggi</span>
            </button>
          </div>
        </div>

        {/* Collapsible Legend Bar */}
        <div className="mb-3">
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="flex items-center justify-between w-full py-1.5 px-3 bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-muted)] transition"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Legenda Grafica</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <span>{isLegendOpen ? 'Nascondi' : 'Espandi'}</span>
              {isLegendOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isLegendOpen && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0">19</span>
                <span>Badge Dorato = Giorno Corrente (Oggi)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border-2 border-red-500 bg-transparent shrink-0"></span>
                <span>Bordo Rosso = Puntuale scaduto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border-2 border-amber-500 bg-transparent shrink-0"></span>
                <span>Bordo Arancio = Puntuale oggi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border-2 border-fuchsia-500 bg-transparent shrink-0"></span>
                <span>Bordo Magenta = Puntuale futuro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                <span>Pallino Blu = Ricorrente oggi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)] shrink-0"></span>
                <span>Pallino Grigio = Ricorrente passato</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Pallino Verde = Ricorrente futuro</span>
              </div>
            </div>
          )}
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-1.5 w-full">
          {weekDayNames.map((w, idx) => (
            <div
              key={w}
              className={`text-[10px] sm:text-xs font-bold py-1 uppercase tracking-wider truncate ${
                idx >= 5 ? 'text-amber-600/90 dark:text-amber-400/90' : 'text-[var(--text-muted)]'
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Calendar Grid (Il Serpentone Centrato) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full">
          {/* Empty offset days */}
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="min-h-[50px] sm:min-h-[72px] rounded-xl border border-dashed border-[var(--border-color)]/30 bg-transparent opacity-20"
            />
          ))}

          {/* Actual days in month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const analysis: DayAnalysis = core.analyzeDay(currentYear, currentMonth, dayNum, todayStr);
            const isSelected = selectedDay === dayNum;

            // Border styling strictly for punctual memos
            let borderClass = 'border-[var(--border-color)]';
            if (analysis.hasPunctual) {
              if (analysis.punctualExpired) {
                borderClass = 'border-2 border-red-500 shadow-sm';
              } else if (analysis.punctualToday) {
                borderClass = 'border-2 border-amber-500 shadow-sm';
              } else {
                borderClass = 'border-2 border-fuchsia-500 shadow-sm';
              }
            }

            return (
              <div
                key={dayNum}
                onClick={() => onSelectDay(dayNum)}
                className={`min-h-[48px] sm:min-h-[70px] p-1 sm:p-2 rounded-xl transition-all relative flex flex-col justify-between cursor-pointer group ${borderClass} ${
                  isSelected
                    ? 'bg-blue-500/15 ring-2 ring-blue-500 font-bold'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)]'
                } ${analysis.isToday ? 'ring-2 ring-amber-500/90 bg-amber-500/10 shadow-xs' : ''}`}
                title={analysis.isToday ? `Giorno Corrente: ${dayNum} (Oggi)` : `Giorno ${dayNum}`}
              >
                {/* Top: Day number (Circular solid gold badge for Today) + Subtle Today Dot Indicator */}
                <div className="flex items-center justify-between">
                  {analysis.isToday ? (
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px] sm:text-xs shadow-xs font-mono shrink-0">
                      {dayNum}
                    </span>
                  ) : (
                    <span
                      className={`text-xs sm:text-sm font-mono leading-none ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-[var(--text-main)] font-semibold'
                      }`}
                    >
                      {dayNum}
                    </span>
                  )}

                  {/* Geometric Gold Indicator for Today */}
                  {analysis.isToday && (
                    <span 
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 shrink-0" 
                      title="Giorno Odierno"
                    />
                  )}
                </div>

                {/* Bottom: Dots (Strictly for recurring memos) + Count Badge */}
                <div className="flex items-center justify-between mt-auto pt-1 gap-1">
                  {/* Pallini for Recurring Memos */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {analysis.hasRecurring && (
                      <span
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shadow-xs ${
                          analysis.isToday
                            ? 'bg-blue-500 animate-pulse'
                            : analysis.recurringExpired
                              ? 'bg-[var(--text-muted)]'
                              : 'bg-emerald-500'
                        }`}
                        title={
                          analysis.isToday
                            ? 'Memo ricorrente oggi (Pallino Blu)'
                            : analysis.recurringExpired
                              ? 'Memo ricorrente passato (Pallino Grigio)'
                              : 'Memo ricorrente futuro (Pallino Verde)'
                        }
                      />
                    )}
                  </div>

                  {/* Total Memo Count Badge if any */}
                  {analysis.count > 0 && (
                    <span className="text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.2 rounded-md bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-color)]">
                      {analysis.count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Section for Selected Day: Expandable List */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-3 sm:p-5 shadow-xs space-y-4 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                Memo del {selectedDay} {monthNames[currentMonth]} {currentYear}
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                {selectedDayMemos.length} memo archiviati per questa data
              </p>
            </div>
          </div>
        </div>

        {selectedDayMemos.length === 0 ? (
          <div className="py-6 text-center text-[var(--text-muted)]">
            <p className="text-xs sm:text-sm font-medium">Nessun memo presente per il {selectedDateStr}.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayMemos.map((memo) => {
              const isPunctual = memo.repeatType === 'none';
              const isExpired = isPunctual && memo.expirationDate < todayStr;
              const isTodayMemo = memo.expirationDate === todayStr;
              const isExpanded = expandedMemoIds.has(memo.id);
              const recurrenceLabel = REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType;

              return (
                <div
                  key={memo.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isExpired
                      ? 'border-red-500/50 bg-red-500/5'
                      : isTodayMemo
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : 'border-[var(--border-color)] bg-[var(--bg-subtle)]'
                  }`}
                >
                  {/* Default Collapsed Row: Header with Title and Quick Badges */}
                  <div
                    onClick={() => toggleExpandMemo(memo.id)}
                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--bg-card)]/60 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Recurrence / Punctual Mini Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                          isPunctual
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {!isPunctual && <Repeat className="w-2.5 h-2.5" />}
                        {isPunctual ? 'Puntuale' : `Ricorrente (${recurrenceLabel})`}
                      </span>

                      {/* Memo Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate">
                        {memo.title}
                      </h4>

                      {/* Layer 1: Partial Obfuscation Badge */}
                      {memo.obfuscation === 'partial' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0 flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" />
                          <span>Strato 1: Parziale</span>
                        </span>
                      )}

                      {/* Layer 2: Full Obfuscation Badge */}
                      {memo.obfuscation === 'full' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 shrink-0 flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" />
                          <span>Strato 2: Totale</span>
                        </span>
                      )}

                      {/* Layer 3: AES-256 Encryption Badge */}
                      {memo.isEncrypted && (
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 shrink-0 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Strato 3: AES-256</span>
                        </span>
                      )}

                      {isExpired && (
                        <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-red-500 text-white shrink-0">
                          SCADUTO
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:inline">
                        {memo.id}
                      </span>
                      <button
                        type="button"
                        aria-label={isExpanded ? 'Comprimi' : 'Espandi'}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body: Description, Details, and Action Toolbar */}
                  {isExpanded && (() => {
                    const isRevealed = revealedMemoIds.has(memo.id);
                    const obfInfo = getObfuscatedDisplay(
                      memo.description || '',
                      memo.obfuscation,
                      privacyMode,
                      isRevealed
                    );

                    return (
                      <div className="px-3 pb-3 sm:px-4 sm:pb-3.5 pt-1 border-t border-[var(--border-color)]/60 bg-[var(--bg-card)]/40 space-y-3 animate-in fade-in duration-150">
                        {memo.description ? (
                          <div className="relative">
                            {obfInfo.isMasked ? (
                              /* Mascheramento Grigio Satinato Elegante */
                              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/70 select-none shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                  <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                                  <span className="tracking-widest opacity-80 select-none">████████████████</span>
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
                                  className="px-2 py-1 rounded bg-slate-300/80 dark:bg-slate-700 hover:bg-slate-400/50 text-slate-800 dark:text-slate-200 transition text-[10px] flex items-center gap-1 shadow-xs font-sans font-semibold shrink-0 cursor-pointer"
                                  title="Svela temporaneamente testo"
                                >
                                  <Eye className="w-3 h-3 text-blue-500" />
                                  <span>Svela</span>
                                </button>
                              </div>
                            ) : (
                              /* Testo in chiaro o svelato */
                              <div className="relative group">
                                <div className="text-xs text-[var(--text-muted)] whitespace-pre-wrap p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                                  {obfInfo.displayText}
                                </div>
                                {(memo.obfuscation !== 'none' || privacyMode) && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRevealMemo(memo.id);
                                    }}
                                    className="absolute top-2 right-2 p-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition text-[10px] flex items-center gap-1 shadow-xs"
                                    title="Offusca nuovamente"
                                  >
                                    <EyeOff className="w-3 h-3 text-amber-500" />
                                    <span className="font-mono text-[9px]">Offusca</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-[var(--text-muted)] italic">Nessuna descrizione o nota aggiuntiva.</p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]/40">
                          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                            <span>📅 Scadenza: <strong>{memo.expirationDate}</strong></span>
                            <span>🔒 Offuscamento: <strong>{memo.obfuscation === 'full' ? 'Strato 2 (Totale)' : memo.obfuscation === 'partial' ? 'Strato 1 (Parziale)' : 'Nessuno'}</strong></span>
                            {memo.isEncrypted && <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">● AES-256 E2E</span>}
                          </div>

                          <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); onExportMemo(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                            title="Esporta singolo memo"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); onPrintMemo(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                            title="Genera & Esporta Documento PDF"
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); onEditMemo(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                            title="Modifica memo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteMemo(memo.id); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition"
                            title="Elimina memo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

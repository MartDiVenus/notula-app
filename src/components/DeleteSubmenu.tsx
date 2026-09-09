/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Trash2, AlertTriangle, X, Check, Calendar, Hash, Tag, Clock, Repeat } from 'lucide-react';
import { NotulaCore } from '../utils/notulaCore';

interface DeleteSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  core: NotulaCore;
  onMemosChanged: () => void;
}

export const DeleteSubmenu: React.FC<DeleteSubmenuProps> = ({
  isOpen,
  onClose,
  core,
  onMemosChanged,
}) => {
  const { settings } = useSettings();
  const [selectedMethod, setSelectedMethod] = useState<number>(1);
  const [yearVal, setYearVal] = useState<string>(String(new Date().getFullYear()));
  const [monthVal, setMonthVal] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [dayVal, setDayVal] = useState<string>(String(new Date().getDate()).padStart(2, '0'));
  const [titleVal, setTitleVal] = useState<string>('');
  const [idVal, setIdVal] = useState<string>('');
  const [feedback, setFeedback] = useState<{ count: number; message: string } | null>(null);

  if (!isOpen) return null;

  const handleExecuteDelete = () => {
    let deleted = 0;
    try {
      switch (selectedMethod) {
        case 1:
          if (!yearVal) throw new Error("Specifica l'anno.");
          deleted = core.removeByYearNonEternal(yearVal);
          break;
        case 2:
          if (!yearVal || !monthVal) throw new Error("Specifica anno e mese.");
          deleted = core.removeByYearAndMonthNonEternal(yearVal, monthVal);
          break;
        case 3:
          if (!yearVal || !monthVal || !dayVal) throw new Error("Specifica anno, mese e giorno.");
          deleted = core.removeByYearMonthDayNonEternal(yearVal, monthVal, dayVal);
          break;
        case 4:
          if (!titleVal.trim()) throw new Error("Specifica il titolo da eliminare.");
          deleted = core.removeByTitle(titleVal);
          break;
        case 5:
          deleted = core.removeExpiredNonEternal();
          break;
        case 6:
          if (!monthVal) throw new Error("Specifica il mese.");
          deleted = core.removeByMonthEternal(monthVal);
          break;
        case 7:
          if (!monthVal || !dayVal) throw new Error("Specifica mese e giorno.");
          deleted = core.removeByMonthAndDayEternal(monthVal, dayVal);
          break;
        case 8:
          if (confirm((settings.language === 'en' ? 'Are you absolutely sure you want to delete ALL stored memos?' : 'Sei assolutamente sicuro di voler cancellare TUTTI i memo archiviati?'))) {
            deleted = core.removeAll();
          } else {
            return;
          }
          break;
        case 9:
          if (!idVal.trim()) throw new Error("Specifica l'ID o lista ID separati da virgola.");
          const ids = idVal.split(',').map(s => s.trim()).filter(Boolean);
          deleted = core.removeByIds(ids);
          break;
        default:
          break;
      }

      setFeedback({
        count: deleted,
        message: deleted > 0 ? `Eliminati con successo ${deleted} memo.` : 'Nessun memo corrispondeva ai criteri di eliminazione.',
      });
      onMemosChanged();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--text-main)]">{settings.language === 'en' ? 'Delete Memo (GEM 1-9)' : 'Elimina Memo (GEM 1-9)'}</h2>
              <p className="text-xs text-[var(--text-muted)]">{settings.language === 'en' ? 'Select one of the 9 memo removal modes' : 'Seleziona una delle 9 modalità di rimozione memo'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Selection */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setSelectedMethod(1); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 1
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "1. By year (one-time / non-recurring)" : "1. Per anno (puntuali / non ricorrenti)"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(2); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 2
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "2. By year and month (one-time)" : "2. Per anno e mese (puntuali)"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(3); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 3
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "3. By year, month, and day (one-time)" : "3. Per anno, mese e giorno (puntuali)"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(4); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 4
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "4. By title" : "4. Per titolo"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(5); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 5
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "5. Remove expired (one-time)" : "5. Rimuovi scaduti (puntuali)"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(6); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 6
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Repeat className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "6. By month (recurring)" : "6. Per mese (ricorrenti)"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(7); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 7
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Repeat className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "7. By month and day (recurring)" : "7. Per mese e giorno (ricorrenti)"}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(8); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 ${
                selectedMethod === 8
                  ? 'border-red-600 bg-red-600 text-white font-bold'
                  : 'border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{settings.language === 'en' ? '8. ALL memos (one-time and recurring)' : '8. TUTTI i memo (puntuali e ricorrenti)'}</span>
            </button>

            <button
              onClick={() => { setSelectedMethod(9); setFeedback(null); }}
              className={`p-3 rounded-xl text-left border transition flex items-center gap-2 md:col-span-2 ${
                selectedMethod === 9
                  ? 'border-red-500 bg-red-500/10 font-bold text-red-600 dark:text-red-400'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              <Hash className="w-4 h-4 shrink-0" />
              <span>{settings.language === "en" ? "9. By IDs (single or comma-separated)" : "9. Per IDs (singolo o separati da virgola)"}</span>
            </button>
          </div>

          {/* Form Parameters for Selected Method */}
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-3">
            <h4 className="font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider">
              {settings.language === "en" ? "Removal Parameters" : "Parametri di Rimozione"}
            </h4>

            {[1, 2, 3].includes(selectedMethod) && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{settings.language === "en" ? "Year:" : "Anno:"}</label>
                <input
                  id="del_year_val"
                  name="del_year_val"
                  type="number"
                  value={yearVal}
                  onChange={(e) => setYearVal(e.target.value)}
                  placeholder={settings.language === "en" ? "E.g. 2026" : "Es. 2026"}
                  autoComplete="off"
                  data-form-type="other"
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-base sm:text-sm font-mono text-[var(--text-main)]"
                />
              </div>
            )}

            {[2, 3, 6, 7].includes(selectedMethod) && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{settings.language === "en" ? "Month (01 - 12):" : "Mese (01 - 12):"}</label>
                <select
                  value={monthVal}
                  onChange={(e) => setMonthVal(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-base sm:text-sm text-[var(--text-main)]"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const mStr = String(i + 1).padStart(2, '0');
                    return (
                      <option key={mStr} value={mStr}>
                        {mStr} - {new Date(2026, i, 1).toLocaleString('it-IT', { month: 'long' })}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {[3, 7].includes(selectedMethod) && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{settings.language === "en" ? "Day (01 - 31):" : "Giorno (01 - 31):"}</label>
                <input
                  id="del_day_val"
                  name="del_day_val"
                  type="number"
                  min={1}
                  max={31}
                  value={dayVal}
                  onChange={(e) => setDayVal(e.target.value.padStart(2, '0'))}
                  autoComplete="off"
                  data-form-type="other"
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-base sm:text-sm font-mono text-[var(--text-main)]"
                />
              </div>
            )}

            {selectedMethod === 4 && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{settings.language === "en" ? "Exact title to delete:" : "Titolo esatto da cancellare:"}</label>
                <input
                  id="del_title_val"
                  name="del_title_val"
                  type="text"
                  value={titleVal}
                  onChange={(e) => setTitleVal(e.target.value)}
                  placeholder={settings.language === "en" ? "Memo title..." : "Titolo del memo..."}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-base sm:text-sm text-[var(--text-main)]"
                />
              </div>
            )}

            {selectedMethod === 5 && (
              <div className="text-xs text-[var(--text-muted)] p-2 bg-amber-500/10 rounded-lg text-amber-700 dark:text-amber-300">
                ℹ️ Verranno eliminati tutti i memo puntuali (non ricorrenti) la cui data è antecedente a oggi. I memo ricorrenti non verranno toccati.
              </div>
            )}

            {selectedMethod === 8 && (
              <div className="text-xs text-red-600 dark:text-red-400 p-2 bg-red-500/10 rounded-lg font-medium">
                ⚠️ Attenzione: questa azione cancellerà l'intero archivio memo di Notula (sia puntuali che ricorrenti).
              </div>
            )}

            {selectedMethod === 9 && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{settings.language === "en" ? "Memo IDs (comma-separated if multiple):" : "ID Memo (separati da virgola se multipli):"}</label>
                <input
                  id="del_id_val"
                  name="del_id_val"
                  type="text"
                  value={idVal}
                  onChange={(e) => setIdVal(e.target.value)}
                  placeholder={settings.language === "en" ? "E.g. n_1724000000-12, n_1724000000-34" : "Es: n_1724000000-12, n_1724000000-34"}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-base sm:text-sm font-mono text-[var(--text-main)]"
                />
              </div>
            )}
          </div>

          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              feedback.count > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-95 transition"
          >
            {settings.language === "en" ? "Cancel / Close" : "Annulla / Chiudi"}
          </button>

          <button
            onClick={handleExecuteDelete}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{settings.language === 'en' ? 'Execute Deletion' : 'Esegui Eliminazione'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

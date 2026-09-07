/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { getLocalYYYYMMDD } from '../utils/notulaCore';
import { MemoItem, RepeatType, ObfuscationLevel } from '../types';
import { hasCalendarPermissions } from '../utils/googleCalendar';
import { requestDriveAuth } from '../utils/driveSync';
import { PlusCircle, Edit3, X, Calendar, Shield, Repeat, FileText, Check, Lock, Layers } from 'lucide-react';

interface MemoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    expirationDate: string;
    time?: string;
    repeatType: RepeatType;
    obfuscation: ObfuscationLevel;
    isEncrypted?: boolean;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
  }) => void;
  initialMemo?: MemoItem | null;
  defaultDate?: string;
  hasMasterPassword?: boolean;
}

export const MemoFormModal: React.FC<MemoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMemo,
  defaultDate,
  hasMasterPassword = false,
}) => {
  const { settings } = useSettings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [time, setTime] = useState('');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [obfuscation, setObfuscation] = useState<ObfuscationLevel>('none');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [gCalSync, setGCalSync] = useState<boolean>(false);
  const [alertDaysBefore, setAlertDaysBefore] = useState<number>(0);
  const [alertTime, setAlertTime] = useState<string>('09:00');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialMemo) {
      setTitle(initialMemo.title);
      setDescription(initialMemo.description || '');
      setExpirationDate(initialMemo.expirationDate);
      setTime(initialMemo.time || '');
      setRepeatType(initialMemo.repeatType);
      setObfuscation(initialMemo.obfuscation || 'none');
      setIsEncrypted(initialMemo.isEncrypted || false);
      setGCalSync(initialMemo.gCalSync || false);
      setAlertDaysBefore(initialMemo.alertDaysBefore || 0);
      setAlertTime(initialMemo.alertTime || '09:00');
    } else {
      setTitle('');
      setDescription('');
      setExpirationDate(defaultDate || getLocalYYYYMMDD());
      setTime('');
      setRepeatType('none');
      setObfuscation('none');
      setIsEncrypted(false);
      setGCalSync(false);
      setAlertDaysBefore(0);
      setAlertTime('09:00');
    }
    setError(null);
    setIsSubmitting(false);
  }, [initialMemo, defaultDate, isOpen]);

  if (!isOpen) return null;


  const handleGCalToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gCalSync) {
      // User is turning it ON
      const hasPerms = await hasCalendarPermissions();
      if (!hasPerms) {
        try {
          await requestDriveAuth(true, false, true); // force re-auth
          setGCalSync(true);
        } catch (err) {
          console.error("Calendar auth failed", err);
          setError("Pop-up bloccato o permessi negati. Controlla in alto a destra se il browser ha bloccato il popup di Google, oppure riprova.");
          setGCalSync(false);
        }
      } else {
        setGCalSync(true);
      }
    } else {
      // User is turning it OFF
      setGCalSync(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError(settings.language === 'en' ? 'Title is required.' : 'Il titolo è obbligatorio.');
      return;
    }
    if (!expirationDate) {
      setError(settings.language === 'en' ? 'Date is required.' : 'La data è obbligatoria.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        expirationDate,
        time: time || undefined,
        repeatType,
        obfuscation,
        isEncrypted,
        gCalSync,
        alertDaysBefore,
        alertTime
      });
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || (settings.language === 'en' ? 'Error saving memo.' : 'Errore durante il salvataggio o la sincronizzazione.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {initialMemo ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--text-main)]">
                {initialMemo ? (settings.language === 'en' ? 'Edit Memo' : 'Modifica Memo') : (settings.language === 'en' ? 'New Memo in Notula™' : 'Nuovo Memo in Notula™')}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {initialMemo ? `ID: ${initialMemo.id}` : (settings.language === 'en' ? 'Create one-time or recurring memo with AES-256 option' : 'Crea memo puntuale o ricorrente con opzione AES-256')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} data-form-type="other" className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Automatic Group Synchronization Banner */}
          {initialMemo && initialMemo.groupId && (
            <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center gap-3">
              <Layers className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="text-[11px] text-[var(--text-main)]">
                <span className="font-bold text-blue-600 dark:text-blue-400">{settings.language === 'en' ? 'Linked Recurring Series:' : 'Serie Ricorrente Collegata:'}</span> Gruppo <code className="font-mono">{initialMemo.groupId}</code>. Le modifiche a titolo, descrizione e sicurezza verranno sincronizzate <strong>{settings.language === 'en' ? 'automatically' : 'automaticamente'}</strong>{settings.language === "en" ? " across all memos in the series." : " su tutti i memo della serie."}</div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>{settings.language === "en" ? "Memo Title *" : "Titolo del Memo *"}</span>
            </label>
            <input
              id="memo_title"
              name="memo_title"
              type="text"
              required
              placeholder={settings.language === "en" ? "E.g. Insurance expiry, Court Hearing, Boiler check..." : "Es. Scadenza assicurazione, Udienza Tribunale, Controllo caldaia..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-base sm:text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{settings.language === "en" ? "Reference Date / Expiration *" : "Data di Riferimento / Scadenza *"}</span>
            </label>
            <input
              id="memo_date"
              name="memo_date"
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              autoComplete="off"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-base sm:text-sm text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Recurrence & Security Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recurrence */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-emerald-500" />
                <span>{settings.language === "en" ? "Recurrence" : "Ricorrenza"}</span>
              </label>
              <select
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value as RepeatType)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              >
                <option value="none">{settings.language === "en" ? "One-time (Non-recurring)" : "Puntuale (Non ricorrente)"}</option>
                <option value="yearly">{settings.language === "en" ? "Yearly (Recurring every year)" : "Annuale (Ricorrente ogni anno)"}</option>
                <option value="monthly">{settings.language === "en" ? "Monthly (Recurring every month)" : "Mensile (Ricorrente ogni mese)"}</option>
                <option value="weekly">{settings.language === "en" ? "Weekly (Recurring every week)" : "Settimanale (Ricorrente ogni settimana)"}</option>
                <option value="daily">{settings.language === "en" ? "Daily (Recurring every day)" : "Giornaliero (Ricorrente ogni giorno)"}</option>
              </select>
            </div>

            {/* Layered Obfuscation Selection */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>{settings.language === "en" ? "Obfuscation (Privacy)" : "Offuscamento (Privacy)"}</span>
              </label>
              <select
                value={obfuscation}
                onChange={(e) => setObfuscation(e.target.value as ObfuscationLevel)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
              >
                <option value="none">{settings.language === "en" ? "None (Plain text)" : "Nessuno (Testo in chiaro)"}</option>
                <option value="partial">{settings.language === "en" ? "Layer 1: Partial (•••)" : "Strato 1: Parziale (•••)"}</option>
                <option value="full">{settings.language === "en" ? "Layer 2: Total (••••••••)" : "Strato 2: Totale (••••••••)"}</option>
              </select>
            </div>
          </div>

          {/* Layer 3 - AES-256 Cryptographic Hardware Encryption */}
          <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/5 flex flex-col gap-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <span className="text-xs font-bold text-[var(--text-main)]">
                    {settings.language === 'en' ? 'Layer 3: Strong AES-256 E2E Encryption' : 'Strato 3: Cifratura Forte AES-256 E2E'}
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {settings.language === 'en' ? 'AES-256-GCM hardware encryption on disk and Google™ Drive backup' : 'Crittografia hardware AES-256-GCM su disco e backup Google™ Drive'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-[var(--border-color)] focus:ring-purple-500 cursor-pointer"
              />
            </label>

            {isEncrypted && (
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono bg-purple-500/10 px-2.5 py-1.5 rounded-lg border border-purple-500/20">
                {hasMasterPassword 
                  ? '🔒 Master Password configurata. Il testo verrà cifrato con PBKDF2 (100k) + AES-GCM 256-bit.' 
                  : '⚠️ Master Password non ancora impostata. Puoi impostarla in qualsiasi momento dal pulsante AES-256.'}
              </div>
            )}
          </div>

                    {/* Google Calendar Sync */}
          <div className="pt-2 border-t border-[var(--border-color)]">
            <label className="flex items-center gap-3 cursor-pointer group mb-2" onClick={handleGCalToggle}>
              <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${gCalSync ? 'bg-[#4285F4]' : 'bg-[var(--border-color)]'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${gCalSync ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[var(--text-main)] group-hover:text-[#4285F4] transition">
                  {settings.language === "en" ? "Notifications & Sync with Google Calendar" : "Notifiche e Sync con Google Calendar"}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {settings.language === "en" ? "Automatically add this memo to your calendar" : "Aggiungi automaticamente questo memo al calendario"}
                </div>
              </div>
            </label>

            {gCalSync && (
              <div className="mb-4 p-4 rounded-xl border border-[#4285F4]/30 bg-[#4285F4]/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {settings.language === "en" ? "Days Before" : "Giorni di preavviso"}
                    </label>
                    <input
                      id="memo_alert_days"
                      name="memo_alert_days"
                      type="number"
                      min="0"
                      max="30"
                      value={alertDaysBefore}
                      onChange={(e) => setAlertDaysBefore(parseInt(e.target.value) || 0)}
                      autoComplete="off"
                      data-form-type="other"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-base sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {settings.language === "en" ? "Notification Time" : "Orario notifica"}
                    </label>
                    <input
                      id="memo_alert_time"
                      name="memo_alert_time"
                      type="time"
                      value={alertTime}
                      onChange={(e) => setAlertTime(e.target.value)}
                      autoComplete="off"
                      data-form-type="other"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-base sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {settings.language === "en" 
                    ? "A reminder will be set on your Google Calendar event using these preferences."
                    : "Verrà impostato un promemoria sull'evento di Google Calendar utilizzando queste preferenze."}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <span>{settings.language === "en" ? "Description, Details and Notes" : "Descrizione, Dettagli e Note"}</span>
            </label>
            <textarea
              id="memo_description"
              name="memo_description"
              rows={4}
              placeholder={settings.language === "en" ? "Enter details, notes, or formatted text..." : "Inserisci dettagli, note o testo formattato..."}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-base sm:text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-sans"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition cursor-pointer"
            >{settings.language === "en" ? "Cancel" : "Annulla"}</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting
                ? (settings.language === 'en' ? 'Saving...' : 'Salvataggio...')
                : (initialMemo ? (settings.language === 'en' ? 'Update Memo' : 'Salva Modifiche') : (settings.language === 'en' ? 'Save to Notula™' : 'Archivia in Notula™'))}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

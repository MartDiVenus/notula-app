/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { getLocalYYYYMMDD } from '../utils/notulaCore';
import { MemoItem, RepeatType, ObfuscationLevel } from '../types';
import { PlusCircle, Edit3, X, Calendar, Shield, Repeat, FileText, Check, Lock, Layers } from 'lucide-react';

interface MemoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    expirationDate: string;
    repeatType: RepeatType;
    obfuscation: ObfuscationLevel;
    isEncrypted?: boolean;
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
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [obfuscation, setObfuscation] = useState<ObfuscationLevel>('none');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMemo) {
      setTitle(initialMemo.title);
      setDescription(initialMemo.description || '');
      setExpirationDate(initialMemo.expirationDate);
      setRepeatType(initialMemo.repeatType);
      setObfuscation(initialMemo.obfuscation || 'none');
      setIsEncrypted(initialMemo.isEncrypted || false);
    } else {
      setTitle('');
      setDescription('');
      setExpirationDate(defaultDate || getLocalYYYYMMDD());
      setRepeatType('none');
      setObfuscation('none');
      setIsEncrypted(false);
    }
    setError(null);
  }, [initialMemo, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Il titolo è obbligatorio.");
      return;
    }
    if (!expirationDate) {
      setError("La data è obbligatoria.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      expirationDate,
      repeatType,
      obfuscation,
      isEncrypted,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
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
              type="text"
              required
              placeholder={settings.language === "en" ? "E.g. Insurance expiry, Court Hearing, Boiler check..." : "Es. Scadenza assicurazione, Udienza Tribunale, Controllo caldaia..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{settings.language === "en" ? "Reference Date / Expiration *" : "Data di Riferimento / Scadenza *"}</span>
            </label>
            <input
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <span>{settings.language === "en" ? "Description, Details and Notes" : "Descrizione, Dettagli e Note"}</span>
            </label>
            <textarea
              rows={4}
              placeholder={settings.language === "en" ? "Enter details, notes, or formatted text..." : "Inserisci dettagli, note o testo formattato..."}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-sans"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
            >{settings.language === "en" ? "Cancel" : "Annulla"}</button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialMemo ? (settings.language === 'en' ? 'Update Memo' : 'Salva Modifiche') : (settings.language === 'en' ? 'Save to Notula™' : 'Archivia in Notula™')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

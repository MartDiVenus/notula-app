/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { DriveConfig } from '../types';
import { 
  getStoredDriveConfig, 
  saveDriveConfig, 
  getDriveAccessToken, 
  setDriveAccessToken,
  testDriveDiagnostics
} from '../utils/driveSync';
import { Cloud, CloudDownload, Key, ShieldCheck, AlertCircle, X, Check, ExternalLink } from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterPassword: string | null;
  onDownloadDrive: () => void;
  onDisconnectDrive?: () => void;
  isSyncing: boolean;
  syncStatusMsg?: string;
  totalMemos: number;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  masterPassword,
  onDownloadDrive,
  onDisconnectDrive,
  isSyncing,
  syncStatusMsg,
  totalMemos,
}) => {
  const { settings } = useSettings();
  const [config, setConfig] = useState<DriveConfig>(getStoredDriveConfig());
  const [clientIdInput, setClientIdInput] = useState(config.clientId);
  const [authStatus, setAuthStatus] = useState<'not_connected' | 'connected' | 'error'>('not_connected');
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const current = getStoredDriveConfig();
    setConfig(current);
    setClientIdInput(current.clientId);
    if (getDriveAccessToken()) {
      setAuthStatus('connected');
    } else {
      setAuthStatus('not_connected');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    const updated: DriveConfig = {
      ...config,
      clientId: clientIdInput.trim(),
      autoSync: true,
    };
    setConfig(updated);
    saveDriveConfig(updated);
    setTestMsg("Configurazione salvata.");
  };

  const handleTestDiagnostics = async () => {
    if (!clientIdInput.trim()) {
      setTestMsg("Inserisci prima il tuo Google™ Client ID.");
      return;
    }
    handleSaveConfig();
    setIsTesting(true);
    setTestMsg("Esecuzione test diagnostico Google™ Drive & Cartella Notula in corso...");
    try {
      const diag = await testDriveDiagnostics();
      if (diag.ok) {
        setAuthStatus('connected');
        setTestMsg(`✅ ${diag.message}`);
        onDownloadDrive();
      } else {
        setAuthStatus(diag.tokenAcquired ? 'connected' : 'error');
        setTestMsg(`❌ ${diag.message}`);
      }
    } catch (e: any) {
      setAuthStatus('error');
      setTestMsg("❌ Errore test: " + e.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    setDriveAccessToken(null);
    setAuthStatus('not_connected');
    setTestMsg("Account Google™ Drive disconnesso.");
    if (onDisconnectDrive) {
      onDisconnectDrive();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--text-main)]">{settings.language === 'en' ? 'Google™ Drive Cloud Engine (Online-Only)' : 'Motore Cloud Google™ Drive (Solo Online)'}</h2>
              <p className="text-xs text-[var(--text-muted)]">{settings.language === "en" ? "Single Source of Truth on Google™ Drive across all devices" : "Unica fonte di verità su Google™ Drive condivisa tra tutti i dispositivi"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status Banner */}
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${authStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {authStatus === 'connected' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-xs text-[var(--text-main)]">
                  {settings.language === 'en' ? 'Connection Status: ' : 'Stato Connessione: '}{authStatus === 'connected' ? (settings.language === 'en' ? 'Active & Authenticated' : 'Attivo & Autenticato') : (settings.language === 'en' ? 'Not connected / Waiting' : 'Non connesso / In attesa')}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] tabular-nums">
                  {totalMemos} {settings.language === 'en' ? 'memos in Cloud archive • Remote folder:' : 'memo in archivio Cloud • Cartella remota:'} <strong>/Notula</strong>
                </div>
              </div>
            </div>

            {authStatus === 'connected' && (
              <button
                onClick={handleDisconnect}
                className="text-xs text-red-500 hover:underline px-2 py-1 whitespace-nowrap shrink-0"
              >{settings.language === "en" ? "Disconnect" : "Disconnetti"}</button>
            )}
          </div>

          {/* Master Password Encryption status */}
          <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[var(--text-main)]">
              <Key className="w-4 h-4 text-purple-500" />
              <span>{settings.language === 'en' ? 'Cloud Encryption: ' : 'Cifratura Cloud: '}<strong>{masterPassword ? (settings.language === 'en' ? 'ACTIVE (Protected with PBKDF2/AES-256-GCM)' : 'ATTIVA (Protetto con PBKDF2/AES-256-GCM)') : (settings.language === 'en' ? 'Disabled (Plain JSON)' : 'Disattivata (Plain JSON)')}</strong></span>
            </div>
            {!masterPassword && (
              <span className="text-[11px] text-amber-500 font-medium">{settings.language === "en" ? "Recommended" : "Consigliata"}</span>
            )}
          </div>

          {/* Cloud-Only Architecture Info */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
              <div className="text-xs font-semibold text-[var(--text-main)]">
                {settings.language === "en" ? "100% Online Cloud-Only Mode Active" : "Modalità 100% Online (Cloud-Only) Attiva"}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                {settings.language === "en"
                  ? "Local browser storage is disabled for memos. Every PC and smartphone reads directly from Google™ Drive (/Notula) at startup and writes immediately on every change, guaranteeing zero asymmetry across devices."
                  : "Il salvataggio locale nel browser è disattivato per i memo. Ogni PC e smartphone legge direttamente da Google™ Drive (/Notula) all'apertura e scrive istantaneamente a ogni modifica, garantendo totale simmetria tra tutti i dispositivi."}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] pt-1">
                {settings.language === "en" ? "Authorization scope:" : "Ambito di autorizzazione:"} <code>https://www.googleapis.com/auth/drive.file</code> (cartella <code>/Notula</code>).
              </p>
            </div>
          </div>

          {/* Test / Sync Feedback */}
          {(testMsg || syncStatusMsg) && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-[var(--text-main)]">
              {testMsg || syncStatusMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleTestDiagnostics}
              disabled={isTesting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] active:scale-95 text-xs font-semibold text-[var(--text-main)] transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{isTesting ? 'Verifica in corso...' : (settings.language === "en" ? 'Verify Google™ Drive Connection' : 'Verifica Connessione Google™ Drive')}</span>
            </button>

            <button
              onClick={() => {
                onDownloadDrive();
                onClose();
              }}
              disabled={isSyncing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <CloudDownload className="w-4 h-4 shrink-0" />
              <span>{isSyncing ? 'Allineamento...' : (settings.language === 'en' ? 'Reload Now from Google™ Drive' : 'Ricarica Ora da Google™ Drive')}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-6 py-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Notula™ Cloud Sync &bull; Google™ Drive API v3</span>
          <button
            onClick={onClose}
            className="font-semibold text-[var(--text-main)] hover:underline"
          >{settings.language === "en" ? "Close" : "Chiudi"}</button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { encryptData, decryptData } from '../utils/crypto';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterPassword: string | null;
  onSetMasterPassword: (pwd: string | null) => void;
  privacyMode: boolean;
  onTogglePrivacy: (val?: boolean) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  masterPassword,
  onSetMasterPassword,
  privacyMode,
  onTogglePrivacy,
}) => {
  const { settings } = useSettings();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showPassphraseGuide, setShowPassphraseGuide] = useState(false);

  if (!isOpen) return null;

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmed = newPassword.trim();
    if (!trimmed) {
      setErrorMsg("Inserisci una passphrase valida.");
      return;
    }
    if (trimmed.length < 4) {
      setErrorMsg("La passphrase deve contenere almeno 4 caratteri.");
      return;
    }
    if (trimmed !== confirmPassword.trim()) {
      setErrorMsg("Le due passphrase inserite non coincidono.");
      return;
    }

    onSetMasterPassword(trimmed);
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMsg(
      masterPassword 
        ? "Master Passphrase modificata e aggiornata con successo! La nuova chiave protegge la sessione e i backup."
        : "Master Passphrase impostata e attivata con successo! Cifratura hardware AES-256 E2E attiva."
    );
  };

  const handleRemovePassword = () => {
    onSetMasterPassword(null);
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMsg(settings.language === "en" ? "Master Passphrase removed. E2E hardware encryption is disabled." : "Master Passphrase rimossa. La crittografia hardware E2E è disattivata.");
  };

  const handleTestEncryption = async () => {
    if (!masterPassword) {
      setErrorMsg("Imposta prima una Master Passphrase per eseguire il test crittografico.");
      return;
    }
    setIsTesting(true);
    setErrorMsg(null);
    setTestResult(null);
    try {
      const sample = "Notula Test Crittografico PBKDF2 + AES-GCM-256: " + new Date().toISOString();
      const encrypted = await encryptData(sample, masterPassword);
      const decrypted = await decryptData(encrypted, masterPassword);

      if (decrypted === sample) {
        setTestResult(`✅ Test AES-256-GCM superato al 100%!\nPayload cifrato generato: ${encrypted.substring(0, 38)}...`);
      } else {
        setErrorMsg("❌ Fallimento del test di decifratura.");
      }
    } catch (e: any) {
      setErrorMsg("❌ Errore durante il test crittografico: " + e.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[var(--text-main)]">
                {settings.language === 'en' ? 'Security & Master Passphrase' : 'Sicurezza & Master Passphrase'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {settings.language === 'en' ? 'AES-256 GCM Hardware Encryption (100,000 PBKDF2 cycles)' : 'Crittografia hardware AES-256 GCM (PBKDF2 100.000 cicli)'}
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

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Current Status Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            masterPassword
              ? 'bg-purple-500/10 border-purple-500/30'
              : 'bg-[var(--bg-subtle)] border-[var(--border-color)]'
          }`}>
            <div className={`p-2 rounded-lg ${
              masterPassword
                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                : 'bg-gray-500/10 text-gray-500'
            }`}>
              {masterPassword ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-[var(--text-main)] flex items-center justify-between">
                <span>{settings.language === "en" ? "Vault Status: " : "Stato Vault: "}{masterPassword ? (settings.language === 'en' ? '🔒 Protected with AES-256' : '🔒 Protetto con AES-256') : (settings.language === 'en' ? '🔓 Unprotected (Clear text)' : '🔓 Non protetto (In chiaro)')}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {masterPassword
                  ? 'I memo contrassegnati e i pacchetti di sincronizzazione su Google™ Drive sono protetti con chiave crittografica PBKDF2 a 256-bit.'
                  : (settings.language === 'en' ? 'No Master Passphrase active. Memos are stored locally in clear text.' : 'Nessuna Master Passphrase attiva. I memo sono memorizzati localmente in chiaro.')}
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {testResult && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono text-[11px] whitespace-pre-wrap">
              {testResult}
            </div>
          )}

          {/* Set / Change Master Passphrase Form */}
          <form onSubmit={handleSavePassword} className="space-y-3 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-500" />
                <span>{masterPassword ? (settings.language === 'en' ? 'Edit / Change Passphrase' : 'Modifica / Cambia Passphrase') : (settings.language === 'en' ? 'CREATE NEW MASTER PASSPHRASE' : 'Crea Nuova Master Passphrase')}</span>
              </h3>

              <button
                type="button"
                onClick={() => setShowPassphraseGuide(!showPassphraseGuide)}
                className="text-[11px] text-blue-500 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>{settings.language === "en" ? "How does the change work?" : "Come funziona il cambio?"}</span>
              </button>
            </div>

            {/* Guida esplicita sul cambio Passphrase */}
            {showPassphraseGuide && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-[var(--text-main)] space-y-1.5 leading-relaxed">
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  ℹ️ Come funziona il cambio della Passphrase in Notula:
                </div>
                <p>
                  <strong>{settings.language === "en" ? "Yes, the passphrase can be changed at any time:" : "Sì, la passphrase si può cambiare in qualunque momento:"}</strong>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[var(--text-muted)]">
                  <li>{settings.language === "en" ? "By entering a new passphrase below or via CLI command " : "Inserendo una nuova passphrase qui sotto o tramite comando CLI "}<code>notula passwd &lt;nuova_password&gt;</code>{settings.language === "en" ? ", Notula instantly recalculates the hardware AES-GCM cryptographic keys (100,000 PBKDF2 iterations)." : ", Notula ricalcola istantaneamente le chiavi crittografiche hardware AES-GCM (100.000 iterazioni PBKDF2)."}</li>
                  <li>{settings.language === "en" ? "The new passphrase is used for all new saves, local encryptions and protected exports." : "La nuova passphrase viene impiegata per tutti i nuovi salvataggi, cifrature locali ed esportazioni protette."}</li>
                  <li>{settings.language === "en" ? "To temporarily disable the encryption request you can click on " : "Per disattivare temporaneamente la richiesta di cifratura puoi fare clic su "}<em>{settings.language === "en" ? "Disable Passphrase" : "Disattiva Passphrase"}</em>.</li>
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder={masterPassword ? (settings.language === "en" ? "Enter NEW passphrase..." : "Inserisci la NUOVA passphrase...") : (settings.language === "en" ? "Enter new passphrase..." : "Inserisci nuova passphrase...")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-2.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1"
                >
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <input
                type={showPwd ? 'text' : 'password'}
                placeholder={settings.language === "en" ? "Confirm new passphrase..." : "Conferma nuova passphrase..."}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {masterPassword ? (
                <button
                  type="button"
                  onClick={handleRemovePassword}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  {settings.language === "en" ? "Disable Passphrase" : "Disattiva Passphrase"}
                </button>
              ) : <div />}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{masterPassword ? (settings.language === 'en' ? 'Update Passphrase' : 'Aggiorna Passphrase') : (settings.language === 'en' ? 'Save Passphrase' : 'Salva Passphrase')}</span>
              </button>
            </div>
          </form>

          {/* Privacy Toggle & Diagnostic Test */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2.5">
                {privacyMode ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-blue-500" />}
                <div>
                  <div className="text-xs font-bold text-[var(--text-main)]">{settings.language === "en" ? "Quick On-Screen Obfuscation" : "Offuscamento Rapido a Schermo"}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{settings.language === "en" ? "Visually masks memo texts to protect them from prying eyes" : "Maschera visivamente i testi dei memo per proteggerli da occhiate indiscrete"}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onTogglePrivacy()}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  privacyMode
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
                }`}
              >
                {privacyMode ? (settings.language === 'en' ? 'Active (Hidden)' : 'Attivo (Nascosto)') : (settings.language === 'en' ? 'Disabled' : 'Disattivato')}
              </button>
            </div>

            {masterPassword && (
              <button
                type="button"
                onClick={handleTestEncryption}
                disabled={isTesting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] text-xs text-[var(--text-main)] font-semibold transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-500 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{settings.language === "en" ? "Run AES-256-GCM Cryptographic Test" : "Esegui Test Crittografico AES-256-GCM"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            Notula Vault &bull; Ing. Mario Fantini
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
          >{settings.language === "en" ? "Close" : "Chiudi"}</button>
        </div>

      </div>
    </div>
  );
};

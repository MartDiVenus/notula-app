import React from 'react';
import { X, Globe, Bell, Volume2, Settings2, Moon, Sun, Monitor } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { translations } from '../../i18n/translations';
import { ThemeMode } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, setTheme }) => {
  const { settings, updateSettings } = useSettings();
  const t = translations[settings.language].settings;

  if (!isOpen) return null;

  const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    updateSettings({ notifications: checked });
    
    if (checked && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification request failed or was blocked', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-2 text-[var(--text-main)] font-bold">
            <Settings2 className="w-5 h-5 text-blue-500" />
            <span>{t.title}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Language */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)]">{t.language}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{t.languageDesc}</div>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'it' })}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-medium text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="en">English (EN)</option>
              <option value="it">Italiano (IT)</option>
            </select>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : theme === 'light' ? <Sun className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)]">{t.theme}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{t.themeDesc}</div>
              </div>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeMode)}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-medium text-[var(--text-main)] focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)]">{t.notifications}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{t.notificationsDesc}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.notifications}
                onChange={handleNotificationChange}
              />
              <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)]">{t.sound}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{t.soundDesc}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.sound}
                onChange={(e) => updateSettings({ sound: e.target.checked })}
              />
              <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

        </div>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--border-color)] text-[var(--text-main)] font-bold text-sm transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

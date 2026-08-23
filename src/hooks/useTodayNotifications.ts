import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { NotulaCore, getLocalYYYYMMDD } from '../utils/notulaCore';

export const useTodayNotifications = (core: NotulaCore) => {
  const { settings } = useSettings();
  const hasNotifiedToday = useRef<string | null>(null);

  useEffect(() => {
    // Only proceed if notifications or sound are enabled
    if (!settings.notifications && !settings.sound) return;

    const today = new Date();
    const todayStr = getLocalYYYYMMDD(today);
    
    // Check if we already notified today
    if (hasNotifiedToday.current === todayStr) return;

    // Analyze today
    const analysis = core.analyzeDay(today.getFullYear(), today.getMonth(), today.getDate(), todayStr);
    if (analysis.memos.length > 0) {
      const title = settings.language === 'en' ? 'Notula: Memos Today' : 'Notula: Promemoria Odierni';
      const body = settings.language === 'en' 
        ? `You have ${analysis.memos.length} memo(s) scheduled for today.`
        : `Hai ${analysis.memos.length} promemoria in programma per oggi.`;

      // 1. Web Notification
      if (settings.notifications && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icon-512.png',
          });
        }
      }

      // 2. Sound
      if (settings.sound) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Up to A5

          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
          console.warn('Audio play failed', e);
        }
      }

      hasNotifiedToday.current = todayStr;
    }
  }, [core, settings.notifications, settings.sound, settings.language]); // Depend on settings and core
};

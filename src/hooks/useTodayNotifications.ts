import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { NotulaCore, getLocalYYYYMMDD } from '../utils/notulaCore';

const LS_NOTIFIED_KEY = 'notula_notified_today';

export const useTodayNotifications = (core: NotulaCore, renderTrigger: number) => {
  const { settings } = useSettings();
  const notifiedEvents = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load initial state from local storage on mount ONLY to prevent refresh-spam
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_NOTIFIED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only load if it matches today's date
        const todayStr = getLocalYYYYMMDD(new Date());
        if (parsed.date === todayStr && Array.isArray(parsed.ids)) {
          notifiedEvents.current = new Set(parsed.ids);
        } else {
           // Obsolete day, clear it
           localStorage.removeItem(LS_NOTIFIED_KEY);
        }
      }
    } catch (e) {
      console.warn('Failed to parse notified events', e);
    }
  }, []);

  useEffect(() => {
    // Only proceed if notifications or sound are enabled
    if (!settings.notifications && !settings.sound) return;

    const checkAndNotify = () => {
      const today = new Date();
      const todayStr = getLocalYYYYMMDD(today);
      
      // Analyze today
      const analysis = core.analyzeDay(today.getFullYear(), today.getMonth(), today.getDate(), todayStr);
      
      // Find new memos we haven't notified about yet FOR TODAY
            const unnotifiedMemos = analysis.memos.filter(m => !notifiedEvents.current.has(`${todayStr}_${m.id}`));
      
      console.log(`[Notula Notification Engine] Triggered. Today: ${todayStr}, Total Memos: ${analysis.memos.length}, Unnotified: ${unnotifiedMemos.length}`);

      if (unnotifiedMemos.length > 0) {
        const title = settings.language === 'en' ? 'Notula: Memos Today' : 'Notula: Promemoria Odierni';
        
        // Dispatch In-App Toast event
        window.dispatchEvent(new CustomEvent('notula-toast', { 
           detail: { title, body } 
        }));
        const body = settings.language === 'en' 
          ? `You have ${analysis.memos.length} memo(s) scheduled for today.`
          : `Hai ${analysis.memos.length} promemoria in programma per oggi.`;

        // 1. Web Notification
        if (settings.notifications && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            try {
              // Try standard web notification
              const notif = new Notification(title, {
                body,
                icon: '/icon-512.png',
                tag: `notula-daily-${Date.now()}`,
              });
              
              notif.onerror = (e) => {
                 console.error("[Notula] Notification API onerror fired", e);
              };
            } catch (err) {
              console.warn('[Notula] Standard Notification constructor failed, trying Service Worker...', err);
              // Fallback to Service Worker for strict environments
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                  registration.showNotification(title, {
                    body,
                    icon: '/icon-512.png',
                    tag: `notula-daily-${Date.now()}`
                  }).catch(swErr => console.error('[Notula] SW Notification failed', swErr));
                });
              }
            }
          } else {
             console.warn("[Notula] Notification permission is not 'granted'. Current state:", Notification.permission);
          }
        }

        // 2. Sound
        if (settings.sound) {
          try {
            if (!audioCtxRef.current) {
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const audioCtx = audioCtxRef.current;
            
            if (audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
            
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
            console.warn('Audio play failed (maybe needs user gesture first)', e);
          }
        }

        // Track all current memos as notified FOR TODAY
        analysis.memos.forEach(m => notifiedEvents.current.add(`${todayStr}_${m.id}`));

        // Persist to local storage to survive page reloads during the same day
        try {
           localStorage.setItem(LS_NOTIFIED_KEY, JSON.stringify({
              date: todayStr,
              ids: Array.from(notifiedEvents.current)
           }));
        } catch (e) {}
      }
    };

    // Run immediately when dependencies change (like saving a memo)
    checkAndNotify();

    // Set up a checker every 30 seconds to catch date rollovers (midnight passes) or delayed loads
    const intervalId = setInterval(checkAndNotify, 30000);

    return () => clearInterval(intervalId);

  }, [core, settings.notifications, settings.sound, settings.language, renderTrigger]);
};

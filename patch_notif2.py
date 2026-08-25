import re

with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the localStorage loading useEffect entirely
load_effect = """  // Load initial state from local storage on mount ONLY to prevent refresh-spam
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
  }, []);"""

content = content.replace(load_effect, "")

# Remove the localStorage setting
save_effect = """        // Persist to local storage to survive page reloads during the same day
        try {
           localStorage.setItem(LS_NOTIFIED_KEY, JSON.stringify({
              date: todayStr,
              ids: Array.from(notifiedEvents.current)
           }));
        } catch (e) {}"""

content = content.replace(save_effect, "")

# Add requireInteraction to Notification options
old_notif = """              const notif = new Notification(title, {
                body,
                icon: '/icon-512.png',
                tag: `notula-daily-${Date.now()}`,
              });"""
new_notif = """              const notif = new Notification(title, {
                body,
                icon: '/icon-512.png',
                tag: `notula-daily-${Date.now()}`,
                requireInteraction: true,
              });"""
content = content.replace(old_notif, new_notif)

# Add requireInteraction to SW options
old_sw_notif = """                  registration.showNotification(title, {
                    body,
                    icon: '/icon-512.png',
                    tag: `notula-daily-${Date.now()}`
                  }).catch(swErr => console.error('[Notula] SW Notification failed', swErr));"""
new_sw_notif = """                  registration.showNotification(title, {
                    body,
                    icon: '/icon-512.png',
                    tag: `notula-daily-${Date.now()}`,
                    requireInteraction: true
                  }).catch(swErr => console.error('[Notula] SW Notification failed', swErr));"""
content = content.replace(old_sw_notif, new_sw_notif)

# Fix sound
old_sound = """        // 2. Sound
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
        }"""
new_sound = """        // 2. Sound
        if (settings.sound) {
          try {
            if (!audioCtxRef.current) {
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const audioCtx = audioCtxRef.current;
            
            // Audio requires async resume in modern browsers
            const playSound = async () => {
              if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
              }
              const oscillator = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
              oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
              gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
              gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.start(audioCtx.currentTime);
              oscillator.stop(audioCtx.currentTime + 0.5);
            };
            playSound().catch(e => console.warn('Audio play failed (autoplay policy)', e));
          } catch (e) {
            console.warn('Audio play failed (maybe needs user gesture first)', e);
          }
        }"""
content = content.replace(old_sound, new_sound)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the tag unique so every notification pops up!
old_tag = "tag: 'notula-daily',"
new_tag = "tag: `notula-daily-${Date.now()}`,"
content = content.replace(old_tag, new_tag)

# Let's add Registration fallback and extensive logging
old_web_notif = """        // 1. Web Notification
        if (settings.notifications && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            try {
              new Notification(title, {
                body,
                icon: '/icon-512.png',
                tag: 'notula-daily', // Prevents infinite stacking of popups
              });
            } catch (err) {
              console.warn('Notification failed', err);
            }
          }
        }"""

new_web_notif = """        // 1. Web Notification
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
                 console.error("Notification API onerror fired", e);
              };
            } catch (err) {
              console.warn('Standard Notification constructor failed, trying Service Worker...', err);
              // Fallback to Service Worker for mobile/PWA strict environments
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                  registration.showNotification(title, {
                    body,
                    icon: '/icon-512.png',
                    tag: `notula-daily-${Date.now()}`
                  }).catch(swErr => console.error('SW Notification failed', swErr));
                });
              }
            }
          } else {
             console.warn("Notification permission is not granted. It is:", Notification.permission);
          }
        }"""

content = content.replace(old_web_notif, new_web_notif)

# Add console logs to checkAndNotify
old_check = "const unnotifiedMemos = analysis.memos.filter(m => !notifiedEvents.current.has(`${todayStr}_${m.id}`));"
new_check = """      const unnotifiedMemos = analysis.memos.filter(m => !notifiedEvents.current.has(`${todayStr}_${m.id}`));
      
      console.log(`[Notula Notification Engine] Triggered. Today: ${todayStr}, Total Memos: ${analysis.memos.length}, Unnotified: ${unnotifiedMemos.length}`);"""
content = content.replace(old_check, new_check)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

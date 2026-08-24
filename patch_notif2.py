with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the notification block completely
old_block = """        // 1. Web Notification
        if (settings.notifications && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            try {
              new Notification(title, {
                body,
                icon: '/icon-512.png',
                tag: `notula-daily-${Date.now()}`, // Prevents infinite stacking of popups
              });
            } catch (err) {
              console.warn('Notification failed', err);
            }
          }
        }"""

new_block = """        // 1. Web Notification
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
        }"""

content = content.replace(old_block, new_block)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

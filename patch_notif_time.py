import re

with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_filter = """      // Find new memos we haven't notified about yet FOR TODAY
      const unnotifiedMemos = analysis.memos.filter(m => !notifiedEvents.current.has(`${todayStr}_${m.id}`));"""
new_filter = """      // Find new memos we haven't notified about yet FOR TODAY
      const now = new Date();
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

      const unnotifiedMemos = analysis.memos.filter(m => {
        if (notifiedEvents.current.has(`${todayStr}_${m.id}`)) return false;
        
        // If memo has a specific time, check if we've reached it
        if (m.time) {
           const [hStr, mStr] = m.time.split(':');
           const targetTotalMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
           if (currentTotalMinutes < targetTotalMinutes) {
              return false; // Not time yet
           }
        }
        return true;
      });"""
content = content.replace(old_filter, new_filter)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

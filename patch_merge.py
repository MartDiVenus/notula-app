import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_merge = '''    const updatedList = Array.from(existingMap.values());
    coreRef.current.setMemos(updatedList);
    persistMemos(updatedList);
  };'''

new_merge = '''    const updatedList = Array.from(existingMap.values());
    coreRef.current.setMemos(updatedList);
    persistMemos(updatedList);

    // GCal background sync per i memo importati che lo richiedono
    (async () => {
      let gCalChanged = false;
      for (const memo of updatedList) {
        if (memo.gCalSync) {
          try {
            // syncMemoToGoogleCalendar restituisce null o ID. Non far fallire tutto per uno.
            const eventId = await syncMemoToGoogleCalendar(memo, true);
            if (eventId && memo.gCalEventId !== eventId) {
              memo.gCalEventId = eventId;
              gCalChanged = true;
            }
          } catch (e) {
            console.warn(`Silenced GCal sync error for memo ${memo.id}`, e);
          }
        }
      }
      if (gCalChanged) {
         coreRef.current.setMemos(updatedList);
         persistMemos(updatedList);
      }
    })();
  };'''

content = content.replace(old_merge, new_merge)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

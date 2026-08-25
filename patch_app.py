import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_app = '''        try {
          const eventId = await syncMemoToGoogleCalendar(savedMemo);
          if (eventId) {
            coreRef.current.updateMemo({
              id: savedMemo.id,
              gCalEventId: eventId
            });
          }
        } catch (e) {
          console.error("Failed to sync to GCal", e);
        }'''

new_app = '''        try {
          const eventId = await syncMemoToGoogleCalendar(savedMemo);
          if (eventId) {
            coreRef.current.updateMemo({
              id: savedMemo.id,
              gCalEventId: eventId
            });
          }
        } catch (e) {
          console.error("Failed to sync to GCal", e);
          throw e;
        }'''

content = content.replace(old_app, new_app)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

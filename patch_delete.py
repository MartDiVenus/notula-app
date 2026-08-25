import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if "deleteMemoFromGoogleCalendar" not in content:
    content = content.replace('import { syncMemoToGoogleCalendar } from "./utils/googleCalendar";', 'import { syncMemoToGoogleCalendar, deleteMemoFromGoogleCalendar } from "./utils/googleCalendar";')

pattern = r"const confirmDeleteMemo = \(\) => \{\n\s+if \(memoToDelete\) \{"
new_block = """const confirmDeleteMemo = () => {
    if (memoToDelete) {
      const memoObj = coreRef.current.getMemos().find(m => m.id === memoToDelete);
      if (memoObj && memoObj.gCalEventId) {
         deleteMemoFromGoogleCalendar(memoObj.gCalEventId);
      }"""
      
content = re.sub(pattern, new_block, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

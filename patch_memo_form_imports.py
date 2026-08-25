import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_imports = '''import { hasCalendarPermissions } from '../utils/googleCalendar';
import { requestDriveAuth } from '../utils/driveSync';
import { PlusCircle,'''

content = content.replace("import { PlusCircle,", new_imports)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/components/CalendarView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { getObfuscatedDisplay } from '../utils/obfuscation';",
    "import { getObfuscatedDisplay } from '../utils/obfuscation';\nimport { downloadIcs } from '../utils/ics';"
)

with open('src/components/CalendarView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  Bell,\n  X,", "  Bell,")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


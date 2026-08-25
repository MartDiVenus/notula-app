import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "Calendar,",
    "Calendar,\n  CalendarPlus,\n  Download,"
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

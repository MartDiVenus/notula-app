import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '                  8. Terminale CLI (edit/export/import)',
    '                  {settings.language === "en" ? "8. CLI Terminal (edit/export/import)" : "8. Terminale CLI (edit/export/import)"}'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

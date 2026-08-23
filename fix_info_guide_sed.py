with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '3. Calendar Visual Legend {settings.language' in line:
        lines[i] = '                    <span>{settings.language === "en" ? "3. Calendar Visual Legend & Recurrence Management with groupID" : "3. Legenda Visiva del Calendario & Gestione Ricorrenze con groupID"}</span>\n'

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

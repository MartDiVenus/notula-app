import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<span>{settings.language === "en" ? "7. Native Calendar Sync & Offline Notifications" : "7. Sincronizzazione Calendario Nativo e Notifiche Offline"}</span>',
    '<span>{settings.language === "en" ? "7. Native Calendar Sync & Notifications" : "7. Sincronizzazione Calendario Nativo e Notifiche"}</span>'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

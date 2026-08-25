with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
    
content = content.replace(
    'the "Notifications & Sync with Google Calendar" switch',
    "the 'Notifications & Sync with Google Calendar' switch"
)
content = content.replace(
    'l\'interruttore "Notifiche e Sync con Google Calendar"',
    "l'interruttore 'Notifiche e Sync con Google Calendar'"
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

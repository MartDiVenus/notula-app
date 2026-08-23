import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "Sincronizzazione Google™ Drive in background completata": "Background Google™ Drive synchronization completed",
    "Memo locali sincronizzati su Google™ Drive": "Local memos synchronized to Google™ Drive",
    "Google™ Drive pronto": "Google™ Drive ready",
    "Sincronizzato su Google™ Drive con massima priorità": "Synchronized to Google™ Drive with high priority",
    "Connessione e download in corso da Google™ Drive...": "Connecting and downloading from Google™ Drive...",
    "Errore sincronizzazione Google™ Drive: ": "Google™ Drive synchronization error: "
}

for it, en in replacements.items():
    pattern = f'"{it}"'
    replacement = f'(settings.language === "en" ? "{en}" : "{it}")'
    content = content.replace(pattern, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

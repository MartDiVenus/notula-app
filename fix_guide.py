import re
import os

guide_translations = {
    "Autore, Contatti, Copyright": "Author, Contacts, Copyright",
    "Installazione, Emblema": "Installation, Emblem",
    "Guida Funzionale, Manuale d'Uso": "Functional Guide, User Manual",
    "Manuale Completo": "Complete Manual",
    "Come installare la Web App": "How to install the Web App",
    "L'Emblema Notula™": "The Notula™ Emblem",
    "Cosa Fa Notula™: Lo Schedario Ingegneristico Universale": "What Notula™ Does: The Universal Engineering Filing System",
    "Peculiarità e Punti di Forza Unici di Notula™": "Unique Features and Strengths of Notula™",
    "Creare e Gestire Memo": "Creating and Managing Memos",
    "La Master Passphrase e la Crittografia AES-256": "The Master Passphrase and AES-256 Encryption",
    "Livelli di Offuscamento (Privacy)": "Obfuscation Levels (Privacy)",
    "Cloud Sync (Google Drive)": "Cloud Sync (Google Drive)",
    "Operatività CLI e Scorciatoie": "CLI Operations and Shortcuts"
}

def fix_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for it, en in guide_translations.items():
        pattern = r'>(\s*)' + re.escape(it) + r'(\s*)<'
        new_tag = r'>\g<1>{settings.language === "en" ? "' + en + r'" : "' + it + r'"}\g<2><'
        content = re.sub(pattern, new_tag, content)
        
        # also replace strings
        content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

fix_file('./src/components/InfoGuideModal.tsx')
fix_file('./src/components/CliManualModal.tsx')

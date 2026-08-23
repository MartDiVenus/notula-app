import os

replacements = {
    ">Elimina Memo<": '>{settings.language === "en" ? "Delete Memo" : "Elimina Memo"}<',
    ">Memo Totali:<": '>{settings.language === "en" ? "Total Memos:" : "Memo Totali:"}<',
    ">Cifratura:<": '>{settings.language === "en" ? "Encryption:" : "Cifratura:"}<',
    ">Calendario Notula™ (Vista Principale)<": '>{settings.language === "en" ? "Notula™ Calendar (Main View)" : "Calendario Notula™ (Vista Principale)"}<',
    ">Funzioni GEM Notula<": '>{settings.language === "en" ? "Notula GEM Functions" : "Funzioni GEM Notula"}<',
    ">Cloud &amp; Archivio<": '>{settings.language === "en" ? "Cloud &amp; Storage" : "Cloud &amp; Archivio"}<',
    ">Cloud & Archivio<": '>{settings.language === "en" ? "Cloud & Storage" : "Cloud & Archivio"}<',
    ">Cartella Google™ Drive<": '>{settings.language === "en" ? "Google™ Drive Folder" : "Cartella Google™ Drive"}<',
    ">Inattiva<": '>{settings.language === "en" ? "Inactive" : "Inattiva"}<',
    ">Attiva (AES-256)<": '>{settings.language === "en" ? "Active (AES-256)" : "Attiva (AES-256)"}<',
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in replacements.items():
        content = content.replace(it, en)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

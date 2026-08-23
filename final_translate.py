import os
import re

replacements = {
    "Elimina Memo": "Delete Memo",
    "Memo Totali": "Total Memos",
    "Notula GEM Functions": "Notula GEM Functions",
    "Cerca": "Search",
    "Sincronizza": "Sync",
    "Esporta": "Export",
    "Importa": "Import",
    "Stampa": "Print",
    "Autore": "Author",
    "Installazione": "Installation",
    "Manuale": "Manual",
    "Guida": "Guide",
    "Archivio": "Archive",
    "Cloud": "Cloud",
    "Cifratura": "Encryption",
    "Attiva": "Active",
    "Inattiva": "Inactive",
    "Nessun memo valido trovato nel file.": "No valid memos found in the file.",
    "File JSON non valido.": "Invalid JSON file.",
    "Nessun memo trovato nel backup Google™ Drive.": "No memos found in Google™ Drive backup.",
    "Ricerca": "Search",
    "Terminale": "Terminal",
    "Informazioni": "Information",
    "Supporto": "Support",
    "Impostazioni": "Settings",
    "Nuovo": "New",
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just fix the specific missed headers
    content = content.replace('>Elimina Memo<', '>{settings.language === "en" ? "Delete Memo" : "Elimina Memo"}<')
    content = content.replace('>Memo Totali<', '>{settings.language === "en" ? "Total Memos" : "Memo Totali"}<')
    content = content.replace('"Nessun memo valido trovato nel file."', '(settings.language === "en" ? "No valid memos found in the file." : "Nessun memo valido trovato nel file.")')
    content = content.replace('"File JSON non valido."', '(settings.language === "en" ? "Invalid JSON file." : "File JSON non valido.")')
    content = content.replace('"Nessun memo trovato nel backup Google™ Drive."', '(settings.language === "en" ? "No memos found in Google™ Drive backup." : "Nessun memo trovato nel backup Google™ Drive.")')
    
    # Fix untranslated alerts in App.tsx
    content = content.replace('alert("Importazione completata', 'alert(settings.language === "en" ? "Import completed" : "Importazione completata')
    content = content.replace('alert("Sincronizzazione completata', 'alert(settings.language === "en" ? "Sync completed" : "Sincronizzazione completata')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

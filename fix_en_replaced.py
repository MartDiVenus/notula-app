import os
import re

replacements = {
    "Cerca (Data/Titolo/ID)": "Search (Date/Title/ID)",
    "Elenco Memo (a-g)": "Memo List (a-g)",
    "Elimina Memo (1-9)": "Delete Memo (1-9)",
    "Importa File (JSON / XML)": "Import File (JSON / XML)",
    "Esporta (XML, MD, ICS, JSON, PDF)": "Export (XML, MD, ICS, JSON, PDF)",
    "Funzioni GEM Notula": "Notula GEM Functions",
    "Cloud & Archivio": "Cloud & Storage",
    "Cartella Cloud": "Cloud Folder",
    "Cartella Google™ Drive": "Google™ Drive Folder",
    "Memo Totali:": "Total Memos:",
    "Cifratura:": "Encryption:",
    "Attiva (AES-256)": "Active (AES-256)",
    "Inattiva": "Inactive",
    "Memo": "Memos",
    "Calendario Notula™ (Vista Principale)": "Notula™ Calendar (Main View)",
    "promemoria": "memos",
    "Sincronizzazione Cloud & Google™ Drive": "Cloud & Google™ Drive Sync",
    "Elimina Memo (GEM 1-9)": "Delete Memo (GEM 1-9)",
    "Cerca nei Memo (Notula Search)": "Search Memos (Notula Search)",
    "Elenco Memo (GEM a-g)": "Memo List (GEM a-z)",
    "Esportazione Documento PDF Ink-Friendly": "Ink-Friendly PDF Export",
    "Nuovo Memo in Notula™": "New Memo in Notula™",
    "Crea memo puntuale o ricorrente con opzione AES-256": "Create one-time or recurring memo with AES-256 option",
    "Titolo del Memo *": "Memo Title *",
    "Salva Modifiche": "Save Changes",
    "Archivia in Notula™": "Store in Notula™",
    "Annulla": "Cancel",
    "Salva Memo": "Save Memo",
    "Salvataggio...": "Saving...",
    "Memo Privato (Cifrato)": "Private Memo (Encrypted)",
    "Ricorrenza:": "Recurrence:",
    "Data Scadenza:": "Expiration Date:"
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for it, en in replacements.items():
        # Replace the broken EN_REPLACED with actual english string if the italian matches
        content = content.replace(f'{{settings.language === "en" ? "EN_REPLACED" : "{it}"}}', f'{{settings.language === "en" ? "{en}" : "{it}"}}')
        content = content.replace(f'(settings.language === "en" ? "EN_REPLACED" : "{it}")', f'(settings.language === "en" ? "{en}" : "{it}")')
        content = content.replace(f'(settings.language === \'en\' ? \'EN_REPLACED\' : \'{it}\')', f'(settings.language === "en" ? "{en}" : "{it}")')
        # Also clean up double ternaries
        content = content.replace(f'(settings.language === "en" ? "{en}" : (settings.language === "en" ? "{en}" : "{it}"))', f'(settings.language === "en" ? "{en}" : "{it}")')
        content = content.replace(f'(settings.language === \'en\' ? \'{en}\' : (settings.language === \'en\' ? \'{en}\' : \'{it}\'))', f'(settings.language === "en" ? "{en}" : "{it}")')

    # General fallback for any remaining EN_REPLACED
    if "EN_REPLACED" in content:
        # Just replace it with the fallback Italian or whatever, but preferably English if we know it.
        pass

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

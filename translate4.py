import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for it, en in replacements.items():
        content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')
        content = content.replace(f"'{it}'", f"(settings.language === 'en' ? '{en}' : '{it}')")
        content = content.replace(f'>{it}<', f'>{{settings.language === "en" ? "{en}" : "{it}"}}<')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replacements_app = {
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
    "Nessun memo valido trovato nel file.": "No valid memos found in the file.",
    "File JSON non valido.": "Invalid JSON file.",
    "Nessun memo trovato nel backup Google™ Drive.": "No memos found in Google™ Drive backup."
}

replace_in_file('src/App.tsx', replacements_app)

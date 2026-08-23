import os
import re

def safe_replace(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in replacements.items():
        # Tag content
        content = re.sub(r'>\s*' + re.escape(it) + r'\s*<', f'>{{settings.language === "en" ? "{en}" : "{it}"}}<', content)
        # Inside existing ternary that might be broken or just direct replace
        content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')
        content = content.replace(f"'{it}'", f"(settings.language === 'en' ? '{en}' : '{it}')")

    # Fix nested settings.language that might happen due to naive replacement
    content = re.sub(r'\{\s*settings\.language === "en"\s*\?\s*"[^"]+"\s*:\s*\(\s*settings\.language === "en"\s*\?\s*"[^"]+"\s*:\s*"([^"]+)"\s*\)\s*\}', r'{settings.language === "en" ? "EN_REPLACED" : "\1"}', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = {
    "Tutti i Memo": "All Memos",
    "Memo Ricorrenti": "Recurring Memos",
    "Memo Scaduti": "Expired Memos",
    "Cerca nei Memo": "Search Memos",
    "Cerca (Data/Titolo/ID)": "Search (Date/Title/ID)",
    "Elenco Memo (a-g)": "Memo List (a-g)",
    "Elimina Memo (1-9)": "Delete Memo (1-9)",
    "Scarica da Google™ Drive": "Download from Google™ Drive",
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
    "Mostra Menu Laterale": "Show Sidebar",
    "Nuovo Memo": "New Memo",
    "Ricerca": "Search",
    "Visualizzazione Lista": "List View",
    "Eliminazione": "Delete",
    "Sincronizzazione Cloud": "Cloud Sync",
    "Stampa (PDF)": "Print (PDF)",
    "Esportazione / Import": "Export/Import",
    "Terminale CLI": "CLI Terminal",
    "Autore, Contatti, Copyright": "Author, Contacts, Copyright",
    "Installazione, Emblema": "Installation, Emblem",
    "Guida Funzionale, Manuale d'Uso": "Functional Guide, Manual",
    "Privacy: ON": "Privacy: ON",
    "Privacy: OFF": "Privacy: OFF",
    "INFORMAZIONI & SUPPORTO": "INFO & SUPPORT",
    "Impostazioni": "Settings",
    
    # H2s and specific submenu headers
    "Sincronizzazione Cloud & Google™ Drive": "Cloud & Google™ Drive Sync",
    "Elimina Memo (GEM 1-9)": "Delete Memo (GEM 1-9)",
    "Cerca nei Memo (Notula Search)": "Search Memos (Notula Search)",
    "Elenco Memo (GEM a-g)": "Memo List (GEM a-z)",
    "Esportazione Documento PDF Ink-Friendly": "Ink-Friendly PDF Export",
    
    # Form Modals
    "Nuovo Memo in Notula™": "New Memo in Notula™",
    "Crea memo puntuale o ricorrente con opzione AES-256": "Create one-time or recurring memo with AES-256 option",
    "Titolo del Memo *": "Memo Title *",
    "Salva Modifiche": "Save Changes",
    "Archivia in Notula™": "Store in Notula™",
    "Annulla": "Cancel",
    "Salva Memo": "Save Memo",
    "Salvataggio...": "Saving...",
    "Memo Privato (Cifrato)": "Private Memo (Encrypted)",
    
    # Other App.tsx specific
    "Ricorrenza:": "Recurrence:",
    "Data Scadenza:": "Expiration Date:"
}

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            safe_replace(os.path.join(root, file), replacements)

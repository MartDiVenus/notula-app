import re
import os

dict_translations = {
    # CalendarView
    "Espandi": "Expand",
    "Comprimi": "Collapse",
    "Nascondi": "Hide",
    "Bordo Rosso = Puntuale scaduto": "Red Border = Expired one-time",
    "Bordo Arancio = Puntuale oggi": "Orange Border = One-time today",
    "Bordo Magenta = Puntuale futuro": "Magenta Border = Future one-time",
    "Pallino Blu = Ricorrente oggi": "Blue Dot = Recurring today",
    "Pallino Grigio = Ricorrente passato": "Gray Dot = Past recurring",
    "Pallino Verde = Ricorrente futuro": "Green Dot = Future recurring",
    "Legenda Visiva del Calendario &amp; Gestione Ricorrenze con groupID": "Calendar Visual Legend &amp; Recurrence Management with groupID",
    "Sei sicuro di voler eliminare definitivamente questo promemoria? Questa azione non può essere annullata.": "Are you sure you want to permanently delete this memo? This action cannot be undone.",
    "Sì, Elimina": "Yes, Delete",
    "Annulla": "Cancel",
    "Titolo:": "Title:",
    "Data:": "Date:",
    "Scadenza:": "Expiration:",
    "Descrizione:": "Description:",
    
    # MemoFormModal & General
    "Giorno (01 - 31):": "Day (01 - 31):",
    "Mese (01 - 12):": "Month (01 - 12):",
    "Anno:": "Year:",
    "Descrizione, Dettagli e Note": "Description, Details and Notes",
    "Data di Riferimento / Scadenza *": "Reference Date / Expiration *",
    "Ricorrente Annuale / Mensile.": "Yearly / Monthly Recurring.",
    "Ricorrente Settimanale / Giornaliero.": "Weekly / Daily Recurring.",
    "Solo Puntuali (Non ricorrenti)": "Only One-time (Non-recurring)",
    
    # ConflictModal
    "Versione Locale (Attuale)": "Local Version (Current)",
    "Versione in Arrivo (Google™ Drive / File)": "Incoming Version (Google™ Drive / File)",
    "È stata rilevata una discrepanza tra la versione attualmente presente nel database locale e quella in arrivo. Seleziona come procedere:": "A discrepancy has been detected between the local database version and the incoming one. Select how to proceed:",
    "(M) Tieni Entrambi": "(M) Keep Both",
    "(A) Sostituisci Tutti": "(A) Replace All",
    "(I) Ignora": "(I) Ignore",
    "(Y) Sostituisci": "(Y) Replace",
    
    # ExportModal
    "Seleziona il formato di esportazione:": "Select export format:",
    
    # General labels
    "SCADUTO": "EXPIRED",
    "Risultati filtrati:": "Filtered results:",
    "Nessun comando corrisponde ai criteri di ricerca.": "No command matches the search criteria.",
    "Reimposta filtri": "Reset filters",
    "Tutte le Sezioni": "All Sections",
    "Ricerca Globale Multi-Criterio": "Multi-Criteria Global Search"
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content
    
    for it, en in dict_translations.items():
        # Handle tags
        tag_pattern = f'>{it}<'
        new_tag = f'>{{settings.language === "en" ? "{en}" : "{it}"}}<'
        content = content.replace(tag_pattern, new_tag)

        # Handle inside string templates or ternary if it's already in code but just as string
        # e.g., 'Espandi'
        content = content.replace(f"'{it}'", f"(settings.language === 'en' ? '{en}' : '{it}')")
        content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')

    if content != original_content:
        # Verify hook import is there
        if 'useSettings' not in content:
            if 'import React' in content:
                content = re.sub(r'import React(.*?);', r"import React\1;\nimport { useSettings } from '../contexts/SettingsContext';", content, count=1)
            else:
                content = "import { useSettings } from '../contexts/SettingsContext';\n" + content
            
            content = re.sub(r'const (\w+)[\s]*[:][\s]*React\.FC[^=]*=[\s]*\(([^)]*)\)[\s]*=>[\s]*\{', r"const \1: React.FC<any> = (\2) => {\n  const { settings } = useSettings();", content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

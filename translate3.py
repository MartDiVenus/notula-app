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

replacements = {
    # CalendarView
    "Nessun memo in questo mese": "No memos this month",
    "Lunedì": "Monday", "Martedì": "Tuesday", "Mercoledì": "Wednesday", "Giovedì": "Thursday", 
    "Venerdì": "Friday", "Sabato": "Saturday", "Domenica": "Sunday",
    "Oggi": "Today",
    
    # MemoFormModal
    "Aggiungi un nuovo Memo": "Add a new Memo",
    "Modifica Memo": "Edit Memo",
    "Data": "Date",
    "Titolo": "Title",
    "Contenuto": "Content",
    "Livello di Priorità": "Priority Level",
    "Bassa (Verde)": "Low (Green)",
    "Media (Gialla)": "Medium (Yellow)",
    "Alta (Rossa)": "High (Red)",
    "Memo Ricorrente (ripeti ogni anno)": "Recurring Memo (repeat yearly)",
    "Proteggi questo memo": "Protect this memo",
    "Richiede password per la lettura": "Requires password to read",
    "Annulla": "Cancel",
    "Salva Memo": "Save Memo",
    "Salvataggio...": "Saving...",
    "Memo Privato (Cifrato)": "Private Memo (Encrypted)",
    
    # ListSubmenu
    "Elenco Completo Memo": "Complete Memo List",
    "Includi Memo Ricorrenti": "Include Recurring Memos",
    "Nascondi Memo Scaduti": "Hide Expired Memos",
    "Ordinamento:": "Sort by:",
    "Cronologico": "Chronological",
    "Alfabetico (A-Z)": "Alphabetical (A-Z)",
    "Alfabetico (Z-A)": "Alphabetical (Z-A)",
    "Priorità (Alta-Bassa)": "Priority (High-Low)",
    "Nessun memo trovato.": "No memos found.",
    "Chiudi": "Close",
    
    # ExportModal
    "Esporta Memo": "Export Memos",
    "Scegli il formato di esportazione per i tuoi promemoria.": "Choose the export format for your memos.",
    "Tutti i memo esportati.": "All memos exported.",
    "Esportazione singola:": "Single export:",
    "Esporta tutto in JSON": "Export all as JSON",
    "Backup completo (tutti i memo, inclusi quelli cifrati). Ottimo per migrazioni.": "Full backup (all memos, including encrypted). Great for migrations.",
    "Esporta tutto in XML": "Export all as XML",
    "Formato strutturato XML. Utile per software gestionali.": "Structured XML format. Useful for management software.",
    "Esporta in iCalendar (.ics)": "Export to iCalendar (.ics)",
    "Formato standard per calendari (Google Calendar, Apple, Outlook).": "Standard format for calendars (Google Calendar, Apple, Outlook).",
    "Esporta in Markdown (.md)": "Export to Markdown (.md)",
    "Formato testuale leggibile, ideale per Obsidian o Notion.": "Readable text format, ideal for Obsidian or Notion.",
    "Stampa / PDF": "Print / PDF",
    "Genera un documento formattato pronto per la stampa o il salvataggio in PDF.": "Generate a formatted document ready for printing or saving as PDF.",
    
    # InfoGuideModal
    "Informazioni & Supporto": "Info & Support",
    "Autore & Info": "Author & Info",
    "Installazione": "Installation",
    "Guida": "Guide",
    
    # CloudSyncModal
    "Sincronizzazione Google™ Drive": "Google™ Drive Sync",
    "Connetti con Google": "Connect with Google",
    "Disconnetti": "Disconnect",
    "Stato:": "Status:",
    "Connesso come": "Connected as",
    "Non connesso": "Not connected",
    "Sincronizza Ora": "Sync Now",
    "Backup automatico dei memo sul tuo Google Drive privato.": "Automatic backup of memos on your private Google Drive."
}

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file), replacements)

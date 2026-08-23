import os
import re

dict_translations = {
    # Tooltips / titles
    "Accetta tutte le modifiche in arrivo per tutti i conflitti [Tasto A]": "Accept all incoming changes for all conflicts [Key A]",
    "Apri Manuale Ufficiale CLI (LaTeX / Reference)": "Open Official CLI Manual (LaTeX / Reference)",
    "Apri Terminale CLI (Ctrl+Shift+P)": "Open CLI Terminal (Ctrl+Shift+P)",
    "Chiudi (Esc)": "Close (Esc)",
    "Chiudi Manuale": "Close Manual",
    "Chiudi terminale (Esc)": "Close terminal (Esc)",
    "Conserva la versione locale e ignora questa in arrivo [Tasto I / Esc]": "Keep local version and ignore this incoming one [Key I / Esc]",
    "Conserva la versione locale e importa la nuova come copia con nuovo ID [Tasto M]": "Keep local version and import the new one as a copy with new ID [Key M]",
    "Copia comando": "Copy command",
    "Copia sintassi": "Copy syntax",
    "Crea Nuovo Memo (o seleziona un giorno dal calendario)": "Create New Memo (or select a day from the calendar)",
    "Digita o cambia Anno": "Type or change Year",
    "Elimina": "Delete",
    "Elimina memo": "Delete memo",
    "Esporta singolo memo": "Export single memo",
    "Genera & Esporta Documento PDF": "Generate & Export PDF Document",
    "Genera & Esporta Scheda PDF": "Generate & Export PDF Card",
    "Giorno Odierno": "Today",
    "Informazioni Autore (Ing. Mario Fantini), Copyright & Guida Notula": "Author Information (Ing. Mario Fantini), Copyright & Notula Guide",
    "Mese precedente": "Previous month",
    "Mese successivo": "Next month",
    "Modifica": "Edit",
    "Modifica memo": "Edit memo",
    "Mostra nel calendario": "Show in calendar",
    "Nascondi colonna e centra il calendario a tutto schermo": "Hide column and center full-screen calendar",
    "Notula™: Fasti Romani, Uccello Messaggero di Apollo (2 ali) & Stelle di Orientamento - Ing. Mario Fantini": "Notula™: Roman Fasti, Apollo's Messenger Bird (2 wings) & Guiding Stars - Ing. Mario Fantini",
    "Offusca nuovamente": "Obfuscate again",
    "Scarica Sorgente LaTeX (.tex)": "Download LaTeX Source (.tex)",
    "Seleziona Mese": "Select Month",
    "Sovrascrive la versione locale con questa versione in arrivo [Tasto Y]": "Overwrite local version with this incoming version [Key Y]",
    "Stampa / Salva in PDF": "Print / Save as PDF",
    "Svela temporaneamente testo": "Temporarily reveal text",
    "URL ufficiale per l'installazione della Web App (PWA)": "Official URL for Web App (PWA) installation",
    "Vai alla data di oggi (Mese e Giorno corrente)": "Go to today's date (Current Month and Day)",
    "Visualizza nel calendario": "View in calendar",

    # Placeholders
    "Cerca comando, flag o sintassi...": "Search command, flag or syntax...",
    "Conferma nuova passphrase...": "Confirm new passphrase...",
    "Digita comando (es. 'help', 'man', 'edit --id ...', 'export --all --format xml', 'pdf --id ...')...": "Type command (e.g. 'help', 'man', 'edit --id ...', 'export --all --format xml', 'pdf --id ...')...",
    "Digita parole chiave del titolo o contenuto...": "Type title or content keywords...",
    "Es. 2026": "E.g. 2026",
    "Es. n_1724000000-12": "E.g. n_1724000000-12",
    "Es: n_1724000000-12, n_1724000000-34": "E.g. n_1724000000-12, n_1724000000-34",
    "Es. Scadenza assicurazione, Udienza Tribunale, Controllo caldaia...": "E.g. Insurance expiry, Court Hearing, Boiler check...",
    "Inserisci dettagli, note o testo formattato...": "Enter details, notes, or formatted text...",
    "Titolo del memo...": "Memo title...",

    # Seed data
    "Benvenuto in Notula (Memo Puntuale)": "Welcome to Notula (One-time Memo)",
    "Questo è un memo puntuale (non ricorrente). Nel calendario i memo puntuali sono evidenziati con bordi colorati: rosso se scaduto, arancio se oggi, magenta se futuro.": "This is a one-time memo (non-recurring). In the calendar, one-time memos are highlighted with colored borders: red if expired, orange if today, magenta if future.",
    "Notula Backup Automatico (Memo Ricorrente)": "Notula Automatic Backup (Recurring Memo)",
    "Questo è un memo ricorrente. Nel calendario i memo ricorrenti sono evidenziati con pallini colorati.": "This is a recurring memo. In the calendar, recurring memos are highlighted with colored dots.",
    
    # Sidebar Sections
    "Organizzazione": "Organization",
    "INFORMAZIONI E SUPPORTO": "INFORMATION & SUPPORT",
    "Supporto": "Support",
    
    # Other App buttons and texts missed
    "Sincronizza": "Sync",
    "Esporta": "Export",
    "Importa": "Import",
    "Stampa": "Print",
    "Manuale": "Manual",
    "Informazioni": "Information",
    
    # Buttons scattered around
    "Invia (Invio)": "Submit (Enter)",
    "Svela": "Reveal",
    "Nascondi": "Hide",
    "Chiudi": "Close",
    "Nuovo": "New",
    "Salva": "Save",
    "Disconnetti": "Disconnect",
    "Aggiorna Passphrase": "Update Passphrase",
    "Salva Passphrase": "Save Passphrase",
    "Disattiva Passphrase": "Disable Passphrase",
    "Scarica .tex": "Download .tex",
    "Copia File": "Copy File",
    
    "Ricerca terminata": "Search completed",
    "Modifiche salvate": "Changes saved",
    
    # Connessione
    "Connessione ripristinata: avvio sincronizzazione Google™ Drive...": "Connection restored: starting Google™ Drive sync..."
}

def escape_regexp(text):
    return re.escape(text)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content
    
    # Only replace exact strings inside quotes or JSX text. 
    # For tooltips and placeholders it's easier to do: title="Italian" -> title={settings.language === 'en' ? 'English' : 'Italian'}
    for it, en in dict_translations.items():
        # Handle title="..." and placeholder="..." and aria-label="..."
        for attr in ['title', 'placeholder', 'aria-label']:
            attr_pattern = f'{attr}="{it}"'
            new_attr = f'{attr}={{settings.language === "en" ? "{en}" : "{it}"}}'
            content = content.replace(attr_pattern, new_attr)
            
            # single quotes variant
            attr_pattern_sq = f"{attr}='{it}'"
            new_attr_sq = f"{attr}={{settings.language === 'en' ? '{en}' : '{it}'}}"
            content = content.replace(attr_pattern_sq, new_attr_sq)
            
        # Handle >Testo<
        tag_pattern = f'>{it}<'
        new_tag = f'>{{settings.language === "en" ? "{en}" : "{it}"}}<'
        content = content.replace(tag_pattern, new_tag)
        
        # Handle standalone "Testo" in code like console.log or array seeds
        # We need to make sure we don't break existing JS if it's already translated.
        if it in content and f'"{it}"' in content and f'settings.language' not in content[content.find(f'"{it}"') - 30:content.find(f'"{it}"')]:
            # This is risky, let's only do it for seed data specific keys
            if it in ["Benvenuto in Notula (Memo Puntuale)", "Questo è un memo puntuale (non ricorrente). Nel calendario i memo puntuali sono evidenziati con bordi colorati: rosso se scaduto, arancio se oggi, magenta se futuro.", "Notula Backup Automatico (Memo Ricorrente)", "Questo è un memo ricorrente. Nel calendario i memo ricorrenti sono evidenziati con pallini colorati.", "Connessione ripristinata: avvio sincronizzazione Google™ Drive..."]:
                content = content.replace(f"'{it}'", f"(settings.language === 'en' ? '{en}' : '{it}')")
                content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')

    if content != original_content:
        # Check if we need useSettings
        if 'useSettings' not in content:
            if 'import React' in content:
                content = re.sub(r'import React(.*?);', r"import React\1;\nimport { useSettings } from '../contexts/SettingsContext';", content, count=1)
            else:
                content = "import { useSettings } from '../contexts/SettingsContext';\n" + content
            
            # Insert hook 
            content = re.sub(r'const (\w+)[\s]*[:][\s]*React\.FC[^=]*=[\s]*\(([^)]*)\)[\s]*=>[\s]*\{', r"const \1: React.FC<any> = (\2) => {\n  const { settings } = useSettings();", content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

walk_dir('./src')

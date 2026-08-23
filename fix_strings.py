import re
import os

replacements = {
    "Risultati filtrati:": "Filtered results:",
    "Esporta questi": "Export these",
    "memo": "memos",  # careful with this
    "Puntuale": "One-time",
    "Ricorrente": "Recurring",
    "Offuscamento Parziale (Strato 1)": "Partial Obfuscation (Layer 1)",
    "Annulla / Chiudi": "Cancel / Close",
    "Stato Connessione: Non connesso / In attesa": "Connection Status: Not connected / Waiting",
    "in archivio locale • Cartella remota:": "in local archive • Remote folder:",
    "Cifratura Cloud: Disattivata (Plain JSON)": "Cloud Encryption: Disabled (Plain JSON)",
    "Notula utilizza lo standard OAuth 2.0 per accedere in modo sicuro ai tuoi file.": "Notula uses the OAuth 2.0 standard to securely access your files.",
    "Ambito di autorizzazione:": "Authorization scope:",
    "Verifica e Connetti Google™ Drive": "Verify and Connect Google™ Drive",
    "Esporta Dati Notula™": "Export Notula™ Data",
    "Esportazione archivio": "Archive export",
    "SELEZIONA IL FORMATO DI ESPORTAZIONE:": "SELECT EXPORT FORMAT:",
    "Backup Completo": "Complete Backup",
    "Formato dati nativo completo. Ideale per backup, ripristino o migrazione crittografata AES-256.": "Complete native data format. Ideal for backup, restore or AES-256 encrypted migration.",
    "Struttura ad albero gerarchica con tag <notula> e <memo>, compatibile con database e archivi legacy.": "Hierarchical tree structure with <notula> and <memo> tags, compatible with legacy databases and archives.",
    "Testo formattato con intestazioni e metadati per Obsidian, Notion, GitHub o editor Markdown.": "Formatted text with headers and metadata for Obsidian, Notion, GitHub or Markdown editors.",
    "Eventi e scadenze conformi allo standard RFC 5545, importabili in Google™ Calendar, Apple e Outlook.": "Events and deadlines compliant with the RFC 5545 standard, importable into Google™ Calendar, Apple and Outlook.",
    "Scarica .JSON": "Download .JSON",
    "Scarica .XML": "Download .XML",
    "Scarica .MD": "Download .MD",
    "Scarica .ICS": "Download .ICS",
    "Scarica .TXT": "Download .TXT",
    "Google™ Drive Sync Attivo. Clicca per gestire backup e sincronizzazione.": "Google™ Drive Sync Active. Click to manage backup and synchronization.",
    "Imposta Cifratura Forte AES-256 (Clicca per configurare)": "Set Strong AES-256 Encryption (Click to configure)",
    "Attiva Privacy Mode (Sfoca e maschera contenuti)": "Activate Privacy Mode (Blur and mask content)",
    "Disattiva Privacy Mode": "Deactivate Privacy Mode",
    "Tema: dark (Clicca per cambiare)": "Theme: dark (Click to change)",
    "Tema: light (Clicca per cambiare)": "Theme: light (Click to change)",
    "Tema: system (Clicca per cambiare)": "Theme: system (Click to change)",
    "NOTULA™ CLI v2.2 • INTERPRETE COMANDI INGEGNERISTICO": "NOTULA™ CLI v2.2 • ENGINEERING COMMAND INTERPRETER",
    "Ideazione & Sviluppo: Ing. Mario Fantini • https://mariofantini.eu": "Conception & Development: Ing. Mario Fantini • https://mariofantini.eu",
    "Digita 'help' per consultare la guida o 'man' per aprire il Manuale Ufficiale.": "Type 'help' to consult the guide or 'man' to open the Official Manual.",
    "Comandi:": "Commands:",
    "Centro Informazioni & Guida Utente": "Information Center & User Guide",
    "Ideazione, Sviluppo & Proprietà Intellettuale": "Conception, Development & Intellectual Property",
    "Ingegneria del Software • Crittografia Hardware E2E • Algoritmi di Sincronizzazione Google™ Drive-First": "Software Engineering • E2E Hardware Encryption • Google™ Drive-First Synchronization Algorithms",
    "L'applicazione Notula™, comprensiva della sua architettura software, dell'interfaccia a riga di comando (CLI), del motore di sincronizzazione bidirezionale Google™ Drive-First, del sistema di offuscamento multilivello e della crittografia hardware AES-256 GCM, è protetta dalle leggi vigenti in materia di diritto d'autore e proprietà intellettuale (Legge 22 aprile 1941 n. 633 e successive modifiche, nonché convenzioni WIPO/OMPI).": "The Notula™ application, including its software architecture, command-line interface (CLI), Google™ Drive-First bidirectional synchronization engine, multi-level obfuscation system, and hardware AES-256 GCM encryption, is protected by current laws on copyright and intellectual property.",
    "Chiudi Guida": "Close Guide",
    "Installazione Ufficiale": "Official Installation",
    "Installa Notula™ direttamente sul tuo dispositivo per un'esperienza nativa e offline.": "Install Notula™ directly on your device for a native and offline experience.",
    "L'emblema visivo di Notula™ è stato disegnato e concepito dall'Ing. Mario Fantini per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:": "The visual emblem of Notula™ was designed and conceived by Ing. Mario Fantini to combine engineering rigor, temporal orientation and historical memory. It contains no references to commercial logos, but has its roots in the classic archetype of the Roman calendar and communication:",
    "Impegni con una data esatta, contrassegnati da stati cromatici temporali (scaduto, oggi, futuro).": "Commitments with an exact date, marked by temporal chromatic states (expired, today, future).",
    "Canoni, fatture, rinnovi, compleanni o tagliandi con ripetizione giornaliera, settimanale, mensile o annuale.": "Fees, invoices, renewals, birthdays or coupons with daily, weekly, monthly or yearly repetition.",
    "A differenza delle comuni app SaaS commerciali, Notula™ non archivia nulla su server proprietari o database remoti. I dati appartengono solo all'utente.": "Unlike common commercial SaaS apps, Notula™ does not store anything on proprietary servers or remote databases. The data belongs solely to the user.",
    "Funziona sempre, anche in assenza totale di connessione Internet. All'avvio carica istantaneamente l'archivio locale.": "Works always, even in total absence of Internet connection. Instantly loads the local archive on startup.",
    "Modificando un memo ricorrente legato a una serie, tutti gli altri memo della serie collegati da groupID vengono sincronizzati in automatico.": "By modifying a recurring memo linked to a series, all other memos of the series linked by groupID are automatically synchronized.",
    "Interfaccia grafica ad alta reattività con calendario interattivo unita a un potente terminale a riga di comando ingegneristico.": "High reactivity graphical interface with interactive calendar combined with a powerful engineering command line terminal."
}

def escape_regex(s):
    # Escape for regex but allow some flexibility with spaces/newlines
    s = re.escape(s)
    # Replace escaped spaces with \s+ to match varying whitespace
    s = s.replace(r'\ ', r'\s+')
    return s

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for it, en in replacements.items():
        if it == "memo": continue  # handle manually to avoid replacing variable names
        if it in ["Puntuale", "Ricorrente"]: continue

        # We look for the literal string. If it's already in the ternary, we skip or it's fine.
        # Actually it's better to just find >TEXT< or 'TEXT' or "TEXT" or `TEXT` and replace it
        # But some text is split.
        
        # Simple search and replace for strings wrapped in tags or quotes.
        pattern1 = r'>(\s*)' + escape_regex(it) + r'(\s*)<'
        replacement1 = r'>\g<1>{settings.language === "en" ? "' + en.replace('"', '\\"') + r'" : "' + it.replace('"', '\\"') + r'"}\g<2><'
        if re.search(pattern1, content):
            content = re.sub(pattern1, replacement1, content)
            modified = True
            continue

        # Look for it inside quotes
        pattern2 = r'("|\'|`)' + escape_regex(it) + r'\1'
        replacement2 = r'(settings.language === "en" ? \1' + en.replace('"', '\\"') + r'\1 : \1' + it.replace('"', '\\"') + r'\1)'
        if re.search(pattern2, content):
            content = re.sub(pattern2, replacement2, content)
            modified = True
            continue
            
        # Bare string matching if it wasn't caught
        if it in content:
            # Maybe it's inside a ternary already?
            if it not in content.replace(it, ""): # only one occurrence?
                pass
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            print(f"Modified {filepath}")

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))


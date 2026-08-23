import re
import os

dict_replace = {
    "Avviso di Riserva Integrale dei Diritti &amp; Tutela Proprietà Intellettuale": "Full Rights Reservation Notice &amp; Intellectual Property Protection",
    "Copyright &copy; 2026 Ing. Mario Fantini. Tutti i diritti riservati.": "Copyright &copy; 2026 Ing. Mario Fantini. All rights reserved.",
    "L'Emblema Notula™: Radici Storiche, Volatile di Apollo &amp; Astronomia": "The Notula™ Emblem: Historical Roots, Bird of Apollo &amp; Astronomy",
    "in pietra incisa del calendario nell'Antica Roma, su cui venivano scolpite le scadenze legali, le festività e i giorni": "in engraved stone of the calendar in Ancient Rome, on which legal deadlines, holidays and days were carved",
    "1. Cosa Fa Notula™: Lo Schedario Ingegneristico Universale": "1. What Notula™ Does: The Universal Engineering Filing System",
    "Protezione Multi-Strato": "Multi-Layer Protection",
    "2. Peculiarità e Punti di Forza Unici di Notula™": "2. Unique Features and Strengths of Notula™",
    "Sovranità Assoluta sui Dati (Zero Cloud Terzo)": "Absolute Data Sovereignty (Zero Third-Party Cloud)",
    "Architettura Offline-First &amp; Immediata": "Offline-First &amp; Immediate Architecture",
    "Aggiornamento Automatico Ricorrenze (groupID)": "Automatic Recurrence Update (groupID)",
    "Doppia Interfaccia: GUI • CLI": "Dual Interface: GUI • CLI",
    "3. Legenda Visiva del Calendario &amp; Gestione Ricorrenze con groupID": "3. Calendar Visual Legend &amp; Recurrence Management with groupID",
    "Bordo Rosso:": "Red Border:",
    "Scaduto (la data è già passata).": "Expired (the date has already passed).",
    "Bordo Arancione:": "Orange Border:",
    "In scadenza Oggi.": "Expiring Today.",
    "Bordo Magenta/Viola:": "Magenta/Purple Border:",
    "Scadenza futura nel mese.": "Future expiration in the month.",
    "• Verde:": "• Green:",
    "Ricorrente Annuale / Mensile.": "Yearly / Monthly Recurring.",
    "• Blu:": "• Blue:",
    "Ricorrente Settimanale / Giornaliero.": "Weekly / Daily Recurring.",
    "• Viola:": "• Purple:",
    "Con Cifratura AES-256 attiva.": "With AES-256 Encryption active.",
    "automaticamente a tutti i memo collegati": "automatically to all linked memos",
    "Strato 1: Parziale": "Layer 1: Partial",
    "Strato 2: Totale": "Layer 2: Total",
    "Strato 3: AES-256": "Layer 3: AES-256",
    "4. I 3 Strati di Sicurezza Notula™ &amp; Gestione Passphrase": "4. The 3 Security Layers of Notula™ &amp; Passphrase Management",
    "La Master Passphrase può essere modificata liberamente in qualsiasi momento:": "The Master Passphrase can be changed freely at any time:",
    "Dall'Interfaccia Grafica:": "From the Graphical Interface:",
    "Clicca sul pulsante": "Click the button",
    "Modifica / Cambia Passphrase": "Edit / Change Passphrase",
    "nella barra in alto &rarr; nel riquadro": "in the top bar &rarr; in the box",
    "Aggiorna Passphrase": "Update Passphrase",
    "inserisci la nuova parola chiave &rarr; clicca": "enter the new keyword &rarr; click",
    "Da Terminale CLI:": "From CLI Terminal:",
    "Apri il terminale (": "Open the terminal (",
    ") e digita:": ") and type:",
    "Effetto:": "Effect:",
    "La nuova passphrase viene impiegata per tutti i nuovi salvataggi, cifrature locali ed esportazioni protette.": "The new passphrase is used for all new saves, local encryptions, and protected exports.",
    "5. Esportazioni Multiformato (JSON, XML, MD, ICS, PDF, TXT)": "5. Multiformat Exports (JSON, XML, MD, ICS, PDF, TXT)",
    "Scheda testuale pura leggibile da qualsiasi dispositivo senza software aggiuntivo.": "Pure textual card readable from any device without additional software.",
    "conforme per software documentali e archivi aziendali.": "compliant for document software and corporate archives.",
    "Scheda ufficiale Notula™ impaginata per la stampa su carta o archiviazione PDF a zero consumo d'inchiostro.": "Official Notula™ card typeset for paper printing or zero-ink PDF archiving.",
    "6. Sincronizzazione Google™ Drive: Indipendenza Totale dal Dispositivo": "6. Google™ Drive Sync: Total Device Independence",
    "Notula™ Cloud Sync &bull; Google™ Drive API v3": "Notula™ Cloud Sync &bull; Google™ Drive API v3",
    "accesso ristretto alla sola cartella": "restricted access only to folder",
    "del tuo account Google™. Questo significa che:": "of your Google™ account. This means that:",
    "Gestione Conflitti Intelligente:": "Intelligent Conflict Management:",
    "In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità (Sostituisci [Y], Ignora [I], Duplica entrambi [M] o Applica a tutti [A]).": "In case of divergence between local memory and Google™ Drive, Notula™ allows you to easily resolve the conflict (Replace [Y], Ignore [I], Duplicate both [M] or Apply to all [A]).",
    "7. Funzionalità Quotidiane &amp; Scorciatoie Pratiche": "7. Daily Features &amp; Practical Shortcuts",
    "Scorciatoie da tastiera:": "Keyboard shortcuts:",
    "Navigazione Rapida • Tasto (Oggi)": "Quick Navigation • Key (Today)",
    "Filtri Parametrici:": "Parametric Filters:",
    "nella barra laterale o nel sottomenu Elenco per scegliere tra:": "in the sidebar or in the List submenu to choose between:",
    "8. Terminale CLI per Utenti Avanzati &amp; Power Users": "8. CLI Terminal for Advanced &amp; Power Users",
    "Per ingegneri, amministratori di sistema e amanti della tastiera, Notula™ include una shell interattiva completa con supporto a comandi per creazione,": "For engineers, sysadmins, and keyboard lovers, Notula™ includes a full interactive shell with support for commands for creation,",
    "e": "and",
    "Sintassi Formale:": "Formal Syntax:",
    "Specifica Ingegneristica &amp; Riferimento Sintattico dei Comandi Shell": "Engineering Specification &amp; Syntax Reference of Shell Commands",
    "L'Uccello Messaggero di Apollo": "The Messenger Bird of Apollo",
    "Si rimanda al file": "Please refer to the file",
    "Tabula": "Tabula",
    "Fasti": "Fasti",
    "Nefasti": "Nefasti",
    "Come funziona il cambio della Passphrase in Notula:": "How changing the Passphrase works in Notula:",
    "Se cambi computer o formatti il dispositivo,": "If you change computers or format the device,",
    "non perdi nulla": "you don't lose anything",
    ": basta ricollegare il tuo account Google™ Drive e inserire la tua Master Passphrase.": ": simply reconnect your Google™ Drive account and enter your Master Passphrase.",
    "Master Password attiva: il file verrà cifrato con AES-256-GCM.": "Master Password active: the file will be encrypted with AES-256-GCM.",
    "Scorciatoia: Ctrl+Shift+P": "Shortcut: Ctrl+Shift+P",
    "Nota Architetturale Ingegneristica:": "Engineering Architectural Note:",
    "Tavoletta dei Fasti Romani": "Tablet of the Roman Fasti",
    "Stelle di Orientamento": "Guiding Stars",
    "Scadenze Puntuali": "One-time Deadlines",
    "Ricorrenze Perpetue": "Perpetual Recurrences",
    "Struttura universale gerarchica": "Universal hierarchical structure",
    "è una piattaforma avanzata per la gestione temporale di promemoria, scadenze critiche, adempimenti legali/fiscali, progetti professionali e note personali protette.": "is an advanced platform for the time management of reminders, critical deadlines, legal/tax compliances, professional projects and protected personal notes.",
    "Progressive Web App (PWA)": "Progressive Web App (PWA)",
    "Installa Web App": "Install Web App",
    "Pronto per la compilazione con": "Ready to compile with",
    "per generare il PDF accademico a stampa perfetta.": "to generate the perfectly printed academic PDF.",
    "Invia": "Submit"
}

# Add words from the CLI Manual
cli_manual = {
    "Riferimento Comandi &amp; Sintassi": "Command Reference &amp; Syntax",
    "Creare e Gestire Memo": "Creating and Managing Memos",
    "Esportazioni": "Exports",
    "Sincronizzazione": "Synchronization",
    "Parametri di Rimozione": "Removal Parameters",
    "Parametri &amp; Opzioni:": "Parameters &amp; Options:",
    "Apre la finestra di dialogo grafica per selezionare file .json o .xml": "Opens the graphical dialog to select .json or .xml files",
    "Genera e scarica all'istante il PDF A4 Ink-Friendly": "Instantly generates and downloads the A4 Ink-Friendly PDF",
    "Esporta singolo memo nel formato indicato": "Exports single memo in the specified format",
    "Esporta l'intero archivio": "Exports the entire archive",
    "Esporta scadenze dell'anno in iCalendar (.ics)": "Exports yearly deadlines in iCalendar (.ics)",
    "Importa XML da testo": "Imports XML from text",
    "Importa array JSON da testo": "Imports JSON array from text",
    "Elimina singolo memo per ID": "Deletes single memo by ID",
    "Elimina per corrispondenza del titolo": "Deletes by title match",
    "Elimina l'intera serie ricorrente legata da groupID": "Deletes the entire recurring series linked by groupID",
    "Elimina tutti i memo scaduti": "Deletes all expired memos",
    "Elimina TUTTI i memo (pulizia totale)": "Deletes ALL memos (total cleanup)",
    "Modifica/imposta Master Passphrase AES-256": "Edits/sets AES-256 Master Passphrase",
    "Avvia sincronizzazione da Google™ Drive": "Starts synchronization from Google™ Drive",
    "Diagnostica di connessione Google™ Drive": "Google™ Drive connection diagnostics",
    "Mostra tutti i memo presenti": "Shows all present memos",
    "Filtra per anno (solo puntuali)": "Filters by year (one-time only)",
    "Mostra esclusivamente i memo scaduti": "Shows exclusively expired memos",
    "Mostra tutti i memo della serie collegata": "Shows all linked series memos",
    "Ricerca testuale rapida": "Quick text search",
    "Scheda diagnostica completa con groupID": "Complete diagnostic card with groupID",
    "Singola scadenza": "Single deadline",
    "Ricorrente cifrato AES-256": "AES-256 encrypted recurring",
    "Modifica memo (aggiorna in automatico tutti i memo con lo stesso groupID)": "Edits memo (automatically updates all memos with the same groupID)",
}

dict_replace.update(cli_manual)

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in dict_replace.items():
        # Match exactly >text< or > text < or variations
        pattern = r'>(\s*)' + re.escape(it) + r'(\s*)<'
        new_tag = r'>\g<1>{settings.language === "en" ? "' + en + r'" : "' + it + r'"}\g<2><'
        content = re.sub(pattern, new_tag, content)
        
        # Or match if it's not wrapped in a tag but is a plain string
        # content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('./src/components/InfoGuideModal.tsx')
fix_file('./src/components/CliManualModal.tsx')
fix_file('./src/components/CalendarView.tsx')
fix_file('./src/components/ListSubmenu.tsx')
fix_file('./src/components/DeleteSubmenu.tsx')


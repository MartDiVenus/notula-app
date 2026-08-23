import re
import os

replacements = {
    "📖 Apertura del Manuale Ufficiale NOTULA™ CLI v2.2 (Edizione Ingegneristica)...": "📖 Opening Official NOTULA™ CLI v2.2 Manual (Engineering Edition)...",
    "  GUIDA COMPLETA COMANDI NOTULA™ CLI (Ing. Mario Fantini)": "  NOTULA™ CLI COMPLETE COMMAND GUIDE (Ing. Mario Fantini)",
    "1. CREAZIONE MEMO:": "1. MEMO CREATION:",
    "   • Default (memo puntuale singolo): add --title \"Revisione\" --date 2026-09-01": "   • Default (single one-time memo): add --title \"Revisione\" --date 2026-09-01",
    "   • Ricorrente (ripetizione per N giorni): add --title \"Revisione\" --date 2026-09-01 --repeat 10": "   • Recurring (repeats for N days): add --title \"Revisione\" --date 2026-09-01 --repeat 10",
    "   • Esempio cifrato: add --title \"Udienza Tribunale\" --date 2026-09-15 --desc \"Fascicolo 401\" --encrypt": "   • Encrypted example: add --title \"Udienza Tribunale\" --date 2026-09-15 --desc \"Fascicolo 401\" --encrypt",
    "2. MODIFICA & AGGIORNAMENTO (edit):": "2. EDIT & UPDATE (edit):",
    "   Esempio: edit --id n_123 --title \"Udienza Rinviata\" --date 2026-10-02": "   Example: edit --id n_123 --title \"Udienza Rinviata\" --date 2026-10-02",
    "   (Nota: la modifica sincronizza AUTOMATICAMENTE tutti i memo collegati dallo stesso groupID!)": "   (Note: editing AUTOMATICALLY syncs all memos linked by the same groupID!)",
    "3. ESPORTAZIONE MULTIFORMATO (export):": "3. MULTIFORMAT EXPORT (export):",
    "   export --id <id> --format json|xml|md|ics|pdf|txt   -> Esporta singolo memo nel formato indicato": "   export --id <id> --format json|xml|md|ics|pdf|txt   -> Export single memo in the specified format",
    "   export --all --format json|xml|md|ics|txt           -> Esporta l'intero archivio nel formato indicato": "   export --all --format json|xml|md|ics|txt           -> Export entire archive in the specified format",
    "   export --year YYYY --format ics                     -> Esporta il calendario per Google™ Calendar / Outlook": "   export --year YYYY --format ics                     -> Export calendar for Google™ Calendar / Outlook",
    "   pdf --id <id>                                       -> Scorciatoia per generare e scaricare subito il PDF A4": "   pdf --id <id>                                       -> Shortcut to generate and instantly download the A4 PDF",
    "4. IMPORTAZIONE DATI (import):": "4. DATA IMPORT (import):",
    "   import --json '[{\"title\":\"...\", \"expirationDate\":\"2026-09-01\"}]' -> Importa JSON da testo": "   import --json '[{\"title\":\"...\", \"expirationDate\":\"2026-09-01\"}]' -> Import JSON from text",
    "   import --xml '<notula><memos>...</memos></notula>'  -> Importa XML da testo": "   import --xml '<notula><memos>...</memos></notula>'  -> Import XML from text",
    "   import                                             -> Apre il selettore file grafico per importare .json o .xml": "   import                                             -> Opens graphic file selector to import .json or .xml",
    "5. RICERCA E LISTE (ls / find):": "5. SEARCH AND LISTS (ls / find):",
    "   ls                                                  -> Mostra tutti i memo presenti": "   ls                                                  -> Shows all present memos",
    "   ls --year YYYY                                      -> Filtra per anno (solo puntuali)": "   ls --year YYYY                                      -> Filters by year (one-time only)",
    "   ls --expired                                        -> Mostra esclusivamente i memo scaduti": "   ls --expired                                        -> Shows exclusively expired memos",
    "   ls --group <groupID>                                -> Mostra tutti i memo della serie collegata": "   ls --group <groupID>                                -> Shows all memos of the linked series",
    "   find --title \"<testo>\"                              -> Ricerca testuale rapida": "   find --title \"<testo>\"                              -> Quick textual search",
    "   info <id>                                           -> Scheda diagnostica completa con groupID e dettagli AES-256": "   info <id>                                           -> Complete diagnostic card with groupID and AES-256 details",
    "6. ELIMINAZIONE MEMO (rm):": "6. MEMO DELETION (rm):",
    "   rm --id <id>                                        -> 1. Elimina singolo memo per ID": "   rm --id <id>                                        -> 1. Delete single memo by ID",
    "   rm --title \"<testo>\"                                -> Elimina per corrispondenza del titolo": "   rm --title \"<testo>\"                                -> Delete by title match",
    "   rm --group <groupID>                                -> Elimina l'intera serie ricorrente legata da groupID": "   rm --group <groupID>                                -> Delete the entire recurring series linked by groupID",
    "   rm --expired                                        -> Elimina tutti i memo scaduti": "   rm --expired                                        -> Delete all expired memos",
    "   rm --all                                            -> Elimina TUTTI i memo (pulizia totale)": "   rm --all                                            -> Delete ALL memos (total cleanup)",
    "7. SICUREZZA E PRIVACY (passwd):": "7. SECURITY AND PRIVACY (passwd):",
    "   passwd <nuova_passphrase>                           -> Modifica/imposta Master Passphrase AES-256": "   passwd <nuova_passphrase>                           -> Edit/set AES-256 Master Passphrase",
    "8. SINCRONIZZAZIONE (sync):": "8. SYNCHRONIZATION (sync):",
    "   sync                                                -> Avvia sincronizzazione da Google™ Drive": "   sync                                                -> Start synchronization from Google™ Drive",
    "9. DIAGNOSTICA DI RETE (ping):": "9. NETWORK DIAGNOSTICS (ping):",
    "   ping                                                -> Diagnostica di connessione Google™ Drive": "   ping                                                -> Google™ Drive connection diagnostics",
    "10. ALTRO:": "10. OTHER:",
    "   clear                                               -> Pulisce il terminale": "   clear                                               -> Clears the terminal",
    "   exit / quit                                         -> Chiude la shell CLI": "   exit / quit                                         -> Closes the CLI shell",
    "Comando 'edit' ignorato (ID mancante). Sintassi corretta:": "Command 'edit' ignored (Missing ID). Correct syntax:",
    "Esportazione PDF annullata (ID mancante).": "PDF export canceled (Missing ID).",
    "Comando 'import' ignorato.": "Command 'import' ignored.",
    "Comando 'ls' non riconosciuto o parametri errati.": "Command 'ls' not recognized or incorrect parameters.",
    "Comando 'find' ignorato (titolo mancante).": "Command 'find' ignored (missing title).",
    "Comando 'info' ignorato (ID mancante).": "Command 'info' ignored (missing ID).",
    "Comando 'rm' non riconosciuto (specificare opzione).": "Command 'rm' not recognized (specify option).",
    "Comando 'passwd' ignorato. Specificare la nuova password.": "Command 'passwd' ignored. Specify the new password.",
    "Richiesta di sincronizzazione inviata...": "Synchronization request sent...",
    "Connettività API Google™... OK!": "Google™ API Connectivity... OK!",
    "Schermo pulito.": "Screen cleared.",
    "Chiusura del terminale...": "Closing the terminal...",
    "Nessun ID specificato.": "No ID specified.",
    "Nessun memo trovato con i criteri forniti.": "No memo found with the provided criteria.",
    "Trovati": "Found",
    "memo corrispondenti:": "matching memos:",
    "Memo non trovato.": "Memo not found.",
    "--- SCHEDA INFORMATIVA MEMO ---": "--- MEMO INFO CARD ---",
    "Data Creazione (ISO):": "Creation Date (ISO):",
    "ID Gruppo (Serie):": "Group ID (Series):",
    "Non parte di una serie": "Not part of a series",
    "Ripetizione:": "Repetition:",
    "Testo (Offuscato o Cifrato)": "Text (Obfuscated or Encrypted)",
    "Nessuna nota aggiuntiva": "No additional notes",
    "Si (Crittografia abilitata per questo memo)": "Yes (Encryption enabled for this memo)",
    "No": "No",
    "--- FINE SCHEDA ---": "--- END CARD ---",
    "Nuova Passphrase impostata (non dimenticarla!). I successivi salvataggi saranno cifrati.": "New Passphrase set (do not forget it!). Subsequent saves will be encrypted.",
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in replacements.items():
        pattern = f'log("{it}");'
        new_tag = f'log(settings.language === "en" ? "{en}" : "{it}");'
        content = content.replace(pattern, new_tag)

        pattern2 = f'log("{it}"'
        new_tag2 = f'log(settings.language === "en" ? "{en}" : "{it}"'
        content = content.replace(pattern2, new_tag2)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
fix_file('./src/components/TerminalCLI.tsx')

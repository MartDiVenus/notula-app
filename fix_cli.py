import re
import os

replacements = {
    "Digita 'help' per visualizzare tutti i comandi disponibili.": "Type 'help' to see all available commands.",
    "Terminale impostato a schermo intero.": "Terminal set to full screen.",
    "Terminale ripristinato in finestra standard.": "Terminal restored to standard window.",
    "Apertura del Manuale Ufficiale NOTULA™ CLI": "Opening NOTULA™ CLI Official Manual",
    "GUIDA COMPLETA COMANDI NOTULA™ CLI": "NOTULA™ CLI COMPLETE COMMAND GUIDE",
    "CREAZIONE MEMO:": "MEMO CREATION:",
    "Default (memo puntuale singolo):": "Default (single one-time memo):",
    "Ricorrente (ripetizione per N giorni):": "Recurring (repeats for N days):",
    "Esempio cifrato:": "Encrypted example:",
    "MODIFICA & AGGIORNAMENTO (edit):": "EDIT & UPDATE (edit):",
    "Esempio: edit": "Example: edit",
    "Nota: la modifica sincronizza AUTOMATICAMENTE tutti i memo": "Note: editing AUTOMATICALLY syncs all memos",
    "ESPORTAZIONE MULTIFORMATO (export):": "MULTIFORMAT EXPORT (export):",
    "Esporta in JSON (tutto):": "Export to JSON (all):",
    "Esporta in CSV (solo un mese):": "Export to CSV (one month only):",
    "Esporta singolo in MD:": "Export single to MD:",
    "Esporta tutti gli eventi in ICS:": "Export all events to ICS:",
    "Esporta backup offline codificato:": "Export encoded offline backup:",
    "GENERAZIONE PDF (pdf):": "PDF GENERATION (pdf):",
    "Genera scheda A4 stilizzata del memo": "Generate stylized A4 card of the memo",
    "ELIMINAZIONE (rm):": "DELETION (rm):",
    "Rimuovi singolo memo": "Remove single memo",
    "Rimuovi tutti i memo scaduti": "Remove all expired memos",
    "Rimuovi TUTTI i memo": "Remove ALL memos",
    "Rimuove tutti i memo di quel giorno": "Removes all memos of that day",
    "IMPORTAZIONE (import):": "IMPORT (import):",
    "Sincronizza manualmente da Drive": "Sync manually from Drive",
    "ALTRI COMANDI:": "OTHER COMMANDS:",
    "Pulisce lo schermo": "Clears the screen",
    "Esci dal terminale": "Exit the terminal",
    "Comando sconosciuto": "Unknown command",
    "Sei in modalità 'Puntuale'.": "You are in 'One-time' mode.",
    "Comando 'edit' ignorato": "Command 'edit' ignored",
}

def fix_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for it, en in replacements.items():
        # Specifically inside log("...")
        # Since log() is used in terminal, let's just do a simple replacement
        # log("Italian") -> log(settings.language === 'en' ? "English" : "Italian")
        # We need to make sure we don't break template literals.
        pattern1 = f'log("{it}");'
        new_tag1 = f'log(settings.language === "en" ? "{en}" : "{it}");'
        content = content.replace(pattern1, new_tag1)
        
        pattern2 = f'log("{it}"'
        new_tag2 = f'log(settings.language === "en" ? "{en}" : "{it}"'
        content = content.replace(pattern2, new_tag2)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

fix_file('./src/components/TerminalCLI.tsx')

import os
import re

def safe_replace(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in replacements.items():
        # Only replace exact exact string matching if not already in `{settings.language`
        # Because we're parsing JSX, it's safer to use python's string replace for specific cases
        content = content.replace(f'>{it}<', f'>{{settings.language === "en" ? "{en}" : "{it}"}}<')
        content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')
        content = content.replace(f"'{it}'", f"(settings.language === 'en' ? '{en}' : '{it}')")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = {
    # DeleteSubmenu
    "Seleziona una delle 9 modalità di rimozione memo": "Select one of the 9 memo removal modes",
    "Esegui Eliminazione": "Execute Deletion",
    # TerminalCLI
    "Manuale CLI": "CLI Manual",
    "Invio": "Enter",
    # CloudSyncModal
    "Salvataggio automatico trasparente su Google™ Drive e download remoto": "Transparent automatic save on Google™ Drive and remote download",
    "Consigliata": "Recommended",
    "Integrazione Google™ Drive API": "Google™ Drive API Integration",
    "Sincronizzazione Automatica": "Automatic Synchronization",
    # SecurityModal
    "Offuscamento Rapido a Schermo": "Quick On-Screen Obfuscation",
    # CalendarView
    "Legenda Grafica": "Graphic Legend",
    "Svela": "Reveal",
    "Offusca": "Obfuscate",
    # MemoFormModal
    "Ricorrenza": "Recurrence",
    # SearchSubmenu
    "Solo Ricorrenti": "Only Recurring",
    "Solo Scaduti": "Only Expired",
    "Calendario": "Calendar",
    # ConflictModal
    "Risoluzione Conflitto di Sincronizzazione": "Synchronization Conflict Resolution",
    "Nessuna descrizione": "No description",
    # PrintModal
    "Data Scadenza": "Expiration Date",
    "Tipologia": "Type",
    "Offuscamento": "Obfuscation",
    "Crittografia Hardware": "Hardware Encryption",
    "Data Creazione": "Creation Date",
    "Gruppo Correlato": "Related Group",
    # InfoGuideModal
    "Installa Web App": "Install Web App",
    "Tavoletta dei Fasti Romani": "Tablet of the Roman Fasti",
    "Stelle di Orientamento": "Guiding Stars",
    "Scadenze Puntuali": "One-time Deadlines",
    "Ricorrenze Perpetue": "Perpetual Recurrences",
    "Come e Quando Cambiare la Master Passphrase": "How and When to Change the Master Passphrase",
    "Modalità Privacy Istantanea": "Instant Privacy Mode",
    "Eliminazione Mirata e Pulizia": "Targeted Deletion and Cleanup",
    "Apri Manuale Ufficiale CLI": "Open Official CLI Manual",
    "Consulta Manuale Completo": "Consult Full Manual"
}

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            safe_replace(os.path.join(root, file), replacements)

import os
import re

replacements = {
    "Seleziona una delle 9 modalità di rimozione memo": "Select one of the 9 memo removal modes",
    "Esegui Eliminazione": "Execute Deletion",
    "Manuale CLI": "CLI Manual",
    "Invio": "Enter",
    "Salvataggio automatico trasparente su Google™ Drive e download remoto": "Transparent automatic save on Google™ Drive and remote download",
    "Disconnetti": "Disconnect",
    "Consigliata": "Recommended",
    "Integrazione Google™ Drive API": "Google™ Drive API Integration",
    "Sincronizzazione Automatica": "Automatic Synchronization",
    "Chiudi": "Close",
    "Offuscamento Rapido a Schermo": "Quick On-Screen Obfuscation",
    "Oggi": "Today",
    "Legenda Grafica": "Graphic Legend",
    "Svela": "Reveal",
    "Offusca": "Obfuscate",
    "Ricorrenza": "Recurrence",
    "Solo Ricorrenti": "Only Recurring",
    "Solo Scaduti": "Only Expired",
    "Calendario": "Calendar",
    "Stampa / PDF": "Print / PDF",
    "Risoluzione Conflitto di Sincronizzazione": "Synchronization Conflict Resolution",
    "Nessuna descrizione": "No description",
    "Data Scadenza": "Expiration Date",
    "Tipologia": "Type",
    "Offuscamento": "Obfuscation",
    "Crittografia Hardware": "Hardware Encryption",
    "Data Creazione": "Creation Date",
    "Gruppo Correlato": "Related Group",
    "Autore, Contatti, Copyright": "Author, Contacts, Copyright",
    "Installazione, Emblema": "Installation, Emblem",
    "Guida Funzionale, Manuale d'Uso": "Functional Guide, Manual",
    "Installa Web App": "Install Web App",
    "Tavoletta dei Fasti Romani": "Tablet of the Roman Fasti",
    "Stelle di Orientamento": "Guiding Stars",
    "Scadenze Puntuali": "One-time Deadlines",
    "Ricorrenze Perpetue": "Perpetual Recurrences",
    "Come e Quando Cambiare la Master Passphrase": "How and When to Change the Master Passphrase",
    "Modalità Privacy Istantanea": "Instant Privacy Mode",
    "Eliminazione Mirata e Pulizia": "Targeted Deletion and Cleanup",
    "Apri Manuale Ufficiale CLI": "Open Official CLI Manual",
    "Consulta Manuale Completo": "Consult Full Manual",
    
    # from App.tsx
    "Cerca (Data/Titolo/ID)": "Search (Date/Title/ID)",
    "Elenco Memo (a-g)": "Memo List (a-g)",
    "Elimina Memo (1-9)": "Delete Memo (1-9)",
    "Importa File (JSON / XML)": "Import File (JSON / XML)",
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for it, en in replacements.items():
        # Replace the broken EN_REPLACED with actual english string if the italian matches
        content = content.replace(f'{{settings.language === "en" ? "EN_REPLACED" : "{it}"}}', f'{{settings.language === "en" ? "{en}" : "{it}"}}')
        content = content.replace(f'(settings.language === "en" ? "EN_REPLACED" : "{it}")', f'(settings.language === "en" ? "{en}" : "{it}")')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

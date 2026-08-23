import re
import os

dict_replace = {
    "1. Per Titolo / Testo": "1. By Title / Text",
    "2. Per Data": "2. By Date",
    "3. Per IDs": "3. By IDs",
    "Titolo esatto da cancellare:": "Exact title to delete:",
    "ID Memo (separati da virgola se multipli):": "Memo IDs (comma-separated if multiple):",
    "Giorno:": "Day:",
    "Mese:": "Month:",
    "Anno:": "Year:",
    "Annuale (Ricorrente ogni anno)": "Yearly (Recurring every year)",
    "Mensile (Ricorrente ogni mese)": "Monthly (Recurring every month)",
    "Settimanale (Ricorrente ogni settimana)": "Weekly (Recurring every week)",
    "Giornaliero (Ricorrente ogni giorno)": "Daily (Recurring every day)",
    "Puntuale (Non ricorrente)": "One-time (Non-recurring)",
    "Nessuno (Testo in chiaro)": "None (Plain text)",
    "Offuscamento (Privacy)": "Obfuscation (Privacy)",
    "Salva su Google™ Drive ad ogni aggiunta/modifica/eliminazione": "Save to Google™ Drive on every add/edit/delete",
    "Nessuna descrizione o nota aggiuntiva.": "No description or additional note.",
    "Offuscamento:": "Obfuscation:",
    "Scadenza:": "Expiration:",
    "Strato 1: Parziale": "Layer 1: Partial",
    "Strato 2: Totale": "Layer 2: Total",
    "Strato 3: AES-256": "Layer 3: AES-256",
    "Strato 1: Parziale (•••)": "Layer 1: Partial (•••)",
    "Strato 2: Totale (••••••••)": "Layer 2: Total (••••••••)",
    "Come funziona il cambio?": "How does the change work?",
    "Sì, la passphrase si può cambiare in qualunque momento:": "Yes, the passphrase can be changed at any time:",
    "La nuova passphrase viene impiegata per tutti i nuovi salvataggi, cifrature locali ed esportazioni protette.": "The new passphrase is used for all new saves, local encryptions and protected exports.",
    "Per disattivare temporaneamente la richiesta di cifratura puoi fare clic su ": "To temporarily disable the encryption request you can click on ",
    "Inserendo una nuova passphrase qui sotto o tramite comando CLI ": "By entering a new passphrase below or via CLI command ",
    ", Notula ricalcola istantaneamente le chiavi crittografiche hardware AES-GCM (100.000 iterazioni PBKDF2).": ", Notula instantly recalculates the hardware AES-GCM cryptographic keys (100,000 PBKDF2 iterations).",
    "Prova a cambiare query o selezionare un'altra modalità di ricerca.": "Try changing the query or selecting another search mode.",
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in dict_replace.items():
        pattern = r'>(\s*)' + re.escape(it) + r'(\s*)<'
        new_tag = r'>\g<1>{settings.language === "en" ? "' + en + r'" : "' + it + r'"}\g<2><'
        content = re.sub(pattern, new_tag, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

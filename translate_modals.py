import re
import os

dict_modals = {
    # InfoGuideModal
    "Come funziona il cambio della Passphrase in Notula:": "How changing the Passphrase works in Notula:",
    "Se cambi computer o formatti il dispositivo, ": "If you change computers or format the device, ",
    "non perdi nulla": "you don't lose anything",
    ": basta ricollegare il tuo account Google™ Drive e inserire la tua Master Passphrase.": ": simply reconnect your Google™ Drive account and enter your Master Passphrase.",
    "La Master Passphrase può essere modificata liberamente in qualsiasi momento:": "The Master Passphrase can be changed freely at any time:",
    "Dall'Interfaccia Grafica:": "From the Graphical Interface:",
    " Clicca sul pulsante ": " Click the button ",
    "Modifica / Cambia Passphrase": "Edit / Change Passphrase",
    " nella barra in alto &rarr; nel riquadro ": " in the top bar &rarr; in the box ",
    "Aggiorna Passphrase": "Update Passphrase",
    " inserisci la nuova parola chiave &rarr; clicca ": " enter the new keyword &rarr; click ",
    "Da Terminale CLI:": "From CLI Terminal:",
    " Apri il terminale (": " Open the terminal (",
    ") e digita: ": ") and type: ",
    "Effetto:": "Effect:",
    "La nuova passphrase viene impiegata per tutti i nuovi salvataggi, cifrature locali ed esportazioni protette.": "The new passphrase is used for all new saves, local encryptions, and protected exports.",
    "Sicurezza &amp; Master Passphrase": "Security &amp; Master Passphrase",
    "Le password NON vengono mai trasmesse a nessun server né a Google. Tutto avviene rigorosamente offline nella RAM del tuo browser tramite l'API Web Crypto.": "Passwords are NEVER transmitted to any server or Google. Everything happens strictly offline in your browser's RAM via the Web Crypto API.",
    "Strato 3: Cifratura Forte AES-256 E2E": "Layer 3: Strong AES-256 E2E Encryption",
    "Offuscamento visivo per sguardi indiscreti e cifratura hardware di livello militare AES-256.": "Visual obfuscation for prying eyes and military-grade hardware AES-256 encryption.",
    "Per ingegneri, amministratori di sistema e amanti della tastiera, Notula™ include una shell interattiva completa con supporto a comandi per creazione, ": "For engineers, sysadmins, and keyboard lovers, Notula™ includes a full interactive shell with support for commands for creation, ",
    " e ": " and ",
    "Sintassi Formale:": "Formal Syntax:",
    "Specifica Ingegneristica &amp; Riferimento Sintattico dei Comandi Shell": "Engineering Specification &amp; Syntax Reference of Shell Commands",
    "8. Terminale CLI per Utenti Avanzati &amp; Power Users": "8. CLI Terminal for Advanced &amp; Power Users",
    "7. Funzionalità Quotidiane &amp; Scorciatoie Pratiche": "7. Daily Features &amp; Practical Shortcuts",
    "Scorciatoie da tastiera:": "Keyboard shortcuts:",
    "Navigazione Rapida • Tasto (Oggi)": "Quick Navigation • Key (Today)",
    "Filtri Parametrici:": "Parametric Filters:",
    "nella barra laterale o nel sottomenu Elenco per scegliere tra:": "in the sidebar or in the List submenu to choose between:",
    "6. Sincronizzazione Google™ Drive: Indipendenza Totale dal Dispositivo": "6. Google™ Drive Sync: Total Device Independence",
    "Notula™ Cloud Sync &bull; Google™ Drive API v3": "Notula™ Cloud Sync &bull; Google™ Drive API v3",
    " (accesso ristretto alla sola cartella ": " (restricted access only to folder ",
    "del tuo account Google™. Questo significa che:": "of your Google™ account. This means that:",
    "Gestione Conflitti Intelligente:": "Intelligent Conflict Management:",
    " In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità (Sostituisci [Y], Ignora [I], Duplica entrambi [M] o Applica a tutti [A]).": " In case of divergence between local memory and Google™ Drive, Notula™ allows you to easily resolve the conflict (Replace [Y], Ignore [I], Duplicate both [M] or Apply to all [A]).",
    "5. Esportazioni Multiformato (JSON, XML, MD, ICS, PDF, TXT)": "5. Multiformat Exports (JSON, XML, MD, ICS, PDF, TXT)",
    "Scheda testuale pura leggibile da qualsiasi dispositivo senza software aggiuntivo.": "Pure textual card readable from any device without additional software.",
    "conforme per software documentali e archivi aziendali.": "compliant for document software and corporate archives.",
    "Scheda ufficiale Notula™ impaginata per la stampa su carta o archiviazione PDF a zero consumo d'inchiostro.": "Official Notula™ card typeset for paper printing or zero-ink PDF archiving.",
    "4. I 3 Strati di Sicurezza Notula™ &amp; Gestione Passphrase": "4. The 3 Security Layers of Notula™ &amp; Passphrase Management",
    "Inserendo una nuova passphrase qui sotto o tramite comando CLI ": "By entering a new passphrase below or via CLI command ",
    ", Notula ricalcola istantaneamente le chiavi crittografiche hardware AES-GCM (100.000 iterazioni PBKDF2).": ", Notula instantly recalculates the hardware AES-GCM cryptographic keys (100,000 PBKDF2 iterations).",
    "Master Password attiva: il file verrà cifrato con AES-256-GCM.": "Master Password active: the file will be encrypted with AES-256-GCM.",
    "Scorciatoia: Ctrl+Shift+P": "Shortcut: Ctrl+Shift+P",
    "Per approfondimenti riguardo la proprietà intellettuale (\"Intellectual Property Notice\"), in cui si esplicita che l'architettura software, la logica di parsing e il codice sorgente sono opera proprietaria dell'autore. Manifestazioni di interesse per l'acquisizione completa dei diritti commerciali sono valutabili, previa intesa economica e salvaguardando la paternità storica e morale (Contatto: marfant7@gmail.com).": "For insights regarding intellectual property (\"Intellectual Property Notice\"), where it is stated that the software architecture, parsing logic and source code are the proprietary work of the author. Expressions of interest for the complete acquisition of commercial rights can be evaluated, subject to economic agreement and safeguarding historical and moral authorship (Contact: marfant7@gmail.com).",
    "Nota Architetturale Ingegneristica:": "Engineering Architectural Note:",
    "Tavoletta dei Fasti Romani": "Tablet of the Roman Fasti",
    "Stelle di Orientamento": "Guiding Stars",
    "per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:": "to unite engineering rigor, temporal orientation and historical memory. It contains no references to commercial logos, but has its roots in the classic archetype of the Roman calendar and communication:",
    "Scadenze Puntuali": "One-time Deadlines",
    "Ricorrenze Perpetue": "Perpetual Recurrences",
    "Struttura universale gerarchica": "Universal hierarchical structure",
    "è una piattaforma avanzata per la gestione temporale di promemoria, scadenze critiche, adempimenti legali/fiscali, progetti professionali e note personali protette.": "is an advanced platform for the time management of reminders, critical deadlines, legal/tax compliances, professional projects and protected personal notes.",
    "Progressive Web App (PWA)": "Progressive Web App (PWA)",
    "Install Web App": "Install Web App",
    "Installa Web App": "Install Web App",
    "Pronto per la compilazione con": "Ready to compile with",
    "per generare il PDF accademico a stampa perfetta.": "to generate the perfectly printed academic PDF.",
    "Invia": "Submit"
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in dict_modals.items():
        pattern = f'>{it}<'
        new_tag = f'>{{settings.language === "en" ? "{en}" : "{it}"}}<'
        content = content.replace(pattern, new_tag)

        # For text that has spaces or other tags around
        content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('./src/components/InfoGuideModal.tsx')
fix_file('./src/components/CliManualModal.tsx')


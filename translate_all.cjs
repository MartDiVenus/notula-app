const fs = require('fs');
const path = require('path');

const dict = {
  // CalendarView
  "Nessun memo presente per il": "No memos present for",
  "Gennaio": "January", "Febbraio": "February", "Marzo": "March", "Aprile": "April", "Maggio": "May", "Giugno": "June",
  "Luglio": "July", "Agosto": "August", "Settembre": "September", "Ottobre": "October", "Novembre": "November", "Dicembre": "December",
  "Lunedì": "Monday", "Martedì": "Tuesday", "Mercoledì": "Wednesday", "Giovedì": "Thursday", "Venerdì": "Friday", "Sabato": "Saturday", "Domenica": "Sunday",
  "Lun": "Mon", "Mar": "Tue", "Mer": "Wed", "Gio": "Thu", "Ven": "Fri", "Sab": "Sat", "Dom": "Sun",
  "Memo Ricorrente": "Recurring Memo",
  "Scaduto": "Expired",
  "Nessuna descrizione": "No description",
  "Legenda Grafica": "Graphic Legend",
  "Memo odierno o futuro": "Today's or future memo",
  "Memo passato": "Past memo",
  "Memo ricorrente oggi (Pallino Blu)": "Recurring memo today (Blue Dot)",
  "Memo ricorrente passato (Pallino Grigio)": "Past recurring memo (Gray Dot)",
  "Memo ricorrente futuro (Pallino Verde)": "Future recurring memo (Green Dot)",
  "Oggi": "Today",
  "Nessun titolo": "No title",
  
  // App
  "Cerca (Data/Titolo/ID)": "Search (Date/Title/ID)",
  "Elenco Memo (a-g)": "Memo List (a-g)",
  "Elimina Memo (1-9)": "Delete Memo (1-9)",
  "Importa File (JSON / XML)": "Import File (JSON / XML)",
  "Esporta (XML, MD, ICS, JSON, PDF)": "Export (XML, MD, ICS, JSON, PDF)",
  "Cloud & Archivio": "Cloud & Storage",
  "Sincronizzazione Cloud & Google™ Drive": "Cloud & Google™ Drive Sync",
  "Cartella Cloud": "Cloud Folder",
  "Cartella Google™ Drive": "Google™ Drive Folder",
  "Supporto": "Support",
  "Impostazioni": "Settings",
  "Nuovo Memo": "New Memo",
  "Ricerca": "Search",
  "Visualizzazione Lista": "List View",
  "Eliminazione": "Delete",
  "Sincronizzazione Cloud": "Cloud Sync",
  "Stampa (PDF)": "Print (PDF)",
  "Esportazione / Import": "Export / Import",
  "Terminale CLI": "CLI Terminal",
  "Autore, Contatti, Copyright": "Author, Contacts, Copyright",
  "Installazione, Emblema": "Installation, Emblem",
  "Guida Funzionale, Manuale d'Uso": "Functional Guide, User Manual",
  
  // MemoFormModal
  "Nuovo Memo in Notula™": "New Memo in Notula™",
  "Modifica Memo": "Edit Memo",
  "Crea memo puntuale o ricorrente con opzione AES-256": "Create one-time or recurring memo with AES-256 option",
  "Titolo del Memo \\*": "Memo Title *",
  "Es. Rinnovo assicurazione, Udienza...": "e.g., Insurance renewal, Court hearing...",
  "Testo o annotazione opzionale...": "Optional text or note...",
  "Livello di Sicurezza (AES-256)": "Security Level (AES-256)",
  "Memo Pubblico": "Public Memo",
  "Visibile nel calendario normalmente": "Normally visible in calendar",
  "Offuscato": "Obfuscated",
  "Titolo mascherato, visibile al click": "Masked title, visible on click",
  "Privato (Cifrato)": "Private (Encrypted)",
  "Richiede Master Passphrase (AES-256)": "Requires Master Passphrase (AES-256)",
  "Attenzione: i memo cifrati non possono essere recuperati senza la Master Passphrase.": "Warning: encrypted memos cannot be recovered without the Master Passphrase.",
  "Frequenza": "Frequency",
  "Nessuna (Singolo)": "None (Single)",
  "Giornaliera": "Daily",
  "Settimanale": "Weekly",
  "Mensile": "Monthly",
  "Annuale": "Yearly",
  "Personalizzata (Giorni)": "Custom (Days)",
  "Limite Ricorrenza (Esecuzioni)": "Recurrence Limit (Executions)",
  "Data Scadenza": "Expiration Date",
  "Nessun Limite (Eterno)": "No Limit (Eternal)",
  "Serie Ricorrente Collegata:": "Linked Recurring Series:",
  "Le modifiche a titolo, descrizione e sicurezza verranno sincronizzate": "Changes to title, description, and security will be synchronized",
  "automaticamente": "automatically",
  "su tutti i memo della serie.": "across all memos in the series.",
  "Salva Memo": "Save Memo",
  "Salva Modifiche": "Save Changes",
  "Archivia in Notula™": "Store in Notula™",
  
  // ListSubmenu
  "Elenco Memo (GEM a-g)": "Memo List (GEM a-g)",
  "Seleziona il criterio di ordinamento e visualizzazione dei memo": "Select the sorting and display criteria for memos",
  "Data Crescente": "Date Ascending",
  "Data Decrescente": "Date Descending",
  "Alfabetico (A-Z)": "Alphabetical (A-Z)",
  "Alfabetico (Z-A)": "Alphabetical (Z-A)",
  "Solo Oggi": "Only Today",
  "Solo Settimana Corrente": "Only Current Week",
  "Solo Mese Corrente": "Only Current Month",
  "Filtra per Tipo:": "Filter by Type:",
  "Tutti": "All",
  "Puntuali": "One-time",
  "Ricorrenti": "Recurring",
  "Cifrati": "Encrypted",
  
  // DeleteSubmenu
  "Elimina Memo (GEM 1-9)": "Delete Memo (GEM 1-9)",
  "Seleziona una delle 9 modalità di rimozione memo": "Select one of the 9 memo removal modes",
  "1. Seleziona e cancella singolo memo": "1. Select and delete single memo",
  "2. Elimina tutta la serie (ID di gruppo)": "2. Delete whole series (Group ID)",
  "3. Inserisci ID esatto da eliminare": "3. Enter exact ID to delete",
  "4. Cancella tutti i memo di una data": "4. Delete all memos for a date",
  "5. Cancella tutti i memo di un mese": "5. Delete all memos for a month",
  "6. Cancella tutti i memo di un anno": "6. Delete all memos for a year",
  "7. Cancella tutti i memo con titolo esatto": "7. Delete all memos with exact title",
  "8. TUTTI i memo (puntuali e ricorrenti)": "8. ALL memos (one-time and recurring)",
  "9. CANCELLA SOLO SCADUTI": "9. DELETE EXPIRED ONLY",
  "Inserisci l'ID esatto del memo:": "Enter exact memo ID:",
  "Inserisci Group ID:": "Enter Group ID:",
  "Seleziona anno:": "Select year:",
  "Seleziona mese:": "Select month:",
  "Inserisci giorno:": "Enter day:",
  "Inserisci titolo esatto:": "Enter exact title:",
  "Verranno eliminati tutti i memo puntuali (non ricorrenti) la cui data è antecedente a oggi. I memo ricorrenti non verranno toccati.": "All one-time (non-recurring) memos with a date prior to today will be deleted. Recurring memos will not be affected.",
  "Sei assolutamente sicuro di voler cancellare TUTTI i memo archiviati?": "Are you absolutely sure you want to delete ALL stored memos?",
  "Esegui Eliminazione": "Execute Deletion",
  "Seleziona": "Select",
  "Nessun memo presente": "No memo present",
  
  // SearchSubmenu
  "Cerca nei Memo (Notula Search)": "Search Memos (Notula Search)",
  "Filtra dinamicamente per parola chiave, data o ID": "Filter dynamically by keyword, date, or ID",
  "Inserisci il termine da cercare...": "Enter search term...",
  
  // SecurityModal
  "Sblocca Memo Cifrati": "Unlock Encrypted Memos",
  "Inserisci la Master Passphrase per sbloccare temporaneamente i memo cifrati.": "Enter the Master Passphrase to temporarily unlock encrypted memos.",
  "Master Passphrase": "Master Passphrase",
  "Decifra (Temporaneo)": "Decrypt (Temporary)",
  
  // PrintModal
  "Esportazione Documento PDF Ink-Friendly": "Ink-Friendly PDF Export",
  "Data": "Date",
  "Tipo": "Type",
  "Titolo": "Title",
  
  // ExportModal
  "Esporta Backup completo (JSON)": "Export complete Backup (JSON)",
  "Importa Backup (JSON)": "Import Backup (JSON)"
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // We are going to find exact string literals and replace them with the ternary operator.
  // E.g., `>{settings.language === 'en' ? 'English' : 'Italian'}<`
  // E.g., `"{settings.language === 'en' ? 'English' : 'Italian'}"`
  
  for (const [it, en] of Object.entries(dict)) {
    // Only target places where the Italian string exists either as JSX text or inside quotes.
    
    // Replace standalone string literals in attributes or JS:
    // e.g. "Cerca nei Memo (Notula Search)"
    // We want to avoid replacing if it's already inside a settings.language condition.
    // A quick hack: first we replace existing translation patterns back to raw Italian to normalize
    const regexNorm1 = new RegExp(`\\{?settings\\.language === ['"]en['"] \\? ['"]${escapeRegExp(en)}['"] : ['"]${escapeRegExp(it)}['"]\\}?`, 'g');
    content = content.replace(regexNorm1, it);
    const regexNorm2 = new RegExp(`\\(?settings\\.language === ['"]en['"] \\? ['"]${escapeRegExp(en)}['"] : ['"]${escapeRegExp(it)}['"]\\)?`, 'g');
    content = content.replace(regexNorm2, `"${it}"`);

    // Now safely replace in JSX >text<
    content = content.replace(new RegExp(`>\\s*${escapeRegExp(it)}\\s*<`, 'g'), `>{settings.language === 'en' ? '${en}' : '${it}'}<`);
    
    // Replace in quotes "testo"
    content = content.replace(new RegExp(`"${escapeRegExp(it)}"`, 'g'), `(settings.language === 'en' ? '${en}' : '${it}')`);
    content = content.replace(new RegExp(`'${escapeRegExp(it)}'`, 'g'), `(settings.language === 'en' ? '${en}' : '${it}')`);
    
    // Handle some specific single quote cases inside JSX attributes:
    // title="Italian" -> title={settings.language === 'en' ? 'English' : 'Italian'}
    // It's tricky to do correctly with regex but let's do a pass
    content = content.replace(new RegExp(`=([\(])settings\\.language === 'en' \\? '${escapeRegExp(en)}' : '${escapeRegExp(it)}'([\\)])`, 'g'), `={settings.language === 'en' ? '${en}' : '${it}'}`);
  }

  // Check if we need to add useSettings
  if (content !== originalContent && !content.includes('useSettings')) {
      if (content.includes("import React")) {
         content = content.replace(/import React(.*?);/, "import React$1;\nimport { useSettings } from '../contexts/SettingsContext';");
      } else {
         content = "import { useSettings } from '../contexts/SettingsContext';\n" + content;
      }
      // find component definition to inject const { settings } = useSettings();
      // e.g., const MyComp = () => {
      content = content.replace(/const (\w+)[\s]*[:][\s]*React\.FC[^=]*=[\s]*\(([^)]*)\)[\s]*=>[\s]*\{/, "const $1: React.FC<any> = ($2) => {\n  const { settings } = useSettings();");
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir('./src');


const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [it, en] of Object.entries(replacements)) {
    // Replace text inside JSX >text<
    const regex1 = new RegExp(`>\\s*${it}\\s*<`, 'g');
    content = content.replace(regex1, `>{settings.language === 'en' ? '${en}' : '${it}'}<`);
    
    // Replace quotes "text"
    const regex2 = new RegExp(`"${it}"`, 'g');
    // For attributes we might need {settings.language === 'en' ? 'en' : 'it'}
    // Just a simple replace for now if it's safe
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

const appReplacements = {
  "Tutti i Memo": "All Memos",
  "Memo Ricorrenti": "Recurring Memos",
  "Memo Scaduti": "Expired Memos",
  "Funzioni GEM Notula": "GEM Notula Functions",
  "Cerca (Data/Titolo/ID)": "Search (Date/Title/ID)",
  "Elenco Memo (a-g)": "Memo List (a-z)",
  "Elimina Memo (1-9)": "Delete Memo (1-9)",
  "Cloud & Archivio": "Cloud & Storage",
  "Scarica da Google™ Drive": "Download from Google™ Drive",
  "Importa File (JSON / XML)": "Import File (JSON / XML)",
  "Esporta (XML, MD, ICS, JSON, PDF)": "Export (XML, MD, ICS, JSON, PDF)",
  "Cartella Google™ Drive": "Google™ Drive Folder",
  "Cartella Cloud": "Cloud Folder",
  "Memo Totali:": "Total Memos:",
  "Cifratura:": "Encryption:",
  "Nuovo Memo": "New Memo",
  "Cerca nei Memo": "Search Memos",
  "Calendario Notula™ (Vista Principale)": "Notula™ Calendar (Main View)",
  "Mostra Menu Laterale": "Show Sidebar"
};

replaceInFile('src/App.tsx', appReplacements);

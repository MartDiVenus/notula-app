# 📅 Notula™ • Advanced Time & Memo Engine (v2.2)

<p align="center">
  <b>High-engineering management of non-relational temporal memory. Offline-First Architecture, Google™ Drive Smart Sync & AES-256 Hardware Encryption.</b><br>
  <i>Design & Development: Ing. Mario Fantini</i><br>
  <b>🌐 Official Web App: <a href="https://martdivenus.github.io/notula-app">https://martdivenus.github.io/notula-app</a></b>
</p>

---

**Notula™** is an offline-first single-page application (SPA) created in **React 19** and **Tailwind CSS v4** specifically designed for managing, filtering, and organizing temporal memos (deadlines, payments, bills, generic reminders, appointments). 
Conceived by Ing. Mario Fantini, the application adopts a rigorous engineering approach: it completely eliminates reliance on third-party commercial databases (SaaS) and proprietary servers. Data is processed locally with zero latency, securely encrypted using AES-256 GCM hardware cryptography via Web Crypto API, and synchronized directly with the user's personal Google™ Drive space through an intelligent bidirectional synchronization engine with automatic conflict resolution.

Notula™ offers high-performance UI and an interactive calendar, alongside a powerful command-line terminal (CLI).

## ✨ Advanced Technical Features

### 1. 🔄 Multi-Level Recurrence Engine & Intelligent groupID
Unlike common task managers that only handle single notes, Notula™ implements an advanced recursive generation algorithm for recurring deadlines (e.g., mortgages, coupons, rent, monthly renewals).
- **Automatic Clone Propagation**: By cloning a memo for N days, Notula™ automatically generates independent events, linking them sequentially under a single tracking code (`groupID`).
- **Synchronous Cascade Updates**: If a user modifies the title, description, or security level of a memo belonging to a series, the engine intercepts the variation and automatically propagates it to all memos with the same `groupID`, ensuring total semantic coherence while leaving the specific expiration dates of each element strictly unaltered.

### 2. 📡 Google™ Drive Smart Sync Engine (Bidirectional)
The application natively integrates the Google™ Identity Services standard (OAuth 2.0). Memos are directly backed up in the user's private Google™ Drive (inside a dedicated `Notula/` folder) without intermediary servers.
- **Bi-Directional Timestamp Verification**: The synchronization algorithm automatically resolves conflicts: if the local application and Google Drive present misalignments, Notula™ displays an interactive modal (Conflict Resolution Dashboard) to let the user precisely choose the overwrite flow.
- **Background Multi-Chunk**: Supports saving massive bundles of memos without causing UI stuttering.

### 3. 🛡️ Military-Grade Security & Visual Obfuscation
The app adopts a strict multi-layer security policy:
- **Layer 1 (Visual Obfuscation)**: Text masking (mosaic effect) via CSS filtering to prevent shoulder surfing. Click-and-hold interaction for interactive revealing.
- **Layer 2 (Total Obfuscation)**: Solid gray satin block masking.
- **Layer 3 (AES-256-GCM Strong Encryption)**: Web Crypto API hardware encryption with a user Master Passphrase (100,000 PBKDF2 iterations + 256-bit AES-GCM).

### 4. 📤 Interoperability & Multi-Format Exports
Notula™ supports export and import in open standards:
- **JSON (.json)**: Native structured format for full backups, restore, or data migration.
- **XML (.xml)**: File compliant with the universal hierarchical schema `<notula><memo>` for documentary archives.
- **Markdown (.md)**: Legible tables and checklists ready for Obsidian, Notion, GitHub, or text editors.
- **iCalendar (.ics)**: RFC 5545 standard compatible with **Google™ Calendar**, Apple Calendar, and Microsoft Outlook.
- **PDF Ink-Friendly A4 (.pdf)**: Official sheet formatted for printing and zero-ink archiving (with `jsPDF`).
- **Plain Text (.txt)**: Concise lists for terminals and quick notes on any device.

### 5. 💻 Integrated CLI Terminal (Ctrl+Shift+P)
Notula™ includes a powerful integrated command line for full, automated control of the memo archive:

```bash
# =========================================================================
# NOTULA™ CLI COMMAND GUIDE (Ing. Mario Fantini)
# =========================================================================

# 1. One-time Memo Creation (default --repeat none implicit)
add --title "Vehicle Inspection" --date 2026-09-01
add --title "Deliverable Submission" --date 2026-09-15 --desc "Structural Project"

# 2. Recurring Series Creation (repeat for N consecutive days)
add --title "Antibiotic Therapy" --date 2026-09-01 --repeat 10
add --title "Server Check" --date 2026-09-01 --repeat 30

# 3. Creation with AES-256 Hardware Encryption and Obfuscation
add --title "Confidential File" --date 2026-10-05 --desc "Bank IBAN Coordinates..." --encrypt --obfuscate full

# 4. Modification & Cascade Update (via automatic groupID)
edit --id memo_1725000001 --title "Postponed Inspection" --date 2026-09-08
edit --id memo_1725000002 --desc "Notes updated after interview"

# 5. Listing, Filtering & Inspection
ls                                  # Shows all archived memos
ls --year 2026                      # Filters one-time memos for the year 2026
ls --year 2026 --month 09           # Filters one-time memos for September 2026
ls --month 09 --recurring          # Filters recurring memos for September
ls --group grp_abc123               # Shows all memos belonging to the same series
ls --expired                        # Shows only expired memos
info memo_1725000001                # Complete diagnostic card with AES-256 details

# 6. Global Search
find --title "Inspection"           # Searches in title or description
find --date 2026-09-01              # Searches by exact date
find --id memo_1725000001           # Searches by unique ID

# 7. Multi-Format Data Export & PDF
export --id memo_1725000001 --format pdf     # Exports a single memo as A4 PDF
export --all --format json                  # Exports the entire archive to JSON
export --all --format xml                   # Exports the entire archive to XML
export --year 2026 --format ics             # Exports calendar for Google™ Calendar / Outlook
pdf --id memo_1725000001                    # Quick shortcut to download the PDF

# 8. Data Import
import --json '[{"title":"Hearing","expirationDate":"2026-09-10"}]'
import                                      # Opens graphic file selector to import .json or .xml

# 9. Data Deletion
rm --id memo_1725000001             # Removes the specific single memo
rm --group grp_abc123               # Removes the entire connected recurring series
rm --expired                        # Removes all expired memos at once

# 10. Security, Passphrase & Privacy Management
passwd MySuperPassword2026!         # Sets or updates the AES-256 Master Passphrase
passwd clear                        # Removes Master Passphrase (operates in clear text)
privacy on                          # Activates visual masking
privacy off                         # Deactivates visual masking

# 11. Cloud Synchronization & Utilities
sync                                # Synchronizes archive with Google™ Drive
cloud-test                          # Runs diagnostic test on Google™ Drive folder /Notula/
man                                 # Opens Official CLI Manual (LaTeX / Reference)
theme dark                          # Sets dark theme (dark | light | system)
clear                               # Clears the terminal screen
exit                                # Closes the CLI terminal
```
> 💡 **Integrated Official CLI Manual**: Notula™ includes a complete document viewer of the CLI Manual and allows downloading the academic typographic source **`cli_manual.tex`** (LaTeX compilable with `pdflatex` or `xelatex`).

---

## 🛠️ Technology Stack
- **Frontend & UI**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling & Layout**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Document Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **PWA Engine**: Native Service Worker + W3C standards-compliant Web App Manifest

---

## 🚀 Local Installation & Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (version **22 LTS** or higher recommended)
- `npm` package manager

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/notula-memo-engine.git
cd notula-memo-engine

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Production build
npm run build
```
The application will be accessible at `http://localhost:3000`.

---

## 🤖 GitHub Actions Automatic Build (Android APK & Desktop)
The repository includes CI/CD workflows pre-configured in `.github/workflows/`:
- **Android APK Build (`build-android.yml`)**:
  - Generates `.apk` files (Debug and Release) compatible with Android smartphones and tablets.
  - Can be executed manually from the GitHub **Actions** tab (*Run workflow*) or triggered automatically on version tag creation (`v*`) or `main` push.
  - The generated files (`Notula-v2.2.0-debug.apk`, `Notula-v2.2.0-release-unsigned.apk`) can be downloaded directly from the **Artifacts** section of the build or attached to the GitHub Release.
- **Cross-Platform Desktop Build (`build-desktop.yml`)**:
  - Generates native packages for **Windows** (`.exe`, installer and portable), **Linux** (`.AppImage`, `.deb`), and **macOS** (`.dmg`, `.zip`).

---

## 📱 Progressive Web App (PWA) Installation
Notula™ is optimized for standalone use:
- **On Android / Chrome**: Open the browser menu (three dots) and select **"Add to Home screen"** or **"Install app"**. The app will be created as a WebAPK with a standalone icon and no address bar.
- **On iOS / Safari**: Tap the share icon and select **"Add to Home Screen"**.
- **On Desktop (Chrome / Edge)**: Click the installation icon on the right side of the address bar.

---

## ⚖️ Intellectual Property & Legal Notes
- **Conception, Architecture & Software Development**: **Ing. Mario Fantini**
  - **Author Contacts**: [https://mariofantini.eu](https://mariofantini.eu)
  - **Copyright**: © 2026 Ing. Mario Fantini. All Rights Reserved.
- **Intellectual Property Notice**: This software architecture, parsing logic, and source code are the proprietary work of the author. Manifestations of interest for the complete acquisition of commercial rights and ownership buyout are welcome, subject to prior economic agreement, while preserving the historical and moral authorship.
  Contact: marfant7@gmail.com
*Trademark Notes*: Google™ Calendar and Google™ Drive are trademarks of Google™ LLC. Notula™ is not sponsored by or affiliated with Google™ LLC.


---
<!-- ITALIAN VERSION / VERSIONE ITALIANA -->
---

# Notula™ &mdash; Next-Gen Calendar & Memo Engine

<p align="center">
  <img src="public/favicon.svg" alt="Notula Logo" width="110" height="110" />
</p>

<p align="center">
  <strong>Applicazione Standalone e CLI per la Gestione Avanzata di Promemoria, Schedario Temporale e Cifratura E2E.</strong>
</p>

<p align="center">
  <a href="https://mariofantini.eu"><img src="https://img.shields.io/badge/Autore-Ing.%20Mario%20Fantini-0284c7.svg?style=flat-square" alt="Autore" /></a>
  <img src="https://img.shields.io/badge/Versione-2.2%20Enterprise-emerald.svg?style=flat-square" alt="Versione" />
  <img src="https://img.shields.io/badge/Licenza-Proprietary%20%26%20Confidential-blue.svg?style=flat-square" alt="Licenza" />
  <img src="https://img.shields.io/badge/Security-AES--256%20GCM-purple.svg?style=flat-square" alt="Security" />
  <img src="https://img.shields.io/badge/Cloud-Google%E2%84%A2%20Drive%20Sync-amber.svg?style=flat-square" alt="Cloud" />
  <img src="https://img.shields.io/badge/PWA-Standalone%20WebAPK-indigo.svg?style=flat-square" alt="PWA" />
</p>

---

## 🏛️ Visione & Filosofia di Progetto

**Notula™** è un motore di promemoria e organizzazione temporale concepito secondo il principio **"Calendar-First"**. A differenza dei comuni task manager basati su notifiche push intrusive, Notula™ adotta una filosofia a **consultazione consapevole**: è l'utente a visionare il calendario e a interagire attivamente con i propri impegni.

L'applicazione garantisce:
- **Sovranità Assoluta dei Dati**: Cifratura locale a 3 strati con derivazione di chiave PBKDF2 e cifratura simmetrica AES-256-GCM.
- **Sincronizzazione Cloud-First**: Backup automatico e trasparente su **Google™ Drive** (cartella `Notula/`) e cache offline resiliente.
- **Doppia Interfaccia Operativa**: Visualizzazione grafica reattiva ad alta densità informativa + **Terminale CLI integrato** (in stile Unix) per utenti avanzati e sviluppatori.
- **Esperienza PWA Standalone**: Installabile nativamente su dispositivi mobili (Android WebAPK, iOS Web Clip) e Desktop senza barre URL del browser o elementi di disturbo.

---

## ✨ Funzionalità Principali

### 1. 📅 Calendario
- **Visualizzazione Istantanea**: All'avvio l'applicazione presenta direttamente il calendario a schermo pieno, massimizzando lo spazio disponibile.
- **Indicatori Grafici Geometrici**:
  - **Badge Circolare Dorato Pieno**: Evidenziazione inconfondibile del giorno corrente (**Oggi**).
  - **Bordature Cromatiche Rettangolari per Memo Puntuali** (geometria caselle con bordo colorato):
    - `` `#ef4444` `` **▢ Bordo Rosso**: Promemoria puntuale scaduto.
    - `` `#f97316` `` **▢ Bordo Arancio**: Promemoria puntuale con scadenza odierna.
    - `` `#d946ef` `` **▢ Bordo Magenta**: Promemoria puntuale futuro.
  - **Pallini di Stato per Memo Ricorrenti**:
    - 🔴 *Pallino Rosso*: Ricorrente odierno o passato.
    - 🟢 *Pallino Verde*: Ricorrente attivo programmato.

### 2. 🔁 Gestione Memo Ricorrenti & Cascading Synchronization (`groupID`)
- Quando viene creata una serie di memo ricorrenti (giornalieri, settimanali, mensili, annuali o a intervallo di giorni), a tutti gli elementi della serie viene assegnato un identificativo univoco **`groupID`**.
- La modifica di qualsiasi memo appartenente alla serie aggiorna **automaticamente e a cascata tutti i promemoria correlati**, garantendo la perfetta integrità dei dati.

### 3. 🛡️ Sicurezza Avanzata & Cifratura a 3 Strati
- **Strato 0 (Privacy Mode a Video)**: Mascheramento grigio satinato istantaneo nella GUI per proteggere i dati da sguardi indiscreti.
- **Strato 1 (Offuscamento Parziale)**: Mascheramento di sicurezza per payload sensibili con opzione di svelamento interattivo.
- **Strato 2 (Offuscamento Totale)**: Mascheramento grigio pieno a blocco satinato.
- **Strato 3 (Cifratura Forte AES-256-GCM)**: Crittografia hardware Web Crypto API con Master Passphrase utente (100.000 iterazioni PBKDF2 + AES-GCM a 256 bit).

### 4. 📤 Interoperabilità & Esportazioni Multi-Formato
Notula™ supporta l'esportazione e importazione in standard aperti:
- **JSON (.json)**: Formato strutturato nativo per backup completi, ripristino o migrazione dati.
- **XML (.xml)**: File conforme allo schema universale gerarchico `<notula><memo>` per archivi documentali.
- **Markdown (.md)**: Tabelle e checklist leggibili pronte per Obsidian, Notion, GitHub o editor di testo.
- **iCalendar (.ics)**: Standard RFC 5545 compatibile con **Google™ Calendar**, Apple Calendar e Microsoft Outlook.
- **PDF Ink-Friendly A4 (.pdf)**: Scheda ufficiale formattata per la stampa e archiviazione a zero consumo d'inchiostro (con `jsPDF`).
- **Plain Text (.txt)**: Elenchi sintetici per terminale e appunti veloci su qualsiasi dispositivo.

### 5. 💻 Terminale CLI Integrato (Ctrl+Shift+P)
Notula™ include una potente riga di comando integrata per il controllo completo e automatizzato dell'archivio memo:

```bash
# =========================================================================
# GUIDA COMANDI NOTULA™ CLI (Ing. Mario Fantini)
# =========================================================================

# 1. Creazione Memo Puntuale (default --repeat none implicito)
add --title "Revisione Veicolo" --date 2026-09-01
add --title "Consegna Elaborato" --date 2026-09-15 --desc "Progetto Strutturale"

# 2. Creazione Serie Ricorrente (ripetizione per N giorni consecutivi)
add --title "Terapia Antibiotica" --date 2026-09-01 --repeat 10
add --title "Controllo Server" --date 2026-09-01 --repeat 30

# 3. Creazione con Cifratura Hardware AES-256 e Offuscamento
add --title "Fascicolo Riservato" --date 2026-10-05 --desc "Coordinate Bancarie IBAN..." --encrypt --obfuscate full

# 4. Modifica & Aggiornamento a Cascata (tramite groupID automatico)
edit --id memo_1725000001 --title "Revisione Posticipata" --date 2026-09-08
edit --id memo_1725000002 --desc "Note aggiornate dopo colloquio"

# 5. Elenco, Filtro & Ispezione
ls                                  # Mostra tutti i memo archiviati
ls --year 2026                      # Filtra memo puntuali dell'anno 2026
ls --year 2026 --month 09           # Filtra memo puntuali di settembre 2026
ls --month 09 --recurring          # Filtra memo ricorrenti di settembre
ls --group grp_abc123               # Mostra tutti i memo appartenenti alla stessa serie
ls --expired                        # Mostra solo i memo scaduti
info memo_1725000001                # Scheda diagnostica completa con dettagli AES-256

# 6. Ricerca Globale
find --title "Revisione"            # Cerca nel titolo o nella descrizione
find --date 2026-09-01              # Cerca per data esatta
find --id memo_1725000001           # Cerca per ID univoco

# 7. Esportazione Dati Multi-Formato & PDF
export --id memo_1725000001 --format pdf     # Esporta singolo memo in PDF A4
export --all --format json                  # Esporta l'intero archivio in JSON
export --all --format xml                   # Esporta l'intero archivio in XML
export --year 2026 --format ics             # Esporta calendario per Google™ Calendar / Outlook
pdf --id memo_1725000001                    # Scorciatoia rapida per scaricare il PDF

# 8. Importazione Dati
import --json '[{"title":"Udienza","expirationDate":"2026-09-10"}]'
import                                      # Apre il selettore file grafico per importare .json o .xml

# 9. Eliminazione Dati
rm --id memo_1725000001             # Rimuove il singolo memo specificato
rm --group grp_abc123               # Rimuove l'intera serie ricorrente collegata
rm --expired                        # Rimuove tutti i memo scaduti in blocco

# 10. Gestione Sicurezza, Passphrase & Privacy
passwd MiaSuperPassword2026!        # Imposta o aggiorna la Master Passphrase AES-256
passwd clear                        # Rimuove la Master Passphrase (opera in chiaro)
privacy on                          # Attiva mascheramento visivo
privacy off                         # Disattiva mascheramento visivo

# 11. Sincronizzazione Cloud & Utilità
sync                                # Sincronizza archivio con Google™ Drive
cloud-test                          # Esegue test diagnostico cartella Google™ Drive /Notula/
man                                 # Apre il Manuale Ufficiale CLI (LaTeX / Reference)
theme dark                          # Imposta tema scuro (dark | light | system)
clear                               # Pulisce la schermata del terminale
exit                                # Chiude il terminale CLI
```

> 💡 **Manuale Ufficiale CLI integrato**: Notula™ include un visualizzatore documentale completo del Manuale della CLI e consente il download del sorgente tipografico accademico **`cli_manual.tex`** (LaTeX compilabile con `pdflatex` o `xelatex`).

---

## 🛠️ Stack Tecnologico

- **Frontend & UI**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling & Layout**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografia**: [Lucide React](https://lucide.dev/)
- **Animazioni**: [Motion](https://motion.dev/)
- **Generazione Documenti**: [jsPDF](https://github.com/parallax/jsPDF)
- **PWA Engine**: Service Worker nativo + Web App Manifest conforme agli standard W3C

---

## 🚀 Installazione & Esecuzione Locale

### Prerequisiti
- [Node.js](https://nodejs.org/) (versione **22 LTS** o superiore raccomandata)
- Gestore di pacchetti `npm`

### Avvio Rapido

```bash
# 1. Clona il repository
git clone https://github.com/tuo-username/notula-memo-engine.git
cd notula-memo-engine

# 2. Installa le dipendenze
npm install

# 3. Avvia il server di sviluppo
npm run dev

# 4. Compilazione di produzione
npm run build
```

L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`.

---

## 🤖 Compilazione Automatica GitHub Actions (Android APK & Desktop)

Il repository include i workflow CI/CD preconfigurati in `.github/workflows/`:

- **Compilazione Android APK (`build-android.yml`)**:
  - Genera i file `.apk` (Debug e Release) compatibili con smartphone e tablet Android.
  - Può essere eseguito manualmente dal tab **Actions** di GitHub (*Run workflow*) o attivato automaticamente alla creazione di un tag di versione (`v*`) o su push `main`.
  - I file generati (`Notula-v2.2.0-debug.apk`, `Notula-v2.2.0-release-unsigned.apk`) sono scaricabili direttamente dalla sezione **Artifacts** della build o allegati alla GitHub Release.
- **Compilazione Desktop Multipiattaforma (`build-desktop.yml`)**:
  - Genera i pacchetti nativi per **Windows** (`.exe`, installer e portabile), **Linux** (`.AppImage`, `.deb`) e **macOS** (`.dmg`, `.zip`).

---

## 📱 Installazione come Progressive Web App (PWA)

Notula™ è ottimizzata per l'uso standalone:
- **Su Android / Chrome**: Apri il menu del browser (tre puntini) e seleziona **"Aggiungi a schermata Home"** o **"Installa applicazione"**. L'app verrà creata come WebAPK con icona autonoma e priva di barra degli indirizzi.
- **Su iOS / Safari**: Tocca l'icona di condivisione e seleziona **"Aggiungi a schermata Home"**.
- **Su Desktop (Chrome / Edge)**: Clicca sull'icona di installazione presente a destra nella barra degli indirizzi.

---

## ⚖️ Proprietà Intellettuale & Note Legali

- **Ideazione, Architettura & Sviluppo Software**: **Ing. Mario Fantini**  
- **Contatti dell'Autore**: [https://mariofantini.eu](https://mariofantini.eu)  
- **Copyright**: © 2026 Ing. Mario Fantini. Tutti i Diritti Riservati (*All Rights Reserved*).
- **Intellectual Property Notice**: This software architecture, parsing logic, and source
code are the proprietary work of the author. Manifestations of interest for the complete
acquisition of commercial rights and ownership buyout are welcome, subject to prior
economic agreement, while preserving the historical and moral authorship.
Contact: marfant7@gmail.com

*Note sui Marchi Registrati*: Google™ Calendar e Google™ Drive sono marchi di Google™ LLC. Notula™ non è sponsorizzata o affiliata a Google™ LLC.


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

*Note sui Marchi Registrati*: Google™ Calendar e Google™ Drive sono marchi di Google™ LLC. Notula™ non è sponsorizzata o affiliata a Google™ LLC.


# Piano di Aggiornamento Manuale & Help: Architettura 100% Online (Cloud-Only)

## 1. Cosa è Emerso dalla Verifica dell'Help
Controllando tutte le sezioni della Guida Utente (`InfoGuideModal.tsx`), del Manuale CLI (`cliManualData.ts`), della finestra di conflitto (`ConflictModal.tsx`) e del `README.md`, sono rimasti i seguenti riferimenti alla vecchia architettura locale/offline:

1. **Guida Utente — Sezione 2 ("Punti di Forza", `src/components/InfoGuideModal.tsx`)**:
   - Riporta ancora il riquadro *"Architettura Offline-First & Immediata — Funziona sempre, anche in assenza totale di connessione Internet. All'avvio carica istantaneamente l'archivio locale."*
2. **Guida Utente — Sezione 6 ("Sincronizzazione Google™ Drive", `src/components/InfoGuideModal.tsx`)**:
   - Riporta ancora il punto *"Gestione Conflitti Intelligente: In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità (Sostituisci [Y], Ignora [I], Duplica entrambi [M] o Applica a tutti [A])."*
3. **Guida Utente — Scheda "Installazione, Emblema" (`src/components/InfoGuideModal.tsx`)**:
   - Riporta ancora *"per un'esperienza nativa e offline"*.
4. **Manuale CLI (`src/data/cliManualData.ts`)**:
   - La voce del comando `sync` parla ancora di *"allinea l'archivio locale con la cartella 'Notula/'... gestendo in automatico eventuali conflitti"*.
5. **Finestra Conflitti per Importazione File (`src/components/ConflictModal.tsx`) & `README.md`**:
   - Parla ancora di *"Versione Locale"* contro *"Google™ Drive / File"*, mentre ora i conflitti con `[Y] Sostituisci / [I] Ignora / [M] Tieni Entrambi (Keep Both)` riguardano esclusivamente l'importazione manuale di file esterni (`.json` / `.xml`) rispetto all'archivio Cloud attivo.

## 2. Interventi di Aggiornamento Previsti
- **Aggiornamento Guida Utente (`src/components/InfoGuideModal.tsx`)**:
  - Sostituzione del punto *"Architettura Offline-First"* nella Sezione 2 con **"Architettura 100% Online (Cloud-Only & Simmetria Totale)"**, spiegando che tutti i PC e gli smartphone leggono e scrivono direttamente sulla cartella `/Notula` di Google™ Drive senza database locale, eliminando alla radice qualsiasi asimmetria tra dispositivi.
  - Aggiornamento della Sezione 6 (**Google™ Drive**) rimuovendo la risoluzione dei conflitti Locale vs Cloud (`[Y]/[I]/[M]/[A]`) per il sync Drive e documentando il caricamento automatico all'apertura, il salvataggio istantaneo a ogni modifica e il riallineamento automatico al cambio scheda/finestra.
  - Chiarimento nella Sezione 5 (Esportazioni/Importazioni) che la finestra interattiva `[Y] Sostituisci / [I] Ignora / [M] Tieni Entrambi (Keep Both)` interviene solo quando si importa manualmente un file `.json` o `.xml` esterno con ID già presenti nel Cloud.
  - Aggiornamento della descrizione nella scheda **Installazione PWA** (esperienza nativa standalone connessa in tempo reale al Cloud).
- **Aggiornamento Manuale CLI (`src/data/cliManualData.ts`) & `README.md` & `ConflictModal.tsx`**:
  - Allineamento della descrizione del comando `sync`, delle etichette di `ConflictModal.tsx` (*"Versione Cloud Attuale"* vs *"File Importato"*) e del `README.md` all'architettura Cloud-Only.

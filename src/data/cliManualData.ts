/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

export interface CliCommandDoc {
  name: string;
  syntax: string;
  category: 'core' | 'export_import' | 'query' | 'security' | 'system';
  summary: string;
  description: string;
  options: { flag: string; type: string; desc: string; required?: boolean }[];
  examples: string[];
  notes?: string;
}

export const CLI_MANUAL_VERSION = "2.2.0";
export const CLI_MANUAL_DATE = "Agosto 2026";
export const CLI_MANUAL_AUTHOR = "Ing. Mario Fantini";
export const CLI_MANUAL_SITE = "https://mariofantini.eu";

export const CLI_COMMANDS_DOC: CliCommandDoc[] = [
  {
    name: "help",
    syntax: "help [command]",
    category: "system",
    summary: "Mostra la guida in linea interattiva a tutti i comandi o la sintassi di uno specifico comando.",
    description: "Fornisce il riassunto dell'elenco comandi supportati dall'interprete Notula™ o le opzioni avanzate del comando specificato come argomento.",
    options: [
      { flag: "[command]", type: "string", desc: "Nome del comando di cui visualizzare i dettagli (es. add, edit, export, rm)." }
    ],
    examples: [
      "help",
      "help edit",
      "help export",
      "help rm"
    ]
  },
  {
    name: "add",
    syntax: "add --title <str> --date <YYYY-MM-DD> [opzioni...]",
    category: "core",
    summary: "Crea e programma un nuovo promemoria (puntuale o ricorrente con groupID automatico).",
    description: "Inserisce un nuovo memo nell'archivio locale con calcolo automatico dell'identificativo univoco 'id' e 'groupID'. Se il promemoria è ricorrente, genera la serie nel calendario sincronizzando i record correlati.",
    options: [
      { flag: "--title <str>", type: "string", desc: "Titolo o oggetto del promemoria (obbligatorio).", required: true },
      { flag: "--date <YYYY-MM-DD>", type: "date", desc: "Data di scadenza in formato ISO 8601 (obbligatorio).", required: true },
      { flag: "--desc <str>", type: "string", desc: "Descrizione testuale estesa o note aggiuntive." },
      { flag: "--color <hex>", type: "hex", desc: "Codice colore esadecimale (default: #3b82f6)." },
      { flag: "--repeat <type>", type: "enum", desc: "Frequenza: none | daily | weekly | monthly | yearly | days (default: none)." },
      { flag: "--interval <n>", type: "int", desc: "Intervallo numerico per la ricorrenza (es. ogni 15 giorni con --repeat days)." },
      { flag: "--security <0|1|2>", type: "int", desc: "Livello di privacy a video: 0 (Nessuno), 1 (Parziale IB•••401), 2 (Totale ••••••)." },
      { flag: "--encrypt", type: "flag", desc: "Attiva la cifratura hardware crittografica AES-256 E2E con Master Passphrase." }
    ],
    examples: [
      'add --title "Udienza Civile" --date 2026-09-20',
      'add --title "Fattura Server" --date 2026-09-01 --repeat monthly --desc "Hosting VPS" --encrypt',
      'add --title "Manutenzione Impianto" --date 2026-10-01 --repeat days --interval 15 --color #10b981'
    ],
    notes: "Tutti i memo generati con una ricorrenza condividono lo stesso 'groupID'. Eventuali modifiche successive al titolo o alla sicurezza verranno propagate all'intera serie."
  },
  {
    name: "edit",
    syntax: "edit --id <id> [opzioni...]",
    category: "core",
    summary: "Modifica un promemoria esistente con propagazione automatica a cascata del groupID.",
    description: "Consente di aggiornare titolo, data di scadenza, note, colore o livello di cifratura di un promemoria esistente identificato dal suo ID univoco. Se il memo fa parte di una serie ricorrente con groupID condiviso, le modifiche comuni vengono sincronizzate automaticamente su tutti i promemoria della serie.",
    options: [
      { flag: "--id <id>", type: "string", desc: "Identificativo univoco del memo da modificare (obbligatorio).", required: true },
      { flag: "--title <str>", type: "string", desc: "Nuovo titolo del promemoria." },
      { flag: "--date <YYYY-MM-DD>", type: "date", desc: "Nuova data di scadenza (modifica solo il singolo memo target)." },
      { flag: "--desc <str>", type: "string", desc: "Nuovo testo della descrizione estesa." },
      { flag: "--color <hex>", type: "hex", desc: "Nuovo codice colore identificativo." },
      { flag: "--security <0|1|2>", type: "int", desc: "Nuovo livello di offuscamento a video (0=Normale, 1=Parziale, 2=Totale)." },
      { flag: "--encrypt", type: "flag", desc: "Abilita o aggiorna la crittografia AES-256 E2E." }
    ],
    examples: [
      'edit --id n_17240012345 --title "Udienza Rinviata al Collegio"',
      'edit --id n_17240012345 --date 2026-10-15 --desc "Aula 3 Sezione Fallimentare"',
      'edit --id n_17240098765 --security 2 --encrypt'
    ],
    notes: "L'architettura Cascading Synchronization di Notula™ preserva le date individuali di calendario dei vari memo della serie, aggiornando in parallelo i dati condivisi."
  },
  {
    name: "ls / list",
    syntax: "ls [--all] [--year <YYYY>] [--month <MM>] [--group <groupID>] [--expired] [--search <str>]",
    category: "query",
    summary: "Visualizza ed elenca i promemoria presenti in memoria filtrando per molteplici criteri.",
    description: "Esegue query sull'archivio locale Notula™ mostrando ID, data, titolo, ricorrenza, stato di scadenza e livello di cifratura.",
    options: [
      { flag: "--all", type: "flag", desc: "Elenca tutti i promemoria senza limiti." },
      { flag: "--year <YYYY>", type: "int", desc: "Filtra i memo per anno di calendario (es. 2026)." },
      { flag: "--month <MM>", type: "int", desc: "Filtra per mese specifico (1-12)." },
      { flag: "--date <YYYY-MM-DD>", type: "date", desc: "Filtra per giorno esatto." },
      { flag: "--group <groupID>", type: "string", desc: "Mostra tutti i memo appartenenti alla stessa serie ricorrente." },
      { flag: "--expired", type: "flag", desc: "Mostra esclusivamente i memo la cui scadenza è antecedente a oggi." },
      { flag: "--search <query>", type: "string", desc: "Filtra i memo contenenti la parola chiave nel titolo o nelle note." }
    ],
    examples: [
      "ls",
      "ls --year 2026",
      "ls --expired",
      "ls --group grp_17240012345_abc",
      'ls --search "Fattura"'
    ]
  },
  {
    name: "show / info",
    syntax: "show <id> / info <id>",
    category: "query",
    summary: "Mostra la scheda tecnica e diagnostica dettagliata di un singolo promemoria.",
    description: "Visualizza tutti i campi interni del record: ID primario, groupID, data creazione, data scadenza, parametri di ricorrenza, livello di sicurezza, stato di cifratura e payload raw.",
    options: [
      { flag: "<id>", type: "string", desc: "ID del memo da esaminare (obbligatorio).", required: true }
    ],
    examples: [
      "show n_17240012345",
      "info n_17240098765"
    ]
  },
  {
    name: "export",
    syntax: "export [--id <id> | --all | --year <YYYY>] --format <json|xml|md|ics|pdf|txt>",
    category: "export_import",
    summary: "Esporta i promemoria nei 6 formati standard universali di Notula™.",
    description: "Genera e scarica file nei formati JSON (database con cifratura), XML (gerarchico interoperabile), Markdown (per Obsidian/Notion), iCalendar (.ics per Google™ Calendar / Apple / Outlook), PDF A4 Ink-Friendly o Plain Text.",
    options: [
      { flag: "--format <fmt>", type: "enum", desc: "Formato di destinazione: json | xml | md | ics | pdf | txt (obbligatorio).", required: true },
      { flag: "--id <id>", type: "string", desc: "Esporta unicamente il memo specificato." },
      { flag: "--all", type: "flag", desc: "Esporta l'intero archivio in un unico documento." },
      { flag: "--year <YYYY>", type: "int", desc: "Esporta solo i memo dell'anno selezionato (ideale per file .ics)." }
    ],
    examples: [
      "export --all --format json",
      "export --all --format xml",
      "export --all --format md",
      "export --year 2026 --format ics",
      "export --id n_17240012345 --format pdf",
      "export --id n_17240012345 --format txt"
    ]
  },
  {
    name: "pdf",
    syntax: "pdf [--id <id>]",
    category: "export_import",
    summary: "Genera e scarica all'istante il documento PDF A4 Ink-Friendly ufficiale.",
    description: "Crea un foglio impaginato per la stampa ecologica a zero consumo d'inchiostro (senza fondini scuri), con intestazione ufficiale Notula™, dettagli temporali, note e riquadro firme.",
    options: [
      { flag: "--id <id>", type: "string", desc: "ID del promemoria da convertire in PDF (se omesso esporta il primo memo selezionato)." }
    ],
    examples: [
      "pdf --id n_17240012345",
      "pdf"
    ]
  },
  {
    name: "import",
    syntax: "import [--json <raw_string> | --xml <raw_string>]",
    category: "export_import",
    summary: "Importa ed inserisce promemoria da payload JSON o XML strutturato.",
    description: "Consente l'iniezione diretta di stringhe JSON o XML da riga di comando. Se eseguito senza argomenti, apre automaticamente il selettore file grafico del sistema operativo per importare file `.json` o `.xml`.",
    options: [
      { flag: "--json <str>", type: "string", desc: "Stringa raw contenente un array di oggetti memo JSON validi." },
      { flag: "--xml <str>", type: "string", desc: "Stringa raw XML conforme allo schema <notula><memo>...</memo></notula>." }
    ],
    examples: [
      'import --json \'[{"title":"Scadenza Tasse","expirationDate":"2026-11-30"}]\'',
      'import --xml \'<notula><memo><title>Revisione Auto</title><expirationDate>2026-12-15</expirationDate></memo></notula>\'',
      "import"
    ]
  },
  {
    name: "rm / delete",
    syntax: "rm [--id <id>] [--group <groupID>] [--title <query>] [--expired] [--all] [--force]",
    category: "core",
    summary: "Elimina promemoria in base a 9 modalità mirate di pulizia.",
    description: "Rimuove in modo permanente memo singoli per ID, serie complete legate dallo stesso groupID, corrispondenze di titolo, memo scaduti o esegue la cancellazione totale.",
    options: [
      { flag: "--id <id>", type: "string", desc: "1. Elimina singolo memo specificando l'ID." },
      { flag: "--group <groupID>", type: "string", desc: "2. Elimina tutti i memo della serie collegata." },
      { flag: "--title <query>", type: "string", desc: "3. Elimina per corrispondenza esatta o parziale del titolo." },
      { flag: "--date <YYYY-MM-DD>", type: "date", desc: "4. Elimina tutti i memo di una specifica data." },
      { flag: "--month <MM>", type: "int", desc: "5. Elimina tutti i memo di un mese (1-12)." },
      { flag: "--year <YYYY>", type: "int", desc: "6. Elimina tutti i memo di un anno intero." },
      { flag: "--repeat <type>", type: "enum", desc: "7. Elimina solo memo con una specifica ricorrenza." },
      { flag: "--expired", type: "flag", desc: "8. Elimina tutti i memo con data passata." },
      { flag: "--all", type: "flag", desc: "9. Cancellazione totale dell'intero archivio." },
      { flag: "--force", type: "flag", desc: "Esegue l'eliminazione saltando le richieste di conferma." }
    ],
    examples: [
      "rm --id n_17240012345",
      "rm --group grp_17240012345_abc",
      'rm --title "Bozza"',
      "rm --expired",
      "rm --all --force"
    ]
  },
  {
    name: "sync",
    syntax: "sync",
    category: "export_import",
    summary: "Attiva la sincronizzazione bidirezionale con Google™ Drive.",
    description: "Scarica e allinea l'archivio locale con la cartella 'Notula/' del proprio account Google™ Drive, gestendo in automatico eventuali conflitti e applicando la crittografia E2E.",
    options: [],
    examples: ["sync"]
  },
  {
    name: "cloud-test",
    syntax: "cloud-test",
    category: "system",
    summary: "Esegue il test diagnostico hardware/cloud di connettività Google™ Drive.",
    description: "Verifica lo stato del token OAuth2, la raggiungibilità degli endpoint Google™ API, i permessi di lettura/scrittura nella cartella Notula/ e la latenza di rete.",
    options: [],
    examples: ["cloud-test"]
  },
  {
    name: "passwd",
    syntax: "passwd <nuova_passphrase>",
    category: "security",
    summary: "Imposta, modifica o azzera la Master Passphrase per la crittografia AES-256 E2E.",
    description: "Ricalcola in tempo reale la chiave crittografica PBKDF2 a 100.000 iterazioni. Da quel momento, tutti i nuovi memo cifrati, le modifiche e i file caricati su Google™ Drive utilizzeranno la nuova chiave.",
    options: [
      { flag: "<nuova_passphrase>", type: "string", desc: "La nuova parola chiave segreta (minimo 8 caratteri consigliati).", required: true }
    ],
    examples: [
      "passwd MiaNuovaPassword2026!",
      "passwd ProgettoSegreto#99"
    ]
  },
  {
    name: "privacy",
    syntax: "privacy [on | off | toggle]",
    category: "security",
    summary: "Attiva, disattiva o alterna la modalità Privacy di mascheramento a video.",
    description: "Occulta immediatamente i dati visibili nella schermata del calendario per proteggere le informazioni da sguardi indiscreti nell'ambiente di lavoro.",
    options: [
      { flag: "[on|off|toggle]", type: "enum", desc: "Stato desiderato della modalità privacy (default: toggle)." }
    ],
    examples: [
      "privacy",
      "privacy on",
      "privacy off"
    ]
  },
  {
    name: "theme",
    syntax: "theme [light | dark | system | toggle]",
    category: "system",
    summary: "Modifica il tema cromatico dell'interfaccia utente.",
    description: "Imposta la palette visiva su Chiaro (Light), Scuro (Dark) o allineato al sistema operativo.",
    options: [
      { flag: "[mode]", type: "enum", desc: "light | dark | system | toggle (default: toggle)." }
    ],
    examples: [
      "theme dark",
      "theme light",
      "theme system"
    ]
  },
  {
    name: "stats",
    syntax: "stats",
    category: "query",
    summary: "Visualizza il prospetto statistico e telemetrico dell'archivio Notula™.",
    description: "Mostra il conteggio complessivo dei memo, suddivisione puntuali/ricorrenti, quantitativo di record cifrati AES-256, numero di memo scaduti e stima occupazione memoria.",
    options: [],
    examples: ["stats"]
  },
  {
    name: "clear / cls",
    syntax: "clear / cls",
    category: "system",
    summary: "Pulisce il buffer di visualizzazione del terminale CLI.",
    description: "Cancella le righe di output precedenti mantenendo intatta la cronologia comandi.",
    options: [],
    examples: ["clear", "cls"]
  },
  {
    name: "exit / quit",
    syntax: "exit / quit",
    category: "system",
    summary: "Chiude la sessione interattiva del terminale CLI e ritorna al Calendario.",
    description: "Nasconde la finestra della console mantenendo memorizzato lo stato dei comandi eseguiti.",
    options: [],
    examples: ["exit", "quit"]
  }
];

export const LATEX_CLI_MANUAL_SOURCE = `% ==============================================================================
% NOTULA™ CLI OFFICIAL REFERENCE MANUAL & TECHNICAL SPECIFICATION
% Ideazione & Sviluppo: Ing. Mario Fantini
% Sito Ufficiale: https://mariofantini.eu
% Versione Specifica: 2.2.0 (Agosto 2026)
% ==============================================================================
\\documentclass[11pt,a4paper]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[italian]{babel}
\\usepackage{geometry}
\\geometry{a4paper, top=2.5cm, bottom=2.5cm, left=2.5cm, right=2.5cm}
\\usepackage{hyperref}
\\hypersetup{
    colorlinks=true,
    linkcolor=blue!80!black,
    urlcolor=blue!80!black,
    citecolor=blue!80!black,
    pdftitle={Notula CLI Reference Manual - Ing. Mario Fantini},
    pdfauthor={Ing. Mario Fantini}
}
\\usepackage{listings}
\\usepackage{xcolor}
\\usepackage{tcolorbox}
\\usepackage{tabularx}
\\usepackage{booktabs}
\\usepackage{amsmath,amssymb}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textbf{Notula™ CLI Manual} -- v2.2.0}
\\fancyhead[R]{Ing. Mario Fantini}
\\fancyfoot[C]{\\thepage}

\\definecolor{cliDark}{RGB}{13, 17, 23}
\\definecolor{cliCyan}{RGB}{56, 189, 248}
\\definecolor{cliGreen}{RGB}{52, 211, 153}
\\definecolor{cliYellow}{RGB}{250, 204, 21}

\\lstdefinestyle{notulacli}{
    backgroundcolor=\\color{cliDark},
    basicstyle=\\ttfamily\\small\\color{white},
    keywordstyle=\\color{cliGreen}\\bfseries,
    stringstyle=\\color{cliYellow},
    commentstyle=\\color{gray},
    breaklines=true,
    frame=single,
    rulecolor=\\color{gray!50},
    numbers=none
}

\\begin{document}

\\begin{titlepage}
    \\centering
    \\vspace*{1.5cm}
    {\\huge\\bfseries NOTULA™ ENTERPRISE CLI}\\\\[0.4cm]
    {\\Large Manuale Ufficiale dei Comandi & Specifica Tecnica di Sistema}\\\\[0.2cm]
    {\\large Versione 2.2.0 -- Edizione Ufficiale Agosto 2026}\\\\[2cm]
    
    \\begin{tcolorbox}[colback=blue!5!white,colframe=blue!75!black,title=\\textbf{Informazioni sull'Opera & Proprietà Intellettuale}]
        \\textbf{Autore & Progettista:} Ing. Mario Fantini\\\\
        \\textbf{Sito Web Ufficiale:} \\href{https://mariofantini.eu}{https://mariofantini.eu}\\\\
        \\textbf{Architettura Software:} Notula Memo Engine Enterprise v2.2\\\\
        \\textbf{Licenza & Diritti:} Proprietary & Confidential -- Tutti i Diritti Riservati.
    \\end{tcolorbox}
    
    \\vfill
    {\\small Documento ad uso tecnico, ingegneristico e professionale.\\\\
    Generato e compilato con standard accademico \\LaTeX.}
\\end{titlepage}

\\tableofcontents
\\newpage

\\section{Introduzione & Architettura dell'Interprete CLI}
L'interprete \\textbf{Notula™ CLI} fornisce una shell professionale basata su riga di comando accessibile sia tramite la scorciatoia globale \\texttt{Ctrl+Shift+P} sia dal pulsante Terminale presente nella barra superiore dell'applicazione.

\\subsection{Caratteristiche Ingegneristiche}
\\begin{itemize}
    \\item \\textbf{Sincronizzazione di Gruppo (\\texttt{groupID}):} Ogni promemoria generato all'interno di una serie ricorrente eredita il medesimo identificativo di gruppo univoco. Modificando titolo, note o crittografia tramite il comando \\texttt{edit}, le variazioni vengono propagate a cascata preservando le date individuali di calendario.
    \\item \\textbf{Crittografia a 3 Strati:} Supporto nativo hardware \\texttt{AES-GCM-256} derivata da Master Passphrase con 100.000 iterazioni \\texttt{PBKDF2}.
    \\item \\textbf{Interoperabilità Totale:} Esportazione ed importazione nei 6 formati universali: JSON, XML, Markdown, iCalendar (ICS), PDF A4 Ink-Friendly e Plain Text.
\\end{itemize}

\\section{Sintassi Generale & Notazione}
Tutti i comandi rispettano la notazione standard POSIX/GNU:
\\begin{lstlisting}[style=notulacli]
notula> <comando> [--opzione <valore>] [--flag]
\\end{lstlisting}

\\section{Riferimento Completo dei Comandi}

\\subsection{1. Comando \\texttt{add} -- Creazione Promemoria}
\\textbf{Sintassi:} \\texttt{add --title <str> --date <YYYY-MM-DD> [opzioni...]}
\\begin{lstlisting}[style=notulacli]
notula> add --title "Udienza Civile" --date 2026-09-20
notula> add --title "Hosting VPS" --date 2026-09-01 --repeat monthly --encrypt
\\end{lstlisting}

\\subsection{2. Comando \\texttt{edit} -- Modifica & Cascading Sync}
\\textbf{Sintassi:} \\texttt{edit --id <id> [--title <str>] [--date <YYYY-MM-DD>] [--desc <str>] [--security <0|1|2>] [--encrypt]}
\\begin{lstlisting}[style=notulacli]
notula> edit --id n_17240012345 --title "Udienza Rinviata" --date 2026-10-15
\\end{lstlisting}

\\subsection{3. Comando \\texttt{export} -- Esportazione Multiformato}
\\textbf{Sintassi:} \\texttt{export [--id <id> | --all | --year <YYYY>] --format <json|xml|md|ics|pdf|txt>}
\\begin{lstlisting}[style=notulacli]
notula> export --all --format json
notula> export --year 2026 --format ics
notula> export --id n_17240012345 --format pdf
\\end{lstlisting}

\\subsection{4. Comando \\texttt{pdf} -- Generazione Documentale Ink-Friendly}
\\textbf{Sintassi:} \\texttt{pdf [--id <id>]}
\\begin{lstlisting}[style=notulacli]
notula> pdf --id n_17240012345
\\end{lstlisting}

\\subsection{5. Comando \\texttt{import} -- Iniezione Dati}
\\textbf{Sintassi:} \\texttt{import [--json <raw_string> | --xml <raw_string>]}
\\begin{lstlisting}[style=notulacli]
notula> import --json '[{"title":"Scadenza","expirationDate":"2026-11-30"}]'
notula> import
\\end{lstlisting}

\\subsection{6. Comando \\texttt{rm} -- 9 Modalità di Eliminazione Mirata}
\\textbf{Sintassi:} \\texttt{rm [--id <id>] [--group <groupID>] [--title <query>] [--expired] [--all] [--force]}
\\begin{lstlisting}[style=notulacli]
notula> rm --id n_17240012345
notula> rm --group grp_17240012345_abc
notula> rm --expired
notula> rm --all --force
\\end{lstlisting}

\\subsection{7. Comando \\texttt{passwd} -- Sicurezza & Master Passphrase}
\\textbf{Sintassi:} \\texttt{passwd <nuova_passphrase>}
\\begin{lstlisting}[style=notulacli]
notula> passwd MiaNuovaPasswordSicura2026!
\\end{lstlisting}

\\subsection{8. Comandi di Query & Diagnostica: \\texttt{ls}, \\texttt{show}, \\texttt{sync}, \\texttt{stats}}
\\begin{lstlisting}[style=notulacli]
notula> ls --year 2026 --expired
notula> show n_17240012345
notula> sync
notula> stats
\\end{lstlisting}

\\section{Licenza & Contatti}
\\textbf{Notula™ Memo Engine} è un'opera di ingegno ideata e sviluppata dall'\\textbf{Ing. Mario Fantini}.\\\\
Per documentazione, licenze personalizzate e supporto:\\\\
\\href{https://mariofantini.eu}{https://mariofantini.eu} -- \\texttt{marfant7@gmail.com}

\\end{document}
`;

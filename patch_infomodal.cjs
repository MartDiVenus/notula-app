const fs = require('fs');
let code = fs.readFileSync('src/components/InfoGuideModal.tsx', 'utf8');

code = code.replace(
  /'all' \| 'intro' \| 'features' \| 'legend' \| 'security' \| 'exports' \| 'sync' \| 'calendar' \| 'daily' \| 'cli'/g,
  `'all' | 'intro' | 'features' | 'legend' | 'security' | 'exports' | 'sync' | 'calendar' | 'daily' | 'gem' | 'cli'`
);

const dailyButtonEnd = `                >
                  {settings.language === "en" ? "7. Daily Operations" : "7. Operazioni Quotidiane"}
                </button>`;

const gemButton = `                >
                  {settings.language === "en" ? "7. Daily Operations" : "7. Operazioni Quotidiane"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('gem')}
                  className={\`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer \${
                    guideSection === 'gem' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }\`}
                >
                  {settings.language === "en" ? "8. GEM Filters" : "8. Filtri GEM"}
                </button>`;

code = code.replace(dailyButtonEnd, gemButton);

code = code.replace(
  /"8. CLI Terminal \(edit\/export\/import\)" \: "8. Terminale CLI \(edit\/export\/import\)"/g,
  `"9. CLI Terminal (edit/export/import)" : "9. Terminale CLI (edit/export/import)"`
);

code = code.replace(
  /\{\/\* 9. TERMINALE CLI \(RIGOROSAMENTE ALLA FINE PER UTENTI AVANZATI\) \*\/\}/g,
  `{/* 9. TERMINALE CLI (RIGOROSAMENTE ALLA FINE PER UTENTI AVANZATI) */}`
); // Just a no-op check, wait I need to insert the GEM section before it.

const cliSectionStart = `              {/* ------------------------------------------------------------- */}
              {/* 9. TERMINALE CLI (RIGOROSAMENTE ALLA FINE PER UTENTI AVANZATI) */}`;

const gemSection = `              {/* ------------------------------------------------------------- */}
              {/* 8. MOTORE DI RICERCA GEM E CATEGORIE */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'gem') && (
                <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <ListFilter className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "8. GEM Architecture & List Categories" : "8. Architettura GEM & Categorie di Ricerca"}</span>
                  </div>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    {settings.language === "en" 
                      ? "The application uses a specialized logic for categorizing standard (punctual) events vs recurring events." 
                      : "L'applicazione utilizza una logica specializzata per categorizzare gli eventi standard (puntuali) rispetto a quelli ricorrenti."}
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    {/* Puntuali */}
                    <div>
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{settings.language === "en" ? "Punctual Memos (Non-recurring)" : "Memo Puntuali (Non ricorrenti)"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">b. {settings.language === "en" ? "Year" : "Anno"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Filter by year only (e.g. 2026)." : "Filtra per il solo anno (es. 2026)."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">c. {settings.language === "en" ? "Y/M" : "A/M"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Filter by year and month." : "Filtra per anno e mese (es. Agosto 2026)."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">d. {settings.language === "en" ? "Y/M/D" : "A/M/G"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Filter by exact date." : "Filtra per data esatta (es. 15 Agosto 2026)."}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ricorrenti */}
                    <div>
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mb-2">
                        <Repeat className="w-4 h-4 text-emerald-500" />
                        <span>{settings.language === "en" ? "Recurring Memos (Eternal)" : "Memo Ricorrenti (Eterni)"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">e. {settings.language === "en" ? "All Recurring" : "Tutti i Ricorrenti"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows all repeating memos." : "Mostra tutti gli eventi con ricorrenza."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">f. {settings.language === "en" ? "Month (Yearly)" : "Mese (Annuali)"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows yearly recurrences falling in a specific month." : "Mostra le ricorrenze annuali (es. compleanni) in uno specifico mese."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">g. {settings.language === "en" ? "Day (Monthly)" : "Giorno (Mensili)"}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows monthly recurrences falling on a specific day." : "Mostra le ricorrenze mensili che cadono in un dato giorno."}</p>
                        </div>
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                          <span className="font-bold text-xs">h. {settings.language === "en" ? "Weekly/Daily" : "Sett./Giorn."}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{settings.language === "en" ? "Shows high-frequency recurring memos." : "Mostra gli eventi ad altissima frequenza."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 9. TERMINALE CLI (RIGOROSAMENTE ALLA FINE PER UTENTI AVANZATI) */}`;

code = code.replace(cliSectionStart, gemSection);

fs.writeFileSync('src/components/InfoGuideModal.tsx', code);
console.log('infomodal patched');

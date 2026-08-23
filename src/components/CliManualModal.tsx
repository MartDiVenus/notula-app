/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { 
  Terminal, 
  X, 
  BookOpen, 
  Search, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Printer, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Code2
} from 'lucide-react';
import { 
  CLI_COMMANDS_DOC, 
  CLI_MANUAL_VERSION, 
  CLI_MANUAL_DATE, 
  CLI_MANUAL_AUTHOR, 
  CLI_MANUAL_SITE,
  LATEX_CLI_MANUAL_SOURCE,
  CliCommandDoc
} from '../data/cliManualData';

interface CliManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CliManualModal: React.FC<CliManualModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'reference' | 'latex'>('reference');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCommands = CLI_COMMANDS_DOC.filter((cmd) => {
    const matchesCat = selectedCategory === 'all' || cmd.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      cmd.name.toLowerCase().includes(q) ||
      cmd.summary.toLowerCase().includes(q) ||
      cmd.syntax.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.options.some((opt) => opt.flag.toLowerCase().includes(q) || opt.desc.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadLatex = () => {
    const blob = new Blob([LATEX_CLI_MANUAL_SOURCE], { type: 'application/x-tex;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notula_cli_manual_v${CLI_MANUAL_VERSION}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-main)] border border-[var(--border-color)] w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--text-main)]">
        
        {/* Header */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-main)]">
                  Manuale Ufficiale NOTULA™ CLI
                </h2>
                <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold border border-emerald-500/30">
                  v{CLI_MANUAL_VERSION}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {settings.language === "en" ? "Engineering Specification & Syntax Reference of Shell Commands" : "Specifica Ingegneristica & Riferimento Sintattico dei Comandi Shell"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadLatex}
              title={settings.language === "en" ? "Download LaTeX Source (.tex)" : "Scarica Sorgente LaTeX (.tex)"}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-main)] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>{settings.language === "en" ? ".tex Source" : "Sorgente .tex"}</span>
            </button>

            <button
              onClick={handlePrint}
              title={settings.language === "en" ? "Print / Save as PDF" : "Stampa / Salva in PDF"}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-main)] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-500" />
              <span>{settings.language === "en" ? "Print / PDF" : "Stampa / PDF"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition cursor-pointer"
              title={settings.language === "en" ? "Close Manual" : "Chiudi Manuale"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] px-5 py-2 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('reference')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reference'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{settings.language === "en" ? "Command Reference & Syntax" : "Riferimento Comandi & Sintassi"}</span>
            </button>

            <button
              onClick={() => setActiveTab('latex')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'latex'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{settings.language === "en" ? "Academic LaTeX Source (.tex)" : "Sorgente LaTeX Accademico (.tex)"}</span>
            </button>
          </div>

          {activeTab === 'reference' && (
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={settings.language === "en" ? "Search command, flag or syntax..." : "Cerca comando, flag o sintassi..."}
                  className="w-full pl-8 pr-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {activeTab === 'reference' ? (
            <>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mr-1 shrink-0">
                  Filtro:
                </span>
                {[
                  { id: 'all', label: 'Tutti i Comandi' },
                  { id: 'core', label: 'Creazione & Modifica' },
                  { id: 'export_import', label: 'Esportazione & Import' },
                  { id: 'query', label: 'Query & Diagnostica' },
                  { id: 'security', label: 'Sicurezza & Cifratura' },
                  { id: 'system', label: 'Sistema & Shell' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Commands Grid */}
              <div className="space-y-4">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-[var(--text-muted)] space-y-2">
                    <p className="text-sm font-semibold">{settings.language === "en" ? "No command matches the search criteria." : "Nessun comando corrisponde ai criteri di ricerca."}</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Azzera filtri
                    </button>
                  </div>
                ) : (
                  filteredCommands.map((cmd) => (
                    <div 
                      key={cmd.name}
                      id={`cmd-${cmd.name}`}
                      className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3.5 transition hover:border-blue-500/40"
                    >
                      {/* Command Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                            {cmd.name}
                          </span>
                          <span className="text-xs font-bold text-[var(--text-main)]">
                            {cmd.summary}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)] self-start sm:self-auto">
                          Categoria: {cmd.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {cmd.description}
                      </p>

                      {/* Syntax Box */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {settings.language === "en" ? "Formal Syntax:" : "Sintassi Formale:"}
                        </div>
                        <div className="flex items-center justify-between bg-[#0d1117] text-gray-200 font-mono text-xs p-2.5 rounded-xl border border-[#30363d] overflow-x-auto">
                          <code className="text-cyan-300 select-all">{cmd.syntax}</code>
                          <button
                            onClick={() => handleCopy(cmd.syntax, `syntax-${cmd.name}`)}
                            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition shrink-0 ml-2 cursor-pointer"
                            title={settings.language === "en" ? "Copy syntax" : "Copia sintassi"}
                          >
                            {copiedCode === `syntax-${cmd.name}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Options Table */}
                      {cmd.options.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            {settings.language === "en" ? "Parameters & Options:" : "Parametri & Opzioni:"}
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            {cmd.options.map((opt) => (
                              <div 
                                key={opt.flag}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-amber-600 dark:text-amber-400">{opt.flag}</span>
                                  {opt.required && (
                                    <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                                      Obbligatorio
                                    </span>
                                  )}
                                </div>
                                <span className="font-sans text-[11px] text-[var(--text-muted)]">{opt.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Practical Examples */}
                      {cmd.examples.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Esempi Pratici di Esecuzione:
                          </div>
                          <div className="space-y-1">
                            {cmd.examples.map((ex, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between bg-[#0d1117] text-gray-200 font-mono text-[11px] px-3 py-2 rounded-lg border border-[#30363d]"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-emerald-500 font-bold">notula&gt;</span>
                                  <span className="text-gray-100 truncate select-all">{ex}</span>
                                </div>
                                <button
                                  onClick={() => handleCopy(ex, `ex-${cmd.name}-${idx}`)}
                                  className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition shrink-0 ml-2 cursor-pointer"
                                  title={settings.language === "en" ? "Copy command" : "Copia comando"}
                                >
                                  {copiedCode === `ex-${cmd.name}-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Notes */}
                      {cmd.notes && (
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-[var(--text-muted)] space-y-1">
                          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{settings.language === "en" ? "Engineering Architectural Note:" : "Nota Architetturale Ingegneristica:"}</span>
                          </div>
                          <p>{cmd.notes}</p>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* LaTeX Source Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-500" />
                    <span>{settings.language === "en" ? "Official Formatted LaTeX Source (.tex)" : "Sorgente Formattato Ufficiale LaTeX (.tex)"}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {settings.language === "en" ? "Ready to compile with" : "Pronto per la compilazione con"} <code className="font-mono">pdflatex</code> o <code className="font-mono">xelatex</code> {settings.language === "en" ? "to generate the perfectly printed academic PDF." : "per generare il PDF accademico a stampa perfetta."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(LATEX_CLI_MANUAL_SOURCE, 'all-latex')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === 'all-latex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'all-latex' ? 'Copiato!' : 'Copia Sorgente .tex'}</span>
                  </button>

                  <button
                    onClick={handleDownloadLatex}
                    className="px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                    <span>{settings.language === "en" ? "Download .tex" : "Scarica .tex"}</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0d1117] text-gray-200 font-mono text-xs p-4 rounded-2xl border border-[#30363d] overflow-x-auto max-h-[58vh]">
                <pre className="text-gray-300 select-all leading-relaxed whitespace-pre-wrap">
                  {LATEX_CLI_MANUAL_SOURCE}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[var(--bg-subtle)] border-t border-[var(--border-color)] px-5 py-3.5 flex items-center justify-between gap-4 shrink-0 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>&copy; 2026 {CLI_MANUAL_AUTHOR}</span>
            <span>&bull;</span>
            <a 
              href={CLI_MANUAL_SITE} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline flex items-center gap-1"
            >
              <span>{CLI_MANUAL_SITE.replace('https://', '')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Chiudi Manuale
          </button>
        </div>

      </div>
    </div>
  );
};

const fs = require('fs');
let code = fs.readFileSync('src/components/ListSubmenu.tsx', 'utf8');

const tabStart = `        {/* Tab Selector for categories`;
const tabEnd = `          </div>

          {/* Conditional Filters depending on category */}`;

const oldTabs = code.substring(code.indexOf(tabStart), code.indexOf(tabEnd) + tabEnd.length - 75);

const newTabs = `        {/* Tab Selector for categories a-i */}
        <div className="p-6 pb-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 bg-[var(--bg-subtle)] p-1.5 rounded-xl border border-[var(--border-color)] text-[11px] xl:text-xs">
            <button
              onClick={() => setListCategory('a')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'a'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "a. All Memos" : "a. Tutti"}
            </button>
            <button
              onClick={() => setListCategory('b')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'b'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "b. Year (Punctual)" : "b. Anno (Puntuali)"}
            </button>
            <button
              onClick={() => setListCategory('c')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'c'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "c. Y/M (Punctual)" : "c. A/M (Puntuali)"}
            </button>
            <button
              onClick={() => setListCategory('d')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'd'
                  ? 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "d. Y/M/D (Punctual)" : "d. A/M/G (Puntuali)"}
            </button>
            <button
              onClick={() => setListCategory('e')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'e'
                  ? 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "e. All Recurring" : "e. Tutti i Ricorrenti"}
            </button>
            <button
              onClick={() => setListCategory('f')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'f'
                  ? 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "f. Month (Yearly)" : "f. Mese (Annuali)"}
            </button>
            <button
              onClick={() => setListCategory('g')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'g'
                  ? 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "g. Day (Monthly)" : "g. Giorno (Mensili)"}
            </button>
            <button
              onClick={() => setListCategory('h')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'h'
                  ? 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "h. Weekly/Daily" : "h. Sett./Giorn."}
            </button>
            <button
              onClick={() => setListCategory('i')}
              className={\`p-2 rounded-lg font-semibold transition text-center \${
                listCategory === 'i'
                  ? 'bg-[var(--bg-card)] text-red-600 dark:text-red-400 shadow-sm border border-[var(--border-color)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }\`}
            >
              {settings.language === "en" ? "i. Expired" : "i. Scaduti"}
            </button>
          </div>`;

code = code.replace(oldTabs, newTabs);
fs.writeFileSync('src/components/ListSubmenu.tsx', code);
console.log('tabs patched');

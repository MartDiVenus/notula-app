const fs = require('fs');
let code = fs.readFileSync('src/components/SearchSubmenu.tsx', 'utf8');

// Fix grid-cols-3 to grid-cols-1 sm:grid-cols-3
code = code.replace(
  /className="grid grid-cols-3 gap-2 bg-\[var\(--bg-subtle\)\] p-1\.5 rounded-xl border border-\[var\(--border-color\)\]"/,
  'className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[var(--bg-subtle)] p-1.5 rounded-xl border border-[var(--border-color)]"'
);

// Fix flex gap-3 to flex-col sm:flex-row
code = code.replace(
  /className="flex gap-3 items-center"/,
  'className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"'
);

// Make the select container take full width on mobile
code = code.replace(
  /<div className="flex items-center gap-1 bg-\[var\(--bg-subtle\)\] p-1 rounded-xl border border-\[var\(--border-color\)\]">/,
  '<div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)] w-full sm:w-auto">'
);

// Make select text truncate or flex-1 so it looks good on full width
code = code.replace(
  /<select\n                value=\{filterType\}\n                onChange=\{\(e\) => setFilterType\(e\.target\.value as any\)\}\n                className="bg-transparent text-xs text-\[var\(--text-main\)\] font-semibold py-1\.5 px-2 focus:outline-none cursor-pointer"\n              >/,
  `<select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-transparent text-xs text-[var(--text-main)] font-semibold py-1.5 px-2 focus:outline-none cursor-pointer flex-1 w-full"
              >`
);

fs.writeFileSync('src/components/SearchSubmenu.tsx', code);
console.log('patched');

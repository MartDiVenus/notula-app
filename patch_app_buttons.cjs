const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => \{ setInitialListCategory\('h'\); setIsListOpen\(true\); \}\}\n              className="w-full flex items-center justify-between px-3 py-2 text-\[var\(--text-muted\)\] hover:bg-\[var\(--bg-card\)\] hover:text-\[var\(--text-main\)\] rounded-lg transition text-xs font-semibold text-left"/g,
  `onClick={() => { setInitialListCategory('e'); setIsListOpen(true); }}\n              className="w-full flex items-center justify-between px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-xs font-semibold text-left"`
);

code = code.replace(
  /onClick=\{\(\) => \{ setInitialListCategory\('g'\); setIsListOpen\(true\); \}\}\n              className="w-full flex items-center justify-between px-3 py-2 text-\[var\(--text-muted\)\] hover:bg-\[var\(--bg-card\)\] hover:text-\[var\(--text-main\)\] rounded-lg transition text-xs font-semibold text-left"/g,
  `onClick={() => { setInitialListCategory('i'); setIsListOpen(true); }}\n              className="w-full flex items-center justify-between px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-xs font-semibold text-left"`
);

fs.writeFileSync('src/App.tsx', code);
console.log('app patched');

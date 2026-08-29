const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setIsListOpen\(true\)\}\n              className="w-full flex items-center justify-between px-3 py-2 bg-blue-600\/10/g,
  `onClick={() => { setInitialListCategory('a'); setIsListOpen(true); }}\n              className="w-full flex items-center justify-between px-3 py-2 bg-blue-600/10`
);

code = code.replace(
  /onClick=\{\(\) => setIsListOpen\(true\)\}\n              className="w-full flex items-center justify-between px-3 py-2 text-\[var\(--text-muted\)\] hover:bg-\[var\(--bg-card\)\] hover:text-\[var\(--text-main\)\] rounded-lg transition text-xs font-semibold text-left"\n            >\n              <div className="flex items-center gap-2.5">\n                <FolderLock/g,
  `onClick={() => { setInitialListCategory('h'); setIsListOpen(true); }}\n              className="w-full flex items-center justify-between px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-xs font-semibold text-left"\n            >\n              <div className="flex items-center gap-2.5">\n                <FolderLock`
);

code = code.replace(
  /onClick=\{\(\) => setIsListOpen\(true\)\}\n              className="w-full flex items-center justify-between px-3 py-2 text-\[var\(--text-muted\)\] hover:bg-\[var\(--bg-card\)\] hover:text-\[var\(--text-main\)\] rounded-lg transition text-xs font-semibold text-left"\n            >\n              <div className="flex items-center gap-2.5">\n                <Trash2/g,
  `onClick={() => { setInitialListCategory('g'); setIsListOpen(true); }}\n              className="w-full flex items-center justify-between px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] rounded-lg transition text-xs font-semibold text-left"\n            >\n              <div className="flex items-center gap-2.5">\n                <Trash2`
);

fs.writeFileSync('src/App.tsx', code);

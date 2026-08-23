const fs = require('fs');

const filesToFix = [
  'src/components/CalendarView.tsx',
  'src/components/CliManualModal.tsx',
  'src/components/CloudSyncModal.tsx',
  'src/components/ExportModal.tsx',
  'src/components/MemoFormModal.tsx',
  'src/components/PrintModal.tsx',
  'src/components/SecurityModal.tsx',
  'src/components/ListSubmenu.tsx',
  'src/components/SearchSubmenu.tsx',
  'src/components/TerminalCLI.tsx'
];

for (const file of filesToFix) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/\\nimport { useSettings }/g, "\nimport { useSettings }");
  fs.writeFileSync(file, content, 'utf-8');
}

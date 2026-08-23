const fs = require('fs');
const path = require('path');

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
  
  if (!content.includes('useSettings')) {
    // Determine relative path to contexts
    let importPath = '../contexts/SettingsContext';
    if (file.includes('SettingsModal')) {
      importPath = '../../contexts/SettingsContext';
    }
    
    // Add import after first import
    content = content.replace(/import React[^;]+;/, `$&\\nimport { useSettings } from '${importPath}';`);
    
    // Add const { settings } = useSettings(); inside the component
    // Need to find the component signature.
    // Export const Component: React.FC... = (...) => {
    // Or function Component(...) {
    const fcRegex = /(const \w+: React\.FC<[^>]*> = \([^)]*\) => {)/;
    const fnRegex = /(export function \w+\([^)]*\) {)/;
    const arrowRegex = /(const \w+ = \([^)]*\) => {)/;
    
    if (fcRegex.test(content)) {
      content = content.replace(fcRegex, `$1\n  const { settings } = useSettings();`);
    } else if (fnRegex.test(content)) {
      content = content.replace(fnRegex, `$1\n  const { settings } = useSettings();`);
    } else if (arrowRegex.test(content)) {
      content = content.replace(arrowRegex, `$1\n  const { settings } = useSettings();`);
    }
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Fixed ${file}`);
  }
}

const fs = require('fs');
const filesToFix = [
  'src/components/ConflictModal.tsx',
  'src/components/InfoGuideModal.tsx'
];

for (const file of filesToFix) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  
  if (!content.includes('useSettings')) {
    let importPath = '../contexts/SettingsContext';
    
    // Add import after first import
    content = content.replace(/import React[^;]+;/, `$&\\nimport { useSettings } from '${importPath}';`);
    content = content.replace(/\\nimport { useSettings }/g, "\nimport { useSettings }");
    
    const fcRegex = /(const \w+: React\.FC<[^>]*> = \([^)]*\) => {)/;
    
    if (fcRegex.test(content)) {
      content = content.replace(fcRegex, `$1\n  const { settings } = useSettings();`);
    }
    
    fs.writeFileSync(file, content, 'utf-8');
  }
}

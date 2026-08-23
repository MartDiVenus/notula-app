const fs = require('fs');
let content = fs.readFileSync('src/components/DeleteSubmenu.tsx', 'utf-8');

if (!content.includes('useSettings')) {
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useSettings } from '../contexts/SettingsContext';")
    content = content.replace("}) => {", "}) => {\n  const { settings } = useSettings();")
    fs.writeFileSync('src/components/DeleteSubmenu.tsx', content, 'utf-8');
}

const fs = require('fs');
let content = fs.readFileSync('src/i18n/translations.ts', 'utf-8');
content = content.replace(/\(settings\.language === 'en' \? '.*?' : '(.*?)'\)/g, "'$1'");
content = content.replace(/\{settings\.language === 'en' \? '.*?' : '(.*?)'\}/g, "'$1'");
fs.writeFileSync('src/i18n/translations.ts', content, 'utf-8');

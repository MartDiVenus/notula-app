const fs = require('fs');
let code = fs.readFileSync('src/components/ListSubmenu.tsx', 'utf8');

code = code.replace(
  /<\/button>\n          <\/div>\n        <\/div>\n\n          \{\/\* Conditional Filters depending on category \*\/\}/g,
  `</button>\n          </div>\n\n          {/* Conditional Filters depending on category */}`
);

fs.writeFileSync('src/components/ListSubmenu.tsx', code);

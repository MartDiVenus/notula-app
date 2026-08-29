const fs = require('fs');
let code = fs.readFileSync('src/components/ListSubmenu.tsx', 'utf8');

code = code.replace(
  /\{\['b', 'c', 'd', 'e', 'f'\]\.includes\(listCategory\) && \(/g,
  `{['b', 'c', 'd', 'f', 'g'].includes(listCategory) && (`
);

code = code.replace(
  /\{\['b', 'c', 'e'\]\.includes\(listCategory\) && \(/g,
  `{['b', 'c', 'd'].includes(listCategory) && (`
);

code = code.replace(
  /\{\['c', 'd', 'e', 'f'\]\.includes\(listCategory\) && \(/g,
  `{['c', 'd', 'f'].includes(listCategory) && (`
);

code = code.replace(
  /\{\['e', 'f'\]\.includes\(listCategory\) && \(/g,
  `{['d', 'g'].includes(listCategory) && (`
);

fs.writeFileSync('src/components/ListSubmenu.tsx', code);
console.log('inputs patched');

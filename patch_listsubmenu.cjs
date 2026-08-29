const fs = require('fs');
let code = fs.readFileSync('src/components/ListSubmenu.tsx', 'utf8');

code = code.replace(
  /initialCategory\?\: 'a' \| 'b' \| 'c' \| 'd' \| 'e' \| 'f' \| 'g' \| 'h';/g,
  `initialCategory?: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i';`
);

code = code.replace(
  /const \[listCategory, setListCategory\] = useState<'a' \| 'b' \| 'c' \| 'd' \| 'e' \| 'f' \| 'g' \| 'h'>\('a'\);/g,
  `const [listCategory, setListCategory] = useState<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i'>('a');`
);

const switchStart = `    switch (listCategory) {`;
const switchEnd = `      default:
        return core.listAll();
    }`;

const oldSwitch = code.substring(code.indexOf(switchStart), code.indexOf(switchEnd) + switchEnd.length);
const newSwitch = `    switch (listCategory) {
      case 'a':
        return core.listAll();
      case 'b':
        return core.listPunctualByYear(yearVal);
      case 'c':
        return core.listPunctualByYearMonth(yearVal, monthVal);
      case 'd':
        return core.listPunctualByDate(yearVal, monthVal, dayVal);
      case 'e':
        return core.listAllRecurring();
      case 'f':
        return core.listYearlyRecurringByMonth(monthVal);
      case 'g':
        return core.listMonthlyRecurringByDay(dayVal);
      case 'h':
        return core.listWeeklyDailyRecurring();
      case 'i':
        return core.listExpiredNonEternal();
      default:
        return core.listAll();
    }`;

code = code.replace(oldSwitch, newSwitch);

code = code.replace(
  /"Memo List \(GEM a-z\)" \: 'Elenco Memo \(GEM a-g\)'/g,
  `"Memo List (GEM a-i)" : 'Elenco Memo (GEM a-i)'`
);

fs.writeFileSync('src/components/ListSubmenu.tsx', code);
console.log('patched parts 1');

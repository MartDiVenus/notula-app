const fs = require('fs');
let code = fs.readFileSync('src/utils/notulaCore.ts', 'utf8');

const oldMethods = `  // b. Per anno (non eterni)
  public listByYearNonEternal(year: string): MemoItem[] {
    const yStr = String(year).trim();
    return this.memos.filter(m => m.repeatType === 'none' && m.year === yStr);
  }

  // c. Per anno e mese (non eterni)
  public listByYearAndMonthNonEternal(year: string, month: string): MemoItem[] {
    const yStr = String(year).trim();
    const mStr = String(month).padStart(2, '0');
    return this.memos.filter(m => m.repeatType === 'none' && m.year === yStr && m.month === mStr);
  }

  // d. Per mese (eterni)
  public listByMonthEternal(month: string): MemoItem[] {
    const mStr = String(month).padStart(2, '0');
    return this.memos.filter(m => m.repeatType !== 'none' && m.month === mStr);
  }

  // e. Per data completa (anno, mese, giorno non eterni)
  public listByExactDateNonEternal(year: string, month: string, day: string): MemoItem[] {
    const yStr = String(year).trim();
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return this.memos.filter(m => m.repeatType === 'none' && m.year === yStr && m.month === mStr && m.day === dStr);
  }

  // f. Per mese e giorno (eterni)
  public listByMonthAndDayEternal(month: string, day: string): MemoItem[] {
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return this.memos.filter(m => m.repeatType !== 'none' && m.month === mStr && m.day === dStr);
  }

  // g. Memo scaduti (non eterni)
  public listExpiredNonEternal(): MemoItem[] {
    const today = new Date();
    const todayStr = \`\${today.getFullYear()}-\${String(today.getMonth() + 1).padStart(2, '0')}-\${String(today.getDate()).padStart(2, '0')}\`;
    return this.memos.filter(m => m.repeatType === 'none' && m.expirationDate < todayStr);
  }`;

const newMethods = `  // b. Per anno (puntuali)
  public listPunctualByYear(year: string): MemoItem[] {
    const yStr = String(year).trim();
    return this.memos.filter(m => m.repeatType === 'none' && m.year === yStr);
  }

  // c. Per anno e mese (puntuali)
  public listPunctualByYearMonth(year: string, month: string): MemoItem[] {
    const yStr = String(year).trim();
    const mStr = String(month).padStart(2, '0');
    return this.memos.filter(m => m.repeatType === 'none' && m.year === yStr && m.month === mStr);
  }

  // d. Per data esatta (puntuali)
  public listPunctualByDate(year: string, month: string, day: string): MemoItem[] {
    const yStr = String(year).trim();
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return this.memos.filter(m => m.repeatType === 'none' && m.year === yStr && m.month === mStr && m.day === dStr);
  }

  // e. Tutti i ricorrenti
  public listAllRecurring(): MemoItem[] {
    return this.memos.filter(m => m.repeatType !== 'none');
  }

  // f. Ricorrenti Annuali (filtro per Mese)
  public listYearlyRecurringByMonth(month: string): MemoItem[] {
    const mStr = String(month).padStart(2, '0');
    return this.memos.filter(m => m.repeatType === 'yearly' && m.month === mStr);
  }

  // g. Ricorrenti Mensili (filtro per Giorno)
  public listMonthlyRecurringByDay(day: string): MemoItem[] {
    const dStr = String(day).padStart(2, '0');
    return this.memos.filter(m => m.repeatType === 'monthly' && m.day === dStr);
  }

  // h. Ricorrenti Settimanali/Giornalieri
  public listWeeklyDailyRecurring(): MemoItem[] {
    return this.memos.filter(m => m.repeatType === 'weekly' || m.repeatType === 'daily');
  }

  // i. Scaduti
  public listExpiredNonEternal(): MemoItem[] {
    const today = new Date();
    const todayStr = \`\${today.getFullYear()}-\${String(today.getMonth() + 1).padStart(2, '0')}-\${String(today.getDate()).padStart(2, '0')}\`;
    return this.memos.filter(m => m.repeatType === 'none' && m.expirationDate < todayStr);
  }`;

if (code.includes('listByYearNonEternal')) {
  code = code.replace(oldMethods, newMethods);
  fs.writeFileSync('src/utils/notulaCore.ts', code);
  console.log('patched');
} else {
  console.log('not found');
}

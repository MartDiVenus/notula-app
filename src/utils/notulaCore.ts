/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import { MemoItem, RepeatType, ObfuscationLevel, DayAnalysis } from '../types';

export function generateMemoId(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `n_${timestamp}-${rand}`;
}

export function generateGroupId(): string {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `grp_${timestamp}_${rand}`;
}

export function getLocalYYYYMMDD(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export class NotulaCore {
  private memos: MemoItem[] = [];

  constructor(initialMemos: MemoItem[] = []) {
    this.memos = [...initialMemos];
  }

  public getMemos(): MemoItem[] {
    return [...this.memos];
  }

  public setMemos(memos: MemoItem[]): void {
    this.memos = [...memos];
  }

  // ==========================================
  // 1. CREA MEMO
  // ==========================================
  public createMemo(params: {
    title: string;
    description?: string;
    expirationDate: string; // YYYY-MM-DD
    time?: string; // HH:MM
    repeatType?: RepeatType;
    obfuscation?: ObfuscationLevel;
    isEncrypted?: boolean;
    groupId?: string;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
    gCalEventId?: string;
  }): MemoItem {
    if (!params.title || !params.title.trim()) {
      throw new Error("Il titolo del memo è obbligatorio.");
    }
    if (!params.expirationDate) {
      throw new Error("La data del memo è obbligatoria.");
    }

    const [year, month, day] = params.expirationDate.split('-');
    if (!year || !month || !day) {
      throw new Error("Formato data non valido. Usa YYYY-MM-DD.");
    }

    // Se è un memo ricorrente e non ha ancora un groupId, glielo assegniamo
    const resolvedGroupId = params.groupId || (params.repeatType && params.repeatType !== 'none' ? generateGroupId() : undefined);

    const newMemo: MemoItem = {
      id: generateMemoId(),
      groupId: resolvedGroupId,
      title: params.title.trim(),
      description: params.description?.trim() || '',
      expirationDate: params.expirationDate,
      year: year,
      month: month.padStart(2, '0'),
      day: day.padStart(2, '0'),
      repeatType: params.repeatType || 'none',
      obfuscation: params.obfuscation || 'none',
      isEncrypted: !!params.isEncrypted,
      gCalSync: params.gCalSync,
      alertDaysBefore: params.alertDaysBefore,
      alertTime: params.alertTime,
      gCalEventId: params.gCalEventId,
      createdAt: new Date().toISOString(),
    };

    this.memos = [newMemo, ...this.memos];
    return newMemo;
  }

  /**
   * Crea o clona una serie di memo correlati con un groupId condiviso
   */
  public createRecurringSeries(params: {
    title: string;
    description?: string;
    startDate: string; // YYYY-MM-DD
    count: number;
    stepDays: number;
    repeatType?: RepeatType;
    obfuscation?: ObfuscationLevel;
    isEncrypted?: boolean;
  }): MemoItem[] {
    const groupId = generateGroupId();
    const createdList: MemoItem[] = [];
    const baseDate = new Date(params.startDate);

    for (let i = 0; i < params.count; i++) {
      const current = new Date(baseDate);
      current.setDate(baseDate.getDate() + i * params.stepDays);
      const dateStr = current.toISOString().split('T')[0];
      const [year, month, day] = dateStr.split('-');

      const memo: MemoItem = {
        id: generateMemoId(),
        groupId: groupId,
        title: params.title.trim(),
        description: params.description?.trim() || '',
        expirationDate: dateStr,
        year: year,
        month: month.padStart(2, '0'),
        day: day.padStart(2, '0'),
        repeatType: params.repeatType || 'none',
        obfuscation: params.obfuscation || 'none',
        isEncrypted: !!params.isEncrypted,
        createdAt: new Date().toISOString(),
      };

      createdList.push(memo);
    }

    this.memos = [...createdList, ...this.memos];
    return createdList;
  }

  // ==========================================
  // 2. ELIMINA MEMO (9 Modalità GEM + Gruppo)
  // ==========================================

  // 1. Rimuovi memo per anno (non eterni)
  public removeByYearNonEternal(year: string): number {
    const yStr = String(year).trim();
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !(m.repeatType === 'none' && m.year === yStr));
    return prevCount - this.memos.length;
  }

  // 2. Rimuovi memo per anno e per mese (non eterni)
  public removeByYearAndMonthNonEternal(year: string, month: string): number {
    const yStr = String(year).trim();
    const mStr = String(month).padStart(2, '0');
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !(m.repeatType === 'none' && m.year === yStr && m.month === mStr));
    return prevCount - this.memos.length;
  }

  // 3. Rimuovi memo per anno, per mese e per giorno (non eterni)
  public removeByYearMonthDayNonEternal(year: string, month: string, day: string): number {
    const yStr = String(year).trim();
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !(m.repeatType === 'none' && m.year === yStr && m.month === mStr && m.day === dStr));
    return prevCount - this.memos.length;
  }

  // 4. Rimuovi memo per titolo
  public removeByTitle(title: string): number {
    const tStr = title.trim().toLowerCase();
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => m.title.toLowerCase() !== tStr);
    return prevCount - this.memos.length;
  }

  // 5. Rimuovi memo scaduti (non eterni)
  public removeExpiredNonEternal(): number {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !(m.repeatType === 'none' && m.expirationDate < todayStr));
    return prevCount - this.memos.length;
  }

  // 6. Rimuovi i memo per mese (eterni)
  public removeByMonthEternal(month: string): number {
    const mStr = String(month).padStart(2, '0');
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !(m.repeatType !== 'none' && m.month === mStr));
    return prevCount - this.memos.length;
  }

  // 7. Rimuovi i memo per mese e giorno (eterni)
  public removeByMonthAndDayEternal(month: string, day: string): number {
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !(m.repeatType !== 'none' && m.month === mStr && m.day === dStr));
    return prevCount - this.memos.length;
  }

  // 8. Rimuovi tutti i memo (eterni e non eterni)
  public removeAll(): number {
    const count = this.memos.length;
    this.memos = [];
    return count;
  }

  // 9. Rimuovi memo per IDs
  public removeByIds(ids: string[]): number {
    const targetSet = new Set(ids.map(id => id.trim()));
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => !targetSet.has(m.id));
    return prevCount - this.memos.length;
  }

  // Rimuovi tutti i memo di uno specifico GroupID
  public removeByGroupId(groupId: string): number {
    if (!groupId) return 0;
    const prevCount = this.memos.length;
    this.memos = this.memos.filter(m => m.groupId !== groupId);
    return prevCount - this.memos.length;
  }

  // ==========================================
  // 3. TROVA MEMO (3 Modalità GEM)
  // ==========================================

  // 1. Per data
  public findByDate(dateStr: string): MemoItem[] {
    const normalized = dateStr.trim();
    return this.memos.filter(m => this.isMemoApplicableToDate(m, normalized));
  }

  // 2. Per titolo o chiave testuale
  public findByText(query: string): MemoItem[] {
    if (!query || !query.trim()) return [...this.memos];
    const q = query.toLowerCase().trim();
    return this.memos.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      m.id.toLowerCase().includes(q) ||
      (m.groupId && m.groupId.toLowerCase().includes(q))
    );
  }

  // 3. Per IDs
  public findByIds(ids: string[]): MemoItem[] {
    const idSet = new Set(ids.map(id => id.trim().toLowerCase()));
    return this.memos.filter(m => idSet.has(m.id.toLowerCase()));
  }

  public getGroupMemos(groupId: string): MemoItem[] {
    if (!groupId) return [];
    return this.memos.filter(m => m.groupId === groupId);
  }

  // ==========================================
  // 4. INFO MEMO
  // ==========================================
  public getMemoInfo(id: string): MemoItem | null {
    return this.memos.find(m => m.id.toLowerCase() === id.trim().toLowerCase()) || null;
  }

  // ==========================================
  // 5. ELENCA MEMO (a-g Modalità GEM)
  // ==========================================

  // a. Tutti i memo
  public listAll(): MemoItem[] {
    return [...this.memos];
  }

  // b. Per anno (puntuali)
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
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return this.memos.filter(m => m.repeatType === 'none' && m.expirationDate < todayStr);
  }

  // ==========================================
  // 6. MODIFICA & AGGIORNAMENTO MEMO (con supporto GroupID)
  // ==========================================
  public updateMemo(params: {
    id: string;
    title?: string;
    description?: string;
    expirationDate?: string;
    time?: string;
    repeatType?: RepeatType;
    obfuscation?: ObfuscationLevel;
    isEncrypted?: boolean;
    groupId?: string;
    updateEntireGroup?: boolean;
  }): MemoItem | null {
    const idx = this.memos.findIndex(m => m.id === params.id);
    if (idx === -1) return null;

    const current = this.memos[idx];
    const expDate = params.expirationDate || current.expirationDate;
    const [year, month, day] = expDate.split('-');

    const updated: MemoItem = {
      ...current,
      title: params.title !== undefined ? params.title.trim() : current.title,
      description: params.description !== undefined ? params.description.trim() : current.description,
      expirationDate: expDate,
      time: params.time !== undefined ? params.time : current.time,
      year: year || current.year,
      month: (month ? month.padStart(2, '0') : current.month),
      day: (day ? day.padStart(2, '0') : current.day),
      repeatType: params.repeatType !== undefined ? params.repeatType : current.repeatType,
      obfuscation: params.obfuscation !== undefined ? params.obfuscation : current.obfuscation,
      isEncrypted: params.isEncrypted !== undefined ? params.isEncrypted : current.isEncrypted,
      groupId: params.groupId !== undefined ? params.groupId : current.groupId,
      updatedAt: new Date().toISOString(),
    };

    this.memos[idx] = updated;

    // AGGIORNAMENTO AUTOMATICO A CASCATA:
    // Se il memo appartiene a un gruppo ricorrente (groupId), sincronizza automaticamente tutta la serie
    if (updated.groupId && params.updateEntireGroup !== false) {
      this.memos = this.memos.map(m => {
        if (m.groupId === updated.groupId && m.id !== updated.id) {
          return {
            ...m,
            title: updated.title,
            description: updated.description,
            obfuscation: updated.obfuscation,
            isEncrypted: updated.isEncrypted,
            repeatType: updated.repeatType,
            updatedAt: new Date().toISOString(),
          };
        }
        return m;
      });
    }

    return updated;
  }

  // ==========================================
  // CALENDAR & DATE MATCHING ENGINE
  // ==========================================
  public isMemoApplicableToDate(memo: MemoItem, dateStr: string): boolean {
    const [targetYear, targetMonth, targetDay] = dateStr.split('-');

    if (memo.repeatType === 'none') {
      return memo.expirationDate === dateStr;
    }
    if (memo.repeatType === 'yearly') {
      return memo.month === targetMonth && memo.day === targetDay;
    }
    if (memo.repeatType === 'monthly') {
      return memo.day === targetDay;
    }
    if (memo.repeatType === 'weekly') {
      const dTarget = new Date(dateStr).getTime();
      const dOrigin = new Date(memo.expirationDate).getTime();
      const diffDays = Math.floor((dTarget - dOrigin) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays % 7 === 0;
    }
    if (memo.repeatType === 'daily') {
      return dateStr >= memo.expirationDate;
    }

    return false;
  }

  public getMemosForDay(year: number, month: number, day: number): MemoItem[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.memos.filter(m => this.isMemoApplicableToDate(m, dateStr));
  }

  public analyzeDay(year: number, month: number, day: number, todayStr: string): DayAnalysis {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMemos = this.memos.filter(m => this.isMemoApplicableToDate(m, dateStr));

    const isToday = dateStr === todayStr;
    const count = dayMemos.length;

    const punctuals = dayMemos.filter(m => m.repeatType === 'none');
    const recurring = dayMemos.filter(m => m.repeatType !== 'none');

    const punctualExpired = punctuals.some(m => m.expirationDate < todayStr);
    const punctualToday = punctuals.some(m => m.expirationDate === todayStr);
    const punctualFuture = punctuals.some(m => m.expirationDate > todayStr);

    const recurringExpired = recurring.some(m => dateStr < todayStr);
    const recurringActive = recurring.length > 0;

    return {
      isToday,
      dateStr,
      count,
      hasPunctual: punctuals.length > 0,
      hasRecurring: recurring.length > 0,
      punctualExpired,
      punctualToday,
      punctualFuture,
      recurringActive,
      recurringExpired,
      memos: dayMemos,
    };
  }
}

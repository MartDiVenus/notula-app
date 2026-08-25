/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ObfuscationLevel = 'none' | 'partial' | 'full';

export const REPEAT_LABELS_EN: Record<RepeatType, string> = {
  none: 'one-time',
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
};

export const REPEAT_LABELS_IT: Record<RepeatType, string> = {
  none: 'puntuale',
  daily: 'giornaliero',
  weekly: 'settimanale',
  monthly: 'mensile',
  yearly: 'annuale',
};

export interface MemoItem {
  id: string;
  groupId?: string; // ID di correlazione di gruppo per sincronizzare modifiche a cascata su eventi ricorrenti/clonati
  title: string;
  description?: string;
  expirationDate: string; // YYYY-MM-DD
  time?: string; // HH:MM
  year: string;
  month: string;
  day: string;
  repeatType: RepeatType;
  obfuscation: ObfuscationLevel;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  isEncrypted?: boolean;
  gCalEventId?: string;
  gCalSync?: boolean;
  alertDaysBefore?: number;
  alertTime?: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export type ConflictResolutionOption = 'yes' | 'all' | 'ignore' | 'merge';

export interface ConflictPrompt {
  incomingMemo: MemoItem;
  existingMemo: MemoItem;
  remainingCount: number;
}

export interface DayAnalysis {
  isToday: boolean;
  dateStr: string;
  count: number;
  hasPunctual: boolean;
  hasRecurring: boolean;
  punctualExpired: boolean;
  punctualToday: boolean;
  punctualFuture: boolean;
  recurringActive: boolean;
  recurringExpired: boolean;
  memos: MemoItem[];
}

export interface DriveConfig {
  clientId: string;
  autoSync: boolean;
  backupFileName: string;
  lastSyncedAt?: string;
}

export interface FilterCriteria {
  mode: 'all' | 'date' | 'title' | 'id' | 'year' | 'month' | 'day' | 'recurring' | 'expired' | 'group';
  value?: string;
  year?: string;
  month?: string;
  day?: string;
  recurringOnly?: boolean;
  groupId?: string;
}

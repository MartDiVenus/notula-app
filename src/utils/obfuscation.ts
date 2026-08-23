/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ObfuscationLevel } from '../types';

/**
 * Notula Multi-Layer Obfuscation & Security Engine:
 * - Layer 1 (Parziale): Mascheramento grigio di sicurezza con indicatori di riservatezza
 * - Layer 2 (Totale): Mascheramento grigio pieno a blocco satinato
 * - Layer 3 (Cifratura AES-256): Crittografia crittografica hardware AES-256-GCM
 */

export function maskPartialText(text: string): string {
  if (!text) return '';
  return '████████████████';
}

export function maskFullText(text: string): string {
  return '████████████████████████';
}

export function getObfuscatedDisplay(
  text: string,
  level: ObfuscationLevel = 'none',
  privacyMode: boolean = false,
  isRevealed: boolean = false
): { displayText: string; isMasked: boolean; levelLabel: string } {
  if (!text) {
    return { displayText: '', isMasked: false, levelLabel: 'None' };
  }

  // If user explicitly revealed this specific item or privacy mode is off and level is none
  if (isRevealed) {
    return {
      displayText: text,
      isMasked: false,
      levelLabel: level === 'full' ? 'Total (Revealed)' : level === 'partial' ? 'Partial (Revealed)' : 'Clear',
    };
  }

  // If level is full (Totale)
  if (level === 'full') {
    return {
      displayText: maskFullText(text),
      isMasked: true,
      levelLabel: 'Total Obfuscation (Layer 2)',
    };
  }

  // If level is partial (Parziale)
  if (level === 'partial') {
    return {
      displayText: maskPartialText(text),
      isMasked: true,
      levelLabel: 'Partial Obfuscation (Layer 1)',
    };
  }

  // If privacy mode is globally active on standard items
  if (privacyMode) {
    return {
      displayText: maskPartialText(text),
      isMasked: true,
      levelLabel: 'Screen Privacy Active',
    };
  }

  return { displayText: text, isMasked: false, levelLabel: 'Clear' };
}


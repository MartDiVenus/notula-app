/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- src/db.js ---
// File compatibile con la struttura originale del progetto Notula

import { NotulaCore } from './utils/notulaCore';
import { parseImportFile } from './utils/exportImport';

export class NotulaDB extends NotulaCore {
  constructor(memoList = []) {
    super(memoList);
  }

  elencaTutti() {
    return this.listAll();
  }

  elencaPerAnno(anno) {
    return this.listByYearNonEternal(anno);
  }

  elencaPerAnnoMese(anno, mese) {
    return this.listByYearAndMonthNonEternal(anno, mese);
  }

  elencaPerAnnoMeseGiorno(anno, mese, giorno) {
    return this.listByYearMonthDayNonEternal(anno, mese, giorno);
  }

  elencaPerMeseRicorrenti(mese) {
    return this.listByMonthEternal(mese);
  }

  elencaPerMeseGiornoRicorrenti(mese, giorno) {
    return this.listByMonthAndDayEternal(mese, giorno);
  }

  elencaScaduti() {
    return this.listExpiredNonEternal();
  }

  trovaPerTesto(chiave) {
    return this.findByText(chiave);
  }

  trovaPerData(dataStr) {
    return this.findByDate(dataStr);
  }

  trovaPerId(id) {
    return this.findByIds([id]);
  }

  rimuoviPerId(id) {
    return this.removeByIds([id]);
  }

  rimuoviPerTitolo(titolo) {
    return this.removeByTitle(titolo);
  }

  rimuoviTutti() {
    return this.removeAll();
  }
}

export async function importaMemo(file, masterPassword = null) {
  return parseImportFile(file, masterPassword);
}

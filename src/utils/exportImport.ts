/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import { MemoItem, REPEAT_LABELS_EN } from '../types';
import { getLocalYYYYMMDD } from './notulaCore';
import { encryptData, decryptData, isEncryptedString } from './crypto';
import { jsPDF } from 'jspdf';

/**
 * Converts a MemoItem to XML representation
 */
export function memoToXML(memo: MemoItem): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<memo>
  <id>${escapeXML(memo.id)}</id>
  <groupId>${escapeXML(memo.groupId || '')}</groupId>
  <title>${escapeXML(memo.title)}</title>
  <description>${escapeXML(memo.description || '')}</description>
  <expirationDate>${memo.expirationDate}</expirationDate>
  <year>${memo.year}</year>
  <month>${memo.month}</month>
  <day>${memo.day}</day>
  <repeatType>${memo.repeatType}</repeatType>
  <obfuscation>${memo.obfuscation}</obfuscation>
  <isEncrypted>${memo.isEncrypted ? 'true' : 'false'}</isEncrypted>
  <createdAt>${memo.createdAt}</createdAt>
  <updatedAt>${memo.updatedAt || ''}</updatedAt>
</memo>`;
}

/**
 * Converts an array of MemoItems to XML representation
 */
export function memosToXML(memos: MemoItem[]): string {
  const items = memos.map(m => `  <memo>
    <id>${escapeXML(m.id)}</id>
    <groupId>${escapeXML(m.groupId || '')}</groupId>
    <title>${escapeXML(m.title)}</title>
    <description>${escapeXML(m.description || '')}</description>
    <expirationDate>${m.expirationDate}</expirationDate>
    <year>${m.year}</year>
    <month>${m.month}</month>
    <day>${m.day}</day>
    <repeatType>${m.repeatType}</repeatType>
    <obfuscation>${m.obfuscation}</obfuscation>
    <isEncrypted>${m.isEncrypted ? 'true' : 'false'}</isEncrypted>
    <createdAt>${m.createdAt}</createdAt>
    <updatedAt>${m.updatedAt || ''}</updatedAt>
  </memo>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<notula>
  <version>2.0</version>
  <author>Ing. Mario Fantini</author>
  <website>https://mariofantini.eu</website>
  <exportedAt>${new Date().toISOString()}</exportedAt>
  <totalMemos>${memos.length}</totalMemos>
  <memos>
${items}
  </memos>
</notula>`;
}

function escapeXML(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts a MemoItem to Markdown format
 */
export function memoToMarkdown(memo: MemoItem): string {
  const recLabel = memo.repeatType === 'none' ? 'One-time' : `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})`;
  const obfLabel = memo.obfuscation === 'full' ? 'Strato 2: Totale' : memo.obfuscation === 'partial' ? 'Strato 1: Parziale' : 'Nessuno';
  const encLabel = memo.isEncrypted ? '🔒 Attiva (AES-256-GCM E2E)' : 'Disattivata';

  return `# ${memo.title}

- **ID Univoco**: \`${memo.id}\`${memo.groupId ? `\n- **Gruppo Correlato**: \`${memo.groupId}\`` : ''}
- **Data Scadenza / Riferimento**: ${memo.expirationDate}
- **Tipologia & Ricorrenza**: ${recLabel}
- **Livello Offuscamento**: ${obfLabel}
- **Crittografia AES-256**: ${encLabel}
- **Data Creazione**: ${new Date(memo.createdAt).toLocaleString('it-IT')}

---

## Descrizione & Note

${memo.description || '_Nessuna descrizione specificata._'}

---
*Notula™ Memo Engine • Ideazione & Sviluppo Ing. Mario Fantini • https://mariofantini.eu*
`;
}

/**
 * Converts multiple MemoItems to unified Markdown document
 */
export function memosToMarkdown(memos: MemoItem[]): string {
  const dateStr = new Date().toLocaleString('it-IT');
  const itemsMd = memos.map(m => memoToMarkdown(m)).join('\n\n---\n\n');

  return `# NOTULA™ MEMORANDUM • ARCHIVIO COMPLETO

> Generato il: ${dateStr}  
> Totale Memo: **${memos.length}**  
> Autore & Sviluppatore: **Ing. Mario Fantini** ([mariofantini.eu](https://mariofantini.eu))

---

${itemsMd}
`;
}

/**
 * Converts MemoItem to standard iCalendar (.ics) format
 */
export function memoToICS(memo: MemoItem): string {
  return memosToICS([memo]);
}

/**
 * Converts multiple MemoItems to standard iCalendar (.ics) format (RFC 5545)
 */
export function memosToICS(memos: MemoItem[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const events = memos.map(m => {
    const dStr = m.expirationDate.replace(/-/g, '');
    const dtStart = `${dStr}T090000Z`;
    const dtEnd = `${dStr}T100000Z`;

    let rrule = '';
    if (m.repeatType === 'daily') rrule = 'RRULE:FREQ=DAILY\n';
    else if (m.repeatType === 'weekly') rrule = 'RRULE:FREQ=WEEKLY\n';
    else if (m.repeatType === 'monthly') rrule = 'RRULE:FREQ=MONTHLY\n';
    else if (m.repeatType === 'yearly') rrule = 'RRULE:FREQ=YEARLY\n';

    const safeTitle = (m.title || 'Notula Memo').replace(/[\r\n]/g, ' ');
    const safeDesc = (m.description || '').replace(/\r?\n/g, '\\n');

    return `BEGIN:VEVENT
UID:${m.id}@mariofantini.eu
DTSTAMP:${now}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${safeTitle}
DESCRIPTION:${safeDesc}\\n\\n[Notula ID: ${m.id}]
${rrule}STATUS:CONFIRMED
END:VEVENT`;
  }).join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ing. Mario Fantini//Notula Memo Engine 2.0//IT
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Notula Memos
${events}
END:VCALENDAR`;
}

export function memoToPlainText(memo: MemoItem): string {
  const recLabel = memo.repeatType === 'none' ? 'One-time' : `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})`;
  const obfLabel = memo.obfuscation === 'full' ? 'Strato 2: Totale' : memo.obfuscation === 'partial' ? 'Strato 1: Parziale' : 'Nessuno';
  const encLabel = memo.isEncrypted ? 'AES-256 ATTIVA' : 'Disattivata';

  return `========================================================
NOTULA MEMO [${memo.id}]
========================================================
TITOLO: ${memo.title}
DATA: ${memo.expirationDate}
${memo.groupId ? `GRUPPO: ${memo.groupId}\n` : ''}RICORRENZA: ${recLabel}
OFFUSCAMENTO: ${obfLabel}
CIFRATURA AES: ${encLabel}
CREAZIONE: ${memo.createdAt}
--------------------------------------------------------
DESCRIZIONE:
${memo.description || 'Nessuna'}
========================================================
Ideazione & Sviluppo Ing. Mario Fantini • https://mariofantini.eu`;
}

/**
 * Downloads a file to the client browser
 */
export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Genera il Documento PDF ufficiale A4 Ink-Friendly (senza sovrapposizioni)
 */
export function generateMemoPDF(memo: MemoItem): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // 1. Header decorativo "Ink-Friendly" Notula & Fasti Romani (Bordo blu spesso, sfondo bianco)
  const headerHeight = 26;
  doc.setDrawColor(29, 78, 216); // Blu nobile #1d4ed8
  doc.setLineWidth(1.2); // Bordo spesso
  doc.setFillColor(255, 255, 255); // Sfondo bianco ink-saver
  doc.roundedRect(margin, y, contentWidth, headerHeight, 3, 3, 'FD');

  // Linee geometriche araldiche Fasti Romani
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.4);
  doc.line(margin + 5, y + 5, margin + 5, y + headerHeight - 5);
  doc.line(margin + 7.5, y + 7, margin + 7.5, y + headerHeight - 7);

  // Titolo Notula Memorandum
  doc.setTextColor(15, 23, 42); // Navy scuro #0f172a
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('NOTULA MEMORANDUM', margin + 12, y + 10);

  // Sottotitolo Autore
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Architettura Ingegneristica & Schedario • Ing. Mario Fantini • mariofantini.eu', margin + 12, y + 17);

  // Badge ID Memo (Risolto: allineamento a destra matematico con 'right')
  const idText = `ID: ${memo.id}`;
  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  const idWidth = doc.getTextWidth(idText);
  const idBoxX = pageWidth - margin - idWidth - 8;
  
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.6);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(idBoxX - 2, y + 7, idWidth + 6, 9, 2, 2, 'FD');
  
  doc.setTextColor(29, 78, 216);
  doc.text(idText, pageWidth - margin - 5, y + 13.2, { align: 'right' });

  y += headerHeight + 10;

  // 2. Titolo del Memo
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  const titleLines = doc.splitTextToSize(memo.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7.5 + 4;

  // 3. Tabella Scheda Metadati
  const recurrenceLabel = memo.repeatType === 'none' 
    ? 'One-time (Singola Scadenza)' 
    : `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})`;

  const obfuscationLabel = memo.obfuscation === 'full' 
    ? 'Strato 2: Totale (Maschera Solida)' 
    : memo.obfuscation === 'partial' 
    ? 'Strato 1: Parziale' 
    : 'Nessuno (Visibile)';

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  doc.setFontSize(8.5);

  // Riga 1 metadati
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA SCADENZA:', margin + 6, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(memo.expirationDate, margin + 42, y + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('TIPOLOGIA:', margin + 92, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(recurrenceLabel, margin + 115, y + 8);

  // Riga 2 metadati
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFUSCAMENTO:', margin + 6, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(obfuscationLabel, margin + 42, y + 18);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('CRITTOGRAFIA:', margin + 92, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(memo.isEncrypted ? 'AES-256-GCM Hardware E2E' : 'In chiaro', margin + 120, y + 18);

  // Riga 3 metadati
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('CREATED AT:', margin + 6, y + 28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date(memo.createdAt).toLocaleString('it-IT'), margin + 42, y + 28);

  if (memo.groupId) {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('GROUP ID:', margin + 92, y + 28);
    doc.setFont('courier', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(memo.groupId, margin + 115, y + 28);
  }

  y += 45;

  // 4. Sezione Descrizione / Contenuto
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DESCRIPTION & NOTES:', margin, y);
  y += 5;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.setFillColor(255, 255, 255);
  
  const content = memo.description || '(No descriptive note provided)';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  
  const textLines = doc.splitTextToSize(content, contentWidth - 12);
  const boxHeight = Math.max(textLines.length * 5.5 + 12, 35);
  
  doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');
  doc.text(textLines, margin + 6, y + 8);

  // 5. Footer con Copyright Autore & Nessuna sovrapposizione di testo
  const footerY = pageHeight - 18;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  
  // Riga 1 Footer
  doc.text(
    'Document generated by Notula™ Memo Engine • Concept & Development Ing. Mario Fantini',
    margin,
    footerY
  );

  // Riga 2 Footer (Separata chiaramente per evitare sovrapposizioni)
  doc.text(
    'https://mariofantini.eu',
    margin,
    footerY + 4
  );

  doc.text(
    'Copyright © 2026 All Rights Reserved',
    pageWidth - margin,
    footerY + 4,
    { align: 'right' }
  );

  return doc;
}

/**
 * Exports a single memo in chosen format, with optional E2E encryption
 */
export async function exportSingleMemo(
  memo: MemoItem,
  format: 'json' | 'xml' | 'md' | 'ics' | 'pdf' | 'txt' = 'json',
  masterPassword: string | null = null
) {
  let content = '';
  const safeTitle = memo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
  let filename = `notula_${memo.id}_${safeTitle}.${format}`;
  let mimeType = 'text/plain';

  if (format === 'pdf') {
    const doc = generateMemoPDF(memo);
    doc.save(filename);
    return;
  }

  switch (format) {
    case 'json':
      content = JSON.stringify(memo, null, 2);
      mimeType = 'application/json';
      break;
    case 'xml':
      content = memoToXML(memo);
      mimeType = 'application/xml';
      break;
    case 'md':
      content = memoToMarkdown(memo);
      mimeType = 'text/markdown';
      break;
    case 'ics':
      content = memoToICS(memo);
      mimeType = 'text/calendar';
      break;
    case 'txt':
    default:
      content = memoToPlainText(memo);
      mimeType = 'text/plain';
      break;
  }

  if (masterPassword && (format === 'json' || format === 'xml')) {
    content = await encryptData(content, masterPassword);
    filename = `notula_${memo.id}_${safeTitle}_encrypted.${format}`;
  }

  downloadFile(content, filename, mimeType);
}

/**
 * Exports all memos either as single unified bundle or multiple files
 */
export async function exportAllMemos(
  memos: MemoItem[],
  format: 'json' | 'xml' | 'md' | 'ics' | 'txt' = 'json',
  asBundle: boolean = true,
  masterPassword: string | null = null
) {
  const dateStamp = getLocalYYYYMMDD();

  if (asBundle) {
    let content = '';
    let filename = `notula_full_archive_${dateStamp}.${format}`;
    let mimeType = 'text/plain';

    switch (format) {
      case 'json':
        content = JSON.stringify(memos, null, 2);
        mimeType = 'application/json';
        break;
      case 'xml':
        content = memosToXML(memos);
        mimeType = 'application/xml';
        break;
      case 'md':
        content = memosToMarkdown(memos);
        mimeType = 'text/markdown';
        break;
      case 'ics':
        content = memosToICS(memos);
        mimeType = 'text/calendar';
        break;
      case 'txt':
      default:
        content = memos.map(m => memoToPlainText(m)).join('\n\n' + '='.repeat(56) + '\n\n');
        mimeType = 'text/plain';
        break;
    }

    if (masterPassword && (format === 'json' || format === 'xml')) {
      content = await encryptData(content, masterPassword);
      filename = `notula_full_archive_${dateStamp}_encrypted.${format}`;
    }

    downloadFile(content, filename, mimeType);
  } else {
    // Export individually
    for (let i = 0; i < memos.length; i++) {
      await exportSingleMemo(memos[i], format as any, masterPassword);
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

/**
 * Parses XML text into MemoItem array
 */
export function parseXMLMemos(xmlText: string): MemoItem[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  
  const parserError = xmlDoc.getElementsByTagName("parsererror");
  if (parserError.length > 0) {
    throw new Error("File XML non valido o malformato.");
  }

  const memoNodes = xmlDoc.getElementsByTagName("memo");
  const result: MemoItem[] = [];

  for (let i = 0; i < memoNodes.length; i++) {
    const node = memoNodes[i];
    const getVal = (tag: string) => {
      const el = node.getElementsByTagName(tag)[0];
      return el ? el.textContent || '' : '';
    };

    const expDate = getVal("expirationDate") || getLocalYYYYMMDD();
    const [y, m, d] = expDate.split('-');

    const item: MemoItem = {
      id: getVal("id") || `n_${Date.now()}_${i}`,
      groupId: getVal("groupId") || undefined,
      title: getVal("title") || "Untitled",
      description: getVal("description") || "",
      expirationDate: expDate,
      year: getVal("year") || y || String(new Date().getFullYear()),
      month: getVal("month") || m || String(new Date().getMonth() + 1).padStart(2, '0'),
      day: getVal("day") || d || String(new Date().getDate()).padStart(2, '0'),
      repeatType: (getVal("repeatType") as any) || "none",
      obfuscation: (getVal("obfuscation") as any) || "none",
      createdAt: getVal("createdAt") || new Date().toISOString(),
      updatedAt: getVal("updatedAt") || undefined,
    };
    result.push(item);
  }

  return result;
}

/**
 * Parses JSON text (single memo or array)
 */
export function parseJSONMemos(jsonText: string): MemoItem[] {
  const parsed = JSON.parse(jsonText);
  const arr = Array.isArray(parsed) ? parsed : [parsed];

  return arr.map((item: any, idx: number) => {
    const expDate = item.expirationDate || getLocalYYYYMMDD();
    const [y, m, d] = expDate.split('-');

    return {
      id: item.id || `n_${Date.now()}_${idx}`,
      groupId: item.groupId || undefined,
      title: item.title || "Untitled",
      description: item.description || "",
      expirationDate: expDate,
      year: item.year || y || String(new Date().getFullYear()),
      month: item.month || m || String(new Date().getMonth() + 1).padStart(2, '0'),
      day: item.day || d || String(new Date().getDate()).padStart(2, '0'),
      repeatType: item.repeatType || "none",
      obfuscation: item.obfuscation || "none",
      isEncrypted: !!item.isEncrypted,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || undefined,
    };
  });
}

/**
 * Universal file importer for JSON and XML files (supports encryption)
 */
export async function parseImportFile(file: File, masterPassword?: string | null): Promise<MemoItem[]> {
  const text = await file.text();
  let content = text.trim();

  // If encrypted, decrypt first if masterPassword available
  if (isEncryptedString(content)) {
    if (!masterPassword) {
      const pwd = prompt("Enter the Master Password to decrypt the imported file:");
      if (!pwd) throw new Error("Master Password required for encrypted files.");
      content = await decryptData(content, pwd);
    } else {
      content = await decryptData(content, masterPassword);
    }
  }

  if (file.name.endsWith('.xml') || content.startsWith('<?xml') || content.startsWith('<notula') || content.startsWith('<memo>')) {
    return parseXMLMemos(content);
  }

  return parseJSONMemos(content);
}


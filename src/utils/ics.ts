import { MemoItem } from '../types';

export function downloadIcs(memo: MemoItem): void {
  // 1. Generate DTSTAMP (Current UTC time)
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let dtStart, dtEnd;
  
  // 2. Parse expiration date and time
  if (memo.time) {
    // Has specific time
    const start = new Date(`${memo.expirationDate}T${memo.time}`);
    // Default duration to 1 hour
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    
    const fmt = (d: Date) => d.getFullYear() +
                             String(d.getMonth() + 1).padStart(2, '0') +
                             String(d.getDate()).padStart(2, '0') + 'T' +
                             String(d.getHours()).padStart(2, '0') +
                             String(d.getMinutes()).padStart(2, '0') + '00';
                             
    dtStart = `DTSTART:${fmt(start)}\nDTEND:${fmt(end)}`;
  } else {
    // Full day event
    const dStr = memo.expirationDate.replace(/-/g, '');
    const start = new Date(memo.expirationDate);
    // DTEND for full day events is exclusive, so we add 1 day
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const endDStr = end.getFullYear() + 
                    String(end.getMonth() + 1).padStart(2, '0') + 
                    String(end.getDate()).padStart(2, '0');
                    
    dtStart = `DTSTART;VALUE=DATE:${dStr}\nDTEND;VALUE=DATE:${endDStr}`;
  }
  
  // 3. Construct ICS content
  const content = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Notula//EN
BEGIN:VEVENT
UID:${memo.id}@notula.local
DTSTAMP:${dtStamp}
${dtStart}
SUMMARY:${memo.title}
DESCRIPTION:${(memo.description || '').replace(/\n/g, '\\n')}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');

  // 4. Trigger download
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${memo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function addToGoogleCalendar(memo: MemoItem): void {
  const title = encodeURIComponent(memo.title);
  const details = encodeURIComponent(memo.description || '');
  let dates = '';
  
  if (memo.time) {
    // We treat the date/time as local, so we parse it and let it convert to UTC string for Google
    const start = new Date(`${memo.expirationDate}T${memo.time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
    
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    dates = `${fmt(start)}/${fmt(end)}`;
  } else {
    // Full day event in local timezone
    const start = new Date(memo.expirationDate);
    // Google Calendar full-day events require exclusive end date (+1 day)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    
    const fmt = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}${m}${day}`;
    };
    dates = `${fmt(start)}/${fmt(end)}`;
  }
  
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
  window.open(url, '_blank');
}

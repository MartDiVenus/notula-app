import { MemoItem } from '../types';
import { getDriveAccessToken, requestDriveAuth, setDriveAccessToken } from './driveSync';

export async function hasCalendarPermissions(): Promise<boolean> {
  const token = getDriveAccessToken();
  if (!token) return false;
  try {
    const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.scope && data.scope.includes('calendar.events');
  } catch {
    return false;
  }
}

export async function syncMemoToGoogleCalendar(memo: MemoItem, isRetry: boolean = false): Promise<string | null> {
  let token = getDriveAccessToken();
  if (!token) {
    try {
      token = await requestDriveAuth(true, false, true);
    } catch (e) {
      console.error('Cannot sync to Google Calendar: Auth failed', e);
      return null;
    }
  }

  let start: any = {};
  let end: any = {};
  
  // SOLUZIONE NOTIFICHE: 
  // Se l'utente non ha specificato l'ora del memo, ma ha specificato a che ora vuole la notifica,
  // impostiamo l'evento Google Calendar esattamente all'ora della notifica!
  // In questo modo Google Calendar accetterà perfettamente il reminder (minutesBefore = 0)
  // ed eviteremo il bug di Google che forza gli all-day event a "12 am".
  let targetEventTime = memo.time;
  if (!targetEventTime && memo.alertTime) {
    targetEventTime = memo.alertTime;
  }

  if (targetEventTime) {
    const startDate = new Date(`${memo.expirationDate}T${targetEventTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // durata di default 1 ora
    start = { dateTime: startDate.toISOString() };
    end = { dateTime: endDate.toISOString() };
  } else {
    // Evento All-Day vero e proprio (senza ora di notifica)
    start = { date: memo.expirationDate };
    const d = new Date(memo.expirationDate);
    d.setDate(d.getDate() + 1);
    end = { date: d.toISOString().split('T')[0] };
  }

  let reminders = undefined;
  if (memo.alertDaysBefore !== undefined && memo.alertTime) {
    const eventDateStr = memo.expirationDate;
    const alertDate = new Date(`${eventDateStr}T${memo.alertTime}`);
    alertDate.setDate(alertDate.getDate() - memo.alertDaysBefore);
    
    // Calcoliamo i minuti di anticipo rispetto all'inizio dell'evento su Google Calendar
    const eventStart = targetEventTime ? new Date(`${memo.expirationDate}T${targetEventTime}`) : new Date(`${memo.expirationDate}T00:00`);
    let minutesBefore = Math.floor((eventStart.getTime() - alertDate.getTime()) / 60000);
    
    if (isNaN(minutesBefore)) {
      minutesBefore = 0;
    }
    if (minutesBefore < 0) minutesBefore = 0;
    if (minutesBefore > 40320) minutesBefore = 40320; // max 4 settimane per l'API Google
    
    reminders = {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: minutesBefore },
        { method: 'email', minutes: minutesBefore }
      ]
    };
  } else if (memo.alertDaysBefore !== undefined) {
      reminders = {
        useDefault: false,
        overrides: [
            { method: 'popup', minutes: 0 },
            { method: 'email', minutes: 0 }
        ]
      };
  }

  const eventBody: any = {
    summary: memo.title,
    description: memo.description || '',
    start,
    end,
    reminders
  };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    let response;
    if (memo.gCalEventId) {
      response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${memo.gCalEventId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(eventBody)
      });
      if (response.status === 404) {
         response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
          method: 'POST',
          headers,
          body: JSON.stringify(eventBody)
        });
      }
    } else {
      response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify(eventBody)
      });
    }

    if (response.status === 401 || response.status === 403) {
      if (!isRetry) {
        console.warn("Google Calendar token expired or missing scopes. Forcing re-auth...");
        setDriveAccessToken(null);
        await requestDriveAuth(true, false, true);
        return syncMemoToGoogleCalendar(memo, true);
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Failed to sync event to Google Calendar', errText);
      throw new Error(`Google Calendar API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    throw error;
  }
}

export async function deleteMemoFromGoogleCalendar(eventId: string): Promise<void> {
  const token = getDriveAccessToken();
  if (!token || !eventId) return;

  try {
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting from Google Calendar:', error);
  }
}

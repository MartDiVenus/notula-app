import re

with open('src/utils/googleCalendar.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we import setDriveAccessToken
if "setDriveAccessToken" not in content:
    content = content.replace("requestDriveAuth", "requestDriveAuth, setDriveAccessToken")

# We want to wrap the fetch part in a retry logic
# Let's completely rewrite syncMemoToGoogleCalendar to be cleaner

new_func = """export async function syncMemoToGoogleCalendar(memo: MemoItem, isRetry: boolean = false): Promise<string | null> {
  let token = getDriveAccessToken();
  if (!token) {
    try {
      token = await requestDriveAuth(true, false);
    } catch (e) {
      console.error('Cannot sync to Google Calendar: Auth failed', e);
      return null;
    }
  }

  let start: any = {};
  let end: any = {};
  
  if (memo.time) {
    const startDate = new Date(`${memo.expirationDate}T${memo.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    start = { dateTime: startDate.toISOString() };
    end = { dateTime: endDate.toISOString() };
  } else {
    start = { date: memo.expirationDate };
    const d = new Date(memo.expirationDate);
    d.setDate(d.getDate() + 1);
    end = { date: d.toISOString().split('T')[0] };
  }

  let reminders = undefined;
  if (memo.alertDaysBefore !== undefined && memo.alertTime !== undefined) {
    const eventDateStr = memo.expirationDate;
    const alertDate = new Date(`${eventDateStr}T${memo.alertTime}`);
    alertDate.setDate(alertDate.getDate() - memo.alertDaysBefore);
    
    const eventStart = memo.time ? new Date(`${memo.expirationDate}T${memo.time}`) : new Date(`${memo.expirationDate}T00:00`);
    let minutesBefore = Math.floor((eventStart.getTime() - alertDate.getTime()) / 60000);
    
    if (minutesBefore < 0) minutesBefore = 0;
    
    reminders = {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: minutesBefore },
        { method: 'email', minutes: minutesBefore }
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
        await requestDriveAuth(true, false);
        return syncMemoToGoogleCalendar(memo, true);
      }
    }

    if (!response.ok) {
      console.error('Failed to sync event to Google Calendar', await response.text());
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    return null;
  }
}"""

# Find the start and end of syncMemoToGoogleCalendar
start_idx = content.find("export async function syncMemoToGoogleCalendar")
end_idx = content.find("export async function deleteMemoFromGoogleCalendar")

content = content[:start_idx] + new_func + "\n\n" + content[end_idx:]

with open('src/utils/googleCalendar.ts', 'w', encoding='utf-8') as f:
    f.write(content)

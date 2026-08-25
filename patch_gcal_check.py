import re

with open('src/utils/googleCalendar.ts', 'r', encoding='utf-8') as f:
    content = f.read()

helper = '''export async function hasCalendarPermissions(): Promise<boolean> {
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

export async function syncMemoToGoogleCalendar'''

content = content.replace("export async function syncMemoToGoogleCalendar", helper)

# Also update the re-auth logic in syncMemoToGoogleCalendar to pass force=true
content = content.replace("await requestDriveAuth(true, false);", "await requestDriveAuth(true, false, true);")

with open('src/utils/googleCalendar.ts', 'w', encoding='utf-8') as f:
    f.write(content)

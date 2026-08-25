import re

with open('src/utils/googleCalendar.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace imports
content = content.replace(
    "import { getDriveAccessToken } from './driveSync';",
    "import { getDriveAccessToken, requestDriveAuth } from './driveSync';"
)

# Replace the auth check
old_check = """  const token = getDriveAccessToken();
  if (!token) {
    console.warn('Cannot sync to Google Calendar: No access token');
    return null; // Silent fail if not authenticated, or we can throw an error to prompt auth
  }"""

new_check = """  let token = getDriveAccessToken();
  if (!token) {
    try {
      token = await requestDriveAuth(true, false);
    } catch (e) {
      console.error('Cannot sync to Google Calendar: Auth failed', e);
      return null;
    }
  }"""

content = content.replace(old_check, new_check)

with open('src/utils/googleCalendar.ts', 'w', encoding='utf-8') as f:
    f.write(content)


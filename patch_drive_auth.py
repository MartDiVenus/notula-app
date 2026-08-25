import re

with open('src/utils/driveSync.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = '''export function requestDriveAuth(promptConsent: boolean = false, silentOnly: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentToken = getDriveAccessToken();
    if (currentToken) {
      return resolve(currentToken);
    }'''

new_func = '''export function requestDriveAuth(promptConsent: boolean = false, silentOnly: boolean = false, force: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentToken = getDriveAccessToken();
    if (currentToken && !force) {
      return resolve(currentToken);
    }'''

content = content.replace(old_func, new_func)

with open('src/utils/driveSync.ts', 'w', encoding='utf-8') as f:
    f.write(content)

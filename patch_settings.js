const fs = require('fs');
const file = 'src/components/SettingsModal/SettingsModal.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  /const handleNotificationChange = async \[\s\S\]*?};\n/s,
  `const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    updateSettings({ notifications: checked });
    
    if (checked && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn('Notification permission request failed or blocked:', e);
      }
    }
  };\n`
);
// fallback if regex doesn't match
if(code.indexOf('updateSettings({ notifications: checked })') === -1) {
    code = code.replace(
        /const handleNotificationChange = async \(e: React.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?  \};\n/s,
        `const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    updateSettings({ notifications: checked });
    
    if (checked && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn('Notification permission request failed or blocked:', e);
      }
    }
  };\n`
    );
}
fs.writeFileSync(file, code);

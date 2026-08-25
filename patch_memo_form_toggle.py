import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the handler inside the component
handler = '''
  const handleGCalToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gCalSync) {
      // User is turning it ON
      const hasPerms = await hasCalendarPermissions();
      if (!hasPerms) {
        try {
          await requestDriveAuth(true, false, true); // force re-auth
          setGCalSync(true);
        } catch (err) {
          console.error("Calendar auth failed", err);
          setError("Impossibile abilitare il sync: permessi calendario non concessi.");
          setGCalSync(false);
        }
      } else {
        setGCalSync(true);
      }
    } else {
      // User is turning it OFF
      setGCalSync(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {'''

content = content.replace("  const handleSubmit = (e: React.FormEvent) => {", handler)

# Replace the onClick handler
old_label = '<label className="flex items-center gap-3 cursor-pointer group mb-2" onClick={(e) => { e.preventDefault(); setGCalSync(!gCalSync); }}>'
new_label = '<label className="flex items-center gap-3 cursor-pointer group mb-2" onClick={handleGCalToggle}>'

content = content.replace(old_label, new_label)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

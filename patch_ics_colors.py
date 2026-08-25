import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to change text-[var(--text-muted)] to text-emerald-500 for the downloadIcs button
    
    # ListSubmenu: 
    # <button onClick={() => downloadIcs(memo)}
    #   className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
    
    content = content.replace(
        'className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"\n                        title={settings.language === "en" ? "Download .ics file" : "Scarica file .ics"}',
        'className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition"\n                        title={settings.language === "en" ? "Download .ics file" : "Scarica file .ics"}'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/components/ListSubmenu.tsx')
fix_file('src/components/CalendarView.tsx')

import re

with open('src/components/ListSubmenu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add addToGoogleCalendar import
content = content.replace("import { downloadIcs } from '../utils/ics';", "import { downloadIcs, addToGoogleCalendar } from '../utils/ics';")

old_buttons = """                      <button
                        onClick={() => downloadIcs(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                        title={settings.language === "en" ? "Add to Calendar (.ics)" : "Aggiungi a Calendario (.ics)"}
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </button>"""
new_buttons = """                      <button
                        onClick={() => addToGoogleCalendar(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[#4285F4] hover:bg-[#4285F4]/10 transition"
                        title={settings.language === "en" ? "Add to Google Calendar" : "Aggiungi a Google Calendar"}
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadIcs(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                        title={settings.language === "en" ? "Download .ics file" : "Scarica file .ics"}
                      >
                        <Download className="w-4 h-4" />
                      </button>"""
content = content.replace(old_buttons, new_buttons)

with open('src/components/ListSubmenu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

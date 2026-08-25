import re

with open('src/components/CalendarView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CalendarPlus import
content = content.replace("Calendar as CalendarIcon,", "Calendar as CalendarIcon,\n  CalendarPlus,")
content = content.replace("import { DayAnalysis, MemoItem } from '../types';", "import { DayAnalysis, MemoItem } from '../types';\nimport { downloadIcs } from '../utils/ics';")

old_buttons = """                          <button
                            onClick={(e) => { e.stopPropagation(); onEditMemo(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                            title={settings.language === "en" ? "Edit memo" : "Modifica memo"}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>"""
new_buttons = """                          <button
                            onClick={(e) => { e.stopPropagation(); downloadIcs(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                            title={settings.language === "en" ? "Add to Calendar (.ics)" : "Aggiungi a Calendario (.ics)"}
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onEditMemo(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                            title={settings.language === "en" ? "Edit memo" : "Modifica memo"}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>"""
content = content.replace(old_buttons, new_buttons)

with open('src/components/CalendarView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/components/ListSubmenu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CalendarPlus import
content = content.replace("Trash2, X, ArrowRight", "Trash2, X, ArrowRight, CalendarPlus")
content = content.replace("import { getObfuscatedDisplay } from '../utils/obfuscation';", "import { getObfuscatedDisplay } from '../utils/obfuscation';\nimport { downloadIcs } from '../utils/ics';")

# Find the buttons section
old_buttons = """                      <button
                        onClick={() => onEditMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title={settings.language === "en" ? "Edit" : "Modifica"}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>"""
new_buttons = """                      <button
                        onClick={() => downloadIcs(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                        title={settings.language === "en" ? "Add to Calendar (.ics)" : "Aggiungi a Calendario (.ics)"}
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title={settings.language === "en" ? "Edit" : "Modifica"}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>"""
content = content.replace(old_buttons, new_buttons)

with open('src/components/ListSubmenu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

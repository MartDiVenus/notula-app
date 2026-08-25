import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_date_ui = """          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{settings.language === "en" ? "Execution Date" : "Data Esecuzione"}</span>
            </label>
            <input
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>"""
new_date_ui = """          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>{settings.language === "en" ? "Execution Date" : "Data Esecuzione"}</span>
              </label>
              <input
                type="date"
                required
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 flex items-center justify-center rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold">T</span>
                <span>{settings.language === "en" ? "Time (Optional)" : "Orario (Opzionale)"}</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>"""
content = content.replace(old_date_ui, new_date_ui)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

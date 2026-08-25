import re

with open('src/components/CalendarView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_cal_title = """                      {/* Memo Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate">
                        {memo.title}
                      </h4>"""
new_cal_title = """                      {/* Memo Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate flex items-center gap-1.5">
                        {memo.title}
                        {memo.time && (
                           <span className="inline-block px-1.5 py-0.5 rounded bg-[var(--bg-main)] text-[9px] font-mono text-[var(--text-muted)] border border-[var(--border-color)]">
                             {memo.time}
                           </span>
                        )}
                      </h4>"""
content = content.replace(old_cal_title, new_cal_title)

with open('src/components/CalendarView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

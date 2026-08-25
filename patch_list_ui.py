import re

with open('src/components/ListSubmenu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_list_title = """                      <h4 className="font-bold text-base text-[var(--text-main)] mb-1">
                        {memo.title}
                      </h4>"""
new_list_title = """                      <h4 className="font-bold text-base text-[var(--text-main)] mb-1 flex items-center gap-2">
                        {memo.title}
                        {memo.time && (
                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-main)] text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-color)]">
                             {memo.time}
                           </span>
                        )}
                      </h4>"""
content = content.replace(old_list_title, new_list_title)

with open('src/components/ListSubmenu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

def fix_icons(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Re-add exportSingleMemo
    # We will insert it just before the downloadIcs button
    
    export_btn = '''<button
                            onClick={(e) => { e.stopPropagation(); onExportMemo(memo); }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                            title={settings.language === "en" ? "Export single memo" : "Esporta singolo memo"}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          '''

    # For ListSubmenu, it's slightly different: `onClick={() => onExportMemo(memo)}`
    export_btn_list = '''<button
                        onClick={() => onExportMemo(memo)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-500/10 transition"
                        title={settings.language === "en" ? "Export single memo" : "Esporta singolo memo"}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      '''

    # First, let's just do a string replacement.
    if "ListSubmenu" in filepath:
        target = r'<button\s+onClick=\{\(\) => downloadIcs\(memo\)\}'
        content = re.sub(target, export_btn_list + r'<button onClick={() => downloadIcs(memo)}', content)
    else:
        target = r'<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); downloadIcs\(memo\); \}\}'
        content = re.sub(target, export_btn + r'<button onClick={(e) => { e.stopPropagation(); downloadIcs(memo); }}', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_icons('src/components/ListSubmenu.tsx')
fix_icons('src/components/CalendarView.tsx')

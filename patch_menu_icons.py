import re

def fix_buttons(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the onExportMemo button
    # It looks like:
    # <button onClick={() => onExportMemo(memo)} className="..." title="...">
    #   <FileText className="..." />
    # </button>
    # OR onClick={(e) => { e.stopPropagation(); onExportMemo(memo); }}
    
    export_pattern = r'<\s*button[^>]*onClick=\{[^}]*onExportMemo\(memo\)[^}]*\}[^>]*>.*?<\s*FileText[^>]*>.*?</button>'
    content = re.sub(export_pattern, '', content, flags=re.DOTALL)
    
    # Change Download to CalendarPlus for downloadIcs
    ics_pattern = r'(<\s*button[^>]*onClick=\{[^}]*downloadIcs\(memo\)[^}]*\}[^>]*>.*?)<\s*Download([^>]*)>(.*?</button>)'
    content = re.sub(ics_pattern, r'\1<CalendarPlus\2>\3', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_buttons('src/components/ListSubmenu.tsx')
fix_buttons('src/components/CalendarView.tsx')

import re
import os

replacements = {
    "Badge Dorato = Giorno Corrente (Oggi)": "Golden Badge = Current Day (Today)",
    "Giorno Corrente:": "Current Day:",
    " (Oggi)": " (Today)",
    "Giorno ": "Day "
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content
    
    # We will safely replace these specific occurrences
    for it, en in replacements.items():
        if it in content and it == "Badge Dorato = Giorno Corrente (Oggi)":
            content = content.replace(f'<span>{it}</span>', f'<span>{{settings.language === "en" ? "{en}" : "{it}"}}</span>')
            
        elif it in ["Giorno Corrente:", " (Oggi)", "Giorno "]:
            # This is inside template literals `Giorno Corrente: ${dayNum} (Oggi)`
            # We can change it to `${settings.language === 'en' ? 'Current Day:' : 'Giorno Corrente:'} ${dayNum} ...`
            pass

    # Manually fix the dynamic strings in CalendarView.tsx
    if "CalendarView.tsx" in filepath:
        content = content.replace("`Giorno Corrente: ${dayNum} (Oggi)`", "settings.language === 'en' ? `Current Day: ${dayNum} (Today)` : `Giorno Corrente: ${dayNum} (Oggi)`")
        content = content.replace("`Giorno ${dayNum}`", "settings.language === 'en' ? `Day ${dayNum}` : `Giorno ${dayNum}`")
        content = content.replace("`Giorno selezionato: ${selectedDate?.getDate()}`", "settings.language === 'en' ? `Selected day: ${selectedDate?.getDate()}` : `Giorno selezionato: ${selectedDate?.getDate()}`")

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

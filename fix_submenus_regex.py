import re
import os

replacements = {
    "a. Tutti": "a. All",
    "b. Anno (Puntuali)": "b. Year (One-time)",
    "c. Anno &amp; Mese": "c. Year &amp; Month",
    "d. Mese (Ricorrenti)": "d. Month (Recurring)",
    "e. A/M/G (Puntuali)": "e. Y/M/D (One-time)",
    "f. M/G (Ricorrenti)": "f. M/D (Recurring)",
    "g. Scaduti": "g. Expired",
}

def fix_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for it, en in replacements.items():
        pattern = r'>(\s*)' + re.escape(it) + r'(\s*)<'
        new_tag = r'>\g<1>{settings.language === "en" ? "' + en + r'" : "' + it + r'"}\g<2><'
        content = re.sub(pattern, new_tag, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

fix_file('./src/components/ListSubmenu.tsx')

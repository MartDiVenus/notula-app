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
    "1. Per anno (puntuali / non ricorrenti)": "1. By year (one-time / non-recurring)",
    "2. Per anno e mese (puntuali)": "2. By year and month (one-time)",
    "3. Per anno, mese e giorno (puntuali)": "3. By year, month, and day (one-time)",
    "4. Per titolo": "4. By title",
    "5. Rimuovi scaduti (puntuali)": "5. Remove expired (one-time)",
    "6. Per mese (ricorrenti)": "6. By month (recurring)",
    "7. Per mese e giorno (ricorrenti)": "7. By month and day (recurring)",
    "9. Per IDs (singolo o separati da virgola)": "9. By IDs (single or comma-separated)",
    "Inserisci anno (YYYY)": "Enter year (YYYY)",
    "Inserisci IDs separati da virgola": "Enter comma-separated IDs",
}

def fix_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for it, en in replacements.items():
        # Inside tags
        tag_pattern = f'>{it}<'
        new_tag = f'>{{settings.language === "en" ? "{en}" : "{it}"}}<'
        content = content.replace(tag_pattern, new_tag)
        
        # Placeholders
        attr_pattern = f'placeholder="{it}"'
        new_attr = f'placeholder={{settings.language === "en" ? "{en}" : "{it}"}}'
        content = content.replace(attr_pattern, new_attr)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

fix_file('./src/components/ListSubmenu.tsx')
fix_file('./src/components/DeleteSubmenu.tsx')


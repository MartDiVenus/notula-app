import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "REPEAT_LABELS_IT" in content and "REPEAT_LABELS_EN" not in content:
        content = content.replace("REPEAT_LABELS_IT", "REPEAT_LABELS_IT, REPEAT_LABELS_EN")
    
    # We need to replace the logic:
    # {isPunctual ? 'Puntuale' : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`}
    # With:
    # {isPunctual ? (settings.language === 'en' ? 'One-time' : 'Puntuale') : (settings.language === 'en' ? `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})` : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`)}
    
    content = content.replace(
        "{isPunctual ? 'Puntuale' : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`}",
        "{isPunctual ? (settings.language === 'en' ? 'One-time' : 'Puntuale') : (settings.language === 'en' ? `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})` : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`)}"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('./src/components/ListSubmenu.tsx')
fix_file('./src/components/SearchSubmenu.tsx')

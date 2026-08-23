import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert the bad replacement
    content = content.replace("REPEAT_LABELS_IT, REPEAT_LABELS_EN", "REPEAT_LABELS_IT")
    
    # Do it correctly in imports
    content = content.replace(
        "import { MemoItem, REPEAT_LABELS_IT } from '../types';",
        "import { MemoItem, REPEAT_LABELS_IT, REPEAT_LABELS_EN } from '../types';"
    )
    content = content.replace(
        "import { MemoItem, RepeatType, ObfuscationLevel, REPEAT_LABELS_IT } from '../types';",
        "import { MemoItem, RepeatType, ObfuscationLevel, REPEAT_LABELS_IT, REPEAT_LABELS_EN } from '../types';"
    )

    content = content.replace(
        "{isPunctual ? 'Puntuale' : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`}",
        "{isPunctual ? (settings.language === 'en' ? 'One-time' : 'Puntuale') : (settings.language === 'en' ? `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})` : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`)}"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('./src/components/ListSubmenu.tsx')
fix_file('./src/components/SearchSubmenu.tsx')

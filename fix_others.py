import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "REPEAT_LABELS_IT" in content and "REPEAT_LABELS_EN" not in content:
        content = content.replace("REPEAT_LABELS_IT", "REPEAT_LABELS_IT, REPEAT_LABELS_EN")

    # CalendarView
    if "recurrenceLabel =" in content:
        content = content.replace(
            "const recurrenceLabel = REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType;",
            "const recurrenceLabel = settings.language === 'en' ? (REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType) : (REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType);"
        )

    # ConflictModal
    content = content.replace(
        "{existingMemo.repeatType === 'none' ? 'Puntuale' : REPEAT_LABELS_IT[existingMemo.repeatType] || existingMemo.repeatType}",
        "{existingMemo.repeatType === 'none' ? (settings.language === 'en' ? 'One-time' : 'Puntuale') : (settings.language === 'en' ? REPEAT_LABELS_EN[existingMemo.repeatType] : REPEAT_LABELS_IT[existingMemo.repeatType]) || existingMemo.repeatType}"
    )
    content = content.replace(
        "{incomingMemo.repeatType === 'none' ? 'Puntuale' : REPEAT_LABELS_IT[incomingMemo.repeatType] || incomingMemo.repeatType}",
        "{incomingMemo.repeatType === 'none' ? (settings.language === 'en' ? 'One-time' : 'Puntuale') : (settings.language === 'en' ? REPEAT_LABELS_EN[incomingMemo.repeatType] : REPEAT_LABELS_IT[incomingMemo.repeatType]) || incomingMemo.repeatType}"
    )

    # PrintModal
    content = content.replace(
        "`Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`",
        "(settings.language === 'en' ? `Recurring (${REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType})` : `Ricorrente (${REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType})`)"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('./src/components/CalendarView.tsx')
fix_file('./src/components/ConflictModal.tsx')
fix_file('./src/components/PrintModal.tsx')


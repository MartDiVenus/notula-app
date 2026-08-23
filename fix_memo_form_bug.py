import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "`ID: ${initialMemo.id}` : '{settings.language === 'en' ? 'Create one-time or recurring memo with AES-256 option' : 'Crea memo puntuale o ricorrente con opzione AES-256'}'}",
    "`ID: ${initialMemo.id}` : (settings.language === 'en' ? 'Create one-time or recurring memo with AES-256 option' : 'Crea memo puntuale o ricorrente con opzione AES-256')}"
)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

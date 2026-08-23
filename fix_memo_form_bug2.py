import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "<span>{initialMemo ? 'Salva Modifiche' : '{settings.language === 'en' ? 'Save to Notula™' : 'Archivia in Notula™'}'}</span>",
    "<span>{initialMemo ? (settings.language === 'en' ? 'Update Memo' : 'Salva Modifiche') : (settings.language === 'en' ? 'Save to Notula™' : 'Archivia in Notula™')}</span>"
)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

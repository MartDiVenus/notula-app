import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "{initialMemo ? 'Modifica Memo' : 'Nuovo Memo in Notula™'}",
    "{initialMemo ? (settings.language === 'en' ? 'Edit Memo' : 'Modifica Memo') : (settings.language === 'en' ? 'New Memo in Notula™' : 'Nuovo Memo in Notula™')}"
)

content = content.replace(
    "Crea memo puntuale o ricorrente con opzione AES-256",
    "{settings.language === 'en' ? 'Create one-time or recurring memo with AES-256 option' : 'Crea memo puntuale o ricorrente con opzione AES-256'}"
)

content = content.replace(
    "Strato 3: Cifratura Forte AES-256 E2E",
    "{settings.language === 'en' ? 'Layer 3: Strong AES-256 E2E Encryption' : 'Strato 3: Cifratura Forte AES-256 E2E'}"
)

content = content.replace(
    "Crittografia hardware AES-256-GCM su disco e backup Google™ Drive",
    "{settings.language === 'en' ? 'AES-256-GCM hardware encryption on disk and Google™ Drive backup' : 'Crittografia hardware AES-256-GCM su disco e backup Google™ Drive'}"
)

content = content.replace(
    "Archivia in Notula™",
    "{settings.language === 'en' ? 'Save to Notula™' : 'Archivia in Notula™'}"
)

content = content.replace(
    "{initialMemo ? 'Aggiorna Memo' : 'Archivia in Notula™'}",
    "{initialMemo ? (settings.language === 'en' ? 'Update Memo' : 'Aggiorna Memo') : (settings.language === 'en' ? 'Save to Notula™' : 'Archivia in Notula™')}"
)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

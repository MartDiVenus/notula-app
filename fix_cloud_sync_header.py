import re

with open('src/components/CloudSyncModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "{settings.language === 'en' ? 'Cloud & Google™ Drive Sync' : (settings.language === 'en' ? 'Cloud & Google™ Drive Sync' : 'Sincronizzazione Cloud & Google™ Drive')}",
    "{settings.language === 'en' ? 'Cloud & Google™ Drive Sync' : 'Sincronizzazione Cloud & Google™ Drive'}"
)

with open('src/components/CloudSyncModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

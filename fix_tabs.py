import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '                  Tutte le Sezioni',
    '                  {settings.language === "en" ? "All Sections" : "Tutte le Sezioni"}'
)

content = content.replace(
    '                  1. Cosa fa Notula™',
    '                  {settings.language === "en" ? "1. What Notula™ Does" : "1. Cosa fa Notula™"}'
)

content = content.replace(
    '                  2. Punti di Forza',
    '                  {settings.language === "en" ? "2. Core Strengths" : "2. Punti di Forza"}'
)

content = content.replace(
    '                  3. Legenda & Ricorrenze (groupID)',
    '                  {settings.language === "en" ? "3. Legend & Recurrences" : "3. Legenda & Ricorrenze (groupID)"}'
)

content = content.replace(
    '                  4. Sicurezza & Passphrase',
    '                  {settings.language === "en" ? "4. Security & Passphrase" : "4. Sicurezza & Passphrase"}'
)

content = content.replace(
    '                  5. Esportazioni & PDF',
    '                  {settings.language === "en" ? "5. Exports & PDF" : "5. Esportazioni & PDF"}'
)

content = content.replace(
    '                  6. Google™ Drive',
    '                  {settings.language === "en" ? "6. Google™ Drive" : "6. Google™ Drive"}'
)

content = content.replace(
    '                  7. Funzioni Quotidiane',
    '                  {settings.language === "en" ? "7. Daily Features" : "7. Funzioni Quotidiane"}'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

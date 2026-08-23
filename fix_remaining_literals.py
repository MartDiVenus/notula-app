import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix emblem text
content = content.replace("L'emblema visivo di Notula™ è stato disegnato e concepito dall'<strong>Ing. Mario Fantini</strong> per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:", 
"{settings.language === 'en' ? \"The Notula™ visual emblem was designed and conceived by <strong>Ing. Mario Fantini</strong> to combine engineering rigor, temporal orientation and historical memory. It contains no references to commercial logos, but has its roots in the classic archetype of the Roman calendar and communication:\" : \"L'emblema visivo di Notula™ è stato disegnato e concepito dall'<strong>Ing. Mario Fantini</strong> per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:\"}")

# Fix remaining literals
content = content.replace(
    '"{settings.language === \'en\' ? \'The Messenger Bird of Apollo\' : \'L\\\'Uccello Messaggero di Apollo\'}"', 
    '"The Messenger Bird of Apollo"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'Guiding Stars\' : \'Stelle Guida\'}"', 
    '"Guiding Stars"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'One-time Memos (Rectangular Color Border)\' : \'Memo Puntuali (Bordo Colore Rettangolare)\'}"', 
    '"One-time Memos (Rectangular Color Border)"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'Orange Border:\' : \'Bordo Arancio:\'}"', 
    '"Orange Border:"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'Expiring Today.\' : \'In scadenza oggi.\'}"', 
    '"Expiring Today."'
)
content = content.replace(
    '"• {settings.language === \'en\' ? \'Green:\' : \'Verde:\'}"', 
    '"• Green:"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'Yearly / Monthly Recurring.\' : \'Ricorrenza Annuale / Mensile.\'}"', 
    '"Yearly / Monthly Recurring."'
)
content = content.replace(
    '"• {settings.language === \'en\' ? \'Blue:\' : \'Blu:\'}"', 
    '"• Blue:"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'Weekly / Daily Recurring.\' : \'Ricorrenza Settimanale / Giornaliera.\'}"', 
    '"Weekly / Daily Recurring."'
)
content = content.replace(
    '"• {settings.language === \'en\' ? \'Purple:\' : \'Viola:\'}"', 
    '"• Purple:"'
)
content = content.replace(
    '"{settings.language === \'en\' ? \'With AES-256 Encryption active.\' : \'Con crittografia AES-256 attiva.\'}"', 
    '"With AES-256 Encryption active."'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

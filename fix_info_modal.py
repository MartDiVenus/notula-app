import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Come funziona l'aggiornamento automatico con groupID:", "{settings.language === 'en' ? \"How automatic update with groupID works:\" : \"Come funziona l'aggiornamento automatico con groupID:\"}")
content = content.replace("Il calendario Notula™ adotta una semantica cromatica rigorosa per distinguere al colpo d'occhio la natura e l'urgenza di ciascun evento:", "{settings.language === 'en' ? \"The Notula™ calendar adopts a rigorous color semantics to distinguish at a glance the nature and urgency of each event:\" : \"Il calendario Notula™ adotta una semantica cromatica rigorosa per distinguere al colpo d'occhio la natura e l'urgenza di ciascun evento:\"}")
content = content.replace("L'emblema visivo di Notula™ è stato disegnato e concepito dall'Ing. Mario Fantini per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:", "{settings.language === 'en' ? \"The Notula™ visual emblem was designed and conceived by Ing. Mario Fantini to combine engineering rigor, temporal orientation and historical memory. It contains no references to commercial logos, but has its roots in the classic archetype of the Roman calendar and communication:\" : \"L'emblema visivo di Notula™ è stato disegnato e concepito dall'Ing. Mario Fantini per unire rigore ingegneristico, orientamento temporale e memoria storica. Non contiene riferimenti a loghi commerciali, ma affonda le sue radici nell'archetipo classico del calendario romano e della comunicazione:\"}")
content = content.replace("Cliccando sull'icona dell'occhio nella barra superiore, puoi mascherare all'istante tutti i contenuti sullo schermo se qualcuno si avvicina.", "{settings.language === 'en' ? \"By clicking the eye icon in the top bar, you can instantly mask all on-screen content if someone approaches.\" : \"Cliccando sull'icona dell'occhio nella barra superiore, puoi mascherare all'istante tutti i contenuti sullo schermo se qualcuno si avvicina.\"}")
content = content.replace("Tablet of the Roman Fasti", "{settings.language === 'en' ? 'Tablet of the Roman Fasti' : 'Tavola dei Fasti Romani'}")
content = content.replace("Rappresenta la <em>Tabula</em> in engraved stone of the calendar in Ancient Rome, on which legal deadlines, holidays and days were carved <em>Fasti</em> and <em>Nefasti</em>.", "{settings.language === 'en' ? <>Represents the <em>Tabula</em> in engraved stone of the calendar in Ancient Rome, on which legal deadlines, holidays and days were carved <em>Fasti</em> and <em>Nefasti</em>.</> : <>Rappresenta la <em>Tabula</em> in pietra incisa del calendario nell'Antica Roma, su cui venivano scolpite le scadenze legali, le festività e i giorni <em>Fasti</em> e <em>Nefasti</em>.</>}")
content = content.replace("The Messenger Bird of Apollo", "{settings.language === 'en' ? 'The Messenger Bird of Apollo' : 'L\\'Uccello Messaggero di Apollo'}")
content = content.replace("Nobile volatile rapace, con becco dorato acuminato e coda a ventaglio. Simbolo araldico di tempestività e custodia delle memorie nel tempo.", "{settings.language === 'en' ? 'Noble bird of prey, with a sharp golden beak and a fan-shaped tail. Heraldic symbol of timeliness and custody of memories over time.' : 'Nobile volatile rapace, con becco dorato acuminato e coda a ventaglio. Simbolo araldico di tempestività e custodia delle memorie nel tempo.'}")
content = content.replace("Guiding Stars", "{settings.language === 'en' ? 'Guiding Stars' : 'Stelle Guida'}")
content = content.replace("I punti cardinali, la stella polare e le costellazioni che guidavano gli antichi romani nell'osservazione astronomica, nella navigazione e nella scansione ciclica delle stagioni.", "{settings.language === 'en' ? 'The cardinal points, the North Star and the constellations that guided the ancient Romans in astronomical observation, navigation and the cyclical scanning of the seasons.' : 'I punti cardinali, la stella polare e le costellazioni che guidavano gli antichi romani nell\\'osservazione astronomica, nella navigazione e nella scansione ciclica delle stagioni.'}")

# Check calendar Visual Legend titles
content = content.replace("Calendar Visual Legend &amp; Recurrence Management with groupID", "{settings.language === 'en' ? 'Calendar Visual Legend & Recurrence Management with groupID' : 'Legenda Visiva Calendario & Gestione Ricorrenze con groupID'}")
content = content.replace("One-time Memos (Rectangular Color Border)", "{settings.language === 'en' ? 'One-time Memos (Rectangular Color Border)' : 'Memo Puntuali (Bordo Colore Rettangolare)'}")
content = content.replace("Red Border:", "{settings.language === 'en' ? 'Red Border:' : 'Bordo Rosso:'}")
content = content.replace("Expired (the date has already passed).", "{settings.language === 'en' ? 'Expired (the date has already passed).' : 'Scaduto (la data è già passata).'}")
content = content.replace("Orange Border:", "{settings.language === 'en' ? 'Orange Border:' : 'Bordo Arancio:'}")
content = content.replace("Expiring Today.", "{settings.language === 'en' ? 'Expiring Today.' : 'In scadenza oggi.'}")
content = content.replace("Magenta/Purple Border:", "{settings.language === 'en' ? 'Magenta/Purple Border:' : 'Bordo Magenta/Viola:'}")
content = content.replace("Future expiration in the month.", "{settings.language === 'en' ? 'Future expiration in the month.' : 'Scadenza futura nel mese.'}")
content = content.replace("Recurring Memos (Solid Dot &bull;)", "{settings.language === 'en' ? 'Recurring Memos (Solid Dot &bull;)' : 'Memo Ricorrenti (Punto Pieno &bull;)'}")
content = content.replace("Green:", "{settings.language === 'en' ? 'Green:' : 'Verde:'}")
content = content.replace("Yearly / Monthly Recurring.", "{settings.language === 'en' ? 'Yearly / Monthly Recurring.' : 'Ricorrenza Annuale / Mensile.'}")
content = content.replace("Blue:", "{settings.language === 'en' ? 'Blue:' : 'Blu:'}")
content = content.replace("Weekly / Daily Recurring.", "{settings.language === 'en' ? 'Weekly / Daily Recurring.' : 'Ricorrenza Settimanale / Giornaliera.'}")
content = content.replace("Purple:", "{settings.language === 'en' ? 'Purple:' : 'Viola:'}")
content = content.replace("With AES-256 Encryption active.", "{settings.language === 'en' ? 'With AES-256 Encryption active.' : 'Con crittografia AES-256 attiva.'}")

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

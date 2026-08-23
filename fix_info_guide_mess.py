import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix nested {settings.language...} strings
replacements = [
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Tablet of the Roman Fasti\' : \'Tavola dei Fasti Romani\'\}" : \(settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Tablet of the Roman Fasti\' : \'Tavola dei Fasti Romani\'\}" : "Tavoletta dei Fasti Romani"\)\}', 
     r'{settings.language === "en" ? "Tablet of the Roman Fasti" : "Tavola dei Fasti Romani"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'The Messenger Bird of Apollo\' : \'L\\\\\'Uccello Messaggero di Apollo\'\}" : \(settings\.language === "en" \? "\{settings\.language === \'en\' \? \'The Messenger Bird of Apollo\' : \'L\\\\\'Uccello Messaggero di Apollo\'\}" : "L\'Uccello Messaggero di Apollo"\)\}',
     r'{settings.language === "en" ? "The Messenger Bird of Apollo" : "L\'Uccello Messaggero di Apollo"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Guiding Stars\' : \'Stelle Guida\'\}" : \(settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Guiding Stars\' : \'Stelle Guida\'\}" : "Stelle Guida"\)\}',
     r'{settings.language === "en" ? "Guiding Stars" : "Stelle Guida"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Calendar Visual Legend & Recurrence Management with groupID\' : \'Legenda Visiva Calendario & Gestione Ricorrenze con groupID\'\}" : "Legenda Visiva Calendario &amp; Gestione Ricorrenze con groupID"\}',
     r'{settings.language === "en" ? "Calendar Visual Legend & Recurrence Management with groupID" : "Legenda Visiva Calendario & Gestione Ricorrenze con groupID"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'One-time Memos \(Rectangular Color Border\)\' : \'Memo Puntuali \(Bordo Colore Rettangolare\)\'\}" : "Memo Puntuali \(Bordo Colore Rettangolare\)"\}',
     r'{settings.language === "en" ? "One-time Memos (Rectangular Color Border)" : "Memo Puntuali (Bordo Colore Rettangolare)"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Red Border:\' : \'Bordo Rosso:\'\}" : "Bordo Rosso:"\}',
     r'{settings.language === "en" ? "Red Border:" : "Bordo Rosso:"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Orange Border:\' : \'Bordo Arancio:\'\}" : "Bordo Arancio:"\}',
     r'{settings.language === "en" ? "Orange Border:" : "Bordo Arancio:"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Magenta/Purple Border:\' : \'Bordo Magenta/Viola:\'\}" : "Bordo Magenta/Viola:"\}',
     r'{settings.language === "en" ? "Magenta/Purple Border:" : "Bordo Magenta/Viola:"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Recurring Memos \(Solid Dot &bull;\)\' : \'Memo Ricorrenti \(Punto Pieno &bull;\)\'\}" : "Memo Ricorrenti \(Punto Pieno &bull;\)"\}',
     r'{settings.language === "en" ? "Recurring Memos (Solid Dot &bull;)" : "Memo Ricorrenti (Punto Pieno &bull;)"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Green:\' : \'Verde:\'\}" : "Verde:"\}',
     r'{settings.language === "en" ? "Green:" : "Verde:"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Blue:\' : \'Blu:\'\}" : "Blu:"\}',
     r'{settings.language === "en" ? "Blue:" : "Blu:"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Purple:\' : \'Viola:\'\}" : "Viola:"\}',
     r'{settings.language === "en" ? "Purple:" : "Viola:"}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Expired \(the date has already passed\)\.\' : \'Scaduto \(la data è già passata\)\.\'\}" : "Scaduto \(la data è già passata\)\."\}',
     r'{settings.language === "en" ? "Expired (the date has already passed)." : "Scaduto (la data è già passata)."}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Expiring Today\.\' : \'In scadenza oggi\.\'\}" : "In scadenza oggi\."\}',
     r'{settings.language === "en" ? "Expiring Today." : "In scadenza oggi."}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Future expiration in the month\.\' : \'Scadenza futura nel mese\.\'\}" : "Scadenza futura nel mese\."\}',
     r'{settings.language === "en" ? "Future expiration in the month." : "Scadenza futura nel mese."}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Yearly / Monthly Recurring\.\' : \'Ricorrenza Annuale / Mensile\.\'\}" : "Ricorrenza Annuale / Mensile\."\}',
     r'{settings.language === "en" ? "Yearly / Monthly Recurring." : "Ricorrenza Annuale / Mensile."}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'Weekly / Daily Recurring\.\' : \'Ricorrenza Settimanale / Giornaliera\.\'\}" : "Ricorrenza Settimanale / Giornaliera\."\}',
     r'{settings.language === "en" ? "Weekly / Daily Recurring." : "Ricorrenza Settimanale / Giornaliera."}'),
     
    (r'\{settings\.language === "en" \? "\{settings\.language === \'en\' \? \'With AES-256 Encryption active\.\' : \'Con crittografia AES-256 attiva\.\'\}" : "Con crittografia AES-256 attiva\."\}',
     r'{settings.language === "en" ? "With AES-256 Encryption active." : "Con crittografia AES-256 attiva."}'),
     
    (r'<em>\(settings\.language === "en" \? "Download from Google™ Drive" : "Scarica da Google™ Drive"\)</em>',
     r'<em>{settings.language === "en" ? "Download from Google™ Drive" : "Scarica da Google™ Drive"}</em>'),
     
    (r'\{settings\.language === "en" \? "6\. Google™ Drive Sync: Total Device Independence" : \(settings\.language === "en" \? "6\. Google™ Drive Sync: Total Device Independence" : "6\. Sincronizzazione Google™ Drive: Indipendenza Totale dal Dispositivo"\)\}',
     r'{settings.language === "en" ? "6. Google™ Drive Sync: Total Device Independence" : "6. Sincronizzazione Google™ Drive: Indipendenza Totale dal Dispositivo"}'),
     
    (r'\{settings\.language === "en" \? "If you change computers or format the device, " : \(settings\.language === "en" \? "If you change computers or format the device, " : "Se cambi computer o formatti il dispositivo, "\)\}',
     r'{settings.language === "en" ? "If you change computers or format the device, " : "Se cambi computer o formatti il dispositivo, "}'),
     
    (r'\{settings\.language === "en" \? "you don\'t lose anything" : \(settings\.language === "en" \? "you don\'t lose anything" : "non perdi nulla"\)\}',
     r'{settings.language === "en" ? "you don\'t lose anything" : "non perdi nulla"}'),
     
    (r'\{settings\.language === "en" \? ": simply reconnect your Google™ Drive account and enter your Master Passphrase\." : \(settings\.language === "en" \? ": simply reconnect your Google™ Drive account and enter your Master Passphrase\." : ": basta ricollegare il tuo account Google™ Drive e inserire la tua Master Passphrase\."\)\}',
     r'{settings.language === "en" ? ": simply reconnect your Google™ Drive account and enter your Master Passphrase." : ": basta ricollegare il tuo account Google™ Drive e inserire la tua Master Passphrase."}'),
     
    (r'\{settings\.language === "en" \? "Intelligent Conflict Management:" : \(settings\.language === "en" \? "Intelligent Conflict Management:" : "Gestione Conflitti Intelligente:"\)\}',
     r'{settings.language === "en" ? "Intelligent Conflict Management:" : "Gestione Conflitti Intelligente:"}'),
     
    (r'\{settings\.language === "en" \? " In case of divergence between local memory and Google™ Drive, Notula™ allows you to easily resolve the conflict \(Replace \[Y\], Ignore \[I\], Duplicate both \[M\] or Apply to all \[A\]\)\." : \(settings\.language === "en" \? " In case of divergence between local memory and Google™ Drive, Notula™ allows you to easily resolve the conflict \(Replace \[Y\], Ignore \[I\], Duplicate both \[M\] or Apply to all \[A\]\)\." : " In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità \(Sostituisci \[Y\], Ignora \[I\], Duplica entrambi \[M\] o Applica a tutti \[A\]\)\."\)\}',
     r'{settings.language === "en" ? " In case of divergence between local memory and Google™ Drive, Notula™ allows you to easily resolve the conflict (Replace [Y], Ignore [I], Duplicate both [M] or Apply to all [A])." : " In caso di divergenza tra la memoria locale e Google™ Drive, Notula™ ti consente di risolvere il conflitto con facilità (Sostituisci [Y], Ignora [I], Duplica entrambi [M] o Applica a tutti [A])."}'),
     
    (r'\{settings\.language === "en" \? "7\. Daily Features &amp; Practical Shortcuts" : \(settings\.language === "en" \? "7\. Daily Features &amp; Practical Shortcuts" : "7\. Funzionalità Quotidiane &amp; Scorciatoie Pratiche"\)\}',
     r'{settings.language === "en" ? "7. Daily Features & Practical Shortcuts" : "7. Funzionalità Quotidiane & Scorciatoie Pratiche"}'),
     
    (r'\{settings\.language === "en" \? "Multi-Criteria Global Search" : \(settings\.language === "en" \? "Multi-Criteria Global Search" : "Ricerca Globale Multi-Criterio"\)\}',
     r'{settings.language === "en" ? "Multi-Criteria Global Search" : "Ricerca Globale Multi-Criterio"}'),
     
    (r'\{settings\.language === "en" \? "Quick Navigation • Key \(Today\)" : \(settings\.language === "en" \? "Quick Navigation • Key \(Today\)" : "Navigazione Rapida • Tasto \(Oggi\)"\)\}',
     r'{settings.language === "en" ? "Quick Navigation • Key (Today)" : "Navigazione Rapida • Tasto (Oggi)"}'),
     
    (r'\{settings\.language === "en" \? "8\. CLI Terminal for Advanced &amp; Power Users" : \(settings\.language === "en" \? "8\. CLI Terminal for Advanced &amp; Power Users" : "8\. Terminale CLI per Utenti Avanzati &amp; Power Users"\)\}',
     r'{settings.language === "en" ? "8. CLI Terminal for Advanced & Power Users" : "8. Terminale CLI per Utenti Avanzati & Power Users"}'),
     
    (r'\{settings\.language === "en" \? " and " : \(settings\.language === "en" \? " and " : " e "\)\}',
     r'{settings.language === "en" ? " and " : " e "}')
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

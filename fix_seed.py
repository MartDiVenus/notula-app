with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "'Benvenuto in Notula (Memo Puntuale)'",
    "settings.language === 'en' ? 'Welcome to Notula (One-time Memo)' : 'Benvenuto in Notula (Memo Puntuale)'"
)
content = content.replace(
    "'Questo è un memo puntuale (non ricorrente). Nel calendario i memo puntuali sono evidenziati con bordi colorati: rosso se scaduto, arancio se oggi, magenta se futuro.'",
    "settings.language === 'en' ? 'This is a one-time (non-recurring) memo. In the calendar, one-time memos are highlighted with colored borders: red if expired, orange if today, magenta if future.' : 'Questo è un memo puntuale (non ricorrente). Nel calendario i memo puntuali sono evidenziati con bordi colorati: rosso se scaduto, arancio se oggi, magenta se futuro.'"
)
content = content.replace(
    "'Notula Backup Automatico (Memo Ricorrente)'",
    "settings.language === 'en' ? 'Notula Automatic Backup (Recurring Memo)' : 'Notula Backup Automatico (Memo Ricorrente)'"
)
content = content.replace(
    "'Questo è un memo ricorrente (annuale). Nel calendario i memo ricorrenti sono rappresentati da pallini colorati. L\\'offuscamento è parziale.'",
    "settings.language === 'en' ? 'This is a recurring (yearly) memo. In the calendar, recurring memos are represented by colored dots. Obfuscation is partial.' : 'Questo è un memo ricorrente (annuale). Nel calendario i memo ricorrenti sono rappresentati da pallini colorati. L\\'offuscamento è parziale.'"
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

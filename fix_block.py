import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will just use regex to replace everything between "Click the blue Google Calendar button" and "invierarti un'email."}"
pattern = r'"Click the blue Google Calendar button next to any memo.*?un\'email\."\}'

fixed_block = '''"Click the blue Google Calendar button next to any memo. Notula™ will instantly beam the exact date, time, and description directly to your Google Calendar, ready to be saved. The Google infrastructure will then securely handle waking up your phone or sending you an email at the exact minute."
                            : "Clicca il pulsante blu di Google Calendar a fianco di un memo. Notula™ invierà istantaneamente data, orario e descrizione esatti direttamente al tuo Google Calendar, pronti per il salvataggio. L'infrastruttura Google si occuperà poi in totale sicurezza di farti suonare il telefono al minuto esatto o di inviarti un'email."}'''

content = re.sub(pattern, fixed_block, content, flags=re.DOTALL)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/utils/obfuscation.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'Nessuno'", "'None'")
content = content.replace("level === 'full' ? 'Totale (Svelato)' : level === 'partial' ? 'Parziale (Svelato)' : 'In chiaro'", "level === 'full' ? 'Total (Revealed)' : level === 'partial' ? 'Partial (Revealed)' : 'Clear'")
content = content.replace("'Offuscamento Totale (Strato 2)'", "'Total Obfuscation (Layer 2)'")
content = content.replace("'Privacy a Schermo Attiva'", "'Screen Privacy Active'")
content = content.replace("'In chiaro'", "'Clear'")

with open('src/utils/obfuscation.ts', 'w', encoding='utf-8') as f:
    f.write(content)


import re

with open('src/components/TerminalCLI.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "\"  NOTULA™ CLI v2.2 • INTERPRETE COMANDI INGEGNERISTICO\",",
    "settings.language === 'en' ? \"  NOTULA™ CLI v2.2 • ENGINEERING COMMAND INTERPRETER\" : \"  NOTULA™ CLI v2.2 • INTERPRETE COMANDI INGEGNERISTICO\","
)

content = content.replace(
    "\"  Ideazione & Sviluppo: Ing. Mario Fantini • https://mariofantini.eu\",",
    "settings.language === 'en' ? \"  Conception & Development: Ing. Mario Fantini • https://mariofantini.eu\" : \"  Ideazione & Sviluppo: Ing. Mario Fantini • https://mariofantini.eu\","
)

content = content.replace(
    "\"💡 Digita 'help' per consultare la guida o 'man' per aprire il Manuale Ufficiale.\",",
    "settings.language === 'en' ? \"💡 Type 'help' to consult the guide or 'man' to open the Official Manual.\" : \"💡 Digita 'help' per consultare la guida o 'man' per aprire il Manuale Ufficiale.\","
)

content = content.replace(
    "\"   Comandi: add, edit, export (json/xml/md/ics/pdf/txt), import, pdf, ls, rm, man.\",",
    "settings.language === 'en' ? \"   Commands: add, edit, export (json/xml/md/ics/pdf/txt), import, pdf, ls, rm, man.\" : \"   Comandi: add, edit, export (json/xml/md/ics/pdf/txt), import, pdf, ls, rm, man.\","
)

content = content.replace(
    "setOutputLines([",
    "setOutputLines(["
)

with open('src/components/TerminalCLI.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


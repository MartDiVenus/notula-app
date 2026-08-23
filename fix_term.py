import re

with open('src/components/TerminalCLI.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "NOTULA™ CLI v2.2 • INTERPRETE COMANDI INGEGNERISTICO": "NOTULA™ CLI v2.2 • ENGINEERING COMMAND INTERPRETER",
    "Ideazione & Sviluppo: Ing. Mario Fantini • https://mariofantini.eu": "Conception & Development: Ing. Mario Fantini • https://mariofantini.eu",
    "Digita 'help' per consultare la guida o 'man' per aprire il Manuale Ufficiale.": "Type 'help' to consult the guide or 'man' to open the Official Manual.",
    "Comandi: add, edit, export (json/xml/md/ics/pdf/txt), import, pdf, ls, rm, man.": "Commands: add, edit, export (json/xml/md/ics/pdf/txt), import, pdf, ls, rm, man."
}

# The welcome message is an array of strings. We can't use ternary easily inside the initial state unless we change it.
# Wait, welcome message is rendered line by line.

content = content.replace("const WELCOME_MSG = [", "const getWelcomeMsg = (lang: string) => [")
content = content.replace("  \"─────────────────────────────────────────────────────────────────────────\"", "  \"─────────────────────────────────────────────────────────────────────────\"\n];")

for it, en in replacements.items():
    content = content.replace(f'  "{it}",', f'  lang === "en" ? "{en}" : "{it}",')

# Replace initialization: 
# const [output, setOutput] = useState<string[]>(WELCOME_MSG);
content = content.replace(
    "const [output, setOutput] = useState<string[]>(WELCOME_MSG);",
    "const [output, setOutput] = useState<string[]>(getWelcomeMsg(settings.language));"
)

# Replace any other WELCOME_MSG reference, e.g. for "clear"
content = content.replace(
    "setOutput(WELCOME_MSG);",
    "setOutput(getWelcomeMsg(settings.language));"
)

with open('src/components/TerminalCLI.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

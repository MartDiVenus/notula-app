import re

replacements = {
    "   add --title \"<titolo>\" --date YYYY-MM-DD [--desc \"...\"] [--repeat <giorni>] [--obfuscate none|partial|full] [--encrypt]": "   add --title \"<title>\" --date YYYY-MM-DD [--desc \"...\"] [--repeat <days>] [--obfuscate none|partial|full] [--encrypt]",
    "   • Default (memo puntuale singolo): add --title \"Revisione\" --date 2026-09-01": "   • Default (single one-time memo): add --title \"Review\" --date 2026-09-01",
    "   • Ricorrente (ripetizione per N giorni): add --title \"Revisione\" --date 2026-09-01 --repeat 10": "   • Recurring (repeats for N days): add --title \"Review\" --date 2026-09-01 --repeat 10",
    "   • Esempio cifrato: add --title \"Udienza Tribunale\" --date 2026-09-15 --desc \"Fascicolo 401\" --encrypt": "   • Encrypted example: add --title \"Court Hearing\" --date 2026-09-15 --desc \"File 401\" --encrypt",
    "   Esempio: edit --id n_123 --title \"Udienza Rinviata\" --date 2026-10-02": "   Example: edit --id n_123 --title \"Postponed Hearing\" --date 2026-10-02",
    "   import --json '[{\"title\":\"...\", \"expirationDate\":\"2026-09-01\"}]' -> Importa JSON da testo": "   import --json '[{\"title\":\"...\", \"expirationDate\":\"2026-09-01\"}]' -> Import JSON from text",
    "Comando sconosciuto": "Unknown command",
    "Sei in modalità 'Puntuale'.": "You are in 'One-time' mode.",
    "Comando 'edit' ignorato": "Command 'edit' ignored",
}

with open('./src/components/TerminalCLI.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

for it, en in replacements.items():
    pattern = f'log("{it}");'
    new_tag = f'log(settings.language === "en" ? "{en}" : "{it}");'
    content = content.replace(pattern, new_tag)

with open('./src/components/TerminalCLI.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

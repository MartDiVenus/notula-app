import re

with open('src/components/TerminalCLI.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "8. SICUREZZA, PASSPHRASE & PRIVACY:": "8. SECURITY, PASSPHRASE & PRIVACY:",
    "   passwd <nuova_passphrase>                           -> Imposta o cambia la Master Passphrase AES-256": "   passwd <new_passphrase>                             -> Sets or changes the AES-256 Master Passphrase",
    "   passwd clear                                        -> Rimuove la Master Passphrase (opera in chiaro)": "   passwd clear                                        -> Removes Master Passphrase (operates in clear text)",
    "   privacy on|off                                      -> Attiva/disattiva offuscamento a video": "   privacy on|off                                      -> Activates/deactivates screen obfuscation",
    "9. GOOGLE™ DRIVE, TEMA & UTILITÀ:": "9. GOOGLE™ DRIVE, THEME & UTILITIES:",
    "   cloud-test                                          -> Esegue test diagnostico cartella Google™ Drive /Notula/": "   cloud-test                                          -> Runs diagnostic test on Google™ Drive folder /Notula/",
    "   theme dark|light|system                             -> Cambia tema visivo": "   theme dark|light|system                             -> Changes visual theme",
    "   clear                                               -> Pulisce la schermata del terminale": "   clear                                               -> Clears terminal screen",
    "   exit                                                -> Chiude il terminale CLI": "   exit                                                -> Closes CLI terminal"
}

for it, en in replacements.items():
    pattern = f'log("{it}");'
    new_tag = f'log(settings.language === "en" ? "{en}" : "{it}");'
    content = content.replace(pattern, new_tag)

with open('src/components/TerminalCLI.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

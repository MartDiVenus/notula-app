import re
import os

dict_replace = {
    "Sei libero e indipendente da qualsiasi dispositivo o sistema operativo!": "You are free and independent from any device or operating system!",
    ", Notula™ archivia lo schedario nella cartella riservata ": ", Notula™ archives the filing system in the reserved folder ",
    "PC Windows, Mac, Linux, Tablet o Smartphone": "Windows PC, Mac, Linux, Tablet or Smartphone",
    "Manuale Ufficiale NOTULA™ CLI v2.2 (Edizione Ingegneristica)": "Official NOTULA™ CLI v2.2 Manual (Engineering Edition)",
    " con sincronizzazione automatica dei gruppi (`groupID`), ": " with automatic group synchronization (`groupID`), ",
    " e sorgente ": " and source ",
    "modifica (`edit`)": "edit (`edit`)",
    "Sorgente .tex": ".tex Source",
    "Sorgente LaTeX Accademico (.tex)": "Academic LaTeX Source (.tex)",
    "Sorgente Formattato Ufficiale LaTeX (.tex)": "Official Formatted LaTeX Source (.tex)",
    "Strato 3: AES-256 E2E": "Layer 3: AES-256 E2E",
    ": Si rimanda al file ": ": Please refer to the file ",
    "esportazione multiformato (`export` / `pdf`)": "multiformat export (`export` / `pdf`)",
    "importazione (`import`)": "import (`import`)"
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for it, en in dict_replace.items():
        pattern = r'>(\s*)' + re.escape(it) + r'(\s*)<'
        new_tag = r'>\g<1>{settings.language === "en" ? "' + en + r'" : "' + it + r'"}\g<2><'
        content = re.sub(pattern, new_tag, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('./src/components/InfoGuideModal.tsx')
fix_file('./src/components/CliManualModal.tsx')

import os

replacements = {
    "(Nuovo Memo)": "'Nuovo Memo'",
    "(Cartella Google™ Drive)": "'Cartella Google™ Drive'",
    "(Cartella Cloud)": "'Cartella Cloud'",
    "(Modifica Memo)": "'Modifica Memo'",
    "(Nuovo Memo in Notula™)": "'Nuovo Memo in Notula™'",
    "(Crea memo puntuale o ricorrente con opzione AES-256)": "'Crea memo puntuale o ricorrente con opzione AES-256'",
    "(Salva Modifiche)": "'Salva Modifiche'",
    "(Archivia in Notula™)": "'Archivia in Notula™'",
    "(settings.language === 'en' ? 'Functional Guide, User Manual' : (settings.language === 'en' ? 'Functional Guide, User Manual' : 'Guida Funzionale, Manuale d'Uso'))}": '"Guida Funzionale, Manuale d\'Uso"}',
    "<span>{settings.language === \"en\" ? \"Functional Guide, Manual\" : \"Guida Funzionale, Manuale d'Uso\"}</span>": "<span>{settings.language === 'en' ? 'Functional Guide, User Manual' : \"Guida Funzionale, Manuale d'Uso\"}</span>"
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Specific fix for InfoGuideModal
    if "Guida Funzionale, Manuale d'Uso" in content:
        content = content.replace(
            "<span>{settings.language === \"en\" ? \"Functional Guide, Manual\" : (settings.language === 'en' ? 'Functional Guide, User Manual' : (settings.language === 'en' ? 'Functional Guide, User Manual' : 'Guida Funzionale, Manuale d'Uso'))}</span>",
            "<span>{settings.language === 'en' ? 'Functional Guide, Manual' : \"Guida Funzionale, Manuale d'Uso\"}</span>"
        )
        content = content.replace(
            "(settings.language === 'en' ? 'Functional Guide, User Manual' : (settings.language === 'en' ? 'Functional Guide, User Manual' : 'Guida Funzionale, Manuale d'Uso'))",
            "\"Guida Funzionale, Manuale d'Uso\""
        )

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

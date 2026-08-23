import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just fix the specific missed headers
    content = content.replace('>Elimina Memo<', '>{settings.language === "en" ? "Delete Memo" : "Elimina Memo"}<')
    content = content.replace('"Nessun memo valido trovato nel file."', '(settings.language === "en" ? "No valid memos found in the file." : "Nessun memo valido trovato nel file.")')
    content = content.replace('"File JSON non valido."', '(settings.language === "en" ? "Invalid JSON file." : "File JSON non valido.")')
    content = content.replace('"Nessun memo trovato nel backup Google™ Drive."', '(settings.language === "en" ? "No memos found in Google™ Drive backup." : "Nessun memo trovato nel backup Google™ Drive.")')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

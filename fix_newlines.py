import re
import os

dict_newlines = {
    "Organizzazione": "Organization",
    "INFORMAZIONI & SUPPORTO": "INFORMATION & SUPPORT"
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content
    
    # We will use regex to find these words with surrounding whitespace inside tags
    for it, en in dict_newlines.items():
        pattern = r'>(\s*)' + re.escape(it) + r'(\s*)<'
        new_tag = r'>\g<1>{settings.language === "en" ? "' + en + r'" : "' + it + r'"}\g<2><'
        content = re.sub(pattern, new_tag, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix broken JSX attribute like title=(settings.language === "en" ? "..." : "...")
    # Find patterns like: attribute=(settings.language === "en" ? "..." : "...")
    pattern = r'([a-zA-Z]+)=\(settings\.language === "en" \? "[^"]+" : "[^"]+"\)'
    
    def repl(match):
        # replace the =() with ={}
        matched_str = match.group(0)
        return matched_str.replace("=(", "={").replace(")", "}")

    content = re.sub(pattern, repl, content)
    
    # Check for Single quotes too:
    pattern2 = r'([a-zA-Z]+)=\(settings\.language === "en" \? \'[^\']+\' : \'[^\']+\'\)'
    def repl2(match):
        matched_str = match.group(0)
        return matched_str.replace("=(", "={").replace(")", "}")

    content = re.sub(pattern2, repl2, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

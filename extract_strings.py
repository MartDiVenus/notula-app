import os
import re

def extract(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSX text nodes: > Testo <
    tags = re.findall(r'>\s*([^<>{}]*[a-zA-Zàèéìòù][^<>{}]*)\s*<', content)
    # Extract strings in quotes: "Testo" or 'Testo'
    # Actually, just looking at the previously generated list is very helpful.
    
    return [t.strip() for t in tags if t.strip()]

all_strings = set()
for root, _, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            all_strings.update(extract(os.path.join(root, file)))

for s in sorted(list(all_strings)):
    print(s)

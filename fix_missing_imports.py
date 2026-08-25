import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_regex = re.compile(r"import \{([^}]+)\}\s+from\s+'lucide-react';", re.DOTALL)
match = import_regex.search(content)

if match:
    existing_imports = set([i.strip() for i in match.group(1).split(',') if i.strip()])
    missing = ["Smartphone", "Repeat", "Shield", "Code2", "FileCode", "Search", "Trash2", "Clock"]
    for m in missing:
        existing_imports.add(m)
    
    new_import_str = "import {\n  " + ",\n  ".join(sorted(list(existing_imports))) + "\n} from 'lucide-react';"
    content = content[:match.start()] + new_import_str + content[match.end():]

    with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

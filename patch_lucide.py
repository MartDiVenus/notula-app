with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  Settings2\n  Bell,\n  X,\n} from 'lucide-react';",
    "  Settings2,\n  Bell,\n  X,\n} from 'lucide-react';"
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the messy imports with a clean one
imports_pattern = r"import \{\s+Info,\s+X,\s+ShieldCheck,.*?Calendar,\s*(?:CalendarPlus,\s*Download,\s*)*CalendarPlus,\s*Download,\s*CalendarPlus,\s*Download,\s*.*?\} from 'lucide-react';"

# Just replace all lucide-react imports block cleanly
import_regex = re.compile(r"import \{[^}]+\}\s+from\s+'lucide-react';", re.DOTALL)

clean_imports = """import {
  Info,
  X,
  ShieldCheck,
  Lock,
  Cloud,
  Terminal,
  Calendar,
  CalendarPlus,
  FileText,
  Globe,
  ExternalLink,
  Copyright,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  HardDrive,
  RefreshCw,
  Award,
  KeyRound,
  Download
} from 'lucide-react';"""

content = import_regex.sub(clean_imports, content, count=1)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

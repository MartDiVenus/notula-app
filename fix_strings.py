import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Google Calendar,  CalendarPlus,  Download, ready", "Google Calendar, ready")
content = content.replace("Google Calendar,  CalendarPlus,\n  Download, ready", "Google Calendar, ready")
content = content.replace("Google Calendar,  CalendarPlus,  Download, pronti", "Google Calendar, pronti")
content = content.replace("Google Calendar,  CalendarPlus,\n  Download, pronti", "Google Calendar, pronti")

content = content.replace("Google Calendar,  CalendarPlus,\n  Download,", "Google Calendar,")
content = content.replace("Google Calendar,  CalendarPlus,  Download,", "Google Calendar,")

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

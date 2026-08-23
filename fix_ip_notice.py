import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'per approfondimenti riguardo la proprietà intellettuale ("Intellectual Property Notice"), in cui si esplicita che l\'architettura software, la logica di parsing e il codice sorgente sono opera proprietaria dell\'autore. Manifestazioni di interesse per l\'acquisizione completa dei diritti commerciali sono valutabili, previa intesa economica e salvaguardando la paternità storica e morale (Contatto: marfant7@gmail.com).',
    '{settings.language === "en" ? \' for further details regarding intellectual property ("Intellectual Property Notice"), which states that the software architecture, parsing logic, and source code are the proprietary work of the author. Expressions of interest for the complete acquisition of commercial rights can be evaluated, subject to prior economic agreement and safeguarding historical and moral authorship (Contact: marfant7@gmail.com).\' : \' per approfondimenti riguardo la proprietà intellettuale ("Intellectual Property Notice"), in cui si esplicita che l\\\'architettura software, la logica di parsing e il codice sorgente sono opera proprietaria dell\\\'autore. Manifestazioni di interesse per l\\\'acquisizione completa dei diritti commerciali sono valutabili, previa intesa economica e salvaguardando la paternità storica e morale (Contatto: marfant7@gmail.com).\'}'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

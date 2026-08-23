import re

with open('./src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"L'applicazione <strong>Notula™</strong>, comprensiva della sua architettura software, dell'interfaccia a riga di comando \(CLI\), del motore di sincronizzazione bidirezionale Google™ Drive-First, del sistema di offuscamento multilivello e della crittografia hardware AES-256 GCM, è protetta dalle leggi vigenti in materia di diritto d'autore e proprietà intellettuale \(Legge 22 aprile 1941 n\. 633 e successive modifiche, nonché convenzioni WIPO/OMPI\)."
replacement = r"{settings.language === 'en' ? <>The <strong>Notula™</strong> application, including its software architecture, command-line interface (CLI), Google™ Drive-First bidirectional synchronization engine, multi-level obfuscation system, and hardware AES-256 GCM encryption, is protected by current laws on copyright and intellectual property.</> : <>L'applicazione <strong>Notula™</strong>, comprensiva della sua architettura software, dell'interfaccia a riga di comando (CLI), del motore di sincronizzazione bidirezionale Google™ Drive-First, del sistema di offuscamento multilivello e della crittografia hardware AES-256 GCM, è protetta dalle leggi vigenti in materia di diritto d'autore e proprietà intellettuale (Legge 22 aprile 1941 n. 633 e successive modifiche, nonché convenzioni WIPO/OMPI).</>}"

content = re.sub(target, replacement, content)

with open('./src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

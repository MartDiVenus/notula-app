import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'Maschera i caratteri centrali con puntini (es. <code>IB•••401</code>), consentendo il riconoscimento a colpo d\'occhio.',
    '{settings.language === "en" ? <>Masks the central characters with dots (e.g. <code>IB•••401</code>), allowing recognition at a glance.</> : <>Maschera i caratteri centrali con puntini (es. <code>IB•••401</code>), consentendo il riconoscimento a colpo d\'occhio.</>}'
)

content = content.replace(
    'Censura solida completa (••••••••). Il testo rimane occultato finché non si preme il tasto Privacy o Svela.',
    '{settings.language === "en" ? "Complete solid censorship (••••••••). The text remains hidden until the Privacy or Reveal button is pressed." : "Censura solida completa (••••••••). Il testo rimane occultato finché non si preme il tasto Privacy o Svela."}'
)

content = content.replace(
    'Cifratura hardware Web Crypto API con 100.000 iterazioni PBKDF2 e AES-GCM 256-bit. I dati sono matematicamente inviolabili.',
    '{settings.language === "en" ? "Web Crypto API hardware encryption with 100,000 PBKDF2 iterations and AES-GCM 256-bit. The data is mathematically unbreakable." : "Cifratura hardware Web Crypto API con 100.000 iterazioni PBKDF2 e AES-GCM 256-bit. I dati sono matematicamente inviolabili."}'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

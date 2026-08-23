import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: "Rappresenta la"
content = content.replace(
    'Rappresenta la <em>{settings.language === "en" ? "Tabula" : "Tabula"}</em>',
    '{settings.language === "en" ? "Represents the " : "Rappresenta la "}<em>{settings.language === "en" ? "Tabula" : "Tabula"}</em>'
)

# Fix 2: "Censura solida"
content = content.replace(
    'Censura solida completa (<code>••••••••</code>). Il testo rimane occultato finché non si preme il tasto Privacy o Svela.',
    '{settings.language === "en" ? <>Complete solid censorship (<code>••••••••</code>). The text remains hidden until the Privacy or Reveal button is pressed.</> : <>Censura solida completa (<code>••••••••</code>). Il testo rimane occultato finché non si preme il tasto Privacy o Svela.</>}'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

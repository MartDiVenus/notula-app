import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix &rarr; inside strings to →
content = content.replace(" &rarr; ", " → ")

# Fix string literals with settings.language inside tags
content = content.replace(
    '<em>(settings.language === "en" ? "Edit / Change Passphrase" : "Modifica / Cambia Passphrase")</em>',
    '<em>{settings.language === "en" ? "Edit / Change Passphrase" : "Modifica / Cambia Passphrase"}</em>'
)
content = content.replace(
    '<em>(settings.language === "en" ? "Update Passphrase" : "Aggiorna Passphrase")</em>',
    '<em>{settings.language === "en" ? "Update Passphrase" : "Aggiorna Passphrase"}</em>'
)
content = content.replace(
    '<em>(settings.language === "en" ? "Download from Google™ Drive" : "Scarica da Google™ Drive")</em>',
    '<em>{settings.language === "en" ? "Download from Google™ Drive" : "Scarica da Google™ Drive"}</em>'
)
content = content.replace(
    '<strong>{settings.language === "en" ? "From the Graphical Interface:" : (settings.language === "en" ? "From the Graphical Interface:" : "Dall\'Interfaccia Grafica:")}</strong>',
    '<strong>{settings.language === "en" ? "From the Graphical Interface:" : "Dall\'Interfaccia Grafica:"}</strong>'
)
content = content.replace(
    '{settings.language === "en" ? " Click the button " : (settings.language === "en" ? " Click the button " : " Clicca sul pulsante ")}',
    '{settings.language === "en" ? " Click the button " : " Clicca sul pulsante "}'
)
content = content.replace(
    '{settings.language === "en" ? " in the top bar → in the box " : (settings.language === "en" ? " in the top bar → in the box " : " nella barra in alto → nel riquadro ")}',
    '{settings.language === "en" ? " in the top bar → in the box " : " nella barra in alto → nel riquadro "}'
)
content = content.replace(
    '{settings.language === "en" ? " enter the new keyword → click " : (settings.language === "en" ? " enter the new keyword → click " : " inserisci la nuova parola chiave → clicca ")}',
    '{settings.language === "en" ? " enter the new keyword → click " : " inserisci la nuova parola chiave → clicca "}'
)
content = content.replace(
    '<strong>{settings.language === "en" ? "From CLI Terminal:" : (settings.language === "en" ? "From CLI Terminal:" : "Dal Terminale CLI:")}</strong>',
    '<strong>{settings.language === "en" ? "From CLI Terminal:" : "Dal Terminale CLI:"}</strong>'
)
content = content.replace(
    '{settings.language === "en" ? " Open the terminal (" : (settings.language === "en" ? " Open the terminal (" : " Apri il terminale (")}',
    '{settings.language === "en" ? " Open the terminal (" : " Apri il terminale ("}'
)
content = content.replace(
    '{settings.language === "en" ? ") and type:" : (settings.language === "en" ? ") and type:" : ") e digita:")}',
    '{settings.language === "en" ? ") and type:" : ") e digita:"}'
)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

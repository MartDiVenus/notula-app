import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# English section
content = content.replace(
    "<i>Design & Development: Ing. Mario Fantini</i>\n</p>",
    "<i>Design & Development: Ing. Mario Fantini</i><br>\n  <b>🌐 Official Web App: <a href=\"https://martdivenus.github.io/notula-app\">https://martdivenus.github.io/notula-app</a></b>\n</p>"
)

# Italian section
content = content.replace(
    "<i>Ideazione & Sviluppo: Ing. Mario Fantini</i>\n</p>",
    "<i>Ideazione & Sviluppo: Ing. Mario Fantini</i><br>\n  <b>🌐 Web App Ufficiale: <a href=\"https://martdivenus.github.io/notula-app\">https://martdivenus.github.io/notula-app</a></b>\n</p>"
)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

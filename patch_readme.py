import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

target = """**Notula™** è un motore di promemoria e organizzazione temporale concepito secondo il principio **"Calendar-First"**. A differenza dei comuni task manager basati su notifiche push intrusive, Notula™ adotta una filosofia a **consultazione consapevole**: è l'utente a visionare il calendario e a interagire attivamente con i propri impegni."""

replacement = """**Notula™** è un motore di promemoria e organizzazione temporale concepito secondo il principio **"Calendar-First"**. Notula™ adotta primariamente una filosofia a **consultazione consapevole**, dove è l'utente a visionare il calendario e a interagire attivamente con i propri impegni. Tuttavia, per garantire un supporto completo, integra un sistema **opzionale di Notifiche Push Native**: interfacciandosi direttamente con il sistema operativo del dispositivo (Windows Action Center, macOS Notification Center, Linux DE o Android Notification Shade), permette all'utente di scegliere se ricevere allarmi tempestivi, perfettamente integrati con l'ambiente desktop e mobile."""

content = content.replace(target, replacement)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

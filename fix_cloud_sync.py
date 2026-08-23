import re

with open('src/components/CloudSyncModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "Stato Connessione: {authStatus === 'connected' ? 'Attivo & Autenticato' : 'Non connesso / In attesa'}",
    "{settings.language === 'en' ? 'Connection Status: ' : 'Stato Connessione: '}{authStatus === 'connected' ? (settings.language === 'en' ? 'Active & Authenticated' : 'Attivo & Autenticato') : (settings.language === 'en' ? 'Not connected / Waiting' : 'Non connesso / In attesa')}"
)

content = content.replace(
    "{totalMemos} memo in archivio locale • Cartella remota:",
    "{totalMemos} {settings.language === 'en' ? 'memos in local archive • Remote folder:' : 'memo in archivio locale • Cartella remota:'}"
)

with open('src/components/CloudSyncModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

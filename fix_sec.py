import re

with open('src/components/SecurityModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Sicurezza &amp; Master Passphrase", "{settings.language === 'en' ? 'Security &amp; Master Passphrase' : 'Sicurezza &amp; Master Passphrase'}")
content = content.replace("Crittografia hardware AES-256 GCM (PBKDF2 100.000 cicli)", "{settings.language === 'en' ? 'AES-256 GCM Hardware Encryption (100,000 PBKDF2 cycles)' : 'Crittografia hardware AES-256 GCM (PBKDF2 100.000 cicli)'}")
content = content.replace("'🔒 Protetto con AES-256' : '🔓 Non protetto (In chiaro)'", "(settings.language === 'en' ? '🔒 Protected with AES-256' : '🔒 Protetto con AES-256') : (settings.language === 'en' ? '🔓 Unprotected (Clear text)' : '🔓 Non protetto (In chiaro)')")
content = content.replace("'La Master Passphrase è attiva. I tuoi memo sono cifrati e messi in sicurezza.'", "(settings.language === 'en' ? 'Master Passphrase is active. Your memos are encrypted and secured.' : 'La Master Passphrase è attiva. I tuoi memo sono cifrati e messi in sicurezza.')")
content = content.replace("'Nessuna Master Passphrase attiva. I memo sono memorizzati localmente in chiaro.'", "(settings.language === 'en' ? 'No Master Passphrase active. Memos are stored locally in clear text.' : 'Nessuna Master Passphrase attiva. I memo sono memorizzati localmente in chiaro.')")
content = content.replace("'Modifica / Cambia Passphrase' : 'Crea Nuova Master Passphrase'", "(settings.language === 'en' ? 'Edit / Change Passphrase' : 'Modifica / Cambia Passphrase') : (settings.language === 'en' ? 'CREATE NEW MASTER PASSPHRASE' : 'Crea Nuova Master Passphrase')")
content = content.replace('"Inserisci la NUOVA passphrase..." : "Inserisci nuova passphrase..."', 'settings.language === "en" ? "Enter NEW passphrase..." : "Inserisci la NUOVA passphrase..." : (settings.language === "en" ? "Enter new passphrase..." : "Inserisci nuova passphrase...")')
content = content.replace("'Aggiorna Passphrase' : 'Salva Passphrase'", "(settings.language === 'en' ? 'Update Passphrase' : 'Aggiorna Passphrase') : (settings.language === 'en' ? 'Save Passphrase' : 'Salva Passphrase')")
content = content.replace("'Attivo (Nascosto)' : 'Disattivato'", "(settings.language === 'en' ? 'Active (Hidden)' : 'Attivo (Nascosto)') : (settings.language === 'en' ? 'Disabled' : 'Disattivato')")
content = content.replace(">Stato Vault: {", ">Vault Status: {")

with open('src/components/SecurityModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

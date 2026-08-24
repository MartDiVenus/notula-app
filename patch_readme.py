with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

target = """---

## ⚖️ Proprietà Intellettuale & Note Legali"""

replacement = """---

## 🔄 Ripristino Dati e Pulizia Cache / Data Recovery & Cache Clearing (Important)

Notula™ è progettata come una Progressive Web App (PWA) offline-first, ottimizzata per operare in ambienti **Mobile** e **Desktop**. I tuoi dati (inclusi i task, le impostazioni e i token di accesso) vengono salvati localmente nel motore di archiviazione sicuro del tuo sistema (`localStorage` e IndexedDB forniti dal browser).

### ⚠️ Attenzione: Cosa succede svuotando la cache
Se esegui un'operazione di pulizia profonda del browser, come l'eliminazione di "Tutti i dati" da **Impostazioni > App > Chrome** (su Android) oppure la pulizia completa della cronologia e dei dati dei siti sul browser Desktop, stai eseguendo a tutti gli effetti un **Factory Reset (Ripristino di fabbrica)** della PWA.
Questa operazione **eliminerà permanentemente**:
1. Il tuo database locale dei memo.
2. Le tue impostazioni di sistema (lingua, tema, permessi notifiche).
3. I token di autorizzazione di Google™ Drive.

### ♻️ Come ripristinare i dati (Procedura di Sync)
Se hai svuotato la cache e hai perso i dati locali, segui attentamente questa procedura per recuperarli dal Cloud:

1. **Apri Notula™ (Desktop o Mobile):** L'applicazione apparirà completamente vuota, come se fosse appena stata installata.
2. **Connessione Cloud:** Clicca sull'icona a forma di nuvola (Cloud) nel menu principale.
3. **Nuovo Login:** Effettua nuovamente l'accesso ("Sign in") con il tuo Account Google. Questo è necessario perché il token precedente è andato distrutto.
4. **🔑 Master Passphrase (Se usavi la cifratura):** Se nel salvataggio precedente avevi attivato la cifratura AES-256 (icona a forma di scudo), **DEVI** inserire la tua Master Passphrase esatta nel pannello di sicurezza della PWA *prima* di ripristinare i dati. Se non lo fai, i memo scaricati rimarranno incomprensibili.
5. **Download & Ripristino:** Premi il pulsante di Download dal Cloud. Notula contatterà Google Drive, scaricherà l'ultimo backup valido e ripopolerà istantaneamente il tuo database locale.

---

### 🇬🇧 Data Recovery & Cache Clearing (English)

Notula™ is designed as an offline-first Progressive Web App (PWA), optimized to operate in both **Mobile** and **Desktop** environments. Your data (including tasks, settings, and access tokens) is stored locally in your system's secure storage engine (`localStorage` and IndexedDB provided by the browser).

### ⚠️ Warning: What happens when clearing the cache
If you perform a deep clean of your browser, such as deleting "All data" from **Settings > Apps > Chrome** (on Android) or completely clearing site data and history on your Desktop browser, you are effectively performing a **Factory Reset** of the PWA.
This operation will **permanently delete**:
1. Your local memo database.
2. Your system settings (language, theme, notification permissions).
3. Your Google™ Drive authorization tokens.

### ♻️ How to restore your data (Sync Procedure)
If you have cleared your cache and lost your local data, follow this procedure carefully to recover it from the Cloud:

1. **Open Notula™ (Desktop or Mobile):** The application will appear completely empty, as if freshly installed.
2. **Cloud Connection:** Click on the Cloud icon in the main menu.
3. **New Login:** Sign in again with your Google Account. This is required because the previous token was destroyed during the cache wipe.
4. **🔑 Master Passphrase (If encryption was used):** If you had activated AES-256 encryption (shield icon) in your previous save, you **MUST** enter your exact Master Passphrase in the PWA security panel *before* restoring the data. Failure to do so will result in incomprehensible downloaded memos.
5. **Download & Restore:** Click the Cloud Download button. Notula will contact Google Drive, download the latest valid backup, and instantly repopulate your local database.

---

## ⚖️ Proprietà Intellettuale & Note Legali"""

if target in content:
    content = content.replace(target, replacement)
    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(content)
    print("README updated successfully.")
else:
    print("Target string not found in README.md")


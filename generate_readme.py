import re

with open('README.md', 'r', encoding='utf-8') as f:
    italian_content = f.read()

english_content = """# 📅 Notula™ • Advanced Time & Memo Engine (v2.2)

<p align="center">
  <b>High-engineering management of non-relational temporal memory. Offline-First Architecture, Google™ Drive Smart Sync & AES-256 Hardware Encryption.</b><br>
  <i>Design & Development: Ing. Mario Fantini</i>
</p>

---

**Notula™** is an offline-first single-page application (SPA) created in **React 19** and **Tailwind CSS v4** specifically designed for managing, filtering, and organizing temporal memos (deadlines, payments, bills, generic reminders, appointments). 
Conceived by Ing. Mario Fantini, the application adopts a rigorous engineering approach: it completely eliminates reliance on third-party commercial databases (SaaS) and proprietary servers. Data is processed locally with zero latency, securely encrypted using AES-256 GCM hardware cryptography via Web Crypto API, and synchronized directly with the user's personal Google™ Drive space through an intelligent bidirectional synchronization engine with automatic conflict resolution.

Notula™ offers high-performance UI and an interactive calendar, alongside a powerful command-line terminal (CLI).

## ✨ Advanced Technical Features

### 1. 🔄 Multi-Level Recurrence Engine & Intelligent groupID
Unlike common task managers that only handle single notes, Notula™ implements an advanced recursive generation algorithm for recurring deadlines (e.g., mortgages, coupons, rent, monthly renewals).
- **Automatic Clone Propagation**: By cloning a memo for N days, Notula™ automatically generates independent events, linking them sequentially under a single tracking code (`groupID`).
- **Synchronous Cascade Updates**: If a user modifies the title, description, or security level of a memo belonging to a series, the engine intercepts the variation and automatically propagates it to all memos with the same `groupID`, ensuring total semantic coherence while leaving the specific expiration dates of each element strictly unaltered.

### 2. 📡 Google™ Drive Smart Sync Engine (Bidirectional)
The application natively integrates the Google™ Identity Services standard (OAuth 2.0). Memos are directly backed up in the user's private Google™ Drive (inside a dedicated `Notula/` folder) without intermediary servers.
- **Bi-Directional Timestamp Verification**: The synchronization algorithm automatically resolves conflicts: if the local application and Google Drive present misalignments, Notula™ displays an interactive modal (Conflict Resolution Dashboard) to let the user precisely choose the overwrite flow.
- **Background Multi-Chunk**: Supports saving massive bundles of memos without causing UI stuttering.

### 3. 🛡️ Military-Grade Security & Visual Obfuscation
The app adopts a strict multi-layer security policy:
- **Layer 1 (Visual Obfuscation)**: Text masking (mosaic effect) via CSS filtering to prevent shoulder surfing. Click-and-hold interaction for interactive revealing.
- **Layer 2 (Total Obfuscation)**: Solid gray satin block masking.
- **Layer 3 (AES-256-GCM Strong Encryption)**: Web Crypto API hardware encryption with a user Master Passphrase (100,000 PBKDF2 iterations + 256-bit AES-GCM).

### 4. 📤 Interoperability & Multi-Format Exports
Notula™ supports export and import in open standards:
- **JSON (.json)**: Native structured format for full backups, restore, or data migration.
- **XML (.xml)**: File compliant with the universal hierarchical schema `<notula><memo>` for documentary archives.
- **Markdown (.md)**: Legible tables and checklists ready for Obsidian, Notion, GitHub, or text editors.
- **iCalendar (.ics)**: RFC 5545 standard compatible with **Google™ Calendar**, Apple Calendar, and Microsoft Outlook.
- **PDF Ink-Friendly A4 (.pdf)**: Official sheet formatted for printing and zero-ink archiving (with `jsPDF`).
- **Plain Text (.txt)**: Concise lists for terminals and quick notes on any device.

### 5. 💻 Integrated CLI Terminal (Ctrl+Shift+P)
Notula™ includes a powerful integrated command line for full, automated control of the memo archive:

```bash
# =========================================================================
# NOTULA™ CLI COMMAND GUIDE (Ing. Mario Fantini)
# =========================================================================

# 1. One-time Memo Creation (default --repeat none implicit)
add --title "Vehicle Inspection" --date 2026-09-01
add --title "Deliverable Submission" --date 2026-09-15 --desc "Structural Project"

# 2. Recurring Series Creation (repeat for N consecutive days)
add --title "Antibiotic Therapy" --date 2026-09-01 --repeat 10
add --title "Server Check" --date 2026-09-01 --repeat 30

# 3. Creation with AES-256 Hardware Encryption and Obfuscation
add --title "Confidential File" --date 2026-10-05 --desc "Bank IBAN Coordinates..." --encrypt --obfuscate full

# 4. Modification & Cascade Update (via automatic groupID)
edit --id memo_1725000001 --title "Postponed Inspection" --date 2026-09-08
edit --id memo_1725000002 --desc "Notes updated after interview"

# 5. Listing, Filtering & Inspection
ls                                  # Shows all archived memos
ls --year 2026                      # Filters one-time memos for the year 2026
ls --year 2026 --month 09           # Filters one-time memos for September 2026
ls --month 09 --recurring          # Filters recurring memos for September
ls --group grp_abc123               # Shows all memos belonging to the same series
ls --expired                        # Shows only expired memos
info memo_1725000001                # Complete diagnostic card with AES-256 details

# 6. Global Search
find --title "Inspection"           # Searches in title or description
find --date 2026-09-01              # Searches by exact date
find --id memo_1725000001           # Searches by unique ID

# 7. Multi-Format Data Export & PDF
export --id memo_1725000001 --format pdf     # Exports a single memo as A4 PDF
export --all --format json                  # Exports the entire archive to JSON
export --all --format xml                   # Exports the entire archive to XML
export --year 2026 --format ics             # Exports calendar for Google™ Calendar / Outlook
pdf --id memo_1725000001                    # Quick shortcut to download the PDF

# 8. Data Import
import --json '[{"title":"Hearing","expirationDate":"2026-09-10"}]'
import                                      # Opens graphic file selector to import .json or .xml

# 9. Data Deletion
rm --id memo_1725000001             # Removes the specific single memo
rm --group grp_abc123               # Removes the entire connected recurring series
rm --expired                        # Removes all expired memos at once

# 10. Security, Passphrase & Privacy Management
passwd MySuperPassword2026!         # Sets or updates the AES-256 Master Passphrase
passwd clear                        # Removes Master Passphrase (operates in clear text)
privacy on                          # Activates visual masking
privacy off                         # Deactivates visual masking

# 11. Cloud Synchronization & Utilities
sync                                # Synchronizes archive with Google™ Drive
cloud-test                          # Runs diagnostic test on Google™ Drive folder /Notula/
man                                 # Opens Official CLI Manual (LaTeX / Reference)
theme dark                          # Sets dark theme (dark | light | system)
clear                               # Clears the terminal screen
exit                                # Closes the CLI terminal
```
> 💡 **Integrated Official CLI Manual**: Notula™ includes a complete document viewer of the CLI Manual and allows downloading the academic typographic source **`cli_manual.tex`** (LaTeX compilable with `pdflatex` or `xelatex`).

---

## 🛠️ Technology Stack
- **Frontend & UI**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling & Layout**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Document Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **PWA Engine**: Native Service Worker + W3C standards-compliant Web App Manifest

---

## 🚀 Local Installation & Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (version **22 LTS** or higher recommended)
- `npm` package manager

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/notula-memo-engine.git
cd notula-memo-engine

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Production build
npm run build
```
The application will be accessible at `http://localhost:3000`.

---

## 🤖 GitHub Actions Automatic Build (Android APK & Desktop)
The repository includes CI/CD workflows pre-configured in `.github/workflows/`:
- **Android APK Build (`build-android.yml`)**:
  - Generates `.apk` files (Debug and Release) compatible with Android smartphones and tablets.
  - Can be executed manually from the GitHub **Actions** tab (*Run workflow*) or triggered automatically on version tag creation (`v*`) or `main` push.
  - The generated files (`Notula-v2.2.0-debug.apk`, `Notula-v2.2.0-release-unsigned.apk`) can be downloaded directly from the **Artifacts** section of the build or attached to the GitHub Release.
- **Cross-Platform Desktop Build (`build-desktop.yml`)**:
  - Generates native packages for **Windows** (`.exe`, installer and portable), **Linux** (`.AppImage`, `.deb`), and **macOS** (`.dmg`, `.zip`).

---

## 📱 Progressive Web App (PWA) Installation
Notula™ is optimized for standalone use:
- **On Android / Chrome**: Open the browser menu (three dots) and select **"Add to Home screen"** or **"Install app"**. The app will be created as a WebAPK with a standalone icon and no address bar.
- **On iOS / Safari**: Tap the share icon and select **"Add to Home Screen"**.
- **On Desktop (Chrome / Edge)**: Click the installation icon on the right side of the address bar.

---

## ⚖️ Intellectual Property & Legal Notes
- **Conception, Architecture & Software Development**: **Ing. Mario Fantini**
  - **Author Contacts**: [https://mariofantini.eu](https://mariofantini.eu)
  - **Copyright**: © 2026 Ing. Mario Fantini. All Rights Reserved.
- **Intellectual Property Notice**: This software architecture, parsing logic, and source code are the proprietary work of the author. Manifestations of interest for the complete acquisition of commercial rights and ownership buyout are welcome, subject to prior economic agreement, while preserving the historical and moral authorship.
  Contact: marfant7@gmail.com
*Trademark Notes*: Google™ Calendar and Google™ Drive are trademarks of Google™ LLC. Notula™ is not sponsored by or affiliated with Google™ LLC.
"""

new_content = english_content + "\n\n---\n<!-- ITALIAN VERSION / VERSIONE ITALIANA -->\n---\n\n" + italian_content

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

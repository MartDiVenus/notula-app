import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state definition
old_state = """  const [guideSection, setGuideSection] = useState<
    'all' | 'intro' | 'features' | 'legend' | 'security' | 'exports' | 'sync' | 'daily' | 'cli'
  >('all');"""
new_state = """  const [guideSection, setGuideSection] = useState<
    'all' | 'intro' | 'features' | 'legend' | 'security' | 'exports' | 'sync' | 'calendar' | 'daily' | 'cli'
  >('all');"""
content = content.replace(old_state, new_state)

# 2. Add Tab Button
old_tab_sync = """                <button
                  type="button"
                  onClick={() => setGuideSection('sync')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'sync' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "6. Google™ Drive" : "6. Google™ Drive"}
                </button>"""
new_tab_sync = """                <button
                  type="button"
                  onClick={() => setGuideSection('sync')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'sync' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "6. Google™ Drive" : "6. Google™ Drive"}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideSection('calendar')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    guideSection === 'calendar' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {settings.language === "en" ? "7. Native Calendar" : "7. Calendario Nativo"}
                </button>"""
content = content.replace(old_tab_sync, new_tab_sync)

# 3. Add Content Block
# Wait, I need to increment the numbers of the subsequent sections (Daily Digest -> 8, CLI -> 9)
content = content.replace('"7. Daily Digest"', '"8. Daily Digest"')
content = content.replace('"7. Sintesi Giornaliera"', '"8. Sintesi Giornaliera"')
content = content.replace('7. SINTESI GIORNALIERA', '8. SINTESI GIORNALIERA')
content = content.replace('7. Daily Digest / Sintesi', '8. Daily Digest / Sintesi')
content = content.replace('"8. Terminal CLI (Pro Users)"', '"9. Terminal CLI (Pro Users)"')
content = content.replace('8. TERMINALE', '9. TERMINALE')
content = content.replace('8. Terminale / Interfaccia CLI', '9. Terminale / Interfaccia CLI')

calendar_section = """              {/* ------------------------------------------------------------- */}
              {/* 7. CALENDARIO NATIVO / NOTIFICHE */}
              {/* ------------------------------------------------------------- */}
              {(guideSection === 'all' || guideSection === 'calendar') && (
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span>{settings.language === "en" ? "7. Native Calendar Sync & Offline Notifications" : "7. Sincronizzazione Calendario Nativo e Notifiche Offline"}</span>
                  </div>
                  
                  <div className="space-y-3 text-xs text-[var(--text-muted)]">
                    <p>
                      {settings.language === "en" 
                        ? "To guarantee infallible notifications even when Notula™ is completely closed (especially on mobile devices without background processes), the app natively supports the " 
                        : "Per garantire l'infallibilità delle notifiche anche quando Notula™ è completamente chiusa (specialmente sui dispositivi mobile privi di processi in background), l'app supporta nativamente lo "}
                      <strong>{settings.language === "en" ? ".ics (iCalendar) format" : "formato .ics (iCalendar)"}</strong>.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <h4 className="font-bold text-[var(--text-main)] mb-1">{settings.language === "en" ? "Mobile (Android / iOS)" : "Smartphone (Android / iOS)"}</h4>
                        <p className="text-[11px] leading-relaxed">
                          {settings.language === "en" 
                            ? "Mobile operating systems strictly pause Web Apps in the background to save battery. To get a guaranteed alert, click the green [+] button next to a memo. Your phone will immediately prompt you to add it to your native calendar (Google Calendar, Apple Calendar). The hardware will then handle waking up your phone at the exact minute." 
                            : "I sistemi operativi mobile ibernano le Web App in background per risparmiare batteria. Per avere una notifica garantita al 100%, clicca sul pulsante verde [+] a fianco di un memo. Il telefono ti proporrà subito di aggiungerlo al calendario di sistema (Google Calendar, Apple Calendar). Sarà l'hardware a farti suonare il telefono al minuto esatto."}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <h4 className="font-bold text-[var(--text-main)] mb-1">{settings.language === "en" ? "Desktop (Windows / Mac / Linux)" : "Desktop (Windows / Mac / Linux)"}</h4>
                        <p className="text-[11px] leading-relaxed">
                          {settings.language === "en" 
                            ? "You have two options: either use the downloaded .exe/.deb which shrinks to the System Tray to act as a background daemon, OR simply click the green [+] button in the Web version to download the .ics file. Opening the file adds it to Thunderbird, Outlook, or GNOME Calendar, keeping you notified even with the browser closed." 
                            : "Hai due opzioni: o usi il pacchetto .exe/.deb scaricato che si minimizza nella System Tray fungendo da demone in background, OPPURE clicchi semplicemente il pulsante verde [+] nella versione Web per scaricare il file .ics. Aprendolo, il memo verrà inserito in Thunderbird, Outlook o GNOME Calendar, garantendoti la notifica anche a browser chiuso."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
"""

# Find the insertion point: right after section 6 (sync)
insertion_marker = """              {/* ------------------------------------------------------------- */}
              {/* 8. SINTESI GIORNALIERA */}
              {/* ------------------------------------------------------------- */}"""
content = content.replace(insertion_marker, calendar_section + "\n" + insertion_marker)

# Make sure Calendar is imported if not already. Wait, let's check imports.
# In InfoGuideModal, we might need to import Calendar from lucide-react if not present.
if "Calendar," not in content and "Calendar " not in content:
    content = content.replace("Shield,", "Shield,\n  Calendar,")

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


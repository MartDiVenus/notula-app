import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_calendar_text = """                  <div className="space-y-3 text-xs text-[var(--text-muted)]">
                    <p>
                      {settings.language === "en" 
                        ? "To guarantee infallible notifications even when Notula™ is completely closed (especially on mobile devices without background processes), the app natively supports the " 
                        : "Per garantire l'infallibilità delle notifiche anche quando Notula™ è completamente chiusa (specialmente sui dispositivi mobile privi di processi in background), l'app supporta nativamente lo "}
                      <strong>{settings.language === "en" ? ".ics (iCalendar) format" : "formato .ics (iCalendar)"}</strong>. 
                      {settings.language === "en"
                        ? " This format synchronizes perfectly with Google Calendar, Apple Calendar, and Microsoft Outlook."
                        : " Questo formato si sincronizza perfettamente con Google Calendar, Apple Calendar e Microsoft Outlook."}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <h4 className="font-bold text-[var(--text-main)] mb-1">{settings.language === "en" ? "Mobile (Android / iOS)" : "Smartphone (Android / iOS)"}</h4>
                        <p className="text-[11px] leading-relaxed">
                          {settings.language === "en" 
                            ? "Mobile operating systems strictly pause Web Apps in the background to save battery. To get a guaranteed alert, click the green [+] button next to a memo. Your phone will immediately prompt you to add it to your native calendar (Google Calendar, Apple Calendar, or Outlook). The hardware will then handle waking up your phone at the exact minute." 
                            : "I sistemi operativi mobile ibernano le Web App in background per risparmiare batteria. Per avere una notifica garantita al 100%, clicca sul pulsante verde [+] a fianco di un memo. Il telefono ti proporrà subito di aggiungerlo al calendario di sistema (Google Calendar, Apple Calendar o Outlook). Sarà l'hardware a farti suonare il telefono al minuto esatto."}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <h4 className="font-bold text-[var(--text-main)] mb-1">{settings.language === "en" ? "Desktop (Windows / Mac / Linux)" : "Desktop (Windows / Mac / Linux)"}</h4>
                        <p className="text-[11px] leading-relaxed">
                          {settings.language === "en" 
                            ? "You have two options: either use the downloaded .exe/.deb which shrinks to the System Tray to act as a background daemon, OR simply click the green [+] button in the Web version to download the .ics file. Opening the file adds it to Thunderbird, Outlook, Windows Calendar, or GNOME Calendar, keeping you notified even with the browser closed." 
                            : "Hai due opzioni: o usi il pacchetto .exe/.deb scaricato che si minimizza nella System Tray fungendo da demone in background, OPPURE clicchi semplicemente il pulsante verde [+] nella versione Web per scaricare il file .ics. Aprendolo, il memo verrà inserito in Thunderbird, Outlook, Windows Calendar o GNOME Calendar, garantendoti la notifica anche a browser chiuso."}
                        </p>
                      </div>
                    </div>
                  </div>"""
new_calendar_text = """                  <div className="space-y-3 text-xs text-[var(--text-muted)]">
                    <p>
                      {settings.language === "en" 
                        ? "To guarantee infallible notifications even when Notula™ is completely closed (especially on mobile devices without background processes), the app directly integrates with " 
                        : "Per garantire l'infallibilità delle notifiche anche quando Notula™ è completamente chiusa (specialmente sui dispositivi mobile privi di processi in background), l'app si integra direttamente con "}
                      <strong>Google Calendar</strong>. 
                      {settings.language === "en"
                        ? " You can automatically sync any memo with a single click, completely bypassing the manual download of .ics files."
                        : " Puoi sincronizzare in automatico qualsiasi memo con un solo clic, bypassando completamente lo scaricamento manuale dei file .ics."}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <h4 className="font-bold text-[#4285F4] flex items-center gap-1.5 mb-2">
                          <CalendarPlus className="w-4 h-4" />
                          {settings.language === "en" ? "Automated Sync (1-Click)" : "Sincronizzazione Automatica (1-Click)"}
                        </h4>
                        <p className="text-[11px] leading-relaxed mb-2">
                          {settings.language === "en" 
                            ? "Click the blue Google Calendar button next to any memo. Notula™ will instantly beam the exact date, time, and description directly to your Google Calendar, ready to be saved. The Google infrastructure will then securely handle waking up your phone or sending you an email at the exact minute." 
                            : "Clicca il pulsante blu di Google Calendar a fianco di un memo. Notula™ invierà istantaneamente data, orario e descrizione esatti direttamente al tuo Google Calendar, pronti per il salvataggio. L'infrastruttura Google si occuperà poi in totale sicurezza di farti suonare il telefono al minuto esatto o di inviarti un'email."}
                        </p>
                        
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                          <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 text-[11px]">
                            <Download className="w-3.5 h-3.5" />
                            {settings.language === "en" ? "What about .ics export?" : "E l'esportazione .ics?"}
                          </h4>
                          <p className="text-[10px] leading-relaxed">
                            {settings.language === "en"
                              ? "The manual .ics download button is still available (green icon) as a legacy fallback for users utilizing Thunderbird, Outlook, or Apple Calendar on Desktop. However, for a fully automated mobile experience, the direct Google Calendar sync is the absolute recommended standard."
                              : "Il pulsante per lo scaricamento manuale .ics è stato mantenuto (icona verde) come fallback per gli utenti che utilizzano sistemi desktop come Thunderbird, Outlook o Apple Calendar. Tuttavia, per l'efficienza su mobile, la sincronizzazione diretta con Google Calendar rappresenta lo standard raccomandato."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>"""
content = content.replace(old_calendar_text, new_calendar_text)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

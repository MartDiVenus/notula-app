import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_guide = '''                    <p>
                      {settings.language === "en" 
                        ? "To guarantee infallible notifications even when Notula™ is completely closed (especially on mobile devices without background processes), the app directly integrates with " 
                        : "Per garantire l'infallibilità delle notifiche anche quando Notula™ è completamente chiusa (specialmente sui dispositivi mobile privi di processi in background), l'app si integra direttamente con "}
                      <strong>Google Calendar</strong>. 
                      {settings.language === "en"
                        ? " You can automatically sync any memo with a single click, completely bypassing the manual download of .ics files."
                        : " Puoi sincronizzare in automatico qualsiasi memo con un solo clic, bypassando completamente lo scaricamento manuale dei file .ics."}
                    </p>'''

new_guide = '''                    <p>
                      {settings.language === "en" 
                        ? "To guarantee infallible notifications even when Notula™ is completely closed (especially on mobile devices without background processes), the app directly integrates with " 
                        : "Per garantire l'infallibilità delle notifiche anche quando Notula™ è completamente chiusa (specialmente sui dispositivi mobile privi di processi in background), l'app si integra direttamente con "}
                      <strong>Google Calendar</strong>. 
                      {settings.language === "en"
                        ? " You can automatically sync any memo with a single click, completely bypassing the manual download of .ics files. "
                        : " Puoi sincronizzare in automatico qualsiasi memo con un solo clic, bypassando completamente lo scaricamento manuale dei file .ics. "}
                    </p>
                    <p className="mt-2 p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 rounded-lg">
                      {settings.language === "en"
                        ? "Important: To receive offline notifications on your smartphone, you must have the Google Calendar app installed and avoid clearing its cache. When you use Notula's 'Cloud' sync button to restore backups from Google Drive on a new device, Notula will automatically repopulate your Google Calendar with all your active memos!"
                        : "Importante: per ricevere le notifiche offline sullo smartphone, devi avere l'app Google Calendar installata e non svuotarne la cache. Quando usi il pulsante di sincronizzazione 'Cloud' per ripristinare il backup da Google Drive su un nuovo dispositivo, Notula ripopolerà automaticamente anche il tuo Google Calendar in un colpo solo!"}
                    </p>'''

content = content.replace(old_guide, new_guide)

old_guide_2 = '''                    <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {settings.language === "en" ? "Desktop Fallback" : "Fallback per Desktop"}
                          </span>
                        </div>
                        <div className="pl-6 space-y-2">
                          <p className="text-[10px] leading-relaxed">'''

new_guide_2 = '''                    <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {settings.language === "en" ? "Desktop Fallback & Executables" : "Fallback Desktop ed Eseguibili"}
                          </span>
                        </div>
                        <div className="pl-6 space-y-2">
                          <p className="text-[10px] leading-relaxed">
                            {settings.language === "en"
                              ? "Since Notula™ is perfectly capable of functioning offline via browser cache and robustly syncing data via Google Drive and Calendar, native executables (.exe, .deb) are completely unnecessary. We removed their workflows to maintain code cleanliness."
                              : "Poiché Notula™ funziona perfettamente offline tramite la cache del browser e sincronizza solidamente i dati tramite Google Drive e Calendar, gli eseguibili nativi (.exe, .deb) sono risultati del tutto inutili e i relativi flussi di compilazione sono stati rimossi per pulizia del codice."}
                          </p>
                          <p className="text-[10px] leading-relaxed">'''

content = content.replace(old_guide_2, new_guide_2)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

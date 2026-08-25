import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_ics_block = '''                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                          <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 text-[11px]">
                            <CalendarPlus className="w-3.5 h-3.5 text-emerald-500" />
                            {settings.language === "en" ? "What about .ics export?" : "E l'esportazione .ics?"}
                          </h4>
                          <p className="text-[10px] leading-relaxed">
                            {settings.language === "en"
                              ? "The manual .ics download button is still available (always green) in the memo menus as a fallback for users utilizing Thunderbird, Outlook, or Apple Calendar on Desktop. However, for a fully automated mobile experience, the direct Google Calendar sync is the absolute recommended standard. Note: GCal notifications replace internal Notula alarms, which are kept only for offline/local-only purposes."
                              : "Il pulsante per lo scaricamento manuale .ics è stato mantenuto sempre visibile in verde nei menu dei memo, come fallback per sistemi desktop quali Thunderbird o Apple Calendar. Tuttavia, la sincronizzazione diretta con Google Calendar rappresenta lo standard raccomandato. Nota: le notifiche di GCal sostituiscono gli allarmi interni di Notula (in Impostazioni), che sono mantenuti solo per chi usa l'app offline."}
                          </p>
                        </div>'''

new_ics_block = '''                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                          <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 text-[11px]">
                            <CalendarPlus className="w-3.5 h-3.5 text-emerald-500" />
                            {settings.language === "en" ? "Desktop OS Notifications (Windows, Mac, Linux)" : "Notifiche su Desktop (Windows, Mac, Linux)"}
                          </h4>
                          <p className="text-[10px] leading-relaxed mb-2">
                            {settings.language === "en"
                              ? "To receive Google Calendar notifications on a Desktop PC without keeping the browser open, you must link your Google Account directly in your Operating System settings:"
                              : "Per ricevere le notifiche di Google Calendar su PC Desktop senza tenere il browser aperto, devi collegare il tuo Account Google direttamente nelle impostazioni del tuo Sistema Operativo:"}
                          </p>
                          <ul className="list-disc pl-4 text-[10px] text-[var(--text-muted)] space-y-1 mb-2">
                            <li><strong>Windows:</strong> {settings.language === "en" ? "Settings > Accounts > Email & accounts > Add Google account. (Notifications appear via Windows Calendar)." : "Impostazioni > Account > E-mail e account > Aggiungi account Google. (Le notifiche appariranno tramite il Calendario di Windows)."}</li>
                            <li><strong>macOS:</strong> {settings.language === "en" ? "System Settings > Internet Accounts > Google." : "Impostazioni di Sistema > Account Internet > Google."}</li>
                            <li><strong>Linux (Debian/Ubuntu):</strong> {settings.language === "en" ? "Settings > Online Accounts > Google. (GNOME will handle notifications natively)." : "Impostazioni > Account Online > Google. (GNOME gestirà le notifiche nativamente)."}</li>
                          </ul>
                          <p className="text-[10px] leading-relaxed mb-2">
                            {settings.language === "en"
                              ? "Fallback: Notula also programs Google Calendar to send an Email reminder. If you have an email client (like Thunderbird) open, you will receive the alert there!"
                              : "Fallback: Notula programma Google Calendar per inviare anche un promemoria via Email. Se hai un client di posta (es. Thunderbird) aperto, riceverai l'avviso lì!"}
                          </p>
                          <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 text-[11px] mt-3">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            {settings.language === "en" ? "What about .ics export and native executables?" : "E l'esportazione .ics e i vecchi eseguibili?"}
                          </h4>
                          <p className="text-[10px] leading-relaxed">
                            {settings.language === "en"
                              ? "The manual .ics download is still available (green icon) as a fallback for offline systems. Also, since Notula functions perfectly as a web cache with Cloud sync, native executables (.exe, .deb) have been permanently removed to keep the code clean."
                              : "Lo scaricamento manuale .ics è ancora disponibile (icona verde) come fallback per i sistemi offline. Inoltre, poiché Notula funziona perfettamente tramite cache web e sync Cloud, i vecchi eseguibili nativi (.exe, .deb) sono stati rimossi in via definitiva per mantenere l'app pulita e leggera."}
                          </p>
                        </div>'''

content = content.replace(old_ics_block, new_ics_block)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

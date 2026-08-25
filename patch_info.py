import re

with open('src/components/InfoGuideModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Dual Interface: GUI • CLI" : "Doppia Interfaccia: GUI • CLI"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "High reactivity graphical interface with interactive calendar combined with a powerful engineering command line terminal." : "Interfaccia grafica ad alta reattività con calendario interattivo unita a un potente terminale a riga di comando ingegneristico."}
                      </p>
                    </div>"""

replacement = """                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Dual Interface: GUI • CLI" : "Doppia Interfaccia: GUI • CLI"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "High reactivity graphical interface with interactive calendar combined with a powerful engineering command line terminal." : "Interfaccia grafica ad alta reattività con calendario interattivo unita a un potente terminale a riga di comando ingegneristico."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{settings.language === "en" ? "Optional Native OS Notifications" : "Notifiche OS Native Opzionali"}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {settings.language === "en" ? "Follows a conscious consultation philosophy (Calendar-First), but allows enabling push notifications fully integrated with your operating system (Windows, macOS, Linux, Android)." : "Adotta una filosofia a consultazione consapevole (Calendar-First), ma permette di attivare notifiche push perfettamente integrate con il sistema operativo (Windows, macOS, Linux, Android)."}
                      </p>
                    </div>"""

content = content.replace(target, replacement)

with open('src/components/InfoGuideModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

ui_block = """          {/* Google Calendar Sync */}
          <div className="pt-2 border-t border-[var(--border-color)]">
            <label className="flex items-center gap-3 cursor-pointer group mb-2">
              <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${gCalSync ? 'bg-[#4285F4]' : 'bg-[var(--border-color)]'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${gCalSync ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[var(--text-main)] group-hover:text-[#4285F4] transition">
                  {settings.language === "en" ? "Sync with Google Calendar" : "Sincronizza con Google Calendar"}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {settings.language === "en" ? "Automatically add this memo to your calendar" : "Aggiungi automaticamente questo memo al calendario"}
                </div>
              </div>
            </label>

            {gCalSync && (
              <div className="mb-4 p-4 rounded-xl border border-[#4285F4]/30 bg-[#4285F4]/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {settings.language === "en" ? "Days Before" : "Giorni di preavviso"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={alertDaysBefore}
                      onChange={(e) => setAlertDaysBefore(parseInt(e.target.value) || 0)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {settings.language === "en" ? "Notification Time" : "Orario notifica"}
                    </label>
                    <input
                      type="time"
                      value={alertTime}
                      onChange={(e) => setAlertTime(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {settings.language === "en" 
                    ? "A reminder will be set on your Google Calendar event using these preferences."
                    : "Verrà impostato un promemoria sull'evento di Google Calendar utilizzando queste preferenze."}
                </p>
              </div>
            )}
          </div>

          {/* Description */}"""

content = content.replace("{/* Description */}", ui_block)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

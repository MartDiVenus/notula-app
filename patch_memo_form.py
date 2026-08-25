import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variables
state_vars = """  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [obfuscation, setObfuscation] = useState<ObfuscationLevel>('none');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [gCalSync, setGCalSync] = useState<boolean>(false);
  const [alertDaysBefore, setAlertDaysBefore] = useState<number>(0);
  const [alertTime, setAlertTime] = useState<string>('09:00');
  const [error, setError] = useState<string | null>(null);"""

content = re.sub(r'  const \[repeatType, setRepeatType\].*?const \[error, setError\] = useState<string \| null>\(null\);', state_vars, content, flags=re.DOTALL)

# 2. Add useEffect initialization
init_block = """      setRepeatType(initialMemo.repeatType);
      setObfuscation(initialMemo.obfuscation || 'none');
      setIsEncrypted(initialMemo.isEncrypted || false);
      setGCalSync(initialMemo.gCalSync || false);
      setAlertDaysBefore(initialMemo.alertDaysBefore || 0);
      setAlertTime(initialMemo.alertTime || '09:00');
    } else {
      setTitle('');
      setDescription('');
      setExpirationDate(defaultDate || getLocalYYYYMMDD());
      setTime('');
      setRepeatType('none');
      setObfuscation('none');
      setIsEncrypted(false);
      setGCalSync(false);
      setAlertDaysBefore(0);
      setAlertTime('09:00');"""
      
content = re.sub(r'      setRepeatType\(initialMemo\.repeatType\);.*?setIsEncrypted\(false\);', init_block, content, flags=re.DOTALL)

# 3. Add to onSave
save_block = """    onSave({
      title: title.trim(),
      description: description.trim(),
      expirationDate,
      time: time || undefined,
      repeatType,
      obfuscation,
      isEncrypted,
      gCalSync,
      alertDaysBefore,
      alertTime
    });"""

content = re.sub(r'    onSave\(\{\s+title: title\.trim\(\),\s+description: description\.trim\(\),\s+expirationDate,\s+time: time \|\| undefined,\s+repeatType,\s+obfuscation,\s+isEncrypted,\s+\}\);', save_block, content, flags=re.DOTALL)


# 4. Add the new UI fields in the form
# We will insert it right before the "Opzioni Avanzate" block
ui_block = """            {/* Google Calendar Sync */}
            <div className="pt-4 border-t border-[var(--border-color)]">
              <label className="flex items-center gap-3 cursor-pointer group">
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
                <div className="mt-4 p-4 rounded-xl border border-[#4285F4]/30 bg-[#4285F4]/5 space-y-4 animate-in fade-in slide-in-from-top-2">
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

            {/* Opzioni Avanzate */}"""

content = content.replace("{/* Opzioni Avanzate */}", ui_block)


with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

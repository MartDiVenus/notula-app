import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Toast state
state_target = "const [theme, setTheme] = useState<ThemeMode>('system');"
state_replacement = """const [theme, setTheme] = useState<ThemeMode>('system');
  const [toastNotif, setToastNotif] = useState<{title: string, body: string} | null>(null);

  useEffect(() => {
    const handleToast = (e: any) => {
      setToastNotif({ title: e.detail.title, body: e.detail.body });
      setTimeout(() => setToastNotif(null), 8000);
    };
    window.addEventListener('notula-toast', handleToast);
    return () => window.removeEventListener('notula-toast', handleToast);
  }, []);"""

content = content.replace(state_target, state_replacement)

# Add Toast UI to the end of the return statement
ui_target = "    </div>\n  );\n}"
ui_replacement = """      {/* Global In-App Toast Fallback */}
      {toastNotif && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl rounded-2xl p-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
           <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                 <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <div className="font-bold text-[var(--text-main)] text-sm">{toastNotif.title}</div>
                 <div className="text-[var(--text-muted)] text-xs mt-1 leading-relaxed">{toastNotif.body}</div>
              </div>
              <button onClick={() => setToastNotif(null)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-main)] transition">
                 <X className="w-4 h-4" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}"""

content = content.replace(ui_target, ui_replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

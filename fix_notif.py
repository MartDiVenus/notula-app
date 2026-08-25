with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

bad = """        // Dispatch In-App Toast event
        window.dispatchEvent(new CustomEvent('notula-toast', { 
           detail: { title, body } 
        }));
        const body = settings.language === 'en' 
          ? `You have ${analysis.memos.length} memo(s) scheduled for today.`
          : `Hai ${analysis.memos.length} promemoria in programma per oggi.`;"""

good = """        const body = settings.language === 'en' 
          ? `You have ${analysis.memos.length} memo(s) scheduled for today.`
          : `Hai ${analysis.memos.length} promemoria in programma per oggi.`;
          
        // Dispatch In-App Toast event
        window.dispatchEvent(new CustomEvent('notula-toast', { 
           detail: { title, body } 
        }));"""

content = content.replace(bad, good)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

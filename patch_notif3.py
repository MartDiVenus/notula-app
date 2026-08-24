with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CustomEvent dispatching
target = "const title = settings.language === 'en' ? 'Notula: Memos Today' : 'Notula: Promemoria Odierni';"

replacement = """const title = settings.language === 'en' ? 'Notula: Memos Today' : 'Notula: Promemoria Odierni';
        
        // Dispatch In-App Toast event
        window.dispatchEvent(new CustomEvent('notula-toast', { 
           detail: { title, body } 
        }));"""

content = content.replace(target, replacement)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

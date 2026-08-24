import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const [, setRenderTrigger] = useState<number>(0);",
    "const [renderTrigger, setRenderTrigger] = useState<number>(0);"
)

content = content.replace(
    "useTodayNotifications(coreRef.current);",
    "useTodayNotifications(coreRef.current, renderTrigger);"
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/hooks/useTodayNotifications.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify hook signature to accept renderTrigger
content = content.replace(
    "export const useTodayNotifications = (core: NotulaCore) => {",
    "export const useTodayNotifications = (core: NotulaCore, renderTrigger: number) => {"
)

# Change tracking from hasNotifiedToday string to a set of IDs
content = content.replace(
    "const hasNotifiedToday = useRef<string | null>(null);",
    "const notifiedIds = useRef<Set<string>>(new Set());"
)

# Update useEffect dependencies
content = content.replace(
    "}, [core, settings.notifications, settings.sound, settings.language]);",
    "}, [core, settings.notifications, settings.sound, settings.language, renderTrigger]);"
)

# Update the condition
old_condition = """    // Check if we already notified today
    if (hasNotifiedToday.current === todayStr) return;

    // Analyze today
    const analysis = core.analyzeDay(today.getFullYear(), today.getMonth(), today.getDate(), todayStr);

    if (analysis.memos.length > 0) {"""

new_condition = """    // Analyze today
    const analysis = core.analyzeDay(today.getFullYear(), today.getMonth(), today.getDate(), todayStr);

    // Find new memos we haven't notified about yet
    const currentIds = analysis.memos.map(m => m.id);
    const hasNewMemos = currentIds.some(id => !notifiedIds.current.has(id));

    if (analysis.memos.length > 0 && hasNewMemos) {"""
content = content.replace(old_condition, new_condition)

# Update the set with notified IDs instead of date string
content = content.replace(
    "hasNotifiedToday.current = todayStr;",
    "analysis.memos.forEach(m => notifiedIds.current.add(m.id));"
)

with open('src/hooks/useTodayNotifications.ts', 'w', encoding='utf-8') as f:
    f.write(content)

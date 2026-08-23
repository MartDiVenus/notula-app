with open('src/types.ts', 'r') as f:
    content = f.read()

new_content = content.replace(
    "export const REPEAT_LABELS_IT: Record<RepeatType, string> = {",
    "export const REPEAT_LABELS_EN: Record<RepeatType, string> = {\n  none: 'one-time',\n  daily: 'daily',\n  weekly: 'weekly',\n  monthly: 'monthly',\n  yearly: 'yearly',\n};\n\nexport const REPEAT_LABELS_IT: Record<RepeatType, string> = {"
)

with open('src/types.ts', 'w') as f:
    f.write(new_content)

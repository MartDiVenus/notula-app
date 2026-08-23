with open('./src/components/CalendarView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const recurrenceLabel = REPEAT_LABELS_IT, REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType;", "const recurrenceLabel = settings.language === 'en' ? (REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType) : (REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType);")
content = content.replace("import { MemoItem, DayAnalysis, REPEAT_LABELS_IT } from '../types';", "import { MemoItem, DayAnalysis, REPEAT_LABELS_IT, REPEAT_LABELS_EN } from '../types';")
content = content.replace("const recurrenceLabel = settings.language === 'en' ? (REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType) : (REPEAT_LABELS_IT, REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType);", "const recurrenceLabel = settings.language === 'en' ? (REPEAT_LABELS_EN[memo.repeatType] || memo.repeatType) : (REPEAT_LABELS_IT[memo.repeatType] || memo.repeatType);")

with open('./src/components/CalendarView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

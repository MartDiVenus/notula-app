import re

with open('src/utils/notulaCore.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# createMemo params
pattern_create = r"public createMemo\(params: \{.*?isEncrypted\?: boolean;\n    groupId\?: string;\n  \}\): MemoItem \{"
new_create = """public createMemo(params: {
    title: string;
    description?: string;
    expirationDate: string; // YYYY-MM-DD
    time?: string; // HH:MM
    repeatType?: RepeatType;
    obfuscation?: ObfuscationLevel;
    isEncrypted?: boolean;
    groupId?: string;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
    gCalEventId?: string;
  }): MemoItem {"""

content = re.sub(pattern_create, new_create, content, flags=re.DOTALL)

# createMemo assignments
pattern_assign = r"isEncrypted: !!params\.isEncrypted,\n      createdAt: new Date\(\)\.toISOString\(\),\n"
new_assign = """isEncrypted: !!params.isEncrypted,
      gCalSync: params.gCalSync,
      alertDaysBefore: params.alertDaysBefore,
      alertTime: params.alertTime,
      gCalEventId: params.gCalEventId,
      createdAt: new Date().toISOString(),\n"""

content = re.sub(pattern_assign, new_assign, content)

# updateMemo params
pattern_update = r"public updateMemo\(params: \{.*?isEncrypted\?: boolean;\n    updateEntireGroup\?: boolean;\n  \}\): MemoItem\[\] \{"
new_update = """public updateMemo(params: {
    id: string;
    title?: string;
    description?: string;
    expirationDate?: string; // YYYY-MM-DD
    time?: string; // HH:MM
    repeatType?: RepeatType;
    obfuscation?: ObfuscationLevel;
    isEncrypted?: boolean;
    updateEntireGroup?: boolean;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
    gCalEventId?: string;
  }): MemoItem[] {"""

content = re.sub(pattern_update, new_update, content, flags=re.DOTALL)

# updateMemo assignments inside loop
# We need to find the assignments and update them
# It usually looks like target.title = params.title.trim();
pattern_update_assign = r"(if \(params\.isEncrypted !== undefined\) \{ target\.isEncrypted = params\.isEncrypted; \})"
new_update_assign = r"\1\n      if (params.gCalSync !== undefined) { target.gCalSync = params.gCalSync; }\n      if (params.alertDaysBefore !== undefined) { target.alertDaysBefore = params.alertDaysBefore; }\n      if (params.alertTime !== undefined) { target.alertTime = params.alertTime; }\n      if (params.gCalEventId !== undefined) { target.gCalEventId = params.gCalEventId; }"

content = re.sub(pattern_update_assign, new_update_assign, content)

with open('src/utils/notulaCore.ts', 'w', encoding='utf-8') as f:
    f.write(content)

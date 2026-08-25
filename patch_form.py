import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Props
old_props = """  onSave: (data: {
    title: string;
    description: string;
    expirationDate: string;
    repeatType: RepeatType;
    obfuscation: ObfuscationLevel;
    isEncrypted?: boolean;
  }) => void;"""
new_props = """  onSave: (data: {
    title: string;
    description: string;
    expirationDate: string;
    time?: string;
    repeatType: RepeatType;
    obfuscation: ObfuscationLevel;
    isEncrypted?: boolean;
  }) => void;"""
content = content.replace(old_props, new_props)

# State
old_state = """  const [expirationDate, setExpirationDate] = useState('');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');"""
new_state = """  const [expirationDate, setExpirationDate] = useState('');
  const [time, setTime] = useState('');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');"""
content = content.replace(old_state, new_state)

# Effect set
old_effect = """      setExpirationDate(initialMemo.expirationDate);
      setRepeatType(initialMemo.repeatType);"""
new_effect = """      setExpirationDate(initialMemo.expirationDate);
      setTime(initialMemo.time || '');
      setRepeatType(initialMemo.repeatType);"""
content = content.replace(old_effect, new_effect)

# Effect unset
old_effect_else = """      setExpirationDate(defaultDate || getLocalYYYYMMDD());
      setRepeatType('none');"""
new_effect_else = """      setExpirationDate(defaultDate || getLocalYYYYMMDD());
      setTime('');
      setRepeatType('none');"""
content = content.replace(old_effect_else, new_effect_else)

# Submit
old_submit = """    onSave({
      title: title.trim(),
      description: description.trim(),
      expirationDate,
      repeatType,
      obfuscation,
      isEncrypted,
    });"""
new_submit = """    onSave({
      title: title.trim(),
      description: description.trim(),
      expirationDate,
      time: time || undefined,
      repeatType,
      obfuscation,
      isEncrypted,
    });"""
content = content.replace(old_submit, new_submit)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

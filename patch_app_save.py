import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_save = """  const handleSaveMemoForm = (data: {
    title: string;
    description: string;
    expirationDate: string;
    repeatType: any;
    obfuscation: any;
    isEncrypted?: boolean;
    updateEntireGroup?: boolean;
  }) => {
    if (editingMemo) {
      coreRef.current.updateMemo({
        id: editingMemo.id,
        title: data.title,
        description: data.description,
        expirationDate: data.expirationDate,
        repeatType: data.repeatType,
        obfuscation: data.obfuscation,
        isEncrypted: data.isEncrypted,
        updateEntireGroup: data.updateEntireGroup,
      });
    } else {
      coreRef.current.createMemo(data);
    }"""
new_save = """  const handleSaveMemoForm = (data: {
    title: string;
    description: string;
    expirationDate: string;
    time?: string;
    repeatType: any;
    obfuscation: any;
    isEncrypted?: boolean;
    updateEntireGroup?: boolean;
  }) => {
    if (editingMemo) {
      coreRef.current.updateMemo({
        id: editingMemo.id,
        title: data.title,
        description: data.description,
        expirationDate: data.expirationDate,
        time: data.time,
        repeatType: data.repeatType,
        obfuscation: data.obfuscation,
        isEncrypted: data.isEncrypted,
        updateEntireGroup: data.updateEntireGroup,
      });
    } else {
      coreRef.current.createMemo(data);
    }"""
content = content.replace(old_save, new_save)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

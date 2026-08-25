import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_submit = '''  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Il titolo è obbligatorio.");
      return;
    }
    if (!expirationDate) {
      setError("La data è obbligatoria.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      expirationDate,
      time: time || undefined,
      repeatType,
      obfuscation,
      isEncrypted,
      gCalSync,
      alertDaysBefore,
      alertTime
    });
    onClose();
  };'''

new_submit = '''  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Il titolo è obbligatorio.");
      return;
    }
    if (!expirationDate) {
      setError("La data è obbligatoria.");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        expirationDate,
        time: time || undefined,
        repeatType,
        obfuscation,
        isEncrypted,
        gCalSync,
        alertDaysBefore,
        alertTime
      });
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Errore durante il salvataggio o la sincronizzazione.");
    }
  };'''

content = content.replace(old_submit, new_submit)

# Also update the type of onSave to return Promise<void> | void
old_onsave = '''  onSave: (data: {
    title: string;
    description: string;
    expirationDate: string;
    time?: string;
    repeatType: RepeatType;
    obfuscation: ObfuscationLevel;
    isEncrypted: boolean;
    updateEntireGroup?: boolean;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
  }) => void;'''

new_onsave = '''  onSave: (data: {
    title: string;
    description: string;
    expirationDate: string;
    time?: string;
    repeatType: RepeatType;
    obfuscation: ObfuscationLevel;
    isEncrypted: boolean;
    updateEntireGroup?: boolean;
    gCalSync?: boolean;
    alertDaysBefore?: number;
    alertTime?: string;
  }) => Promise<void> | void;'''

content = content.replace(old_onsave, new_onsave)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

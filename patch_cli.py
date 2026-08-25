import re

with open('src/components/TerminalCLI.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add
old_add = """          const title = getFlag(args, '--title');
          const date = getFlag(args, '--date');
          const desc = getFlag(args, '--desc') || '';"""
new_add = """          const title = getFlag(args, '--title');
          const date = getFlag(args, '--date');
          const time = getFlag(args, '--time');
          const desc = getFlag(args, '--desc') || '';"""
content = content.replace(old_add, new_add)

old_add_call = """          const created = core.createMemo({
            title,
            description: desc,
            expirationDate: date,
            repeatType: repeatType,
            obfuscation: obfuscate,
            isEncrypted,
            groupId: groupId || undefined,
          });"""
new_add_call = """          const created = core.createMemo({
            title,
            description: desc,
            expirationDate: date,
            time,
            repeatType: repeatType,
            obfuscation: obfuscate,
            isEncrypted,
            groupId: groupId || undefined,
          });"""
content = content.replace(old_add_call, new_add_call)

# Edit
old_edit = """          const newTitle = getFlag(args, '--title');
          const newDate = getFlag(args, '--date');
          const newDesc = getFlag(args, '--desc');"""
new_edit = """          const newTitle = getFlag(args, '--title');
          const newDate = getFlag(args, '--date');
          const newTime = getFlag(args, '--time');
          const newDesc = getFlag(args, '--desc');"""
content = content.replace(old_edit, new_edit)

old_edit_call = """          const updated = core.updateMemo({
            id: targetId,
            title: newTitle || undefined,
            expirationDate: newDate || undefined,
            description: newDesc !== null ? newDesc : undefined,
            repeatType: repeatType !== null ? (repeatType as RepeatType) : undefined,
            obfuscation: obfuscate !== null ? (obfuscate as ObfuscationLevel) : undefined,
            updateEntireGroup: applyGroup,
          });"""
new_edit_call = """          const updated = core.updateMemo({
            id: targetId,
            title: newTitle || undefined,
            expirationDate: newDate || undefined,
            time: newTime || undefined,
            description: newDesc !== null ? newDesc : undefined,
            repeatType: repeatType !== null ? (repeatType as RepeatType) : undefined,
            obfuscation: obfuscate !== null ? (obfuscate as ObfuscationLevel) : undefined,
            updateEntireGroup: applyGroup,
          });"""
content = content.replace(old_edit_call, new_edit_call)

# View
old_view = """          log(`   Data Scadenza: ${m.expirationDate}`);
          if (m.groupId) log(`   GroupID (Serie): ${m.groupId}`);"""
new_view = """          log(`   Data Scadenza: ${m.expirationDate}`);
          if (m.time) log(`   Orario: ${m.time}`);
          if (m.groupId) log(`   GroupID (Serie): ${m.groupId}`);"""
content = content.replace(old_view, new_view)

with open('src/components/TerminalCLI.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/components/MemoFormModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'setError("Impossibile abilitare il sync: permessi calendario non concessi.");',
    'setError("Pop-up bloccato o permessi negati. Controlla in alto a destra se il browser ha bloccato il popup di Google, oppure riprova.");'
)

with open('src/components/MemoFormModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "`Menu Laterale: ${sidebarMode === 'collapsed' ? 'Mostra Barra' : 'Nascondi Barra'} (Ctrl+B)`",
    "settings.language === 'en' ? `Sidebar: ${sidebarMode === 'collapsed' ? 'Show Bar' : 'Hide Bar'} (Ctrl+B)` : `Menu Laterale: ${sidebarMode === 'collapsed' ? 'Mostra Barra' : 'Nascondi Barra'} (Ctrl+B)`"
)

content = content.replace(
    "`Tema: ${themeMode} (Clicca per cambiare)`",
    "settings.language === 'en' ? `Theme: ${themeMode} (Click to change)` : `Tema: ${themeMode} (Clicca per cambiare)`"
)

content = content.replace(
    "sidebarMode === 'expanded' ? 'Riduci larghezza colonna (Standard)' : 'Estendi larghezza colonna (Espansa)'",
    "sidebarMode === 'expanded' ? (settings.language === 'en' ? 'Reduce column width (Standard)' : 'Riduci larghezza colonna (Standard)') : (settings.language === 'en' ? 'Extend column width (Expanded)' : 'Estendi larghezza colonna (Espansa)')"
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


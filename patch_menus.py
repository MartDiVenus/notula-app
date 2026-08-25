import re

def remove_manual_gcal_button(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the addToGoogleCalendar button block
    button_pattern = r'<\s*button\s+onClick=\{\([e]*\) => \{?[^}]*addToGoogleCalendar\(memo\);?[^}]*\}\}?\s+className="[^"]*#4285F4[^"]*".*?</button>'
    
    content = re.sub(button_pattern, '', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

remove_manual_gcal_button('src/components/ListSubmenu.tsx')
remove_manual_gcal_button('src/components/CalendarView.tsx')

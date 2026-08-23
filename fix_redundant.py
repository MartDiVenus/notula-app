import os
import re

directory = 'src/components/'

# We want to replace patterns like:
# (settings.language === 'en' ? '...' : (settings.language === 'en' ? '...' : '...'))
# With:
# {settings.language === 'en' ? '...' : '...'} or (settings.language === 'en' ? '...' : '...') depending on context.

def fix_content(content):
    # Fix the generic triple nest
    content = re.sub(
        r'\(settings\.language === (["\'])en\1 \? (["\'])(.*?)\2 : \(settings\.language === (["\'])en\4 \? (["\'])(.*?)\5 : \(settings\.language === (["\'])en\7 \? (["\'])(.*?)\8 : (["\'])(.*?)\10\)\)\)',
        r'(settings.language === \1en\1 ? \2\3\2 : \10\11\10)',
        content
    )
    
    # Fix the double nest
    content = re.sub(
        r'\(settings\.language === (["\'])en\1 \? (["\'])(.*?)\2 : \(settings\.language === (["\'])en\4 \? (["\'])(.*?)\5 : (["\'])(.*?)\7\)\)',
        r'(settings.language === \1en\1 ? \2\3\2 : \7\8\7)',
        content
    )
    
    # Fix the single wrapped double nest like:
    # settings.language === 'en' ? '...' : (settings.language === 'en' ? '...' : '...')
    content = re.sub(
        r'settings\.language === (["\'])en\1 \? (["\'])(.*?)\2 : \(settings\.language === (["\'])en\4 \? (["\'])(.*?)\5 : (["\'])(.*?)\7\)',
        r'settings.language === \1en\1 ? \2\3\2 : \7\8\7',
        content
    )
    
    return content

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            text = f.text = f.read()
            new_text = fix_content(text)
        if new_text != text:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_text)

print("Redundant conditions fixed.")

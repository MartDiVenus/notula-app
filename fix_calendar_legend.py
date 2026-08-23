import re

with open('src/components/CalendarView.tsx', 'r') as f:
    content = f.read()

# Let's just fix any remaining hardcoded text in CalendarView.tsx
dict_cv = {
    "Legenda Grafica": "Graphic Legend",
    "Memo odierno o futuro": "Today's or future memo",
    "Memo passato": "Past memo",
    "Memo ricorrente oggi (Pallino Blu)": "Recurring memo today (Blue Dot)",
    "Memo ricorrente passato (Pallino Grigio)": "Past recurring memo (Gray Dot)",
    "Memo ricorrente futuro (Pallino Verde)": "Future recurring memo (Green Dot)",
    "Bordo Rosso:": "Red Border:",
    "Bordo Magenta/Viola:": "Magenta/Purple Border:",
    "Bordo Arancione:": "Orange Border:",
    "Pallino Blu:": "Blue Dot:",
    "Pallino Grigio:": "Gray Dot:",
    "Pallino Verde:": "Green Dot:",
    "Puntuale scaduto": "Expired one-time",
    "Puntuale futuro": "Future one-time",
    "Puntuale oggi": "One-time today",
    "Ricorrente passato": "Past recurring",
    "Ricorrente oggi": "Recurring today",
    "Ricorrente futuro": "Future recurring",
    "Scaduto (la data è già passata).": "Expired (date has already passed).",
    "Scadenza futura nel mese.": "Future expiration in the month.",
    "In scadenza Oggi.": "Expiring Today."
}

for it, en in dict_cv.items():
    content = content.replace(f'>{it}<', f'>{{settings.language === "en" ? "{en}" : "{it}"}}<')
    content = content.replace(f'"{it}"', f'(settings.language === "en" ? "{en}" : "{it}")')

with open('src/components/CalendarView.tsx', 'w') as f:
    f.write(content)

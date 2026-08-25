import json

with open('package.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['main'] = 'electron/main.cjs'

data['build'] = {
  "appId": "com.mariofantini.notula",
  "productName": "Notula",
  "directories": {
    "output": "dist_electron"
  },
  "files": [
    "dist/**/*",
    "electron/**/*",
    "public/**/*"
  ],
  "linux": {
    "target": ["AppImage", "deb"],
    "icon": "public/icon-512.png",
    "category": "Office"
  },
  "win": {
    "target": "nsis",
    "icon": "public/icon-512.png"
  },
  "mac": {
    "target": "dmg",
    "icon": "public/icon-512.png"
  }
}

with open('package.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

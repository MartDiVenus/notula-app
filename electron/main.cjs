const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/icon-512.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });

  // Carica l'app compilata (Vite dist)
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  // Gestione chiusura finestra: minimizza nella tray invece di uscire
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  // Configura l'icona della Tray (barra delle applicazioni / XFCE notification area)
  const iconPath = path.join(__dirname, '../public/icon-512.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  tray.setToolTip('Notula - In esecuzione in background');
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Apri Notula', click: () => mainWindow.show() },
    { type: 'separator' },
    { 
      label: 'Esci', 
      click: () => {
        isQuitting = true;
        app.quit();
      } 
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  // Doppio clic sull'icona apre l'app
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

// Avvia l'app in background
app.whenReady().then(() => {
  createWindow();
  createTray();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Su Windows/Linux, non uscire quando tutte le finestre sono chiuse
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Non facciamo nulla, l'app rimane viva nella Tray
  }
});

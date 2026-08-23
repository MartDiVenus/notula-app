import { useSettings } from '../contexts/SettingsContext';
export const translations = {
  en: {
    sidebar: {
      newMemo: 'New Memo',
      search: 'Search',
      list: 'List View',
      delete: 'Delete',
      sync: 'Cloud Sync',
      print: 'Print (PDF)',
      export: 'Export/Import',
      terminal: 'CLI Terminal',
      author: 'Author, Contacts, Copyright',
      install: 'Installation, Emblem',
      guide: 'Functional Guide, Manual',
      privacyOn: 'Privacy: ON',
      privacyOff: 'Privacy: OFF',
      infoSupport: 'INFO & SUPPORT',
      settings: 'Settings'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      languageDesc: 'Choose application language',
      notifications: 'Push Notifications',
      notificationsDesc: 'Receive system notifications for today\'s memos',
      sound: 'Sound Effects',
      soundDesc: 'Play a subtle sound when you have memos today',
      close: 'Close',
      theme: 'Theme',
      themeDesc: 'Application appearance'
    }
  },
  it: {
    sidebar: {
      newMemo: 'Nuovo Memo',
      search: 'Ricerca',
      list: 'Visualizzazione Lista',
      delete: 'Eliminazione',
      sync: 'Sincronizzazione Cloud',
      print: 'Stampa (PDF)',
      export: 'Esportazione / Import',
      terminal: 'Terminale CLI',
      author: 'Autore, Contatti, Copyright',
      install: 'Installazione, Emblema',
      guide: 'Guida Funzionale, Manuale d\'Uso',
      privacyOn: 'Privacy: ON',
      privacyOff: 'Privacy: OFF',
      infoSupport: 'INFORMAZIONI & SUPPORTO',
      settings: 'Impostazioni'
    },
    settings: {
      title: 'Impostazioni',
      language: 'Lingua',      languageDesc: 'Scegli la lingua dell\'applicazione',
      notifications: 'Notifiche Push',
      notificationsDesc: 'Ricevi notifiche di sistema per i memo odierni',
      sound: 'Effetti Sonori',
      soundDesc: 'Riproduci un suono discreto se ci sono memo odierni',
      close: 'Chiudi',
      theme: 'Tema',
      themeDesc: 'Aspetto dell\'applicazione'
    }
  }
};
export type TranslationKey = keyof typeof translations.en;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoItem, DriveConfig } from '../types';
import { encryptData, decryptData, isEncryptedString } from './crypto';

export const DRIVE_FOLDER_NAME = 'Notula';
export const DRIVE_FILE_NAME = 'notula_backup.json';
export const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';

let gAccessToken: string | null = null;
let gTokenClient: any = null;

export const DEFAULT_GOOGLE_CLIENT_ID = '33907494746-u2ag4a79qplv6l4430smo93vb3q77qpf.apps.googleusercontent.com';

/**
 * Checks if two memos are functionally identical in content
 */
export function areMemosIdentical(a: MemoItem, b: MemoItem): boolean {
  if (!a || !b) return false;
  if (a.id !== b.id) return false;
  if (a.title !== b.title) return false;
  if ((a.description || '').trim() !== (b.description || '').trim()) return false;
  if (a.expirationDate !== b.expirationDate) return false;
  if (a.repeatType !== b.repeatType) return false;
  if (a.obfuscation !== b.obfuscation) return false;
  if ((a.isEncrypted || false) !== (b.isEncrypted || false)) return false;
  return true;
}

export function isDriveAuthenticated(): boolean {
  if (gAccessToken) return true;
  try {
    const saved = sessionStorage.getItem('notula_drive_access_token');
    if (saved && saved.trim()) {
      gAccessToken = saved;
      return true;
    }
  } catch {
    // sessionStorage not available
  }
  return false;
}

export function getDriveAccessToken(): string | null {
  if (!gAccessToken) {
    try {
      const saved = sessionStorage.getItem('notula_drive_access_token');
      if (saved && saved.trim()) gAccessToken = saved;
    } catch {
      // ignore
    }
  }
  return gAccessToken;
}

export function setDriveAccessToken(token: string | null): void {
  gAccessToken = token;
  try {
    if (token) {
      sessionStorage.setItem('notula_drive_access_token', token);
    } else {
      sessionStorage.removeItem('notula_drive_access_token');
    }
  } catch {
    // ignore
  }
}

export function getStoredDriveConfig(): DriveConfig {
  const saved = localStorage.getItem('notula_drive_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.clientId || parsed.clientId.trim() === '') {
        parsed.clientId = DEFAULT_GOOGLE_CLIENT_ID;
      }
      return parsed;
    } catch {
      // fallback
    }
  }
  return {
    clientId: localStorage.getItem('notula_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID,
    autoSync: true,
    backupFileName: DRIVE_FILE_NAME,
    lastSyncedAt: undefined,
  };
}

export function saveDriveConfig(config: DriveConfig): void {
  localStorage.setItem('notula_drive_config', JSON.stringify(config));
  if (config.clientId) {
    localStorage.setItem('notula_google_client_id', config.clientId);
  }
}

export function initGoogleDriveClient(
  clientId: string,
  onAuthSuccess: (token: string) => void,
  onError: (err: any) => void
) {
  if (!clientId || !clientId.trim()) {
    console.warn("Client ID Google non specificato.");
    return;
  }

  // Load Google Identity Services script if not already present
  if (!(window as any).google?.accounts?.oauth2) {
    const existing = document.getElementById('gsi-client-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'gsi-client-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setupTokenClient(clientId, onAuthSuccess, onError);
      };
      script.onerror = (e) => {
        console.error("Errore caricamento script GIS:", e);
        onError(new Error("Impossibile caricare il modulo di accesso Google. Verifica di essere connesso a Internet e che non ci siano Ad-Blocker attivi."));
      };
      document.head.appendChild(script);
    }
  } else {
    setupTokenClient(clientId, onAuthSuccess, onError);
  }
}

function setupTokenClient(
  clientId: string,
  onAuthSuccess: (token: string) => void,
  onError: (err: any) => void
) {
  try {
    const google = (window as any).google;
    const isNative = (window as any).Capacitor?.isNativePlatform();
    
    const config: any = {
      client_id: clientId.trim(),
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (resp: any) => {
        if (resp.error !== undefined) {
          onError(resp);
          return;
        }
        setDriveAccessToken(resp.access_token);
        onAuthSuccess(resp.access_token);
      },
    };

    if (isNative) {
      config.ux_mode = 'redirect';
      config.redirect_uri = window.location.origin;
    }

    gTokenClient = google.accounts.oauth2.initTokenClient(config);
  } catch (e) {
    onError(e);
  }
}

// Parse URL hash for OAuth tokens (Mobile WebView fallback)
if (typeof window !== 'undefined') {
  const hash = window.location.hash;
  if (hash && hash.includes('access_token=')) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      setDriveAccessToken(token);
    }
    // Clean URL
    window.history.replaceState(null, '', window.location.pathname);
  }
}

export function requestDriveAuth(promptConsent: boolean = false, silentOnly: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentToken = getDriveAccessToken();
    if (currentToken) {
      return resolve(currentToken);
    }

    if (silentOnly) {
      return reject(new Error("Non autenticato con Google™ Drive (Nessun token attivo)"));
    }

    const config = getStoredDriveConfig();
    const cId = config.clientId || DEFAULT_GOOGLE_CLIENT_ID;

    if (!gTokenClient) {
      initGoogleDriveClient(
        cId,
        (token) => resolve(token),
        (err) => reject(new Error("Autenticazione Google™ Drive fallita: " + (err.message || JSON.stringify(err))))
      );
    }

    // Wait until gTokenClient is ready, checking every 100ms
    let attempts = 0;
    const checkClientReady = () => {
      attempts++;
      if (gTokenClient) {
        // Overwrite the callback to handle the request
        gTokenClient.callback = (resp: any) => {
          if (resp.error) {
            reject(new Error("Autorizzazione negata o annullata: " + (resp.error_description || resp.error)));
            return;
          }
          setDriveAccessToken(resp.access_token);
          resolve(resp.access_token);
        };
        gTokenClient.requestAccessToken({ prompt: promptConsent ? 'consent' : '' });
        return;
      }

      // Try to re-initialize if google object appeared
      try {
        const google = (window as any).google;
        if (google?.accounts?.oauth2) {
          setupTokenClient(cId, (token) => resolve(token), (err) => reject(err));
          if (gTokenClient) {
            checkClientReady();
            return;
          }
        }
      } catch {}

      if (attempts > 50) { // 5 seconds timeout
        reject(new Error("Client Google™ OAuth non pronto. Controlla la connessione internet e riprova."));
        return;
      }
      setTimeout(checkClientReady, 100);
    };

    setTimeout(checkClientReady, 100);
  });
}

/**
 * Finds or creates the dedicated "Notula" folder on Google Drive
 */
export async function getOrCreateNotulaFolder(token: string): Promise<string> {
  const query = encodeURIComponent(
    `name = '${DRIVE_FOLDER_NAME}' and mimeType = '${DRIVE_FOLDER_MIME}' and trashed = false`
  );
  
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,mimeType)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      setDriveAccessToken(null);
      throw new Error("Token Google™ Drive scaduto. Riconnetti l'account dal pulsante Google™ Drive.");
    }
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Errore ricerca cartella Notula (${res.status}): ${errTxt}`);
  }

  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create Notula folder if it doesn't exist
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: DRIVE_FOLDER_MIME,
    }),
  });

  if (!createRes.ok) {
    const errTxt = await createRes.text().catch(() => '');
    throw new Error(`Creazione cartella Notula su Google™ Drive fallita (${createRes.status}): ${errTxt}`);
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Finds a file inside a specific folder or globally on Google Drive
 */
export async function findDriveFileInFolder(
  token: string,
  fileName: string,
  folderId?: string
): Promise<string | null> {
  let queryStr = `name = '${fileName}' and trashed = false`;
  if (folderId) {
    queryStr += ` and '${folderId}' in parents`;
  }
  const query = encodeURIComponent(queryStr);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      setDriveAccessToken(null);
      throw new Error("Token Google™ Drive scaduto. Riconnetti l'account dal pulsante Google™ Drive.");
    }
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Errore ricerca file ${fileName} (${res.status}): ${errTxt}`);
  }

  const data = await res.json();
  return data.files && data.files.length > 0 ? data.files[0].id : null;
}

/**
 * Uploads a single memo file (e.g. memo_n_123.json) into the Notula folder
 */
export async function saveSingleMemoToDrive(
  token: string,
  folderId: string,
  memo: MemoItem,
  masterPassword: string | null = null
): Promise<string> {
  const fileName = `memo_${memo.id}.json`;
  const existingFileId = await findDriveFileInFolder(token, fileName, folderId);

  const payloadRaw = JSON.stringify(memo, null, 2);
  let finalPayload = payloadRaw;
  if (masterPassword && memo.isEncrypted) {
    finalPayload = await encryptData(payloadRaw, masterPassword);
  }

  const metadata: any = { name: fileName, mimeType: 'application/json' };
  if (!existingFileId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([finalPayload], { type: 'application/json' }));

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
  const method = existingFileId ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Upload singolo memo [${memo.id}] fallito (${res.status}): ${errTxt}`);
  }

  const result = await res.json();
  return result.id;
}

/**
 * Trashes / deletes a single memo file on Drive
 */
export async function deleteMemoFromDrive(
  memoId: string
): Promise<boolean> {
  try {
    if (!isDriveAuthenticated()) return false;
    const token = await requestDriveAuth(false, true);
    const folderId = await getOrCreateNotulaFolder(token);
    const fileName = `memo_${memoId}.json`;
    const fileId = await findDriveFileInFolder(token, fileName, folderId);
    if (fileId) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Automatically uploads individual memo files AND backup manifest to Google Drive in folder "Notula"
 */
export async function autoSyncToDrive(
  memos: MemoItem[],
  masterPassword: string | null = null,
  interactive: boolean = false
): Promise<{ success: boolean; message: string; folderId?: string }> {
  try {
    const token = await requestDriveAuth(false, !interactive);
    const folderId = await getOrCreateNotulaFolder(token);

    // 1. Save all individual memos in the Notula folder
    for (const memo of memos) {
      await saveSingleMemoToDrive(token, folderId, memo, masterPassword);
    }

    // 2. Save / update the full backup manifest in the Notula folder for fast consolidated sync
    const backupFileId = await findDriveFileInFolder(token, DRIVE_FILE_NAME, folderId);
    const payloadRaw = JSON.stringify(memos, null, 2);
    let finalPayload = payloadRaw;
    if (masterPassword) {
      finalPayload = await encryptData(payloadRaw, masterPassword);
    }

    const metadata: any = { name: DRIVE_FILE_NAME, mimeType: 'application/json' };
    if (!backupFileId) {
      metadata.parents = [folderId];
    }

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([finalPayload], { type: 'application/json' }));

    const url = backupFileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${backupFileId}?uploadType=multipart`
      : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
    const method = backupFileId ? 'PATCH' : 'POST';

    const backupRes = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (!backupRes.ok) {
      const errTxt = await backupRes.text().catch(() => '');
      throw new Error(`Upload archivio completo fallito (${backupRes.status}): ${errTxt}`);
    }

    return {
      success: true,
      message: `Sincronizzati ${memos.length} memo nella cartella 'Notula' su Google™ Drive.`,
      folderId,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Errore di sincronizzazione Google™ Drive" };
  }
}

/**
 * Downloads memos from the Notula folder on Google Drive
 */
export async function downloadFromDrive(
  masterPassword: string | null = null,
  interactive: boolean = true
): Promise<{ memos: MemoItem[]; rawCount: number; folderId: string }> {
  const token = await requestDriveAuth(false, !interactive);
  const folderId = await getOrCreateNotulaFolder(token);

  // 1. Try reading the full consolidated backup inside the Notula folder first
  const backupFileId = await findDriveFileInFolder(token, DRIVE_FILE_NAME, folderId);
  if (backupFileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${backupFileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      let text = (await res.text()).trim();
      if (isEncryptedString(text)) {
        if (!masterPassword) {
          throw new Error("I dati su Google™ Drive sono protetti con AES-256. Inserisci la Master Password per decifrarli.");
        }
        text = await decryptData(text, masterPassword);
      }

      const parsed = JSON.parse(text);
      const list: MemoItem[] = Array.isArray(parsed) ? parsed : (parsed.memos || [parsed]);
      return { memos: list, rawCount: list.length, folderId };
    }
  }

  // 2. Otherwise, fetch all individual memo files inside the Notula folder
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and name contains 'memo_'`);
  const listRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!listRes.ok) {
    const errTxt = await listRes.text().catch(() => '');
    throw new Error(`Errore lettura file cartella Notula (${listRes.status}): ${errTxt}`);
  }

  const listData = await listRes.json();
  const fileItems = listData.files || [];
  const fetchedMemos: MemoItem[] = [];

  for (const f of fileItems) {
    const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (fileRes.ok) {
      let content = (await fileRes.text()).trim();
      if (isEncryptedString(content)) {
        if (!masterPassword) {
          throw new Error("Alcuni memo su Google™ Drive sono protetti con AES-256. Inserisci la Master Password.");
        }
        content = await decryptData(content, masterPassword);
      }
      const parsedMemo = JSON.parse(content);
      fetchedMemos.push(parsedMemo);
    }
  }

  return { memos: fetchedMemos, rawCount: fetchedMemos.length, folderId };
}

/**
 * Diagnostic test for Google Drive integration
 */
export async function testDriveDiagnostics(): Promise<{
  ok: boolean;
  tokenAcquired: boolean;
  folderId?: string;
  folderName?: string;
  filesCount?: number;
  message: string;
}> {
  try {
    const token = await requestDriveAuth(false, false);
    if (!token) {
      return { ok: false, tokenAcquired: false, message: "Impossibile ottenere il token OAuth da Google™." };
    }

    const folderId = await getOrCreateNotulaFolder(token);

    // List files inside Notula folder
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,mimeType)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!listRes.ok) {
      const errTxt = await listRes.text().catch(() => '');
      return {
        ok: false,
        tokenAcquired: true,
        folderId,
        message: `Cartella Notula™ trovata [${folderId}], ma errore nella lettura file: ${errTxt}`,
      };
    }

    const data = await listRes.json();
    const files = data.files || [];

    return {
      ok: true,
      tokenAcquired: true,
      folderId,
      folderName: DRIVE_FOLDER_NAME,
      filesCount: files.length,
      message: `Connessione Google™ Drive attiva. Trovata cartella 'Notula' (${folderId}) contenente ${files.length} elementi.`,
    };
  } catch (err: any) {
    return {
      ok: false,
      tokenAcquired: false,
      message: err.message || "Errore sconosciuto durante la diagnostica Google™ Drive.",
    };
  }
}

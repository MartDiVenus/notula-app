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
  return getDriveAccessToken() !== null;
}

export function getDriveAccessToken(): string | null {
  try {
    const expiryStr = sessionStorage.getItem('notula_drive_token_expiry') || localStorage.getItem('notula_drive_token_expiry');
    if (expiryStr) {
      const expiry = Number(expiryStr);
      if (!isNaN(expiry) && Date.now() > expiry) {
        setDriveAccessToken(null);
        return null;
      }
    }
    if (!gAccessToken) {
      const saved = sessionStorage.getItem('notula_drive_access_token') || localStorage.getItem('notula_drive_access_token');
      if (saved && saved.trim()) {
        gAccessToken = saved;
      }
    }
  } catch {
    // storage not available
  }
  return gAccessToken;
}

export function setDriveAccessToken(token: string | null, expiresInSeconds: number = 3300): void {
  gAccessToken = token;
  try {
    if (token) {
      const expiry = String(Date.now() + expiresInSeconds * 1000);
      sessionStorage.setItem('notula_drive_access_token', token);
      sessionStorage.setItem('notula_drive_token_expiry', expiry);
      localStorage.setItem('notula_drive_access_token', token);
      localStorage.setItem('notula_drive_token_expiry', expiry);
    } else {
      sessionStorage.removeItem('notula_drive_access_token');
      sessionStorage.removeItem('notula_drive_token_expiry');
      localStorage.removeItem('notula_drive_access_token');
      localStorage.removeItem('notula_drive_token_expiry');
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
      parsed.autoSync = true; // Always true in Cloud-Only mode
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
  localStorage.setItem('notula_drive_config', JSON.stringify({ ...config, autoSync: true }));
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
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar.events',
      callback: (resp: any) => {
        if (resp.error !== undefined) {
          onError(resp);
          return;
        }
        const exp = resp.expires_in ? Number(resp.expires_in) - 120 : 3300;
        setDriveAccessToken(resp.access_token, exp);
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
    const expiresIn = params.get('expires_in');
    if (token) {
      setDriveAccessToken(token, expiresIn ? Number(expiresIn) - 120 : 3300);
    }
    // Clean URL
    window.history.replaceState(null, '', window.location.pathname);
  }
}

export function requestDriveAuth(promptConsent: boolean = false, silentOnly: boolean = false, force: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentToken = getDriveAccessToken();
    if (currentToken && !force) {
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
          const exp = resp.expires_in ? Number(resp.expires_in) - 120 : 3300;
          setDriveAccessToken(resp.access_token, exp);
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
 * Returns all non-trashed "Notula" folder IDs on Google Drive (ordered oldest first),
 * creating one if none exists.
 */
export async function getAllNotulaFolders(token: string): Promise<string[]> {
  const query = encodeURIComponent(
    `name = '${DRIVE_FOLDER_NAME}' and mimeType = '${DRIVE_FOLDER_MIME}' and trashed = false`
  );

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,mimeType,createdTime)&orderBy=createdTime asc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      setDriveAccessToken(null);
      throw new Error("Token Google™ Drive scaduto. Riconnetti l'account Google™ Drive.");
    }
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Errore ricerca cartella Notula (${res.status}): ${errTxt}`);
  }

  const data = await res.json();
  const folders = (data.files || []).map((f: any) => f.id as string);
  if (folders.length > 0) {
    return folders;
  }

  // Create Notula folder if it doesn't exist
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
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
  return [folderData.id];
}

/**
 * Finds or creates the primary dedicated "Notula" folder on Google Drive
 */
export async function getOrCreateNotulaFolder(token: string): Promise<string> {
  const folders = await getAllNotulaFolders(token);
  if (folders.length === 1) {
    return folders[0];
  }

  // If multiple Notula folders exist, prefer the one containing files
  for (const fId of folders) {
    try {
      const testQuery = encodeURIComponent(`'${fId}' in parents and trashed = false`);
      const testRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${testQuery}&spaces=drive&fields=files(id,name)&pageSize=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store',
          },
          cache: 'no-store',
        }
      );
      if (testRes.ok) {
        const testData = await testRes.json();
        if (testData.files && testData.files.length > 0) {
          return fId;
        }
      }
    } catch {}
  }

  return folders[0];
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
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
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
  masterPassword: string | null = null,
  knownExistingFileId?: string | null
): Promise<string> {
  const fileName = `memo_${memo.id}.json`;
  const existingFileId = knownExistingFileId !== undefined
    ? knownExistingFileId
    : await findDriveFileInFolder(token, fileName, folderId);

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
    cache: 'no-store'
  });

  if (!res.ok) {
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Upload singolo memo [${memo.id}] fallito (${res.status}): ${errTxt}`);
  }

  const result = await res.json();
  return result.id;
}

/**
 * Trashes / deletes a single memo file on Drive across all Notula folders
 */
export async function deleteMemoFromDrive(
  memoId: string
): Promise<boolean> {
  try {
    if (!isDriveAuthenticated()) return false;
    const token = await requestDriveAuth(false, true);
    const fileName = `memo_${memoId}.json`;
    const query = encodeURIComponent(`(name = '${fileName}' or name = '${memoId}.json') and trashed = false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)`,
      {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache, no-store' },
        cache: 'no-store',
      }
    );
    if (res.ok) {
      const data = await res.json();
      for (const f of (data.files || [])) {
        await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Automatically uploads backup manifest AND reconciles individual memo files in folder "Notula"
 * Prioritizes the full manifest FIRST (< 500ms) so that cloud sync across devices is immediate,
 * and cleans up any deleted individual memo_*.json files on Drive so deleted memos never resurrect.
 */
export async function autoSyncToDrive(
  memos: MemoItem[],
  masterPassword: string | null = null,
  interactive: boolean = false
): Promise<{ success: boolean; message: string; folderId?: string }> {
  try {
    const token = await requestDriveAuth(false, !interactive);
    const folderId = await getOrCreateNotulaFolder(token);

    // 1. FIRST: Save / update the full backup manifest in the Notula folder for INSTANT multi-device sync
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
      cache: 'no-store'
    });

    if (!backupRes.ok) {
      if (backupRes.status === 401) {
        setDriveAccessToken(null);
      }
      const errTxt = await backupRes.text().catch(() => '');
      throw new Error(`Upload archivio completo fallito (${backupRes.status}): ${errTxt}`);
    }

    // 2. SECOND: Reconcile individual memo_*.json files in the Notula folder
    // List existing files in folderId so we can remove deleted ones and avoid redundant queries
    const activeMemoIds = new Set(memos.map(m => m.id));
    const existingMemoFiles = new Map<string, string>(); // memoId -> fileId

    try {
      const listQuery = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType != '${DRIVE_FOLDER_MIME}'`);
      const listRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${listQuery}&spaces=drive&fields=files(id,name)&pageSize=200`,
        {
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache, no-store' },
          cache: 'no-store',
        }
      );
      if (listRes.ok) {
        const listData = await listRes.json();
        const filesToDelete: string[] = [];
        for (const f of (listData.files || [])) {
          if (f.name === DRIVE_FILE_NAME) continue;
          if (f.name.startsWith('memo_') && f.name.endsWith('.json')) {
            const mId = f.name.replace(/^memo_/, '').replace(/\.json$/, '');
            if (!activeMemoIds.has(mId)) {
              filesToDelete.push(f.id);
            } else {
              existingMemoFiles.set(mId, f.id);
            }
          }
        }
        // Delete orphan memo files that were removed by the user
        for (let i = 0; i < filesToDelete.length; i += 5) {
          const delBatch = filesToDelete.slice(i, i + 5);
          await Promise.all(
            delBatch.map(fId =>
              fetch(`https://www.googleapis.com/drive/v3/files/${fId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              }).catch(() => {})
            )
          );
        }
      }
    } catch (e) {
      console.warn("Could not list existing files for reconciliation:", e);
    }

    // Upload new individual memo files (and update existing ones in batches)
    for (let i = 0; i < memos.length; i += 5) {
      const batch = memos.slice(i, i + 5);
      await Promise.all(
        batch.map(memo =>
          saveSingleMemoToDrive(
            token,
            folderId,
            memo,
            masterPassword,
            existingMemoFiles.get(memo.id) || null
          ).catch(err => {
            console.warn(`Single memo upload warning [${memo.id}]:`, err);
          })
        )
      );
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
 * Downloads memos from Google Drive (Single Source of Truth).
 * Scans ALL Notula folders AND all JSON files accessible to the app, reconciling
 * both notula_backup.json and individual memo files so every device sees the exact same memos.
 */
export async function downloadFromDrive(
  masterPassword: string | null = null,
  interactive: boolean = true
): Promise<{ memos: MemoItem[]; rawCount: number; folderId: string }> {
  const token = await requestDriveAuth(false, !interactive);
  const allFolderIds = await getAllNotulaFolders(token);
  const primaryFolderId = await getOrCreateNotulaFolder(token);

  const memosMap = new Map<string, MemoItem>();
  let backupModifiedTime = 0;
  let backupHadData = false;
  let primaryBackupFileId: string | null = null;

  // 1. Read consolidated notula_backup.json across any Notula folder (newest wins per memo ID)
  for (const fId of allFolderIds) {
    const bId = await findDriveFileInFolder(token, DRIVE_FILE_NAME, fId);
    if (!bId) continue;
    if (fId === primaryFolderId) primaryBackupFileId = bId;

    try {
      const fileMetaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${bId}?fields=id,modifiedTime`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        }
      );
      if (fileMetaRes.ok) {
        const fileMeta = await fileMetaRes.json();
        if (fileMeta.modifiedTime) {
          const mTime = new Date(fileMeta.modifiedTime).getTime();
          if (mTime > backupModifiedTime) backupModifiedTime = mTime;
        }
      }

      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${bId}?alt=media&t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
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
        for (const item of list) {
          if (item && item.id && item.title) {
            const existing = memosMap.get(item.id);
            if (!existing) {
              memosMap.set(item.id, item);
            } else {
              const exTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
              const inTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
              if (inTime >= exTime) {
                memosMap.set(item.id, item);
              }
            }
          }
        }
        backupHadData = true;
      }
    } catch (e: any) {
      console.warn("Could not read notula_backup.json:", e);
      if (e.message && e.message.includes("Master Password")) {
        throw e;
      }
    }
  }

  // 2. Scan ALL individual JSON files across all Notula folders AND globally within drive.file scope
  const seenFileIds = new Set<string>();
  const individualFilesToFetch: Array<{ id: string; name: string }> = [];

  const collectCandidateFiles = (fileItems: any[]) => {
    for (const f of fileItems) {
      if (!f || !f.id || seenFileIds.has(f.id)) continue;
      seenFileIds.add(f.id);
      if (f.name === DRIVE_FILE_NAME) continue;

      if (f.name.endsWith('.json')) {
        const memoId = f.name.replace(/^memo_/, '').replace(/\.json$/, '');
        const fileModified = f.modifiedTime ? new Date(f.modifiedTime).getTime() : 0;
        const existingInBackup = memosMap.get(memoId);

        // Always fetch if this memo is NOT yet in memosMap (e.g. memo_n_1790415893-669.json)
        // OR if the individual file on Drive was modified after notula_backup.json
        if (!existingInBackup || fileModified > backupModifiedTime) {
          individualFilesToFetch.push({ id: f.id, name: f.name });
        }
      }
    }
  };

  for (const fId of allFolderIds) {
    let pageToken: string | null = null;
    do {
      const query = encodeURIComponent(`'${fId}' in parents and trashed = false and mimeType != '${DRIVE_FOLDER_MIME}'`);
      const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
      const listRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=nextPageToken,files(id,name,modifiedTime)&pageSize=100${pageParam}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        }
      );

      if (listRes.ok) {
        const listData = await listRes.json();
        pageToken = listData.nextPageToken || null;
        collectCandidateFiles(listData.files || []);
      } else {
        break;
      }
    } while (pageToken);
  }

  // Also check globally for any memo_*.json or n_*.json files created by the app
  try {
    const globalQuery = encodeURIComponent(`trashed = false and (name contains 'memo_' or name contains 'n_')`);
    const globalRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${globalQuery}&spaces=drive&fields=files(id,name,modifiedTime)&pageSize=100`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store'
        },
        cache: 'no-store'
      }
    );
    if (globalRes.ok) {
      const gData = await globalRes.json();
      collectCandidateFiles(gData.files || []);
    }
  } catch {}

  // Fetch candidate individual files in concurrent batches of 5
  let newOrUpdatedCount = 0;
  for (let i = 0; i < individualFilesToFetch.length; i += 5) {
    const chunk = individualFilesToFetch.slice(i, i + 5);
    await Promise.all(
      chunk.map(async (f) => {
        try {
          const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media&t=${Date.now()}`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store',
              'Pragma': 'no-cache'
            },
            cache: 'no-store'
          });

          if (fileRes.ok) {
            let content = (await fileRes.text()).trim();
            if (isEncryptedString(content)) {
              if (!masterPassword) {
                throw new Error("Alcuni memo su Google™ Drive sono protetti con AES-256. Inserisci la Master Password.");
              }
              content = await decryptData(content, masterPassword);
            }
            const parsedData = JSON.parse(content);
            const items: MemoItem[] = Array.isArray(parsedData) ? parsedData : [parsedData];
            for (const parsedMemo of items) {
              if (parsedMemo && parsedMemo.id && parsedMemo.title && parsedMemo.expirationDate) {
                const existing = memosMap.get(parsedMemo.id);
                if (!existing) {
                  memosMap.set(parsedMemo.id, parsedMemo);
                  newOrUpdatedCount++;
                } else {
                  const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
                  const incomingTime = parsedMemo.updatedAt ? new Date(parsedMemo.updatedAt).getTime() : 0;
                  if (incomingTime >= existingTime) {
                    memosMap.set(parsedMemo.id, parsedMemo);
                    newOrUpdatedCount++;
                  }
                }
              }
            }
          }
        } catch (err: any) {
          console.warn(`Error fetching single file ${f.name}:`, err);
        }
      })
    );
  }

  const finalMemos = Array.from(memosMap.values());

  // 3. Reconcile: If we discovered new/updated individual memo files that were missing from notula_backup.json,
  // update notula_backup.json immediately so all devices see the unified state!
  if (finalMemos.length > 0 && (newOrUpdatedCount > 0 || !backupHadData)) {
    try {
      const payloadRaw = JSON.stringify(finalMemos, null, 2);
      let finalPayload = payloadRaw;
      if (masterPassword) {
        finalPayload = await encryptData(payloadRaw, masterPassword);
      }
      const metadata: any = { name: DRIVE_FILE_NAME, mimeType: 'application/json' };
      if (!primaryBackupFileId) {
        metadata.parents = [primaryFolderId];
      }
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([finalPayload], { type: 'application/json' }));
      const url = primaryBackupFileId
        ? `https://www.googleapis.com/upload/drive/v3/files/${primaryBackupFileId}?uploadType=multipart`
        : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
      await fetch(url, {
        method: primaryBackupFileId ? 'PATCH' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
        cache: 'no-store'
      }).catch(() => {});
    } catch {}
  }

  return { memos: finalMemos, rawCount: finalMemos.length, folderId: primaryFolderId };
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

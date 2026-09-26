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
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar.events',
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
  const cachedFolderId = typeof localStorage !== 'undefined' ? localStorage.getItem('notula_active_drive_folder_id') : null;

  const query = encodeURIComponent(
    `name = '${DRIVE_FOLDER_NAME}' and mimeType = '${DRIVE_FOLDER_MIME}' and trashed = false`
  );
  
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,mimeType,createdTime)&orderBy=createdTime asc`,
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
    throw new Error(`Errore ricerca cartella Notula (${res.status}): ${errTxt}`);
  }

  const data = await res.json();
  const folders = data.files || [];

  if (folders.length > 0) {
    // If cached folder ID exists and is still valid, use it
    if (cachedFolderId && folders.some((f: any) => f.id === cachedFolderId)) {
      return cachedFolderId;
    }

    // If multiple folders exist, inspect which one actually contains Notula files
    if (folders.length > 1) {
      for (const f of folders) {
        try {
          const testQuery = encodeURIComponent(`'${f.id}' in parents and trashed = false`);
          const testRes = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=${testQuery}&spaces=drive&fields=files(id,name)&pageSize=5`,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache, no-store'
              },
              cache: 'no-store'
            }
          );
          if (testRes.ok) {
            const testData = await testRes.json();
            if (testData.files && testData.files.length > 0) {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('notula_active_drive_folder_id', f.id);
              }
              return f.id;
            }
          }
        } catch {}
      }
    }

    // Default to the first (oldest) folder
    const selectedId = folders[0].id;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('notula_active_drive_folder_id', selectedId);
    }
    return selectedId;
  }

  // Create Notula folder if it doesn't exist
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store'
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
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('notula_active_drive_folder_id', folderData.id);
  }
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
 * Automatically uploads backup manifest AND individual memo files to Google Drive in folder "Notula"
 * Prioritizes the full manifest FIRST (< 500ms) so that cloud sync across devices is immediate.
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
      const errTxt = await backupRes.text().catch(() => '');
      throw new Error(`Upload archivio completo fallito (${backupRes.status}): ${errTxt}`);
    }

    // 2. SECOND: Save individual memos into the Notula folder in fast concurrent batches (batches of 4)
    for (let i = 0; i < memos.length; i += 4) {
      const batch = memos.slice(i, i + 4);
      await Promise.all(
        batch.map(memo =>
          saveSingleMemoToDrive(token, folderId, memo, masterPassword).catch(err => {
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
 * Downloads memos from the Notula folder on Google Drive.
 * Reconciles BOTH the consolidated notula_backup.json manifest AND all individual memo_*.json files
 * so that any memo created on any device (even if only saved as a single file) is ALWAYS retrieved!
 */
export async function downloadFromDrive(
  masterPassword: string | null = null,
  interactive: boolean = true
): Promise<{ memos: MemoItem[]; rawCount: number; folderId: string }> {
  const token = await requestDriveAuth(false, !interactive);
  const folderId = await getOrCreateNotulaFolder(token);

  const memosMap = new Map<string, MemoItem>();
  let backupModifiedTime = 0;
  let backupHadData = false;

  // 1. Try reading the full consolidated backup inside the Notula folder first
  const backupFileId = await findDriveFileInFolder(token, DRIVE_FILE_NAME, folderId);
  if (backupFileId) {
    try {
      // Get the modifiedTime of notula_backup.json to compare with individual files
      const fileMetaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${backupFileId}?fields=id,modifiedTime`,
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
          backupModifiedTime = new Date(fileMeta.modifiedTime).getTime();
        }
      }

      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${backupFileId}?alt=media&t=${Date.now()}`, {
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
          if (item && item.id) {
            memosMap.set(item.id, item);
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

  // 2. ALWAYS scan all individual files in the Notula folder (with pagination!)
  // Guarantees that any memo created on another device (such as memo_n_1790415893-669.json)
  // is ALWAYS retrieved, even if notula_backup.json was outdated or missing!
  let pageToken: string | null = null;
  const individualFilesToFetch: Array<{ id: string; name: string; memoId: string }> = [];

  do {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType != '${DRIVE_FOLDER_MIME}'`);
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
      const fileItems = listData.files || [];

      for (const f of fileItems) {
        if (f.name === DRIVE_FILE_NAME) continue;

        if (f.name.startsWith('memo_') && f.name.endsWith('.json')) {
          const memoId = f.name.replace(/^memo_/, '').replace(/\.json$/, '');
          const fileModified = f.modifiedTime ? new Date(f.modifiedTime).getTime() : 0;

          // Fetch if this memo is NOT in the backup manifest, or if the individual file is newer than the backup
          const existingInBackup = memosMap.get(memoId);
          if (!existingInBackup || fileModified > backupModifiedTime) {
            individualFilesToFetch.push({ id: f.id, name: f.name, memoId });
          }
        } else if (!backupHadData && f.name.endsWith('.json')) {
          individualFilesToFetch.push({ id: f.id, name: f.name, memoId: f.id });
        }
      }
    } else {
      console.warn("Failed to list files in Notula folder", await listRes.text().catch(() => ''));
      break;
    }
  } while (pageToken);

  // If no memos found yet, check globally for any files named memo_n_*.json or notula_backup.json created by this app
  if (memosMap.size === 0 && individualFilesToFetch.length === 0) {
    try {
      const globalQuery = encodeURIComponent(`trashed = false and (name contains 'memo_n_' or name = '${DRIVE_FILE_NAME}')`);
      const globalRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${globalQuery}&spaces=drive&fields=files(id,name,modifiedTime)&pageSize=50`,
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
        for (const gf of (gData.files || [])) {
          if (gf.name.startsWith('memo_') && gf.name.endsWith('.json')) {
            const mId = gf.name.replace(/^memo_/, '').replace(/\.json$/, '');
            if (!memosMap.has(mId)) {
              individualFilesToFetch.push({ id: gf.id, name: gf.name, memoId: mId });
            }
          }
        }
      }
    } catch {}
  }

  // Fetch individual files in concurrent batches of 5
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
            const parsedMemo: MemoItem = JSON.parse(content);
            if (parsedMemo && parsedMemo.id) {
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
        } catch (err: any) {
          console.warn(`Error fetching single file ${f.name}:`, err);
        }
      })
    );
  }

  const finalMemos = Array.from(memosMap.values());

  // 3. Reconcile: If we discovered new/updated individual memo files that were missing from notula_backup.json,
  // update notula_backup.json in the background so future syncs across all devices are instant!
  if (finalMemos.length > 0 && (newOrUpdatedCount > 0 || !backupHadData)) {
    try {
      const payloadRaw = JSON.stringify(finalMemos, null, 2);
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
      fetch(url, {
        method: backupFileId ? 'PATCH' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
        cache: 'no-store'
      }).catch(() => {});
    } catch {}
  }

  return { memos: finalMemos, rawCount: finalMemos.length, folderId };
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

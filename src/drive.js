/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- src/drive.js ---
// File compatibile con la struttura originale del progetto Notula

import {
  initGoogleDriveClient,
  requestDriveAuth,
  autoSyncToDrive,
  downloadFromDrive as downloadDriveCore,
  saveSingleMemoToDrive,
  deleteMemoFromDrive,
  getOrCreateNotulaFolder,
  getStoredDriveConfig,
  saveDriveConfig,
  getDriveAccessToken,
  setDriveAccessToken,
  DRIVE_FOLDER_NAME,
  DRIVE_FILE_NAME
} from './utils/driveSync';

export const SCOPES = 'https://www.googleapis.com/auth/drive.file';
export const FOLDER_NAME = DRIVE_FOLDER_NAME;
export const FILE_NAME = DRIVE_FILE_NAME;

/**
 * Inizializza Google Identity Services per Google Drive
 */
export function initGoogleDrive(clientId) {
  const targetId = clientId || getStoredDriveConfig().clientId;
  return new Promise((resolve, reject) => {
    initGoogleDriveClient(
      targetId,
      (token) => resolve(token),
      (err) => reject(err)
    );
  });
}

/**
 * Richiesta di autenticazione o rinnovo Token
 */
export function authenticate(promptConsent = false) {
  return requestDriveAuth(promptConsent);
}

/**
 * Salvataggio automatico / upload di tutti i memo (sia singoli file che manifest) nella cartella 'Notula'
 */
export function uploadToDrive(memos, masterPassword = null) {
  return autoSyncToDrive(memos, masterPassword);
}

/**
 * Download del backup e dei singoli memo dalla cartella 'Notula' su Google Drive
 */
export function downloadFromDrive(masterPassword = null) {
  return downloadDriveCore(masterPassword);
}

export {
  saveSingleMemoToDrive,
  deleteMemoFromDrive,
  getOrCreateNotulaFolder,
  getStoredDriveConfig,
  saveDriveConfig,
  getDriveAccessToken,
  setDriveAccessToken
};

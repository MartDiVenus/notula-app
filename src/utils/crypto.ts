/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * End-to-End Cryptography Engine (Layer 3)
 * Uses Web Crypto API: PBKDF2 key derivation (100k iterations, SHA-256) + AES-GCM 256-bit encryption
 */

const SALT = new TextEncoder().encode("notula-layer3-salt-secure");

export async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: SALT,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(plainText: string, password: string): Promise<string> {
  if (!password) return plainText;
  const key = await deriveKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(plainText);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );

  const payload = new Uint8Array(12 + cipherBuffer.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(cipherBuffer), 12);

  // Convert to Base64 with prefix tag for detection
  let binary = "";
  for (let i = 0; i < payload.byteLength; i++) {
    binary += String.fromCharCode(payload[i]);
  }
  return `NOTULA_ENC_v1:${btoa(binary)}`;
}

export async function decryptData(cipherText: string, password: string): Promise<string> {
  if (!password) {
    throw new Error("Master Password richiesta per decifrare i dati.");
  }
  let rawBase64 = cipherText.trim();
  if (rawBase64.startsWith("NOTULA_ENC_v1:")) {
    rawBase64 = rawBase64.replace("NOTULA_ENC_v1:", "");
  }

  const binary = atob(rawBase64);
  const payload = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    payload[i] = binary.charCodeAt(i);
  }

  const iv = payload.slice(0, 12);
  const cipherBytes = payload.slice(12);

  const key = await deriveKey(password);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuffer);
}

export function isEncryptedString(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.startsWith("NOTULA_ENC_v1:")) return true;
  // Check if non-JSON base64 string
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{") && !trimmed.startsWith("<")) {
    return true;
  }
  return false;
}

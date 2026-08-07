/**
 * AES-256-GCM encryption for social account passwords.
 * Key is a 64-char hex string (32 bytes).
 * Ciphertext format: base64(iv[12] + encrypted + authTag[16])
 */

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex');
  const bytes = new Uint8Array(hex.length / 2) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function importKey(hexKey: string): Promise<CryptoKey> {
  const raw = hexToBytes(hexKey);
  if (raw.length !== 32) throw new Error('ENCRYPTION_KEY must be 64 hex chars (32 bytes)');
  return crypto.subtle.importKey('raw', raw.buffer, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encrypt(plaintext: string, hexKey: string): Promise<string> {
  const key = await importKey(hexKey);
  const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>;
  const encoded = new TextEncoder().encode(plaintext) as Uint8Array<ArrayBuffer>;
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv.buffer }, key, encoded.buffer);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(b64: string, hexKey: string): Promise<string> {
  const key = await importKey(hexKey);
  const combined = Uint8Array.from(atob(b64), c => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
  const iv = combined.slice(0, 12) as Uint8Array<ArrayBuffer>;
  const data = combined.slice(12) as Uint8Array<ArrayBuffer>;
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv.buffer }, key, data.buffer);
  return new TextDecoder().decode(plain);
}

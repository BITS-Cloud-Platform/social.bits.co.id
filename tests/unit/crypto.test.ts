import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../../src/worker/utils/crypto';

// Valid 32-byte key (64 hex chars)
const KEY = 'a'.repeat(64);

describe('crypto utilities', () => {
  it('round-trips plaintext', async () => {
    const plaintext = 'my-secret-password-123!';
    const cipher = await encrypt(plaintext, KEY);
    const plain = await decrypt(cipher, KEY);
    expect(plain).toBe(plaintext);
  });

  it('produces different ciphertext each call (random IV)', async () => {
    const c1 = await encrypt('same', KEY);
    const c2 = await encrypt('same', KEY);
    expect(c1).not.toBe(c2);
  });

  it('throws on wrong key', async () => {
    const cipher = await encrypt('secret', KEY);
    const wrongKey = 'b'.repeat(64);
    await expect(decrypt(cipher, wrongKey)).rejects.toThrow();
  });

  it('throws on tampered ciphertext', async () => {
    const cipher = await encrypt('secret', KEY);
    // Corrupt the last char
    const tampered = cipher.slice(0, -4) + 'XXXX';
    await expect(decrypt(tampered, KEY)).rejects.toThrow();
  });

  it('rejects key shorter than 32 bytes', async () => {
    await expect(encrypt('x', 'abcd')).rejects.toThrow('32 bytes');
  });

  it('handles unicode plaintext', async () => {
    const text = '🔑 Contraseña: ñoño & 中文';
    const cipher = await encrypt(text, KEY);
    expect(await decrypt(cipher, KEY)).toBe(text);
  });
});

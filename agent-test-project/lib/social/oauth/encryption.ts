/**
 * Token Encryption Utility
 *
 * Uses AES-256-GCM for encrypting and decrypting OAuth tokens
 * before storing them in the database.
 *
 * IMPORTANT: Set TOKEN_ENCRYPTION_KEY in .env (64 hex characters = 32 bytes)
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM mode
const AUTH_TAG_LENGTH = 16;
const ENCODING = 'hex';

/**
 * Get encryption key from environment variable
 * @throws Error if TOKEN_ENCRYPTION_KEY is not set or invalid
 */
function getEncryptionKey(): Buffer {
  const key = process.env.TOKEN_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY environment variable is not set. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }

  // Convert hex string to buffer
  const keyBuffer = Buffer.from(key, 'hex');

  if (keyBuffer.length !== 32) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex characters). Current length: ${keyBuffer.length} bytes`
    );
  }

  return keyBuffer;
}

/**
 * Encrypt a token string
 *
 * @param token - The plain text token to encrypt
 * @returns Encrypted token in format: iv:authTag:encryptedData (all hex encoded)
 *
 * @example
 * const encrypted = encryptToken('ya29.a0AfH6SMB...');
 * // Returns: "a1b2c3d4....:e5f6g7h8....:i9j0k1l2...."
 */
export function encryptToken(token: string): string {
  if (!token) {
    throw new Error('Cannot encrypt empty token');
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(token, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag();

  // Return format: iv:authTag:encryptedData
  return [
    iv.toString(ENCODING),
    authTag.toString(ENCODING),
    encrypted
  ].join(':');
}

/**
 * Decrypt an encrypted token
 *
 * @param encryptedToken - The encrypted token string (iv:authTag:encryptedData format)
 * @returns Decrypted plain text token
 *
 * @example
 * const decrypted = decryptToken('a1b2c3d4....:e5f6g7h8....:i9j0k1l2....');
 * // Returns: "ya29.a0AfH6SMB..."
 */
export function decryptToken(encryptedToken: string): string {
  if (!encryptedToken) {
    throw new Error('Cannot decrypt empty token');
  }

  const parts = encryptedToken.split(':');

  if (parts.length !== 3) {
    throw new Error(
      `Invalid encrypted token format. Expected "iv:authTag:encryptedData", got ${parts.length} parts`
    );
  }

  const [ivHex, authTagHex, encryptedData] = parts;

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, ENCODING);
  const authTag = Buffer.from(authTagHex, ENCODING);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, ENCODING, 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Safely encrypt a token that might be null or undefined
 *
 * @param token - The token to encrypt (can be null/undefined)
 * @returns Encrypted token or null if input was null/undefined
 */
export function safeEncryptToken(token: string | null | undefined): string | null {
  if (!token) {
    return null;
  }
  return encryptToken(token);
}

/**
 * Safely decrypt a token that might be null or undefined
 *
 * @param encryptedToken - The encrypted token (can be null/undefined)
 * @returns Decrypted token or null if input was null/undefined
 */
export function safeDecryptToken(encryptedToken: string | null | undefined): string | null {
  if (!encryptedToken) {
    return null;
  }
  return decryptToken(encryptedToken);
}

/**
 * Generate a new encryption key (for initial setup)
 *
 * @returns A new 32-byte key as hex string (64 characters)
 *
 * @example
 * const key = generateEncryptionKey();
 * console.log(`TOKEN_ENCRYPTION_KEY=${key}`);
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

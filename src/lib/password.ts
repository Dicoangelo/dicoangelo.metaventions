import bcrypt from 'bcryptjs';

/**
 * Password hashing utility for secure password management
 * Only bcrypt-hashed passwords are supported
 */

const BCRYPT_ROUNDS = 12;

/**
 * Hash a plaintext password using bcrypt
 * @param plaintext - The plaintext password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

/**
 * Compare a plaintext password against a hash
 * @param plaintext - The plaintext password to verify
 * @param hash - The bcrypt hash to compare against
 * @returns Promise<boolean> - Whether the password matches
 */
export async function comparePassword(plaintext: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plaintext, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

/**
 * Verify admin password using bcrypt
 *
 * @param submittedPassword - The password submitted by user
 * @param storedPassword - The bcrypt-hashed password from environment
 * @returns Promise<boolean> - Whether the password matches
 */
export async function verifyAdminPassword(
  submittedPassword: string,
  storedPassword: string
): Promise<boolean> {
  if (!submittedPassword || !storedPassword) {
    return false;
  }

  // Require bcrypt hashed passwords (must start with $2a$, $2b$, or $2y$)
  const isBcryptHash = /^\$2[aby]\$/.test(storedPassword);

  if (!isBcryptHash) {
    console.error('[SECURITY] Plaintext passwords are not supported. Hash the password using generatePasswordHash().');
    return false;
  }

  return await comparePassword(submittedPassword, storedPassword);
}

/**
 * Generate a password hash for use in .env
 * Run this to hash your admin password, then update .env.local
 *
 * Example:
 *   node -e "require('./src/lib/password.ts').generatePasswordHash('myPassword')"
 */
export async function generatePasswordHash(plaintext: string): Promise<string> {
  return hashPassword(plaintext);
}

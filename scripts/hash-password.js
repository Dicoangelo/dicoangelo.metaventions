#!/usr/bin/env node

/**
 * Password Hashing Utility
 *
 * Usage:
 *   node scripts/hash-password.js "your-plaintext-password"
 *
 * Output:
 *   Hashed password suitable for ADMIN_PASSWORD in .env.local
 *
 * Steps:
 *   1. Generate a strong password using: openssl rand -base64 24
 *   2. Run this script: node scripts/hash-password.js "your-password"
 *   3. Copy the output hash
 *   4. Update ADMIN_PASSWORD in .env.local with the hash
 *   5. Restart the server
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-password"');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/hash-password.js "myStrongPassword123!@#"');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Error: Password must be at least 8 characters long');
  process.exit(1);
}

console.log('Hashing password (this may take a few seconds)...\n');

bcrypt.hash(password, 12).then(hash => {
  console.log('✓ Password hash generated successfully!\n');
  console.log('Add this to your .env.local:\n');
  console.log(`ADMIN_PASSWORD=${hash}\n`);
  console.log('Security notes:');
  console.log('  - Keep this hash in .env.local (not plaintext)');
  console.log('  - The hash is one-way encrypted');
  console.log('  - Never share this hash publicly');
  console.log('  - After updating, restart your development server\n');
}).catch(err => {
  console.error('Error hashing password:', err.message);
  process.exit(1);
});

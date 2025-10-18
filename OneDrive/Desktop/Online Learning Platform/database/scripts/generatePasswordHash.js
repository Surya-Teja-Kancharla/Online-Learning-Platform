/**
 * Password Hash Generator
 * Helper script to generate bcrypt hashes for seed data
 * Run: node scripts/generatePasswordHash.js
 */

const bcrypt = require('bcryptjs');

const password = 'Password@123';
const rounds = 10;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, rounds);
    
    console.log('==========================================');
    console.log('Password Hash Generator');
    console.log('==========================================');
    console.log('\nPassword:', password);
    console.log('Rounds:', rounds);
    console.log('\nGenerated Hash:');
    console.log(hash);
    console.log('\n==========================================');
    console.log('Copy this hash to your seed file');
    console.log('==========================================\n');
    
    // Verify the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification:', isValid ? '✓ Hash is valid' : '✗ Hash verification failed');
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
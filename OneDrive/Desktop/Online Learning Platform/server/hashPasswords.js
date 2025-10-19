/**
 * Hash Plain Passwords Script
 * Run this ONCE after inserting plain passwords to hash them
 * 
 * Usage: node hashPasswords.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function hashExistingPasswords() {
  try {
    console.log('🔄 Fetching users with plain passwords...');
    
    // Get all users
    const result = await pool.query('SELECT id, email, password_hash FROM users');
    const users = result.rows;
    
    console.log(`Found ${users.length} users to process`);
    
    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
        console.log(`✓ ${user.email} - already hashed`);
        continue;
      }
      
      // Hash the plain password
      const plainPassword = user.password_hash;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      // Update in database
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hashedPassword, user.id]
      );
      
      console.log(`✓ ${user.email} - hashed "${plainPassword}"`);
    }
    
    console.log('\n✅ All passwords hashed successfully!');
    console.log('\nYou can now login with:');
    console.log('- aditya@student.com / student123');
    console.log('- rajesh@techlearn.com / instructor123');
    console.log('- admin@techlearn.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

hashExistingPasswords();
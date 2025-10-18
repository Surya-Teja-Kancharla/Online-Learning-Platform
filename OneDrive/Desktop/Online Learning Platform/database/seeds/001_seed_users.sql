-- Seed Data: Users
-- Description: Creates test users for each role
-- Note: Passwords are hashed using bcrypt with 10 rounds
-- All passwords are: Password@123

-- Clear existing data (for development only)
-- TRUNCATE TABLE users CASCADE;

-- Insert admin user
-- Password: Password@123
INSERT INTO users (name, email, password_hash, role, bio) VALUES
('Admin User', 'admin@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'admin', 'System administrator with full access')
ON CONFLICT (email) DO NOTHING;

-- Insert instructor users
-- Password: Password@123
INSERT INTO users (name, email, password_hash, role, bio) VALUES
('John Smith', 'instructor@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'instructor', 'Experienced web development instructor with 10+ years in the industry'),
('Sarah Johnson', 'sarah.instructor@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'instructor', 'Data science and machine learning specialist'),
('Michael Chen', 'michael.instructor@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'instructor', 'Mobile app development expert')
ON CONFLICT (email) DO NOTHING;

-- Insert student users
-- Password: Password@123
INSERT INTO users (name, email, password_hash, role, bio) VALUES
('Alice Williams', 'student@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'student', 'Aspiring full-stack developer'),
('Bob Martinez', 'bob.student@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'student', 'Computer science student interested in AI'),
('Emma Davis', 'emma.student@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'student', 'Career changer learning web development'),
('David Brown', 'david.student@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'student', 'High school student exploring programming'),
('Lisa Anderson', 'lisa.student@example.com', '$2a$10$rXK5YqJZYqJZYqJZYqJZYeN.8.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q.Q', 'student', 'Marketing professional upskilling in tech')
ON CONFLICT (email) DO NOTHING;

-- Verify seeded data
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM users
ORDER BY role, created_at;

-- Count users by role
SELECT 
  role,
  COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;

-- Note: To generate proper bcrypt hashes, run this Node.js script:
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('Password@123', 10);
-- console.log(hash);

-- Replace the placeholder hashes above with actual bcrypt hashes
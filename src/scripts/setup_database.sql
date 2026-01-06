-- Create users table with password support
-- Run this if you need to add password_hash column to existing table

-- Check if password_hash column exists, if not add it
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Sample: Create the users table from scratch (if needed)
/*
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
  manager_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON users(manager_id);

# Database Setup Guide

This guide will help you set up the PostgreSQL database for the TeamAuth-RBAC application.

## Prerequisites

- PostgreSQL 12 or higher installed
- PostgreSQL user with database creation privileges
- Command-line access (psql or pgAdmin)

## Option 1: Automated Setup (Recommended)

### Step 1: Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE teamauth_db;

# Exit psql
\q
```

### Step 2: Run Setup Script

```bash
# Run the database schema script
psql -U postgres -d teamauth_db -f src/scripts/setup_database.sql
```

### Step 3: Create Default Users

```bash
# Run the password migration script to create default users
node src/scripts/migrate_passwords.js
```

This will create:
- Admin: alice@company.com (password: admin123)
- Manager: bob@company.com (password: manager123)
- Employee: charlie@company.com (password: employee123)
- Employee: david@company.com (password: employee123)

## Option 2: Manual Setup

### Step 1: Create Database

Using psql:
```bash
psql -U postgres
```

Execute:
```sql
CREATE DATABASE teamauth_db;
\c teamauth_db
```

### Step 2: Create Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'employee' 
    CHECK (role IN ('admin', 'manager', 'employee')),
  manager_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Create Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON users(manager_id);
```

### Step 4: Insert Default Users

**Note**: You'll need to use the application's registration endpoint or run the migration script to create users with properly hashed passwords.

Using the migration script (recommended):
```bash
node src/scripts/migrate_passwords.js
```

Or manually insert via API:
```bash
# Register admin user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## Database Schema

### Users Table

| Column         | Type         | Constraints                                    | Description                    |
|----------------|--------------|------------------------------------------------|--------------------------------|
| user_id        | SERIAL       | PRIMARY KEY                                    | Unique user identifier         |
| username       | VARCHAR(50)  | UNIQUE, NOT NULL                               | User's username                |
| email          | VARCHAR(100) | UNIQUE, NOT NULL                               | User's email address           |
| password_hash  | VARCHAR(255) |                                                | Bcrypt hashed password         |
| role           | VARCHAR(20)  | NOT NULL, DEFAULT 'employee'                   | User role (admin/manager/emp)  |
| manager_id     | INTEGER      | FOREIGN KEY → users(user_id), ON DELETE SET NULL | Manager's user_id (if employee)|
| created_at     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                      | Account creation timestamp     |

### Indexes

- `idx_users_email` - On email column for faster login queries
- `idx_users_role` - On role column for role-based queries
- `idx_users_manager_id` - On manager_id for hierarchical queries

## Verifying Setup

### Check Database Connection

```bash
psql -U postgres -d teamauth_db -c "SELECT version();"
```

### Check Tables

```sql
\c teamauth_db
\dt
```

You should see:
```
 Schema |  Name  | Type  |  Owner   
--------+--------+-------+----------
 public | users  | table | postgres
```

### Check Table Structure

```sql
\d users
```

### Check Default Users

```sql
SELECT user_id, username, email, role, manager_id FROM users;
```

Expected output:
```
 user_id | username | email               | role     | manager_id
---------+----------+---------------------+----------+------------
       1 | alice    | alice@company.com   | admin    | NULL
       2 | bob      | bob@company.com     | manager  | 1
       3 | charlie  | charlie@company.com | employee | 2
       4 | david    | david@company.com   | employee | 2
```

## Common Database Operations

### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS teamauth_db;"
psql -U postgres -c "CREATE DATABASE teamauth_db;"
psql -U postgres -d teamauth_db -f src/scripts/setup_database.sql
node src/scripts/migrate_passwords.js
```

### Backup Database

```bash
pg_dump -U postgres teamauth_db > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql -U postgres -d teamauth_db < backup_20260106.sql
```

### View All Users

```sql
SELECT 
  user_id,
  username,
  email,
  role,
  CASE 
    WHEN manager_id IS NULL THEN 'No Manager'
    ELSE (SELECT username FROM users WHERE user_id = u.manager_id)
  END as manager_name,
  created_at
FROM users u
ORDER BY created_at;
```

## Troubleshooting

### Issue: Connection Refused

**Error**: `ECONNREFUSED ::1:5432`

**Solution**: 
1. Check if PostgreSQL is running: `pg_ctl status`
2. Start PostgreSQL: `pg_ctl start` (or `sudo service postgresql start` on Linux)
3. Verify connection settings in `.env` file

### Issue: Authentication Failed

**Error**: `password authentication failed for user "postgres"`

**Solution**:
1. Update your `.env` file with correct credentials
2. Reset PostgreSQL password if needed
3. Check `pg_hba.conf` file for authentication method

### Issue: Database Does Not Exist

**Error**: `database "teamauth_db" does not exist`

**Solution**:
```bash
psql -U postgres -c "CREATE DATABASE teamauth_db;"
```

### Issue: Permission Denied

**Error**: `permission denied for schema public`

**Solution**:
```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
```

### Issue: Migration Script Fails

**Error**: Various errors when running `migrate_passwords.js`

**Solution**:
1. Ensure database exists and is accessible
2. Check `.env` configuration
3. Verify table structure is correct
4. Run setup script first: `psql -U postgres -d teamauth_db -f src/scripts/setup_database.sql`

## Environment Configuration

Make sure your `.env` file has these database settings:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=teamauth_db
DB_PASSWORD=your_password_here
DB_PORT=5432
```

## Security Recommendations

1. **Change Default Passwords**: After setup, change all default user passwords
2. **Use Strong Passwords**: For database user and application users
3. **Limit Database Access**: Create a separate database user with limited privileges
4. **Regular Backups**: Set up automated database backups
5. **SSL Connection**: Enable SSL for database connections in production

### Creating Limited Privilege User

```sql
-- Create application-specific database user
CREATE USER teamauth_app WITH PASSWORD 'strong_password_here';

-- Grant necessary privileges
GRANT CONNECT ON DATABASE teamauth_db TO teamauth_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO teamauth_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO teamauth_app;

-- Update .env to use this user
-- DB_USER=teamauth_app
-- DB_PASSWORD=strong_password_here
```

## Production Considerations

1. **Connection Pooling**: The application uses pg connection pooling (already configured)
2. **Database Indexes**: Indexes are created for optimal query performance
3. **Foreign Key Constraints**: Properly set up for data integrity
4. **Prepared Statements**: All queries use parameterized statements to prevent SQL injection
5. **Regular Maintenance**: Run `VACUUM ANALYZE` periodically

### Performance Monitoring

```sql
-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'teamauth_db';

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Next Steps

After completing the database setup:

1. ✅ Verify database connection with: `node -e "import('./src/config/db.js').then(m => m.default.query('SELECT NOW()'))"` 
2. ✅ Start the application: `npm start`
3. ✅ Test authentication endpoints
4. ✅ Change default passwords
5. ✅ Set up regular backups

---

For more information, see the main [README.md](README.md) file.

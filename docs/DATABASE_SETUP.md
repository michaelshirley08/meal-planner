# Database Setup Guide - Single-User Meal Planner

## Overview

This guide covers setting up the SQLite database for the single-user Meal Planner application. SQLite is ideal for local desktop applications as it requires no separate server process and stores the entire database in a single file.

---

## Why SQLite?

### Advantages for Single-User Applications

✅ **Zero Configuration** - No server installation or management
✅ **File-Based** - Entire database in one portable file
✅ **Lightweight** - Small footprint, fast startup
✅ **ACID Compliant** - Full transaction support
✅ **Cross-Platform** - Works on Windows, Mac, Linux
✅ **No Dependencies** - No runtime requirements
✅ **Serverless** - No network configuration needed
✅ **Reliable** - Battle-tested, used in billions of devices

### Perfect for Meal Planner Because

- Single user (no concurrent multi-user access)
- Local data storage (privacy, offline access)
- Simple backup (copy one file)
- Easy migration (move file between computers)
- No cloud costs
- Fast performance for local queries

---

## Prerequisites

### Required Software

1. **Node.js 18+**
   - Includes npm package manager
   - Download from: https://nodejs.org/

2. **SQLite CLI** (optional, for manual database inspection)
   ```bash
   # Check if installed
   sqlite3 --version

   # Install on Ubuntu/Debian
   sudo apt install sqlite3

   # Install on Mac (via Homebrew)
   brew install sqlite3

   # Install on Windows
   # Download from: https://www.sqlite.org/download.html
   ```

3. **Prisma CLI** (installed via npm)
   ```bash
   npm install -D prisma
   ```

---

## Initial Setup

### Step 1: Install Dependencies

```bash
cd /home/mike/meal-planner/backend
npm install
```

This installs:
- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI (dev dependency)

### Step 2: Configure Database URL

Create or edit `.env` file in `/home/mike/meal-planner/backend`:

```bash
# Database connection string
DATABASE_URL="file:./prisma/dev.db"

# For production builds (optional)
# DATABASE_URL="file:./prisma/prod.db"
```

**Explanation:**
- `file:./prisma/dev.db` - Relative path from project root
- Database file will be created at `/home/mike/meal-planner/backend/prisma/dev.db`
- `.db` extension is convention (not required)

### Step 3: Create Database

```bash
# Generate Prisma Client from schema
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init
```

**What this does:**
1. Reads `prisma/schema-single-user.prisma`
2. Creates SQLite database file at `prisma/dev.db`
3. Creates all tables with constraints
4. Generates migration history in `prisma/migrations/`

### Step 4: Verify Database

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

Opens browser at http://localhost:5555

**Verify:**
- All tables created (recipes, ingredients, etc.)
- No userId columns
- Constraints in place

---

## Database File Locations

### Development Database
```
/home/mike/meal-planner/backend/prisma/dev.db
```

### Production Database (recommendation)
```
# Linux/Mac
~/.local/share/meal-planner/meal-planner.db

# Windows
%APPDATA%/meal-planner/meal-planner.db
```

### Configure Production Location

Update `DATABASE_URL` in production `.env`:

```bash
# Linux/Mac
DATABASE_URL="file:/home/mike/.local/share/meal-planner/meal-planner.db"

# Windows
DATABASE_URL="file:C:/Users/username/AppData/Roaming/meal-planner/meal-planner.db"
```

**Best Practice:** Use application data directory for user privacy and backups

---

## Database Migrations

### Creating Migrations

When schema changes:

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name descriptive_name

# Example: Adding a new field
npx prisma migrate dev --name add_recipe_difficulty
```

### Applying Migrations

```bash
# Development (interactive)
npx prisma migrate dev

# Production (no prompts)
npx prisma migrate deploy
```

### Migration Best Practices

1. **Descriptive names** - `add_recipe_difficulty` not `update_schema`
2. **Small migrations** - One logical change per migration
3. **Test first** - Test on dev database before production
4. **Backup before** - Always backup before migrating production

### Viewing Migration History

```bash
# List all migrations
ls -la prisma/migrations/

# View migration SQL
cat prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql
```

---

## Database Backup & Restore

### Manual Backup (Simple)

```bash
# Backup (copy file)
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)

# Restore (copy back)
cp prisma/dev.db.backup.20251125_143000 prisma/dev.db
```

### Automated Backup Script

Create `/home/mike/meal-planner/scripts/backup-database.sh`:

```bash
#!/bin/bash

# Configuration
DB_PATH="/home/mike/meal-planner/backend/prisma/dev.db"
BACKUP_DIR="/home/mike/meal-planner-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/meal-planner_$TIMESTAMP.db"

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Copy database
cp "$DB_PATH" "$BACKUP_FILE"

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
  echo "Backup created: $BACKUP_FILE"

  # Delete backups older than 30 days
  find "$BACKUP_DIR" -name "meal-planner_*.db" -mtime +30 -delete
  echo "Old backups cleaned up"
else
  echo "ERROR: Backup failed!"
  exit 1
fi
```

Make executable:
```bash
chmod +x scripts/backup-database.sh
```

Run manually:
```bash
./scripts/backup-database.sh
```

### Schedule Automatic Backups

**On Linux/Mac (cron):**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/mike/meal-planner/scripts/backup-database.sh
```

**On Windows (Task Scheduler):**
- Create batch file wrapper for PowerShell
- Schedule task via Task Scheduler GUI

### Export to SQL Dump

```bash
# Export entire database to SQL
sqlite3 prisma/dev.db .dump > backup.sql

# Import from SQL dump
sqlite3 prisma/new.db < backup.sql
```

### Export to JSON (Application Data)

Create `/home/mike/meal-planner/scripts/export-data.js`:

```javascript
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  const data = {
    exportDate: new Date().toISOString(),
    recipes: await prisma.recipe.findMany({
      include: {
        ingredients: { include: { ingredient: true } },
        instructions: true,
        ratings: true
      }
    }),
    ingredients: await prisma.ingredient.findMany({
      include: {
        category: true,
        customization: true
      }
    }),
    categories: await prisma.ingredientCategory.findMany(),
    mealPlans: await prisma.mealPlan.findMany({
      include: { recipe: true }
    })
  };

  const filename = `meal-planner-export-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`Data exported to: ${filename}`);
}

exportData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run export:
```bash
node scripts/export-data.js
```

---

## Database Maintenance

### Vacuum Database (Reclaim Space)

```bash
# Compact database file
sqlite3 prisma/dev.db "VACUUM;"
```

**When to vacuum:**
- After deleting many records
- Database file seems larger than expected
- Monthly maintenance

### Analyze Database (Update Statistics)

```bash
# Update query optimizer statistics
sqlite3 prisma/dev.db "ANALYZE;"
```

**When to analyze:**
- After large data imports
- Performance seems degraded
- Before benchmarking

### Check Database Integrity

```bash
# Run integrity check
sqlite3 prisma/dev.db "PRAGMA integrity_check;"

# Should output: ok
```

**When to check:**
- After system crash
- Before major migration
- If seeing strange errors

### Rebuild Indexes

```bash
# Drop and recreate all indexes
sqlite3 prisma/dev.db "REINDEX;"
```

**When to reindex:**
- After corruption repair
- Performance issues
- Rarely needed

---

## Database Security

### File Permissions

```bash
# Restrict database file to owner only
chmod 600 prisma/dev.db

# Verify
ls -l prisma/dev.db
# Should show: -rw------- (owner read/write only)
```

### Database Encryption (Optional)

SQLite doesn't encrypt by default. For encryption:

**Option 1: SQLCipher**
```bash
npm install better-sqlite3
npm install sqlcipher

# Update DATABASE_URL
DATABASE_URL="file:./prisma/dev.db?password=your-encryption-key"
```

**Option 2: File System Encryption**
- Use OS-level encryption (BitLocker, FileVault, LUKS)
- Encrypt home directory
- Simpler than SQLCipher

**Recommendation:** File system encryption for most users

### Backup Encryption

```bash
# Encrypt backup with GPG
gpg --symmetric --cipher-algo AES256 prisma/dev.db
# Creates: dev.db.gpg

# Decrypt
gpg --decrypt prisma/dev.db.gpg > prisma/dev.db
```

---

## Database Inspection Tools

### Prisma Studio (Recommended)

```bash
npx prisma studio
```

**Features:**
- Visual table browser
- Edit data in GUI
- Filter and search
- Relationship navigation

### SQLite CLI

```bash
# Open database
sqlite3 prisma/dev.db

# Useful commands
.tables              # List all tables
.schema recipes      # Show table schema
.headers on          # Show column names
.mode column         # Pretty print

# Sample queries
SELECT * FROM recipes LIMIT 10;
SELECT COUNT(*) FROM ingredients;

.quit                # Exit
```

### DB Browser for SQLite (GUI Tool)

Download from: https://sqlitebrowser.org/

**Features:**
- Visual schema design
- SQL query builder
- Data editing
- Import/export
- Free and open source

### VS Code Extensions

**SQLite Viewer:**
- Install: "SQLite Viewer" by Florian Klampfer
- Right-click .db file → Open with SQLite Viewer

**SQLite:**
- Install: "SQLite" by alexcvzz
- Run queries directly in VS Code

---

## Performance Tuning

### Pragma Settings

Add to Prisma client initialization:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Run on connection
await prisma.$executeRaw`PRAGMA journal_mode = WAL;`;
await prisma.$executeRaw`PRAGMA synchronous = NORMAL;`;
await prisma.$executeRaw`PRAGMA cache_size = -64000;`; // 64MB
await prisma.$executeRaw`PRAGMA temp_store = MEMORY;`;
```

**Explanation:**
- `journal_mode = WAL` - Write-Ahead Logging (better concurrency, faster writes)
- `synchronous = NORMAL` - Balance safety and speed
- `cache_size = -64000` - Use 64MB for cache
- `temp_store = MEMORY` - Use RAM for temp tables

### Index Optimization

**Check index usage:**
```sql
EXPLAIN QUERY PLAN
SELECT * FROM recipes WHERE name LIKE '%pasta%';
```

**Create custom indexes if needed:**
```sql
-- Full-text search index (if needed)
CREATE INDEX idx_recipe_name_search ON recipes(name);
```

### Query Optimization

**Use Prisma query inspector:**
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

**Identify slow queries:**
- Review query logs
- Use EXPLAIN QUERY PLAN
- Add indexes for common filters

---

## Common Issues & Solutions

### Issue: "Database locked" Error

**Cause:** Another process accessing database

**Solution:**
```bash
# Check for locks
lsof prisma/dev.db

# Kill blocking process
kill -9 <PID>

# Or wait for transaction to complete
```

**Prevention:**
- Use WAL mode (see Performance Tuning)
- Don't have Prisma Studio and app running simultaneously
- Close database connections properly

### Issue: "Table does not exist"

**Cause:** Database out of sync with schema

**Solution:**
```bash
# Reset database
npx prisma migrate reset

# Or push schema without migration
npx prisma db push
```

### Issue: "Cannot find module '@prisma/client'"

**Cause:** Prisma client not generated

**Solution:**
```bash
npx prisma generate
```

### Issue: Database file grows too large

**Cause:** WAL file not checkpointed

**Solution:**
```bash
# Checkpoint WAL
sqlite3 prisma/dev.db "PRAGMA wal_checkpoint(TRUNCATE);"

# Or vacuum
sqlite3 prisma/dev.db "VACUUM;"
```

### Issue: Corrupt database

**Symptoms:** integrity_check fails

**Solution:**
```bash
# Try to dump and restore
sqlite3 prisma/dev.db .dump > dump.sql
mv prisma/dev.db prisma/dev.db.corrupt
sqlite3 prisma/dev.db < dump.sql

# If that fails, restore from backup
cp prisma/dev.db.backup.LATEST prisma/dev.db
```

---

## Development vs Production

### Development Setup
```env
DATABASE_URL="file:./prisma/dev.db"
```
- Located in project directory
- Frequent schema changes
- Can be reset easily
- Use Prisma Studio

### Production Setup
```env
DATABASE_URL="file:/path/to/app-data/meal-planner.db"
```
- Located in app data directory
- Stable schema
- Automated backups
- No Prisma Studio

### Environment-Specific Configuration

```typescript
// src/db/config.ts
const isDev = process.env.NODE_ENV === 'development';

export const dbConfig = {
  databaseUrl: isDev
    ? 'file:./prisma/dev.db'
    : process.env.DATABASE_URL,
  log: isDev ? ['query', 'error'] : ['error'],
  enableStudio: isDev
};
```

---

## Testing Database Setup

### Separate Test Database

```env
# .env.test
DATABASE_URL="file:./prisma/test.db"
```

### Test Database Management

```bash
# Before tests: reset database
npx prisma migrate reset --skip-seed --force

# Run tests
npm test

# After tests: cleanup (optional)
rm prisma/test.db
```

### In-Memory Database (Fast Tests)

```env
# .env.test
DATABASE_URL="file::memory:?cache=shared"
```

**Pros:**
- Very fast
- No file cleanup needed

**Cons:**
- Lost after process exits
- Can't inspect with tools

---

## Troubleshooting Checklist

When database issues occur:

1. **Check file exists**
   ```bash
   ls -la prisma/dev.db
   ```

2. **Check file permissions**
   ```bash
   ls -l prisma/dev.db
   # Should be readable/writable by user
   ```

3. **Check DATABASE_URL**
   ```bash
   cat .env | grep DATABASE_URL
   ```

4. **Verify schema matches database**
   ```bash
   npx prisma db pull
   # Should not show differences
   ```

5. **Check for corruption**
   ```bash
   sqlite3 prisma/dev.db "PRAGMA integrity_check;"
   ```

6. **Review Prisma logs**
   ```typescript
   const prisma = new PrismaClient({ log: ['query', 'error'] });
   ```

7. **Last resort: reset and restore**
   ```bash
   npx prisma migrate reset
   # Restore from backup if needed
   ```

---

## Quick Reference

### Essential Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Pull schema from database
npx prisma db pull

# Push schema to database (no migration)
npx prisma db push

# Format schema file
npx prisma format
```

### Database File Operations

```bash
# Backup
cp prisma/dev.db backup.db

# Restore
cp backup.db prisma/dev.db

# Inspect
sqlite3 prisma/dev.db

# Vacuum
sqlite3 prisma/dev.db "VACUUM;"

# Integrity check
sqlite3 prisma/dev.db "PRAGMA integrity_check;"
```

---

## Next Steps

After database setup:

1. ✅ Seed database with sample data (optional)
2. ✅ Set up automated backups
3. ✅ Configure production database location
4. ✅ Test all CRUD operations
5. ✅ Monitor database file size
6. ✅ Document backup/restore procedures for users

---

## Additional Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **SQLite Documentation:** https://www.sqlite.org/docs.html
- **Prisma Schema Reference:** https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- **SQLite CLI Guide:** https://www.sqlite.org/cli.html
- **DB Browser for SQLite:** https://sqlitebrowser.org/

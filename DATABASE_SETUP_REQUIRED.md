# 🚀 QUICK START - FounderLab Setup

## ⚠️ CRITICAL: Run This SQL First!

Before using the app, you MUST set up the Supabase database.

### Step 1: Open Supabase SQL Editor

Go to this URL:
```
https://supabase.com/dashboard/project/gzenaxliwjfhtyoxnbla/sql/new
```

### Step 2: Copy and Paste This Entire SQL Script

```sql
-- ============================================
-- FounderLab Database Schema for Supabase
-- ============================================

-- 1. Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phase INTEGER DEFAULT 1,
    canvas_state TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    md_path TEXT,
    pdf_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- 5. Grant permissions (IMPORTANT)
GRANT ALL ON projects TO anon, authenticated, service_role;
GRANT ALL ON messages TO anon, authenticated, service_role;
GRANT ALL ON documents TO anon, authenticated, service_role;

-- 6. Disable Row Level Security for development
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Done! Setup Complete.
-- ============================================
```

### Step 3: Click "Run" Button

After pasting the SQL, click the "Run" button in Supabase SQL Editor.

### Step 4: Verify Setup

Run this command to check if everything is ready:
```bash
python /app/scripts/status.py
```

## ✅ That's It!

Once the SQL runs successfully, the preview will work and you can access your application!

## 🎯 Access Your App

The app will be available at your preview URL after database setup is complete.

## 📖 Usage Guide

See `/app/QUICKSTART.md` for detailed usage instructions.

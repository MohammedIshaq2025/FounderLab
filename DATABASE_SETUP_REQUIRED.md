# Database Setup — FounderLab

## Current State

The database schema is managed via Supabase migrations applied through the Supabase MCP tools. The following migrations have been applied:

1. **Initial schema** — `projects`, `messages`, `documents` tables with indexes
2. **`add_user_id_to_projects`** — Added `user_id UUID REFERENCES auth.users(id)` + index
3. **`enable_rls_all_tables`** — Enabled RLS on all three tables
4. **`create_rls_policies`** — 8 policies enforcing user ownership

## Schema Overview

```sql
-- projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phase INTEGER DEFAULT 1,
    user_id UUID REFERENCES auth.users(id),
    canvas_state TEXT,
    phase_summaries JSONB,
    ideation_pillars JSONB,
    feature_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    phase INTEGER,
    message_type TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    md_path TEXT,
    pdf_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_project_id ON documents(project_id);
```

## Row Level Security

RLS is **enabled** on all tables. Policies:

```sql
-- projects: CRUD restricted to owner
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- messages: via project ownership
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = messages.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = messages.project_id AND projects.user_id = auth.uid())
);

-- documents: via project ownership
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.user_id = auth.uid())
);
```

## Authentication

Supabase Auth is configured for email + password sign-up/sign-in. User preferences (onboarding data) are stored in `user_metadata` on the auth user record.

The backend uses `SERVICE_ROLE_KEY` which bypasses RLS. All endpoints additionally filter by `user_id` for defense-in-depth.

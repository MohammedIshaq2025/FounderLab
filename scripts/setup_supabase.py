"""
Manual Database Setup Script for Supabase

This script provides the SQL statements needed to set up the database.
You must run these statements in the Supabase SQL Editor.
"""

import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

# Load environment variables
load_dotenv(backend_dir / '.env')

SUPABASE_URL = os.environ.get("SUPABASE_PROJECT_URL")
SUPABASE_PROJECT_ID = os.environ.get("SUPABASE_PROJECT_ID")

SQL_STATEMENTS = """
-- ============================================
-- FounderLab Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phase INTEGER DEFAULT 1,
    canvas_state TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    md_path TEXT,
    pdf_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Grant access (adjust as needed for your security requirements)
-- These grants allow the anon and authenticated roles to access the tables
-- Modify based on your Row Level Security (RLS) policies

GRANT ALL ON projects TO anon, authenticated, service_role;
GRANT ALL ON messages TO anon, authenticated, service_role;
GRANT ALL ON documents TO anon, authenticated, service_role;

-- Note: For production, you should enable Row Level Security (RLS)
-- and create appropriate policies. For development, you can disable RLS:

ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Setup Complete!
-- ============================================
"""

def main():
    print("=" * 80)
    print(" FounderLab - Database Setup")
    print("=" * 80)
    print()
    print(f"Supabase Project URL: {SUPABASE_URL}")
    print(f"Supabase Project ID:  {SUPABASE_PROJECT_ID}")
    print()
    print("To set up your database:")
    print()
    print("1. Open your browser and go to:")
    print(f"   https://supabase.com/dashboard/project/{SUPABASE_PROJECT_ID}/sql/new")
    print()
    print("2. Copy and paste the SQL below into the SQL Editor")
    print()
    print("3. Click 'Run' to execute")
    print()
    print("=" * 80)
    print(SQL_STATEMENTS)
    print("=" * 80)
    print()
    print("After running the SQL, your application will be ready to use!")
    print()

if __name__ == "__main__":
    main()

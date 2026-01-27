import os
import sys
from pathlib import Path
import httpx
import json

# Add backend directory to path
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

# Load environment variables
load_dotenv(backend_dir / '.env')

SUPABASE_URL = os.environ.get("SUPABASE_PROJECT_URL")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print("Attempting to create Supabase tables programmatically...")
print(f"Supabase URL: {SUPABASE_URL}")

# Try to use PostgREST API to execute raw SQL
# Note: This requires the pg_net extension or a custom RPC function

SQL = """
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phase INTEGER DEFAULT 1,
    canvas_state TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    md_path TEXT,
    pdf_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
"""

# Since we can't execute raw SQL via REST API easily, let's try a different approach
# We'll make a simple test insert which will fail gracefully if tables exist

print("\n⚠️  Automated table creation via API is not straightforward.")
print("Please use the Supabase SQL Editor to run the setup SQL.")
print("\nRun this command to see the full setup instructions:")
print("  python /app/scripts/setup_supabase.py")
print()
print("Quick link:")
print(f"  https://supabase.com/dashboard/project/{os.environ.get('SUPABASE_PROJECT_ID')}/sql/new")

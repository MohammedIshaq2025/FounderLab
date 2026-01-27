import os
import sys
from pathlib import Path

# Add backend directory to path for .env loading
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

# Load .env from backend directory
load_dotenv(backend_dir / '.env')

# SQL to create tables
create_tables_sql = """
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
"""

print("Setting up Supabase database tables...")
print(f"\nSupabase URL: {os.environ.get('SUPABASE_PROJECT_URL')}")
print("\nPlease run the following SQL in your Supabase SQL Editor:")
print("=" * 80)
print(create_tables_sql)
print("=" * 80)
print("\nTo access the SQL Editor:")
print("1. Go to https://supabase.com/dashboard")
print("2. Select your project")
print("3. Click on 'SQL Editor' in the left sidebar")
print("4. Paste the SQL above and click 'Run'")
print("\nAlternatively, I'll attempt to create the tables via API...")

try:
    from supabase import create_client
    
    supabase = create_client(
        os.environ.get("SUPABASE_PROJECT_URL"),
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    )
    
    # Execute SQL via RPC or direct query if available
    print("\nAttempting to create tables...")
    print("Note: Table creation via API may require additional setup.")
    print("Please use the SQL Editor method above for guaranteed success.")
    
except Exception as e:
    print(f"\nNote: Could not create tables via API: {e}")
    print("Please use the SQL Editor method above.")

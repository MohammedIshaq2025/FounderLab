import os
import sys
from pathlib import Path
import httpx

# Add backend directory to path for .env loading
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

# Load .env from backend directory
load_dotenv(backend_dir / '.env')

# Get credentials
supabase_url = os.environ.get("SUPABASE_PROJECT_URL")
service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print("Initializing Supabase tables...")
print(f"Supabase URL: {supabase_url}")

# Try to create tables using Supabase REST API
# Note: We'll create them by making test inserts and letting Supabase handle schema
try:
    from supabase import create_client
    
    supabase = create_client(supabase_url, service_role_key)
    
    print("\nTables should be created manually in Supabase SQL Editor.")
    print("After creating tables, the application will work seamlessly.")
    print("\nSQL to run:")
    print("""
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
    """)
    
except Exception as e:
    print(f"Error: {e}")

#!/usr/bin/env python3
"""
FounderLab - Status Check Script
Check if the application is ready to use
"""

import os
import sys
from pathlib import Path
import httpx

# Colors for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_mark(condition):
    return f"{GREEN}✓{RESET}" if condition else f"{RED}✗{RESET}"

def print_header(text):
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}{text:^60}{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")

def check_backend():
    try:
        response = httpx.get("http://localhost:8001/api/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def check_frontend():
    try:
        response = httpx.get("http://localhost:3000", timeout=5)
        return response.status_code == 200
    except:
        return False

def check_database():
    # Try to create a test project
    try:
        response = httpx.post(
            "http://localhost:8001/api/projects",
            json={"name": "test_project_check"},
            timeout=5
        )
        # If we get a different error than "table not found", DB is set up
        if response.status_code == 200:
            return True
        error_msg = response.json().get("detail", "")
        return "Could not find the table" not in error_msg
    except:
        return False

def check_env_vars():
    backend_env = Path("/app/backend/.env")
    if not backend_env.exists():
        return False
    
    with open(backend_env) as f:
        content = f.read()
        has_openai = "OPENAI_API_KEY" in content
        has_supabase = "SUPABASE_PROJECT_URL" in content
        has_tavily = "TAVILY_API_KEY" in content
        return has_openai and has_supabase and has_tavily

def main():
    print_header("FounderLab - System Status Check")
    
    # Check services
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    env_ok = check_env_vars()
    db_ok = check_database()
    
    print(f"{check_mark(backend_ok)}  Backend API (port 8001)")
    if not backend_ok:
        print(f"   {YELLOW}→ Start with: cd /app/backend && python server.py &{RESET}")
    
    print(f"{check_mark(frontend_ok)}  Frontend (port 3000)")
    if not frontend_ok:
        print(f"   {YELLOW}→ Start with: cd /app/frontend && yarn dev --host 0.0.0.0 --port 3000 &{RESET}")
    
    print(f"{check_mark(env_ok)}  Environment Variables")
    if not env_ok:
        print(f"   {YELLOW}→ Check /app/backend/.env file{RESET}")
    
    print(f"{check_mark(db_ok)}  Database Tables")
    if not db_ok:
        print(f"   {RED}→ Database tables NOT set up!{RESET}")
        print(f"   {YELLOW}→ Run: python /app/scripts/setup_supabase.py{RESET}")
    
    print()
    
    if backend_ok and frontend_ok and env_ok and db_ok:
        print(f"{GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}")
        print(f"{GREEN}✨ All systems ready! Access the app at:{RESET}")
        print(f"{GREEN}   http://localhost:3000{RESET}")
        print(f"{GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}")
        return 0
    else:
        print(f"{YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}")
        print(f"{YELLOW}⚠️  Some components need attention{RESET}")
        print(f"{YELLOW}   Fix the issues above and try again{RESET}")
        print(f"{YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(main())

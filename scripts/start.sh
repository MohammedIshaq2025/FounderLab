#!/bin/bash

# FounderLab Startup Script

echo "============================================"
echo " FounderLab - Visual PRD Generator"
echo "============================================"
echo ""

# Check if backend is running
if curl -s http://localhost:8001/api/health > /dev/null 2>&1; then
    echo "✓ Backend is running (port 8001)"
else
    echo "✗ Backend is NOT running"
    echo "  Starting backend..."
    cd /app/backend
    python server.py &
    sleep 3
fi

# Check if frontend is running  
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Frontend is running (port 3000)"
else
    echo "✗ Frontend is NOT running"
    echo "  Starting frontend..."
    cd /app/frontend
    yarn dev --host 0.0.0.0 --port 3000 &
    sleep 5
fi

echo ""
echo "============================================"
echo " Services Status"
echo "============================================"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8001"
echo "API Health: http://localhost:8001/api/health"
echo ""
echo "============================================"
echo " Database Setup Required"
echo "============================================"
echo ""
echo "⚠️  IMPORTANT: Before using the app, set up the database!"
echo ""
echo "Run: python /app/scripts/setup_supabase.py"
echo ""
echo "Or visit:"
echo "https://supabase.com/dashboard/project/gzenaxliwjfhtyoxnbla/sql/new"
echo ""

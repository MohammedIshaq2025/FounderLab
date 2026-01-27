# FounderLab - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Set Up Database (5 minutes)

The application uses Supabase (PostgreSQL) for data storage. You need to create the database tables before using the app.

**Option A: Automated Instructions**
```bash
python /app/scripts/setup_supabase.py
```

**Option B: Direct Link**

1. Open: https://supabase.com/dashboard/project/gzenaxliwjfhtyoxnbla/sql/new
2. Paste the SQL from the setup script
3. Click "Run"

**SQL to run:**
```sql
-- Create tables
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

-- Disable RLS for development
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
```

### Step 2: Verify Services Are Running

Check that both backend and frontend are running:

```bash
# Check backend
curl http://localhost:8001/api/health

# Check frontend
curl http://localhost:3000
```

If services are not running:
```bash
/app/scripts/start.sh
```

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 📋 How to Use

### Creating Your First Project

1. Enter your project name (e.g., "TaskMaster AI")
2. Click "Begin Ideation"

### Phase 1: Ideation (5-10 minutes)

The AI coach will ask you questions about:
- What problem you're solving
- Who experiences this problem
- How people currently deal with it
- Your proposed solution

**Tips:**
- Be specific and detailed
- Don't worry about being perfect
- The AI will challenge assumptions constructively
- When done, AI will say "Phase 1 Complete"

### Phase 2: Research (10-15 minutes)

The canvas appears on the right side! This is where your project visualization lives.

The AI will:
- Ask about features you have in mind
- Research competitors for each feature
- Help define 2-4 core features with sub-features
- Identify conflicts between features
- Suggest complementary features (auth, user management, etc.)

**Tips:**
- Start with core features first
- Let AI research feasibility
- Watch nodes appear on canvas
- Ask "Can you research [specific feature]?" for web search

### Phase 3: Tech Stack & Database (5-10 minutes)

The AI recommends:
- Optimal tech stack for your prototype
- Database schema considerations
- Trade-offs and reasoning

New nodes appear on canvas:
- Tech Stack node
- Database Requirements node

### Phase 4: PRD Generation (5 minutes)

The AI synthesizes everything into a comprehensive PRD document.

**What's included:**
- Overview
- Features (detailed)
- Technical Requirements
- Database Schema
- Implementation Notes

**Optimized for:**
- Cursor AI
- Claude Code
- Other AI code generators

### Phase 5: Export

1. Click "Files" button in top-right
2. Generate documents:
   - Feature Documentation
   - Tech Stack Documentation
   - Complete PRD
3. Download as Markdown (.md) or PDF (.pdf)

## 🎨 Canvas Features

- **Pan**: Click and drag to move around
- **Zoom**: Scroll or use zoom controls
- **Nodes**: Automatically organized
- **Connections**: Dotted lines show relationships
- **Mini Map**: Bottom-right corner for overview

## 💡 Pro Tips

### Getting Better AI Responses

1. **Be specific**: Instead of "social features", say "user profiles with follow/unfollow functionality"
2. **Provide context**: Mention target users, scale, budget constraints
3. **Ask for research**: "Can you research competitors for [feature]?"
4. **Challenge back**: If AI suggests something, ask why

### Canvas Tips

1. **Zoom out** to see full project structure
2. **Zoom in** to read node details
3. Nodes are added automatically as you chat
4. Canvas state is saved continuously

### Document Generation

1. Generate documents after completing each phase
2. PRD is most useful after Phase 4
3. Documents are saved and can be re-downloaded
4. Use Markdown for editing, PDF for sharing

## 🔧 Troubleshooting

### "Could not find table" error

You haven't set up the database. See Step 1 above.

### Backend not responding

```bash
cd /app/backend
python server.py &
```

### Frontend not loading

```bash
cd /app/frontend
yarn dev --host 0.0.0.0 --port 3000 &
```

### Canvas not appearing

Canvas only appears starting from Phase 2. Complete Phase 1 first.

### AI responses slow

- OpenAI API might be under load
- Web search takes 3-5 seconds
- Be patient, responses can take 10-15 seconds

## 📞 Support

For issues:
1. Check logs: `/var/log/supervisor/backend.err.log`
2. Verify database setup completed
3. Ensure all environment variables are set in `/app/backend/.env`

## 🎯 What Makes a Good PRD?

The AI will help you create a PRD that is:

1. **Information-Rich**: All necessary context without fluff
2. **Sequential**: Logical flow for implementation
3. **Actionable**: Clear enough for AI code generators
4. **Complete**: No missing pieces or assumptions

Your PRD should enable:
- Direct import to Cursor or Claude Code
- Clear implementation path
- Minimal follow-up questions

## 🚢 Next Steps After Export

1. Download your PRD (Markdown format recommended)
2. Open Cursor or Claude Code
3. Create a new project
4. Import/paste your PRD
5. Start building!

The AI code generator will use your PRD to:
- Set up project structure
- Implement features systematically
- Create database schema
- Build frontend and backend

---

**Ready to build your startup? Let's go! 🚀**

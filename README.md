# FounderLab - Visual PRD Generator

Transform your startup idea into a polished, AI-ready PRD through an intelligent conversational interface paired with dynamic visual mind mapping.

## Features

- **5-Phase Journey**: Ideation → Research → Tech Stack & Database → PRD Generation → Export
- **AI-Powered Coach**: GPT-4o guides you through each phase with probing questions
- **Visual Canvas**: Interactive mind map with React Flow
- **Web Research**: Integrated Tavily API for competitor research
- **Document Generation**: Export as Markdown and PDF
- **Persistent State**: All progress saved to Supabase

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + React Flow
- **Backend**: FastAPI + Python
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o
- **Search**: Tavily API
- **PDF Generation**: WeasyPrint

## Setup Instructions

### 1. Database Setup (IMPORTANT)

Before running the application, you MUST set up the Supabase database tables:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (ID: gzenaxliwjfhtyoxnbla)
3. Click on "SQL Editor" in the left sidebar
4. Run the following SQL:

```sql
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
```

### 2. Environment Variables

All API keys are already configured in:
- `/app/backend/.env` - Backend configuration
- `/app/frontend/.env` - Frontend configuration

### 3. Running the Application

The application is managed by Supervisor:

```bash
# Restart all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Health Check**: http://localhost:8001/api/health

## How to Use

### Phase 1: Ideation
- Start a new project with your project name
- AI will ask probing questions about your idea
- Refine your concept with guidance
- Complete when AI says "Phase 1 Complete"

### Phase 2: Research
- Canvas appears on the right side
- Define 2-4 core features
- AI researches competitors and feasibility
- Features appear as nodes on canvas
- Complete when all features are defined

### Phase 3: Tech Stack & Database
- AI recommends optimal tech stack
- Database schema considerations
- Tech Stack and Database nodes added to canvas

### Phase 4: PRD Generation
- AI synthesizes all information
- Generates comprehensive PRD
- Optimized for AI code generators (Cursor, Claude Code)

### Phase 5: Export
- Download documents from Files sidebar
- Available formats: Markdown (.md) and PDF (.pdf)
- Import to your preferred development tool

## API Endpoints

- `POST /api/projects` - Create new project
- `GET /api/projects/{project_id}` - Get project details
- `POST /api/chat` - Send chat message
- `POST /api/canvas` - Update canvas state
- `GET /api/canvas/{project_id}` - Get canvas state
- `POST /api/documents/generate` - Generate document
- `GET /api/documents/{project_id}` - List documents
- `GET /api/documents/download/{file_path}` - Download document

## Development

### Backend Development

```bash
cd /app/backend
python server.py
```

### Frontend Development

```bash
cd /app/frontend
yarn dev
```

### Installing Dependencies

**Backend:**
```bash
cd /app/backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd /app/frontend
yarn install
```

## Troubleshooting

### Backend Issues

Check logs:
```bash
tail -f /var/log/supervisor/backend.err.log
```

### Frontend Issues

Check logs:
```bash
tail -f /var/log/supervisor/frontend.err.log
```

### Database Connection Issues

1. Verify Supabase credentials in `/app/backend/.env`
2. Ensure tables are created (see Setup Instructions #1)
3. Check Supabase dashboard for project status

### WeasyPrint PDF Generation Issues

If PDF generation fails, ensure system dependencies are installed:
```bash
sudo apt-get install -y libpango-1.0-0 libpangoft2-1.0-0 libpangocairo-1.0-0 libffi-dev libjpeg-dev libopenjp2-7-dev
```

## Architecture

```
/app/
├── backend/              # FastAPI backend
│   ├── server.py         # Main application
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json     # Node dependencies
│   └── .env            # Environment variables
└── scripts/             # Utility scripts
    └── setup_database.py  # Database setup helper
```

## Credits

Built with ❤️ for startup founders and builders.

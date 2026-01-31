# FounderLab - Visual PRD Generator

Transform your startup idea into a polished, AI-ready PRD through an intelligent conversational interface paired with dynamic visual architecture diagrams.

## Features

- **5-Phase Journey**: Ideation → Feature Mapping → Architecture → PRD Generation → Export
- **AI-Powered Coach**: GPT-4o guides you through each phase with probing questions
- **Visual Canvas**: Interactive architecture diagram with React Flow
- **Web Research**: Integrated Tavily API for competitor research
- **Document Generation**: Export as Markdown and PDF
- **User Authentication**: Supabase Auth with email + password, Row Level Security
- **Persistent State**: All progress saved to Supabase per user

## Tech Stack

- **Frontend**: React 19 + Vite 7 + Tailwind CSS 3 + React Flow + @supabase/supabase-js
- **Backend**: FastAPI + Python
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email + password, JWT validation)
- **AI**: OpenAI GPT-4o
- **Search**: Tavily API
- **PDF Generation**: WeasyPrint (optional)

## Setup Instructions

### 1. Environment Variables

**Backend** (`backend/.env`):

```
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
TAVILY_API_KEY=your-tavily-key
```

**Frontend** (`frontend/.env`):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Setup

The database schema is managed via Supabase migrations. The required tables are:

- **projects** — with `user_id` column referencing `auth.users(id)`
- **messages** — linked to projects via `project_id`
- **documents** — linked to projects via `project_id`

Row Level Security is enabled on all tables with policies enforcing user ownership.

### 3. Running the Application

**Backend:**

```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Health Check**: http://localhost:8001/api/health

## Authentication

FounderLab uses Supabase Auth for user authentication:

1. **Sign Up** — Create account with email + password. Verification email sent.
2. **Sign In** — Email + password authentication. Session managed by supabase-js.
3. **Onboarding** — First-time users complete a 4-step onboarding flow (role, tech level, referral). Data saved to Supabase `user_metadata`.
4. **Session** — JWT tokens auto-refreshed by supabase-js. Axios interceptor attaches Bearer token to all API requests.
5. **Sign Out** — Clears session, redirects to auth page.

### Security

- All API endpoints (except health check and document download) require Bearer token authentication
- Backend validates JWT via `supabase.auth.get_user(token)`
- Row Level Security policies on all tables enforce data isolation per user
- Backend additionally filters queries by `user_id` (defense-in-depth)

## How to Use

### Phase 1: Ideation

- Start a new project with your project name
- AI will ask probing questions about your idea
- Refine your concept with guidance
- Click "Continue to Feature Mapping" when ready

### Phase 2: Feature Mapping

- Canvas appears on the right side
- Define 2-4 core features with AI assistance
- AI researches competitors and feasibility
- Features appear as nodes on canvas
- Click "Continue to Architecture" when ready

### Phase 3: Architecture

- AI organizes features into structured framework
- Tech stack and database nodes added to canvas
- Phase advances automatically when complete

### Phase 4: PRD Generation

- AI synthesizes all information into a comprehensive PRD
- Optimized for AI code generators (Cursor, Claude Code)

### Phase 5: Export

- Download documents from the documents panel
- Available formats: Markdown (.md) and PDF (.pdf)
- Import to your preferred development tool

## API Endpoints

All endpoints except health and download require `Authorization: Bearer <token>`.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check (public) |
| `/api/projects` | GET | List user's projects |
| `/api/projects` | POST | Create new project |
| `/api/projects/{id}` | GET | Get project details |
| `/api/projects/{id}` | DELETE | Delete project |
| `/api/projects/{id}/advance-phase` | POST | Advance to next phase |
| `/api/projects/{id}/messages` | GET | Get project messages |
| `/api/chat` | POST | Send chat message |
| `/api/canvas` | POST | Save canvas state |
| `/api/canvas/{id}` | GET | Get canvas state |
| `/api/documents/generate` | POST | Generate document |
| `/api/documents/{id}` | GET | List project documents |
| `/api/documents/download/{path}` | GET | Download file (public) |

## Architecture

```text
Frontend (React 19 + Vite 7, port 3000)
  ├── Supabase Auth (@supabase/supabase-js)
  ├── /api proxy → Backend (FastAPI, port 8001)
  │                  ├── JWT validation (get_current_user)
  │                  ├── Ownership verification (verify_project_ownership)
  │                  └── Supabase (PostgreSQL + RLS) via SERVICE_ROLE_KEY
  └── AuthContext → Axios interceptor → Bearer token on all requests
```

## Development

### Backend

```bash
cd backend
python server.py
```

### Frontend

```bash
cd frontend
npm run dev
```

### Installing Dependencies

**Backend:**

```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**

```bash
cd frontend
npm install
```

# FounderLab — Project Context

## What This Is

A visual PRD generator that guides startup founders from raw idea to export-ready PRD through 5 AI-powered phases, with a live architecture canvas that builds as the conversation progresses.

## User Journey (5 Phases)

1. **Ideation** — Chat-only. AI startup coach probes: core idea, pain point, solution, target audience. No canvas yet.
2. **Feature Mapping** — Chat + Canvas appear. AI proposes 2-4 core features, does competitor research, checks feasibility. Nodes appear on canvas as features are confirmed.
3. **Architecture** — AI organizes features into structured framework on canvas. Adds tech stack node, database node. Generates tech docs.
4. **PRD Generation** — AI synthesizes all context into a comprehensive PRD optimized for agentic dev systems (Cursor, Claude Code). Saves to documents.
5. **Export** — AI guides download. All docs available as MD/PDF.

## Phase Transitions

- **Phase 1, 2 & 3**: Manual advancement via "Continue" button. Phase 1 AI emits `[IDEATION_COMPLETE]`, Phase 2 emits `[FEATURES_COMPLETE]` — backend extracts data, persists to `ideation_pillars` / `feature_data` columns, frontend shows Continue button. Phase 3 completes via a 5-step guided flow; after Step 5 (auto-triggered), backend returns `mindmap_complete: true` and frontend shows "Continue to PRD Generation" button.
- **Phase 4+**: AI appends `[PHASE_COMPLETE]` tag — backend strips it, auto-bumps `projects.phase` in Supabase.
- Frontend shows a brief full-screen overlay ("Phase N — Name") then loads new phase messages.
- `advance-phase` endpoint handles Phase 1→2 (creates ideation canvas node to right of root), Phase 2→3 (stores feature summaries in phase_summaries), and Phase 3→4 (creates Phase 4 welcome message; phase_summaries["3"] already saved by Step 5).

## Canvas Updates

- AI embeds `[UPDATE_CANVAS]...[/UPDATE_CANVAS]` JSON blocks in its response (auto-stripped before user sees it).
- Backend extracts them, returns as `canvas_updates[]` in the chat response.
- **Fallback**: If Phase 2 AI says "Adding...to your canvas" but forgets the tag, backend auto-parses bold titles + bullet sub-features from the response text and generates canvas updates.
- Frontend applies all updates in a single `setCanvasState(prev => {...})` functional update (batched, no stale closure).
- A debounced `useEffect` (800ms) saves canvas to backend whenever it changes (skips initial load via ref).
- **Node types**: `root`, `ideation`, `featureGroup`, `feature`, `tech`, `database`, `default`, `complementaryFeatures`, `uiDesign`, `systemMap`
- **Layout**: Feature group nodes positioned horizontally below root. Ideation node to the right of root (edge: root Right → ideation Left). Complementary Features above-right of root. UI Design to the left of root (edge: root Left → uiDesign Right). System Map directly above root (edge: root Top → systemMap Bottom).

---

## Architecture

```
Frontend (React 19 + Vite 7, port 3000)
  ├── /api proxy → Backend (FastAPI + Uvicorn, port 8001)
  ├── Supabase Auth (email + password)
  └── Supabase (PostgreSQL + RLS) ← Backend reads/writes via SERVICE_ROLE_KEY
```

### Authentication Flow

1. **Sign Up**: User registers via `supabase.auth.signUp()` → verification email → sign in
2. **Sign In**: `supabase.auth.signInWithPassword()` → session stored by supabase-js
3. **Token Injection**: Axios interceptor (`src/lib/api.js`) attaches `Authorization: Bearer <access_token>` to every API request
4. **Backend Validation**: FastAPI `get_current_user` dependency calls `supabase.auth.get_user(token)` to validate JWT and extract `user_id`
5. **Data Isolation**: RLS policies on all tables enforce `auth.uid() = user_id`. Backend also filters by `user_id` (defense-in-depth).
6. **Session Refresh**: Handled automatically by `@supabase/supabase-js`
7. **Sign Out**: `supabase.auth.signOut()` clears session, frontend redirects to `/auth`

### User Data Storage

- **Per-user (Supabase `user_metadata`)**: `onboarding_completed`, `user_role`, `tech_level`, `referral_source`, `full_name`
- **Per-device (localStorage)**: `founderlab_theme` (light/dark/system), `founderlab_starred` (project IDs array)

### Frontend Stack

- React 19, Vite 7, Tailwind CSS 3, ReactFlow 11
- @supabase/supabase-js (auth client)
- TanStack React Query, Axios (with auth interceptor), React Router 7
- Lucide React icons, react-markdown
- `clsx` + `tailwind-merge` via `cn()` utility in `src/lib/utils.js`

### Backend Stack

- Python FastAPI, Uvicorn
- Supabase (PostgreSQL) via `supabase-py` with SERVICE_ROLE_KEY (bypasses RLS for server-side operations)
- OpenAI GPT-4o for AI responses
- Tavily API for web search / competitor research
- WeasyPrint for PDF generation (optional, needs GTK libs)

### External Services

- `SUPABASE_PROJECT_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` (backend `.env`)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (frontend `.env`)
- `OPENAI_API_KEY` (backend `.env`)
- `TAVILY_API_KEY` (backend `.env`)

---

## Database Schema (Supabase)

**projects** — `id (UUID PK)`, `name`, `phase (int, default 1)`, `user_id (UUID FK→auth.users)`, `canvas_state (TEXT/JSON)`, `phase_summaries (JSONB)`, `ideation_pillars (JSONB)`, `feature_data (JSONB)`, `created_at`, `updated_at`

**messages** — `id (UUID PK)`, `project_id (FK→projects)`, `role`, `content`, `phase (int)`, `created_at`

**documents** — `id (UUID PK)`, `project_id (FK→projects)`, `doc_type`, `md_path`, `pdf_path`, `created_at`

Indexes on `project_id`, `user_id`, and `created_at`.

### Row Level Security (RLS)

RLS is **enabled** on all three tables with the following policies:

- **projects**: CRUD restricted to `auth.uid() = user_id`
- **messages**: SELECT/INSERT restricted via subquery: `EXISTS (SELECT 1 FROM projects WHERE projects.id = messages.project_id AND projects.user_id = auth.uid())`
- **documents**: SELECT/INSERT restricted via same subquery pattern as messages

Backend uses `SERVICE_ROLE_KEY` which bypasses RLS — backend also applies `user_id` filtering in queries for defense-in-depth.

---

## API Endpoints

All endpoints except `/api/health` and `/api/documents/download/{path}` require a valid `Authorization: Bearer <token>` header.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | Public | Health check |
| GET | `/api/projects` | Required | List user's projects (filtered by user_id) |
| POST | `/api/projects` | Required | Create project (sets user_id) |
| GET | `/api/projects/{id}` | Required | Get project + chat history (ownership verified) |
| POST | `/api/chat` | Required | Send message, get AI response + canvas updates |
| POST | `/api/projects/{id}/advance-phase` | Required | Manually advance phase (ownership verified) |
| GET | `/api/projects/{id}/messages` | Required | Get messages, optionally filtered by phase |
| POST | `/api/canvas` | Required | Save canvas state (ownership verified) |
| GET | `/api/canvas/{id}` | Required | Get canvas state (ownership verified) |
| POST | `/api/documents/generate` | Required | Generate MD + PDF doc (ownership verified) |
| GET | `/api/documents/{id}` | Required | List project documents (ownership verified) |
| GET | `/api/documents/download/{path}` | Public | Download file (paths are system-generated) |
| DELETE | `/api/projects/{id}` | Required | Delete project + cascade (ownership verified) |

---

## File Structure

```
R:\FounderLab\
├── backend/
│   ├── .env                    # API keys (not committed)
│   ├── requirements.txt
│   └── server.py               # FastAPI app, auth middleware, all endpoints + AI logic
├── frontend/
│   ├── .env                    # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
│   ├── index.html              # Inter font loaded here
│   ├── package.json
│   ├── vite.config.js          # Proxy /api → :8001, alias @→src
│   ├── postcss.config.js
│   ├── tailwind.config.js      # darkMode:'class', terra/phase/stone colors, animations
│   └── src/
│       ├── main.jsx            # Entry, QueryClientProvider, AuthProvider
│       ├── App.jsx             # Router, ErrorBoundary, auth gate, onboarding gate, project CRUD
│       ├── index.css           # CSS vars: stone, terra, phase, semantic, dark overrides
│       ├── theme.js            # Theme engine (dark/light/system), applies .dark class
│       ├── lib/
│       │   ├── utils.js        # cn() utility
│       │   ├── supabase.js     # Supabase client singleton
│       │   └── api.js          # Axios instance with Bearer token interceptor
│       ├── context/
│       │   └── AuthContext.jsx  # React Context: user, session, loading, signOut
│       └── components/
│           ├── AuthPage.jsx        # Sign in / sign up / email confirmation
│           ├── Onboarding.jsx      # 4-step first-visit onboarding (saves to user_metadata)
│           ├── Dashboard.jsx       # Sidebar (filter nav, starred, account), project cards
│           ├── ChatWorkspace.jsx   # Header + 610px chat + canvas + docs panel
│           ├── ChatInterface.jsx   # Messages, input, markdown rendering
│           ├── CanvasView.jsx      # ReactFlow wrapper, empty state, watermark
│           ├── CustomNode.jsx      # root/ideation/featureGroup/complementaryFeatures/uiDesign/systemMap/feature/tech/database node styles
│           ├── ProgressBar.jsx     # Full + compact (inline header) modes
│           ├── DocumentsPanel.jsx  # Inline documents panel for document download
│           ├── Settings.jsx        # Account details (from user_metadata), theme toggle, danger zone
│           ├── ConfirmationModal.jsx # Reusable confirmation dialog
│           └── ErrorBoundary.jsx   # React error boundary with fallback UI
├── CLAUDE.md                   # Dev guidelines for AI assistants
├── CONTEXT.md                  # This file
├── design.md                   # Design decisions & style guide
├── progress.md                 # Development progress log
├── errors-bugs.md              # Error/bug tracking
└── README.md
```

---

## Design System — Charcoal + Terracotta

**Font:** Inter (400, 500, 600, 700) via Google Fonts
**Theme:** Light by default, with dark and system options. Warm charcoal (not pure black) for dark mode.

### Color Tokens

- **Stone scale:** 50 `#FAFAF9` → 950 `#171412` (warm neutrals for text, borders, surfaces)
- **Stone 850:** `#231F1E` (custom dark mode intermediate)
- **Terra scale:** 50 `#FFF7F5` → 700 `#A83A1F` (terracotta accent for CTAs, active states, links)
- **Phase colors:** 1=Terracotta, 2=Amber, 3=Teal, 4=Rose, 5=Emerald (each has light + dark bg variants)
- **Light surfaces:** Page bg `stone-50`, Cards `#FFF`, Backdrop `stone-950/50`
- **Dark surfaces:** Page bg `#171412`, Cards `stone-900`, Backdrop `black/60`

### Dark/Light Theme System

- Theme engine in `theme.js` — `getEffectiveTheme()`, `applyTheme()`, `watchSystemTheme()`
- Stored in `localStorage('founderlab_theme')`: `light` | `dark` | `system`. Default: `light`
- Uses Tailwind `darkMode: 'class'` — `.dark` class on `<html>`
- Applied at module level before React renders (no flash)
- CSS variables remapped in `.dark`: `--stone-200` → `#2A2523`, `--stone-700` → `#A8A29E`
- Canvas stays light-themed always via `.light-canvas` CSS class
- Settings page provides 3-way toggle (Light / Dark / System)

### Typography Scale

| Use | Size | Weight | Tailwind |
|-----|------|--------|----------|
| Display heading | 30px | 700 | `text-[30px] font-bold tracking-tight` |
| Page heading | 24px | 700 | `text-2xl font-bold tracking-tight` |
| Section heading | 18px | 600 | `text-lg font-semibold` |
| Card title | 15px | 600 | `text-[15px] font-semibold` |
| Chat body | 13px | 400 | `text-[13px] leading-relaxed` |
| Body small | 14px | 400 | `text-sm` |
| Caption/label | 13px | 500 | `text-[13px] font-medium` |
| Badge/tiny | 12px | 500 | `text-xs font-medium` |

### Component Patterns

- Buttons: `bg-terra-500 hover:bg-terra-600 text-white rounded-lg text-sm font-semibold`
- Cards: `bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800`
- Inputs: `border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800`
- Chat user bubble: `bg-stone-800 dark:bg-stone-700 text-stone-100 rounded-2xl`
- Chat bot bubble: `bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl`
- Modals: `bg-stone-950/50 dark:bg-black/60` backdrop + `animate-scale-in` panel

---

## Key Patterns & Conventions

- **Auth flow:** Sign up → email verification → sign in → onboarding (if first time) → dashboard. Auth state managed by `AuthContext`. Route guards in `App.jsx`.
- **User data:** Onboarding preferences (role, tech level, referral) stored in Supabase `user_metadata` via `supabase.auth.updateUser()`. Read from `user.user_metadata` in components.
- **State:** Local React state + localStorage cache for project list. Supabase is source of truth via API.
- **Canvas state flow:** Backend stores JSON string in `projects.canvas_state`. Frontend parses on load, batches updates functionally, debounce-saves.
- **Phase prompts:** Defined in `server.py` `PHASE_PROMPTS` dict — each phase has a detailed system prompt controlling AI behavior.
- **Dashboard layout:** Collapsible sidebar (filter nav: All Projects / Starred + user account) + main content area with project cards.
- **No sidebar in workspace:** Compact header (back arrow, project name, docs button). Phase stepper above chat.
- **Chat width:** 610px, non-resizable.
- **Documents:** Generated server-side (AI + WeasyPrint), stored at `/tmp/documents/`, paths saved in `documents` table.
- **Theme:** Light by default. Applied before React renders. Canvas excluded (stays light).
- **Onboarding:** 4-step flow on first sign-up. Stores preferences in `user_metadata`. Gate checks `user.user_metadata.onboarding_completed`.
- **Starred projects:** `localStorage('founderlab_starred')` — array of project IDs (device-specific).

## AI Behavior Notes

- **Phase 1 (Ideation)**: One question at a time, probes 4 pillars (problem, pain, audience, solutions). Emits `[IDEATION_COMPLETE]` when done. Manual advance via button.
- **Phase 2 (Feature Mapping)**: Structured discovery — user proposes features or AI suggests (with Tavily search). 2-message flow per feature (clarify → summarize + add to canvas). Uses `featureGroup` node type with sub-features. Emits `[FEATURES_COMPLETE]` when 3+ features done. Manual advance via button.
- **Phase 3 (Architecture)**: 5-step deterministic guided flow (no free-form chat):
  - **Step 1** — Complementary Features: AI suggests features based on Phase 2 core features, user multi-selects. Creates `complementaryFeatures` canvas node.
  - **Step 2** — Theme: User picks light/dark. Triggers Tavily web search for color palettes.
  - **Step 3** — Color Palette: AI generates 3 palettes (from web search results), user picks one.
  - **Step 4** — Design Style: User picks a design style. Backend generates design guidelines + tech stack (`generate_tech_stack()`). Creates `systemMap` canvas node. Returns `mindmap_step: 5`.
  - **Step 5** — Auto-triggered by frontend (~800ms after Step 4). Builds summary, creates `uiDesign` canvas node, saves `phase_summaries["3"]` (includes `tech_stack`). Returns `mindmap_complete: true`. User clicks "Continue to PRD Generation" to advance.
- **Phase 4**: Full PRD generation (includes tech stack context from Phase 3), saved to files
- **Phase 5**: Export guidance
- AI uses `[IDEATION_COMPLETE]`, `[FEATURES_COMPLETE]`, `[PHASE_COMPLETE]`, and `[UPDATE_CANVAS]` tags — all stripped by backend before reaching frontend
- Phase 2 has a backend fallback: if AI forgets `[UPDATE_CANVAS]` but describes a feature with bold titles + bullets, backend auto-generates the canvas node(s)

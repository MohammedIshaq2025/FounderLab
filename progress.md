# FounderLab — Progress Log

---

## 2026-01-27 — Production UI Overhaul (Charcoal + Terracotta)

### Foundation

- Added Inter font (400/500/600/700) to `index.html` via Google Fonts
- Rewrote `index.css` — replaced old HSL CSS vars with stone/terra/phase/semantic color system
- Rewrote `tailwind.config.js` — added `terra`, `phase`, `stone` color tokens, Inter font family, custom keyframes (`fade-in`, `slide-in-right`, `scale-in`)
- Deleted 3 unused components: `Sidebar.jsx`, `PhaseIndicator.jsx`, `StartScreen.jsx`

### Canvas Bug Fix

- **Root cause:** `updateCanvas()` in ChatWorkspace read `canvasState` from a stale closure. When multiple `canvas_updates` arrived in a loop, each iteration saw the same snapshot — only the last node survived.
- **Fix:** Removed `updateCanvas()` function and `setTimeout(() => loadProject())`. Replaced with single `setCanvasState(prev => {...})` functional update that processes ALL updates in one pass. Added debounced `useEffect` (800ms) to save canvas changes to backend, with `isInitialLoad` ref to skip the first render.

### New Components Created

- `ErrorBoundary.jsx` — React class error boundary, terracotta-styled fallback with refresh button
- `DocumentsPanel.jsx` — Right-side slide-over (z-50, backdrop, animated), lists documents with MD/PDF download buttons
- `OnboardingBanner.jsx` — Shows 5-phase journey with icons + phase colors, displayed on dashboard when <=2 projects

### Layout Restructure

- **Dashboard.jsx** — Removed sidebar. New top nav bar (logo + "New Project" CTA). Cleaner project cards with stone/terra palette. Fixed phase names (Feature Mapping, MindMapping). Onboarding banner integration.
- **ChatWorkspace.jsx** — Removed WorkspaceSidebar. New compact 48px header (back arrow + project name + inline compact ProgressBar + Docs button). Fixed 380px chat panel. Phase transition overlay (2s full-screen). DocumentsPanel integration.
- Deleted `WorkspaceSidebar.jsx`

### Component Polish

- **ChatInterface.jsx** — Text `text-sm` → `text-[15px]`. Removed user avatars. Bot avatar 28px stone-800 circle. Flat bubbles (no shadow-lg). User: `bg-terra-500 text-white`. Bot: `bg-stone-100 border-stone-200`. Compact input with icon-only send button.
- **CustomNode.jsx** — Root: `bg-stone-800 text-white`. Feature: white + terra hover border. Tech: teal icon. Database: amber icon. Smaller nodes. Added `cn()` utility.
- **CanvasView.jsx** — Empty state with Network icon. Watermark node counter bottom-left. Background `#E7E5E4`. Updated Controls styling.
- **ProgressBar.jsx** — Added `compact` prop (inline pills for header). Fixed phase names. Phase-specific colors. Completed = emerald, current = phase color with ring.

### Integration

- **App.jsx** — Wrapped routes in `ErrorBoundary`. `loadProjects()` calls `GET /api/projects` first, falls back to localStorage on error.
- **server.py** — Added `GET /api/projects` endpoint (lists all projects from Supabase, ordered by `created_at` desc).
- Color audit: zero remaining `#5b0e14`, `#7a1219`, or `indigo-` references.

### Build Verification

- `vite build` passes with no errors (580KB JS bundle, 26KB CSS).

### Files Created

- `CONTEXT.md` — Full project context document
- `progress.md` — This file
- `errors-bugs.md` — Error/bug tracking log

---

## 2026-01-28 — Onboarding Flow, Dashboard Redesign, Chat Elevation & Canvas Fix

### Onboarding Flow (New)

- Created `Onboarding.jsx` — 3-step full-screen onboarding shown on first visit only
  - **Step 1 — Welcome**: FounderLab logo, headline, value prop, "Get Started" button
  - **Step 2 — Technical Level**: 2x2 grid of selectable cards (No tech, Basic, Intermediate, Senior) with icons (HelpCircle, BookOpen, Code, Terminal)
  - **Step 3 — Referral Source**: 6 vertical radio-style rows (Twitter/X, LinkedIn, YouTube, Friend/colleague, Search engine, Other)
  - Horizontal slide animations between steps (`animate-slide-in-from-right` / `animate-slide-in-from-left`)
  - 3-dot progress indicator at bottom
  - Stores `founderlab_onboarding_completed`, `founderlab_tech_level`, `founderlab_referral_source` in localStorage
- Added `/onboarding` route in `App.jsx`
- Gate logic: on mount, if `founderlab_onboarding_completed` is falsy and path is `/`, redirect to `/onboarding` with `replace: true`
- Added `slide-in-from-right` and `slide-in-from-left` keyframes + animations (0.35s ease-out) to `tailwind.config.js`

### Backend — Delete Project Endpoint

- Added `DELETE /api/projects/{project_id}` in `server.py`
- Cascade delete order: documents → messages → project
- Returns `{"success": true}`

### Dashboard Redesign

- **Layout**: Full app-shell with `h-screen flex flex-col`. Header fixed top, sidebar + main content below.
- **Collapsible sidebar**: 264px wide, smooth 300ms CSS transition to collapse to 0. Section label "PROJECTS" uppercase tracking. Each project as compact nav item with phase-colored dot + truncated name. "New Project" shortcut in footer. `PanelLeftClose`/`PanelLeftOpen` toggle icons. Floating toggle when collapsed.
- **Project cards**: Full-width cards with rounded-xl borders and subtle hover shadow lift. Project name (bold, terra hover) + phase badge (name only, no "Phase N:" prefix). Metadata row: created date (Calendar icon) + last edited relative time (Clock icon). 5-segment phase progress bar at bottom. Trash icon on hover + chevron-right affordance.
- **Delete modal**: Confirmation dialog with Cancel/Delete buttons, `bg-red-500` delete action
- **Backdrop click**: Both modals dismiss on backdrop click
- Removed `OnboardingBanner` import/usage, deleted `OnboardingBanner.jsx`
- Added `onDeleteProject` prop, `deleteProject` function in `App.jsx` (calls API, updates state + localStorage)

### ChatWorkspace Redesign

- **Header**: Project name moved to absolute center. Back arrow stays left, Docs button stays right. Removed `ProgressBar` component import.
- **Phase stepper**: New inline design placed directly above the chat. Each phase shows a colored circle with its icon (Lightbulb, GitBranch, Network, FileText, Download) connected by horizontal flex lines. Completed phases turn green with checkmark. Current phase gets accent color with ring glow. Labels always visible.
- **Chat width**: Increased from 380px → 460px → 500px → 530px → 610px across iterations (~60% wider than original)

### Chat Interface Elevation

- **User bubbles**: Replaced loud `bg-terra-500 text-white` with `bg-stone-800 text-stone-100` — dark warm charcoal, easy on the eyes
- **User avatar**: Added `User` icon in `bg-stone-300` circle (previously no user avatar)
- **Bot bubbles**: Changed from `bg-stone-100` to `bg-white border border-stone-200` — cleaner card feel
- **Bubble shape**: `rounded-xl` → `rounded-2xl` for softer, modern feel
- **Send button**: Replaced `Send` (paper plane) icon with `ArrowUp` icon (`strokeWidth={2.5}`), changed from `bg-terra-500` to `bg-stone-800`
- **Input field**: Focus ring changed from terra to `stone-300`, background set to `stone-50`, corners to `rounded-xl`
- **Loading spinner**: Terra accent → `text-stone-400`
- **Font size**: Message text and input reduced from 15px → 13px
- **Spacing**: Message gap increased from `space-y-4` to `space-y-5`

### Canvas — Node Visibility Bug Fix

- **Root cause**: ReactFlow's viewport rendered at 0px height. The CSS flex chain (`h-screen` → `flex-1` → `flex-1` → `h-full`) broke because flex items default to `min-height: auto`, preventing children from resolving `height: 100%`.
- **Fix 1**: Added `min-h-0` to the flex row container in `ChatWorkspace.jsx` — allows the flex item to constrain to allocated space
- **Fix 2**: Added `h-full` to the canvas column wrapper
- **Fix 3**: Changed CanvasView root div from Tailwind classes to inline `style={{ width: '100%', height: '100%', position: 'relative' }}` — guarantees ReactFlow parent has real dimensions
- **Fix 4**: Wrapped inner component in `ReactFlowProvider`, extracted `CanvasViewInner` to use `useReactFlow()` hook for programmatic `fitView()` on node changes
- **Fix 5**: Initialize `useNodesState([])` with empty array, sync from props via `useEffect` to avoid stale closure on first render
- **Fix 6**: `fitView({ padding: 0.2, duration: 300 })` called 100ms after nodes update
- **Other**: `minZoom` expanded from 0.5 to 0.3, `fitViewOptions={{ padding: 0.2 }}` added
- **Canvas background**: Changed from faint `#E7E5E4 size=1` to visible dot grid: `variant="dots" color="#78716C" gap=24 size=1.5`
- **nodeTypes warning**: Renamed to `NODE_TYPES` constant outside component, stable reference

### Build Verification

- `vite build` passes with no errors (589KB JS, 30KB CSS)

### Files Changed

- `frontend/tailwind.config.js` — Added slide animation keyframes
- `frontend/src/App.jsx` — Onboarding route, gate logic, deleteProject function
- `frontend/src/components/Onboarding.jsx` — NEW: 3-step onboarding flow
- `frontend/src/components/Dashboard.jsx` — Full redesign with sidebar + cards
- `frontend/src/components/ChatWorkspace.jsx` — Header, phase stepper, chat width, canvas fix
- `frontend/src/components/ChatInterface.jsx` — Chat elevation redesign
- `frontend/src/components/CanvasView.jsx` — Node visibility fix, ReactFlowProvider, dot grid
- `backend/server.py` — DELETE endpoint
- `frontend/src/components/OnboardingBanner.jsx` — DELETED

---

## 2026-01-28 — Sidebar Refinements, Starred Projects, Dark/Light Theme System

### Sidebar Enhancements

- Removed redundant "+New Project" shortcut button from sidebar footer
- Added **filter navigation** under PROJECTS header: "All Projects" (Folder icon + count) and "Starred" (Star icon + count)
- Active filter highlighted with `bg-stone-100` / `dark:bg-stone-800`
- **Starred projects**: `starredIds` state persisted in `localStorage('founderlab_starred')`. Star toggle button on each project card (hidden by default, amber when starred). Starred filter shows only bookmarked projects.
- Made FounderLab logo in header clickable — navigates to `/` (dashboard)
- Main content heading updates dynamically: "Your Projects" vs "Starred Projects" with matching subtext
- Empty states differentiated for "all" vs "starred" views
- **Removed project list from sidebar** — sidebar now shows only filter nav + account footer for a cleaner layout

### Settings Page

- Created `Settings.jsx` — route `/settings`, accessible from sidebar account popup
- Sections: Account Details (name, tech level, referral source), Theme (3-option segmented control), Danger Zone (delete data / delete account)
- Each destructive action uses `ConfirmationModal`
- Delete Account preserves theme preference when clearing localStorage

### Reusable ConfirmationModal

- Created `ConfirmationModal.jsx` — used by Dashboard (delete project) and Settings (delete data/account)
- Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `cancelText`, `variant` (destructive/default), `icon` (warning/trash/null)
- Backdrop click dismissal, close X button, centered layout

### Dark/Light Theme System

- **Theme engine** (`theme.js`): reads `localStorage('founderlab_theme')`, values `light`/`dark`/`system`. Default is `dark`.
- Applied at module level in `App.jsx` before React renders — no flash of wrong theme
- `watchSystemTheme()` listens for `prefers-color-scheme` changes when set to `system`
- **Tailwind config**: `darkMode: 'class'` enabled, added `stone-850` color, added dark phase backgrounds (`phase-1-bg-dark` through `phase-5-bg-dark`)
- **CSS foundation** (`index.css`):
  - `.dark` overrides for `--background`, `--surface`, `--backdrop`
  - `--stone-200` and `--stone-700` remapped in `.dark` for dark-safe inline styles
  - `.dark *` border-color override to warm charcoal `#2A2523`
  - `.light-canvas` class forces canvas borders back to light stone
- **Components updated with `dark:` variants**: Onboarding, Dashboard, ChatWorkspace, ChatInterface, DocumentsPanel, Settings, ConfirmationModal, ErrorBoundary
- **Exceptions**: Canvas (`CanvasView.jsx`, `CustomNode.jsx`) stays light-themed via `.light-canvas` wrapper
- **Chat bubble contrast**: User bubbles use `dark:bg-stone-700` (lighter than stone-800) to stay visible against dark backgrounds
- **Phase badge readability**: Phase 4 uses `dark:text-[#F43F5E]` (brighter pink) in dark mode
- Settings page theme toggle calls `applyTheme()` immediately on change

### Build Verification

- `vite build` passes with no errors (607KB JS, 38KB CSS)

### Files Changed

- `frontend/tailwind.config.js` — `darkMode: 'class'`, dark phase colors, stone-850
- `frontend/src/index.css` — Dark CSS variables, light-canvas class, border overrides
- `frontend/src/theme.js` — NEW: theme engine (getEffectiveTheme, applyTheme, watchSystemTheme)
- `frontend/src/App.jsx` — Theme initialization, watchSystemTheme, deleteProject function
- `frontend/src/components/Onboarding.jsx` — Dark mode variants
- `frontend/src/components/Dashboard.jsx` — Sidebar filter nav, starred projects, removed project list, full dark mode
- `frontend/src/components/ChatWorkspace.jsx` — Dark header/stepper/borders, light-canvas wrapper
- `frontend/src/components/ChatInterface.jsx` — Dark chat area, contrast-safe bubbles
- `frontend/src/components/DocumentsPanel.jsx` — Dark panel/cards
- `frontend/src/components/Settings.jsx` — NEW: settings page with theme toggle, dark mode
- `frontend/src/components/ConfirmationModal.jsx` — NEW: reusable modal, dark mode
- `frontend/src/components/ErrorBoundary.jsx` — Dark mode variants

---

## 2026-01-28 — Phase 2 Rebuild: Feature Mapping with Structured Discovery

### Database

- Added `feature_data JSONB` column to `projects` table (Supabase migration)

### Backend — Phase 2 Prompt & Logic (`server.py`)

- **Phase 2 prompt rewrite**: Structured feature discovery with two flows (user proposes / AI suggests). Uses `featureGroup` node type with `subFeatures` array. Emits `[FEATURES_COMPLETE]` tag instead of `[PHASE_COMPLETE]`.
- **`[FEATURES_COMPLETE]` extraction**: Parses tag from AI response, persists to `feature_data` column, returns `features_complete` + `feature_data` in API response.
- **Blocked Phase 2 auto-advance**: Changed `phase != 1` to `phase not in (1, 2)` — both Phase 1 and Phase 2 use manual button advancement.
- **Refactored `advance-phase`**: Handles Phase 1→2 (ideation node + Phase 2 welcome) and Phase 2→3 (store feature data in `phase_summaries["2"]` + Phase 3 welcome).
- **Tavily search for Phase 2**: Triggers web search when user asks for AI feature suggestions. Uses ideation context (core problem + target audience) for targeted queries. Capped at 2 searches per phase.
- **Added `featureGroup` to `VALID_NODE_TYPES`** in canvas update validator.
- **Fallback canvas parser**: If AI says "Adding...to your canvas" but forgets `[UPDATE_CANVAS]` tag, backend auto-parses bold titles + bullet sub-features from response text. Handles both single and multiple features in one response (line-by-line state machine).
- **All phase summaries for Phase 3+**: Context injection now passes all prior phase summaries (`all_phase_summaries`) to Phase 3+, not just the immediate previous phase. Phase 3 AI receives both ideation pillars and feature data.

### Frontend — Feature Group Nodes (`CustomNode.jsx`)

- **`FeatureGroupNode` component**: Amber accent bar, Box icon, feature title, sub-features list. Sub-feature text before first colon renders as `font-semibold text-stone-700` (matching bold labels in chat).
- **Dispatch**: `CustomNode` routes `featureGroup` type to `FeatureGroupNode`.

### Frontend — Ideation Node Positioning (`CustomNode.jsx`, `server.py`)

- **IdeationNode target handle**: Changed from `Position.Top` to `Position.Left` — edge enters from the left side.
- **Root node**: Added `Position.Right` source handle (id="right") alongside existing Bottom handle.
- **Backend positioning**: Ideation node placed at `root_x + 320, root_y - 60` (right of root, shifted up). Edge uses `sourceHandle: "right"`.

### Frontend — Canvas Registration (`CanvasView.jsx`)

- Added `featureGroup: CustomNode` to `NODE_TYPES` map.

### Frontend — Dynamic Continue Button (`ChatInterface.jsx`)

- Added `continueLabel` prop — button text changes per phase ("Continue to Feature Mapping" / "Continue to MindMapping").

### Frontend — Phase 2 State & Handlers (`ChatWorkspace.jsx`)

- **New state**: `featuresComplete`, `featureData` — tracks Phase 2 completion.
- **`loadProject` recovery**: Reads `feature_data` from project on refresh, restores Continue button.
- **`sendMessage` detection**: Checks `features_complete` in chat response, sets state.
- **`handleContinueToMindMapping`**: Caches Phase 2 messages, calls `advance-phase` with `current_phase: 2`, loads Phase 3 messages, clears feature state.
- **`showContinueButton`**: Shows for Phase 1 (ideation complete) OR Phase 2 (features complete).
- **`onContinue`**: Routes to `handleContinueToFeatures` (Phase 1) or `handleContinueToMindMapping` (Phase 2).
- **Horizontal positioning**: Feature group nodes spread horizontally below root (`rootX - 200 + col * 300, rootY + 180`) instead of stacked to the right.
- **Added `featureGroup` to frontend `VALID_NODE_TYPES`** Set.

### Build Verification

- `vite build` passes (623KB JS, 45KB CSS)
- Python syntax check passes
- Backend health check returns healthy

### Files Changed

- `backend/server.py` — Phase 2 prompt, extraction, auto-advance block, advance-phase refactor, Tavily, fallback parser, context injection, ideation positioning
- `frontend/src/components/CustomNode.jsx` — FeatureGroupNode, IdeationNode Left handle, root Right handle, bold sub-feature labels
- `frontend/src/components/CanvasView.jsx` — featureGroup node type registration
- `frontend/src/components/ChatInterface.jsx` — continueLabel prop
- `frontend/src/components/ChatWorkspace.jsx` — Phase 2 state, handlers, button logic, horizontal positioning
- `CONTEXT.md` — Updated schema, endpoints, phase transitions, AI behavior, canvas docs
- `design.md` — Added canvas node types section
- `progress.md` — This entry

---

## 2026-01-28 — Supabase Auth + Row Level Security + Onboarding Migration

### Database Migrations (via Supabase MCP)

- **`add_user_id_to_projects`**: Added `user_id UUID REFERENCES auth.users(id)` column + index on `projects` table
- **`enable_rls_all_tables`**: Enabled RLS on `projects`, `messages`, `documents`
- **`create_rls_policies`**: Created 8 RLS policies:
  - `projects`: 4 policies (SELECT, INSERT, UPDATE, DELETE) — `auth.uid() = user_id`
  - `messages`: 2 policies (SELECT, INSERT) — via project ownership subquery
  - `documents`: 2 policies (SELECT, INSERT) — via project ownership subquery

### Frontend — Auth Infrastructure (New Files)

- **`src/lib/supabase.js`** — Supabase client singleton, reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **`src/lib/api.js`** — Axios instance with request interceptor that attaches `Authorization: Bearer <token>` from current Supabase session
- **`src/context/AuthContext.jsx`** — React Context providing `user`, `session`, `loading`, `signOut()`. Initializes from `getSession()`, subscribes to `onAuthStateChange`.
- **`frontend/.env`** — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Frontend — Auth Integration

- **`main.jsx`**: Wrapped `<App />` with `<AuthProvider>`
- **`App.jsx`**: Replaced localStorage auth gate with `useAuth()` hook. Route guards via `<Navigate>`. Loading spinner during auth init. Onboarding gate checks `user.user_metadata?.onboarding_completed`.
- **`AuthPage.jsx`**: Real Supabase auth calls (`signInWithPassword`, `signUp`). Error state with user-facing messages. No props — auth state change handles navigation. Email confirmation mode after signup.
- **`Dashboard.jsx`**: Uses `useAuth()` for `signOut()` and user display (name, email). Reads `tech_level` from `user.user_metadata`.
- **`ChatWorkspace.jsx`**: Replaced `axios` import with `api` (auth interceptor). All API calls use `api.get/post`.
- **`DocumentsPanel.jsx`**: Replaced `axios` with `api`. Kept `API_URL` for `window.open()` download URLs.
- **`Settings.jsx`**: Uses `useAuth()` for `signOut()` and user info. Reads `tech_level`, `referral_source` from `user.user_metadata`.
- **`Onboarding.jsx`**: `handleFinish` calls `supabase.auth.updateUser()` to save `onboarding_completed`, `user_role`, `tech_level`, `referral_source` to `user_metadata`. Removed all localStorage saves for onboarding data.

### Backend — JWT Auth

- Added `HTTPBearer` security scheme + `get_current_user` dependency (validates JWT via `supabase.auth.get_user(token)`)
- Added `verify_project_ownership` helper (checks project exists + belongs to user)
- Updated ALL protected endpoints to include `user_id: str = Depends(get_current_user)`:
  - `POST /api/projects` — inserts `user_id`
  - `GET /api/projects` — filters by `user_id`
  - `GET/DELETE /api/projects/{id}` — verifies ownership
  - `POST /api/chat` — verifies ownership
  - `POST /api/projects/{id}/advance-phase` — verifies ownership
  - `GET /api/projects/{id}/messages` — verifies ownership
  - `POST/GET /api/canvas` — verifies ownership
  - `POST /api/documents/generate` — verifies ownership
  - `GET /api/documents/{id}` — verifies ownership
- Public endpoints (no auth): `/api/health`, `/api/documents/download/{path}`

### Data Cleanup

- Deleted all 49 orphan projects (NULL `user_id`) and 167 associated messages from database
- Database is clean: 0 projects, 0 messages, 0 documents — fresh start for authenticated users

### Architecture Review

- Verified architecture supports future Netlify payment integration without code changes:
  - `user_metadata` is extensible for `subscription_status`
  - Backend middleware pattern (`Depends`) supports adding payment checks
  - Frontend `useAuth()` and route guards are extendable
  - RLS policies are user-based, payment gating at application layer

### Build Verification

- `vite build` passes with no errors (829KB JS, 52KB CSS)
- Python syntax check passes
- Supabase security advisors: 0 issues

### Files Created

- `frontend/src/lib/supabase.js`
- `frontend/src/lib/api.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/.env`

### Files Changed

- `frontend/src/main.jsx` — AuthProvider wrapper
- `frontend/src/App.jsx` — Auth gate, onboarding gate rewrite, api import
- `frontend/src/components/AuthPage.jsx` — Real Supabase auth calls
- `frontend/src/components/Onboarding.jsx` — user_metadata saves
- `frontend/src/components/Dashboard.jsx` — useAuth, signOut, user_metadata reads
- `frontend/src/components/ChatWorkspace.jsx` — api import replacing axios
- `frontend/src/components/DocumentsPanel.jsx` — api import
- `frontend/src/components/Settings.jsx` — useAuth, user_metadata reads
- `backend/server.py` — JWT auth middleware, all endpoints protected

---

## 2026-01-28 — Phase 3: System Map (Tech Stack) Node + Manual PRD Advancement

### Backend — Tech Stack Generation (`server.py`)

- **`generate_tech_stack()` helper**: Takes Phase 2 features, Phase 3 complementary features, project name, core problem. Prompts GPT-4o (temp 0.5, 800 tokens, JSON response format) to determine tech stack as `{frontend: [...], backend: [...], database: [...]}`. Defaults to React/Supabase stack. Falls back to hardcoded defaults on AI failure.
- **Step 4 handler split**: Previously Step 4 did design style + summary + UI Design node + auto-advance. Now Step 4 does design style + design guidelines + tech stack generation + System Map canvas node. Returns `mindmap_step: 5` without advancing.
- **Step 5 handler (new)**: Auto-triggered by frontend. Builds summary message, creates UI Design canvas node, saves `phase_summaries["3"]` (now includes `tech_stack`). Returns `mindmap_complete: true` — does NOT auto-advance. User must click "Continue to PRD Generation".
- **`advance-phase` endpoint**: Added `current == 3` handler for Phase 3→4 transition. Creates Phase 4 welcome message. `phase_summaries["3"]` already saved by Step 5.
- **`VALID_NODE_TYPES`**: Added `'systemMap'`.
- **`build_prd_prompt()`**: Now includes tech stack context (Frontend, Backend, Database) from Phase 3 summary in both the context section and Technical Architecture instructions.

### Frontend — System Map Node (`CustomNode.jsx`)

- **`SystemMapNode` component**: Indigo-500 accent bar, `Server` icon (lucide-react), header "System Map". 3 sections as stone-50 cards: Frontend, Backend, Database — each a bulleted list of tech items. Target handle at Bottom, source handle at Top. Min-width 240px, max-width 300px.
- **Root node**: Added Top source handle (`Position.Top`, id `"top"`) for System Map edge.
- **Dispatcher**: Routes `type === 'systemMap'` to `SystemMapNode`.

### Frontend — Canvas Registration (`CanvasView.jsx`)

- Added `systemMap: CustomNode` to `NODE_TYPES` map.

### Frontend — Manual PRD Advancement (`ChatWorkspace.jsx`)

- **`mindmapComplete` state**: New boolean state tracking Phase 3 completion. Set `true` when Step 5 returns `mindmap_complete: true`. Reset when leaving Phase 3.
- **Auto-trigger Step 5**: After Step 4 response returns `mindmap_step: 5` (without `phase_complete`), waits 800ms then auto-sends `step_data: { step: 5 }`. Processes canvas updates (UI Design node) and sets `mindmapComplete`.
- **`handleContinueToPrd` function**: Calls `advance-phase` with `current_phase: 3`. Transitions to Phase 4, triggers PRD generation. Clears mindmap state.
- **Continue button**: `showContinueButton` now includes `mindmapComplete && phase === 3`. Label: "Continue to PRD Generation". Routes to `handleContinueToPrd`.
- **Refresh recovery**: On page load at Phase 3 with `mindmap_data.step >= 5` and `phase_summaries["3"]` present, restores `mindmapComplete = true` to show the Continue button.
- **VALID_NODE_TYPES**: Added `'systemMap'` to both sets (in `sendMessage` and `sendStepData`).
- **Edge handling**: System Map uses `sourceHandle: "top"` (from root) and `targetHandle: "bottom"` (into systemMap).

### Node Position Adjustments

- **Ideation node**: Moved up 30px and right 60px (`root_x + 208, root_y - 284` → `root_x + 268, root_y - 314`)
- **UI Design node**: Moved left 100px (`root_x - 285` → `root_x - 385`)
- **System Map node**: Positioned at `root_x, root_y - 420` (directly above root)

### Build Verification

- `vite build` passes (836KB JS, 53KB CSS)
- Python syntax check passes
- Both servers health-checked

### Files Changed

- `backend/server.py` — `generate_tech_stack()`, Step 4/5 split, advance-phase Phase 3→4, VALID_NODE_TYPES, `build_prd_prompt()` tech stack context, node position adjustments
- `frontend/src/components/CustomNode.jsx` — SystemMapNode component, Server icon import, root Top handle, dispatcher
- `frontend/src/components/CanvasView.jsx` — systemMap node type registration
- `frontend/src/components/ChatWorkspace.jsx` — mindmapComplete state, Step 5 auto-trigger, handleContinueToPrd, Continue button logic, refresh recovery, VALID_NODE_TYPES, edge handling

---

## 2026-01-29 — Project Search, Phase Color Refinements & Progress Bar Consistency

### Dashboard — Project Search

- **Search bar**: Added working search bar to projects page header. Search icon (`Lucide Search`) with text input. Filters projects by name (case-insensitive).
- **Empty state**: When search yields no results, displays "No projects match your search" message with clear search button.
- **Layout**: Search bar positioned center of header with `flex-1 max-w-md mx-8` for balanced spacing.

### Phase Color Updates

- **Phase 3 (MindMapping)**: Changed from teal (`#0D9488`) to violet (`#7C3AED`) to better differentiate from Phase 5.
- **Phase 5 (Export)**: Changed from emerald (`#10B981`) to teal (`#0D9488`) as requested by user.
- **Reason**: Emerald and teal were too similar, causing visual confusion in progress indicators.

### Color Token Updates

Files updated:
- `frontend/tailwind.config.js` — Updated `phase-3`, `phase-3-bg`, `phase-3-bg-dark`, `phase-5`, `phase-5-bg`, `phase-5-bg-dark` tokens
- `frontend/src/index.css` — Updated CSS variables `--phase-3`, `--phase-3-bg`, `--phase-5`, `--phase-5-bg`
- `frontend/src/components/ProgressBar.jsx` — Updated `PHASE_COLORS` constant
- `frontend/src/components/Dashboard.jsx` — Updated `getPhaseColor()` and `getPhaseAccent()` functions
- `frontend/src/components/ChatWorkspace.jsx` — Updated `PHASE_COLORS` constant

### Progress Bar Opacity Fix

- **Issue**: Completed projects showed inconsistent color shading across progress bar segments (completed segments had varying opacity).
- **Fix**: Changed segment opacity from `isActive ? (p === project.phase ? 1 : 0.35) : 0.3` to `isActive ? 1 : 0.3` — all active segments now render at full opacity.
- **Result**: Progress bar shows consistent color across all completed phases.

### Documentation

- **CLAUDE.md**: Added GitHub credentials (Username: MohammedIshaq2025, Email: iansari.070201@gmail.com)
- **design.md**: Added Phase Color Reference table with all 5 phase colors and their light/dark background variants

### Files Changed

- `CLAUDE.md` — Added GitHub credentials section
- `design.md` — Updated Complementary Features node color, added Phase Color Reference table
- `progress.md` — This entry
- `frontend/tailwind.config.js` — Phase color token updates
- `frontend/src/index.css` — Phase CSS variable updates
- `frontend/src/components/Dashboard.jsx` — Search bar, phase colors, progress bar opacity fix
- `frontend/src/components/ProgressBar.jsx` — Phase color updates
- `frontend/src/components/ChatWorkspace.jsx` — Phase color updates

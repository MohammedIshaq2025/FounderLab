# FounderLab — Errors & Bugs Log

---

## Fixed

### Canvas stale closure bug — Fixed 2026-01-27

- **Symptom:** When AI returned multiple `canvas_updates` (e.g. 3 nodes), only the last node appeared on canvas.
- **Cause:** `updateCanvas()` read `canvasState` from a stale closure. Each iteration of the `for` loop saw the same snapshot, so only the last `setCanvasState` call won the render.
- **Fix:** Replaced loop + `updateCanvas()` with a single `setCanvasState(prev => {...})` functional update that processes all updates against the accumulating state. Removed the `setTimeout(() => loadProject())` reload hack.

### Phase names incorrect — Fixed 2026-01-27

- **Symptom:** Dashboard and ProgressBar showed "Research" and "Tech Stack" instead of "Feature Mapping" and "MindMapping".
- **Fix:** Updated phase name maps in `Dashboard.jsx` and `ProgressBar.jsx` to canonical names: Ideation, Feature Mapping, MindMapping, PRD Generation, Export.

### Projects loaded only from localStorage — Fixed 2026-01-27

- **Symptom:** `App.jsx` `loadProjects()` only read from localStorage, so projects created on another device or after clearing storage were invisible.
- **Fix:** Added `GET /api/projects` backend endpoint. Frontend tries API first, falls back to localStorage on error.

### No auth / multi-tenancy — Fixed 2026-01-28

- **Symptom:** All projects visible to all users. No login. No data isolation.
- **Fix:** Implemented full Supabase Auth (email + password) with Row Level Security:
  - Added `user_id` column to `projects` table referencing `auth.users(id)`
  - Enabled RLS on all tables (`projects`, `messages`, `documents`)
  - Created 8 RLS policies enforcing user ownership
  - Frontend: `AuthContext` + `@supabase/supabase-js` for sign-up/sign-in, Axios interceptor for Bearer tokens
  - Backend: `get_current_user` FastAPI dependency validates JWT, all endpoints verify ownership
  - Onboarding data stored in Supabase `user_metadata` (not localStorage) for per-user persistence

---

## Known Issues

### PDF generation requires GTK libraries

- **Symptom:** `POST /api/documents/generate` returns 501 if WeasyPrint can't import (needs GTK/Pango system libs).
- **Impact:** PDF download unavailable on systems without GTK. Markdown download still works.
- **Workaround:** Install GTK libraries or use MD export only.

### Document file paths use `/tmp/documents/`

- **Symptom:** Generated docs are saved to `/tmp/documents/` which is ephemeral on most hosting platforms.
- **Impact:** Documents lost on server restart/redeploy.
- **Potential fix:** Store doc content in Supabase or use Supabase Storage for file persistence.

### Canvas node positioning is naive

- **Symptom:** Nodes use parent offset + sibling count for Y position. Can overlap with deep trees.
- **Impact:** Visual clutter on complex canvases.
- **Potential fix:** Implement a proper layout algorithm (dagre/elk) for non-overlapping positioning.

### Chat history not paginated

- **Symptom:** All messages loaded at once from Supabase. Long conversations = slow load.
- **Impact:** Performance degrades on projects with many messages.

### Document download endpoint is public

- **Symptom:** `/api/documents/download/{path}` has no auth because `window.open()` can't send Bearer tokens.
- **Impact:** Anyone who knows a file path could download it. Low risk since paths are system-generated UUIDs and only exposed via authenticated endpoints.
- **Potential fix:** Use signed URLs or Supabase Storage with auth tokens.

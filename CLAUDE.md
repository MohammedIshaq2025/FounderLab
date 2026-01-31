# FounderLab - Development Guidelines

## GitHub Credentials
- **Username**: MohammedIshaq2025
- **Email**: iansari.070201@gmail.com

## Design Philosophy
- **Premium, elegant, minimal UI** — every screen should feel polished and production-grade
- Clean, modern aesthetic with intentional whitespace and visual hierarchy
- No clutter, no unnecessary elements — every pixel earns its place

## UI/UX Principles
1. **User flow first** — all changes evaluated from the user's journey perspective
2. **User experience over features** — smooth interactions, clear feedback, intuitive navigation
3. **Consistency** — uniform spacing, typography, color usage, and component behavior throughout
4. **Accessibility** — proper contrast ratios, keyboard navigation, semantic HTML
5. **Responsive** — works flawlessly across viewport sizes

## Code Standards
- Validate all code changes before committing
- Follow best practices for React, FastAPI, and all libraries in use
- Never break existing functionality when adding or modifying features
- Test user flows end-to-end after changes
- Keep components modular and reusable
- Use Tailwind CSS utility classes consistently

## Tech Stack
- **Frontend**: React 19, Vite 7, Tailwind CSS 3, ReactFlow, TanStack React Query, Axios, @supabase/supabase-js
- **Backend**: Python FastAPI, Uvicorn, supabase-py
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email + password) with JWT validation
- **AI**: OpenAI GPT-4o
- **Search**: Tavily API

## Architecture
- Frontend runs on port 3000, proxies `/api` to backend on port 8001
- All state persisted to Supabase
- 5-phase user journey: Ideation -> Feature Mapping -> Architecture -> PRD Generation -> Export
- Phases 1, 2, 3 use manual "Continue" button advancement; Phase 4+ auto-advances

## Authentication & Security
- **Supabase Auth** -- email + password sign-up/sign-in via `@supabase/supabase-js`
- **Frontend auth** -- `AuthContext` (`src/context/AuthContext.jsx`) provides `user`, `session`, `loading`, `signOut()` via React Context
- **API auth** -- Axios interceptor in `src/lib/api.js` auto-attaches `Authorization: Bearer <token>` to every request
- **Backend auth** -- FastAPI `get_current_user` dependency validates JWT via `supabase.auth.get_user(token)`, returns `user_id`
- **Row Level Security** -- Enabled on all tables (`projects`, `messages`, `documents`). Policies enforce user ownership via `auth.uid() = user_id`
- **Defense-in-depth** -- Backend also filters by `user_id` in queries, not just RLS
- **User preferences** -- Stored in Supabase `user_metadata` (onboarding_completed, user_role, tech_level, referral_source), NOT localStorage
- **Theme preference** -- Only `founderlab_theme` and `founderlab_starred` remain in localStorage (device-specific, not user-specific)

## Theme
- **Light mode is the default** -- clean stone-50 background
- Theme managed by `src/theme.js` -- applies `.dark` class on `<html>` before React renders
- All components use Tailwind `dark:` variants
- Canvas (`CanvasView.jsx`) stays light-themed always -- wrapped in `.light-canvas` class
- Theme toggle in Settings page (Light / Dark / System)

## Design Reference
- **Always read `design.md` before making UI changes** -- it contains the founder's confirmed design preferences, color rules, component patterns, and anti-patterns
- When in doubt about styling, color choices, or layout decisions, defer to `design.md`

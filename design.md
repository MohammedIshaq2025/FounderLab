# FounderLab — Design Decisions & Style Guide

This document records the founder's confirmed design preferences. Reference before making any UI changes.

---

## Core Aesthetic

- **Direction**: Premium, minimal, modern — inspired by Linear and Notion
- **Tone**: Refined, functional, clean. No clutter. Every element earns its place.
- **Palette**: Warm neutrals (stone scale) with terracotta (terra) as the accent. No loud colors in the workspace — color is reserved for phase indicators and intentional accents.
- **Typography**: Inter font family. Tight tracking on headings. Small, readable body text (13px for chat, 15px for headings/labels).
- **Default theme**: Light — clean stone-50 background. Dark theme available via Settings.

---

## Logo & Favicon

- **Logo files**: `frontend/public/logo-black.svg` (light mode), `frontend/public/logo-white.svg` (dark mode), `frontend/public/favicon.svg` (browser tab icon)
- **Logo rendering**: Always use dark/light `<img>` pair with `dark:hidden` / `hidden dark:block` to swap based on theme
- **Logo height**: `h-12` (48px) across all pages (Auth, Onboarding steps, Dashboard header)
- **Favicon**: SVG favicon linked in `index.html` via `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
- **Welcome logo**: Onboarding welcome step uses the same dark/light `<img>` pair at `h-12`

---

## Confirmed Preferences

### Auth Page

- Split-screen layout: left panel (~45%, form) + right panel (~55%, decorative visual)
- Right panel: abstract gradient mesh with warm terra + stone tones, floating testimonial card with subtle animation. Hidden on mobile.
- Left panel: vertically centered form with generous whitespace
- FounderLab logo top-left: `<img>` dark/light pair (`/logo-black.svg` + `/logo-white.svg`) at `h-12`, switching via `dark:hidden` / `hidden dark:block`
- Two modes toggled inline: **Sign In** (email + password + "Keep me signed in" + sign-in button) and **Sign Up** (name + email + password + "Create Account" button)
- Password field has eye icon toggle (Eye/EyeOff from lucide-react)
- Toggle text at bottom: "New to Founder Lab? Create Account" / "Already have an account? Sign In"
- After signup success: confirmation card ("Check your email") with mail icon and "Back to Sign In" link
- Error messages: `bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl`
- Staggered fade-in animations matching Onboarding patterns
- Real Supabase auth calls (signInWithPassword, signUp)

### Sidebar

- Collapsible left sidebar (264px) with smooth 300ms transition
- Section header: `text-[11px] font-semibold text-stone-400 uppercase tracking-widest` — "PROJECTS" label style (NO tabs, single section)
- **Filter navigation** under PROJECTS header: "All Projects" (Folder icon + count) and "Starred" (Star icon + count)
- Active filter: `bg-stone-100 dark:bg-stone-800` with bold text
- **No project list in sidebar** — sidebar shows only filter nav + account footer (clean, minimal)
- User account at bottom: avatar + name + email — clickable to open popup
- Account popup: popover from bottom with "Settings" and "Log Out" menu items
- Collapse toggle uses PanelLeftClose/PanelLeftOpen icons
- FounderLab logo in header: `<img>` dark/light pair (`/logo-black.svg` + `/logo-white.svg`) at `h-12` — clickable, navigates to dashboard

### Project Cards (Main Content)

- Full-width cards, not grid. Single column.
- Rounded-xl borders with subtle hover shadow lift
- Project name (bold, terra on hover) + phase badge (name only, no "Phase N:" prefix)
- Phase badges have dark-mode backgrounds (`phase-1-bg-dark` etc.) for readability
- Metadata: created date + last edited relative time
- 5-segment phase progress bar at bottom
- Star button on each card (hidden by default, amber when starred)
- Trash icon appears on row hover, chevron-right affordance

### Chat Interface

- User messages: `bg-stone-800 dark:bg-stone-700 text-stone-100` — dark charcoal, NOT orange/terra. Uses lighter charcoal in dark mode for contrast.
- Bot messages: `bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800` — clean card style
- User avatar: `stone-300 dark:stone-600` circle with User icon. Bot avatar: `stone-800 dark:stone-700` circle with Bot icon.
- Bubble shape: `rounded-2xl`
- Send button: up-arrow icon (`ArrowUp`), `bg-stone-800 dark:bg-stone-700`, not terra
- Input: `bg-stone-50 dark:bg-stone-800`, `rounded-xl`, focus ring `stone-300 dark:stone-600`
- Font: 13px for messages and input
- No orange/terra anywhere in the chat conversation area
- **Text readability critical** — all text must maintain proper contrast in both themes

### Phase Stepper

- Inline horizontal stepper above the chat panel
- Each phase: colored circle with icon (Lightbulb, GitBranch, Network, FileText, Download)
- Connected by horizontal flex lines
- Completed = green checkmark, current = phase accent color with ring glow
- Labels always visible

### ChatWorkspace Header

- Back arrow (left), Chat/Documents tab toggle, centered project name, user account icon (right)
- User account icon: `w-8 h-8` rounded-full circle with `User` lucide icon, `bg-stone-200 dark:bg-stone-700`
- Click opens dropdown popup (top-right origin): Settings + Log Out, same pattern as Dashboard sidebar popup
- Click-outside dismisses popup

### Canvas

- **Always light-themed** — canvas does NOT switch to dark mode. Wrapped in `.light-canvas` CSS class.
- Dot grid background: `variant="dots" color="#78716C" gap=24 size=1.5`
- Nodes must be visible — ReactFlow needs explicit container dimensions (`min-h-0` on flex parents, inline style on wrapper)
- Empty state: stone-100 bg with Network icon

### Canvas Node Types

- **Root** (`root`): Dark stone-800, Sparkles icon. Has Bottom + Right + Left + Top source handles.
- **Ideation** (`ideation`): Terra accent bar, Lightbulb icon, 4 pillar cards. Left target handle. Positioned to the right of root, shifted up. Edge: root Right → ideation Left.
- **Feature Group** (`featureGroup`): Amber accent bar, Box icon, sub-features list with bold labels before colon. Top target handle. Positioned horizontally below root.
- **Complementary Features** (`complementaryFeatures`): Violet accent bar (#7C3AED), Puzzle icon, bulleted feature list. Bottom target handle. Positioned above-right of root.
- **UI Design** (`uiDesign`): Rose accent bar, Palette icon. Shows theme, palette (color swatches), design style, and 3 design guidelines. Right target + Left source handles. Positioned to the left of root. Edge: root Left → uiDesign Right.
- **System Map** (`systemMap`): Indigo-500 accent bar, Server icon. 3 sections: Frontend, Backend, Database — each a bulleted list of tech items. Bottom target + Top source handles. Positioned directly above root. Edge: root Top → systemMap Bottom.
- **Feature** (`feature`): White card, Box icon, terra hover border.
- **Tech** (`tech`): White card, Layers icon (teal).
- **Database** (`database`): White card, Database icon (amber).
- Sub-feature text renders label before `:` as `font-semibold text-stone-700`

### Modals & Confirmation Dialogs

- Backdrop: `bg-stone-950/50 dark:bg-black/60 backdrop-blur-[2px]`, click to dismiss
- Card: `bg-white dark:bg-stone-800 rounded-xl shadow-xl dark:shadow-2xl`, `animate-scale-in`
- Delete actions: `bg-red-500`
- Create/confirm actions: `bg-terra-500`
- **Reusable ConfirmationModal** (`ConfirmationModal.jsx`): used for all destructive actions
  - Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `cancelText`, `variant` (destructive/default), `icon` (warning/trash/null)
  - Destructive variant: red confirm button + icon badge
  - Default variant: terra confirm button
  - Close X button top-right, centered layout

### Settings Page

- Route: `/settings`
- Header: back arrow + "Settings" title
- Sections with uppercase tracking-widest headers (matches sidebar "PROJECTS" style)
- **Account Details**: display name, email, tech level, referral source (from `user.user_metadata`)
- **Theme**: 3-option segmented control (Light / Dark / System) with icons. Default: light.
  - Calls `applyTheme()` immediately on change — no page reload needed
  - Delete Account preserves theme preference across localStorage clear
- **Danger Zone**: red border card with "Delete Account Data" and "Delete Account" rows
- Each destructive action uses ConfirmationModal

### Onboarding

- Full-screen centered on `stone-50 dark:stone-950` background
- 4-step flow: Welcome → User Role → Technical Level → Referral Source
- Welcome step + step headers: `FounderLabLogo` dark/light `<img>` pair at `h-12`
- Horizontal slide animations between steps
- 4-dot progress indicator (`bg-terra-500` active, `bg-stone-300 dark:bg-stone-600` inactive)
- Selection cards: `border-terra-500 bg-terra-50 dark:bg-terra-500/10 ring-2 ring-terra-500/20` when selected
- Unselected cards: `bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700`
- Data saved to Supabase `user_metadata` via `supabase.auth.updateUser()` (NOT localStorage)
- Fields stored: `onboarding_completed`, `user_role`, `tech_level`, `referral_source`

### Dark/Light Theme

- **Default is light** — clean stone-50 background. Dark mode uses warm charcoal, NOT pure black.
- Theme engine (`theme.js`) reads `localStorage('founderlab_theme')`: `light` | `dark` | `system`
- Tailwind `darkMode: 'class'` — `.dark` on `<html>`, applied before React renders
- All components use `dark:` Tailwind variants for backgrounds, text, borders
- CSS variables remapped in `.dark` for inline styles that use `var(--stone-200)` etc.
- **Canvas exception**: stays light always via `.light-canvas` wrapper class
- **Text readability is paramount** — all surfaces must maintain proper contrast ratios

---

## Anti-Patterns (Do NOT use)

- Orange/terra backgrounds for user chat bubbles — too harsh
- Grid layouts for project lists — single column cards only
- "Phase N:" prefix on badges — just the phase name
- Loud colors in workspace areas — keep neutral
- Generic AI aesthetics (purple gradients, system fonts without intention)
- Redundant UI elements — sidebar shows filter nav only, not project list (project list is in main content)
- Tabbed sidebar — user explicitly prefers single "PROJECTS" header, not tabs
- Pure black (`#000`) backgrounds in dark mode — use warm charcoal (`stone-950: #171412`)
- Dark mode canvas — canvas always stays light-themed
- Storing user preferences in localStorage — use Supabase `user_metadata` for per-user data

---

## Color Usage Rules

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | `bg-stone-50` | `bg-stone-950` |
| Cards / surfaces | `bg-white` | `bg-stone-900` |
| Primary CTA buttons | `bg-terra-500` | `bg-terra-500` (same) |
| Destructive actions | `bg-red-500` | `bg-red-500` (same) |
| User chat bubbles | `bg-stone-800 text-stone-100` | `bg-stone-700 text-stone-100` |
| Bot chat bubbles | `bg-white border-stone-200` | `bg-stone-900 border-stone-800` |
| Send button | `bg-stone-800` | `bg-stone-700` |
| Phase indicators | Phase-specific + light bg | Phase-specific + dark bg variants |

---

## Phase Color Reference

| Phase | Name | Accent Color | Light Background | Dark Background |
|-------|------|--------------|------------------|-----------------|
| 1 | Ideation | `#E8613C` (terra) | `#FDEBE6` | `#2D1A15` |
| 2 | Feature Mapping | `#D97706` (amber) | `#FEF3C7` | `#2D2305` |
| 3 | MindMapping | `#7C3AED` (violet) | `#EDE9FE` | `#251539` |
| 4 | PRD Generation | `#BE123C` (rose) | `#FFE4E6` | `#2D1318` |
| 5 | Export | `#0D9488` (teal) | `#CCFBF1` | `#0A2D29` |
| Sidebar section labels | `text-stone-400` | `text-stone-400` (same) |
| Interactive hover | `hover:bg-stone-50` | `hover:bg-stone-800` |
| Borders | `border-stone-200` | `border-color: #2A2523` |
| Backdrop overlay | `bg-stone-950/50` | `bg-black/60` |

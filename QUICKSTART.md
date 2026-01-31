# FounderLab - Quick Start Guide

## Getting Started

### Step 1: Set Up Environment Variables

**Backend** (`backend/.env`):

```env
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
TAVILY_API_KEY=your-tavily-key
```

**Frontend** (`frontend/.env`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Start Services

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

### Step 3: Verify Services

```bash
# Check backend
curl http://localhost:8001/api/health

# Check frontend
curl http://localhost:3000
```

### Step 4: Create Your Account

1. Open `http://localhost:3000` in your browser
2. Click "Create Account" on the auth page
3. Enter your name, email, and password
4. Check your email for verification (if email confirmation is enabled)
5. Sign in with your credentials
6. Complete the 4-step onboarding flow

## How to Use

### Phase 1: Ideation

The AI coach will ask you questions about:

- What problem you're solving
- Who experiences this problem
- How people currently deal with it
- Your proposed solution

**Tips:**

- Be specific and detailed
- Don't worry about being perfect
- The AI will challenge assumptions constructively
- Click "Continue to Feature Mapping" when the AI says ideation is complete

### Phase 2: Feature Mapping

The canvas appears on the right side. The AI will:

- Ask about features you have in mind
- Research competitors for each feature
- Help define 2-4 core features with sub-features
- Add feature nodes to the canvas

**Tips:**

- Start with core features first
- Let AI research feasibility
- Watch nodes appear on canvas
- Click "Continue to Architecture" when features are complete

### Phase 3: Architecture

The AI recommends:

- Optimal tech stack for your prototype
- Database schema considerations
- Trade-offs and reasoning

New nodes appear on canvas: Tech Stack and Database Requirements.

### Phase 4: PRD Generation

The AI synthesizes everything into a comprehensive PRD document optimized for:

- Cursor AI
- Claude Code
- Other AI code generators

### Phase 5: Export

1. Open the documents panel (toggle in header)
2. Generate documents: Feature Documentation, Tech Stack, Complete PRD
3. Download as Markdown (.md) or PDF (.pdf)

## Canvas Tips

- **Pan**: Click and drag to move around
- **Zoom**: Scroll or use zoom controls
- **Nodes**: Automatically organized as you progress
- **Connections**: Dotted lines show relationships

## Troubleshooting

### Can't sign in?

- Ensure your email is verified (check spam folder)
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `frontend/.env`

### Backend not responding?

- Verify `backend/.env` has all required keys
- Check that port 8001 is available

### API returns 401?

- Your session may have expired. Sign out and sign back in.
- Ensure the frontend `.env` has the correct Supabase anon key.

### Canvas not appearing?

Canvas only appears starting from Phase 2. Complete Phase 1 first.

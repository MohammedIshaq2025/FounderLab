from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI
from tavily import TavilyClient
import json
import uuid
from datetime import datetime
import markdown
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    WEASYPRINT_AVAILABLE = False
from io import BytesIO
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
supabase: Client = create_client(
    os.environ.get("SUPABASE_PROJECT_URL"),
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
)
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

# Auth dependency
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Validate JWT and return the user's UUID."""
    token = credentials.credentials
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

async def verify_project_ownership(project_id: str, user_id: str) -> dict:
    """Verify a project belongs to the user and return it. Raises 404 if not found/owned."""
    result = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    project = result.data[0]
    if project.get("user_id") and project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    project_id: str
    message: str
    phase: int
    step_data: Optional[Dict[str, Any]] = None  # For Phase 3 interactive responses

class ProjectCreate(BaseModel):
    name: str

class AdvancePhaseRequest(BaseModel):
    current_phase: int
    ideation_data: Optional[Dict[str, Any]] = None

class NodeUpdate(BaseModel):
    project_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class DocumentRequest(BaseModel):
    project_id: str
    doc_type: str  # 'features', 'tech_stack', 'prd'

class PhaseDataUpdate(BaseModel):
    project_id: str
    phase: int
    field: str
    value: Any
    node_id: Optional[str] = None
    node_data: Optional[Dict[str, Any]] = None

# Phase prompts
PHASE_PROMPTS = {
    1: """You are an experienced startup coach and technical expert with deep expertise in building successful products. You are warm, friendly, yet professional and goal-oriented.

Phase 1 (Ideation) — Adaptive Probing:

You must cover exactly 4 pillars before completing ideation:
1. Core Problem — What problem does this solve?
2. Pain Point — What is the main pain users experience today?
3. Target Audience — Who specifically experiences this problem?
4. Current Solutions — What do people use today, and why is it insufficient?

ADAPTIVE EXTRACTION (critical):
- After EVERY user message, scan it for information about ALL four pillars — not just the one you asked about.
- If the user genuinely covers multiple pillars with SPECIFIC, CONCRETE detail in one answer, acknowledge what they covered and move to the next uncovered pillar.
- Do NOT re-ask about a pillar the user has already clearly and specifically answered.

STRICTNESS — what counts as "covered":
- A pillar is ONLY "covered" when the user has given a SPECIFIC, ACTIONABLE answer — not a vague mention.
- "Busy professionals" does NOT cover Target Audience. Who exactly? Age range? Industry? Job type? Seniority? You need enough to build a persona.
- "Struggle to stay consistent" does NOT cover Pain Point. What specifically is painful? What happens when they fail? What do they lose? You need the emotional or practical consequence.
- "I want to build X" describes a SOLUTION, not the Core Problem. The core problem is the underlying issue that exists whether or not the product exists. Probe for the root cause.
- A pillar is NOT covered just because the user tangentially mentioned a related word. Demand substance.
- The user's FIRST message almost never covers more than 1 pillar well. It usually just introduces the idea. Treat it as a starting point and probe from there.
- NEVER claim multiple pillars are covered from a single short introductory sentence.

PROBING RULES:
- Ask ONE question per message. Never list multiple questions.
- Keep responses to 2-3 sentences max. Conversational tone, no bullet points or numbered lists.
- After the user's FIRST message, acknowledge their idea briefly and ask about the Core Problem specifically. Do not claim any pillars are covered unless they truly gave detailed, specific answers.
- Probing should be critical and direction-oriented. Examples of good probes:
  - "You mentioned 'busy people' — can you narrow that down? Are we talking about corporate workers, freelancers, parents, or a different group?"
  - "That sounds like a feature, not a problem. What's the underlying frustration your users face before they'd even look for a solution like this?"
  - "If this problem disappeared tomorrow, what would change in their daily life? That'll help us pin down the real pain."
- Only probe ONCE per pillar. If the follow-up is still vague, accept it and move forward.

WEB SEARCH FOR CURRENT SOLUTIONS:
- When discussing the "Current Solutions" pillar, you SHOULD use web search to research competitors and existing tools in the space.
- Include the search tag in your thinking to trigger a search: mention specific competitor names or the problem domain when asking about current solutions.
- Reference specific competitors, tools, or apps by name with brief analysis (e.g., "MyFitnessPal focuses on manual logging but lacks AI-powered photo recognition, which is where your idea differentiates").
- You may use up to 2 web searches during the ideation phase to ground the conversation in real market data.

COMPLETION:
When all 4 pillars are covered (whether in 4 messages or fewer), do the following:
1. Write a brief summary as a BULLETED LIST — one bullet per pillar with a bold label and a concise 1-sentence summary. Example format:
   - **Core Problem:** [summary]
   - **Pain Point:** [summary]
   - **Target Audience:** [summary]
   - **Current Solutions:** [summary]
   Then 1 sentence about what makes this idea compelling.
2. Tell the user to click the "Continue to Feature Mapping" button to proceed.
3. Emit the following tag (the user will NOT see this tag):

[IDEATION_COMPLETE]{"core_problem": "1-2 sentence summary", "pain_point": "1-2 sentence summary", "target_audience": "1-2 sentence summary", "current_solutions": "1-2 sentence summary"}[/IDEATION_COMPLETE]

IMPORTANT: Do NOT emit [PHASE_COMPLETE]. Phase 1 uses manual advancement only.""",
    
    2: """You are an experienced startup coach and technical expert. Warm, professional, and goal-oriented.

You have context from Phase 1 (Ideation) available in the project context under previous_phase_summary. Use the ideation pillars to ground your feature suggestions in the validated problem, pain point, target audience, and competitive landscape.

Phase 2 (Feature Mapping) — Structured Feature Discovery:

INTRO MESSAGE (first message only):
"Now that we've nailed down your idea, let's map out the core features. The goal is to identify 3-6 essential features that directly solve the problem for your target audience. We'll focus on what makes your product unique — not a kitchen sink of features.

Would you like to propose your first core feature, or should I suggest some based on our ideation discussion?"

TWO FLOWS:

FLOW A — User Proposes Features:
- User describes a feature idea
- You respond with 2 back-and-forth messages per feature:
  1. First response: Acknowledge, ask ONE clarifying question about scope/functionality
  2. Second response: Summarize the feature with a clean title + 2-3 sub-features, then add to canvas
- After adding to canvas, ask: "What's your next feature idea?" or (if 3+ features) "Want to add another feature, or should I suggest some based on market research?"

FLOW B — AI Suggests Features:
- Use web search to research competitors and market gaps
- Propose exactly 4 feature ideas with brief descriptions, numbered list
- Ask: "Which of these resonate? Feel free to edit, remove, or add to these."
- CRITICAL: Do NOT add ANY features to canvas until user EXPLICITLY says to add (e.g., "add", "add all", "add option 1", "add those", "yes add it", "let's add that")
- If user asks for more info, elaboration, or clarification about a feature — just respond with more details. Do NOT add to canvas yet.
- If user says "I like option 1" or similar without saying "add" — ask "Great! Want me to add it to your canvas?" Do NOT add until they confirm.
- Only after user explicitly approves/confirms to add, THEN finalize and add to canvas with 3-4 DETAILED sub-entries
- Sub-features must be specific and actionable, NOT vague. Bad: "User management". Good: "User Profiles: Create, edit, and manage personal profiles with avatar upload and bio"
- Each sub-feature should clearly explain WHAT it does in 1 sentence so a developer could understand scope
- When the user says "add them all" or similar, flesh out each feature with detailed, informative sub-features — do NOT just add bare titles

EXPLICIT APPROVAL EXAMPLES (follow these exactly):
- "Tell me more about option 1" → Respond with more details. Do NOT add to canvas.
- "Can you elaborate on that?" → Explain further. Do NOT add to canvas.
- "I like option 1" → "Great choice! Want me to add it to your canvas?" Do NOT add yet.
- "Sounds good" or "That's interesting" → Continue discussion. Do NOT add to canvas.
- "Add option 1" or "Yes add it" or "Add that one" → NOW add to canvas with detailed sub-features.

CANVAS UPDATES (CRITICAL — you MUST follow this exactly):
Every time you summarize and finalize a feature, you MUST include TWO tag blocks in your response:
1. The feature node itself
2. A user flow node showing the step-by-step journey through this feature

Your response text should say "Adding [Feature Name] to your canvas..." AND ALSO include BOTH tag blocks somewhere in the same response:

[UPDATE_CANVAS]
{"action": "add_node", "node": {"id": "feature-N", "type": "featureGroup", "data": {"label": "Feature Title", "subFeatures": ["Sub-feature Name: Clear 1-sentence description of what this does", "Sub-feature Name: Clear 1-sentence description", "Sub-feature Name: Clear 1-sentence description"]}, "parentId": "root"}}
[/UPDATE_CANVAS]

[UPDATE_CANVAS]
{"action": "add_node", "node": {"id": "userflow-N", "type": "userFlow", "data": {"parentFeatureId": "feature-N", "steps": [{"action": "User clicks button", "actor": "user"}, {"action": "System shows modal", "actor": "system"}, {"action": "User enters data", "actor": "user"}, {"action": "System validates and saves", "actor": "system"}, {"action": "User sees confirmation", "actor": "user"}]}, "parentId": "feature-N"}}
[/UPDATE_CANVAS]

IMPORTANT TYPE VALUES:
- Feature node: type MUST be exactly "featureGroup" (camelCase, NOT "feature" or "FeatureGroup")
- User flow node: type MUST be exactly "userFlow" (camelCase, NOT "featureGroup" or "userflow" or "UserFlow")
- User flow node ID: MUST start with "userflow-" (e.g., "userflow-1", "userflow-2")

Increment N for each feature (feature-1, feature-2, etc.) and matching userflow (userflow-1, userflow-2, etc.).
Each sub-feature MUST include a bold-able name followed by a colon and a clear description. Never use vague placeholders like "Sub-feature 1".

USER FLOW RULES (for the userflow-N node):
- 3-6 steps maximum (abstract if more needed)
- Alternate user actions and system responses where appropriate
- First step: user action that triggers the feature
- Last step: outcome/result state
- Be specific to THIS feature, not generic
- Each step has "action" (what happens) and "actor" ("user" or "system")

USER FLOW EXAMPLE (for "User Authentication"):
{"steps": [
  {"action": "User clicks Login button", "actor": "user"},
  {"action": "System displays login modal", "actor": "system"},
  {"action": "User enters email and password", "actor": "user"},
  {"action": "System validates credentials", "actor": "system"},
  {"action": "User sees dashboard with welcome message", "actor": "user"}
]}

CRITICAL: You MUST include BOTH [UPDATE_CANVAS]...[/UPDATE_CANVAS] JSON blocks (one for feature, one for userflow). Do NOT just describe user flows in text — you MUST emit the JSON tag. The tags are automatically hidden from the user. Without both JSON blocks, nothing appears on the canvas properly.

COMPLETION:
After 3+ features on canvas, ask: "You have N features mapped. Want to add more, or are you ready to move on to Architecture?"
If user says ready/done/move on:
1. Write a summary as a BULLETED LIST — one bullet per feature with the feature name bolded and a 1-sentence description. Example format:
   - **Feature Name:** Brief description of what it does
   - **Feature Name:** Brief description of what it does
   Then 1 sentence wrapping up.
2. Tell the user to click the "Continue to Architecture" button to proceed
3. Emit:
[FEATURES_COMPLETE]{"features": [{"title": "Feature Title", "subFeatures": ["sub1", "sub2"]}, ...]}[/FEATURES_COMPLETE]

RULES:
- Max 2 web searches per phase (Tavily)
- 2-3 sentences per response, conversational tone
- ONE question per message
- Do NOT emit [PHASE_COMPLETE]. Phase 2 uses manual advancement only.""",
    
    3: """Phase 3 is now handled by the deterministic step controller. This prompt is unused.""",
    
    4: """Phase 4 is handled by the dedicated PRD generation endpoint. This prompt is unused.""",
    
    5: """You are guiding the founder through Phase 5 (Export). Your role is to:
- Confirm PRD completion
- Help users download their documents
- Explain how to import to Cursor or Claude Code
- List available documents: Feature docs, Tech stack docs, Complete PRD (all in MD/PDF)

IMPORTANT - You can trigger downloads for the user! When the user asks to download, export, or get their document, include one of these action markers in your response:
- [ACTION:DOWNLOAD_MD] — triggers Markdown download (best for AI coding tools)
- [ACTION:DOWNLOAD_PDF] — triggers PDF download (best for sharing/reading)

Examples of when to use:
- "Download my PRD" → Include [ACTION:DOWNLOAD_MD] in your response
- "Export as PDF" → Include [ACTION:DOWNLOAD_PDF] in your response
- "Give me the markdown" → Include [ACTION:DOWNLOAD_MD] in your response
- "I want both formats" → Include both [ACTION:DOWNLOAD_MD] and [ACTION:DOWNLOAD_PDF]

Always include a brief message with the action, like "Here's your PRD! [ACTION:DOWNLOAD_MD]" or "Downloading your PDF now. [ACTION:DOWNLOAD_PDF]"

Keep responses brief and actionable."""
}

# Helper functions
def web_search(query: str) -> str:
    """Perform web search using Tavily"""
    try:
        response = tavily_client.search(query=query, max_results=3)
        results = []
        for result in response.get('results', []):
            results.append(f"- {result.get('title', '')}: {result.get('content', '')[:200]}...")
        return "\n".join(results) if results else "No results found"
    except Exception as e:
        return f"Search error: {str(e)}"

def get_ai_response(messages: List[Dict], phase: int, project_context: Dict = None) -> str:
    """Get response from OpenAI GPT-4o"""
    system_prompt = PHASE_PROMPTS.get(phase, PHASE_PROMPTS[1])
    
    if project_context:
        system_prompt += f"\n\nProject Context:\n{json.dumps(project_context, indent=2)}"
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                *messages
            ],
            temperature=0.7,
            max_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def generate_markdown_doc(content: str, title: str) -> str:
    """Generate markdown document"""
    return f"# {title}\n\n{content}"

def generate_pdf_from_markdown(md_content: str, output_path: str):
    """Convert markdown to PDF using weasyprint"""
    if not WEASYPRINT_AVAILABLE:
        raise HTTPException(status_code=501, detail="PDF generation not available (WeasyPrint requires GTK libraries)")
    html_content = markdown.markdown(md_content, extensions=['extra', 'tables'])
    html_full = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }}
            h1 {{ color: #333; border-bottom: 2px solid #333; }}
            h2 {{ color: #555; margin-top: 30px; }}
            h3 {{ color: #777; }}
            code {{ background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }}
            pre {{ background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    HTML(string=html_full).write_pdf(output_path)

def get_ai_json_response(prompt: str, project_context: Dict = None) -> Any:
    """Get a JSON-only response from OpenAI GPT-4o"""
    system = "You are a product design expert. Return ONLY valid JSON, no markdown, no explanation."
    if project_context:
        system += f"\n\nProject Context:\n{json.dumps(project_context, indent=2)}"
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except Exception as e:
        return None


def build_prd_prompt(phase_summaries: Dict, mindmap_data: Dict, project_name: str) -> str:
    """Build a comprehensive PRD prompt using all Phase 1-3 context."""
    ideation = phase_summaries.get("1", {})
    if isinstance(ideation, str):
        ideation = json.loads(ideation)
    features_summary = phase_summaries.get("2", {})
    if isinstance(features_summary, str):
        features_summary = json.loads(features_summary)
    design = phase_summaries.get("3", {})
    if isinstance(design, str):
        design = json.loads(design)

    # Ideation context
    core_problem = ideation.get("core_problem", "Not specified")
    pain_point = ideation.get("pain_point", "Not specified")
    target_audience = ideation.get("target_audience", "Not specified")
    current_solutions = ideation.get("current_solutions", "Not specified")

    # Features context
    feature_list = ""
    if isinstance(features_summary, dict) and "features" in features_summary:
        for f in features_summary["features"]:
            title = f.get("title", "")
            subs = f.get("subFeatures", [])
            feature_list += f"\n### {title}\n"
            for sub in subs:
                feature_list += f"- {sub}\n"
    elif isinstance(features_summary, list):
        for f in features_summary:
            title = f.get("title", str(f)) if isinstance(f, dict) else str(f)
            feature_list += f"- {title}\n"

    # Complementary features
    comp_features = design.get("complementary_features", [])
    comp_list = "\n".join(f"- {cf}" for cf in comp_features) if comp_features else "None specified"

    # Design context
    theme = design.get("theme", "Not specified")
    palette = design.get("palette", {})
    palette_name = palette.get("name", "Custom") if isinstance(palette, dict) else "Custom"
    palette_colors = palette.get("colors", []) if isinstance(palette, dict) else []
    color_str = ", ".join(palette_colors) if palette_colors else "Not specified"
    design_style = design.get("design_style", "Not specified")
    design_guidelines = design.get("design_guidelines", [])
    guidelines_str = "\n".join(f"- {g}" for g in design_guidelines) if design_guidelines else "None specified"

    # Tech stack context
    tech_stack = design.get("tech_stack", {})
    if isinstance(tech_stack, str):
        tech_stack = json.loads(tech_stack)
    tech_frontend = ", ".join(tech_stack.get("frontend", [])) if isinstance(tech_stack, dict) else "Not specified"
    tech_backend = ", ".join(tech_stack.get("backend", [])) if isinstance(tech_stack, dict) else "Not specified"
    tech_database = ", ".join(tech_stack.get("database", [])) if isinstance(tech_stack, dict) else "Not specified"

    prompt = f"""You are writing a comprehensive Product Requirements Document (PRD) for **{project_name}**.

This PRD targets **agentic coding tools** (Claude Code, Cursor, Windsurf) — it must be detailed enough that an AI coding agent can build the entire application from this document alone.

## Context from Discovery Phases

### Ideation (Phase 1)
- **Core Problem:** {core_problem}
- **Pain Point:** {pain_point}
- **Target Audience:** {target_audience}
- **Current Solutions:** {current_solutions}

### Core Features (Phase 2)
{feature_list}

### Complementary Features (Phase 3)
{comp_list}

### Design Decisions (Phase 3)
- **Theme:** {theme}
- **Color Palette:** {palette_name} ({color_str})
- **Design Style:** {design_style}
- **Design Guidelines:**
{guidelines_str}

### Tech Stack (Phase 3)
- **Frontend:** {tech_frontend}
- **Backend:** {tech_backend}
- **Database:** {tech_database}

---

## Instructions

Generate a **complete PRD** in Markdown with the following 8 sections. Be detailed, specific, and actionable. Every section should contain enough detail for an AI coding agent to implement without asking questions.

### 1. Project Overview
- Vision statement (2-3 sentences)
- Problem being solved and why it matters
- Target audience persona with demographics and behaviors
- How this solution differs from current alternatives

### 2. Core Features (Priority-Ordered)
For EACH core feature, provide:
- **Purpose**: What problem this feature solves
- **User Stories**: 2-3 user stories in "As a [user], I want [action], so that [benefit]" format
- **Functional Requirements**: Detailed bulleted list of what the feature must do
- **Acceptance Criteria**: Specific, testable conditions for completion
- **Edge Cases**: At least 2 edge cases and how to handle them

### 3. Complementary Features
For each complementary feature:
- **Purpose**: Why this feature enhances the product
- **Key Requirements**: 3-5 specific requirements
- **Priority Level**: Must-have, Should-have, or Nice-to-have

### 4. UX & Design Specifications
- **Theme & Layout**: Overall layout approach based on the {theme} theme
- **Color System**: Map each color in the palette ({color_str}) to specific UI elements (primary buttons, backgrounds, text, accents, etc.)
- **Typography**: Font recommendations, size hierarchy, weight usage
- **Component Patterns**: Key UI patterns (cards, modals, navigation, forms) consistent with {design_style} style
- **Responsive Behavior**: Breakpoints and layout adjustments for mobile, tablet, desktop
- Reference the design guidelines: {guidelines_str}

### 5. Technical Architecture
Use the Tech Stack determined in Phase 3 (Frontend: {tech_frontend}; Backend: {tech_backend}; Database: {tech_database}) as the foundation. Expand on each:
- **Frontend**: Framework, state management, routing, key libraries
- **Backend**: API framework, structure, key endpoints with methods and payloads
- **Database Schema**: Tables with columns, types, relationships, and indexes
- **Authentication & Authorization**: Auth flow, session management, role-based access
- **Third-Party Integrations**: Any external APIs or services needed

### 6. Implementation Roadmap
Provide 4-6 implementation phases, from initial scaffold to final polish. For each phase:
- **Goal**: One-sentence objective
- **Features to Build**: Which features are included
- **Technical Tasks**: Specific implementation tasks
- **Scope Boundaries**: What is explicitly NOT in this phase
- **Dependencies**: What must be completed before this phase

### 7. Security & Privacy
- Data protection measures
- Input validation and sanitization
- Authentication security
- Privacy considerations and data handling
- OWASP top-10 mitigations relevant to this app

### 8. Future Enhancements
- 5-8 post-MVP features that could be added later
- Brief description of each and why it was deferred

---

Write in clear, professional Markdown. Use headers, bullets, and bold text for scanability. Do NOT include a title heading — the system will add one."""

    return prompt


def generate_prd_content(prompt: str) -> str:
    """Generate PRD content via a single GPT-4o call."""
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert product manager and technical architect. Generate comprehensive, detailed PRD documents in Markdown format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=8000
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"PRD generation failed: {str(e)}")


def generate_section_content(prompt: str, max_tokens: int = 1000) -> str:
    """Generate a single PRD section via GPT-4o."""
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert product manager. Generate concise PRD sections in clean Markdown. Use only headings (##, ###, ####), bullet lists, and bold text. Never use tables, code blocks, or horizontal rules. Keep descriptions brief — no filler, no verbose schema definitions. Target agentic coding tools."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=max_tokens
    )
    return response.choices[0].message.content


def generate_section1_prompt(phase_summaries: Dict, project_name: str) -> str:
    """Build prompt for Section 1: Product Overview (uses Phase 1 ideation data)."""
    ideation = phase_summaries.get("1", {})
    if isinstance(ideation, str):
        ideation = json.loads(ideation)

    core_problem = ideation.get("core_problem", "Not specified")
    pain_point = ideation.get("pain_point", "Not specified")
    target_audience = ideation.get("target_audience", "Not specified")
    current_solutions = ideation.get("current_solutions", "Not specified")

    return f"""Generate **Section 1: Product Overview** for **{project_name}**. Keep it concise.

Context:
- **Core Problem:** {core_problem}
- **Pain Point:** {pain_point}
- **Target Audience:** {target_audience}
- **Current Solutions:** {current_solutions}

Write in Markdown:

### 1.1 One-liner & goal
- Single-sentence product description
- Primary problem it solves
- Key outcome for v1

### 1.2 Target users
- Primary persona (who, what they need, key context)

### 1.3 Scope & non-goals
- **In-scope:** 4-6 bullets
- **Out-of-scope:** 2-3 items deferred

Be specific. No filler. No tables or code blocks — use only headings, bullets, and bold."""


def generate_section2_prompt(phase_summaries: Dict, mindmap_data: Dict, project_name: str) -> str:
    """Build prompt for Section 2: System Map (uses Phase 1-3 data)."""
    ideation = phase_summaries.get("1", {})
    if isinstance(ideation, str):
        ideation = json.loads(ideation)
    features_summary = phase_summaries.get("2", {})
    if isinstance(features_summary, str):
        features_summary = json.loads(features_summary)
    design = phase_summaries.get("3", {})
    if isinstance(design, str):
        design = json.loads(design)

    # Build feature list
    feature_list = ""
    if isinstance(features_summary, dict) and "features" in features_summary:
        for f in features_summary["features"]:
            title = f.get("title", "")
            subs = f.get("subFeatures", [])
            feature_list += f"\n- **{title}**: {', '.join(subs[:3])}"
    elif isinstance(features_summary, list):
        for f in features_summary:
            title = f.get("title", str(f)) if isinstance(f, dict) else str(f)
            feature_list += f"\n- {title}"

    comp_features = design.get("complementary_features", [])
    comp_list = ", ".join(comp_features) if comp_features else "None"

    tech_stack = design.get("tech_stack", {}) or mindmap_data.get("tech_stack", {})
    if isinstance(tech_stack, str):
        tech_stack = json.loads(tech_stack)
    tech_frontend = ", ".join(tech_stack.get("frontend", [])) if isinstance(tech_stack, dict) else "React + Vite"
    tech_backend = ", ".join(tech_stack.get("backend", [])) if isinstance(tech_stack, dict) else "Supabase"
    tech_database = ", ".join(tech_stack.get("database", [])) if isinstance(tech_stack, dict) else "Supabase PostgreSQL"

    return f"""Generate **Section 2: System Map** for **{project_name}**. Keep it concise.

Context:
- **Core features:** {feature_list}
- **Complementary features:** {comp_list}
- **Tech stack:** Frontend: {tech_frontend}; Backend: {tech_backend}; Database: {tech_database}

Write in Markdown:

### 2.1 Architecture snapshot
- **Frontend:** Framework, key libraries, state management. Default to React + Supabase unless features require otherwise.
- **Backend:** How Supabase handles auth, database, storage. Only add extra services if needed.
- **Other services:** Any integrations the features imply (email, payments, etc.)

### 2.2 Data model overview
- List each table name with a one-line purpose (e.g., **profiles** — user profile data)
- Mention key relationships in plain text (e.g., "projects belong to profiles")
- No column definitions, no schema details, no code — just table names and purposes

Keep it concise. No tables or code blocks — use only headings, bullets, and bold."""


def generate_section3_prompt(phase_summaries: Dict, mindmap_data: Dict, project_name: str) -> str:
    """Build prompt for Section 3: Feature Specifications (uses Phase 1-3 data)."""
    ideation = phase_summaries.get("1", {})
    if isinstance(ideation, str):
        ideation = json.loads(ideation)
    features_summary = phase_summaries.get("2", {})
    if isinstance(features_summary, str):
        features_summary = json.loads(features_summary)
    design = phase_summaries.get("3", {})
    if isinstance(design, str):
        design = json.loads(design)

    core_problem = ideation.get("core_problem", "Not specified")
    target_audience = ideation.get("target_audience", "Not specified")

    # Build detailed feature list with user flows
    feature_list = ""
    if isinstance(features_summary, dict) and "features" in features_summary:
        for i, f in enumerate(features_summary["features"], 1):
            title = f.get("title", f"Feature {i}")
            subs = f.get("subFeatures", [])
            user_flow = f.get("userFlow", {})
            steps = user_flow.get("steps", []) if isinstance(user_flow, dict) else []

            feature_list += f"\n**Feature {i}: {title}**\n"
            for sub in subs:
                feature_list += f"  - {sub}\n"

            if steps:
                feature_list += f"\n  **User Flow:**\n"
                for step in steps:
                    actor = step.get("actor", "user") if isinstance(step, dict) else "user"
                    action = step.get("action", str(step)) if isinstance(step, dict) else str(step)
                    icon = "○" if actor == "user" else "◆"
                    feature_list += f"    {icon} {action}\n"

    comp_features = design.get("complementary_features", [])
    comp_list = "\n".join(f"- {cf}" for cf in comp_features) if comp_features else "None"

    tech_stack = design.get("tech_stack", {}) or mindmap_data.get("tech_stack", {})
    if isinstance(tech_stack, str):
        tech_stack = json.loads(tech_stack)
    tech_frontend = ", ".join(tech_stack.get("frontend", [])) if isinstance(tech_stack, dict) else "React"
    tech_backend = ", ".join(tech_stack.get("backend", [])) if isinstance(tech_stack, dict) else "Supabase"
    tech_database = ", ".join(tech_stack.get("database", [])) if isinstance(tech_stack, dict) else "Supabase PostgreSQL"

    return f"""Generate **Section 3: Feature Specifications** for **{project_name}**. Be concise — focus on what an AI coding agent needs to build each feature.

Context:
- **Core Problem:** {core_problem}
- **Target Audience:** {target_audience}
- **Tech Stack:** Frontend: {tech_frontend}; Backend: {tech_backend}; Database: {tech_database}

**Core Features:**
{feature_list}

**Complementary Features:**
{comp_list}

For EACH feature, use this structure:

### 3.N [Feature Name]
**Priority:** P0 (core) or P1 (complementary)

#### 3.N.1 User story
- 1-2 user stories ("As a [user], I want [action], so that [benefit]")

#### 3.N.2 User flow
- Step-by-step journey through this feature (if user flow data provided above, use it)
- Format: ○ for user actions, ◆ for system responses
- Example: ○ User clicks button → ◆ System shows modal → ○ User submits form → ◆ System saves data

#### 3.N.3 UI behavior
- Components/screens involved
- Key states: loading, success, error, empty

#### 3.N.4 Data & API (Supabase)
- Name the tables involved and key operations (create, read, update, delete)
- No code snippets, no query syntax — just plain English

#### 3.N.5 Acceptance criteria
- 3-5 testable bullet points (pass/fail)

Core features first (P0), then complementary (P1). Be specific but concise. No tables or code blocks — use only headings, bullets, and bold."""


def generate_section4_prompt(phase_summaries: Dict, mindmap_data: Dict, project_name: str) -> str:
    """Build prompt for Section 4: Execution Guidance for Agents (uses ALL phase data)."""
    design = phase_summaries.get("3", {})
    if isinstance(design, str):
        design = json.loads(design)

    tech_stack = design.get("tech_stack", {}) or mindmap_data.get("tech_stack", {})
    if isinstance(tech_stack, str):
        tech_stack = json.loads(tech_stack)
    tech_frontend = ", ".join(tech_stack.get("frontend", [])) if isinstance(tech_stack, dict) else "React + Vite"
    tech_backend = ", ".join(tech_stack.get("backend", [])) if isinstance(tech_stack, dict) else "Supabase"

    design_style = design.get("design_style", "Minimalist")
    theme = design.get("theme", "light")

    return f"""Generate **Section 4: Execution Guidance for Agents** for **{project_name}**. Keep it concise.

This instructs AI coding agents (Claude Code, Cursor) on HOW to build the project.

Tech Stack: Frontend: {tech_frontend}; Backend: {tech_backend}
Design: {design_style}, {theme} theme

Write in Markdown:

### 4.1 Implementation approach
- Build order: plan → implement → verify
- Each phase should produce a working increment
- Summarize plan before editing, summarize changes after

### 4.2 Code organization
- Frontend: `src/components/`, `src/pages/`, `src/hooks/`, `src/lib/`, `src/context/`
- Naming: PascalCase components, camelCase utils, Tailwind CSS utilities
- {design_style} design, {theme} theme — consistent spacing and color usage

### 4.3 Technical standards
- Tailwind CSS for all styling, semantic HTML, responsive design
- Supabase for auth, database, storage — use RLS policies
- Performance: avoid unnecessary re-renders, lazy load where appropriate

Be prescriptive. No tables or code blocks — use only headings, bullets, and bold."""


def generate_prd_sections(project_id: str, completed_phase: int):
    """Background task: pre-generate PRD sections after a phase completes."""
    try:
        project_result = supabase.table("projects").select("*").eq("id", project_id).execute()
        if not project_result.data:
            return
        project = project_result.data[0]

        phase_summaries = project.get("phase_summaries") or {}
        if isinstance(phase_summaries, str):
            phase_summaries = json.loads(phase_summaries)

        mindmap_data = project.get("mindmap_data") or {}
        if isinstance(mindmap_data, str):
            mindmap_data = json.loads(mindmap_data)

        project_name = project.get("name", "Untitled Project")

        prd_draft = project.get("prd_draft") or {}
        if isinstance(prd_draft, str):
            prd_draft = json.loads(prd_draft)
        if not isinstance(prd_draft, dict):
            prd_draft = {}
        if "sections" not in prd_draft:
            prd_draft["sections"] = {}
        if "generated_phases" not in prd_draft:
            prd_draft["generated_phases"] = []

        if completed_phase == 1:
            prompt = generate_section1_prompt(phase_summaries, project_name)
            content = generate_section_content(prompt, max_tokens=800)
            prd_draft["sections"]["1"] = content
            if 1 not in prd_draft["generated_phases"]:
                prd_draft["generated_phases"].append(1)

        elif completed_phase == 3:
            prompt2 = generate_section2_prompt(phase_summaries, mindmap_data, project_name)
            content2 = generate_section_content(prompt2, max_tokens=1000)
            prd_draft["sections"]["2"] = content2

            prompt3 = generate_section3_prompt(phase_summaries, mindmap_data, project_name)
            content3 = generate_section_content(prompt3, max_tokens=2500)
            prd_draft["sections"]["3"] = content3

            if 3 not in prd_draft["generated_phases"]:
                prd_draft["generated_phases"].append(3)

        prd_draft["last_updated"] = datetime.utcnow().isoformat()

        supabase.table("projects").update({
            "prd_draft": json.dumps(prd_draft)
        }).eq("id", project_id).execute()

        print(f"[Background PRD] Successfully generated sections for phase {completed_phase}, project {project_id}")

    except Exception as e:
        print(f"[Background PRD] Error generating sections for {project_id} (phase {completed_phase}): {e}")


def generate_tech_stack(phase_summaries: Dict, complementary_features: list, project_name: str, core_problem: str) -> Dict:
    """Generate a tech stack recommendation based on all features."""
    # Gather core features from Phase 2
    features_summary = phase_summaries.get("2", {})
    if isinstance(features_summary, str):
        features_summary = json.loads(features_summary)

    feature_list = ""
    if isinstance(features_summary, dict) and "features" in features_summary:
        for f in features_summary["features"]:
            title = f.get("title", "")
            subs = f.get("subFeatures", [])
            feature_list += f"\n- {title}: {', '.join(subs)}"
    elif isinstance(features_summary, list):
        for f in features_summary:
            title = f.get("title", str(f)) if isinstance(f, dict) else str(f)
            feature_list += f"\n- {title}"

    comp_list = "\n".join(f"- {cf}" for cf in complementary_features) if complementary_features else "None"

    prompt = f"""You are a senior technical architect. Based on the following product features, determine the right tech stack.

**Project:** {project_name}
**Core Problem:** {core_problem}

**Core Features:**
{feature_list}

**Complementary Features:**
{comp_list}

RULES:
- Default to React (with Vite) for frontend and Supabase (PostgreSQL + Auth + Realtime) for backend/database unless a feature genuinely requires something else.
- Each item should be a tech name with an optional brief qualifier (e.g. "Stripe — payment processing"). No version numbers.
- Keep each category to 3-5 items max.

Return JSON with exactly this shape:
{{"frontend": ["React", "Tailwind CSS", ...], "backend": ["Supabase Auth", "Supabase Realtime", ...], "database": ["PostgreSQL (via Supabase)", "Row Level Security", ...]}}"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a senior technical architect. Return ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=800,
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content.strip()
        result = json.loads(raw)
        # Validate structure
        if "frontend" in result and "backend" in result and "database" in result:
            return result
    except Exception:
        pass

    # Fallback
    return {
        "frontend": ["React", "Tailwind CSS", "React Router"],
        "backend": ["Supabase Auth", "Supabase Edge Functions", "REST API"],
        "database": ["PostgreSQL (via Supabase)", "Row Level Security"]
    }


async def handle_phase3(request: ChatRequest, project: Dict, chat_history: List[Dict], background_tasks: BackgroundTasks = None) -> Dict:
    """Deterministic step controller for Phase 3 (MindMapping as Guided Flow)"""
    project_id = request.project_id

    # Load existing mindmap_data
    mindmap_data = project.get("mindmap_data") or {}
    if isinstance(mindmap_data, str):
        mindmap_data = json.loads(mindmap_data)

    # Load phase summaries
    phase_summaries = project.get("phase_summaries") or {}
    if isinstance(phase_summaries, str):
        phase_summaries = json.loads(phase_summaries)

    # Helper: save user message
    def save_user_msg(content):
        supabase.table("messages").insert({
            "project_id": project_id,
            "role": "user",
            "content": content,
            "phase": 3,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

    # Helper: save assistant message (with optional metadata)
    def save_assistant_msg(content, metadata=None):
        msg_data = {
            "project_id": project_id,
            "role": "assistant",
            "content": content,
            "phase": 3,
            "created_at": datetime.utcnow().isoformat()
        }
        if metadata:
            msg_data["metadata"] = metadata
        supabase.table("messages").insert(msg_data).execute()

    # Helper: update mindmap_data
    def persist_mindmap(data):
        supabase.table("projects").update({
            "mindmap_data": json.dumps(data),
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

    step_data = request.step_data

    # === No step_data: init Phase 3 / Step 1 (complementary features) ===
    if not step_data:
        # Don't save the __init_phase_3__ sentinel as a visible user message
        if request.message and not request.message.startswith('__init'):
            save_user_msg(request.message)

        # Get features from phase_summaries["2"]
        features_summary = phase_summaries.get("2", {})
        feature_list = ""
        if isinstance(features_summary, dict) and "features" in features_summary:
            for f in features_summary["features"]:
                title = f.get("title", "")
                subs = ", ".join(f.get("subFeatures", []))
                feature_list += f"- {title}: {subs}\n"
        elif isinstance(features_summary, list):
            for f in features_summary:
                title = f.get("title", "") if isinstance(f, dict) else str(f)
                feature_list += f"- {title}\n"

        ideation = phase_summaries.get("1", {})
        target_audience = ideation.get("target_audience", "general users") if isinstance(ideation, dict) else "general users"
        core_problem = ideation.get("core_problem", "the stated problem") if isinstance(ideation, dict) else "the stated problem"
        project_name = project.get("name", "the app")

        prompt = f"""Given these core features for a {project_name} app:
{feature_list}

The target audience is: {target_audience}
The core problem is: {core_problem}

Suggest exactly 5 complementary features that would enhance this product.
These should be supporting features (not core), like analytics, notifications,
onboarding, settings, integrations, etc.

For each feature, provide a clear name and a brief 1-sentence description of what it does and why it matters.

Return as JSON: {{"features": ["Feature Name: One sentence explaining what this does and why it helps users", ...]}}"""

        ai_result = get_ai_json_response(prompt)
        features = []
        if ai_result and "features" in ai_result:
            features = ai_result["features"][:5]
        else:
            features = [
                "Analytics Dashboard: Track user behavior and engagement metrics",
                "Push Notifications: Keep users engaged with timely updates",
                "Onboarding Flow: Guide new users through key features",
                "Settings & Preferences: Let users customize their experience",
                "Third-party Integrations: Connect with popular tools and services"
            ]

        options = []
        for i, feat in enumerate(features):
            parts = feat.split(":", 1)
            label = parts[0].strip()
            desc = parts[1].strip() if len(parts) > 1 else ""
            options.append({"id": f"cf-{i+1}", "label": label, "description": desc})

        mindmap_data["step"] = 1
        persist_mindmap(mindmap_data)

        intro = "Let's enhance your product with some complementary features! I've analyzed your core features and have some suggestions."
        metadata = {
            "step": 1,
            "title": "Complementary Features",
            "description": "Select features that complement your core product:",
            "options": options,
            "allow_custom": True,
            "custom_placeholder": "Describe your feature idea...",
            "min_selections": 1,
            "max_selections": 5,
        }

        save_assistant_msg(intro, metadata)

        # Touch updated_at
        supabase.table("projects").update({
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

        return {
            "message": intro,
            "message_type": "multi_select",
            "metadata": metadata,
            "mindmap_step": 1,
            "canvas_updates": [],
        }

    # === Step 1 response: save complementary features, create canvas node, show Step 2 (theme) ===
    if step_data.get("step") == 1:
        selections = step_data.get("selections", [])
        save_user_msg(request.message)

        mindmap_data["complementary_features"] = selections
        mindmap_data["step"] = 2
        persist_mindmap(mindmap_data)

        # Build comp features canvas node
        canvas_state = json.loads(project["canvas_state"]) if project.get("canvas_state") else {"nodes": [], "edges": []}
        root_node = next((n for n in canvas_state["nodes"] if n["id"] == "root"), None)
        root_x = root_node["position"]["x"] if root_node else 400
        root_y = root_node["position"]["y"] if root_node else 300
        existing_feature_groups = [n for n in canvas_state["nodes"] if n.get("type") == "featureGroup"]
        col = len(existing_feature_groups)
        cf_x = root_x - 200 + col * 300
        cf_y = root_y + 180

        canvas_updates = [{
            "action": "add_node",
            "node": {
                "id": "complementary-features",
                "type": "complementaryFeatures",
                "position": {"x": cf_x, "y": cf_y},
                "data": {
                    "label": "Complementary Features",
                    "features": selections,
                },
                "parentId": "root"
            }
        }]

        # Save canvas update to DB
        if not any(n["id"] == "complementary-features" for n in canvas_state["nodes"]):
            canvas_state["nodes"].append({
                "id": "complementary-features",
                "type": "complementaryFeatures",
                "position": {"x": cf_x, "y": cf_y},
                "data": {
                    "label": "Complementary Features",
                    "features": selections,
                },
            })
            canvas_state["edges"].append({
                "id": "root-complementary-features",
                "source": "root",
                "target": "complementary-features",
                "sourceHandle": "bottom",
                "type": "smoothstep",
                "animated": False,
                "style": {"stroke": "#D6D3D1", "strokeWidth": 1.5}
            })

        intro = f"Great choices! You've selected {len(selections)} complementary feature{'s' if len(selections) != 1 else ''}. Now let's define the visual direction for your product."
        metadata = {
            "step": 2,
            "title": "Theme",
            "description": "Choose your app's theme:",
            "options": [
                {"id": "theme-light", "label": "Light", "description": "Clean, bright interface with white backgrounds and subtle shadows"},
                {"id": "theme-dark", "label": "Dark", "description": "Sleek, modern interface with dark backgrounds and vibrant accents"},
            ],
            "allow_custom": False,
        }

        save_assistant_msg(intro, metadata)

        supabase.table("projects").update({
            "canvas_state": json.dumps(canvas_state),
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

        return {
            "message": intro,
            "message_type": "single_select",
            "metadata": metadata,
            "mindmap_step": 2,
            "canvas_updates": canvas_updates,
        }

    # === Step 2 response: save theme, show Step 3 (color palette with web search) ===
    if step_data.get("step") == 2:
        selection = step_data.get("selection", "light")
        save_user_msg(request.message)

        mindmap_data["theme"] = selection
        mindmap_data["step"] = 3
        persist_mindmap(mindmap_data)

        project_name = project.get("name", "the app")
        ideation = phase_summaries.get("1", {})
        core_problem = ideation.get("core_problem", "") if isinstance(ideation, dict) else ""

        # Tavily search for color palette inspiration
        search_query = f"best color palettes for {project_name} app {selection} theme UI design 2025"
        search_results = web_search(search_query)

        prompt = f"""Based on this product:
- Name: {project_name}
- Problem: {core_problem}
- Theme: {selection}

Web research on trending palettes:
{search_results}

Generate exactly 3 color palettes, each with 4 hex colors:
- Primary (brand color), Secondary (accent), Background, Text

Return as JSON: {{"palettes": [
  {{"name": "Palette Name", "colors": ["#hex1", "#hex2", "#hex3", "#hex4"], "description": "Brief vibe description"}},
  ...
]}}"""

        ai_result = get_ai_json_response(prompt)
        palettes = []
        if ai_result and "palettes" in ai_result:
            palettes = ai_result["palettes"][:3]

        if len(palettes) < 3:
            palettes = [
                {"name": "Ocean Breeze", "colors": ["#0EA5E9", "#06B6D4", "#F0F9FF", "#0F172A"], "description": "Cool, calming blue tones for a trustworthy feel"},
                {"name": "Warm Sunset", "colors": ["#E8613C", "#D97706", "#FFF7F5", "#1C1917"], "description": "Warm, energetic tones that convey passion and creativity"},
                {"name": "Forest Calm", "colors": ["#059669", "#10B981", "#F0FDF4", "#1E293B"], "description": "Natural green palette for growth and stability"},
            ]

        options = []
        for i, p in enumerate(palettes):
            options.append({
                "id": f"palette-{i+1}",
                "label": p["name"],
                "description": p.get("description", ""),
                "colors": p["colors"],
            })

        intro = f"Beautiful! A {selection} theme it is. Now let's pick a color palette that defines your brand identity."
        metadata = {
            "step": 3,
            "title": "Color Palette",
            "description": "Choose your brand's color palette:",
            "options": options,
            "allow_custom": True,
            "custom_placeholder": "Enter 4 hex colors separated by commas (e.g. #E8613C, #D97706, #FFF7F5, #1C1917)",
        }

        save_assistant_msg(intro, metadata)

        supabase.table("projects").update({
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

        return {
            "message": intro,
            "message_type": "color_palette",
            "metadata": metadata,
            "mindmap_step": 3,
            "canvas_updates": [],
            "web_search_used": True,
        }

    # === Step 3 response: save palette, show Step 4 (design style) ===
    if step_data.get("step") == 3:
        selection = step_data.get("selection", {})
        save_user_msg(request.message)

        mindmap_data["palette"] = selection
        mindmap_data["step"] = 4
        persist_mindmap(mindmap_data)

        palette_name = selection.get("name", "Custom") if isinstance(selection, dict) else "Custom"
        theme = mindmap_data.get("theme", "light")
        project_name = project.get("name", "the app")

        prompt = f"""For a {theme}-themed {project_name} app with palette "{palette_name}",
suggest exactly 3 UI design styles that would work well.

IMPORTANT RULES:
- Use simple, everyday language — no design jargon. The user is a founder, not a designer.
- Each description must be exactly 1 short sentence (under 15 words).
- Describe how the app FEELS to use, not technical design terms.

Return as JSON: {{"styles": [
  {{"name": "Style Name", "description": "One short sentence about how the app feels"}},
  ...
]}}"""

        ai_result = get_ai_json_response(prompt)
        styles = []
        if ai_result and "styles" in ai_result:
            styles = ai_result["styles"][:3]

        if len(styles) < 3:
            styles = [
                {"name": "Minimalist", "description": "Clean and simple — only what you need, nothing extra."},
                {"name": "Bold & Modern", "description": "Strong colors and clear sections that feel confident and polished."},
                {"name": "Soft & Friendly", "description": "Rounded shapes and gentle tones that feel approachable and easy."},
            ]

        options = []
        for i, s in enumerate(styles):
            options.append({
                "id": f"style-{i+1}",
                "label": s["name"],
                "description": s.get("description", ""),
            })

        intro = f"Love the palette choice! Last decision — let's pick a design style that shapes how your interface feels."
        metadata = {
            "step": 4,
            "title": "Design Style",
            "description": "Choose your UI design style:",
            "options": options,
            "allow_custom": True,
            "custom_placeholder": "Describe your preferred design style...",
        }

        save_assistant_msg(intro, metadata)

        supabase.table("projects").update({
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

        return {
            "message": intro,
            "message_type": "single_select",
            "metadata": metadata,
            "mindmap_step": 4,
            "canvas_updates": [],
        }

    # === Step 4 response: save style, generate design guidelines + tech stack, create System Map node ===
    if step_data.get("step") == 4:
        selection = step_data.get("selection", "Minimalist")
        save_user_msg(request.message)

        mindmap_data["design_style"] = selection
        persist_mindmap(mindmap_data)

        comp_features = mindmap_data.get("complementary_features", [])
        theme = mindmap_data.get("theme", "light")
        palette = mindmap_data.get("palette", {})
        palette_name = palette.get("name", "Custom") if isinstance(palette, dict) else "Custom"
        design_style = selection
        project_name = project.get("name", "the app")

        # Generate design language entries via AI
        design_lang_prompt = f"""For a {project_name} app with:
- Theme: {theme}
- Color palette: {palette_name}
- Design style: {design_style}

Generate exactly 3 concise design language guidelines. Each should be a specific, actionable design decision.
Examples: "Typography: Use Inter font with bold headings and light body text for readability"
         "Layout: Card-based grid with generous padding between sections"
         "Interactions: Subtle fade transitions with micro-animations on buttons"

Keep each to 1 sentence. Use simple language.

Return as JSON: {{"guidelines": ["Guideline 1", "Guideline 2", "Guideline 3"]}}"""

        design_lang_result = get_ai_json_response(design_lang_prompt)
        design_guidelines = []
        if design_lang_result and "guidelines" in design_lang_result:
            design_guidelines = design_lang_result["guidelines"][:3]
        if len(design_guidelines) < 3:
            design_guidelines = [
                "Typography: Clean sans-serif font with clear size hierarchy for headings and body",
                "Layout: Card-based sections with consistent spacing and visual grouping",
                "Interactions: Smooth transitions and subtle hover effects for responsive feel"
            ]
        mindmap_data["design_guidelines"] = design_guidelines
        persist_mindmap(mindmap_data)

        # Generate tech stack
        ideation = phase_summaries.get("1", {})
        if isinstance(ideation, str):
            ideation = json.loads(ideation)
        core_problem = ideation.get("core_problem", "the stated problem") if isinstance(ideation, dict) else "the stated problem"

        tech_stack = generate_tech_stack(phase_summaries, comp_features, project_name, core_problem)
        mindmap_data["tech_stack"] = tech_stack
        mindmap_data["step"] = 5
        persist_mindmap(mindmap_data)

        # Create System Map canvas node — positioned directly above root
        canvas_state = json.loads(project["canvas_state"]) if project["canvas_state"] else {"nodes": [], "edges": []}
        root_node = next((n for n in canvas_state["nodes"] if n["id"] == "root"), None)
        root_x = root_node["position"]["x"] if root_node else 400
        root_y = root_node["position"]["y"] if root_node else 300

        sm_x = root_x
        sm_y = root_y - 520

        canvas_updates = [{
            "action": "add_node",
            "node": {
                "id": "system-map",
                "type": "systemMap",
                "position": {"x": sm_x, "y": sm_y},
                "data": {
                    "label": "System Map",
                    "frontend": tech_stack.get("frontend", []),
                    "backend": tech_stack.get("backend", []),
                    "database": tech_stack.get("database", []),
                },
                "parentId": "root"
            }
        }]

        # Persist System Map node to canvas_state in DB
        if not any(n["id"] == "system-map" for n in canvas_state["nodes"]):
            canvas_state["nodes"].append({
                "id": "system-map",
                "type": "systemMap",
                "position": {"x": sm_x, "y": sm_y},
                "data": {
                    "label": "System Map",
                    "frontend": tech_stack.get("frontend", []),
                    "backend": tech_stack.get("backend", []),
                    "database": tech_stack.get("database", []),
                },
            })
            canvas_state["edges"].append({
                "id": "root-system-map",
                "source": "root",
                "target": "system-map",
                "sourceHandle": "top",
                "targetHandle": "bottom",
                "type": "smoothstep",
                "animated": False,
                "style": {"stroke": "#D6D3D1", "strokeWidth": 1.5}
            })

        # Build chat message summarizing tech choices
        fe_str = ", ".join(tech_stack.get("frontend", []))
        be_str = ", ".join(tech_stack.get("backend", []))
        db_str = ", ".join(tech_stack.get("database", []))
        tech_msg = f"I've mapped out the tech stack for {project_name} based on your features:\n\n"
        tech_msg += f"**Frontend:** {fe_str}\n\n"
        tech_msg += f"**Backend:** {be_str}\n\n"
        tech_msg += f"**Database:** {db_str}\n\n"
        tech_msg += "I've added the System Map to your canvas."

        save_assistant_msg(tech_msg)

        supabase.table("projects").update({
            "canvas_state": json.dumps(canvas_state),
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

        # Background: pre-generate PRD Sections 2+3 (System Map + Feature Specs)
        # Triggered when tech stack node is created — runs while user finishes Phase 3
        if background_tasks:
            background_tasks.add_task(generate_prd_sections, project_id, 3)

        return {
            "message": tech_msg,
            "message_type": "text",
            "mindmap_step": 5,
            "canvas_updates": canvas_updates,
        }

    # === Step 5: auto-triggered — build summary, UI Design node, wait for user to advance ===
    if step_data.get("step") == 5:
        # Do NOT save a user message — this is auto-triggered

        comp_features = mindmap_data.get("complementary_features", [])
        theme = mindmap_data.get("theme", "light")
        palette = mindmap_data.get("palette", {})
        palette_name = palette.get("name", "Custom") if isinstance(palette, dict) else "Custom"
        palette_colors = palette.get("colors", []) if isinstance(palette, dict) else []
        design_style = mindmap_data.get("design_style", "Minimalist")
        design_guidelines = mindmap_data.get("design_guidelines", [])
        tech_stack = mindmap_data.get("tech_stack", {})
        project_name = project.get("name", "the app")

        summary = f"Your design blueprint is complete! Here's a summary:\n\n"
        summary += f"**Complementary Features:** {', '.join(comp_features)}\n\n"
        summary += f"**Theme:** {theme.capitalize()}\n\n"
        summary += f"**Color Palette:** {palette_name}\n\n"
        summary += f"**Design Style:** {design_style}\n\n"
        summary += "I've added these to your canvas. Click **Continue to PRD Generation** when you're ready!"

        # Build canvas updates — UI Design node
        canvas_state = json.loads(project["canvas_state"]) if project["canvas_state"] else {"nodes": [], "edges": []}
        root_node = next((n for n in canvas_state["nodes"] if n["id"] == "root"), None)
        root_x = root_node["position"]["x"] if root_node else 400
        root_y = root_node["position"]["y"] if root_node else 300

        canvas_updates = []

        # UI Design node — positioned to the LEFT of root
        ui_x = root_x - 385
        ui_y = root_y - 402

        canvas_updates.append({
            "action": "add_node",
            "node": {
                "id": "ui-design",
                "type": "uiDesign",
                "position": {"x": ui_x, "y": ui_y},
                "data": {
                    "label": "UI Design",
                    "theme": theme.capitalize(),
                    "paletteName": palette_name,
                    "colors": palette_colors,
                    "designStyle": design_style,
                    "designGuidelines": design_guidelines,
                },
                "parentId": "root"
            }
        })

        save_assistant_msg(summary)

        # Save phase summary (now includes tech_stack)
        phase_summaries["3"] = {
            "complementary_features": comp_features,
            "theme": theme,
            "palette": palette,
            "design_style": design_style,
            "design_guidelines": design_guidelines,
            "tech_stack": tech_stack,
        }

        # Apply canvas updates to canvas_state
        for update in canvas_updates:
            if update["action"] == "add_node":
                node = update["node"]
                if not any(n["id"] == node["id"] for n in canvas_state["nodes"]):
                    canvas_state["nodes"].append({
                        "id": node["id"],
                        "type": node["type"],
                        "position": node.get("position", {"x": 400, "y": 300}),
                        "data": node["data"],
                    })
                    if node.get("parentId"):
                        source_handle = "left" if node["id"] == "ui-design" else "bottom"
                        target_handle = "right" if node["id"] == "ui-design" else None
                        edge = {
                            "id": f"{node['parentId']}-{node['id']}",
                            "source": node["parentId"],
                            "target": node["id"],
                            "sourceHandle": source_handle,
                            "type": "smoothstep",
                            "animated": False,
                            "style": {"stroke": "#D6D3D1", "strokeWidth": 1.5}
                        }
                        if target_handle:
                            edge["targetHandle"] = target_handle
                        canvas_state["edges"].append(edge)

        # Save phase summary + canvas but do NOT advance phase — user clicks Continue
        supabase.table("projects").update({
            "phase_summaries": json.dumps(phase_summaries),
            "canvas_state": json.dumps(canvas_state),
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", project_id).execute()

        return {
            "message": summary,
            "message_type": "text",
            "mindmap_complete": True,
            "mindmap_step": 5,
            "canvas_updates": canvas_updates,
        }

    # Fallback
    return {"message": "Something went wrong. Please try again.", "canvas_updates": []}


# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/projects")
async def list_projects(user_id: str = Depends(get_current_user)):
    """List all projects for the authenticated user"""
    try:
        result = supabase.table("projects").select("id, name, phase, created_at, updated_at").eq("user_id", user_id).order("updated_at", desc=True).order("created_at", desc=True).execute()
        projects = result.data or []
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects")
async def create_project(project: ProjectCreate, user_id: str = Depends(get_current_user)):
    """Create a new project for the authenticated user"""
    try:
        project_id = str(uuid.uuid4())

        # Initialize project in Supabase with user_id
        result = supabase.table("projects").insert({
            "id": project_id,
            "name": project.name,
            "phase": 1,
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
            "canvas_state": json.dumps({
                "nodes": [
                    {
                        "id": "root",
                        "type": "root",
                        "position": {"x": 400, "y": 300},
                        "data": {"label": project.name}
                    }
                ],
                "edges": []
            })
        }).execute()

        return {"project_id": project_id, "name": project.name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str, user_id: str = Depends(get_current_user)):
    """Get project details with current-phase messages"""
    try:
        project = await verify_project_ownership(project_id, user_id)
        current_phase = project["phase"]

        # Get chat history for current phase only
        chat_result = supabase.table("messages").select("*").eq("project_id", project_id).eq("phase", current_phase).order("created_at").execute()
        messages = chat_result.data if chat_result.data else []

        return {
            "project": project,
            "messages": messages
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest, background_tasks: BackgroundTasks, user_id: str = Depends(get_current_user)):
    """Handle chat messages"""
    try:
        project = await verify_project_ownership(request.project_id, user_id)

        # Get chat history filtered by phase
        chat_result = supabase.table("messages").select("*").eq("project_id", request.project_id).eq("phase", request.phase).order("created_at").execute()
        chat_history = [{"role": msg["role"], "content": msg["content"]} for msg in (chat_result.data or [])]

        # Add user message to history
        chat_history.append({"role": "user", "content": request.message})

        # Save user message with phase
        # Phase 3 manages its own message saving in handle_phase3(),
        # so skip here to prevent duplicates and sentinel messages being persisted
        if request.phase != 3:
            supabase.table("messages").insert({
                "project_id": request.project_id,
                "role": "user",
                "content": request.message,
                "phase": request.phase,
                "created_at": datetime.utcnow().isoformat()
            }).execute()

        # Web search logic
        search_triggered = False

        # Explicit user search request
        if "research" in request.message.lower() or "search" in request.message.lower():
            search_results = web_search(request.message)
            context_note = f"\n\n[Web Search Results]:\n{search_results}"
            chat_history.append({"role": "system", "content": context_note})
            search_triggered = True

        # Phase 1: proactive competitor/market search when exploring current solutions
        if request.phase == 1 and not search_triggered:
            msg_count = len(chat_history)
            msg_lower = request.message.lower()
            # Trigger search when: 3+ exchanges in (likely past core problem/pain/audience),
            # OR user mentions competitors/solutions/alternatives/apps
            solution_keywords = ["competitor", "alternative", "existing", "solution", "app", "tool", "currently use", "don't know", "not sure", "no idea"]
            at_solutions_stage = msg_count >= 6  # at least 3 user-AI exchanges
            mentions_solutions = any(kw in msg_lower for kw in solution_keywords)
            if at_solutions_stage or mentions_solutions:
                # Count existing searches in this conversation to cap at 2
                existing_searches = sum(1 for m in chat_history if m.get("role") == "system" and "[Web Search Results]" in m.get("content", ""))
                if existing_searches < 2:
                    # Build a search query from the project name + first user message (the idea)
                    first_user_msg = next((m["content"] for m in chat_history if m["role"] == "user"), "")
                    search_query = f"competitors alternatives to {first_user_msg[:120]}"
                    search_results = web_search(search_query)
                    if search_results and "No results found" not in search_results:
                        context_note = f"\n\n[Web Search Results - Competitor Research]:\n{search_results}"
                        chat_history.append({"role": "system", "content": context_note})

        # Phase 2: proactive feature research when user asks for suggestions
        if request.phase == 2 and not search_triggered:
            msg_lower = request.message.lower()
            suggest_keywords = ["suggest", "recommend", "you suggest", "ai suggest", "your ideas", "what do you think", "help me"]
            wants_suggestions = any(kw in msg_lower for kw in suggest_keywords)
            if wants_suggestions:
                existing_searches = sum(1 for m in chat_history if m.get("role") == "system" and "[Web Search Results]" in m.get("content", ""))
                if existing_searches < 2:
                    # Use ideation context for targeted search
                    phase_summaries = project.get("phase_summaries") or {}
                    if isinstance(phase_summaries, str):
                        phase_summaries = json.loads(phase_summaries)
                    ideation = phase_summaries.get("1", {})
                    problem = ideation.get("core_problem", "") if isinstance(ideation, dict) else ""
                    audience = ideation.get("target_audience", "") if isinstance(ideation, dict) else ""
                    search_query = f"top features for {problem[:80]} app for {audience[:60]}"
                    search_results = web_search(search_query)
                    if search_results and "No results found" not in search_results:
                        context_note = f"\n\n[Web Search Results - Feature Research]:\n{search_results}"
                        chat_history.append({"role": "system", "content": context_note})

        # === Phase 4: Generation phase — no chat interaction ===
        if request.phase == 4:
            return {"message": "Phase 4 is a generation phase \u2014 your PRD is being created automatically.", "canvas_updates": []}

        # === Phase 3: Deterministic Step Controller ===
        if request.phase == 3:
            return await handle_phase3(request, project, chat_history, background_tasks)

        # Build project context
        project_context = {
            "phase": project["phase"],
            "canvas_state": json.loads(project["canvas_state"]) if project["canvas_state"] else None
        }

        # Inject phase summaries for phases > 1
        if request.phase > 1:
            phase_summaries = project.get("phase_summaries") or {}
            if isinstance(phase_summaries, str):
                phase_summaries = json.loads(phase_summaries)
            # Always inject the immediate previous phase summary
            prev_phase_key = str(request.phase - 1)
            if prev_phase_key in phase_summaries:
                project_context["previous_phase_summary"] = phase_summaries[prev_phase_key]
            # For Phase 3+, inject ALL prior phase summaries so AI has full context
            if request.phase >= 3:
                all_summaries = {}
                for k, v in phase_summaries.items():
                    if int(k) < request.phase:
                        all_summaries[k] = v
                if all_summaries:
                    project_context["all_phase_summaries"] = all_summaries

        ai_response = get_ai_response(chat_history, request.phase, project_context)

        # Check for canvas updates in AI response
        canvas_updates = []
        cleaned_response = ai_response

        VALID_NODE_TYPES = {'root', 'feature', 'tech', 'database', 'default', 'ideation', 'featureGroup', 'complementaryFeatures', 'uiDesign', 'systemMap', 'userFlow'}

        # Extract all canvas updates
        while "[UPDATE_CANVAS]" in cleaned_response:
            try:
                start = cleaned_response.index("[UPDATE_CANVAS]")
                end = cleaned_response.index("[/UPDATE_CANVAS]") + len("[/UPDATE_CANVAS]")
                canvas_json = cleaned_response[start+len("[UPDATE_CANVAS]"):end-len("[/UPDATE_CANVAS]")].strip()
                canvas_update = json.loads(canvas_json)

                # Validate and normalize node type
                if canvas_update.get('action') == 'add_node' and 'node' in canvas_update:
                    node = canvas_update['node']
                    node_id = node.get('id', '')
                    node_type = node.get('type', 'feature')
                    node_data = node.get('data', {})

                    # Force userFlow type for nodes that should be userFlow:
                    # 1. ID contains 'userflow' or 'flow' with parent feature (case-insensitive)
                    # 2. Has 'steps' in data (userFlow signature)
                    # 3. Has 'parentFeatureId' in data (userFlow signature)
                    # 4. Type is a case variation of 'userflow'
                    # 5. Label contains 'user flow' (case-insensitive)
                    # 6. Parent ID starts with 'feature-' (indicates this is a child of a feature)
                    node_label = node_data.get('label', '').lower()
                    parent_id = node.get('parentId', '')
                    is_userflow_node = (
                        'userflow' in node_id.lower() or
                        ('flow' in node_id.lower() and parent_id.startswith('feature-')) or
                        'steps' in node_data or
                        'parentFeatureId' in node_data or
                        node_type.lower().replace('_', '').replace('-', '') == 'userflow' or
                        'user flow' in node_label or
                        'userflow' in node_label
                    )

                    if is_userflow_node:
                        canvas_update['node']['type'] = 'userFlow'
                    elif node_type not in VALID_NODE_TYPES:
                        # Handle other case variations
                        node_type_lower = node_type.lower()
                        type_mapping = {
                            'featuregroup': 'featureGroup',
                            'complementaryfeatures': 'complementaryFeatures',
                            'uidesign': 'uiDesign',
                            'systemmap': 'systemMap',
                        }
                        canvas_update['node']['type'] = type_mapping.get(node_type_lower, 'feature')

                canvas_updates.append(canvas_update)

                # Remove this update from the response
                cleaned_response = cleaned_response[:start] + cleaned_response[end:]
            except (ValueError, json.JSONDecodeError):
                break

        # Phase 2 fallback: if AI said "Adding ... to your canvas" but didn't emit [UPDATE_CANVAS],
        # try to auto-generate canvas nodes from the response content.
        # Handles both single and multiple features in one response.
        if request.phase == 2 and len(canvas_updates) == 0 and "adding" in cleaned_response.lower() and "canvas" in cleaned_response.lower():
            try:
                import re
                # Find all bold titles that are standalone (feature headings, not inline sub-labels)
                # Pattern: **Title** at start of line or after newline, NOT preceded by "- "
                lines = cleaned_response.split('\n')
                features_parsed = []
                current_feature = None

                in_user_flow = False
                for line in lines:
                    stripped = line.strip()

                    # Check for a feature heading: bold text on its own (not a bullet sub-item)
                    heading_match = re.match(r'^\*\*([^*]+)\*\*\s*$', stripped)
                    # Also match numbered headings like "1. **Title**" or "**Title**"
                    if not heading_match:
                        heading_match = re.match(r'^\d+\.\s*\*\*([^*]+)\*\*\s*$', stripped)
                    if heading_match:
                        if current_feature and current_feature['subs']:
                            features_parsed.append(current_feature)
                        current_feature = {'title': heading_match.group(1).strip(), 'subs': [], 'userFlowSteps': []}
                        in_user_flow = False
                        continue

                    # Check for "User Flow:" section marker
                    if current_feature is not None and re.match(r'^(user\s*flow|user-flow):?\s*$', stripped, re.IGNORECASE):
                        in_user_flow = True
                        continue

                    # Check for sub-feature bullet or user flow step
                    if current_feature is not None:
                        # User flow steps (numbered or bulleted under User Flow section)
                        if in_user_flow:
                            step_match = re.match(r'^[-•*]?\s*(\d+\.)?\s*(.+)', stripped)
                            if step_match and step_match.group(2):
                                step_text = step_match.group(2).strip()
                                if step_text and len(step_text) > 3:  # Filter out empty/short lines
                                    # Determine actor based on keywords
                                    actor = 'system' if any(kw in step_text.lower() for kw in ['system', 'app', 'displays', 'shows', 'sends', 'updates', 'validates', 'filters', 'plays']) else 'user'
                                    current_feature['userFlowSteps'].append({'action': step_text, 'actor': actor})
                            continue

                        # Sub-feature bullets (not in user flow section)
                        sub_bold = re.match(r'^-\s+\*\*([^*]+)\*\*:\s*(.+)', stripped)
                        if sub_bold:
                            current_feature['subs'].append(f"{sub_bold.group(1).strip()}: {sub_bold.group(2).strip()}")
                            continue
                        sub_plain = re.match(r'^-\s+(.+)', stripped)
                        if sub_plain:
                            current_feature['subs'].append(sub_plain.group(1).strip())
                            continue

                # Don't forget the last feature
                if current_feature and current_feature['subs']:
                    features_parsed.append(current_feature)

                if features_parsed:
                    canvas_state_raw = project.get("canvas_state")
                    existing_canvas = json.loads(canvas_state_raw) if canvas_state_raw else {"nodes": [], "edges": []}
                    existing_feature_count = sum(1 for n in existing_canvas.get("nodes", []) if n.get("type") == "featureGroup")

                    for i, feat in enumerate(features_parsed):
                        feature_id = f"feature-{existing_feature_count + i + 1}"
                        canvas_updates.append({
                            "action": "add_node",
                            "node": {
                                "id": feature_id,
                                "type": "featureGroup",
                                "data": {
                                    "label": feat['title'],
                                    "subFeatures": feat['subs'][:4]
                                },
                                "parentId": "root"
                            }
                        })

                        # Also create userFlow node if we parsed user flow steps
                        user_flow_steps = feat.get('userFlowSteps', [])
                        if user_flow_steps and len(user_flow_steps) >= 2:
                            # Limit to 6 steps max
                            steps_to_use = user_flow_steps[:6]
                            canvas_updates.append({
                                "action": "add_node",
                                "node": {
                                    "id": f"userflow-{existing_feature_count + i + 1}",
                                    "type": "userFlow",
                                    "data": {
                                        "parentFeatureId": feature_id,
                                        "steps": steps_to_use
                                    },
                                    "parentId": feature_id
                                }
                            })
            except Exception:
                pass

        # Extract [IDEATION_COMPLETE] tag
        ideation_complete = False
        ideation_data = None
        if "[IDEATION_COMPLETE]" in cleaned_response:
            try:
                ic_start = cleaned_response.index("[IDEATION_COMPLETE]")
                ic_end = cleaned_response.index("[/IDEATION_COMPLETE]") + len("[/IDEATION_COMPLETE]")
                ic_json = cleaned_response[ic_start + len("[IDEATION_COMPLETE]"):ic_end - len("[/IDEATION_COMPLETE]")].strip()
                ideation_data = json.loads(ic_json)
                ideation_complete = True

                # Strip tag from response
                cleaned_response = cleaned_response[:ic_start] + cleaned_response[ic_end:]

                # Persist ideation_pillars to project for refresh recovery
                supabase.table("projects").update({
                    "ideation_pillars": json.dumps(ideation_data)
                }).eq("id", request.project_id).execute()
            except (ValueError, json.JSONDecodeError):
                pass

        # Extract [FEATURES_COMPLETE] tag
        features_complete = False
        feature_data = None
        if "[FEATURES_COMPLETE]" in cleaned_response:
            try:
                fc_start = cleaned_response.index("[FEATURES_COMPLETE]")
                fc_end = cleaned_response.index("[/FEATURES_COMPLETE]") + len("[/FEATURES_COMPLETE]")
                fc_json = cleaned_response[fc_start + len("[FEATURES_COMPLETE]"):fc_end - len("[/FEATURES_COMPLETE]")].strip()
                feature_data = json.loads(fc_json)
                features_complete = True
                cleaned_response = cleaned_response[:fc_start] + cleaned_response[fc_end:]
                # Persist for refresh recovery
                supabase.table("projects").update({
                    "feature_data": json.dumps(feature_data)
                }).eq("id", request.project_id).execute()
            except (ValueError, json.JSONDecodeError):
                pass

        # Clean up response
        ai_response = cleaned_response.strip()

        # Check for phase completion — Phase 1 and 2 skip auto-advance (use manual button)
        phase_complete = "[PHASE_COMPLETE]" in ai_response
        if phase_complete:
            ai_response = ai_response.replace("[PHASE_COMPLETE]", "").strip()
            if request.phase not in (1, 2, 3):
                # Auto-advance for phases 4+
                supabase.table("projects").update({"phase": project["phase"] + 1}).eq("id", request.project_id).execute()
            else:
                # Phase 1, 2 & 3: do NOT auto-advance via [PHASE_COMPLETE] tag
                phase_complete = False

        # Save AI message with phase
        supabase.table("messages").insert({
            "project_id": request.project_id,
            "role": "assistant",
            "content": ai_response,
            "phase": request.phase,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        # Touch updated_at on the project
        supabase.table("projects").update({
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", request.project_id).execute()

        response_data = {
            "message": ai_response,
            "phase_complete": phase_complete,
            "canvas_updates": canvas_updates
        }

        if ideation_complete:
            response_data["ideation_complete"] = True
            response_data["ideation_data"] = ideation_data

        if features_complete:
            response_data["features_complete"] = True
            response_data["feature_data"] = feature_data

        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects/{project_id}/advance-phase")
async def advance_phase(project_id: str, request: AdvancePhaseRequest, background_tasks: BackgroundTasks, user_id: str = Depends(get_current_user)):
    """Manually advance to the next phase (Phase 1->2 or Phase 2->3)"""
    try:
        project = await verify_project_ownership(project_id, user_id)

        if project["phase"] != request.current_phase:
            raise HTTPException(status_code=400, detail="Phase mismatch")

        phase_summaries = project.get("phase_summaries") or {}
        if isinstance(phase_summaries, str):
            phase_summaries = json.loads(phase_summaries)

        canvas_state = json.loads(project["canvas_state"]) if project["canvas_state"] else {"nodes": [], "edges": []}
        current = request.current_phase

        if current == 1:
            # Phase 1→2: Ideation to Feature Mapping
            ideation_data = request.ideation_data
            if not ideation_data and project.get("ideation_pillars"):
                stored = project["ideation_pillars"]
                ideation_data = json.loads(stored) if isinstance(stored, str) else stored

            phase_summaries["1"] = ideation_data

            # Find root node position
            root_node = next((n for n in canvas_state["nodes"] if n["id"] == "root"), None)
            root_x = root_node["position"]["x"] if root_node else 400
            root_y = root_node["position"]["y"] if root_node else 300

            # Add ideation node if not already present — positioned to the right of root
            if not any(n["id"] == "ideation" for n in canvas_state["nodes"]):
                canvas_state["nodes"].append({
                    "id": "ideation",
                    "type": "ideation",
                    "position": {"x": root_x + 318, "y": root_y - 264},
                    "data": {
                        "label": "Ideation",
                        "pillars": ideation_data or {}
                    }
                })
                canvas_state["edges"].append({
                    "id": "root-ideation",
                    "source": "root",
                    "target": "ideation",
                    "sourceHandle": "right",
                    "type": "smoothstep",
                    "animated": False,
                    "style": {"stroke": "#D6D3D1", "strokeWidth": 1.5}
                })

            # Create Phase 2 welcome message
            supabase.table("messages").insert({
                "project_id": project_id,
                "role": "assistant",
                "content": "Now that we've nailed down your idea, let's map out the core features. The goal is to identify 3-6 essential features that directly solve the problem for your target audience. We'll focus on what makes your product unique \u2014 not a kitchen sink of features.\n\nWould you like to propose your first core feature, or should I suggest some based on our ideation discussion?",
                "phase": current + 1,
                "created_at": datetime.utcnow().isoformat()
            }).execute()

            # Background: pre-generate PRD Section 1 (Product Overview) from ideation data
            background_tasks.add_task(generate_prd_sections, project_id, 1)

        elif current == 2:
            # Phase 2→3: Feature Mapping to MindMapping
            feature_data = request.ideation_data  # reuse field for feature data
            if not feature_data and project.get("feature_data"):
                stored = project["feature_data"]
                feature_data = json.loads(stored) if isinstance(stored, str) else stored

            # Extract userFlow data from canvas nodes and merge into feature_data
            if feature_data and isinstance(feature_data, dict) and "features" in feature_data:
                for node in canvas_state.get("nodes", []):
                    if node.get("type") == "userFlow":
                        node_data = node.get("data", {})
                        parent_feature_id = node_data.get("parentFeatureId", "")
                        steps = node_data.get("steps", [])
                        if parent_feature_id and steps:
                            # Extract feature index from parent_feature_id (e.g., "feature-1" -> 0)
                            try:
                                feature_idx = int(parent_feature_id.split("-")[1]) - 1
                                if 0 <= feature_idx < len(feature_data["features"]):
                                    feature_data["features"][feature_idx]["userFlow"] = {"steps": steps}
                            except (ValueError, IndexError):
                                pass

            phase_summaries["2"] = feature_data

            # Feature nodes should already be on canvas from UPDATE_CANVAS during chat
            # No new nodes to add here

            # Create Phase 3 welcome message — guided interactive flow
            supabase.table("messages").insert({
                "project_id": project_id,
                "role": "assistant",
                "content": "Welcome to Phase 3! Now we'll shape the design direction for your product. I'll walk you through a few quick decisions — complementary features, theme, colors, and design style.\n\nI'm generating a list of recommended complementary features for you now — please wait a moment.",
                "phase": current + 1,
                "created_at": datetime.utcnow().isoformat()
            }).execute()

        elif current == 3:
            # Phase 3→4: MindMapping to PRD Generation
            # phase_summaries["3"] is already saved by Step 5 handler
            supabase.table("messages").insert({
                "project_id": project_id,
                "role": "assistant",
                "content": "Welcome to Phase 4! I'm now generating your Product Requirements Document. This PRD is structured for agentic coding tools like Claude Code and Cursor \u2014 it defines your project scope, prioritizes features, incorporates your design choices, and breaks the build into clear phases.\n\nThis will take about a minute. Sit tight!",
                "phase": current + 1,
                "created_at": datetime.utcnow().isoformat()
            }).execute()

        elif current == 4:
            # Phase 4→5: PRD Generation to Export
            supabase.table("messages").insert({
                "project_id": project_id,
                "role": "assistant",
                "content": "Phase 5: Export. Your PRD is ready! You can download it from the Documents tab. Use the Markdown file to feed directly into Claude Code, Cursor, or any agentic coding tool.",
                "phase": current + 1,
                "created_at": datetime.utcnow().isoformat()
            }).execute()

        new_phase = current + 1

        # Update project
        supabase.table("projects").update({
            "phase": new_phase,
            "phase_summaries": json.dumps(phase_summaries),
            "canvas_state": json.dumps(canvas_state)
        }).eq("id", project_id).execute()

        return {
            "success": True,
            "new_phase": new_phase,
            "canvas_state": canvas_state
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects/{project_id}/generate-prd")
async def generate_prd(project_id: str, user_id: str = Depends(get_current_user)):
    """Assemble PRD from pre-generated sections + generate Section 4 at assembly time."""
    try:
        project = await verify_project_ownership(project_id, user_id)

        if project["phase"] != 4:
            raise HTTPException(status_code=400, detail="Project is not in Phase 4")

        # Idempotency: check if PRD already exists
        existing_docs = supabase.table("documents").select("*").eq("project_id", project_id).eq("doc_type", "prd").execute()
        if existing_docs.data and len(existing_docs.data) > 0:
            return {"status": "already_exists", "message": "PRD already generated", "document": existing_docs.data[0]}

        # Load project data
        phase_summaries = project.get("phase_summaries") or {}
        if isinstance(phase_summaries, str):
            phase_summaries = json.loads(phase_summaries)

        mindmap_data = project.get("mindmap_data") or {}
        if isinstance(mindmap_data, str):
            mindmap_data = json.loads(mindmap_data)

        project_name = project.get("name", "Untitled Project")

        # Load pre-generated sections from prd_draft
        prd_draft = project.get("prd_draft") or {}
        if isinstance(prd_draft, str):
            prd_draft = json.loads(prd_draft)
        sections = prd_draft.get("sections", {})

        # Fallback: generate any missing sections inline
        if "1" not in sections:
            print(f"[PRD Assembly] Section 1 missing for {project_id}, generating inline...")
            prompt = generate_section1_prompt(phase_summaries, project_name)
            sections["1"] = generate_section_content(prompt, max_tokens=800)

        if "2" not in sections:
            print(f"[PRD Assembly] Section 2 missing for {project_id}, generating inline...")
            prompt = generate_section2_prompt(phase_summaries, mindmap_data, project_name)
            sections["2"] = generate_section_content(prompt, max_tokens=1000)

        if "3" not in sections:
            print(f"[PRD Assembly] Section 3 missing for {project_id}, generating inline...")
            prompt = generate_section3_prompt(phase_summaries, mindmap_data, project_name)
            sections["3"] = generate_section_content(prompt, max_tokens=2500)

        # Always generate Section 4 at assembly time (needs full context)
        prompt4 = generate_section4_prompt(phase_summaries, mindmap_data, project_name)
        sections["4"] = generate_section_content(prompt4, max_tokens=800)

        # Assemble final document
        prd_content = "\n\n---\n\n".join([
            sections.get("1", ""),
            sections.get("2", ""),
            sections.get("3", ""),
            sections.get("4", ""),
        ])

        md_content = f"# {project_name} — Product Requirements Document\n\n{prd_content}"

        # Save markdown file
        os.makedirs("/tmp/documents", exist_ok=True)
        md_path = f"/tmp/documents/{project_id}_prd.md"
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md_content)

        # Attempt PDF generation (graceful fallback)
        pdf_path = None
        if WEASYPRINT_AVAILABLE:
            try:
                pdf_path = f"/tmp/documents/{project_id}_prd.pdf"
                generate_pdf_from_markdown(md_content, pdf_path)
            except Exception:
                pdf_path = None

        # Save document record
        doc_record = {
            "project_id": project_id,
            "doc_type": "prd",
            "md_path": md_path,
            "pdf_path": pdf_path,
            "created_at": datetime.utcnow().isoformat()
        }
        supabase.table("documents").insert(doc_record).execute()

        # Update prd_draft with all sections (including any newly generated fallbacks)
        prd_draft["sections"] = sections
        prd_draft["last_updated"] = datetime.utcnow().isoformat()
        supabase.table("projects").update({
            "prd_draft": json.dumps(prd_draft)
        }).eq("id", project_id).execute()

        # Insert completion message (for DB history — frontend shows PrdGenerationView, not this)
        completion_msg = "Your PRD has been generated successfully. You can view and download it from the Documents tab."
        supabase.table("messages").insert({
            "project_id": project_id,
            "role": "assistant",
            "content": completion_msg,
            "phase": 4,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"status": "generated", "message": completion_msg, "document": doc_record}

    except HTTPException:
        raise
    except Exception as e:
        # Insert error message into chat history
        try:
            supabase.table("messages").insert({
                "project_id": project_id,
                "role": "assistant",
                "content": f"Sorry, there was an error generating your PRD. Please try refreshing the page. Error: {str(e)[:200]}",
                "phase": 4,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/{project_id}/content")
async def get_document_content(project_id: str, user_id: str = Depends(get_current_user)):
    """Return PRD markdown content for in-app document preview."""
    try:
        await verify_project_ownership(project_id, user_id)

        docs = supabase.table("documents").select("*").eq("project_id", project_id).eq("doc_type", "prd").execute()
        if not docs.data:
            raise HTTPException(status_code=404, detail="No PRD document found")

        md_path = docs.data[0].get("md_path")
        if not md_path or not os.path.exists(md_path):
            raise HTTPException(status_code=404, detail="Document file not found")

        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()

        return {"content": content, "document": docs.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}/messages")
async def get_project_messages(project_id: str, phase: int = None, user_id: str = Depends(get_current_user)):
    """Get messages for a project, optionally filtered by phase"""
    try:
        await verify_project_ownership(project_id, user_id)
        query = supabase.table("messages").select("*").eq("project_id", project_id)
        if phase is not None:
            query = query.eq("phase", phase)
        result = query.order("created_at").execute()
        return {"messages": result.data or []}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, user_id: str = Depends(get_current_user)):
    """Delete a project and all its related data"""
    try:
        await verify_project_ownership(project_id, user_id)
        # Delete children first, parent last
        supabase.table("documents").delete().eq("project_id", project_id).execute()
        supabase.table("messages").delete().eq("project_id", project_id).execute()
        supabase.table("projects").delete().eq("id", project_id).execute()
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/canvas")
async def update_canvas(update: NodeUpdate, user_id: str = Depends(get_current_user)):
    """Update canvas state"""
    try:
        await verify_project_ownership(update.project_id, user_id)
        canvas_state = {
            "nodes": update.nodes,
            "edges": update.edges
        }

        supabase.table("projects").update({
            "canvas_state": json.dumps(canvas_state)
        }).eq("id", update.project_id).execute()

        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/canvas/{project_id}")
async def get_canvas(project_id: str, user_id: str = Depends(get_current_user)):
    """Get canvas state"""
    try:
        project = await verify_project_ownership(project_id, user_id)
        canvas_state = json.loads(project["canvas_state"]) if project["canvas_state"] else {"nodes": [], "edges": []}
        return canvas_state
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects/update-phase-data")
async def update_phase_data(update: PhaseDataUpdate, user_id: str = Depends(get_current_user)):
    """Update phase_summaries or mindmap_data when user edits node content"""
    try:
        project = await verify_project_ownership(update.project_id, user_id)

        if update.phase == 1:
            # Update ideation pillars in phase_summaries["1"]
            phase_summaries = project.get("phase_summaries") or {}
            if isinstance(phase_summaries, str):
                phase_summaries = json.loads(phase_summaries)

            if "1" not in phase_summaries:
                phase_summaries["1"] = {}

            phase_summaries["1"][update.field] = update.value

            # Also update ideation_pillars column for backup
            ideation_pillars = project.get("ideation_pillars") or {}
            if isinstance(ideation_pillars, str):
                ideation_pillars = json.loads(ideation_pillars)
            ideation_pillars[update.field] = update.value

            supabase.table("projects").update({
                "phase_summaries": json.dumps(phase_summaries),
                "ideation_pillars": json.dumps(ideation_pillars)
            }).eq("id", update.project_id).execute()

        elif update.phase == 2:
            # Update feature data in phase_summaries["2"]
            phase_summaries = project.get("phase_summaries") or {}
            if isinstance(phase_summaries, str):
                phase_summaries = json.loads(phase_summaries)

            if "2" not in phase_summaries:
                phase_summaries["2"] = {"features": []}

            # Find and update the feature by matching node_id pattern (feature-N)
            if update.node_id:
                features = phase_summaries["2"].get("features", [])
                # Extract feature index from node_id (e.g., "feature-1" -> 0, feature-2 -> 1)
                try:
                    feature_idx = int(update.node_id.split("-")[1]) - 1  # feature-1 = index 0
                    if 0 <= feature_idx < len(features):
                        # Check if this is a userFlow update or a regular feature update
                        if update.field == "userFlow" and update.value:
                            # Update userFlow data for the feature
                            features[feature_idx]["userFlow"] = update.value
                        elif update.node_data:
                            # Update the feature with new data
                            features[feature_idx] = {
                                "title": update.node_data.get("label", features[feature_idx].get("title", "")),
                                "subFeatures": update.node_data.get("subFeatures", features[feature_idx].get("subFeatures", [])),
                                "userFlow": features[feature_idx].get("userFlow", {})  # Preserve existing userFlow
                            }
                        phase_summaries["2"]["features"] = features
                except (ValueError, IndexError):
                    pass

            # Also update feature_data column for backup
            supabase.table("projects").update({
                "phase_summaries": json.dumps(phase_summaries),
                "feature_data": json.dumps(phase_summaries["2"])
            }).eq("id", update.project_id).execute()

        elif update.phase == 3:
            # Update mindmap_data and phase_summaries["3"]
            mindmap_data = project.get("mindmap_data") or {}
            if isinstance(mindmap_data, str):
                mindmap_data = json.loads(mindmap_data)

            phase_summaries = project.get("phase_summaries") or {}
            if isinstance(phase_summaries, str):
                phase_summaries = json.loads(phase_summaries)

            if "3" not in phase_summaries:
                phase_summaries["3"] = {}

            # Update the specific field
            mindmap_data[update.field] = update.value
            phase_summaries["3"][update.field] = update.value

            supabase.table("projects").update({
                "mindmap_data": json.dumps(mindmap_data),
                "phase_summaries": json.dumps(phase_summaries)
            }).eq("id", update.project_id).execute()

        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating phase data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/documents/generate")
async def generate_document(request: DocumentRequest, user_id: str = Depends(get_current_user)):
    """Generate document (MD and PDF)"""
    try:
        project = await verify_project_ownership(request.project_id, user_id)
        
        # Get chat history for context
        chat_result = supabase.table("messages").select("*").eq("project_id", request.project_id).order("created_at").execute()
        
        # Generate document content based on type
        if request.doc_type == "prd":
            # Generate full PRD
            messages = [{"role": "system", "content": "Generate a comprehensive PRD document based on all the information gathered."}]
            messages.extend([{"role": msg["role"], "content": msg["content"]} for msg in (chat_result.data or [])])
            
            content = get_ai_response(messages, 4, {"canvas_state": json.loads(project["canvas_state"])})
            title = f"{project['name']} - PRD"
        else:
            content = "Document generation in progress..."
            title = f"{project['name']} - {request.doc_type}"
        
        # Generate markdown
        md_content = generate_markdown_doc(content, title)
        
        # Save files
        os.makedirs("/tmp/documents", exist_ok=True)
        md_path = f"/tmp/documents/{request.project_id}_{request.doc_type}.md"
        pdf_path = f"/tmp/documents/{request.project_id}_{request.doc_type}.pdf"
        
        with open(md_path, "w") as f:
            f.write(md_content)
        
        generate_pdf_from_markdown(md_content, pdf_path)
        
        # Save to Supabase
        supabase.table("documents").insert({
            "project_id": request.project_id,
            "doc_type": request.doc_type,
            "md_path": md_path,
            "pdf_path": pdf_path,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        
        return {"md_path": md_path, "pdf_path": pdf_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/{project_id}")
async def get_documents(project_id: str, user_id: str = Depends(get_current_user)):
    """Get all documents for a project"""
    try:
        await verify_project_ownership(project_id, user_id)
        result = supabase.table("documents").select("*").eq("project_id", project_id).execute()
        return {"documents": result.data or []}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/download/{file_path:path}")
async def download_document(file_path: str):
    """Download a document (public — file paths are system-generated and only exposed via authenticated endpoints)"""
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

## ─── Account Management ─────────────────────────────────────────

@app.post("/api/account/delete-data")
async def delete_account_data(user_id: str = Depends(get_current_user)):
    """Delete all user data (projects, messages, documents) but keep the account."""
    try:
        # Get all user projects first
        projects_result = supabase.table("projects").select("id").eq("user_id", user_id).execute()
        project_ids = [p["id"] for p in (projects_result.data or [])]

        deleted_projects = 0
        deleted_messages = 0
        deleted_documents = 0

        # Delete children for each project, then the project itself
        for pid in project_ids:
            docs_result = supabase.table("documents").delete().eq("project_id", pid).execute()
            deleted_documents += len(docs_result.data or [])

            msgs_result = supabase.table("messages").delete().eq("project_id", pid).execute()
            deleted_messages += len(msgs_result.data or [])

            supabase.table("projects").delete().eq("id", pid).execute()
            deleted_projects += 1

        return {
            "success": True,
            "deleted": {
                "projects": deleted_projects,
                "messages": deleted_messages,
                "documents": deleted_documents,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/account/delete")
async def delete_account(user_id: str = Depends(get_current_user)):
    """Permanently delete user account and all associated data."""
    try:
        # Step 1: Delete all user data (same logic as delete-data)
        projects_result = supabase.table("projects").select("id").eq("user_id", user_id).execute()
        project_ids = [p["id"] for p in (projects_result.data or [])]

        for pid in project_ids:
            supabase.table("documents").delete().eq("project_id", pid).execute()
            supabase.table("messages").delete().eq("project_id", pid).execute()
            supabase.table("projects").delete().eq("id", pid).execute()

        # Step 2: Delete the auth user (requires service role key)
        supabase.auth.admin.delete_user(user_id)

        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

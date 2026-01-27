from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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
from weasyprint import HTML
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

# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    project_id: str
    message: str
    phase: int

class ProjectCreate(BaseModel):
    name: str

class NodeUpdate(BaseModel):
    project_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class DocumentRequest(BaseModel):
    project_id: str
    doc_type: str  # 'features', 'tech_stack', 'prd'

# Phase prompts
PHASE_PROMPTS = {
    1: """You are an experienced startup coach and technical expert with deep expertise in building successful products. You are warm, friendly, yet professional and goal-oriented.

Phase 1 (Ideation) - Your approach:
- Ask ONE thought-provoking question at a time
- Follow this flow: Core Problem → Main Pain Point → Target Audience → Current Solutions
- Probe deeply to invoke thinking and clarity
- Keep responses concise (2-3 sentences max) and digestible
- Challenge assumptions constructively but gently
- Never list multiple questions - focus on one pillar at a time
- Use natural conversation flow, not bullet points

When all 4 pillars are well understood, summarize concisely and say:
"Excellent! Your concept is clear and well-defined. Ready to move to Phase 2: Feature Mapping? We'll identify your core features and visualize them on a canvas."

Then add: [PHASE_COMPLETE]""",
    
    2: """You are an experienced startup coach and technical expert. Warm, professional, and goal-oriented.

Phase 2 (Feature Mapping):
- First ask: "Would you like to propose your core features, or should I suggest some based on our discussion?"
- If user proposes: Work with their suggestions, ask clarifying questions
- If AI suggests: Propose 2-4 features based on ideation insights

For each feature:
- Conduct competitor research (3-4 sentences with specific examples)
- Indicate uniqueness/differentiation clearly
- Ask ONE clarifying question about functionality per response
- Keep suggestions to max 4 items, condensed and actionable

When adding features to canvas:
[UPDATE_CANVAS]
{"action": "add_node", "node": {"id": "feature-X", "type": "feature", "data": {"label": "Feature Name", "description": "Brief description"}, "parentId": "root"}}
[/UPDATE_CANVAS]

Do NOT show UPDATE_CANVAS to user. Just say "Adding [Feature Name] to your canvas..."

After core features are defined, suggest complementary features (max 4, one sentence each).

Then: "Great! Your features are mapped. Ready for Phase 3: MindMapping? I'll organize everything into a structured visual framework."

Add: [PHASE_COMPLETE]""",
    
    3: """You are an experienced startup coach and technical expert. Phase 3 (MindMapping):

Your role:
- Analyze all defined features silently
- Create organized visual structure in canvas
- Do NOT output detailed tech stack to user
- Just say: "I'm organizing your features and creating a technical blueprint on the canvas. This will help visualize the implementation structure."

Create nodes for:
- Tech Stack (brief - just say "Adding tech stack node...")
- Database Requirements (brief - just say "Adding database architecture...")

Keep ALL responses short (2-3 sentences).

When complete: "Your feature map is ready! Shall we move to Phase 4: PRD Generation? I'll create a comprehensive implementation document."

Add: [PHASE_COMPLETE]""",
    
    4: """You are an experienced startup coach and technical expert creating a COMPREHENSIVE PRD.

Generate a detailed, functional PRD with:

## Overview (2-3 paragraphs)
- Problem statement
- Solution overview
- Target users

## Core Features (Detailed breakdown for EACH feature)
For each feature:
### [Feature Name]
**Purpose**: What problem it solves
**User Flow**: Step-by-step user journey
1. Step 1
2. Step 2
3. Step 3...

**Functional Requirements**:
- Requirement 1
- Requirement 2...

**Edge Cases**:
- Edge case 1 & handling
- Edge case 2 & handling

**Security Considerations**:
- Security aspect 1
- Security aspect 2

**Success Metrics**: How to measure success

## Technical Architecture
- Frontend approach
- Backend architecture
- Database schema (detailed with relationships)
- API endpoints needed
- Third-party integrations

## Implementation Phases
Phase 1: [What to build first]
Phase 2: [Next priority]
Phase 3: [Final features]

## Security & Privacy
- Data protection approach
- Authentication strategy
- Privacy considerations

## Future Enhancements
- Post-MVP features

Keep it structured, comprehensive, and actionable for developers.

After generating, say: "Your comprehensive PRD is ready. Moving to Phase 5: Export for document download."

Add: [PHASE_COMPLETE]""",
    
    5: """You are guiding the founder through Phase 5 (Export). Your role is to:
- Confirm PRD completion
- Provide instructions for downloading documents
- Explain how to import to Cursor or Claude Code
- List available documents: Feature docs, Tech stack docs, Complete PRD (all in MD/PDF)

Keep it brief and actionable."""
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

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    """Create a new project"""
    try:
        project_id = str(uuid.uuid4())
        
        # Initialize project in Supabase
        result = supabase.table("projects").insert({
            "id": project_id,
            "name": project.name,
            "phase": 1,
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
async def get_project(project_id: str):
    """Get project details"""
    try:
        result = supabase.table("projects").select("*").eq("id", project_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = result.data[0]
        
        # Get chat history
        chat_result = supabase.table("messages").select("*").eq("project_id", project_id).order("created_at").execute()
        messages = chat_result.data if chat_result.data else []
        
        return {
            "project": project,
            "messages": messages
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Handle chat messages"""
    try:
        # Get project context
        project_result = supabase.table("projects").select("*").eq("id", request.project_id).execute()
        if not project_result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = project_result.data[0]
        
        # Get chat history
        chat_result = supabase.table("messages").select("*").eq("project_id", request.project_id).order("created_at").execute()
        chat_history = [{"role": msg["role"], "content": msg["content"]} for msg in (chat_result.data or [])]
        
        # Add user message to history
        chat_history.append({"role": "user", "content": request.message})
        
        # Save user message
        supabase.table("messages").insert({
            "project_id": request.project_id,
            "role": "user",
            "content": request.message,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        
        # Check if message contains web search request
        if "research" in request.message.lower() or "search" in request.message.lower():
            search_results = web_search(request.message)
            context_note = f"\n\n[Web Search Results]:\n{search_results}"
            chat_history.append({"role": "system", "content": context_note})
        
        # Get AI response
        project_context = {
            "phase": project["phase"],
            "canvas_state": json.loads(project["canvas_state"]) if project["canvas_state"] else None
        }
        
        ai_response = get_ai_response(chat_history, request.phase, project_context)
        
        # Check for canvas updates in AI response
        canvas_updates = []
        cleaned_response = ai_response
        
        # Extract all canvas updates
        while "[UPDATE_CANVAS]" in cleaned_response:
            try:
                start = cleaned_response.index("[UPDATE_CANVAS]")
                end = cleaned_response.index("[/UPDATE_CANVAS]") + len("[/UPDATE_CANVAS]")
                canvas_json = cleaned_response[start+len("[UPDATE_CANVAS]"):end-len("[/UPDATE_CANVAS]")].strip()
                canvas_update = json.loads(canvas_json)
                canvas_updates.append(canvas_update)
                
                # Remove this update from the response
                cleaned_response = cleaned_response[:start] + cleaned_response[end:]
            except (ValueError, json.JSONDecodeError):
                break
        
        # Clean up response
        ai_response = cleaned_response.strip()
        
        # Check for phase completion
        phase_complete = "[PHASE_COMPLETE]" in ai_response
        if phase_complete:
            ai_response = ai_response.replace("[PHASE_COMPLETE]", "").strip()
            # Update project phase
            supabase.table("projects").update({"phase": project["phase"] + 1}).eq("id", request.project_id).execute()
        
        # Save AI message
        supabase.table("messages").insert({
            "project_id": request.project_id,
            "role": "assistant",
            "content": ai_response,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        
        return {
            "message": ai_response,
            "phase_complete": phase_complete,
            "canvas_updates": canvas_updates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/canvas")
async def update_canvas(update: NodeUpdate):
    """Update canvas state"""
    try:
        canvas_state = {
            "nodes": update.nodes,
            "edges": update.edges
        }
        
        supabase.table("projects").update({
            "canvas_state": json.dumps(canvas_state)
        }).eq("id", update.project_id).execute()
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/canvas/{project_id}")
async def get_canvas(project_id: str):
    """Get canvas state"""
    try:
        result = supabase.table("projects").select("canvas_state").eq("id", project_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        canvas_state = json.loads(result.data[0]["canvas_state"]) if result.data[0]["canvas_state"] else {"nodes": [], "edges": []}
        return canvas_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/documents/generate")
async def generate_document(request: DocumentRequest):
    """Generate document (MD and PDF)"""
    try:
        # Get project data
        project_result = supabase.table("projects").select("*").eq("id", request.project_id).execute()
        if not project_result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = project_result.data[0]
        
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
async def get_documents(project_id: str):
    """Get all documents for a project"""
    try:
        result = supabase.table("documents").select("*").eq("project_id", project_id).execute()
        return {"documents": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/download/{file_path:path}")
async def download_document(file_path: str):
    """Download a document"""
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

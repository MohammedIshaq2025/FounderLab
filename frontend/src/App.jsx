import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from './components/ChatInterface';
import CanvasView from './components/CanvasView';
import Sidebar from './components/Sidebar';
import PhaseIndicator from './components/PhaseIndicator';
import StartScreen from './components/StartScreen';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [phase, setPhase] = useState(1);
  const [messages, setMessages] = useState([]);
  const [canvasState, setCanvasState] = useState({ nodes: [], edges: [] });
  const [showCanvas, setShowCanvas] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load project data
  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/${projectId}`);
      const { project, messages: projectMessages } = response.data;
      
      setProjectName(project.name);
      setPhase(project.phase);
      
      // Only update messages if there are messages from backend
      if (projectMessages && projectMessages.length > 0) {
        setMessages(projectMessages);
      }
      
      if (project.canvas_state) {
        const canvas = JSON.parse(project.canvas_state);
        setCanvasState(canvas);
      }
      
      // Show canvas from phase 2 onwards
      if (project.phase >= 2) {
        setShowCanvas(true);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const createProject = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects`, { name });
      const newProjectId = response.data.project_id;
      
      setProjectId(newProjectId);
      setProjectName(name);
      setPhase(1);
      
      // Set initial welcome message in state
      const welcomeMessage = {
        role: 'assistant',
        content: `Welcome to FounderLab! I'm here to help you transform your idea into a polished PRD. Let's start with Phase 1: Ideation.\n\nTell me, what problem are you trying to solve?`,
        created_at: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const sendMessage = async (message) => {
    try {
      // Add user message immediately
      const userMessage = {
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to backend
      const response = await axios.post(`${API_URL}/api/chat`, {
        project_id: projectId,
        message,
        phase
      });

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Handle phase completion
      if (response.data.phase_complete) {
        const newPhase = phase + 1;
        setPhase(newPhase);
        
        // Show canvas from phase 2
        if (newPhase === 2) {
          setShowCanvas(true);
        }
      }

      // Handle canvas update
      if (response.data.canvas_update) {
        updateCanvas(response.data.canvas_update);
      }

      // Reload project to get updated canvas state
      await loadProject();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        created_at: new Date().toISOString()
      }]);
    }
  };

  const updateCanvas = async (update) => {
    try {
      let newNodes = [...canvasState.nodes];
      let newEdges = [...canvasState.edges];

      if (update.action === 'add_node') {
        const node = update.node;
        // Auto-position new nodes
        const parentNode = newNodes.find(n => n.id === node.parentId);
        const position = parentNode 
          ? { x: parentNode.position.x + 250, y: parentNode.position.y + 100 }
          : { x: 400, y: 300 };

        newNodes.push({
          id: node.id,
          type: node.type || 'default',
          position,
          data: node.data
        });

        // Add edge to parent
        if (node.parentId) {
          newEdges.push({
            id: `${node.parentId}-${node.id}`,
            source: node.parentId,
            target: node.id,
            type: 'smoothstep',
            animated: false,
            style: { strokeDasharray: '5 5', stroke: '#94a3b8' }
          });
        }
      }

      const newCanvasState = { nodes: newNodes, edges: newEdges };
      setCanvasState(newCanvasState);

      // Save to backend
      await axios.post(`${API_URL}/api/canvas`, {
        project_id: projectId,
        nodes: newNodes,
        edges: newEdges
      });
    } catch (error) {
      console.error('Error updating canvas:', error);
    }
  };

  if (!projectId) {
    return <StartScreen onCreateProject={createProject} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">FounderLab</h1>
          <div className="text-sm text-gray-500">
            {projectName}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <PhaseIndicator phase={phase} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Files
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        <div className={`${showCanvas ? 'w-1/2 border-r border-gray-200' : 'w-full'} flex flex-col`}>
          <ChatInterface 
            messages={messages} 
            onSendMessage={sendMessage}
            phase={phase}
          />
        </div>

        {/* Canvas */}
        {showCanvas && (
          <div className="w-1/2 bg-white">
            <CanvasView 
              nodes={canvasState.nodes}
              edges={canvasState.edges}
              onNodesChange={(nodes) => setCanvasState(prev => ({ ...prev, nodes }))}
              onEdgesChange={(edges) => setCanvasState(prev => ({ ...prev, edges }))}
            />
          </div>
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar 
            projectId={projectId} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;

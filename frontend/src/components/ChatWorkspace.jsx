import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatInterface from './ChatInterface';
import CanvasView from './CanvasView';
import Sidebar from './WorkspaceSidebar';
import ProgressBar from './ProgressBar';
import { Home, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

function ChatWorkspace({ projects, onUpdateProject }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [projectName, setProjectName] = useState('');
  const [phase, setPhase] = useState(1);
  const [messages, setMessages] = useState([]);
  const [canvasState, setCanvasState] = useState({ nodes: [], edges: [] });
  const [showCanvas, setShowCanvas] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

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
      
      // Load messages from backend or use welcome message
      if (projectMessages && projectMessages.length > 0) {
        setMessages(projectMessages);
      } else {
        // Set welcome message for new projects
        const welcomeMessage = {
          role: 'assistant',
          content: `Welcome to FounderLab! I'm here to help you transform your idea into a polished PRD. Let's start with Phase 1: Ideation.\n\nTell me, what problem are you trying to solve?`,
          created_at: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
      
      if (project.canvas_state) {
        const canvas = JSON.parse(project.canvas_state);
        setCanvasState(canvas);
      }
      
      // Show canvas from phase 2 onwards
      if (project.phase >= 2) {
        setShowCanvas(true);
      }
      
      // Update project metadata
      onUpdateProject(projectId, { phase: project.phase });
    } catch (error) {
      console.error('Error loading project:', error);
      // If project doesn't exist in backend, create it
      if (error.response?.status === 404) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          const welcomeMessage = {
            role: 'assistant',
            content: `Welcome to FounderLab! I'm here to help you transform your idea into a polished PRD. Let's start with Phase 1: Ideation.\n\nTell me, what problem are you trying to solve?`,
            created_at: new Date().toISOString()
          };
          setMessages([welcomeMessage]);
          setProjectName(project.name);
        }
      }
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
        onUpdateProject(projectId, { phase: newPhase });
        
        // Show canvas from phase 2
        if (newPhase === 2) {
          setShowCanvas(true);
        }
      }

      // Handle canvas update
      if (response.data.canvas_update) {
        updateCanvas(response.data.canvas_update);
      }

      // Reload project to get updated state
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

        if (node.parentId) {
          newEdges.push({
            id: `${node.parentId}-${node.id}`,
            source: node.parentId,
            target: node.id,
            type: 'smoothstep',
            animated: false,
            style: { strokeDasharray: '5 5', stroke: '#5b0e14' }
          });
        }
      }

      const newCanvasState = { nodes: newNodes, edges: newEdges };
      setCanvasState(newCanvasState);

      await axios.post(`${API_URL}/api/canvas`, {
        project_id: projectId,
        nodes: newNodes,
        edges: newEdges
      });
    } catch (error) {
      console.error('Error updating canvas:', error);
    }
  };

  return (
    <div className=\"h-screen flex bg-gray-50\">
      {/* Minimal Sidebar */}
      <Sidebar 
        onNavigateHome={() => navigate('/')}
        onToggleFiles={() => setShowFiles(!showFiles)}
        showFiles={showFiles}
        projectId={projectId}
      />

      {/* Main Workspace */}
      <div className=\"flex-1 flex flex-col overflow-hidden\">
        {/* Progress Bar */}
        <ProgressBar phase={phase} projectName={projectName} />

        {/* Content Area */}
        <div className=\"flex-1 flex overflow-hidden\">
          {/* Chat Interface */}
          <div className={`${showCanvas ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
            <ChatInterface 
              messages={messages} 
              onSendMessage={sendMessage}
              phase={phase}
            />
          </div>

          {/* Canvas */}
          {showCanvas && (
            <div className=\"w-1/2 bg-white\">
              <CanvasView 
                nodes={canvasState.nodes}
                edges={canvasState.edges}
                onNodesChange={(nodes) => setCanvasState(prev => ({ ...prev, nodes }))}
                onEdgesChange={(edges) => setCanvasState(prev => ({ ...prev, edges }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWorkspace;

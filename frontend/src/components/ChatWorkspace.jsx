import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import ChatInterface from './ChatInterface';
import CanvasView from './CanvasView';
import WorkspaceSidebar from './WorkspaceSidebar';
import ProgressBar from './ProgressBar';

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
      
      if (projectMessages && projectMessages.length > 0) {
        setMessages(projectMessages);
      } else {
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
      
      if (project.phase >= 2) {
        setShowCanvas(true);
      }
      
      onUpdateProject(projectId, { phase: project.phase });
    } catch (error) {
      console.error('Error loading project:', error);
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
      const userMessage = {
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await axios.post(`${API_URL}/api/chat`, {
        project_id: projectId,
        message,
        phase
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      if (response.data.phase_complete) {
        const newPhase = phase + 1;
        setPhase(newPhase);
        onUpdateProject(projectId, { phase: newPhase });
        
        if (newPhase === 2) {
          setShowCanvas(true);
        }
      }

      // Handle canvas updates
      if (response.data.canvas_updates && response.data.canvas_updates.length > 0) {
        for (const update of response.data.canvas_updates) {
          await updateCanvas(update);
        }
      }

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
    <div className="h-screen flex bg-gray-50">
      {/* Minimal Sidebar */}
      <WorkspaceSidebar 
        onNavigateHome={() => navigate('/')}
        onToggleFiles={() => setShowFiles(!showFiles)}
        showFiles={showFiles}
        projectId={projectId}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Progress Bar */}
        <ProgressBar phase={phase} projectName={projectName} />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Chat Interface */}
            <Panel defaultSize={showCanvas ? 30 : 100} minSize={20}>
              <div className="h-full border-r border-gray-200">
                <ChatInterface 
                  messages={messages} 
                  onSendMessage={sendMessage}
                  phase={phase}
                />
              </div>
            </Panel>

            {/* Resize Handle */}
            {showCanvas && (
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-[#5b0e14] transition-colors" />
            )}

            {/* Canvas */}
            {showCanvas && (
              <Panel defaultSize={70} minSize={30}>
                <div className="h-full bg-white">
                  <CanvasView 
                    nodes={canvasState.nodes}
                    edges={canvasState.edges}
                    onNodesChange={(nodes) => setCanvasState(prev => ({ ...prev, nodes }))}
                    onEdgesChange={(edges) => setCanvasState(prev => ({ ...prev, edges }))}
                  />
                </div>
              </Panel>
            )}
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default ChatWorkspace;

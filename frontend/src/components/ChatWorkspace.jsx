import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        try {
          const canvas = JSON.parse(project.canvas_state);
          console.log('Loading canvas state:', canvas);
          setCanvasState(canvas);
        } catch (e) {
          console.error('Error parsing canvas state:', e);
        }
      } else {
        console.log('No canvas state found');
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
        
        // Clear messages for new phase - show fresh start message
        setTimeout(() => {
          const phaseMessages = {
            2: 'Phase 2: Feature Mapping. Would you like to propose your core features, or should I suggest some based on our discussion?',
            3: 'Phase 3: MindMapping. Organizing your features into a structured framework on the canvas...',
            4: 'Phase 4: PRD Generation. Creating your comprehensive PRD document...',
            5: 'Phase 5: Export. Your PRD is ready! You can download it from the Files tab.'
          };
          
          setMessages([{
            role: 'assistant',
            content: phaseMessages[newPhase] || 'Starting new phase...',
            created_at: new Date().toISOString()
          }]);
        }, 500);
      }

      if (response.data.canvas_updates && response.data.canvas_updates.length > 0) {
        console.log('Received canvas updates:', response.data.canvas_updates);
        for (const update of response.data.canvas_updates) {
          await updateCanvas(update);
        }
        // Reload to get updated canvas state
        setTimeout(() => loadProject(), 500);
      }
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
      console.log('Updating canvas with:', update);
      let newNodes = [...canvasState.nodes];
      let newEdges = [...canvasState.edges];

      if (update.action === 'add_node') {
        const node = update.node;
        
        // Check if node already exists
        const existingNode = newNodes.find(n => n.id === node.id);
        if (existingNode) {
          console.log('Node already exists:', node.id);
          return;
        }
        
        const parentNode = newNodes.find(n => n.id === node.parentId);
        const position = parentNode 
          ? { x: parentNode.position.x + 250, y: parentNode.position.y + 100 }
          : { x: 400, y: 300 };

        const newNode = {
          id: node.id,
          type: node.type || 'feature',
          position,
          data: node.data
        };
        
        newNodes.push(newNode);
        console.log('Added new node:', newNode);

        if (node.parentId) {
          const newEdge = {
            id: `${node.parentId}-${node.id}`,
            source: node.parentId,
            target: node.id,
            type: 'smoothstep',
            animated: false,
            style: { strokeDasharray: '5 5', stroke: '#5b0e14' }
          };
          newEdges.push(newEdge);
          console.log('Added new edge:', newEdge);
        }
      }

      const newCanvasState = { nodes: newNodes, edges: newEdges };
      setCanvasState(newCanvasState);

      // Save to backend
      const saveResponse = await axios.post(`${API_URL}/api/canvas`, {
        project_id: projectId,
        nodes: newNodes,
        edges: newEdges
      });
      
      console.log('Canvas saved to backend:', saveResponse.data);
    } catch (error) {
      console.error('Error updating canvas:', error);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <WorkspaceSidebar 
        onNavigateHome={() => navigate('/')}
        onToggleFiles={() => setShowFiles(!showFiles)}
        showFiles={showFiles}
        projectId={projectId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ProgressBar phase={phase} projectName={projectName} />

        <div className="flex-1 flex overflow-hidden">
          <div 
            className="border-r border-gray-200 transition-all duration-300"
            style={{ width: showCanvas ? '30%' : '100%' }}
          >
            <ChatInterface 
              messages={messages} 
              onSendMessage={sendMessage}
              phase={phase}
            />
          </div>

          {showCanvas && (
            <div className="flex-1 bg-white">
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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import ChatInterface from './ChatInterface';
import CanvasView from './CanvasView';
import DocumentsPanel from './DocumentsPanel';
import PrdGenerationView from './PrdGenerationView';
import DocumentPreview from './DocumentPreview';
import { ArrowLeft, FileText, Check, Lightbulb, GitBranch, Network, FileText as FileTextIcon, Download, MessageSquare, File, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function ChatWorkspace({ projects, onUpdateProject }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const accountRef = useRef(null);

  const [projectName, setProjectName] = useState('');
  const [phase, setPhase] = useState(1);
  const [messages, setMessages] = useState([]);
  const [canvasState, setCanvasState] = useState({ nodes: [], edges: [] });
  const [activeTab, setActiveTab] = useState('chat');
  const [phaseTransition, setPhaseTransition] = useState(null);

  // Phase viewing state
  const [viewingPhase, setViewingPhase] = useState(null);
  const [phaseMessages, setPhaseMessages] = useState({});

  // Ideation state
  const [ideationComplete, setIdeationComplete] = useState(false);
  const [ideationData, setIdeationData] = useState(null);
  const [isContinueLoading, setIsContinueLoading] = useState(false);

  // Feature Mapping state
  const [featuresComplete, setFeaturesComplete] = useState(false);
  const [featureData, setFeatureData] = useState(null);

  // Phase 3 MindMapping state
  const [mindmapStep, setMindmapStep] = useState(0);
  const [mindmapData, setMindmapData] = useState(null);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [isWebSearching, setIsWebSearching] = useState(false);

  // Phase 3 MindMapping complete state (user must click Continue)
  const [mindmapComplete, setMindmapComplete] = useState(false);

  // Phase 4 PRD Generation state
  const [isPrdGenerating, setIsPrdGenerating] = useState(false);
  const [prdGenerated, setPrdGenerated] = useState(false);

  // Document preview state
  const [documentContent, setDocumentContent] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);

  const isInitialLoad = useRef(true);
  const saveTimer = useRef(null);
  const canvasRef = useRef(canvasState);
  const projectIdRef = useRef(projectId);

  useEffect(() => { canvasRef.current = canvasState; }, [canvasState]);
  useEffect(() => { projectIdRef.current = projectId; }, [projectId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountPopup(false);
      }
    };
    if (showAccountPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountPopup]);

  // Load document content when toggling to Documents tab with a generated PRD
  useEffect(() => {
    if (activeTab === 'documents' && prdGenerated && !documentContent && !documentLoading) {
      loadDocumentContent();
    }
  }, [activeTab, prdGenerated, documentContent, documentLoading]);

  useEffect(() => {
    if (projectId) {
      isInitialLoad.current = true;
      // Clear document preview state on project switch
      setDocumentContent(null);
      setDocumentData(null);
      setActiveTab('chat');
      loadProject();
    }
  }, [projectId]);

  // Debounced canvas save
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      if (canvasState.nodes.length > 0) {
        api.post('/api/canvas', {
          project_id: projectId,
          nodes: canvasState.nodes,
          edges: canvasState.edges,
        }).catch((err) => console.error('Error saving canvas:', err));
      }
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [canvasState, projectId]);

  // Flush pending canvas save on unmount so dragged positions aren't lost
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      const canvas = canvasRef.current;
      const pid = projectIdRef.current;
      if (canvas && canvas.nodes.length > 0 && pid) {
        api.post('/api/canvas', {
          project_id: pid,
          nodes: canvas.nodes,
          edges: canvas.edges,
        }).catch(() => {});
      }
    };
  }, []);

  const loadProject = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      const { project, messages: projectMessages } = response.data;

      setProjectName(project.name);
      setPhase(project.phase);

      if (projectMessages && projectMessages.length > 0) {
        setMessages(projectMessages);
      } else {
        // Phase-aware welcome message when no messages exist for current phase
        const welcomeMessages = {
          1: "Welcome to FounderLab! I'm here to help you transform your idea into a polished PRD. Let's start with Phase 1: Ideation.\n\nTell me, what problem are you trying to solve?",
          2: 'Phase 2: Feature Mapping. Would you like to propose your core features, or should I suggest some based on our discussion?',
          3: "Welcome to Phase 3! Now we'll shape the design direction for your product. Let's get started!",
          4: 'Phase 4: PRD Generation. Creating your comprehensive PRD document...',
          5: "Phase 5: Export. Your PRD is ready! You can download it from the Documents panel.",
        };
        setMessages([
          {
            role: 'assistant',
            content: welcomeMessages[project.phase] || welcomeMessages[1],
            created_at: new Date().toISOString(),
          },
        ]);
      }

      if (project.canvas_state) {
        try {
          const canvas = JSON.parse(project.canvas_state);
          setCanvasState(canvas);
        } catch (e) {
          console.error('Error parsing canvas state:', e);
        }
      }

      // Check if ideation_pillars exist and phase is 1 — show Continue button on refresh
      if (project.phase === 1 && project.ideation_pillars) {
        const pillars = typeof project.ideation_pillars === 'string'
          ? JSON.parse(project.ideation_pillars)
          : project.ideation_pillars;
        setIdeationComplete(true);
        setIdeationData(pillars);
      } else {
        setIdeationComplete(false);
        setIdeationData(null);
      }

      // Check if feature_data exist and phase is 2 — show Continue button on refresh
      if (project.phase === 2 && project.feature_data) {
        const fd = typeof project.feature_data === 'string'
          ? JSON.parse(project.feature_data)
          : project.feature_data;
        setFeaturesComplete(true);
        setFeatureData(fd);
      } else {
        setFeaturesComplete(false);
        setFeatureData(null);
      }

      // Phase 3: restore mindmap_data step + auto-init if needed
      if (project.phase === 3) {
        const md = project.mindmap_data
          ? (typeof project.mindmap_data === 'string' ? JSON.parse(project.mindmap_data) : project.mindmap_data)
          : null;
        setMindmapData(md);
        setMindmapStep(md?.step || 0);

        // If step 5 was completed, show Continue button (or auto-retry if summary missing)
        if (md?.step >= 5) {
          const ps = project.phase_summaries
            ? (typeof project.phase_summaries === 'string' ? JSON.parse(project.phase_summaries) : project.phase_summaries)
            : {};
          if (ps["3"]) {
            setMindmapComplete(true);
          } else {
            // Step 5 didn't complete successfully — auto-retry
            try {
              const step5Response = await api.post('/api/chat', {
                project_id: projectId,
                message: '__auto_step_5__',
                phase: 3,
                step_data: { step: 5 },
              });
              const step5AiMessage = {
                role: 'assistant',
                content: step5Response.data.message,
                message_type: step5Response.data.message_type || 'text',
                metadata: step5Response.data.metadata || null,
                created_at: new Date().toISOString(),
              };
              setMessages(prev => [...prev, step5AiMessage]);
              if (step5Response.data.canvas_updates?.length > 0) {
                setCanvasState(prev => {
                  let newNodes = [...prev.nodes];
                  let newEdges = [...prev.edges];
                  for (const update of step5Response.data.canvas_updates) {
                    if (update.action === 'add_node') {
                      const node = update.node;
                      if (newNodes.find(n => n.id === node.id)) continue;
                      const position = node.position || { x: 400, y: 300 };
                      newNodes.push({
                        id: node.id,
                        type: node.type || 'feature',
                        position,
                        data: node.data,
                      });
                      if (node.parentId) {
                        const sourceHandle = node.id === 'ui-design' ? 'left' : 'bottom';
                        const edge = {
                          id: `${node.parentId}-${node.id}`,
                          source: node.parentId,
                          target: node.id,
                          sourceHandle,
                          type: 'smoothstep',
                          animated: false,
                          style: { stroke: '#D6D3D1', strokeWidth: 1.5 },
                        };
                        if (node.id === 'ui-design') {
                          edge.targetHandle = 'right';
                        }
                        newEdges.push(edge);
                      }
                    }
                  }
                  return { nodes: newNodes, edges: newEdges };
                });
              }
              if (step5Response.data.mindmap_complete) {
                setMindmapComplete(true);
              }
            } catch (err) {
              console.error('Step 5 recovery failed:', err);
              // Fallback: let user proceed anyway to avoid being permanently stuck
              setMindmapComplete(true);
            }
          }
        }

        // Check if messages already contain interactive content;
        // if not (e.g. just the welcome message), auto-init Phase 3
        const hasInteractiveMsg = (projectMessages || []).some(m => {
          if (m.metadata) {
            const meta = typeof m.metadata === 'string' ? JSON.parse(m.metadata) : m.metadata;
            return meta && meta.step;
          }
          return false;
        });
        if (!hasInteractiveMsg) {
          // Auto-trigger Step 1
          try {
            const initResponse = await api.post('/api/chat', {
              project_id: projectId,
              message: '__init_phase_3__',
              phase: 3,
            });
            const aiMessage = {
              role: 'assistant',
              content: initResponse.data.message,
              message_type: initResponse.data.message_type || 'text',
              metadata: initResponse.data.metadata || null,
              created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
            if (initResponse.data.mindmap_step) {
              setMindmapStep(initResponse.data.mindmap_step);
            }
          } catch (err) {
            console.error('Error auto-initializing Phase 3:', err);
          }
        } else {
          // Restore metadata on messages from DB
          const restoredMessages = (projectMessages || []).map(m => {
            if (m.metadata) {
              const meta = typeof m.metadata === 'string' ? JSON.parse(m.metadata) : m.metadata;
              return {
                ...m,
                metadata: meta,
                message_type: meta?.step === 1 ? 'multi_select'
                  : meta?.step === 3 ? 'color_palette'
                  : meta?.step ? 'single_select'
                  : 'text',
              };
            }
            return m;
          });
          setMessages(restoredMessages);
        }
      } else {
        setMindmapStep(0);
        setMindmapData(null);
        setMindmapComplete(false);
      }

      // Phase 4+: check if PRD already exists, or trigger generation
      if (project.phase >= 4) {
        try {
          const docsResponse = await api.get(`/api/documents/${projectId}`);
          const docs = docsResponse.data.documents || [];
          const hasPrd = docs.some(d => d.doc_type === 'prd');
          if (hasPrd) {
            setPrdGenerated(true);
            setIsPrdGenerating(false);
          } else if (project.phase === 4) {
            // PRD not yet generated — trigger it (only in Phase 4)
            triggerPrdGeneration(projectId);
          }
        } catch (_) {
          if (project.phase === 4) {
            triggerPrdGeneration(projectId);
          }
        }
      } else {
        setPrdGenerated(false);
        setIsPrdGenerating(false);
      }

      // Reset viewing state
      setViewingPhase(null);
      setPhaseMessages({});

      onUpdateProject(projectId, { phase: project.phase });
    } catch (error) {
      console.error('Error loading project:', error);
      if (error.response?.status === 404) {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          setMessages([
            {
              role: 'assistant',
              content:
                "Welcome to FounderLab! I'm here to help you transform your idea into a polished PRD. Let's start with Phase 1: Ideation.\n\nTell me, what problem are you trying to solve?",
              created_at: new Date().toISOString(),
            },
          ]);
          setProjectName(project.name);
        }
      }
    }
  };

  const loadPhaseMessages = async (phaseNum) => {
    // Check cache first
    if (phaseMessages[phaseNum]) {
      return phaseMessages[phaseNum];
    }
    try {
      const response = await api.get(`/api/projects/${projectId}/messages`, {
        params: { phase: phaseNum },
      });
      const msgs = response.data.messages || [];
      setPhaseMessages((prev) => ({ ...prev, [phaseNum]: msgs }));
      return msgs;
    } catch (error) {
      console.error('Error loading phase messages:', error);
      return [];
    }
  };

  const handlePhaseClick = async (phaseNum) => {
    if (phaseNum === phase) {
      // Clicking current phase returns to active chat
      setViewingPhase(null);
      return;
    }
    if (phaseNum < phase) {
      // Clicking a completed phase — load its messages read-only
      await loadPhaseMessages(phaseNum);
      setViewingPhase(phaseNum);
    }
    // Future phases — do nothing
  };

  const sendMessage = async (message) => {
    try {
      const userMessage = {
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const response = await api.post('/api/chat', {
        project_id: projectId,
        message,
        phase,
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Check for ideation complete
      if (response.data.ideation_complete) {
        setIdeationComplete(true);
        setIdeationData(response.data.ideation_data);
      }

      // Check for features complete
      if (response.data.features_complete) {
        setFeaturesComplete(true);
        setFeatureData(response.data.feature_data);
      }

      if (response.data.phase_complete) {
        const newPhase = phase + 1;

        setPhaseTransition(newPhase);
        setTimeout(() => setPhaseTransition(null), 2000);

        setPhase(newPhase);
        onUpdateProject(projectId, { phase: newPhase });

        const phaseWelcome = {
          2: 'Phase 2: Feature Mapping. Would you like to propose your core features, or should I suggest some based on our discussion?',
          3: "Welcome to Phase 3! Now we'll shape the design direction for your product. Let's get started!",
          4: 'Phase 4: PRD Generation. Creating your comprehensive PRD document...',
          5: "Phase 5: Export. Your PRD is ready! You can download it from the Documents panel.",
        };

        setTimeout(() => {
          setMessages([
            {
              role: 'assistant',
              content: phaseWelcome[newPhase] || 'Starting new phase...',
              created_at: new Date().toISOString(),
            },
          ]);
        }, 500);
      }

      if (response.data.canvas_updates && response.data.canvas_updates.length > 0) {
        setCanvasState((prev) => {
          let newNodes = [...prev.nodes];
          let newEdges = [...prev.edges];

          for (const update of response.data.canvas_updates) {
            if (update.action === 'add_node') {
              const node = update.node;

              if (newNodes.find((n) => n.id === node.id)) continue;

              let position;
              if (node.type === 'featureGroup' && node.parentId === 'root') {
                // Horizontal layout below root for feature groups
                const rootNode = newNodes.find((n) => n.id === 'root');
                const existingFeatureGroups = newNodes.filter((n) => n.type === 'featureGroup');
                const col = existingFeatureGroups.length;
                const rootX = rootNode?.position?.x || 400;
                const rootY = rootNode?.position?.y || 300;
                position = {
                  x: rootX - 200 + col * 300,
                  y: rootY + 180,
                };
              } else {
                // Existing positioning logic for other node types
                const parentNode = newNodes.find((n) => n.id === node.parentId);
                const siblingCount = newNodes.filter(
                  (n) => newEdges.some((e) => e.source === node.parentId && e.target === n.id)
                ).length;
                position = parentNode
                  ? {
                      x: parentNode.position.x + 250,
                      y: parentNode.position.y + siblingCount * 120,
                    }
                  : { x: 400, y: 300 };
              }

              const VALID_NODE_TYPES = new Set(['root', 'default', 'feature', 'tech', 'database', 'ideation', 'featureGroup', 'complementaryFeatures', 'uiDesign', 'systemMap']);
              newNodes.push({
                id: node.id,
                type: VALID_NODE_TYPES.has(node.type) ? node.type : 'feature',
                position,
                data: node.data,
              });

              if (node.parentId) {
                newEdges.push({
                  id: `${node.parentId}-${node.id}`,
                  source: node.parentId,
                  target: node.id,
                  type: 'smoothstep',
                  animated: false,
                  style: { stroke: '#D6D3D1', strokeWidth: 1.5 },
                });
              }
            }
          }

          return { nodes: newNodes, edges: newEdges };
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your message. Please try again.',
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const formatSelectionSummary = (stepData) => {
    if (stepData.selections) {
      return `Selected: ${stepData.selections.join(', ')}`;
    }
    if (stepData.selection && typeof stepData.selection === 'object') {
      return `Selected palette: ${stepData.selection.name} (${stepData.selection.colors.join(', ')})`;
    }
    if (stepData.selection) {
      return `Selected: ${stepData.selection}`;
    }
    return 'Selection made';
  };

  const sendStepData = async (stepData) => {
    setIsStepLoading(true);
    // Step 2 (theme selection) triggers Tavily web search for color palettes
    if (stepData.step === 2) {
      setIsWebSearching(true);
    }
    try {
      const selectionSummary = formatSelectionSummary(stepData);
      const userMessage = {
        role: 'user',
        content: selectionSummary,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await api.post('/api/chat', {
        project_id: projectId,
        message: selectionSummary,
        phase: 3,
        step_data: stepData,
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        message_type: response.data.message_type || 'text',
        metadata: response.data.metadata || null,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

      if (response.data.mindmap_step) {
        setMindmapStep(response.data.mindmap_step);
      }

      // Auto-trigger Step 5 after Step 4 returns mindmap_step 5 (tech stack generated)
      if (response.data.mindmap_step === 5 && !response.data.phase_complete) {
        setTimeout(async () => {
          try {
            const step5Response = await api.post('/api/chat', {
              project_id: projectId,
              message: '__auto_step_5__',
              phase: 3,
              step_data: { step: 5 },
            });

            const step5AiMessage = {
              role: 'assistant',
              content: step5Response.data.message,
              message_type: step5Response.data.message_type || 'text',
              metadata: step5Response.data.metadata || null,
              created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, step5AiMessage]);

            // Handle Step 5 canvas updates
            if (step5Response.data.canvas_updates?.length > 0) {
              setCanvasState(prev => {
                let newNodes = [...prev.nodes];
                let newEdges = [...prev.edges];

                for (const update of step5Response.data.canvas_updates) {
                  if (update.action === 'add_node') {
                    const node = update.node;
                    if (newNodes.find(n => n.id === node.id)) continue;

                    const position = node.position || { x: 400, y: 300 };
                    newNodes.push({
                      id: node.id,
                      type: node.type || 'feature',
                      position,
                      data: node.data,
                    });

                    if (node.parentId) {
                      const sourceHandle = node.id === 'ui-design' ? 'left' : 'bottom';
                      const edge = {
                        id: `${node.parentId}-${node.id}`,
                        source: node.parentId,
                        target: node.id,
                        sourceHandle,
                        type: 'smoothstep',
                        animated: false,
                        style: { stroke: '#D6D3D1', strokeWidth: 1.5 },
                      };
                      if (node.id === 'ui-design') {
                        edge.targetHandle = 'right';
                      }
                      newEdges.push(edge);
                    }
                  }
                }
                return { nodes: newNodes, edges: newEdges };
              });
            }

            // Step 5 signals mindmap_complete — show Continue button
            if (step5Response.data.mindmap_complete) {
              setMindmapComplete(true);
            }
          } catch (err) {
            console.error('Error auto-triggering Step 5:', err);
            // Fallback: let user proceed anyway to avoid being permanently stuck
            setMindmapComplete(true);
          }
        }, 800);
      }

      // Handle canvas updates
      if (response.data.canvas_updates?.length > 0) {
        if (response.data.canvas_state) {
          // Full canvas state provided — use it directly
          setCanvasState(response.data.canvas_state);
        } else {
          setCanvasState(prev => {
            let newNodes = [...prev.nodes];
            let newEdges = [...prev.edges];

            for (const update of response.data.canvas_updates) {
              if (update.action === 'add_node') {
                const node = update.node;
                if (newNodes.find(n => n.id === node.id)) continue;

                const position = node.position || { x: 400, y: 300 };
                const VALID_NODE_TYPES = new Set(['root', 'default', 'feature', 'tech', 'database', 'ideation', 'featureGroup', 'complementaryFeatures', 'uiDesign', 'systemMap']);
                newNodes.push({
                  id: node.id,
                  type: VALID_NODE_TYPES.has(node.type) ? node.type : 'feature',
                  position,
                  data: node.data,
                });

                if (node.parentId) {
                  const sourceHandle = node.id === 'ui-design' ? 'left'
                    : node.id === 'system-map' ? 'top'
                    : 'bottom';
                  const edge = {
                    id: `${node.parentId}-${node.id}`,
                    source: node.parentId,
                    target: node.id,
                    sourceHandle,
                    type: 'smoothstep',
                    animated: false,
                    style: { stroke: '#D6D3D1', strokeWidth: 1.5 },
                  };
                  if (node.id === 'ui-design') {
                    edge.targetHandle = 'right';
                  }
                  if (node.id === 'system-map') {
                    edge.targetHandle = 'bottom';
                  }
                  newEdges.push(edge);
                }
              }
            }
            return { nodes: newNodes, edges: newEdges };
          });
        }
      }

      // Handle phase completion (Step 5 auto-advances)
      if (response.data.phase_complete) {
        const newPhase = response.data.new_phase || phase + 1;

        setPhaseTransition(newPhase);
        setTimeout(() => setPhaseTransition(null), 2000);

        // Cache Phase 3 messages
        setPhaseMessages(prev => ({ ...prev, 3: [...messages, userMessage, aiMessage] }));

        // Load new phase messages
        setTimeout(async () => {
          const msgsResponse = await api.get(`/api/projects/${projectId}/messages`, {
            params: { phase: newPhase },
          });

          setPhase(newPhase);
          setMessages(msgsResponse.data.messages || []);
          setMindmapStep(0);
          setMindmapData(null);
          setViewingPhase(null);
          onUpdateProject(projectId, { phase: newPhase });

          // Auto-trigger PRD generation when entering Phase 4
          if (newPhase === 4) {
            triggerPrdGeneration(projectId);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error in step:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your selection. Please try again.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsStepLoading(false);
      setIsWebSearching(false);
    }
  };

  const handleContinueToFeatures = async () => {
    setIsContinueLoading(true);
    try {
      // Cache Phase 1 messages before transitioning
      setPhaseMessages((prev) => ({ ...prev, 1: [...messages] }));

      const response = await api.post(`/api/projects/${projectId}/advance-phase`, {
        current_phase: 1,
        ideation_data: ideationData,
      });

      if (response.data.success) {
        const newPhase = response.data.new_phase;

        // Show phase transition overlay
        setPhaseTransition(newPhase);
        setTimeout(() => setPhaseTransition(null), 2000);

        // Update canvas from response
        if (response.data.canvas_state) {
          setCanvasState(response.data.canvas_state);
        }

        // Load Phase 2 messages from backend
        const msgsResponse = await api.get(`/api/projects/${projectId}/messages`, {
          params: { phase: newPhase },
        });
        const phase2Messages = msgsResponse.data.messages || [];

        // Update state
        setPhase(newPhase);
        setMessages(phase2Messages);
        setIdeationComplete(false);
        setIdeationData(null);
        setViewingPhase(null);
        onUpdateProject(projectId, { phase: newPhase });
      }
    } catch (error) {
      console.error('Error advancing phase:', error);
    } finally {
      setIsContinueLoading(false);
    }
  };

  const handleContinueToMindMapping = async () => {
    setIsContinueLoading(true);
    try {
      setPhaseMessages((prev) => ({ ...prev, 2: [...messages] }));

      const response = await api.post(`/api/projects/${projectId}/advance-phase`, {
        current_phase: 2,
        ideation_data: featureData,
      });

      if (response.data.success) {
        const newPhase = response.data.new_phase;

        setPhaseTransition(newPhase);
        setTimeout(() => setPhaseTransition(null), 2000);

        if (response.data.canvas_state) {
          setCanvasState(response.data.canvas_state);
        }

        const msgsResponse = await api.get(`/api/projects/${projectId}/messages`, {
          params: { phase: newPhase },
        });

        setPhase(newPhase);
        setMessages(msgsResponse.data.messages || []);
        setFeaturesComplete(false);
        setFeatureData(null);
        setViewingPhase(null);
        onUpdateProject(projectId, { phase: newPhase });

        // Auto-trigger Phase 3 Step 1 (complementary features)
        if (newPhase === 3) {
          try {
            const initResponse = await api.post('/api/chat', {
              project_id: projectId,
              message: '__init_phase_3__',
              phase: 3,
            });

            const aiMessage = {
              role: 'assistant',
              content: initResponse.data.message,
              message_type: initResponse.data.message_type || 'text',
              metadata: initResponse.data.metadata || null,
              created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
            if (initResponse.data.mindmap_step) {
              setMindmapStep(initResponse.data.mindmap_step);
            }
          } catch (err) {
            console.error('Error initializing Phase 3:', err);
          }
        }
      }
    } catch (error) {
      console.error('Error advancing phase:', error);
    } finally {
      setIsContinueLoading(false);
    }
  };

  const handleContinueToPrd = async () => {
    setIsContinueLoading(true);
    try {
      setPhaseMessages((prev) => ({ ...prev, 3: [...messages] }));

      const response = await api.post(`/api/projects/${projectId}/advance-phase`, {
        current_phase: 3,
      });

      if (response.data.success) {
        const newPhase = response.data.new_phase;

        setPhaseTransition(newPhase);
        setTimeout(() => setPhaseTransition(null), 2000);

        if (response.data.canvas_state) {
          setCanvasState(response.data.canvas_state);
        }

        const msgsResponse = await api.get(`/api/projects/${projectId}/messages`, {
          params: { phase: newPhase },
        });

        setPhase(newPhase);
        setMessages(msgsResponse.data.messages || []);
        setMindmapComplete(false);
        setMindmapStep(0);
        setMindmapData(null);
        setViewingPhase(null);
        onUpdateProject(projectId, { phase: newPhase });

        if (newPhase === 4) {
          triggerPrdGeneration(projectId);
        }
      }
    } catch (error) {
      console.error('Error advancing to PRD:', error);
    } finally {
      setIsContinueLoading(false);
    }
  };

  const triggerPrdGeneration = async (pid) => {
    const targetId = pid || projectId;
    setIsPrdGenerating(true);
    try {
      await api.post(`/api/projects/${targetId}/generate-prd`, {}, { timeout: 120000 });
      setPrdGenerated(true);
    } catch (error) {
      console.error('Error generating PRD:', error);
      // Check if PRD already existed
      if (error.response?.data?.status === 'already_exists') {
        setPrdGenerated(true);
      }
    } finally {
      setIsPrdGenerating(false);
    }
  };

  const loadDocumentContent = async () => {
    setDocumentLoading(true);
    try {
      const res = await api.get(`/api/documents/${projectId}/content`);
      setDocumentContent(res.data.content);
      setDocumentData(res.data.document);
    } catch (e) {
      console.error('Error loading document content:', e);
    } finally {
      setDocumentLoading(false);
    }
  };

  const handlePrdFinished = () => {
    // Auto-toggle to documents tab after PRD animation completes
    setActiveTab('documents');
    // Pre-load document content for preview
    loadDocumentContent();
  };

  const handleContinueToExport = async () => {
    setIsContinueLoading(true);
    try {
      setPhaseMessages(prev => ({ ...prev, 4: [...messages] }));

      const response = await api.post(`/api/projects/${projectId}/advance-phase`, {
        current_phase: 4,
      });

      if (response.data.success) {
        const newPhase = response.data.new_phase;

        setPhaseTransition(newPhase);
        setTimeout(() => setPhaseTransition(null), 2000);

        const msgsResponse = await api.get(`/api/projects/${projectId}/messages`, {
          params: { phase: newPhase },
        });

        setPhase(newPhase);
        setMessages(msgsResponse.data.messages || []);
        setIsPrdGenerating(false);
        setViewingPhase(null);
        onUpdateProject(projectId, { phase: newPhase });
      }
    } catch (error) {
      console.error('Error advancing to export:', error);
    } finally {
      setIsContinueLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/landing', { replace: true });
  };

  const getPhaseName = (p) => {
    const names = {
      1: 'Ideation',
      2: 'Feature Mapping',
      3: 'MindMapping',
      4: 'PRD Generation',
      5: 'Export',
    };
    return names[p] || 'Ideation';
  };

  const PHASES = [
    { number: 1, name: 'Ideation', icon: Lightbulb },
    { number: 2, name: 'Features', icon: GitBranch },
    { number: 3, name: 'MindMap', icon: Network },
    { number: 4, name: 'PRD', icon: FileTextIcon },
    { number: 5, name: 'Export', icon: Download },
  ];

  const PHASE_COLORS = {
    1: '#E8613C',
    2: '#D97706',
    3: '#7C3AED',
    4: '#BE123C',
    5: '#0D9488',
  };

  // Determine which messages to show
  const isViewingPast = viewingPhase !== null;
  const displayMessages = isViewingPast
    ? (phaseMessages[viewingPhase] || [])
    : messages;

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 h-12 flex items-center flex-shrink-0 relative">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition flex-shrink-0 z-10"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-stone-600 dark:text-stone-400" />
        </button>

        <div className="ml-2 z-10 flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
              activeTab === 'documents'
                ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <File className="w-3 h-3" />
            Documents
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[15px] font-semibold text-stone-950 dark:text-stone-100 truncate max-w-[50%]">
            {projectName}
          </span>
        </div>

        {/* User Account Icon */}
        <div className="ml-auto z-10 relative" ref={accountRef}>
          <button
            onClick={() => setShowAccountPopup((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
          >
            <User className="w-4 h-4 text-stone-500 dark:text-stone-400" />
          </button>

          {showAccountPopup && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-lg dark:shadow-2xl dark:shadow-black/30 overflow-hidden animate-scale-in origin-top-right">
              <button
                onClick={() => {
                  setShowAccountPopup(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              >
                <Settings className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span className="text-[13px] font-medium text-stone-700 dark:text-stone-300">Settings</span>
              </button>
              <div className="border-t border-stone-100 dark:border-stone-700" />
              <button
                onClick={() => {
                  setShowAccountPopup(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-[13px] font-medium text-red-500">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chat Column */}
        <div className="w-[610px] flex-shrink-0 border-r border-stone-200 dark:border-stone-800 flex flex-col">
          {/* Phase Stepper */}
          <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-3">
            <div className="flex items-center">
              {PHASES.map((p, idx) => {
                const isCompleted = phase > p.number;
                const isCurrent = phase === p.number;
                const isClickable = isCompleted;
                const isViewing = viewingPhase === p.number;
                const Icon = p.icon;

                return (
                  <React.Fragment key={p.number}>
                    <div
                      className={`flex items-center gap-1.5 ${isClickable ? 'cursor-pointer' : ''}`}
                      onClick={() => handlePhaseClick(p.number)}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isViewing ? 'ring-2 ring-offset-1 ring-stone-400' : ''}`}
                        style={{
                          backgroundColor: isCompleted
                            ? '#10B981'
                            : isCurrent
                            ? PHASE_COLORS[p.number]
                            : 'var(--stone-200)',
                          color: isCompleted || isCurrent ? '#fff' : '#A8A29E',
                          boxShadow: isCurrent && !isViewing
                            ? `0 0 0 3px ${PHASE_COLORS[p.number]}20`
                            : 'none',
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Icon className="w-3 h-3" />
                        )}
                      </div>
                      <span
                        className="text-[12px] font-medium"
                        style={{
                          color: isViewing
                            ? '#44403C'
                            : isCurrent
                            ? PHASE_COLORS[p.number]
                            : isCompleted
                            ? 'var(--stone-700)'
                            : '#A8A29E',
                        }}
                      >
                        {p.name}
                      </span>
                    </div>

                    {idx < PHASES.length - 1 && (
                      <div
                        className="flex-1 h-px mx-2"
                        style={{
                          backgroundColor: phase > p.number ? '#10B981' : 'var(--stone-200)',
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Viewing Past Phase Indicator */}
          {isViewingPast && (
            <div className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-4 py-2 flex items-center justify-between">
              <span className="text-[12px] text-stone-500 dark:text-stone-400">
                Viewing Phase {viewingPhase}: {getPhaseName(viewingPhase)} (read-only)
              </span>
              <button
                onClick={() => setViewingPhase(null)}
                className="text-[12px] font-medium text-terra-500 hover:text-terra-600 transition"
              >
                Back to current phase
              </button>
            </div>
          )}

          {/* Chat or Documents */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' ? (
              ((phase === 4 && !isViewingPast) || viewingPhase === 4) ? (
                <PrdGenerationView
                  isGenerating={isPrdGenerating}
                  isGenerated={prdGenerated}
                  onFinished={handlePrdFinished}
                  onContinueToExport={phase === 4 && !isViewingPast ? handleContinueToExport : null}
                  isContinueLoading={isContinueLoading}
                />
              ) : (
                <ChatInterface
                  messages={displayMessages}
                  onSendMessage={sendMessage}
                  onSendStepData={sendStepData}
                  isStepLoading={isStepLoading}
                  isWebSearching={isWebSearching}
                  phase={phase}
                  isReadOnly={isViewingPast}
                  isPrdGenerating={isPrdGenerating}
                  showContinueButton={
                    (ideationComplete && !isViewingPast && phase === 1) ||
                    (featuresComplete && !isViewingPast && phase === 2) ||
                    (mindmapComplete && !isViewingPast && phase === 3)
                  }
                  onContinue={
                    phase === 1 ? handleContinueToFeatures
                    : phase === 2 ? handleContinueToMindMapping
                    : handleContinueToPrd
                  }
                  isContinueLoading={isContinueLoading}
                  continueLabel={
                    phase === 1 ? 'Continue to Feature Mapping'
                    : phase === 2 ? 'Continue to MindMapping'
                    : 'Continue to PRD Generation'
                  }
                />
              )
            ) : (
              <DocumentsPanel projectId={projectId} refreshTrigger={prdGenerated} />
            )}
          </div>
        </div>

        {/* Right panel: Document Preview or Canvas */}
        {activeTab === 'documents' && (documentContent || documentLoading) ? (
          <div className="flex-1 h-full">
            <DocumentPreview
              content={documentContent}
              document={documentData}
              loading={documentLoading}
              onExport={() => setActiveTab('chat')}
            />
          </div>
        ) : (
          <div className="flex-1 h-full light-canvas">
            <CanvasView
              nodes={canvasState.nodes}
              edges={canvasState.edges}
              onNodesChange={(nodes) => setCanvasState((prev) => ({ ...prev, nodes }))}
              onEdgesChange={(edges) => setCanvasState((prev) => ({ ...prev, edges }))}
            />
          </div>
        )}
      </div>

      {/* Phase Transition Overlay — removed per user request */}
    </div>
  );
}

export default ChatWorkspace;

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { Network } from 'lucide-react';

const NODE_TYPES = {
  root: CustomNode,
  default: CustomNode,
  feature: CustomNode,
  tech: CustomNode,
  database: CustomNode,
  ideation: CustomNode,
  competitors: CustomNode,
  featureGroup: CustomNode,
  userFlow: CustomNode,
  complementaryFeatures: CustomNode,
  uiDesign: CustomNode,
  systemMap: CustomNode,
  security: CustomNode,
};

// Custom dotted edge for user flow connections
function DottedEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <path
      id={id}
      d={edgePath}
      style={{ stroke: '#7C3AED', strokeWidth: 1.5, strokeDasharray: '4 4', fill: 'none' }}
    />
  );
}

const EDGE_TYPES = { dotted: DottedEdge };

function CanvasViewInner({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange, onNodeContentChange }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const { fitView, getViewport } = useReactFlow();
  const hasFitted = useRef(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const nodesRef = useRef(nodes);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  const edgesRef = useRef(edges);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  // Stable callback ref for content changes
  const onNodeContentChangeRef = useRef(onNodeContentChange);
  useEffect(() => { onNodeContentChangeRef.current = onNodeContentChange; }, [onNodeContentChange]);

  // Handler for node content edits - updates local state and propagates to parent
  // Supports both nested field paths ("pillars.core_problem") and direct field updates ("subFeatures")
  const handleNodeContentChange = useCallback((nodeId, field, value) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id !== nodeId) return node;

        // Deep clone the data to update nested fields
        const newData = { ...node.data };

        // Handle nested field paths like "pillars.core_problem" or "subFeatures.0"
        // Also handle direct field updates like "subFeatures" (when setting entire array)
        if (field.includes('.')) {
          const parts = field.split('.');
          let current = newData;
          for (let i = 0; i < parts.length - 1; i++) {
            const key = parts[i];
            if (Array.isArray(current[key])) {
              current[key] = [...current[key]];
            } else if (typeof current[key] === 'object') {
              current[key] = { ...current[key] };
            }
            current = current[key];
          }
          current[parts[parts.length - 1]] = value;
        } else {
          // Direct field update (e.g., setting entire "subFeatures" array)
          newData[field] = Array.isArray(value) ? [...value] : value;
        }

        return { ...node, data: newData };
      });

      // Propagate to parent for persistence
      if (onNodeContentChangeRef.current) {
        const updatedNode = updatedNodes.find(n => n.id === nodeId);
        if (updatedNode) {
          onNodeContentChangeRef.current(nodeId, field, value, updatedNodes);
        }
      }

      return updatedNodes;
    });
  }, [setNodes]);

  React.useEffect(() => {
    if (initialNodes) {
      // Inject onContentChange callback into each node's data
      const nodesWithCallback = initialNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onContentChange: handleNodeContentChange,
        }
      }));
      setNodes(nodesWithCallback);
      // Only fitView once on initial load (0 → some nodes), not on every update
      if (initialNodes.length > 0 && !hasFitted.current) {
        hasFitted.current = true;
        setTimeout(() => {
          fitView({ padding: 0.25, duration: 300, maxZoom: 1.0 });
          setTimeout(() => setZoomLevel(Math.round(getViewport().zoom * 100)), 450);
        }, 100);
      }
      // Reset fit tracker when nodes are cleared (project switch)
      if (initialNodes.length === 0) {
        hasFitted.current = false;
      }
    }
  }, [initialNodes, setNodes, fitView, handleNodeContentChange]);

  React.useEffect(() => {
    if (initialEdges) {
      setEdges(initialEdges.map(edge => ({
        ...edge,
        style: {
          ...(edge.style || {}),
          stroke: '#44403C',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: '#44403C',
        },
      })));
    }
  }, [initialEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChangeInternal(changes);

      // Only propagate completed drag events to parent for persistence
      const positionChanges = changes.filter(
        (c) => c.type === 'position' && c.dragging === false && c.position
      );

      if (positionChanges.length > 0 && onNodesChange) {
        const updatedNodes = nodesRef.current.map((node) => {
          const change = positionChanges.find((c) => c.id === node.id);
          return change ? { ...node, position: change.position } : node;
        });
        onNodesChange(updatedNodes);
      }
    },
    [onNodesChange, onNodesChangeInternal]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChangeInternal(changes);
      const removeChanges = changes.filter((c) => c.type === 'remove');
      if (removeChanges.length > 0 && onEdgesChange) {
        const removedIds = new Set(removeChanges.map((c) => c.id));
        onEdgesChange(edgesRef.current.filter((e) => !removedIds.has(e.id)));
      }
    },
    [onEdgesChange, onEdgesChangeInternal]
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.04)' }}>
      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-stone-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Network className="w-6 h-6 text-stone-400" />
            </div>
            <p className="text-sm font-medium text-stone-700">No nodes yet</p>
            <p className="text-[13px] text-stone-500 mt-1">
              Start chatting to build your canvas
            </p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        minZoom={0.3}
        maxZoom={1.5}
        style={{ background: '#F5F5F4' }}
        onMove={(_, viewport) => setZoomLevel(Math.round(viewport.zoom * 100))}
        onInit={(instance) => setZoomLevel(Math.round(instance.getViewport().zoom * 100))}
      >
        <Background variant="dots" color="#78716C" gap={24} size={1.5} />
        <Controls className="!bg-white !border !border-stone-200 !rounded-lg !shadow-sm" />
      </ReactFlow>

      {/* Node count badge — top-left */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-md border border-stone-200 text-[11px] text-stone-500 font-medium">
        {nodes.length} node{nodes.length !== 1 ? 's' : ''}
      </div>

      {/* Zoom level — top-right */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-md border border-stone-200 text-[11px] text-stone-500 font-mono font-medium tabular-nums">
        {zoomLevel}%
      </div>
    </div>
  );
}

function CanvasView(props) {
  return (
    <ReactFlowProvider>
      <CanvasViewInner {...props} />
    </ReactFlowProvider>
  );
}

export default CanvasView;

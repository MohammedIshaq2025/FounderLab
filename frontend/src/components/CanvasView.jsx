import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
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
  featureGroup: CustomNode,
  complementaryFeatures: CustomNode,
  uiDesign: CustomNode,
  systemMap: CustomNode,
};

function CanvasViewInner({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const { fitView, getViewport } = useReactFlow();
  const hasFitted = useRef(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const nodesRef = useRef(nodes);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  const edgesRef = useRef(edges);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  React.useEffect(() => {
    if (initialNodes) {
      setNodes(initialNodes);
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
  }, [initialNodes, setNodes, fitView]);

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

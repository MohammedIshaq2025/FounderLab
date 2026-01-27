import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
  root: CustomNode,
  default: CustomNode,
  feature: CustomNode,
  ideation: CustomNode,
};

function CanvasView({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // Update nodes and edges when props change
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChangeInternal(changes);
      const updatedNodes = nodes.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (change && change.type === 'position' && change.position) {
          return { ...node, position: change.position };
        }
        return node;
      });
      if (onNodesChange) onNodesChange(updatedNodes);
    },
    [nodes, onNodesChange, onNodesChangeInternal]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChangeInternal(changes);
      if (onEdgesChange) onEdgesChange(edges);
    },
    [edges, onEdgesChange, onEdgesChangeInternal]
  );

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Project Canvas</h3>
        <p className="text-xs text-gray-500">Pan and zoom to explore</p>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-md" />
        <MiniMap
          className="bg-white border border-gray-200 rounded-lg shadow-md"
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}

export default CanvasView;
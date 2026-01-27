import React from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, type }) {
  const isRoot = type === 'root';
  
  return (
    <div
      className={`px-6 py-4 rounded-xl border-2 shadow-lg min-w-[200px] ${
        isRoot
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-600 text-white'
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    >
      {!isRoot && <Handle type="target" position={Position.Top} className="w-3 h-3" />}
      
      <div className="space-y-1">
        <div className={`font-semibold text-sm ${
          isRoot ? 'text-white' : 'text-gray-900'
        }`}>
          {data.label}
        </div>
        
        {data.description && (
          <div className={`text-xs ${
            isRoot ? 'text-blue-50' : 'text-gray-600'
          }`}>
            {data.description}
          </div>
        )}
      </div>
      
      {!isRoot && <Handle type="source" position={Position.Bottom} className="w-3 h-3" />}
    </div>
  );
}

export default CustomNode;
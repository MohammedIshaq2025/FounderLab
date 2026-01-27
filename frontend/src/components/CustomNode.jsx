import React from 'react';
import { Handle, Position } from 'reactflow';
import { Sparkles, Box, Database, Layers } from 'lucide-react';

function CustomNode({ data, type }) {
  const isRoot = type === 'root';
  const isFeature = type === 'feature';
  const isTech = type === 'tech';
  const isDatabase = type === 'database';
  
  const getIcon = () => {
    if (isRoot) return <Sparkles className="w-5 h-5" />;
    if (isFeature) return <Box className="w-4 h-4" />;
    if (isTech) return <Layers className="w-4 h-4" />;
    if (isDatabase) return <Database className="w-4 h-4" />;
    return <Box className="w-4 h-4" />;
  };

  const getStyles = () => {
    if (isRoot) {
      return {
        container: 'bg-gradient-to-br from-[#5b0e14] via-[#7a1219] to-[#5b0e14] border-[#5b0e14] text-white shadow-2xl',
        title: 'text-white font-bold text-lg',
        desc: 'text-white/90',
        icon: 'text-white'
      };
    }
    if (isFeature) {
      return {
        container: 'bg-white border-[#5b0e14]/30 hover:border-[#5b0e14] text-gray-900 shadow-lg hover:shadow-2xl',
        title: 'text-gray-900 font-semibold text-sm',
        desc: 'text-gray-600',
        icon: 'text-[#5b0e14]'
      };
    }
    return {
      container: 'bg-gradient-to-br from-gray-50 to-white border-gray-300 text-gray-900 shadow-md hover:shadow-lg',
      title: 'text-gray-900 font-semibold text-sm',
      desc: 'text-gray-600',
      icon: 'text-gray-500'
    };
  };

  const styles = getStyles();

  return (
    <div
      className={`px-5 py-4 rounded-2xl border-2 transition-all duration-300 min-w-[220px] max-w-[300px] ${styles.container}`}
    >
      {!isRoot && <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-[#5b0e14]" />}
      
      <div className="space-y-2">
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {getIcon()}
          </div>
          <div className={`flex-1 ${styles.title}`}>
            {data.label}
          </div>
        </div>
        
        {/* Description */}
        {data.description && (
          <div className={`text-xs leading-relaxed ${styles.desc}`}>
            {data.description}
          </div>
        )}

        {/* Additional Info */}
        {data.info && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.info.split(',').map((item, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isRoot 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[#5b0e14]/10 text-[#5b0e14]'
                }`}
              >
                {item.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {!isRoot && <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-[#5b0e14]" />}
    </div>
  );
}

export default CustomNode;

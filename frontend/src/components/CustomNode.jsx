import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PILLAR_LABELS = {
  core_problem: 'Core Problem',
  pain_point: 'Pain Point',
  target_audience: 'Target Audience',
  current_solutions: 'Current Solutions',
};

function IdeationNode({ data }) {
  const pillars = data.pillars || {};

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm min-w-[260px] max-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      {/* Top accent bar */}
      <div className="h-[3px] bg-terra-500" />

      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <span className="text-[13px] font-semibold text-terra-600">Ideation</span>
      </div>

      {/* Pillar cards */}
      <div className="px-3 pb-3 space-y-1.5">
        {Object.entries(PILLAR_LABELS).map(([key, title]) => (
          <div key={key} className="bg-stone-50 rounded-md px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              {title}
            </div>
            <div className="text-xs text-stone-700 leading-relaxed mt-0.5">
              {pillars[key] || '...'}
            </div>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </div>
  );
}

function FeatureGroupNode({ data }) {
  const subFeatures = data.subFeatures || [];

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm min-w-[220px] max-w-[280px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      {/* Top accent bar — amber */}
      <div className="h-[3px] bg-amber-500" />

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-stone-800 flex-1 truncate">{data.label}</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 whitespace-nowrap">Feature</span>
      </div>

      {/* Sub-features list */}
      {subFeatures.length > 0 && (
        <div className="px-3 pb-3 space-y-1">
          {subFeatures.map((sf, idx) => {
            const colonIdx = sf.indexOf(':');
            const hasLabel = colonIdx > 0 && colonIdx < 40;
            return (
              <div key={idx} className="bg-stone-50 rounded-md px-3 py-1.5">
                <div className="text-xs text-stone-600 leading-relaxed">
                  {hasLabel ? (
                    <>
                      <span className="font-semibold text-stone-700">{sf.slice(0, colonIdx)}</span>
                      {sf.slice(colonIdx)}
                    </>
                  ) : sf}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </div>
  );
}

function ComplementaryFeaturesNode({ data }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm min-w-[220px] max-w-[280px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
      <div className="h-[3px] bg-teal-500" />
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-stone-800 flex-1 truncate">{data.label}</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 whitespace-nowrap">Bonus</span>
      </div>
      <div className="px-3 pb-3 space-y-1">
        {(data.features || []).map((f, idx) => {
          const colonIdx = f.indexOf(':');
          const hasLabel = colonIdx > 0 && colonIdx < 40;
          return (
            <div key={idx} className="bg-stone-50 rounded-md px-3 py-1.5">
              <div className="text-xs text-stone-600 leading-relaxed">
                {hasLabel ? (
                  <>
                    <span className="font-semibold text-stone-700">{f.slice(0, colonIdx)}</span>
                    {f.slice(colonIdx)}
                  </>
                ) : f}
              </div>
            </div>
          );
        })}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </div>
  );
}

function UIDesignNode({ data }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm min-w-[260px] max-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Right}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
      <div className="h-[3px] bg-rose-500" />
      <div className="px-4 pt-3 pb-2">
        <span className="text-[13px] font-semibold text-stone-800">{data.label}</span>
      </div>
      <div className="px-3 pb-3 space-y-2">
        <div className="bg-stone-50 rounded-md px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Theme</div>
          <div className="text-xs text-stone-700 mt-0.5">{data.theme}</div>
        </div>
        <div className="bg-stone-50 rounded-md px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Palette</div>
          <div className="text-xs text-stone-700 mt-0.5 mb-1.5">{data.paletteName}</div>
          <div className="flex gap-1">
            {(data.colors || []).map((color, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full border border-stone-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        <div className="bg-stone-50 rounded-md px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Style</div>
          <div className="text-xs text-stone-700 mt-0.5">{data.designStyle}</div>
        </div>
        {(data.designGuidelines || []).length > 0 && (
          <div className="bg-stone-50 rounded-md px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Design Language</div>
            <div className="mt-1 space-y-1">
              {data.designGuidelines.map((g, idx) => {
                const colonIdx = g.indexOf(':');
                const hasLabel = colonIdx > 0 && colonIdx < 30;
                return (
                  <div key={idx} className="text-xs text-stone-600 leading-relaxed">
                    {hasLabel ? (
                      <>
                        <span className="font-semibold text-stone-700">{g.slice(0, colonIdx)}</span>
                        {g.slice(colonIdx)}
                      </>
                    ) : g}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SystemMapNode({ data }) {
  const sections = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Database' },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm min-w-[302px] max-w-[372px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
      <div className="h-[3px] bg-indigo-500" />
      <div className="px-4 pt-3 pb-2">
        <span className="text-[13px] font-semibold text-stone-800">{data.label}</span>
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        {sections.map(({ key, label }) => {
          const items = data[key] || [];
          return (
            <div key={key} className="bg-stone-50 rounded-md px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                {label}
              </div>
              <div className="mt-1 space-y-0.5">
                {items.map((item, idx) => (
                  <div key={idx} className="text-xs text-stone-600 leading-relaxed flex items-start gap-1.5">
                    <span className="text-stone-400 mt-px">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </div>
  );
}

function CustomNode({ data, type }) {
  if (type === 'ideation') {
    return <IdeationNode data={data} />;
  }
  if (type === 'featureGroup') {
    return <FeatureGroupNode data={data} />;
  }
  if (type === 'complementaryFeatures') {
    return <ComplementaryFeaturesNode data={data} />;
  }
  if (type === 'uiDesign') {
    return <UIDesignNode data={data} />;
  }
  if (type === 'systemMap') {
    return <SystemMapNode data={data} />;
  }

  const isRoot = type === 'root';

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border transition-all',
        isRoot
          ? 'bg-gradient-to-br from-stone-800 to-stone-900 border-stone-700 text-white min-w-[180px] max-w-[240px] shadow-lg shadow-stone-800/25'
          : 'bg-white border-stone-200 hover:border-terra-400/50 text-stone-800 min-w-[160px] max-w-[220px] shadow-sm'
      )}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />
      )}

      <div className="flex items-center gap-2.5">
        {isRoot && (
          <div className="flex-shrink-0">
            <Database className="w-4 h-4" />
          </div>
        )}
        <div
          className={cn(
            'flex-1 truncate',
            isRoot ? 'text-sm font-bold text-white' : 'text-[13px] font-semibold text-stone-800'
          )}
        >
          {data.label}
        </div>
      </div>

      {data.description && (
        <p
          className={cn(
            'text-xs leading-relaxed mt-1.5',
            isRoot ? 'text-white/70' : 'text-stone-500'
          )}
        >
          {data.description}
        </p>
      )}

      {data.info && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.info.split(',').map((item, idx) => (
            <span
              key={idx}
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded',
                isRoot ? 'bg-white/15 text-white/80' : 'bg-stone-100 text-stone-500'
              )}
            >
              {item.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Bottom source handle (for feature/tech/database children below) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      {/* Right source handle (for ideation node to the right) */}
      {isRoot && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />
      )}

      {/* Left source handle (for UI design node to the left) */}
      {isRoot && (
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />
      )}

      {/* Top source handle (for system map node above) */}
      {isRoot && (
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />
      )}
    </div>
  );
}

export default CustomNode;

import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/* ─── Shared card shell ─── */
const Card = ({ children, className, accentColor, typeLabel }) => (
  <div
    className={cn(
      'relative bg-white rounded-tr-xl rounded-br-xl rounded-bl-xl overflow-visible',
      'border border-stone-200/80',
      'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]',
      className,
    )}
  >
    {/* Floating type tag */}
    {typeLabel && (
      <div
        className="absolute -top-[14px] left-0 px-2 py-[3px] rounded-tr-md rounded-br-md text-[9px] font-bold tracking-[0.1em] uppercase leading-none text-white select-none z-10"
        style={{ backgroundColor: accentColor || '#78716C' }}
      >
        {typeLabel}
      </div>
    )}
    {/* Accent strip */}
    {accentColor && (
      <div className="h-[2.5px] rounded-tr-xl" style={{ background: accentColor }} />
    )}
    {children}
  </div>
);

/* ─── Pill badge ─── */
const TypeBadge = ({ label, color, bg }) => (
  <span
    className="text-[10px] font-semibold tracking-wide uppercase px-2 py-[3px] rounded-full leading-none"
    style={{ color, backgroundColor: bg }}
  >
    {label}
  </span>
);

/* ─── Section label ─── */
const SectionLabel = ({ children }) => (
  <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-stone-400 mb-1">
    {children}
  </div>
);

/* ─── Sub-item with optional heading:content split ─── */
const SubItem = ({ text, className }) => {
  const colonIdx = text.indexOf(':');
  const hasLabel = colonIdx > 0 && colonIdx < 40;

  return (
    <div
      className={cn(
        'bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100',
        className,
      )}
    >
      {hasLabel ? (
        <>
          <div className="text-[11.5px] font-semibold text-stone-700 leading-snug">
            {text.slice(0, colonIdx)}
          </div>
          <div className="text-[11.5px] text-stone-500 leading-relaxed mt-0.5">
            {text.slice(colonIdx + 1).trim()}
          </div>
        </>
      ) : (
        <div className="text-[11.5px] text-stone-600 leading-relaxed">{text}</div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PILLAR_LABELS — shared constant for IdeationNode
   ═══════════════════════════════════════════════════════════════════ */
const PILLAR_LABELS = {
  core_problem: 'Core Problem',
  pain_point: 'Pain Point',
  target_audience: 'Target Audience',
  current_solutions: 'Current Solutions',
};

/* ═══════════════════════════════════════════════════════════════════
   1. IdeationNode — terra accent
   ═══════════════════════════════════════════════════════════════════ */
function IdeationNode({ data }) {
  const pillars = data.pillars || {};

  return (
    <Card accentColor="#E8613C" typeLabel="Ideation" className="min-w-[268px] max-w-[320px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      <div className="px-3 pt-3.5 pb-3.5 space-y-1.5">
        {Object.entries(PILLAR_LABELS).map(([key, title]) => (
          <div
            key={key}
            className="bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100"
          >
            <div className="text-[11.5px] font-semibold text-stone-700 leading-snug">
              {title}
            </div>
            <div className="text-[11.5px] text-stone-500 leading-relaxed mt-0.5">
              {pillars[key] || '\u2014'}
            </div>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. FeatureGroupNode — amber accent
   ═══════════════════════════════════════════════════════════════════ */
function FeatureGroupNode({ data }) {
  const subFeatures = data.subFeatures || [];

  return (
    <Card accentColor="#0D9488" typeLabel="Feature" className="min-w-[228px] max-w-[284px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      <div className="px-4 pt-3.5 pb-1.5">
        <span className="text-[13px] font-semibold text-stone-800 tracking-[-0.01em] truncate block">
          {data.label}
        </span>
      </div>

      {subFeatures.length > 0 && (
        <div className="px-3 pb-3.5 space-y-1.5">
          {subFeatures.map((sf, idx) => (
            <SubItem key={idx} text={sf} />
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. ComplementaryFeaturesNode — teal accent
   ═══════════════════════════════════════════════════════════════════ */
function ComplementaryFeaturesNode({ data }) {
  return (
    <Card accentColor="#0D9488" typeLabel="Feature" className="min-w-[228px] max-w-[284px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      <div className="px-4 pt-3.5 pb-1.5">
        <span className="text-[13px] font-semibold text-stone-800 tracking-[-0.01em] truncate block">
          {data.label}
        </span>
      </div>

      <div className="px-3 pb-3.5 space-y-1.5">
        {(data.features || []).map((f, idx) => (
          <SubItem key={idx} text={f} />
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. UIDesignNode — rose accent
   ═══════════════════════════════════════════════════════════════════ */
function UIDesignNode({ data }) {
  return (
    <Card accentColor="#E11D48" typeLabel="UI Design" className="min-w-[268px] max-w-[320px]">
      <Handle
        type="target"
        position={Position.Right}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      <div className="px-3 pt-3.5 pb-3.5 space-y-1.5">
        {/* Theme */}
        <div className="bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100">
          <div className="text-[11.5px] font-semibold text-stone-700 leading-snug">Theme</div>
          <div className="text-[11.5px] text-stone-500 leading-relaxed mt-0.5">{data.theme}</div>
        </div>

        {/* Palette */}
        <div className="bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100">
          <div className="text-[11.5px] font-semibold text-stone-700 leading-snug">Palette</div>
          <div className="text-[11.5px] text-stone-500 leading-relaxed mt-0.5 mb-1.5">{data.paletteName}</div>
          <div className="flex gap-1.5">
            {(data.colors || []).map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full ring-1 ring-stone-200/80 ring-offset-1 ring-offset-white"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100">
          <div className="text-[11.5px] font-semibold text-stone-700 leading-snug">Style</div>
          <div className="text-[11.5px] text-stone-500 leading-relaxed mt-0.5">{data.designStyle}</div>
        </div>

        {/* Design Guidelines — each as its own sub-element */}
        {(data.designGuidelines || []).map((g, idx) => (
          <SubItem key={idx} text={g} />
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. SystemMapNode — indigo accent
   ═══════════════════════════════════════════════════════════════════ */
function SystemMapNode({ data }) {
  const sections = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Database' },
  ];

  return (
    <Card accentColor="#6366F1" typeLabel="System Map" className="min-w-[302px] max-w-[372px]">
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      <div className="px-3 pt-3.5 pb-3.5 space-y-1.5">
        {sections.map(({ key, label }) => {
          const items = data[key] || [];
          return (
            <div
              key={key}
              className="bg-stone-50/80 rounded-lg px-3 py-2.5 border border-stone-100"
            >
              <div className="text-[11.5px] font-semibold text-stone-700 leading-snug mb-1">
                {label}
              </div>
              <div className="space-y-0.5">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="text-[11.5px] text-stone-500 leading-relaxed flex items-start gap-1.5"
                  >
                    <span className="text-stone-300 mt-[1px] select-none">&bull;</span>
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
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6. Root + Fallback — CustomNode dispatcher
   ═══════════════════════════════════════════════════════════════════ */
function CustomNode({ data, type }) {
  if (type === 'ideation') return <IdeationNode data={data} />;
  if (type === 'featureGroup') return <FeatureGroupNode data={data} />;
  if (type === 'complementaryFeatures') return <ComplementaryFeaturesNode data={data} />;
  if (type === 'uiDesign') return <UIDesignNode data={data} />;
  if (type === 'systemMap') return <SystemMapNode data={data} />;

  const isRoot = type === 'root';

  return (
    <div
      className={cn(
        'relative rounded-tr-xl rounded-br-xl rounded-bl-xl border overflow-visible transition-all',
        isRoot
          ? 'bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900 border-stone-700/60 text-white min-w-[188px] max-w-[244px] shadow-[0_2px_8px_rgba(28,25,23,0.25),0_8px_24px_rgba(28,25,23,0.15)]'
          : 'bg-white border-stone-200/80 text-stone-800 min-w-[168px] max-w-[224px] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]',
      )}
    >
      {/* Floating type tag */}
      <div
        className="absolute -top-[14px] left-0 px-2 py-[3px] rounded-tr-md rounded-br-md text-[9px] font-bold tracking-[0.1em] uppercase leading-none text-white select-none z-10"
        style={{ backgroundColor: isRoot ? '#44403C' : '#A8A29E' }}
      >
        {isRoot ? 'Root' : 'Node'}
      </div>
        {!isRoot && (
          <Handle
            type="target"
            position={Position.Top}
            className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
          />
        )}

        <div className={cn('px-4', isRoot ? 'py-3.5' : 'py-3')}>
          <div className="flex items-center gap-2.5">
            {isRoot && (
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-white/80" />
              </div>
            )}
            <div
              className={cn(
                'flex-1 truncate tracking-[-0.01em]',
                isRoot ? 'text-[13.5px] font-bold text-white' : 'text-[13px] font-semibold text-stone-800',
              )}
            >
              {data.label}
            </div>
          </div>

          {data.description && (
            <p
              className={cn(
                'text-[11.5px] leading-relaxed mt-1.5',
                isRoot ? 'text-white/60' : 'text-stone-500',
              )}
            >
              {data.description}
            </p>
          )}

          {data.info && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {data.info.split(',').map((item, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-md',
                    isRoot ? 'bg-white/10 text-white/70' : 'bg-stone-100 text-stone-500',
                  )}
                >
                  {item.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom source handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />

        {/* Right source handle (for ideation node) */}
        {isRoot && (
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
          />
        )}

        {/* Left source handle (for UI design node) */}
        {isRoot && (
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
          />
        )}

        {/* Top source handle (for system map node) */}
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

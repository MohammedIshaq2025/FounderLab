import React from 'react';
import { Check } from 'lucide-react';

const PHASES = [
  { number: 1, name: 'Ideation', short: 'Ideation' },
  { number: 2, name: 'Feature Mapping', short: 'Features' },
  { number: 3, name: 'MindMapping', short: 'MindMap' },
  { number: 4, name: 'PRD Generation', short: 'PRD' },
  { number: 5, name: 'Export', short: 'Export' },
];

const PHASE_COLORS = {
  1: '#E8613C',
  2: '#D97706',
  3: '#0D9488',
  4: '#BE123C',
  5: '#059669',
};

function ProgressBar({ phase, projectName, compact = false }) {
  // Compact inline version for header
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {PHASES.map((p) => {
          const isCompleted = phase > p.number;
          const isCurrent = phase === p.number;

          return (
            <div key={p.number} className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: isCompleted
                    ? '#D1FAE5'
                    : isCurrent
                    ? '#FDECE7'
                    : '#F5F5F4',
                  color: isCompleted
                    ? '#059669'
                    : isCurrent
                    ? PHASE_COLORS[p.number]
                    : '#A8A29E',
                }}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>{p.number}</span>
                )}
                <span className="hidden lg:inline">{p.short}</span>
              </div>
              {p.number < PHASES.length && (
                <div
                  className="w-3 h-px"
                  style={{
                    backgroundColor: isCompleted ? '#059669' : '#D6D3D1',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Full progress bar (standalone)
  return (
    <div className="bg-white border-b border-stone-200 px-8 py-4">
      {projectName && (
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-stone-950">{projectName}</h2>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-px bg-stone-200 -z-10">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${((phase - 1) / (PHASES.length - 1)) * 100}%`,
                backgroundColor: '#059669',
              }}
            />
          </div>

          {PHASES.map((p) => {
            const isCompleted = phase > p.number;
            const isCurrent = phase === p.number;

            return (
              <div key={p.number} className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all"
                  style={{
                    backgroundColor: isCompleted
                      ? '#059669'
                      : isCurrent
                      ? '#FFFFFF'
                      : '#FFFFFF',
                    borderColor: isCompleted
                      ? '#059669'
                      : isCurrent
                      ? PHASE_COLORS[p.number]
                      : '#D6D3D1',
                    color: isCompleted
                      ? '#FFFFFF'
                      : isCurrent
                      ? PHASE_COLORS[p.number]
                      : '#A8A29E',
                    boxShadow: isCurrent
                      ? `0 0 0 3px ${PHASE_COLORS[p.number]}20`
                      : 'none',
                  }}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : p.number}
                </div>
                <span
                  className="mt-1.5 text-[11px] font-medium"
                  style={{
                    color: isCurrent
                      ? PHASE_COLORS[p.number]
                      : isCompleted
                      ? '#44403C'
                      : '#A8A29E',
                  }}
                >
                  {p.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;

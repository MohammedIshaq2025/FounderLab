import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

function PhaseIndicator({ phase }) {
  const phases = [
    { number: 1, name: 'Ideation', color: 'indigo' },
    { number: 2, name: 'Research', color: 'purple' },
    { number: 3, name: 'Tech Stack', color: 'blue' },
    { number: 4, name: 'PRD Generation', color: 'violet' },
    { number: 5, name: 'Export', color: 'green' },
  ];

  const currentPhase = phases.find(p => p.number === phase);

  return (
    <div className="flex items-center gap-4">
      {/* Progress Dots */}
      <div className="flex items-center gap-1.5">
        {phases.map((p) => (
          <div
            key={p.number}
            className="relative"
            title={p.name}
          >
            {p.number < phase ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : p.number === phase ? (
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>
      
      {/* Current Phase Label */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">
          Phase {phase}:
        </span>
        <span className="text-sm text-gray-600">
          {currentPhase?.name}
        </span>
      </div>
    </div>
  );
}

export default PhaseIndicator;
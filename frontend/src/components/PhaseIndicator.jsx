import React from 'react';

function PhaseIndicator({ phase }) {
  const phases = [
    { number: 1, name: 'Ideation', color: 'blue' },
    { number: 2, name: 'Research', color: 'purple' },
    { number: 3, name: 'Tech Stack', color: 'indigo' },
    { number: 4, name: 'PRD Generation', color: 'violet' },
    { number: 5, name: 'Export', color: 'green' },
  ];

  const currentPhase = phases.find(p => p.number === phase);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {phases.map((p) => (
          <div
            key={p.number}
            className={`h-2 w-8 rounded-full transition-all ${
              p.number === phase
                ? `bg-${p.color}-600`
                : p.number < phase
                ? 'bg-gray-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">
        Phase {phase}: {currentPhase?.name}
      </span>
    </div>
  );
}

export default PhaseIndicator;
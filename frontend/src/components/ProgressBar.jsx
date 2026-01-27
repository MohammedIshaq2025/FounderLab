import React from 'react';
import { Check } from 'lucide-react';

function ProgressBar({ phase, projectName, onPhaseClick }) {
  const phases = [
    { number: 1, name: 'Ideation', short: 'Ideation' },
    { number: 2, name: 'Research', short: 'Research' },
    { number: 3, name: 'Tech Stack', short: 'Tech' },
    { number: 4, name: 'PRD', short: 'PRD' },
    { number: 5, name: 'Export', short: 'Export' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      {/* Project Name */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{projectName}</h2>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-[#5b0e14] transition-all duration-500"
              style={{ width: `${((phase - 1) / (phases.length - 1)) * 100}%` }}
            />
          </div>

          {/* Phase Steps */}
          {phases.map((p, index) => {
            const isCompleted = phase > p.number;
            const isCurrent = phase === p.number;
            const isPending = phase < p.number;

            return (
              <div key={p.number} className="flex flex-col items-center relative">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#5b0e14] border-[#5b0e14] text-white'
                      : isCurrent
                      ? 'bg-white border-[#5b0e14] text-[#5b0e14] ring-4 ring-[#5b0e14]/20'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{p.number}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-medium ${
                      isCurrent
                        ? 'text-[#5b0e14]'
                        : isCompleted
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {p.short}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;

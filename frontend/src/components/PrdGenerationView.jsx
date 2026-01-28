import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2,
  Check,
  Lightbulb,
  GitBranch,
  Server,
  FileText,
  Sparkles,
  ArrowRight,
  Layers,
  PenTool,
} from 'lucide-react';

const STEPS = [
  { label: 'Reviewing product vision', icon: Lightbulb },
  { label: 'Mapping core features', icon: GitBranch },
  { label: 'Analyzing complementary features', icon: Layers },
  { label: 'Structuring system architecture', icon: Server },
  { label: 'Writing feature specifications', icon: PenTool },
  { label: 'Generating execution guidance', icon: FileText },
  { label: 'Assembling final document', icon: Sparkles },
];

// +1s per gap from previous delays → ~18s total cascade
const STEP_DELAYS = [0, 3200, 6200, 9000, 12000, 15200, 18400];

function PrdGenerationView({ isGenerating, isGenerated, onFinished, onContinueToExport, isContinueLoading }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showReady, setShowReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timersRef = useRef([]);
  const hasFinishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => { onFinishedRef.current = onFinished; }, [onFinished]);

  const totalSteps = STEPS.length;

  // If PRD already generated (revisit), show completed state immediately
  useEffect(() => {
    if (isGenerated && !isGenerating) {
      const allSteps = new Set(STEPS.map((_, i) => i));
      setCompletedSteps(allSteps);
      setActiveStep(totalSteps);
      setShowReady(true);
      setMounted(true);
      return;
    }

    const mountTimer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(mountTimer);
  }, []);

  // Start the animated sequence when generating begins
  useEffect(() => {
    if (!isGenerating || isGenerated) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    STEP_DELAYS.forEach((delay, index) => {
      const activateTimer = setTimeout(() => {
        setActiveStep(index);
      }, delay);
      timersRef.current.push(activateTimer);

      if (index > 0) {
        const completeTimer = setTimeout(() => {
          setCompletedSteps(prev => new Set([...prev, index - 1]));
        }, delay);
        timersRef.current.push(completeTimer);
      }
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isGenerating, isGenerated]);

  // When API finishes, complete the last step
  useEffect(() => {
    if (isGenerated && !isGenerating && !hasFinishedRef.current) {
      hasFinishedRef.current = true;

      // Complete all remaining steps
      const completeTimer = setTimeout(() => {
        const allSteps = new Set(STEPS.map((_, i) => i));
        setCompletedSteps(allSteps);
        setActiveStep(totalSteps);
      }, 600);

      const readyTimer = setTimeout(() => {
        setShowReady(true);
      }, 1400);

      const finishTimer = setTimeout(() => {
        if (onFinishedRef.current) onFinishedRef.current();
      }, 2800);

      return () => {
        clearTimeout(completeTimer);
        clearTimeout(readyTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [isGenerated, isGenerating]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const getStepState = (index) => {
    if (completedSteps.has(index)) return 'completed';
    if (index === activeStep) return 'active';
    return 'pending';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div
        className={`transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-5.5 h-5.5 text-stone-500 dark:text-stone-400" />
          </div>
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
            {showReady ? 'PRD Generated' : 'Generating your PRD'}
          </h2>
          <p className="text-[13px] text-stone-400 dark:text-stone-500 mt-1.5">
            {showReady
              ? 'Your document is ready to view'
              : 'Assembling your product requirements document'}
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="w-[380px]">
          {STEPS.map((step, index) => {
            const state = getStepState(index);
            const StepIcon = step.icon;
            const isRevealed = state !== 'pending' || isGenerated;

            return (
              <div
                key={index}
                className={`flex items-stretch transition-all duration-500 ease-out ${
                  isRevealed
                    ? 'opacity-100'
                    : 'opacity-0 h-0 overflow-hidden'
                }`}
              >
                {/* Left column: circle + connector line */}
                <div className="flex flex-col items-center w-[30px] flex-shrink-0">
                  {/* Circle indicator */}
                  <div className="flex-shrink-0">
                    {state === 'completed' ? (
                      <div className="w-[28px] h-[28px] rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-[1.5px] border-emerald-400 dark:border-emerald-500/60 flex items-center justify-center animate-scale-in">
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" strokeWidth={2.5} />
                      </div>
                    ) : state === 'active' ? (
                      <div className="w-[28px] h-[28px] rounded-full bg-white dark:bg-stone-800 border-[1.5px] border-stone-300 dark:border-stone-600 flex items-center justify-center shadow-sm">
                        <Loader2 className="w-3.5 h-3.5 text-stone-400 dark:text-stone-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-[28px] h-[28px] rounded-full bg-stone-50 dark:bg-stone-800/50 border-[1.5px] border-stone-200 dark:border-stone-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600" />
                      </div>
                    )}
                  </div>

                  {/* Connector line */}
                  {index < totalSteps - 1 && (
                    <div
                      className={`w-px flex-1 min-h-[16px] transition-colors duration-700 ${
                        state === 'completed'
                          ? 'bg-emerald-300 dark:bg-emerald-700/60'
                          : 'bg-stone-200 dark:bg-stone-700/40'
                      }`}
                    />
                  )}
                </div>

                {/* Right column: step content */}
                <div className={`flex-1 pl-3.5 ${index < totalSteps - 1 ? 'pb-5' : 'pb-0'}`}>
                  <div className="flex items-center gap-2.5 h-[28px]">
                    <StepIcon
                      className={`w-[15px] h-[15px] flex-shrink-0 transition-colors duration-300 ${
                        state === 'completed'
                          ? 'text-emerald-400 dark:text-emerald-500/70'
                          : state === 'active'
                          ? 'text-stone-500 dark:text-stone-400'
                          : 'text-stone-300 dark:text-stone-600'
                      }`}
                    />
                    <span
                      className={`text-[13.5px] transition-colors duration-300 ${
                        state === 'completed'
                          ? 'text-stone-400 dark:text-stone-500'
                          : state === 'active'
                          ? 'text-stone-700 dark:text-stone-200 font-medium'
                          : 'text-stone-300 dark:text-stone-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready message + CTA */}
        <div
          className={`mt-8 text-center transition-all duration-700 ease-out ${
            showReady
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
              Your PRD is ready
            </span>
          </div>

          {isGenerated && !isGenerating && onContinueToExport ? (
            <div className="mt-5">
              <button
                onClick={onContinueToExport}
                disabled={isContinueLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-800 dark:bg-stone-700 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 dark:hover:bg-stone-600 transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {isContinueLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Continue to Export
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
              Switching to document view...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrdGenerationView;

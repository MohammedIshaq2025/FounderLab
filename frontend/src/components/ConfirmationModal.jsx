import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
}) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=backdrop, 2=card

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setPhase(1);
        setTimeout(() => setPhase(2), 60);
      });
    } else {
      setPhase(0);
    }
  }, [isOpen]);

  const animateOut = useCallback(() => {
    setPhase(1);
    setTimeout(() => {
      setPhase(0);
      onClose();
    }, 200);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onConfirm();
    animateOut();
  }, [onConfirm, animateOut]);

  if (!isOpen) return null;

  const isDestructive = variant === 'destructive';
  const resolvedIcon = icon !== undefined ? icon : isDestructive ? 'warning' : null;
  const IconComponent = resolvedIcon === 'trash' ? Trash2 : AlertTriangle;
  const accentColor = isDestructive ? '#EF4444' : '#E8613C';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={animateOut}>
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(12, 10, 9, 0.45)',
          backdropFilter: 'blur(8px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.2s ease-out',
        }}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
          transition: 'all 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.0)',
        }}
      >
        {/* Card body with layered border */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            boxShadow: `
              0 0 0 1px rgba(0,0,0,0.06),
              0 4px 16px rgba(0,0,0,0.08),
              0 16px 48px -8px rgba(0,0,0,0.12),
              0 32px 80px -16px rgba(0,0,0,0.08)
            `,
          }}
        >
          {/* Top section with icon + gradient wash */}
          <div
            className="relative pt-8 pb-6 px-8"
            style={{
              background: isDestructive
                ? 'linear-gradient(180deg, #FEF2F2 0%, #FFFFFF 100%)'
                : 'linear-gradient(180deg, #FFF7F5 0%, #FFFFFF 100%)',
            }}
          >
            {/* Dark mode overlay — sits on top of the gradient */}
            <div
              className="absolute inset-0 hidden dark:block"
              style={{
                background: isDestructive
                  ? 'linear-gradient(180deg, #1F1315 0%, #1C1917 100%)'
                  : 'linear-gradient(180deg, #1F1814 0%, #1C1917 100%)',
              }}
            />

            {/* Close */}
            <button
              onClick={animateOut}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-150 z-10"
            >
              <X className="w-4 h-4" strokeWidth={2.2} />
            </button>

            {/* Icon */}
            {resolvedIcon && (
              <div className="relative flex justify-center mb-5 z-[1]">
                {/* Animated pulse ring */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    animation: phase >= 2 ? 'confirmPulse 2s ease-out 0.3s' : 'none',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl"
                    style={{
                      border: `1.5px solid ${accentColor}`,
                      opacity: 0.12,
                    }}
                  />
                </div>

                {/* Icon box */}
                <div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: isDestructive
                      ? 'linear-gradient(135deg, #FEE2E2, #FECACA)'
                      : 'linear-gradient(135deg, #FDECE7, #FCD5CA)',
                    boxShadow: `0 2px 8px ${accentColor}15, 0 1px 2px ${accentColor}10`,
                  }}
                >
                  {/* Dark mode inner bg */}
                  <div
                    className="absolute inset-0 rounded-xl hidden dark:block"
                    style={{
                      background: isDestructive
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))'
                        : 'linear-gradient(135deg, rgba(232,97,60,0.15), rgba(232,97,60,0.08))',
                    }}
                  />
                  <IconComponent
                    className="relative z-[1]"
                    style={{ color: accentColor }}
                    size={20}
                    strokeWidth={2}
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <h3 className="relative z-[1] text-[17px] font-semibold text-stone-900 dark:text-stone-50 text-center tracking-[-0.01em]">
              {title}
            </h3>
          </div>

          {/* Message section */}
          <div className="px-8 pt-3 pb-7 bg-white dark:bg-stone-900">
            <div className="text-[14px] text-stone-500 dark:text-stone-400 text-center leading-[1.65] mb-7">
              {message}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={animateOut}
                className="btn-modal-secondary flex-1 h-10 rounded-xl text-[13px] font-semibold
                           bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300
                           hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`btn-modal-primary flex-1 h-10 rounded-xl text-[13px] font-semibold text-white ${
                  isDestructive ? 'btn-destructive' : ''
                }`}
                style={{
                  background: isDestructive
                    ? 'linear-gradient(180deg, #F87171 0%, #EF4444 100%)'
                    : 'linear-gradient(180deg, #F0845A 0%, #E8613C 100%)',
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes confirmPulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default ConfirmationModal;

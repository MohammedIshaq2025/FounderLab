import React from 'react';
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
  if (!isOpen) return null;

  const isDestructive = variant === 'destructive';
  const resolvedIcon = icon !== undefined ? icon : isDestructive ? 'warning' : null;

  const iconMap = {
    warning: (
      <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
    ),
    trash: (
      <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-5 h-5 text-red-500" />
      </div>
    ),
  };

  return (
    <div
      className="fixed inset-0 bg-stone-950/50 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-800 rounded-xl shadow-xl dark:shadow-2xl dark:shadow-black/30 max-w-md w-full p-6 animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {resolvedIcon && iconMap[resolvedIcon]}

        <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-100 mb-1.5 text-center">
          {title}
        </h3>

        <p className="text-[14px] text-stone-500 dark:text-stone-400 mb-6 text-center leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-stone-200 dark:border-stone-600 rounded-lg text-[13px] font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition ${
              isDestructive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-terra-500 text-white hover:bg-terra-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;

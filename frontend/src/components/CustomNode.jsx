import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position } from 'reactflow';
import { Database, Check, Pencil, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/* ═══════════════════════════════════════════════════════════════════
   EditableTitle — Title with edit icon on the right
   ═══════════════════════════════════════════════════════════════════ */
const EditableTitle = ({ value, onSave, nodeId, field, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setEditValue(value || '');
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e?.stopPropagation();
    const trimmed = editValue.trim();
    if (trimmed !== (value || '').trim() && trimmed !== '') {
      onSave(nodeId, field, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      handleSave(e);
    }
  };

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handleCancel();
    }
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, handleClickOutside]);

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="relative flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 bg-white border border-teal-400 rounded-md px-2 py-0.5',
            'text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-400/50',
            'text-[13px]'
          )}
        />
        <button
          onClick={handleSave}
          className="flex-shrink-0 w-5 h-5 rounded bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
          title="Save (Enter)"
        >
          <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
        </button>
        <button
          onClick={handleCancel}
          className="flex-shrink-0 w-5 h-5 rounded bg-stone-200 hover:bg-stone-300 flex items-center justify-center transition-colors"
          title="Cancel (Esc)"
        >
          <X className="w-3 h-3 text-stone-600" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center min-w-0 flex-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={cn('truncate min-w-0', className)}>
        {value}
      </span>

      {onSave && (
        <button
          onClick={handleEdit}
          className={cn(
            'ml-1.5 flex-shrink-0 w-5 h-5 rounded',
            'bg-white border border-stone-200 shadow-sm',
            'flex items-center justify-center',
            'hover:bg-stone-50 hover:border-stone-300',
            'transition-all duration-150',
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          )}
          title="Edit"
        >
          <Pencil className="w-2.5 h-2.5 text-stone-500" />
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EditableSubItem — Sub-item card with edit icon on TOP-RIGHT
   Multi-line editing with auto-resize textarea (no scrollbar)
   ═══════════════════════════════════════════════════════════════════ */
const EditableSubItem = ({ text, onSave, nodeId, field, className = '' }) => {
  const colonIdx = text.indexOf(':');
  const hasLabel = colonIdx > 0 && colonIdx < 40;
  const label = hasLabel ? text.slice(0, colonIdx) : null;
  const content = hasLabel ? text.slice(colonIdx + 1).trim() : text;

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setEditValue(content);
  }, [content, isEditing]);

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      autoResize();
    }
  }, [isEditing, autoResize]);

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e?.stopPropagation();
    const trimmed = editValue.trim();
    if (trimmed !== content.trim() && trimmed !== '') {
      const newValue = label ? `${label}: ${trimmed}` : trimmed;
      onSave(nodeId, field, newValue);
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave(e);
    }
    // Shift+Enter allows new line
  };

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handleCancel();
    }
  }, [content]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, handleClickOutside]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100',
        isEditing && 'border-teal-400 bg-white',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action buttons - TOP RIGHT (slightly inside the card) */}
      {onSave && (
        <div className={cn(
          'absolute top-1 right-1 z-10 flex items-center gap-0.5',
          'transition-all duration-150',
          (isHovered || isEditing) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        )}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="w-5 h-5 rounded bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-sm transition-colors"
                title="Save (Enter)"
              >
                <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCancel}
                className="w-5 h-5 rounded bg-stone-200 hover:bg-stone-300 flex items-center justify-center shadow-sm transition-colors"
                title="Cancel (Esc)"
              >
                <X className="w-3 h-3 text-stone-600" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="w-5 h-5 rounded bg-white border border-stone-200 shadow-sm flex items-center justify-center hover:bg-stone-50 hover:border-stone-300 transition-colors"
              title="Edit"
            >
              <Pencil className="w-2.5 h-2.5 text-stone-500" />
            </button>
          )}
        </div>
      )}

      {hasLabel && (
        <div className="text-[11.5px] font-semibold text-stone-700 leading-snug pr-14">
          {label}
        </div>
      )}

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          rows={1}
          className={cn(
            'w-full bg-transparent text-[11.5px] leading-relaxed focus:outline-none resize-none overflow-hidden',
            hasLabel ? 'text-stone-500 mt-0.5 pr-14' : 'text-stone-600 pr-14'
          )}
          placeholder="Enter text..."
        />
      ) : (
        <div className={cn('text-[11.5px] leading-relaxed whitespace-pre-wrap', hasLabel ? 'text-stone-500 mt-0.5' : 'text-stone-600')}>
          {content}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EditablePillar — Ideation pillar card with edit icon on TOP-RIGHT
   Multi-line editing with auto-resize textarea (no scrollbar)
   ═══════════════════════════════════════════════════════════════════ */
const EditablePillar = ({ label, value, onSave, nodeId, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setEditValue(value || '');
  }, [value, isEditing]);

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      autoResize();
    }
  }, [isEditing, autoResize]);

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e?.stopPropagation();
    const trimmed = editValue.trim();
    if (trimmed !== (value || '').trim()) {
      onSave(nodeId, field, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave(e);
    }
    // Shift+Enter allows new line
  };

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handleCancel();
    }
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, handleClickOutside]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-stone-50/80 rounded-lg px-3 py-2 border border-stone-100',
        isEditing && 'border-teal-400 bg-white'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action buttons - TOP RIGHT (slightly inside the card) */}
      {onSave && (
        <div className={cn(
          'absolute top-1 right-1 z-10 flex items-center gap-0.5',
          'transition-all duration-150',
          (isHovered || isEditing) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        )}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="w-5 h-5 rounded bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-sm transition-colors"
                title="Save (Enter)"
              >
                <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCancel}
                className="w-5 h-5 rounded bg-stone-200 hover:bg-stone-300 flex items-center justify-center shadow-sm transition-colors"
                title="Cancel (Esc)"
              >
                <X className="w-3 h-3 text-stone-600" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="w-5 h-5 rounded bg-white border border-stone-200 shadow-sm flex items-center justify-center hover:bg-stone-50 hover:border-stone-300 transition-colors"
              title="Edit"
            >
              <Pencil className="w-2.5 h-2.5 text-stone-500" />
            </button>
          )}
        </div>
      )}

      <div className="text-[11.5px] font-semibold text-stone-700 leading-snug pr-14">
        {label}
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          rows={1}
          className="w-full bg-transparent text-[11.5px] text-stone-500 leading-relaxed mt-0.5 focus:outline-none resize-none overflow-hidden pr-14"
          placeholder="—"
        />
      ) : (
        <div className="text-[11.5px] text-stone-500 leading-relaxed mt-0.5 whitespace-pre-wrap">
          {value || '—'}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EditableTechItem — Tech stack bullet item with edit icon on right
   In-place editing: text transforms directly
   ═══════════════════════════════════════════════════════════════════ */
const EditableTechItem = ({ value, onSave, nodeId, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setEditValue(value || '');
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e?.stopPropagation();
    const trimmed = editValue.trim();
    if (trimmed !== (value || '').trim() && trimmed !== '') {
      onSave(nodeId, field, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      handleSave(e);
    }
  };

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handleCancel();
    }
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, handleClickOutside]);

  return (
    <div
      ref={containerRef}
      className="relative text-[11.5px] text-stone-500 leading-relaxed flex items-center gap-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-stone-300 select-none">&bull;</span>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent text-[11.5px] text-stone-600 focus:outline-none border-b border-teal-400"
        />
      ) : (
        <span className="flex-1">{value}</span>
      )}

      {/* Action buttons - inline right */}
      {onSave && (
        <div className={cn(
          'flex items-center gap-0.5',
          'transition-all duration-150',
          (isHovered || isEditing) ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="w-4 h-4 rounded bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                title="Save (Enter)"
              >
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCancel}
                className="w-4 h-4 rounded bg-stone-200 hover:bg-stone-300 flex items-center justify-center transition-colors"
                title="Cancel (Esc)"
              >
                <X className="w-2.5 h-2.5 text-stone-600" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="w-4 h-4 rounded bg-white border border-stone-200 shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors"
              title="Edit"
            >
              <Pencil className="w-2 h-2 text-stone-500" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   AddSubFeatureModal — Lightweight popup for adding new sub-features
   Clean, minimal design with title + description fields
   ═══════════════════════════════════════════════════════════════════ */
const AddSubFeatureModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  // Handle click outside to close
  const handleClickOutside = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const trimmedDesc = description.trim();
    // Format: "Title: Description" or just "Title" if no description
    const subFeatureText = trimmedDesc
      ? `${trimmedTitle}: ${trimmedDesc}`
      : trimmedTitle;

    onSave(subFeatureText);
    onClose();
  };

  if (!isOpen) return null;

  // Use createPortal to render modal at document body level
  // This prevents ReactFlow's transform from affecting fixed positioning
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Backdrop with subtle blur */}
      <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[1px]" />

      {/* Modal card */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-xl shadow-2xl',
          'border border-stone-200/80',
          'w-[320px] overflow-hidden',
          'animate-in fade-in zoom-in-95 duration-150'
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Teal accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-teal-500 to-teal-400" />

        {/* Header */}
        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-500 flex items-center justify-center shadow-sm">
              <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-semibold text-stone-800 tracking-[-0.01em]">
              Add Sub-feature
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md hover:bg-stone-100 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* Form */}
        <div className="px-4 pb-4 space-y-3">
          {/* Title field */}
          <div>
            <label className="block text-[10.5px] font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., User Authentication"
              className={cn(
                'w-full px-3 py-2 rounded-lg text-[13px] text-stone-800',
                'bg-stone-50 border border-stone-200',
                'placeholder:text-stone-400',
                'focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400/30',
                'transition-all duration-150'
              )}
            />
          </div>

          {/* Description field */}
          <div>
            <label className="block text-[10.5px] font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
              Description <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this sub-feature..."
              rows={2}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-[13px] text-stone-800',
                'bg-stone-50 border border-stone-200',
                'placeholder:text-stone-400',
                'focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400/30',
                'resize-none transition-all duration-150'
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onClose}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-[12px] font-medium',
                'bg-stone-100 text-stone-600',
                'hover:bg-stone-200 transition-colors'
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-[12px] font-semibold',
                'flex items-center justify-center gap-1.5',
                'transition-all duration-150',
                title.trim()
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              )}
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

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

/* ─── Sub-item (read-only) ─── */
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
function IdeationNode({ data, id }) {
  const pillars = data.pillars || {};
  const onContentChange = data.onContentChange;

  return (
    <Card accentColor="#E8613C" typeLabel="Ideation" className="min-w-[268px] max-w-[320px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
      />

      <div className="px-3 pt-3.5 pb-3.5 space-y-1.5">
        {Object.entries(PILLAR_LABELS).map(([key, label]) => (
          <EditablePillar
            key={key}
            label={label}
            value={pillars[key]}
            onSave={onContentChange}
            nodeId={id}
            field={`pillars.${key}`}
          />
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
   2. FeatureGroupNode — teal accent
   Includes Plus button to add new sub-features
   ═══════════════════════════════════════════════════════════════════ */
function FeatureGroupNode({ data, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const subFeatures = data.subFeatures || [];
  const onContentChange = data.onContentChange;

  // Handle adding a new sub-feature
  const handleAddSubFeature = (newSubFeatureText) => {
    if (onContentChange) {
      // Add the new sub-feature to the array
      const updatedSubFeatures = [...subFeatures, newSubFeatureText];
      onContentChange(id, 'subFeatures', updatedSubFeatures);
    }
  };

  return (
    <>
      <Card accentColor="#0D9488" typeLabel="Feature" className="min-w-[228px] max-w-[284px]">
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />

        <div className="px-3 pt-3.5 pb-1.5 flex items-center gap-2 overflow-hidden">
          <EditableTitle
            value={data.label}
            onSave={onContentChange}
            nodeId={id}
            field="label"
            className="text-[13px] font-semibold text-stone-800 tracking-[-0.01em]"
          />

          {/* Add sub-feature button — teal filled with white Plus icon, always visible */}
          {onContentChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded',
                'bg-teal-500',
                'flex items-center justify-center',
                'hover:bg-teal-600',
                'transition-colors duration-150',
                'shadow-sm'
              )}
              title="Add sub-feature"
            >
              <Plus className="w-3 h-3 text-white" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {subFeatures.length > 0 && (
          <div className="px-3 pb-3.5 space-y-1.5">
            {subFeatures.map((sf, idx) => (
              <EditableSubItem
                key={idx}
                text={sf}
                onSave={onContentChange}
                nodeId={id}
                field={`subFeatures.${idx}`}
              />
            ))}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />
      </Card>

      {/* Add sub-feature modal */}
      <AddSubFeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSubFeature}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EditableFlowStep — Inline editing for user flow steps
   ═══════════════════════════════════════════════════════════════════ */
const EditableFlowStep = ({ value, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className="flex-1 flex items-center gap-1">
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Escape') onCancel();
          if (e.key === 'Enter') onSave(editValue.trim());
        }}
        onBlur={() => onSave(editValue.trim())}
        className="flex-1 text-[11.5px] bg-white border border-violet-400 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400/50"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   UserFlowNode — Purple accent, timeline view
   ═══════════════════════════════════════════════════════════════════ */
function UserFlowNode({ data, id }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const onContentChange = data.onContentChange;
  const MAX_STEPS = 6;

  // Normalize steps array - handle various formats AI might output
  const rawSteps = data.steps || data.subFeatures || [];
  const steps = rawSteps.map((step, idx) => {
    if (typeof step === 'string') {
      // AI might output steps as simple strings
      const isSystem = ['system', 'app', 'displays', 'shows', 'sends', 'updates', 'validates', 'filters', 'plays'].some(kw => step.toLowerCase().includes(kw));
      return { action: step, actor: isSystem ? 'system' : 'user' };
    }
    // Handle object format with potential field variations
    return {
      action: step.action || step.text || step.description || step.label || String(step),
      actor: step.actor || step.type || (idx % 2 === 0 ? 'user' : 'system')
    };
  });

  const getIcon = (actor, isLast) => {
    if (isLast) return '◉';
    return actor === 'user' ? '○' : '◆';
  };

  // Compressed view
  if (!isExpanded) {
    return (
      <Card accentColor="#7C3AED" typeLabel="USER FLOW" className="min-w-[180px] max-w-[220px]">
        <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white" />
        <div
          className="px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-stone-50"
          onClick={() => setIsExpanded(true)}
        >
          <span className="text-[12px] font-semibold text-stone-700">
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </Card>
    );
  }

  // Expanded view - timeline
  return (
    <Card accentColor="#7C3AED" typeLabel="USER FLOW" className="min-w-[240px] max-w-[320px]">
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white" />

      {/* Collapse header */}
      <div
        className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-stone-50 border-b border-stone-100"
        onClick={() => setIsExpanded(false)}
      >
        <span className="text-[12px] font-semibold text-stone-700">
          {steps.length} step{steps.length !== 1 ? 's' : ''}
        </span>
        <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
      </div>

      {/* Timeline steps */}
      <div className="px-3 py-2.5 space-y-2">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const isUser = step.actor === 'user';

          return (
            <div key={idx} className="relative">
              {!isLast && (
                <div className="absolute left-[7px] top-[16px] w-px h-[calc(100%+4px)] bg-violet-200" />
              )}
              <div className="flex items-start gap-2.5 group">
                <span className={cn(
                  'flex-shrink-0 text-[14px] relative z-10',
                  isUser ? 'text-violet-600' : 'text-violet-400',
                  isLast && 'text-violet-700'
                )}>
                  {getIcon(step.actor, isLast)}
                </span>

                {editingIdx === idx ? (
                  <EditableFlowStep
                    value={step.action}
                    onSave={(val) => {
                      const newSteps = [...steps];
                      newSteps[idx] = { ...step, action: val };
                      onContentChange(id, 'steps', newSteps);
                      setEditingIdx(null);
                    }}
                    onCancel={() => setEditingIdx(null)}
                  />
                ) : (
                  <div className="flex-1 flex items-center" onDoubleClick={() => onContentChange && setEditingIdx(idx)}>
                    <span className={cn(
                      'text-[11.5px] leading-relaxed flex-1',
                      isUser ? 'text-stone-700' : 'text-stone-500'
                    )}>
                      {step.action}
                    </span>
                    {onContentChange && steps.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSteps = steps.filter((_, i) => i !== idx);
                          onContentChange(id, 'steps', newSteps);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 w-4 h-4 rounded bg-white border border-stone-200 flex items-center justify-center hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="w-2 h-2 text-red-500" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {onContentChange && steps.length < MAX_STEPS && (
          <button
            onClick={() => {
              const lastActor = steps[steps.length - 1]?.actor || 'system';
              const newSteps = [...steps, { action: 'New step...', actor: lastActor === 'user' ? 'system' : 'user' }];
              onContentChange(id, 'steps', newSteps);
            }}
            className="flex items-center gap-1.5 text-[10.5px] text-violet-500 hover:text-violet-600 font-medium mt-1"
          >
            <Plus className="w-3 h-3" />
            Add step
          </button>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. ComplementaryFeaturesNode — teal accent
   Title is now editable, includes Plus button to add new features
   ═══════════════════════════════════════════════════════════════════ */
function ComplementaryFeaturesNode({ data, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const features = data.features || [];
  const onContentChange = data.onContentChange;

  // Handle adding a new feature
  const handleAddFeature = (newFeatureText) => {
    if (onContentChange) {
      const updatedFeatures = [...features, newFeatureText];
      onContentChange(id, 'features', updatedFeatures);
    }
  };

  return (
    <>
      <Card accentColor="#0D9488" typeLabel="Feature" className="min-w-[228px] max-w-[284px]">
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />

        <div className="px-3 pt-3.5 pb-1.5 flex items-center gap-2 overflow-hidden">
          <EditableTitle
            value={data.label}
            onSave={onContentChange}
            nodeId={id}
            field="label"
            className="text-[13px] font-semibold text-stone-800 tracking-[-0.01em]"
          />

          {/* Add feature button — teal filled with white Plus icon, always visible */}
          {onContentChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded',
                'bg-teal-500',
                'flex items-center justify-center',
                'hover:bg-teal-600',
                'transition-colors duration-150',
                'shadow-sm'
              )}
              title="Add feature"
            >
              <Plus className="w-3 h-3 text-white" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Only render features container if there are features */}
        {features.length > 0 && (
          <div className="px-3 pb-3.5 space-y-1.5">
            {features.map((f, idx) => (
              <EditableSubItem
                key={idx}
                text={f}
                onSave={onContentChange}
                nodeId={id}
                field={`features.${idx}`}
              />
            ))}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2 !h-2 !border-2 !border-stone-300 !bg-white"
        />
      </Card>

      {/* Add feature modal */}
      <AddSubFeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddFeature}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. UIDesignNode — rose accent (not editable)
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

        {/* Design Guidelines */}
        {(data.designGuidelines || []).map((g, idx) => (
          <SubItem key={idx} text={g} />
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. SystemMapNode — indigo accent
   Section headers are now editable
   ═══════════════════════════════════════════════════════════════════ */
function SystemMapNode({ data, id }) {
  const onContentChange = data.onContentChange;
  const sections = [
    { key: 'frontend', label: data.frontendLabel || 'Frontend' },
    { key: 'backend', label: data.backendLabel || 'Backend' },
    { key: 'database', label: data.databaseLabel || 'Database' },
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
              <div className="mb-1">
                <EditableTitle
                  value={label}
                  onSave={onContentChange}
                  nodeId={id}
                  field={`${key}Label`}
                  className="text-[11.5px] font-semibold text-stone-700 leading-snug"
                />
              </div>
              <div className="space-y-0.5">
                {items.map((item, idx) => (
                  <EditableTechItem
                    key={idx}
                    value={item}
                    onSave={onContentChange}
                    nodeId={id}
                    field={`${key}.${idx}`}
                  />
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
function CustomNode({ data, type, id }) {
  if (type === 'ideation') return <IdeationNode data={data} id={id} />;
  if (type === 'featureGroup') return <FeatureGroupNode data={data} id={id} />;
  if (type === 'userFlow') return <UserFlowNode data={data} id={id} />;
  if (type === 'complementaryFeatures') return <ComplementaryFeaturesNode data={data} id={id} />;
  if (type === 'uiDesign') return <UIDesignNode data={data} id={id} />;
  if (type === 'systemMap') return <SystemMapNode data={data} id={id} />;

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

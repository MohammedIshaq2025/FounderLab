import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, ArrowRight, Loader2, User, Check, Plus, Sun, Moon, Globe, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Custom AI Icon component with burgundy theme
function AIIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M15.39 20.9301L14.12 20.5901C13.34 20.3701 12.81 19.6701 12.81 18.8501C12.81 18.0301 13.34 17.3201 14.16 17.0901L15.39 16.7701C16.01 16.6001 16.46 16.1401 16.63 15.5401L16.96 14.3201L17.03 14.0901C17.3 13.4001 17.94 12.9201 18.69 12.9201C19.46 12.9201 20.12 13.3601 20.38 14.0501L20.79 15.5101C20.86 15.7501 20.97 15.9501 21.12 16.1301C21.46 15.3601 21.72 14.5601 21.87 13.6901C22.99 6.85011 17.16 1.02011 10.32 2.14011C6.16003 2.82011 2.81003 6.17011 2.14003 10.3201C1.79003 12.4801 2.13003 14.5301 2.97003 16.3001C3.11003 16.6001 3.18003 17.1101 3.10003 17.4401L2.42003 20.2801C2.19003 21.2301 2.77003 21.8101 3.72003 21.5801C4.71003 21.3501 5.88003 21.0601 6.57003 20.9001C6.90003 20.8201 7.40003 20.8901 7.70003 21.0301C9.55003 21.9101 11.71 22.2401 13.96 21.8101C14.65 21.6801 15.3 21.4601 15.93 21.2001C15.77 21.0801 15.59 20.9901 15.39 20.9301ZM13.39 6.31011C13.54 5.93011 13.98 5.74011 14.36 5.88011C16.11 6.56011 17.48 7.95011 18.14 9.70011C18.29 10.0901 18.09 10.5201 17.7 10.6601C17.62 10.7001 17.53 10.7101 17.44 10.7101C17.13 10.7101 16.85 10.5301 16.74 10.2301C16.23 8.88011 15.17 7.80011 13.82 7.28011C13.44 7.13011 13.25 6.70011 13.39 6.31011Z" />
      <path d="M23.21 18.8801C23.21 18.9701 23.16 19.1701 22.92 19.2501L21.65 19.6001C20.56 19.9001 19.74 20.7201 19.44 21.8101L19.1 23.0501C19.02 23.3301 18.8 23.3601 18.7 23.3601C18.6 23.3601 18.38 23.3301 18.3 23.0501L17.96 21.8001C17.66 20.7201 16.83 19.9001 15.75 19.6001L14.5 19.2601C14.23 19.1801 14.2 18.9501 14.2 18.8601C14.2 18.7601 14.23 18.5301 14.5 18.4501L15.76 18.1201C16.84 17.8101 17.66 16.9901 17.96 15.9101L18.32 14.6001C18.41 14.3801 18.61 14.3501 18.7 14.3501C18.79 14.3501 19 14.3801 19.08 14.5801L19.44 15.9001C19.74 16.9801 20.57 17.8001 21.65 18.1101L22.94 18.4601C23.2 18.5601 23.21 18.8001 23.21 18.8801Z" />
    </svg>
  );
}

// === Interactive Message Components for Phase 3 ===
// Elegant, minimal, luxury-feel interactive cards

function MultiSelectCard({ metadata, onSubmit, isActive }) {
  const [selected, setSelected] = useState(new Set());
  const [customText, setCustomText] = useState('');
  const [submitted, setSubmitted] = useState(!isActive);

  const toggleOption = (id) => {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (!metadata.max_selections || next.size < metadata.max_selections) next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    const selections = metadata.options
      .filter(o => selected.has(o.id))
      .map(o => o.description ? `${o.label}: ${o.description}` : o.label);
    if (customText.trim()) {
      selections.push(`Custom: ${customText.trim()}`);
    }
    if (selections.length < (metadata.min_selections || 1)) return;
    setSubmitted(true);
    onSubmit({ step: metadata.step, selections });
  };

  if (submitted && !isActive) {
    const chosen = metadata.options.filter(o => selected.has(o.id)).map(o => o.label);
    return (
      <div className="flex items-baseline gap-2 pl-1 py-1">
        <span className="text-[11px] uppercase tracking-[0.08em] text-stone-400 font-medium flex-shrink-0">{metadata.title}</span>
        <span className="text-[12px] text-stone-600 dark:text-stone-400">{chosen.join(' · ')}</span>
      </div>
    );
  }

  return (
    <div className="pl-1">
      {/* Step header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-6 h-6 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
          <AIIcon className="w-3 h-3" color="white" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.1em] text-stone-400 font-medium">
          Step {metadata.step} of 4
        </span>
      </div>

      {/* Card */}
      <div className="ml-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-1">
          <h3 className="text-[15px] font-semibold text-stone-800 dark:text-stone-100 tracking-[-0.01em]">{metadata.title}</h3>
          <p className="text-[12px] text-stone-400 dark:text-stone-500 mt-1 leading-relaxed">{metadata.description}</p>
        </div>

        {/* Options */}
        <div className="px-3 pt-3 pb-1.5 space-y-1">
          {metadata.options.map(option => {
            const isSelected = selected.has(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border-2 ${
                  isSelected
                    ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-800/20'
                    : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-[18px] h-[18px] mt-[2px] rounded-[5px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-stone-800 dark:bg-stone-300 border-stone-800 dark:border-stone-300'
                      : 'border-stone-300 dark:border-stone-600'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white dark:text-stone-800" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[13px] font-medium leading-tight ${isSelected ? 'text-stone-800 dark:text-stone-100' : 'text-stone-700 dark:text-stone-300'}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400 dark:text-stone-500'}`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        {metadata.allow_custom && (
          <div className="mx-5 mt-1 mb-1 pt-3 border-t border-stone-100 dark:border-stone-800">
            <input
              type="text"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder={metadata.custom_placeholder || 'Add your own...'}
              disabled={submitted}
              className="w-full px-0 py-1 text-[12px] text-stone-700 dark:text-stone-300 placeholder:text-stone-300 dark:placeholder:text-stone-600 bg-transparent border-none outline-none"
            />
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <div className="px-5 pt-3 pb-5">
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0 && !customText.trim()}
              className="w-full py-2.5 bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 dark:hover:bg-stone-600 text-white text-[13px] font-medium rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SingleSelectCard({ metadata, onSubmit, isActive }) {
  const [selected, setSelected] = useState(null);
  const [customText, setCustomText] = useState('');
  const [submitted, setSubmitted] = useState(!isActive);

  const handleSelect = (id) => {
    if (submitted) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    let selection;
    if (selected === 'custom') {
      selection = customText.trim();
    } else {
      const opt = metadata.options.find(o => o.id === selected);
      selection = opt ? opt.label : selected;
    }
    if (!selection) return;
    setSubmitted(true);
    onSubmit({ step: metadata.step, selection });
  };

  if (submitted && !isActive) {
    const chosen = selected === 'custom'
      ? customText.trim()
      : metadata.options.find(o => o.id === selected)?.label || '';
    return (
      <div className="flex items-baseline gap-2 pl-1 py-1">
        <span className="text-[11px] uppercase tracking-[0.08em] text-stone-400 font-medium flex-shrink-0">{metadata.title}</span>
        <span className="text-[12px] text-stone-600 dark:text-stone-400">{chosen}</span>
      </div>
    );
  }

  const isThemeStep = metadata.step === 2;

  return (
    <div className="pl-1">
      {/* Step header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-6 h-6 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
          <AIIcon className="w-3 h-3" color="white" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.1em] text-stone-400 font-medium">
          Step {metadata.step} of 4
        </span>
      </div>

      {/* Card */}
      <div className="ml-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-1">
          <h3 className="text-[15px] font-semibold text-stone-800 dark:text-stone-100 tracking-[-0.01em]">{metadata.title}</h3>
          <p className="text-[12px] text-stone-400 dark:text-stone-500 mt-1 leading-relaxed">{metadata.description}</p>
        </div>

        {/* Options */}
        <div className={`px-3 pt-3 pb-1.5 ${isThemeStep ? 'flex gap-2' : 'space-y-1'}`}>
          {metadata.options.map(option => {
            const isSelected = selected === option.id;
            const isLight = option.label.toLowerCase() === 'light';

            if (isThemeStep) {
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={submitted}
                  className={`flex-1 text-center px-4 py-4 rounded-xl transition-all duration-150 border-2 ${
                    isSelected
                      ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-800/20'
                      : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {isLight
                      ? <Sun className={`w-5 h-5 ${isSelected ? 'text-amber-500' : 'text-amber-500'}`} />
                      : <Moon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-indigo-400'}`} />}
                    <span className={`text-[13px] font-medium ${isSelected ? 'text-stone-800 dark:text-stone-100' : 'text-stone-700 dark:text-stone-300'}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <p className={`text-[10px] leading-snug ${isSelected ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400 dark:text-stone-500'}`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border-2 ${
                  isSelected
                    ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-800/20'
                    : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-[18px] h-[18px] mt-[2px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-stone-800 dark:border-stone-300'
                      : 'border-stone-300 dark:border-stone-600'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-stone-800 dark:bg-stone-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[13px] font-medium ${isSelected ? 'text-stone-800 dark:text-stone-100' : 'text-stone-700 dark:text-stone-300'}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400 dark:text-stone-500'}`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom option */}
        {metadata.allow_custom && (
          <div className="px-3 pb-1.5">
            <button
              onClick={() => handleSelect('custom')}
              disabled={submitted}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border-2 ${
                selected === 'custom'
                  ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-800/20'
                  : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Plus className={`w-4 h-4 ${selected === 'custom' ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'}`} />
                <span className={`text-[13px] font-medium ${selected === 'custom' ? 'text-stone-800 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'}`}>
                  Custom
                </span>
              </div>
            </button>
            {selected === 'custom' && (
              <div className="mt-2 mx-3 mb-1 px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <input
                  type="text"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder={metadata.custom_placeholder || 'Type here...'}
                  disabled={submitted}
                  className="w-full px-0 py-0.5 text-[12px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 bg-transparent border-none outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <div className="px-5 pt-3 pb-5">
            <button
              onClick={handleSubmit}
              disabled={!selected || (selected === 'custom' && !customText.trim())}
              className="w-full py-2.5 bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 dark:hover:bg-stone-600 text-white text-[13px] font-medium rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ColorPaletteCard({ metadata, onSubmit, isActive }) {
  const [selected, setSelected] = useState(null);
  const [customColors, setCustomColors] = useState('');
  const [submitted, setSubmitted] = useState(!isActive);

  const handleSelect = (id) => {
    if (submitted) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    let selection;
    if (selected === 'custom') {
      const colors = customColors.split(',').map(c => c.trim()).filter(c => /^#[0-9a-fA-F]{6}$/.test(c));
      if (colors.length < 4) return;
      selection = { name: 'Custom', colors: colors.slice(0, 4) };
    } else {
      const opt = metadata.options.find(o => o.id === selected);
      if (!opt) return;
      selection = { name: opt.label, colors: opt.colors };
    }
    setSubmitted(true);
    onSubmit({ step: metadata.step, selection });
  };

  if (submitted && !isActive) {
    const chosen = selected === 'custom'
      ? { name: 'Custom', colors: customColors.split(',').map(c => c.trim()).filter(c => /^#[0-9a-fA-F]{6}$/.test(c)).slice(0, 4) }
      : metadata.options.find(o => o.id === selected);
    return (
      <div className="flex items-center gap-2 pl-1 py-1">
        <span className="text-[11px] uppercase tracking-[0.08em] text-stone-400 font-medium flex-shrink-0">{metadata.title}</span>
        <span className="text-[12px] text-stone-600 dark:text-stone-400">{chosen?.name || chosen?.label}</span>
        <div className="flex">
          {(chosen?.colors || []).map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full -ml-0.5 first:ml-0 ring-1 ring-white dark:ring-stone-950"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pl-1">
      {/* Step header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-6 h-6 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
          <AIIcon className="w-3 h-3" color="white" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.1em] text-stone-400 font-medium">
          Step {metadata.step} of 4
        </span>
      </div>

      {/* Card */}
      <div className="ml-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-1">
          <h3 className="text-[15px] font-semibold text-stone-800 dark:text-stone-100 tracking-[-0.01em]">{metadata.title}</h3>
          <p className="text-[12px] text-stone-400 dark:text-stone-500 mt-1 leading-relaxed">{metadata.description}</p>
        </div>

        {/* Palette options */}
        <div className="px-3 pt-3 pb-1.5 space-y-1">
          {metadata.options.map(option => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border-2 ${
                  isSelected
                    ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-800/20'
                    : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] font-medium ${isSelected ? 'text-stone-800 dark:text-stone-100' : 'text-stone-700 dark:text-stone-300'}`}>
                      {option.label}
                    </div>
                    {option.description && (
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? 'text-stone-500 dark:text-stone-400' : 'text-stone-400 dark:text-stone-500'}`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                  {/* Color swatches — overlapping circles */}
                  <div className="flex flex-shrink-0">
                    {(option.colors || []).map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full -ml-1.5 first:ml-0 ring-2"
                        style={{
                          backgroundColor: color,
                          '--tw-ring-color': isSelected ? '#e7e5e4' : '#fff',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom option */}
        {metadata.allow_custom && (
          <div className="px-3 pb-1.5">
            <button
              onClick={() => handleSelect('custom')}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 border-2 ${
                selected === 'custom'
                  ? 'border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-800/20'
                  : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Plus className={`w-4 h-4 ${selected === 'custom' ? 'text-stone-800 dark:text-stone-200' : 'text-stone-400'}`} />
                <span className={`text-[13px] font-medium ${selected === 'custom' ? 'text-stone-800 dark:text-stone-200' : 'text-stone-500 dark:text-stone-400'}`}>
                  Custom palette
                </span>
              </div>
            </button>
            {selected === 'custom' && (
              <div className="mx-4 mt-1 mb-1">
                <input
                  type="text"
                  value={customColors}
                  onChange={e => setCustomColors(e.target.value)}
                  placeholder={metadata.custom_placeholder || '#hex1, #hex2, #hex3, #hex4'}
                  disabled={submitted}
                  className="w-full px-0 py-1.5 text-[12px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 bg-transparent border-none outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <div className="px-5 pt-3 pb-5">
            <button
              onClick={handleSubmit}
              disabled={!selected || (selected === 'custom' && customColors.split(',').map(c => c.trim()).filter(c => /^#[0-9a-fA-F]{6}$/.test(c)).length < 4)}
              className="w-full py-2.5 bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 dark:hover:bg-stone-600 text-white text-[13px] font-medium rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InteractiveMessage({ message, onSubmit, isLastMessage }) {
  const { message_type, metadata } = message;
  const isActive = isLastMessage;

  switch (message_type) {
    case 'multi_select':
      return <MultiSelectCard metadata={metadata} onSubmit={onSubmit} isActive={isActive} />;
    case 'single_select':
      return <SingleSelectCard metadata={metadata} onSubmit={onSubmit} isActive={isActive} />;
    case 'color_palette':
      return <ColorPaletteCard metadata={metadata} onSubmit={onSubmit} isActive={isActive} />;
    default:
      return null;
  }
}

function ChatInterface({ messages, onSendMessage, onSendStepData, phase, isReadOnly, isPrdGenerating, showContinueButton, onContinue, isContinueLoading, continueLabel, isStepLoading, isWebSearching, isGeneratingFeatures, onDownloadAction }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const processedActionsRef = useRef(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect and handle download action markers in AI messages
  useEffect(() => {
    if (!onDownloadAction || !messages.length) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant' || !lastMessage.content) return;

    // Create a unique key for this message to avoid duplicate processing
    const msgKey = `${lastMessage.id || lastMessage.created_at}-${lastMessage.content.slice(0, 50)}`;
    if (processedActionsRef.current.has(msgKey)) return;

    const content = lastMessage.content;
    const hasMdAction = content.includes('[ACTION:DOWNLOAD_MD]');
    const hasPdfAction = content.includes('[ACTION:DOWNLOAD_PDF]');

    if (hasMdAction || hasPdfAction) {
      processedActionsRef.current.add(msgKey);
      if (hasMdAction) onDownloadAction('md');
      if (hasPdfAction) onDownloadAction('pdf');
    }
  }, [messages, onDownloadAction]);

  // Auto-focus textarea after loading completes
  useEffect(() => {
    if (!isLoading && !isReadOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading, isReadOnly]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, 150);
    el.style.height = newHeight + 'px';
    el.style.overflowY = el.scrollHeight > 150 ? 'auto' : 'hidden';
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isReadOnly) return;

    const message = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-950">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <AIIcon className="w-5 h-5" color="#842F36" />
              </div>
              <p className="text-[13px] text-stone-400">Start the conversation...</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const messageType = message.message_type || 'text';
          const isLastMessage = index === messages.length - 1;

          // Interactive messages render as full-width cards (not bubbles)
          if (!isUser && messageType !== 'text' && message.metadata) {
            return (
              <InteractiveMessage
                key={index}
                message={message}
                onSubmit={(stepData) => onSendStepData && onSendStepData(stepData)}
                isLastMessage={isLastMessage}
              />
            );
          }

          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {!isUser && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center mt-0.5">
                  <AIIcon className="w-3.5 h-3.5" color="white" />
                </div>
              )}
              {isUser && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center mt-0.5">
                  <User className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isUser
                    ? 'bg-stone-800 dark:bg-stone-700 text-stone-100'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="text-[13px] leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="my-1.5" {...props} />,
                      strong: ({ node, ...props }) => (
                        <strong
                          className={`font-semibold ${
                            isUser ? 'text-white' : 'text-stone-900 dark:text-stone-100'
                          }`}
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-4 my-1.5" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-4 my-1.5" {...props} />
                      ),
                      li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                    }}
                  >
                    {message.content.replace(/\[ACTION:DOWNLOAD_(MD|PDF)\]/g, '').trim()}
                  </ReactMarkdown>
                </div>
                <div
                  className={`text-[11px] mt-2 ${
                    isUser ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {(isLoading || isStepLoading) && (
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center">
              <AIIcon className="w-3.5 h-3.5" color="white" />
            </div>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                {isWebSearching ? (
                  <>
                    <Globe className="w-3.5 h-3.5 animate-pulse text-teal-500" />
                    <span className="text-[13px] text-stone-400">Searching the web...</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-400" />
                    <span className="text-[13px] text-stone-400">Thinking...</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {isPrdGenerating && (
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center">
              <AIIcon className="w-3.5 h-3.5" color="white" />
            </div>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                <span className="text-[13px] text-stone-400">Generating your PRD...</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">This usually takes about a minute</p>
            </div>
          </div>
        )}

        {isGeneratingFeatures && (
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-800 dark:bg-stone-700 flex items-center justify-center">
              <AIIcon className="w-3.5 h-3.5" color="white" />
            </div>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" />
                <span className="text-[13px] text-stone-400">Generating complementary feature suggestions...</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">Please wait a moment</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Continue Button (shown above input when ideation is complete) */}
      {showContinueButton && !isReadOnly && (
        <div className="px-4 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <button
            onClick={onContinue}
            disabled={isContinueLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-terra-500 hover:bg-terra-600 text-white text-[13px] font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isContinueLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Advancing...
              </>
            ) : (
              <>
                {continueLabel || 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Input Area */}
      {isReadOnly ? (
        <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3">
          <div className="text-center text-[12px] text-stone-400">
            {phase === 4
              ? (isPrdGenerating ? 'PRD generation in progress...' : 'PRD generated — view in Documents tab')
              : 'Read-only — viewing past phase'}
          </div>
        </div>
      ) : (
        <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
              className="flex-1 px-3.5 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-stone-300 dark:focus:border-stone-600 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-hidden text-[13px] leading-relaxed text-stone-800 dark:text-stone-200 placeholder:text-stone-400 bg-stone-50 dark:bg-stone-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-stone-800 dark:bg-stone-700 text-white rounded-xl hover:bg-stone-700 dark:hover:bg-stone-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              title="Send"
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, FileText, Loader2, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

function DocumentPreview({ content, document, loading, onExport, showExportPulse = true }) {
  const downloadDocument = (filePath) => {
    window.open(`${API_URL}/api/documents/download/${encodeURIComponent(filePath)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-stone-900">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-stone-900">
      {/* Sticky header */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-terra-500" />
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Product Requirements Document
          </span>
        </div>
        <div className="flex gap-2">
          {onExport && (
            <button
              onClick={onExport}
              className={`
                relative px-4 py-1.5 text-xs rounded-lg flex items-center gap-1.5 font-semibold
                bg-[#8D323A] text-white
                hover:bg-[#722830] hover:shadow-lg hover:shadow-[#8D323A]/20
                transition-all duration-300 ease-out
                active:scale-[0.97]
                ${showExportPulse ? 'export-pulse' : ''}
              `}
            >
              Export
              <ArrowRight className="w-3 h-3" />
              {showExportPulse && (
                <span className="absolute inset-0 rounded-lg animate-ping-slow bg-[#8D323A]/30 pointer-events-none" />
              )}
            </button>
          )}
          {document?.pdf_path && (
            <button
              onClick={() => downloadDocument(document.pdf_path)}
              className="px-3 py-1.5 text-xs bg-terra-500 text-white rounded-lg hover:bg-terra-600 transition flex items-center gap-1.5 font-medium"
            >
              <Download className="w-3 h-3" />
              PDF
            </button>
          )}
        </div>
      </div>

      {/* Markdown content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <article className="max-w-none text-[13.5px] leading-relaxed text-stone-700 dark:text-stone-300">
          <ReactMarkdown
            components={{
              h1: ({ children, ...props }) => (
                <h1
                  className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-0 mb-4 pb-3 border-b border-stone-200 dark:border-stone-800"
                  {...props}
                >
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2
                  className="text-[16px] font-bold text-stone-800 dark:text-stone-200 tracking-tight mt-8 mb-3"
                  {...props}
                >
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3
                  className="text-[14.5px] font-semibold text-stone-800 dark:text-stone-200 mt-6 mb-2"
                  {...props}
                >
                  {children}
                </h3>
              ),
              h4: ({ children, ...props }) => (
                <h4
                  className="text-[13.5px] font-semibold text-stone-700 dark:text-stone-300 mt-4 mb-1.5"
                  {...props}
                >
                  {children}
                </h4>
              ),
              p: ({ children, ...props }) => (
                <p className="my-2.5 text-stone-600 dark:text-stone-400 leading-relaxed" {...props}>
                  {children}
                </p>
              ),
              strong: ({ children, ...props }) => (
                <strong className="font-semibold text-stone-800 dark:text-stone-200" {...props}>
                  {children}
                </strong>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc pl-5 my-2.5 space-y-1.5" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal pl-5 my-2.5 space-y-1.5" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="text-stone-600 dark:text-stone-400 leading-relaxed pl-1" {...props}>
                  {children}
                </li>
              ),
              hr: (props) => (
                <hr className="my-6 border-stone-200 dark:border-stone-800" {...props} />
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className="border-l-[3px] border-terra-400 pl-4 my-3 text-stone-500 dark:text-stone-400 italic"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }) => {
                // Block code has className (e.g. "language-xxx"), inline code does not
                if (className) {
                  return (
                    <code
                      className="block text-[12.5px] font-mono text-stone-700 dark:text-stone-300"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code
                    className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[12.5px] font-mono text-terra-600 dark:text-terra-400"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children, ...props }) => (
                <pre
                  className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 my-3 overflow-x-auto"
                  {...props}
                >
                  {children}
                </pre>
              ),
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto my-3">
                  <table className="min-w-full text-[13px]" {...props}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children, ...props }) => (
                <th
                  className="px-3 py-2 text-left font-semibold text-stone-800 dark:text-stone-200 border-b-2 border-stone-200 dark:border-stone-700"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td
                  className="px-3 py-2 text-stone-600 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800"
                  {...props}
                >
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

export default DocumentPreview;
